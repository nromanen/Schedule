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
import MovingGroupsDialog from './MovingGroupsDialog';
import { GROUP_LABEL } from '../../../constants/translationLabels/formElements';

const ShowStudentsOnGroupDialog = (props) => {
    const {
        onClose,
        open,
        onDeleteStudent,
        students,
        match,
        groups,
        group,
        fetchAllStudentsStart,
    } = props;
    const [checkBoxStudents, setCheckBoxStudents] = useState([]);
    const [isGroupButtonDisabled, setIsGroupButtonDisabled] = useState(true);
    const [checkedAll, setCheckedAll] = useState(false);
    const [isOpenUploadFileDialog, setIsOpenUploadFileDialog] = useState(false);
    const [isOpenStudentListDialog, setIsOpenStudentListDialog] = useState(false);
    const { t } = useTranslation('formElements');

    const setSelectDisabled = () => {
        setIsGroupButtonDisabled(checkBoxStudents.every((item) => item.checked));
    };
    const parseStudentToCheckBox = () => {
        const res = students.map((item) => {
            return { ...item, checked: false };
        });
        setCheckBoxStudents(res);
    };
    useEffect(() => {
        fetchAllStudentsStart(group.id);
    }, [group.id]);
    useEffect(() => {
        parseStudentToCheckBox();
    }, [props.students]);
    useEffect(() => {
        setSelectDisabled();
    }, [props.students]);

    const handleCheckElement = (event) => {
        setCheckBoxStudents(
            checkBoxStudents.map((item) => {
                const checkbox = item;
                if (item.id === Number(event.target.value)) {
                    checkbox.checked = event.target.checked;
                }
                return checkbox;
            }),
        );
    };
    const handleAllChecked = (event, pageItemsCount, page, rowsPerPage) => {
        const studentsTmp = [...checkBoxStudents];
        let start = page * rowsPerPage;
        const finish = pageItemsCount + page * rowsPerPage;
        while (start < finish) {
            studentsTmp[start].checked = event.target.checked;
            start += 1;
        }
        setCheckBoxStudents(studentsTmp);
    };
    const handleAllCheckedBtn = (pageItemsCount, page, rowsPerPage) => {
        let start = page * rowsPerPage;
        const finish = pageItemsCount + page * rowsPerPage;
        while (start < finish) {
            if (checkBoxStudents[start].checked) {
                start += 1;
            } else {
                break;
            }
        }
        setCheckedAll(start === finish && start !== 0);
    };
    const handleAllClear = () => {
        setCheckBoxStudents(
            checkBoxStudents.map((item) => {
                const checkbox = item;
                if (item.checked) {
                    checkbox.checked = false;
                }
                return checkbox;
            }),
        );
    };
    const handleChangeCheckedAllBtn = () => {
        setCheckedAll((prevState) => !prevState);
    };

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
                title={`${t(GROUP_LABEL)} - ${props.group.title}`}
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
                {isEmpty(students) ? (
                    <>{t('no_exist_students_in_group')} </>
                ) : (
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
                            checkBoxStudents={checkBoxStudents}
                            handleCheckElement={handleCheckElement}
                            handleAllChecked={handleAllChecked}
                            handleAllClear={handleAllClear}
                            handleChangeCheckedAllBtn={handleChangeCheckedAllBtn}
                            handleClearCheckedAllBtn={() => setCheckedAll(false)}
                            checkedAllBtn={checkedAll}
                            handleAllCheckedBtn={handleAllCheckedBtn}
                        />
                    </span>
                )}
            </CustomDialog>
            {isOpenStudentListDialog && (
                <MovingGroupsDialog
                    onClose={() => setIsOpenStudentListDialog(false)}
                    open={isOpenStudentListDialog}
                    checkBoxStudents={checkBoxStudents}
                    setShowStudentList={setIsOpenStudentListDialog}
                    groups={groups}
                    group={group}
                />
            )}
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
