import React from 'react';
import LessonsCard from './LessonsCard';
import './LessonList.scss';

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
