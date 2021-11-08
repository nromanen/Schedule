import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isNil } from 'lodash';

import TextField from '@material-ui/core/TextField';
import { Autocomplete } from '@material-ui/lab';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import { COMMON_LESSON_SERVICE_IS_NOT_UNIQUE } from '../../constants/translationLabels/common';
import { searchLessonsByTeacher } from '../../helper/search';
import { showAllSemestersService } from '../../services/semesterService';
import { checkUniqLesson } from '../../validation/storeValidation';
import { cardObjectHandler } from '../../helper/cardObjectHandler';

import Lessons from '../../containers/LessonPage/Lessons';
import Search from '../../containers/LessonPage/Search';
import LessonForm from '../../containers/LessonPage/LessonForm';
import CopyLessonsFromSemesterForm from '../../containers/LessonPage/CopyLessonsFromSemesterForm';
import CopyLessonDialog from './CopyLessonDialog/CopyLessonDialog';

import './LessonPage.scss';
import { showAllGroupsService, selectGroupService } from '../../services/groupService';
import { showAllSubjectsService } from '../../services/subjectService';
import { showAllTeachersService } from '../../services/teacherService';

import { FORM_GROUP_LABEL } from '../../constants/translationLabels/formElements';

const LessonPage = (props) => {
    const {
        currentSemester,
        isUniqueError,
        lessonTypes,
        subjects,
        teachers,
        lessons,
        groupId,
        group,
        groups,
        copyLessonCard,
        deleteLessonCardStart,
        getLessonTypes,
        getLessonsByGroup,
        selectLessonCard,
        setOpenConfirmDialog,
        isOpenConfirmDialog,
        setOpenErrorSnackbar,
        setUniqueError,
        copyLessonsFromSemester,
        handleLesson,
        selectByGroupId,
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
        const cardObj = cardObjectHandler(card, groupId, currentSemester);

        if (!checkUniqLesson(lessons, cardObj)) {
            const message = t(COMMON_LESSON_SERVICE_IS_NOT_UNIQUE);

            setOpenErrorSnackbar(message);
            setUniqueError(true);
            return;
        }

        handleLesson(cardObj, groupId);
    };

    const showConfirmDialog = (lessonCardId) => {
        setLessonId(lessonCardId);
        setOpenConfirmDialog(true);
    };

    const acceptConfirmDialog = () => {
        setOpenConfirmDialog(false);
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
        copyLessonsFromSemester({ ...values, toSemesterId, fromSemesterId });
    };

    const handleGroupSelect = (selectedGroup) => {
        if (selectedGroup) {
            selectByGroupId(selectedGroup.id);
            selectGroupService(selectedGroup.id);
        }
    };

    return (
        <>
            <div className="wrapper">
                <div className="side-one">
                    <Search setTerm={setTerm} />
                    <div className="cards-container">
                        <section className="section">
                            <LessonForm
                                lessonTypes={lessonTypes}
                                isUniqueError={isUniqueError}
                                subjects={subjects}
                                teachers={teachers}
                                onSubmit={submitLessonForm}
                                onSetSelectedCard={selectLessonCard}
                            />
                            {!groupId && (
                                <CopyLessonsFromSemesterForm onSubmit={submitCopySemester} />
                            )}
                        </section>
                    </div>
                </div>
                <div className="side-two">
                    <div className="group-lesson">
                        <Autocomplete
                            id="group"
                            value={group}
                            options={groups}
                            clearOnEscape
                            openOnFocus
                            getOptionLabel={(option) => option.title}
                            onChange={(_, newValue) => {
                                handleGroupSelect(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    className="textField"
                                    {...params}
                                    label={t(FORM_GROUP_LABEL)}
                                    margin="normal"
                                />
                            )}
                        />
                    </div>
                    <div className="cards-container">
                        <Lessons
                            visibleItems={visibleItems}
                            onClickOpen={showConfirmDialog}
                            onCopyLesson={openCopyLessonDialogHandle}
                        />
                    </div>
                </div>
            </div>

            <div className="card-title lesson-card">
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
            </div>
        </>
    );
};

export default LessonPage;
