package com.softserve.util;

import com.opencsv.bean.CsvToBeanBuilder;
import com.softserve.entity.Student;
import com.softserve.exception.ParseFileException;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Slf4j
public class CsvFileParser {

    public static List<Student> parse(File csvFile) throws IOException {

        List<Student> students;

        try (Reader reader = new FileReader(csvFile, StandardCharsets.UTF_8)) {
            students = new CsvToBeanBuilder<Student>(reader)
                    .withType(Student.class)
                    .build().parse();
        } catch (RuntimeException e) {
            log.error("Error occurred while parsing file {}", csvFile.getName(), e);
            AsyncTasks.deleteFilesWithType("students_group", ".csv");
            throw new ParseFileException("Bad file format");
        }

        return students;
    }
}
