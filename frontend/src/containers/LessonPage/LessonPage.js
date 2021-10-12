import './LessonPage.scss';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { styled } from '@material-ui/core/styles';
import Card from '../../share/Card/Card';
import ConfirmDialog from '../../share/modals/dialog';
import CopyLessonDialog from '../../share/modals/chooseGroupDialog/CopyLessonDialog';
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

const GroupField = styled(TextField)({
    display: 'inline-block',
    width: '150px',
});

const LessonPage = (props) => {
    const {
        loading: isLoading,
        currentSemester,
        isUniqueError,
        subjects,
        teachers,
        lessons,
        groupId,
        groups,
    } = props;
    const { t } = useTranslation('common');
    const [term, setTerm] = useState('');
    const [lessonId, setLessonId] = useState(-1);
    const [copiedLesson, setCopiedLesson] = useState(-1);
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
    const [openCopyLessonDialog, setOpenCopyLessonDialog] = useState(false);

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
    }, []);

    const submitLessonForm = (card) => {
        handleLessonCardService(card, groupId, currentSemester);
    };

    const selectLessonCardHandler = (lessonCardId) => {
        selectLessonCardService(lessonCardId);
    };

    const searchTitleGroupByID = (id) => {
        return groups.find((group) => group.id === +id).title;
    };

    const showConfirmDialog = (lessonCardId) => {
        setLessonId(lessonCardId);
        setIsOpenConfirmDialog(true);
    };

    const acceptConfirmDialog = (id) => {
        setIsOpenConfirmDialog(false);
        if (!id) return;
        removeLessonCardService(lessonId);
    };

    const openCopyLessonDialogHandle = (lesson) => {
        setCopiedLesson(lesson);
        setOpenCopyLessonDialog(true);
    };

    const closeCopyLessonDialogHandle = (lessonGroupObj) => {
        setOpenCopyLessonDialog(false);
        if (!lessonGroupObj) return;
        copyLessonCardService(lessonGroupObj);
    };

    const defaultProps = {
        options: groups,
        getOptionLabel: (option) => option && option.title,
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
                    onSelectLesson={selectLessonCardHandler}
                    onCopyLesson={openCopyLessonDialogHandle}
                    translation={t}
                />
            ) : (
                <section className="centered-container">
                    <h2>
                        {groupId &&
                            t('lesson_no_lesson_for_group_label') + searchTitleGroupByID(groupId)}
                    </h2>
                </section>
            )}
        </>
    );

    if (isLoading) {
        cardsContainer = (
            <section className="centered-container">
                <CircularProgress />
            </section>
        );
    }

    return (
        <>
            <Card class="card-title lesson-card">
                <CopyLessonDialog
                    open={openCopyLessonDialog}
                    onClose={closeCopyLessonDialogHandle}
                    groupId={groupId}
                    lesson={copiedLesson}
                    groups={groups}
                    translation={t}
                />
                <ConfirmDialog
                    cardId={lessonId}
                    whatDelete={cardType.LESSON.toLowerCase()}
                    open={isOpenConfirmDialog}
                    onClose={acceptConfirmDialog}
                />
                <div className="lesson-page-title">
                    <aside className="search-lesson-group">
                        {groupId && (
                            <span className="search-lesson">
                                <SearchPanel forLessons SearchChange={SearchChange} />
                            </span>
                        )}
                        <span className="group-lesson">
                            <h1 className="lesson-page-h">{t('lesson_for_group_title')}</h1>
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
                                        label={t('formElements:group_label')}
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
                        onSetSelectedCard={selectLessonCardHandler}
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
});

export default connect(mapStateToProps)(LessonPage);
