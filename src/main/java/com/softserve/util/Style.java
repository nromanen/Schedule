package com.softserve.util;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Element;
import com.itextpdf.text.pdf.PdfPCell;

public class Style {
    /**
     * The method used for formatting header cells of schedule
     *
     * @param cell for formatting
     */
    public void headerCellStyle(PdfPCell cell) {

        // alignment
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        // padding
        cell.setPaddingTop(0f);
        cell.setPaddingBottom(7f);

        // background color
        cell.setBackgroundColor(new BaseColor(0, 121, 182));

        // border
        cell.setBorder(0);
        cell.setBorderWidthBottom(2f);
    }

    /**
     * The method used for formatting label cells of schedule
     *
     * @param cell for formatting
     */
    public void labelCellStyle(PdfPCell cell) {
        // alignment
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);

        // padding
        cell.setPaddingLeft(3f);
        cell.setPaddingTop(0f);

        // background color
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);

        // height
        cell.setMinimumHeight(18f);
    }

    /**
     * The method used for formatting value cells of schedule
     *
     * @param cell for formatting
     */
    public void valueCellStyle(PdfPCell cell) {
        // alignment
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);

        // padding
        cell.setPaddingTop(0f);
        cell.setPaddingBottom(5f);

        // height
        cell.setMinimumHeight(18f);
    }
}
