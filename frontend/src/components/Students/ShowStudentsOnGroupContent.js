import React from 'react';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { CircularProgress } from '@material-ui/core';
import StudentsPage from '../../containers/Students/StudentsPage';
import { StudentsPageHead } from './StudentsPageHead';
import { NO_EXIST_STUDENTS_AT_GROUP } from '../../constants/translationLabels/formElements';

export const ShowStudentsOnGroupContent = (props) => {
    const { students, loading, ...res } = props;
    const { t } = useTranslation('formElements');

    if (loading) {
        return (
            <section className="centered-container">
                <CircularProgress />
            </section>
        );
    }
    if (isEmpty(students)) {
        return <>{t(NO_EXIST_STUDENTS_AT_GROUP)} </>;
    }
    return (
        <span className="table-student-data">
            <StudentsPageHead t={t} students={students} />
            <StudentsPage students={students} {...res} />
        </span>
    );
};
