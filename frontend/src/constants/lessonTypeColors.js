// synchronize with styles/colors.scss
export const lessonTypeColors = {
    lecture:    { main: '#4a6cf7', light: '#eef1fe' },
    laboratory: { main: '#e08830', light: '#fef6ed' },
    practical:  { main: '#0fa968', light: '#edfcf5' },
    seminar:    { main: '#8E24AA', light: '#F3E5F5' },
    default:    { main: '#6b7280', light: '#F5F5F5' },
};

export const getLessonTypeColor = (lessonType, variant = 'main') =>
    (lessonTypeColors[lessonType?.toLowerCase()] || lessonTypeColors.default)[variant];