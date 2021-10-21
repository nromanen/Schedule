import './LessonPage.scss';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Card from '../../share/Card/Card';
import { CustomDialog } from '../../share/DialogWindows';
import { dialogTypes } from '../../constants/dialogs';
import { showAllTeachersService } from '../../services/teacherService';
import { setLoadingService } from '../../services/loadingService';
import { showAllSubjectsService } from '../../services/subjectService';
import { cardType } from '../../constants/cardType';
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
    selectLessonCardService,
} from '../../services/lessonService';

// import {
//     LessonForm,
//     Lessons,
//     Search,
//     CopyLessonsFromSemesterForm,
//     CopyLessonDialog,
// } from './components';

import { showAllGroupsService } from '../../services/groupService';
import Lessons from './components/Lessons/Lessons';
import Search from './components/Search/Search';
import LessonForm from './components/LessonForm/LessonForm';
import { CopyLessonsFromSemesterForm } from './components/CopyLessonsFromSemesterForm';
import CopyLessonDialog from './components/CopyLessonDialog/CopyLessonDialog';

const LessonPage = (props) => {
    const { currentSemester, isUniqueError, subjects, teachers, lessons, groupId, groups } = props;
    const { t } = useTranslation('common');
    const [term, setTerm] = useState('');
    const [lessonId, setLessonId] = useState();
    const [copiedLesson, setCopiedLesson] = useState();
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
    const [openCopyLessonDialog, setOpenCopyLessonDialog] = useState(false);

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

    const submitCopy = (values) => {
        const toSemesterId = currentSemester.id;
        const fromSemesterId = +values.fromSemesterId;
        CopyLessonsFromSemesterService({ ...values, toSemesterId, fromSemesterId });
    };

    return (
        <>
            <Card additionClassName="card-title lesson-card">
                <CopyLessonDialog
                    open={openCopyLessonDialog}
                    onClose={closeCopyLessonDialogHandle}
                    groupId={groupId}
                    lesson={copiedLesson}
                    groups={groups}
                    translation={t}
                />
                <CustomDialog
                    type={dialogTypes.DELETE_CONFIRM}
                    cardId={lessonId}
                    whatDelete={cardType.LESSON.toLowerCase()}
                    open={isOpenConfirmDialog}
                    onClose={acceptConfirmDialog}
                />
                <Search setTerm={setTerm} />
            </Card>
            <div className="cards-container">
                <section>
                    {/* <LessonForm /> */}
                    <LessonForm
                        lessonTypes={props.lessonTypes}
                        isUniqueError={isUniqueError}
                        subjects={subjects}
                        teachers={teachers}
                        onSubmit={submitLessonForm}
                        onSetSelectedCard={selectLessonCardService}
                    />
                    {!groupId && <CopyLessonsFromSemesterForm onSubmit={submitCopy} />}
                </section>
                <Lessons
                    visibleItems={visibleItems}
                    onClickOpen={showConfirmDialog}
                    onCopyLesson={openCopyLessonDialogHandle}
                />
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
