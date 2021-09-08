package com.softserve.util;

import com.opencsv.bean.CsvToBeanBuilder;
import com.softserve.entity.Student;
import com.softserve.exception.ParseFileException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Slf4j
public class AsyncTasks {

    public static List<Student> getStudentsFromFile(MultipartFile file) {

        List<Student> students = new ArrayList<>();
        try {
            students = csvFileParser(file).get();
        } catch (InterruptedException e) {
            log.error("Error occurred while parsing file",  e);
            Thread.currentThread().interrupt();
        } catch (ExecutionException e) {
            log.error("Error occurred while parsing file",  e);
        }
        return students;
    }

    private static CompletableFuture<List<Student>> csvFileParser(MultipartFile file) {
        return CompletableFuture.supplyAsync(() -> {
            String fileName = String.join("", "students_",
                    String.valueOf(LocalDateTime.now().getNano()), ".csv");

            File csvFile = new File(fileName);

            List<Student> students = new ArrayList<>();
            try {
                file.transferTo(csvFile);

                try (Reader reader = new FileReader(csvFile, StandardCharsets.UTF_8)) {
                    students = new CsvToBeanBuilder<Student>(reader)
                            .withType(Student.class)
                            .build().parse();
                }
                fileDelete(csvFile);
            } catch (RuntimeException e) {
                log.error("Error occurred while parsing file {}", csvFile.getName(), e);
                fileDelete(csvFile);
                throw new ParseFileException("Bad file format");
            } catch (IOException e) {
                log.error("Error occurred while accessing to file {}", csvFile.getName(), e);
                fileDelete(csvFile);
            }
            return students;
        });
    }

    private static void fileDelete(File file) {
        try {
            Files.delete(file.toPath());
        } catch (IOException e) {
            log.error("Error occurred while delete file {}", file.getName(), e);
        }
    }

}
