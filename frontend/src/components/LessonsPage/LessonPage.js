import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isNil } from 'lodash';

import Card from '../../share/Card/Card';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import { COMMON_LESSON_SERVICE_IS_NOT_UNIQUE } from '../../constants/translationLabels/common';
import { searchLessonsByTeacher } from '../../helper/search';
import {
    CopyLessonsFromSemesterService,
    showAllSemestersService,
} from '../../services/semesterService';
import { checkUniqLesson } from '../../validation/storeValidation';
import { cardObjectHandler } from '../../helper/cardObjectHandler';

import Lessons from '../../containers/LessonPage/Lessons';
import Search from '../../containers/LessonPage/Search';
import LessonForm from '../../containers/LessonPage/LessonForm';
import CopyLessonsFromSemesterForm from '../../containers/LessonPage/CopyLessonsFromSemesterForm';
import CopyLessonDialog from './CopyLessonDialog';

import './LessonPage.scss';
import { showAllGroupsService } from '../../services/groupService';
import { showAllSubjectsService } from '../../services/subjectService';
import { showAllTeachersService } from '../../services/teacherService';

const LessonPage = (props) => {
    const {
        currentSemester,
        isUniqueError,
        lessonTypes,
        subjects,
        teachers,
        lessons,
        groupId,
        groups,
        copyLessonCard,
        deleteLessonCardStart,
        getLessonTypes,
        getLessonsByGroup,
        createLessonCardStart,
        updateLessonCardStart,
        selectLessonCard,
        setOpenConfirmDialog,
        isOpenConfirmDialog,
        setOpenErrorSnackbar,
        setUniqueError,
    } = props;
    const { t } = useTranslation('common');
    const [term, setTerm] = useState('');
    const [lessonId, setLessonId] = useState();
    const [copiedLesson, setCopiedLesson] = useState();
    const [isOpenCopyLessonDialog, setIsOpenCopyLessonDialog] = useState(false);

    const visibleItems = searchLessonsByTeacher(lessons, term);

    useEffect(() => {
        if (groupId) {
            getLessonsByGroup(groupId);
        }
    }, [groupId]);

    useEffect(() => {
        showAllTeachersService();
        getLessonTypes();
        showAllGroupsService();
        showAllSubjectsService();
        showAllSemestersService();
    }, []);

    const submitLessonForm = (card) => {
        let cardObj = cardObjectHandler(card, groupId, currentSemester);

        if (!checkUniqLesson(lessons, cardObj)) {
            const message = t(COMMON_LESSON_SERVICE_IS_NOT_UNIQUE);

            setOpenErrorSnackbar(message);
            setUniqueError(true);
            return;
        }

        const lessonTeacher = teachers.find((teacher) => {
            return card.teacher === teacher.id;
        });

        cardObj = { ...cardObj, teacher: lessonTeacher };

        if (cardObj.id) updateLessonCardStart({ info: cardObj, groupId });
        createLessonCardStart({ info: cardObj, isCopy: false });
    };

    const showConfirmDialog = (lessonCardId) => {
        setLessonId(lessonCardId);
        setOpenConfirmDialog(true);
    };

    const acceptConfirmDialog = (id) => {
        setOpenConfirmDialog(false);
        if (!id) return;
        deleteLessonCardStart(lessonId);
    };

    const openCopyLessonDialogHandle = (lesson) => {
        setCopiedLesson(lesson);
        setIsOpenCopyLessonDialog(true);
    };

    const closeCopyLessonDialogHandle = ({ group, lesson }) => {
        setIsOpenCopyLessonDialog(false);
        if (!isNil(group)) {
            copyLessonCard(group, lesson);
        }
    };

    const submitCopySemester = (values) => {
        const toSemesterId = currentSemester.id;
        const fromSemesterId = +values.fromSemesterId;
        CopyLessonsFromSemesterService({ ...values, toSemesterId, fromSemesterId });
    };

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
                        handelConfirm={() => acceptConfirmDialog(groupId)}
                        whatDelete={cardType.LESSON.toLowerCase()}
                        open={isOpenConfirmDialog}
                    />
                )}
                <Search setTerm={setTerm} />
            </Card>
            <div className="cards-container">
                <section>
                    <LessonForm
                        lessonTypes={lessonTypes}
                        isUniqueError={isUniqueError}
                        subjects={subjects}
                        teachers={teachers}
                        onSubmit={submitLessonForm}
                        onSetSelectedCard={selectLessonCard}
                    />
                    {!groupId && <CopyLessonsFromSemesterForm onSubmit={submitCopySemester} />}
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

export default LessonPage;
