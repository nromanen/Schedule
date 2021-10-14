import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import { useTranslation } from 'react-i18next';
import { isEmpty } from 'lodash';
import i18n from '../../../helper/i18n';
import RenderStudentTable from '../../../helper/renderStudentTable';
import { getAllStudentsByGroupId } from '../../../services/studentService';
import { UploadFile } from '../../../components/UploadFile/UploadFile';
import CustomDialog from '../CustomDialog';
import MovingGroupsDialog from './MovingGroupsDialog';

const ShowStudentsOnGroupDialog = (props) => {
    const { onClose, cardId, open, onDeleteStudent, students, onSubmit, match, groups, group } =
        props;
    const [checkBoxStudents, setCheckBoxStudents] = useState([]);
    const [isGroupButtonDisabled, setIsGroupButtonDisabled] = useState(true);
    const [checkedAll, setCheckedAll] = useState(false);
    const [openUploadFile, setOpenUploadFile] = useState(false);
    const [showStudentList, setShowStudentList] = useState(false);
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
        getAllStudentsByGroupId(props.group.id);
    }, [open, openUploadFile]);
    useEffect(() => {
        parseStudentToCheckBox();
    }, [props.students]);
    useEffect(() => {
        setSelectDisabled();
    }, [props.students]);

    const handleClose = () => {
        onClose(cardId);
    };

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
        while (checkBoxStudents[start].checked && start < finish) {
            start += 1;
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
    const handleClearCheckedAllBtn = () => {
        setCheckedAll(false);
    };

    const getDialog = () => {
        setShowStudentList(true);
    };
    const handleShowDialogFile = () => {
        setOpenUploadFile((prevState) => !prevState);
    };

    const buttonClassName = !isEmpty(students)
        ? 'student-dialog-button-data'
        : 'student-dialog-button-no-data';

    return (
        <>
            <CustomDialog
                open={open}
                onClose={handleClose}
                title={`${t('group_label')} - ${props.group.title}`}
                buttons={
                    <>
                        <UploadFile
                            group={group}
                            open={openUploadFile}
                            handleCloseDialogFile={handleShowDialogFile}
                        />
                        <Button
                            className={buttonClassName}
                            variant="contained"
                            onClick={handleShowDialogFile}
                            color="primary"
                            title={i18n.t('upload_from_file')}
                        >
                            {i18n.t('common:upload_from_file_title')}
                        </Button>
                        {!isEmpty(students) && (
                            <Button
                                className="student-dialog-button-data"
                                variant="contained"
                                onClick={getDialog}
                                color="primary"
                                disabled={isGroupButtonDisabled}
                                title={i18n.t('choose_group_title')}
                            >
                                {i18n.t('choose_group_title')}
                            </Button>
                        )}
                        <Button
                            className={buttonClassName}
                            variant="contained"
                            onClick={() => onClose('')}
                            color="primary"
                            title={i18n.t('close_title')}
                        >
                            {i18n.t('common:close_title')}
                        </Button>
                    </>
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
                            group={props.group}
                            onDeleteStudent={onDeleteStudent}
                            students={students}
                            onSubmit={onSubmit}
                            match={match}
                            student={props.student}
                            checkBoxStudents={checkBoxStudents}
                            handleCheckElement={handleCheckElement}
                            handleAllChecked={handleAllChecked}
                            handleAllClear={handleAllClear}
                            handleChangeCheckedAllBtn={handleChangeCheckedAllBtn}
                            handleClearCheckedAllBtn={handleClearCheckedAllBtn}
                            checkedAllBtn={checkedAll}
                            handleAllCheckedBtn={handleAllCheckedBtn}
                        />
                    </span>
                )}
            </CustomDialog>
            <MovingGroupsDialog
                onClose={handleClose}
                open={showStudentList}
                checkBoxStudents={checkBoxStudents}
                setShowStudentList={setShowStudentList}
                groups={groups}
                group={group}
            />
        </>
    );
};

ShowStudentsOnGroupDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default ShowStudentsOnGroupDialog;
