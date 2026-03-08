import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import './MyLessonsPage.scss';
import LessonsTable from '../TeacherLessonsPage/LessonsTable/LessonsTable';
import {getMyLessonsStart} from '../../actions/teacherLessons';
import {updateLessonsLinkStart, clearTeacherLessons} from '../../actions/teacherLessons';
import {getAllPublicSemestersStart} from '../../actions/schedule';

const MyLessonsPage = (props) => {
    const {
        teacher,
        lessons,
        loading,
        semesters,
        getMyLessons,
        updateLessonsLink,
        clearLessons,
        loadSemesters,
    } = props;
    const { t } = useTranslation('common');

    useEffect(() => {
        if (!semesters || semesters.length === 0) {
            loadSemesters();
        }
        getMyLessons();
        return () => {
            clearLessons();
        };
    }, []);

    const handleUpdateLink = (linkData) => {
        updateLessonsLink(linkData);
    };

    const getSemesterDescription = () => {
        if (lessons.length === 0 || !semesters.length) return '';
        const semesterId = lessons[0].semesterId;
        const semester = semesters.find(s => s.id === semesterId);
        return semester ? semester.description : '';
    };

    return (
        <div className="my-lessons-wrapper">
            <h2 className="my-lessons-title">
                {t('my_lessons') || 'Мої пари'}
                {getSemesterDescription() && ` — ${getSemesterDescription()}`}
            </h2>
            {loading && (
                <div className="loading-container">
                    <span>{t('loading') || 'Завантаження...'}</span>
                </div>
            )}

            {!loading && lessons.length > 0 && teacher && (
                <LessonsTable
                    lessons={lessons}
                    selectedTeacher={teacher}
                    onUpdateLink={handleUpdateLink}
                    onUnsavedChanges={() => {}}
                    t={t}
                />
            )}

            {!loading && lessons.length === 0 && (
                <div className="no-lessons-message">
                    {t('no_lessons_found') || 'Пари не знайдено'}
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    teacher: state.teachers.teacher,
    lessons: state.teacherLessons.lessons,
    loading: state.teacherLessons.loading,
    semesters: state.schedule.semesters,
});

const mapDispatchToProps = {
    getMyLessons: getMyLessonsStart,
    updateLessonsLink: updateLessonsLinkStart,
    clearLessons: clearTeacherLessons,
    loadSemesters: getAllPublicSemestersStart,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyLessonsPage);