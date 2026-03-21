package com.softserve.util;

/**
 * Single source of truth for lesson type colors.
 * Keep in sync with frontend: src/constants/lessonTypeColors.js
 */
public final class LessonTypeColors {

    private LessonTypeColors() {
    }

    public static final String LECTURE_MAIN    = "#4a6cf7";
    public static final String LECTURE_LIGHT   = "#eef1fe";
    public static final String LECTURE_BORDER  = "#d4dbf9";
    public static final String LECTURE_ROOM_BG = "#d4dbf9";
    public static final String LECTURE_ROOM_FG = "#3a56c7";

    public static final String PRACTICAL_MAIN    = "#0fa968";
    public static final String PRACTICAL_LIGHT   = "#edfcf5";
    public static final String PRACTICAL_BORDER  = "#c5f0dc";
    public static final String PRACTICAL_ROOM_BG = "#c5f0dc";
    public static final String PRACTICAL_ROOM_FG = "#0b8a54";

    public static final String LAB_MAIN    = "#e08830";
    public static final String LAB_LIGHT   = "#fef6ed";
    public static final String LAB_BORDER  = "#f5dfc5";
    public static final String LAB_ROOM_BG = "#f5dfc5";
    public static final String LAB_ROOM_FG = "#b36d20";
}
