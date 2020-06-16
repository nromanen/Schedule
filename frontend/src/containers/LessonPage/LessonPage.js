import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Card from '../../share/Card/Card';
import ConfirmDialog from '../../share/modals/dialog';
import CopyLessonDialog from '../../share/modals/chooseGroupDialog/CopyLessonDialog';

import LessonForm from '../../components/LessonForm/LessonForm';
import LessonsList from '../../components/LessonsList/LessonsList';

import {
    copyLessonCardService,
    getLessonsByGroupService,
    getLessonTypesService,
    handleLessonCardService,
    removeLessonCardService,
    selectGroupIdService,
    selectLessonCardService
} from '../../services/lessonService';
import { showAllTeachersService } from '../../services/teacherService';
import { showAllGroupsService } from '../../services/groupService';
import { setLoadingService } from '../../services/loadingService';
import { showAllSubjectsService } from '../../services/subjectService';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { styled } from '@material-ui/core/styles';

import { cardType } from '../../constants/cardType';

import './LessonPage.scss';

const GroupField = styled(TextField)({
    display: 'inline-block',
    width: '150px'
});

const LessonPage = props => {
    const { t } = useTranslation('common');

    const [open, setOpen] = useState(false);
    const [openCopyLessonDialog, setOpenCopyLessonDialog] = useState(false);
    const [lessonId, setLessonId] = React.useState(-1);
    const [copiedLesson, setCopiedLesson] = React.useState(-1);

    const teachers = props.teachers;

    const isUniqueError = props.isUniqueError;

    const lessons = props.lessons;
    const lessonLength = lessons.length;

    const isLoading = props.loading;

    const { groups, groupId } = props;

    const subjects = props.subjects;

    useEffect(() => {
        if (groupId) {
            setLoadingService(true);
            getLessonsByGroupService(groupId);
        }
    }, [groupId]);
    useEffect(() => showAllTeachersService(), []);
    useEffect(() => getLessonTypesService(), []);
    useEffect(() => showAllGroupsService(), []);
    useEffect(() => {
        showAllSubjectsService();
    }, []);

    const createLessonCardHandler = card => {
        if (Object.keys(card).length === 0 && card.constructor === Object)
            return;

        handleLessonCardService(card, groupId);
    };

    const selectLessonCardHandler = lessonCardId => {
        selectLessonCardService(lessonCardId);
    };

    const groupTitleHandle = (groups, groupId) => {
        return groups.find(group => group.id === +groupId).title;
    };

    const groupHandle = (groups, groupId) => {
        return groups.find(group => group.id === +groupId);
    };

    const handleClickOpen = lessonId => {
        setLessonId(lessonId);
        setOpen(true);
    };

    const handleClose = lessonId => {
        setOpen(false);
        if (!lessonId) return;

        removeLessonCardService(lessonId);
    };

    const openCopyLessonDialogHandle = lesson => {
        setCopiedLesson(lesson);
        setOpenCopyLessonDialog(true);
    };

    const closeCopyLessonDialogHandle = lessonGroupObj => {
        setOpenCopyLessonDialog(false);
        if (!lessonGroupObj) return;
        copyLessonCardService(lessonGroupObj);
    };

    const defaultProps = {
        options: groups,
        getOptionLabel: option => (option ? option.title : '')
    };

    const handleGroupSelect = group => {
        if (group) selectGroupIdService(group.id);
    };

    const groupFinderHandle = groupId => {
        if (groupId) return groups.find(group => group.id === groupId);
        else return '';
    };

    let cardsContainer = (
        <>
            {lessonLength > 0 ? (
                <LessonsList
                    lessons={lessons}
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
                    <h1 className="lesson-page-h">
                        {t('lesson_for_group_title')}
                    </h1>
                    <Autocomplete
                        {...defaultProps}
                        id="group"
                        clearOnEscape
                        openOnFocus
                        value={groupFinderHandle(groupId)}
                        onChange={(event, newValue) => {
                            handleGroupSelect(newValue);
                        }}
                        renderInput={params => (
                            <GroupField
                                {...params}
                                label={t('formElements:group_label')}
                                margin="normal"
                            />
                        )}
                    />
                </div>
            </Card>
            <div className="cards-container">
                <LessonForm
                    lessonTypes={props.lessonTypes}
                    isUniqueError={isUniqueError}
                    groupId={groupId}
                    subjects={subjects}
                    teachers={teachers}
                    onSubmit={createLessonCardHandler}
                    onSetSelectedCard={selectLessonCardHandler}
                />
                {cardsContainer}
            </div>
        </>
    );
};
const mapStateToProps = state => ({
    lessons: state.lesson.lessons,
    lessonTypes: state.lesson.lessonTypes,
    groupId: state.lesson.groupId,
    isUniqueError: state.lesson.uniqueError,
    teachers: state.teachers.teachers,
    groups: state.groups.groups,
    subjects: state.subjects.subjects,
    loading: state.loadingIndicator.loading
});

export default connect(mapStateToProps)(LessonPage);
