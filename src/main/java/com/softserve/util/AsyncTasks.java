package com.softserve.util;

import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

@Slf4j
public class AsyncTasks {

    public static void deleteCsvFilesWithPrefix(String prefix) {
        Runnable runnable = () -> {
            File homeDir = new File(System.getProperty("user.dir"));
            File[] files = homeDir.listFiles(f -> f.getName().startsWith(prefix) && f.getName().endsWith(".csv"));
            if (files == null || files.length == 0) {return;}
            for (File fileToDelete : files) {
                try {
                    Files.delete(fileToDelete.toPath());
                } catch (IOException e) {
                    log.error("Error occurred while deleting the file {}", fileToDelete.getName(), e);
                }
            }
        };
        new Thread(runnable).start();
    }

}
