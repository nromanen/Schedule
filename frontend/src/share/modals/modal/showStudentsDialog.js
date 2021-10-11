import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import '../dialog.scss';
import './showDataDialog.scss';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import i18n from '../../../helper/i18n';
import RenderStudentTable from '../../../helper/renderStudentTable';
import { getAllStudentsByGroupId, updateStudentService } from '../../../services/studentService';
import { isObjectEmpty } from '../../../helper/ObjectRevision';
import { successHandler } from '../../../helper/handlerAxios';
import { UploadFile } from '../../../components/UploadFile/UploadFile';
import {
    GROUP_LABEL,
    STUDENT_LABEL,
    EXIST_LABEL,
    GROUP_STUDENTS,
    STUDENTS_LABEL,
    NO_EXIST_STUDENTS_AT_GROUP,
    STUDENTS_EXIST_IN_THIS_GROUP,
} from '../../../constants/translationLabels';
import {
    COMMON_STUDENT_TITLE,
    COMMON_CLOSE_TITLE,
    COMMON_UPLOAD_FROM_FILE_TITLE,
    UPLOAD_FROM_FILE,
    MOVE_TO_GROUP_TITLE,
    COMMON_MOVE_TO_GROUP_TITLE,
} from '../../../constants/translationLabels/common';

