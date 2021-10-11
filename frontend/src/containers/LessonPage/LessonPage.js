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
        groups,
        groupId,
    } = props;

    const { t } = useTranslation('common');
    const [open, setOpen] = useState(false);
    const [openCopyLessonDialog, setOpenCopyLessonDialog] = useState(false);
    const [lessonId, setLessonId] = useState(-1);
    const [copiedLesson, setCopiedLesson] = useState(-1);
    const [term, setTerm] = useState('');
    const SearchChange = setTerm;
    let visibleItems = [];
    const isIncludeValue = (item, value) => {
        return item.toLowerCase().includes(value.toLowerCase());
    };
    const getSearchTeachers = (lessons) => {
        const termTmp = term.trim();
        if (termTmp.length === 0) return lessons;
        return lessons.filter((lesson) => {
            const { teacher, subjectForSite, lessonType, grouped } = lesson;
            return (
                isIncludeValue(teacher.surname, termTmp) ||
                isIncludeValue(subjectForSite, termTmp) ||
                isIncludeValue(lessonType, termTmp) ||
                (isIncludeValue('Grouped', term) && grouped)
            );
        });
    };
    visibleItems = getSearchTeachers(lessons, term);

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
    useEffect(() => showAllTeachersService(), []);
    useEffect(() => showAllSemestersService(), []);
    useEffect(() => getLessonTypesService(), []);
    useEffect(() => showAllGroupsService(), []);
    useEffect(() => {
        showAllSubjectsService();
    }, []);

    const createLessonCardHandler = (card) => {
        if (Object.keys(card).length === 0 && card.constructor === Object) return;
        if (card.groups === undefined) {
            card.groups = [{ id: groupId }];
        }
        handleLessonCardService(card, groupId, currentSemester);
    };

    const selectLessonCardHandler = (lessonCardId) => {
        selectLessonCardService(lessonCardId);
    };

    const groupTitleHandle = (groups, groupId) => {
        return groups.find((group) => group.id === +groupId).title;
    };

    const groupHandle = (groups, groupId) => {
        return groups.find((group) => group.id === +groupId);
    };

    const handleClickOpen = (lessonId) => {
        setLessonId(lessonId);
        setOpen(true);
    };

    const handleClose = (lessonId) => {
        setOpen(false);
        if (!lessonId) return;

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
        getOptionLabel: (option) => (option ? option.title : ''),
    };

    const handleGroupSelect = (group) => {
        if (group) {
            selectGroupIdService(group.id);
            selectGroupService(group.id);
        }
    };

    const groupFinderHandle = (groupId) => {
        if (groupId) return groups.find((group) => group.id === groupId);
        return '';
    };

    const submitCopy = (values) => {
        values.toSemesterId = props.currentSemester.id;
        values.fromSemesterId = +values.fromSemesterId;
        CopyLessonsFromSemesterService(values);
    };

    const renderCopyLessonsForm = () => {
        if (!groupId) {
            return <CopyLessonsFromSemesterForm onSubmit={submitCopy} />;
        }
    };

    let cardsContainer = (
        <>
            {visibleItems.length > 0 ? (
                <LessonsList
                    lessons={visibleItems}
                    onClickOpen={handleClickOpen}
                    onSelectLesson={selectLessonCardHandler}
                    onCopyLesson={openCopyLessonDialogHandle}
                    translation={t}
                />
            ) : (
                <section className="centered-container">
                    <h2>
                        {groupHandle(groups, groupId)
                            ? t('lesson_no_lesson_for_group_label') +
                              groupTitleHandle(groups, groupId)
                            : ''}
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
                    open={open}
                    onClose={handleClose}
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
                        onSubmit={createLessonCardHandler}
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
