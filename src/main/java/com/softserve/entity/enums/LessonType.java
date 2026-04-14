package com.softserve.entity.enums;

public enum LessonType {

    LECTURE("lecture",   "#4a6cf7", "#eef1fe", "#d4dbf9", "#d4dbf9", "#3a56c7"),
    LABORATORY("lab",    "#e08830", "#fef6ed", "#f5dfc5", "#f5dfc5", "#b36d20"),
    PRACTICAL("practical", "#0fa968", "#edfcf5", "#c5f0dc", "#c5f0dc", "#0b8a54"),
    EXAM("exam",         "#d32f2f", "#fff5f5", "#f5c2c2", "#f5c2c2", "#a82020"),
    CREDIT("credit",     "#e91e8c", "#fce4f4", "#f5b8e0", "#f5b8e0", "#b8156e");

    private final String cssClass;
    private final String main;
    private final String light;
    private final String border;
    private final String roomBg;
    private final String roomFg;

    LessonType(String cssClass, String main, String light,
               String border, String roomBg, String roomFg) {
        this.cssClass = cssClass;
        this.main     = main;
        this.light    = light;
        this.border   = border;
        this.roomBg   = roomBg;
        this.roomFg   = roomFg;
    }

    public String getCssClass() {
        return cssClass;
    }
    public String getMain() {
        return main;
    }
    public String getLight() {
        return light;
    }
    public String getBorder() {
        return border;
    }
    public String getRoomBg() {
        return roomBg;
    }
    public String getRoomFg() {
        return roomFg;
    }
}