export const ShowStudentsDialog = (props) => {
    const {
        onClose,
        cardId,
        open,
        onDeleteStudent,
        students,
        onSubmit,
        match,
        student,
        groups,
        group,
    } = props;
    const [checkBoxStudents, setCheckBoxStudents] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);
    const [openUploadFile, setOpenUploadFile] = useState(false);
    const [showStudentList, setShowStudentList] = useState(false);
    const setDefaultGroupOption = () => {
        return { value: `${group.id}`, label: `${group.title}`, ...group };
    };
    const [groupOption, setGroupOption] = useState({});
    const [defaultGroup, setDefaultGroup] = useState({});
    useEffect(() => {
        if (group.id !== null) setDefaultGroup(setDefaultGroupOption());
    }, [group.id]);
    const { t } = useTranslation('formElements');
    useEffect(() => {
        getAllStudentsByGroupId(props.group.id);
    }, [open]);
    useEffect(() => {
        getAllStudentsByGroupId(props.group.id);
    }, [openUploadFile]);
    useEffect(() => {
        parseStudentToCheckBox();
    }, [props.students]);

    const setGroupsOption = () => {
        return groups !== undefined
            ? groups.map((item) => {
                  return { value: item.id, label: `${item.title}`, ...item };
              })
            : null;
    };

    const groupsOption = setGroupsOption();
    const handleClose = () => {
        onClose(cardId);
    };

    const parseStudentToCheckBox = () => {
        const studentsCheckBox = [...students];
        const res = studentsCheckBox.map((item) => {
            return { ...item, checked: false };
        });
        setCheckBoxStudents(res);
    };
    const handleCheckElement = (event) => {
        const studentsTmp = [...checkBoxStudents];
        studentsTmp.forEach((student) => {
            if (student.id === Number(event.target.value)) student.checked = event.target.checked;
        });
        setCheckBoxStudents(studentsTmp);
    };
    const handleAllChecked = (event, pageItemsCount, page, rowsPerPage) => {
        const studentsTmp = [...checkBoxStudents];
        for (let i = page * rowsPerPage; i < pageItemsCount + page * rowsPerPage; i++) {
            studentsTmp[i].checked = event.target.checked;
        }
        setCheckBoxStudents(studentsTmp);
    };
    const handleAllCheckedBtn = (pageItemsCount, page, rowsPerPage) => {
        const studentsTmp = [...checkBoxStudents];
        let start = page * rowsPerPage;
        const finish = pageItemsCount + page * rowsPerPage;
        while (start < finish) {
            if (studentsTmp[start].checked) {
                start++;
            } else {
                break;
            }
        }
        setCheckedAll(start === finish && start !== 0);
    };
    const handleAllClear = () => {
        const studentsTmp = [...checkBoxStudents];
        studentsTmp.forEach((student) => {
            if (student.checked) {
                student.checked = false;
            }
        });
        setCheckBoxStudents(studentsTmp);
    };
    const handleChangeCheckedAllBtn = () => {
        setCheckedAll((prevState) => !prevState);
    };
    const handleClearCheckedAllBtn = () => {
        setCheckedAll(false);
    };

    const setCurrentGroupOption = (group) => {
        if (group.id === defaultGroup.id) {
            getExistingGroupStudent();
        }
        setGroupOption(group);
    };
    const isChecked = ({ checked }) => {
        return checked;
    };
    const setSelectDisabled = () => {
        let resChecked = true;
        for (let i = 0; i < checkBoxStudents.length; i++) {
            if (isChecked(checkBoxStudents[i])) {
                resChecked = false;
                break;
            }
        }
        return resChecked;
    };
    const isChooseCurrentGroup = () => {
        if (isObjectEmpty(groupOption)) {
            return true;
        }
        return groupOption.id === defaultGroup.id;
    };
    const setDisabledMoveToGroupBtn = () => {
        return isChooseCurrentGroup();
    };
    const changeStudentItem = (group, student) => {
        let resData = {};
        if (student.checked) {
            const { checked, ...res } = student;
            resData = { ...res, group: { id: group.id } };
        }
        return resData;
    };
    const getExistingGroupStudent = () => {
        return successHandler(
            i18n.t(STUDENTS_EXIST_IN_THIS_GROUP, {
                cardType: i18n.t(COMMON_STUDENT_TITLE),
                actionType: i18n.t(EXIST_LABEL),
            }),
        );
    };
    const clearSelection = () => {
        // handleClearCheckedAllBtn();
        onClose('');
        setGroupOption({});
        setShowStudentList(false);
    };
    const handleSubmitGroupStudents = () => {
        if (isObjectEmpty(groupOption)) {
            getExistingGroupStudent();
            return;
        }

        const { value, label, ...res } = groupOption;
        const currentStudents = [...checkBoxStudents];
        const resData = [];
        const prevGroup = { id: defaultGroup.id };
        for (let i = 0; i < currentStudents.length; i++) {
            const resItem = changeStudentItem(res, currentStudents[i]);
            if (!isObjectEmpty(resItem)) {
                resData.push(resItem);
            }
        }
        resData.forEach((item) => updateStudentService({ ...item, prevGroup }));

        clearSelection();
    };
    const cancelChoosing = () => {
        clearSelection();
    };
    const getDialog = () => {
        setShowStudentList(true);
    };
    const handleOpenDialogFile = () => {
        setOpenUploadFile(true);
    };
    const handleCloseDialogFile = () => {
        setOpenUploadFile(false);
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
                    <>
                        <>
                            {students.length === 0 ? (
                                <>
                                    <h2 className="title-align">
                                        {`${t(GROUP_LABEL)} - `}
                                        <span>{`${props.group.title}`}</span>
                                    </h2>
                                    {t(NO_EXIST_STUDENTS_AT_GROUP)}
                                </>
                            ) : (
                                <span className="table-student-data">
                                    <h3 className="title-align">
                                        <span>
                                            {students.length !== 1
                                                ? `${t(STUDENTS_LABEL)} `
                                                : `${t(STUDENT_LABEL)} `}
                                        </span>
                                        {`${t(GROUP_STUDENTS)} `}
                                        <span>{`${props.group.title}`}</span>
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
                        </>
                    </>
                </DialogTitle>
                <div className="buttons-container">
                    <UploadFile
                        group={group}
                        open={openUploadFile}
                        handleCloseDialogFile={handleCloseDialogFile}
                    />
                    <Button
                        className={
                            students.length !== 0
                                ? 'student-dialog-button-data'
                                : 'student-dialog-button-no-data'
                        }
                        variant="contained"
                        onClick={handleOpenDialogFile}
                        color="primary"
                        title={i18n.t(UPLOAD_FROM_FILE)}
                    >
                        {i18n.t(COMMON_UPLOAD_FROM_FILE_TITLE)}
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
                        {i18n.t(COMMON_CLOSE_TITLE)}
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
                        <>
                            <h6>
                                <Select
                                    className="group-select"
                                    defaultValue={defaultGroup}
                                    options={groupsOption}
                                    onChange={setCurrentGroupOption}
                                />
                            </h6>
                        </>
                        <div className="buttons-container">
                            <Button
                                variant="contained"
                                onClick={handleSubmitGroupStudents}
                                color="primary"
                                title={i18n.t(MOVE_TO_GROUP_TITLE)}
                            >
                                {i18n.t(COMMON_MOVE_TO_GROUP_TITLE)}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={cancelChoosing}
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
const mapStateToProps = (state) => ({
    // currentGroup:state.groups.currentGroup
});

export default connect(mapStateToProps, {})(ShowStudentsDialog);
