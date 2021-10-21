import React from 'react';
import './LessonsList.scss';
import LessonsCard from './LessonsCard';

const LessonsList = (props) => {
    const { lessons, ...rest } = props;

    return (
        <section className="container-flex-wrap lesson-container">
            {lessons.map((lesson) => (
                <LessonsCard lesson={lesson} key={lesson.id} {...rest} />
            ))}
        </section>
    );
};

export default LessonsList;
