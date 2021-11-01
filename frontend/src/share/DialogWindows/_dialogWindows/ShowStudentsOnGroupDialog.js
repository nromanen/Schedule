import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import RenderStudentTable from '../../../helper/renderStudentTable';
import { UploadFile } from '../../../components/UploadFile/UploadFile';
import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import {
    dialogCloseButton,
    dialogUploadFromFileButton,
    dialogChooseGroupButton,
} from '../../../constants/dialogs';
import { GROUP_LABEL } from '../../../constants/translationLabels/formElements';

const ShowStudentsOnGroupDialog = (props) => {
    const {
        onDeleteStudent,
        fetchAllStudentsStart,
        onClose,
        open,
        students,
        match,
        groups,
        group,
    } = props;
    const { t } = useTranslation('formElements');
    const [isOpenUploadFileDialog, setIsOpenUploadFileDialog] = useState(false);

    useEffect(() => {
        fetchAllStudentsStart(group.id);
    }, [group.id]);

    const [isGroupButtonDisabled, setIsGroupButtonDisabled] = useState(true);
    const [isOpenStudentListDialog, setIsOpenStudentListDialog] = useState(false);

    const getDialog = () => {
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
    return (
        <>
            <CustomDialog
                open={open}
                onClose={onClose}
                title={`${t(GROUP_LABEL)} - ${group.title}`}
                buttons={
                    !isEmpty(students)
                        ? [
                              dialogChooseGroupButton(
                                  getDialog,
                                  isGroupButtonDisabled,
                                  buttonClassName,
                              ),
                              ...dialogButtons,
                          ]
                        : dialogButtons
                }
            >
                {isEmpty(students) && <>{t('no_exist_students_in_group')} </>}
                {!isEmpty(students) && (
                    <span className="table-student-data">
                        <h3 className="title-align">
                            <span>
                                {students.length !== 1
                                    ? `${t('students_label')} `
                                    : `${t('student_label')} `}
                            </span>
                        </h3>
                        <RenderStudentTable
                            group={group}
                            onDeleteStudent={onDeleteStudent}
                            students={students}
                            match={match}
                            student={props.student}
                            groups={groups}
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
