import React from 'react';
import './StudentTable.scss';
import {STUDENT_LABEL, STUDENTS_LABEL} from '../../constants/translationLabels/formElements';

export const StudentsPageHead = (props) => {
    const { students, t } = props;
    return (
        <h4 className="title-align">
            {students.length !== 1 ? `${t(STUDENTS_LABEL)} ` : `${t(STUDENT_LABEL)} `}
        </h4>
    );
};
