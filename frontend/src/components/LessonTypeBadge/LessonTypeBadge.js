import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaChalkboardTeacher, FaFlask, FaPencilAlt, FaUsers } from 'react-icons/fa';
import './LessonTypeBadge.scss';

const lessonTypeConfig = {
    lecture: { icon: FaChalkboardTeacher, colorClass: 'lecture' },
    laboratory: { icon: FaFlask, colorClass: 'laboratory' },
    practical: { icon: FaPencilAlt, colorClass: 'practical' },
    seminar: { icon: FaUsers, colorClass: 'seminar' },
};

const LessonTypeBadge = ({ lessonType, showIcon = true, size = 'normal' }) => {
    const { t } = useTranslation('formElements');

    const type = lessonType?.toLowerCase() || '';
    const config = lessonTypeConfig[type] || { colorClass: 'default' };
    const Icon = config.icon;

    const label = t(`lesson_type_${type}_label`, { defaultValue: lessonType });

    return (
        <span className={`lesson-type-badge ${config.colorClass} lesson-type-badge--${size}`}>
            {showIcon && Icon && <Icon className="lesson-type-badge__icon" />}
            {label}
        </span>
    );
};

export default LessonTypeBadge;