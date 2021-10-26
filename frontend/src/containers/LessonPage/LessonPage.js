import './LessonPage.scss';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { styled } from '@material-ui/core/styles';
import Card from '../../share/Card/Card';
import { CustomDialog, CopyLessonDialog } from '../../share/DialogWindows';
import { dialogTypes } from '../../constants/dialogs';
import LessonForm from '../../components/LessonForm/LessonForm';
import LessonsList from '../../components/LessonsList/LessonsList';
import CopyLessonsFromSemesterForm from '../../components/CopyLessonsFromSemesterForm/CopyLessonsFromSemesterForm';
import { showAllTeachersService } from '../../services/teacherService';
import { selectGroupService, showAllGroupsService } from '../../services/groupService';
import { setLoadingService } from '../../services/loadingService';
import { showAllSubjectsService } from '../../services/subjectService';
import { cardType } from '../../constants/cardType';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import {
    showAllSemestersService,
    CopyLessonsFromSemesterService,
} from '../../services/semesterService';
import { setIsOpenConfirmDialogService } from '../../services/dialogService';
import { searchLessonsByTeacher } from '../../helper/search';
import {
    copyLessonCardService,
    getLessonsByGroupService,
    getLessonTypesService,
    handleLessonCardService,
    removeLessonCardService,
    selectGroupIdService,
    selectLessonCardService,
} from '../../services/lessonService';
import { FORM_GROUP_LABEL } from '../../constants/translationLabels/formElements';
import {
    LESSON_FOR_GROUP_TITLE,
    LESSON_NO_LESSON_FOR_GROUP_LABEL,
} from '../../constants/translationLabels/common';

const GroupField = styled(TextField)({
    display: 'inline-block',
    width: '150px',
});

const LessonPage = (props) => {
    const {
        loading,
        currentSemester,
        isUniqueError,
        subjects,
        teachers,
        lessons,
        groupId,
        groups,
        isOpenConfirmDialog,
    } = props;
    const { t } = useTranslation('common');
    const [term, setTerm] = useState('');
    const [lessonId, setLessonId] = useState();
    const [copiedLesson, setCopiedLesson] = useState();
    const [isOpenCopyLessonDialog, setIsOpenCopyLessonDialog] = useState(false);

    const SearchChange = setTerm;
    const visibleItems = searchLessonsByTeacher(lessons, term);

    useEffect(() => {
        if (groupId) {
            setLoadingService(true);
            getLessonsByGroupService(groupId);
        }
    }, [groupId]);
    useEffect(() => {
        setLoadingService(true);
        getLessonsByGroupService(groupId);
    }, [lessons.length]);
    useEffect(() => {
        showAllTeachersService();
        getLessonTypesService();
        showAllGroupsService();
        showAllSubjectsService();
        showAllSemestersService();
    }, []);

    const submitLessonForm = (card) => {
        handleLessonCardService(card, groupId, currentSemester);
    };

    const searchTitleGroupByID = (id) => {
        return groups.find((group) => group.id === +id).title;
    };

    const showConfirmDialog = (lessonCardId) => {
        setLessonId(lessonCardId);
        setIsOpenConfirmDialogService(true);
    };

    const acceptConfirmDialog = () => {
        setIsOpenConfirmDialogService(false);
        removeLessonCardService(lessonId);
    };

    const openCopyLessonDialogHandle = (lesson) => {
        setCopiedLesson(lesson);
        setIsOpenCopyLessonDialog(true);
    };

    const closeCopyLessonDialogHandle = (lessonGroupObj) => {
        setIsOpenCopyLessonDialog(false);
        if (!lessonGroupObj) return;
        copyLessonCardService(lessonGroupObj);
    };

    const defaultProps = {
        options: groups,
        getOptionLabel: (option) => (option ? option.title : ''),
    };

    const handleGroupSelect = (group) => {
        if (group) {
            selectGroupIdService(group.id);
            selectGroupService(group.id);
        }
    };

    const groupFinderHandle = (id) => {
        return id && groups.find((group) => group.id === groupId);
    };

    const submitCopy = (values) => {
        const toSemesterId = currentSemester.id;
        const fromSemesterId = +values.fromSemesterId;
        CopyLessonsFromSemesterService({ ...values, toSemesterId, fromSemesterId });
    };

    const renderCopyLessonsForm = () => {
        return !groupId && <CopyLessonsFromSemesterForm onSubmit={submitCopy} />;
    };

    let cardsContainer = (
        <>
            {visibleItems.length > 0 ? (
                <LessonsList
                    lessons={visibleItems}
                    onClickOpen={showConfirmDialog}
                    onSelectLesson={selectLessonCardService}
                    onCopyLesson={openCopyLessonDialogHandle}
                    translation={t}
                />
            ) : (
                <section className="centered-container">
                    <h2>
                        {groupId &&
                            t(LESSON_NO_LESSON_FOR_GROUP_LABEL) + searchTitleGroupByID(groupId)}
                    </h2>
                </section>
            )}
        </>
    );

    if (loading) {
        cardsContainer = (
            <section className="centered-container">
                <CircularProgress />
            </section>
        );
    }

    return (
        <>
            <Card additionClassName="card-title lesson-card">
                {isOpenCopyLessonDialog && (
                    <CopyLessonDialog
                        open={isOpenCopyLessonDialog}
                        onClose={closeCopyLessonDialogHandle}
                        groupId={groupId}
                        lesson={copiedLesson}
                        groups={groups}
                        translation={t}
                    />
                )}

                {isOpenConfirmDialog && (
                    <CustomDialog
                        type={dialogTypes.DELETE_CONFIRM}
                        handelConfirm={acceptConfirmDialog}
                        whatDelete={cardType.LESSON.toLowerCase()}
                        open={isOpenConfirmDialog}
                    />
                )}

                <div className="lesson-page-title">
                    <aside className="search-lesson-group">
                        {groupId && (
                            <span className="search-lesson">
                                <SearchPanel forLessons SearchChange={SearchChange} />
                            </span>
                        )}
                        <span className="group-lesson">
                            <h1 className="lesson-page-h">{t(LESSON_FOR_GROUP_TITLE)}</h1>
                            <Autocomplete
                                {...defaultProps}
                                id="group"
                                clearOnEscape
                                openOnFocus
                                value={groupFinderHandle(groupId)}
                                onChange={(event, newValue) => {
                                    handleGroupSelect(newValue);
                                }}
                                renderInput={(params) => (
                                    <GroupField
                                        {...params}
                                        label={t(FORM_GROUP_LABEL)}
                                        margin="normal"
                                    />
                                )}
                            />
                        </span>
                    </aside>
                </div>
            </Card>
            <div className="cards-container">
                <section>
                    <LessonForm
                        lessonTypes={props.lessonTypes}
                        isUniqueError={isUniqueError}
                        subjects={subjects}
                        teachers={teachers}
                        onSubmit={submitLessonForm}
                        onSetSelectedCard={selectLessonCardService}
                    />
                    {renderCopyLessonsForm()}
                </section>
                {cardsContainer}
            </div>
        </>
    );
};
const mapStateToProps = (state) => ({
    lessons: state.lesson.lessons,
    lessonTypes: state.lesson.lessonTypes,
    groupId: state.lesson.groupId,
    isUniqueError: state.lesson.uniqueError,
    teachers: state.teachers.teachers,
    groups: state.groups.groups,
    subjects: state.subjects.subjects,
    loading: state.loadingIndicator.loading,
    semesters: state.semesters.semesters,
    currentSemester: state.schedule.currentSemester,
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});

export default connect(mapStateToProps)(LessonPage);
