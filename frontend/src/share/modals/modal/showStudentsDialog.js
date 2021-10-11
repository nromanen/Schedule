import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import '../dialog.scss';
import './showDataDialog.scss';

import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { isEmpty, isNil } from 'lodash';
import i18n from '../../../helper/i18n';
import RenderStudentTable from '../../../helper/renderStudentTable';
import { getAllStudentsByGroupId, updateStudentService } from '../../../services/studentService';
import { successHandler } from '../../../helper/handlerAxios';
import { UploadFile } from '../../../components/UploadFile/UploadFile';

export const ShowStudentsDialog = (props) => {
    const { onClose, cardId, open, onDeleteStudent, students, onSubmit, match, groups, group } =
        props;
    const { t } = useTranslation('formElements');

    const [checkBoxStudents, setCheckBoxStudents] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);
    const [openUploadFile, setOpenUploadFile] = useState(false);
    const [showStudentList, setShowStudentList] = useState(false);
    const [groupOption, setGroupOption] = useState({});
    const [defaultGroup, setDefaultGroup] = useState({});

    useEffect(() => {
        if (!isNil(group.id)) {
            setDefaultGroup({ value: `${group.id}`, label: `${group.title}`, ...group });
        }
    }, [group.id]);
    useEffect(() => {
        getAllStudentsByGroupId(props.group.id);
    }, [open, openUploadFile]);
    useEffect(() => {
        setCheckBoxStudents(students.map((item) => ({ ...item, checked: false })));
    }, [props.students]);

    const setGroupsOption = () => {
        if (!isNil(groups)) {
            return groups.map((item) => ({ value: item.id, label: `${item.title}`, ...item }));
        }
        return [];
    };

    const groupsOption = setGroupsOption();

    const handleCheckElement = (event) => {
        setCheckBoxStudents(
            checkBoxStudents.map((checkbox, index) => {
                if (checkbox.id === Number(event.target.value)) {
                    checkBoxStudents[index].checked = event.target.checked;
                }
                return checkbox;
            }),
        );
    };
    const handleAllChecked = (event, pageItemsCount, page, rowsPerPage) => {
        const studentsTmp = [...checkBoxStudents];
        for (let i = page * rowsPerPage; i < pageItemsCount + page * rowsPerPage; i += 1) {
            studentsTmp[i].checked = event.target.checked;
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
            checkBoxStudents.map((checkbox, index) => {
                checkBoxStudents[index].checked = false;
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
    const getExistingGroupStudent = () => {
        successHandler(
            i18n.t('serviceMessages:students_exist_in_this_group', {
                cardType: i18n.t('common:student_title'),
                actionType: i18n.t('serviceMessages:student_label'),
            }),
        );
    };

    const setCurrentGroupOption = (currentGroup) => {
        if (currentGroup.id === defaultGroup.id) {
            getExistingGroupStudent();
        }
        setGroupOption(currentGroup);
    };

    const setSelectDisabled = () => {
        let resChecked = true;
        for (let i = 0; i < checkBoxStudents.length; i += 1) {
            if (checkBoxStudents[i].checked) {
                resChecked = false;
                break;
            }
        }
        return resChecked;
    };

    const changeStudentItem = (newGroup, student) => {
        const { checked, ...res } = student;
        return checked ? { ...res, group: { id: newGroup.id } } : {};
    };

    const clearSelection = () => {
        onClose('');
        setGroupOption({});
        setShowStudentList(false);
    };

    const handleSubmitGroupStudents = () => {
        if (isEmpty(groupOption)) {
            getExistingGroupStudent();
            return;
        }
        const { value, label, ...res } = groupOption;
        const resData = [];
        const prevGroup = { id: defaultGroup.id };
        checkBoxStudents.forEach((currentStudent) => {
            const resItem = changeStudentItem(res, currentStudent);
            if (!isEmpty(resItem)) {
                resData.push(resItem);
            }
        });
        resData.forEach((item) => updateStudentService({ ...item, prevGroup }));

        clearSelection();
    };
    const handleClose = () => {
        onClose(cardId);
    };
    const getDialog = () => {
        setShowStudentList(true);
    };
    const handleShowDialogFile = () => {
        setOpenUploadFile((prevState) => !prevState);
    };
    return (
        <>
            <Dialog
                disableBackdropClick
                onClose={handleClose}
                aria-labelledby="confirm-dialog-title"
                open={open}
            >
                <DialogTitle id="confirm-dialog-title">
                    {students.length === 0 ? (
                        <>
                            <h2 className="title-align">
                                {`${t('group_label')} - `}
                                <span>{`${group.title}`}</span>
                            </h2>
                            {t('no_exist_students_in_group')}
                        </>
                    ) : (
                        <span className="table-student-data">
                            <h3 className="title-align">
                                <span>
                                    {students.length !== 1
                                        ? `${t('students_label')} `
                                        : `${t('student_label')} `}
                                </span>
                                {`${t('group_students')} `}
                                <span>{`${group.title}`}</span>
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
                </DialogTitle>
                <div className="buttons-container">
                    <UploadFile
                        group={group}
                        open={openUploadFile}
                        handleCloseDialogFile={handleShowDialogFile}
                    />
                    <Button
                        className={
                            students.length !== 0
                                ? 'student-dialog-button-data'
                                : 'student-dialog-button-no-data'
                        }
                        variant="contained"
                        onClick={handleShowDialogFile}
                        color="primary"
                        title={i18n.t('upload_from_file')}
                    >
                        {i18n.t('common:upload_from_file_title')}
                    </Button>
                    {students.length !== 0 ? (
                        <Button
                            className="student-dialog-button-data"
                            variant="contained"
                            onClick={getDialog}
                            color="primary"
                            disabled={setSelectDisabled()}
                            title={i18n.t('choose_group_title')}
                        >
                            {i18n.t('choose_group_title')}
                        </Button>
                    ) : null}
                    <Button
                        className={
                            students.length !== 0
                                ? 'student-dialog-button-data'
                                : 'student-dialog-button-no-data'
                        }
                        variant="contained"
                        onClick={() => onClose('')}
                        color="primary"
                        title={i18n.t('close_title')}
                    >
                        {i18n.t('common:close_title')}
                    </Button>
                </div>
            </Dialog>

            {showStudentList && (
                <Dialog
                    disableBackdropClick
                    onClose={handleClose}
                    aria-labelledby="confirm-dialog-title"
                    open={open}
                >
                    <DialogTitle id="confirm-dialog-title" className="group-students">
                        <h6>
                            <Select
                                className="group-select"
                                defaultValue={defaultGroup}
                                options={groupsOption}
                                onChange={setCurrentGroupOption}
                            />
                        </h6>
                        <div className="buttons-container">
                            <Button
                                variant="contained"
                                onClick={handleSubmitGroupStudents}
                                color="primary"
                                title={i18n.t('move_to_group_title')}
                            >
                                {i18n.t('common:move_to_group_title')}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={clearSelection}
                                color="primary"
                                title={i18n.t('cancel_title')}
                            >
                                {i18n.t('cancel_title')}
                            </Button>
                        </div>
                    </DialogTitle>
                </Dialog>
            )}
        </>
    );
};

ShowStudentsDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default ShowStudentsDialog;
