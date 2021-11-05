import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { UploadFile } from '../../../components/UploadFile/UploadFile';
import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import StudentsPage from '../../../containers/Students/StudentsPage';
import { StudentsPageHead } from '../../../components/Students/StudentsPageHead';
import {
    GROUP_LABEL,
    NO_EXIST_STUDENTS_AT_GROUP,
} from '../../../constants/translationLabels/formElements';
import {
    dialogCloseButton,
    dialogUploadFromFileButton,
    dialogChooseGroupButton,
} from '../../../constants/dialogs';

const ShowStudentsOnGroupDialog = (props) => {
    const {
        fetchAllStudentsStart,
        onDeleteStudent,
        students,
        onClose,
        groupId,
        open,
        match,
        groups,
        group,
    } = props;
    const { t } = useTranslation('formElements');

    const [isOpenUploadFileDialog, setIsOpenUploadFileDialog] = useState(false);
    const [isOpenMoveStudentsDialog, setIsOpenMoveStudentDialog] = useState(false);
    const [isDisabledBtnMoveStudent, setIsDisabledBtnMoveStudent] = useState(false);

    useEffect(() => {
        fetchAllStudentsStart(groupId);
    }, [groupId]);

    const showMoveStudentsByGroupDialog = () => {
        setIsOpenMoveStudentDialog(true);
    };
    const handleShowDialogFile = () => {
        setIsOpenUploadFileDialog((prevState) => !prevState);
    };
    const buttonClassName = { additionClassName: 'student-dialog-button-data' };
    const dialogButtons = [
        dialogUploadFromFileButton(handleShowDialogFile, buttonClassName),
        dialogCloseButton(onClose, buttonClassName),
    ];
    const isEmptyStudents = isEmpty(students);
    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title={`${t(GROUP_LABEL)} - ${group.title}`}
                buttons={
                    !isEmptyStudents
                        ? [
                              dialogChooseGroupButton(
                                  showMoveStudentsByGroupDialog,
                                  isDisabledBtnMoveStudent,
                                  buttonClassName,
                              ),
                              ...dialogButtons,
                          ]
                        : dialogButtons
                }
            >
                {isEmptyStudents && <>{t(NO_EXIST_STUDENTS_AT_GROUP)} </>}

                {!isEmptyStudents && (
                    <span className="table-student-data">
                        <StudentsPageHead t={t} students={students} />
                        <StudentsPage
                            group={group}
                            match={match}
                            groups={groups}
                            students={students}
                            onDeleteStudent={onDeleteStudent}
                            isOpenMoveStudentsDialog={isOpenMoveStudentsDialog}
                            setIsOpenMoveStudentDialog={setIsOpenMoveStudentDialog}
                            setIsDisabledBtnMoveStudent={setIsDisabledBtnMoveStudent}
                        />
                    </span>
                )}
            </CustomDialog>
            {isOpenUploadFileDialog && (
                <UploadFile
                    group={group}
                    open={isOpenUploadFileDialog}
                    handleCloseDialogFile={handleShowDialogFile}
                />
            )}
        </>
    );
};

ShowStudentsOnGroupDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default ShowStudentsOnGroupDialog;
