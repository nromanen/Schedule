import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import {Autocomplete} from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import './TeacherLessonsPage.scss';
import LessonsTable from './LessonsTable/LessonsTable';
import {showAllTeachersStart} from '../../actions/teachers';
import {clearTeacherLessons, getLessonsByTeacherStart, updateLessonsLinkStart,} from '../../actions/teacherLessons';
import {FORM_TEACHER_LABEL} from '../../constants/translationLabels/formElements';

const TeacherLessonsPage = (props) => {
    const {
        teachers,
        selectedTeacher,
        lessons,
        loading,
        getTeachers,
        getLessonsByTeacher,
        updateLessonsLink,
        clearLessons,
    } = props;

    const { t } = useTranslation('common');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [pendingTeacher, setPendingTeacher] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        getTeachers();
        return () => {
            clearLessons();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTeacherSelect = (teacher) => {
        if (hasUnsavedChanges) {
            setPendingTeacher(teacher);
            setShowConfirmDialog(true);
        } else {
            applyTeacherChange(teacher);
        }
    };

    const applyTeacherChange = (teacher) => {
        if (teacher) {
            getLessonsByTeacher(teacher.id);
        } else {
            clearLessons();
        }
        setHasUnsavedChanges(false);
    };

    const handleConfirmChange = () => {
        setShowConfirmDialog(false);
        applyTeacherChange(pendingTeacher);
        setPendingTeacher(null);
    };

    const handleCancelChange = () => {
        setShowConfirmDialog(false);
        setPendingTeacher(null);
    };

    const handleUpdateLink = (linkData) => {
        updateLessonsLink(linkData);
    };

    const handleUnsavedChanges = (hasChanges) => {
        setHasUnsavedChanges(hasChanges);
    };

    const getTeacherFullName = (teacher) => {
        if (!teacher || !teacher.surname) return '';
        return `${teacher.surname} ${teacher.name} ${teacher.patronymic || ''}`.trim();
    };

    return (
        <div className="teacher-lessons-wrapper">
            <div className="teacher-lessons-sidebar">
                <div className="sidebar-card">
                    <Autocomplete
                        id="teacher"
                        value={selectedTeacher}
                        options={teachers}
                        className="teacher-autocomplete"
                        clearOnEscape
                        openOnFocus
                        getOptionLabel={(option) => getTeacherFullName(option)}
                        getOptionSelected={(option, value) => option.id === value?.id}
                        onChange={(_, newValue) => {
                            handleTeacherSelect(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                className="textField"
                                {...params}
                                label={t(FORM_TEACHER_LABEL)}
                                margin="normal"
                            />
                        )}
                    />
                </div>
            </div>

            <div className="teacher-lessons-list">
                {loading && (
                    <div className="loading-container">
                        <span>{t('loading') || 'Завантаження...'}</span>
                    </div>
                )}

                {!loading && selectedTeacher && lessons.length > 0 && (
                    <LessonsTable
                        lessons={lessons}
                        selectedTeacher={selectedTeacher}
                        onUpdateLink={handleUpdateLink}
                        onUnsavedChanges={handleUnsavedChanges}
                        t={t}
                    />
                )}

                {!loading && selectedTeacher && lessons.length === 0 && (
                    <div className="no-lessons-message">
                        {t('no_lessons_found') || 'Пари не знайдено'}
                    </div>
                )}

                {!selectedTeacher && (
                    <div className="select-teacher-message">
                        {t('select_teacher_prompt') || 'Виберіть викладача для перегляду пар'}
                    </div>
                )}
            </div>

            <Dialog
                open={showConfirmDialog}
                onClose={handleCancelChange}
            >
                <DialogTitle>{t('unsaved_changes_title') || 'Незбережені зміни'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('unsaved_changes_warning') || 'У вас є незбережені дані. Ви впевнені, що хочете покинути сторінку?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelChange} color="primary">
                        {t('cancel') || 'Скасувати'}
                    </Button>
                    <Button onClick={handleConfirmChange} color="secondary">
                        {t('confirm') || 'Продовжити'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const mapStateToProps = (state) => ({
    teachers: state.teachers.teachers,
    selectedTeacher: state.teacherLessons.selectedTeacher,
    lessons: state.teacherLessons.lessons,
    loading: state.teacherLessons.loading,
});

const mapDispatchToProps = {
    getTeachers: showAllTeachersStart,
    getLessonsByTeacher: getLessonsByTeacherStart,
    updateLessonsLink: updateLessonsLinkStart,
    clearLessons: clearTeacherLessons,
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherLessonsPage);