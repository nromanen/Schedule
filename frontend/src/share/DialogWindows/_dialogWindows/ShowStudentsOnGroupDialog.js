import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import { UploadFile } from '../../../components/UploadFile/UploadFile';
import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import {
    dialogCloseButton,
    dialogUploadFromFileButton,
    dialogChooseGroupButton,
} from '../../../constants/dialogs';
import {
    GROUP_LABEL,
    STUDENTS_LABEL,
    STUDENT_LABEL,
} from '../../../constants/translationLabels/formElements';
import StudentsPage from '../../../containers/Students/StudentsPage';

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

    const [isGroupButtonDisabled, setIsGroupButtonDisabled] = useState(false);
    const [isOpenUploadFileDialog, setIsOpenUploadFileDialog] = useState(false);
    const [isOpenStudentListDialog, setIsOpenStudentListDialog] = useState(false);

    useEffect(() => {
        fetchAllStudentsStart(groupId);
    }, [groupId]);

    const showMoveStudentsByGroupDialog = () => {
        setIsOpenStudentListDialog(true);
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
                                  isGroupButtonDisabled,
                                  buttonClassName,
                              ),
                              ...dialogButtons,
                          ]
                        : dialogButtons
                }
            >
                {isEmptyStudents && <>{t('no_exist_students_in_group')} </>}

                {!isEmptyStudents && (
                    <span className="table-student-data">
                        <h3 className="title-align">
                            <span>
                                {students.length !== 1
                                    ? `${t(STUDENTS_LABEL)} `
                                    : `${t(STUDENT_LABEL)} `}
                            </span>
                        </h3>
                        <StudentsPage
                            group={group}
                            match={match}
                            groups={groups}
                            students={students}
                            onDeleteStudent={onDeleteStudent}
                            setIsGroupButtonDisabled={setIsGroupButtonDisabled}
                            isOpenStudentListDialog={isOpenStudentListDialog}
                            setIsOpenStudentListDialog={setIsOpenStudentListDialog}
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
