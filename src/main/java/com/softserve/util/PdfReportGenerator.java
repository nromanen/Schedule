package com.softserve.util;

import com.softserve.dto.ScheduleForGroupDTO;
import com.softserve.dto.ScheduleForTeacherDTO;
import com.softserve.exception.FileDownloadException;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.helper.W3CDom;
import org.jsoup.nodes.Document;
import org.openpdf.text.pdf.BaseFont;
import org.xhtmlrenderer.pdf.ITextFontResolver;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;

/**
 * Generates PDF schedule reports by rendering HTML templates via Flying Saucer + OpenPDF.
 *
 * <p>Cyrillic support: a .ttf font is registered with Identity-H encoding
 * so that Ukrainian characters render correctly in the PDF.</p>
 *
 * <p>Dependencies (build.gradle):</p>
 * <pre>
 * implementation 'org.xhtmlrenderer:flying-saucer-pdf:10.0.6'
 * implementation 'org.jsoup:jsoup:1.18.3'
 * </pre>
 */
@Slf4j
public class PdfReportGenerator {

    /**
     * Path to a .ttf font inside src/main/resources/font/.
     * The font must support Cyrillic glyphs (e.g., DejaVuSans, Roboto, Open Sans, Noto Sans).
     *
     * Adjust this path to match the actual font file in your project.
     */
    private static final String FONT_RESOURCE_PATH = "/font/LiberationSans-Regular.ttf";
    private static final String FONT_BOLD_RESOURCE_PATH = "/font/LiberationSans-Bold.ttf";

    public ByteArrayOutputStream teacherScheduleReport(ScheduleForTeacherDTO schedule, Locale language) {
        log.info("Generating teacher schedule PDF for: {}", schedule);
        String html = new TeacherHtmlBuilder().buildHtml(schedule, language);
        return renderHtmlToPdf(html);
    }

    public ByteArrayOutputStream groupScheduleReport(ScheduleForGroupDTO schedule, Locale language) {
        log.info("Generating group schedule PDF for: {}", schedule);
        String html = new GroupHtmlBuilder().buildHtml(schedule, language);
        return renderHtmlToPdf(html);
    }

    /**
     * Converts an HTML string into a PDF byte array.
     * Registers Cyrillic-capable fonts with Identity-H encoding.
     *
     * @param html the HTML string to render
     * @return byte array output stream containing the PDF
     */
    private ByteArrayOutputStream renderHtmlToPdf(String html) {
        try {
            // 1. Parse HTML → well-formed XHTML
            Document jsoupDoc = Jsoup.parse(html);
            jsoupDoc.outputSettings()
                    .syntax(Document.OutputSettings.Syntax.xml)
                    .charset("UTF-8");

            org.w3c.dom.Document w3cDoc = new W3CDom().fromJsoup(jsoupDoc);

            // 2. Set up renderer with Cyrillic fonts
            ITextRenderer renderer = new ITextRenderer();
            registerFonts(renderer);

            // 3. Render to PDF
            renderer.setDocument(w3cDoc, null);
            renderer.layout();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            renderer.createPDF(outputStream);
            return outputStream;

        } catch (Exception e) {
            log.error("Failed to generate PDF from HTML: {}", e.getMessage(), e);
            throw new FileDownloadException("Failed to download file");
        }
    }

    /**
     * Registers .ttf fonts from classpath resources with Identity-H encoding
     * for proper Cyrillic/Unicode rendering.
     *
     * @param renderer the Flying Saucer renderer to register fonts with
     * @throws Exception if font files cannot be read or registered
     */
    private void registerFonts(ITextRenderer renderer) throws Exception {
        ITextFontResolver resolver = renderer.getFontResolver();

        // Register each font — copy from classpath to a temp file
        // because FontResolver needs a file path, not an InputStream.
        registerFont(resolver, FONT_RESOURCE_PATH);
        registerFont(resolver, FONT_BOLD_RESOURCE_PATH);
    }

    private void registerFont(ITextFontResolver resolver, String resourcePath) throws Exception {
        try (InputStream is = getClass().getResourceAsStream(resourcePath)) {
            if (is == null) {
                log.warn("Font not found in classpath: {}. Skipping.", resourcePath);
                return;
            }
            // Copy to temp file — FontResolver requires a file path
            Path tempFont = Files.createTempFile("pdf-font-", ".ttf");
            Files.copy(is, tempFont, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            tempFont.toFile().deleteOnExit();

            resolver.addFont(
                    tempFont.toAbsolutePath().toString(),
                    BaseFont.IDENTITY_H,
                    BaseFont.EMBEDDED
            );
            log.debug("Registered font: {}", resourcePath);
        }
    }
}
