// synchronize with styles/colors.scss
const lessonTypeColors = {
    lecture: '#689F38',
    laboratory: '#1976D2',
    practical: '#F9A825',
    seminar: '#8E24AA',
};

const getLessonTypeColor = (lessonType) => {
    return lessonTypeColors[lessonType?.toLowerCase()] || lessonTypeColors.default;
};

export { lessonTypeColors, getLessonTypeColor };