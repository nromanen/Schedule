import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import '../dialog.scss';
import './showDataDialog.scss';

import i18n from '../../../helper/i18n';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import RenderStudentTable from '../../../helper/renderStudentTable';
import { getAllStudentsByGroupId, updateStudentService } from '../../../services/studentService';
import Select from 'react-select';
import { isObjectEmpty } from '../../../helper/ObjectRevision';
import { successHandler } from '../../../helper/handlerAxios';
import { UploadFile } from '../../../components/UploadFile/UploadFile';


export const ShowStudentsDialog = props => {
    const { onClose, cardId, open, onDeleteStudent, students, onSubmit, match, student, groups, group } = props;
    const [checkBoxStudents, setCheckBoxStudents] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);
    const [openUploadFile, setOpenUploadFile] = useState(false);
    const setDefaultGroupOption = () => {
        return { value: `${group.id}`, label: `${group.title}`, ...group };
    };
    const [groupOption, setGroupOption] = useState({});
    const [defaultGroup, setDefaultGroup] = useState({});
    useEffect(() => {
        if (group.id !== null)
            setDefaultGroup(setDefaultGroupOption());
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
        return groups !== undefined ? groups.map(item => {
            return { value: item.id, label: `${item.title}`, ...item };
        }) : null;

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
        let studentsTmp = [...checkBoxStudents];
        studentsTmp.forEach(student => {
            if (student.id === Number(event.target.value))
                student.checked = event.target.checked;
        });
        setCheckBoxStudents(studentsTmp);
    };
    const handleAllChecked = (event, pageItemsCount, page, rowsPerPage) => {
        let studentsTmp = [...checkBoxStudents];
        for (let i = (page) * rowsPerPage; i < pageItemsCount + (page) * rowsPerPage; i++) {
            studentsTmp[i].checked = event.target.checked;
        }
        setCheckBoxStudents(studentsTmp);
    };
    const handleAllCheckedBtn = (pageItemsCount, page, rowsPerPage) => {
        let studentsTmp = [...checkBoxStudents];
        let start = (page) * rowsPerPage;
        let finish = pageItemsCount + (page) * rowsPerPage;
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
        let studentsTmp = [...checkBoxStudents];
        studentsTmp.forEach(student => {
            if (student.checked) {
                student.checked = false;
            }
        });
        setCheckBoxStudents(studentsTmp);
    };
    const handleChangeCheckedAllBtn = () => {
        setCheckedAll(prevState => !prevState);
    };
    const handleClearCheckedAllBtn = () => {
        setCheckedAll(false);
    };


    const setCurrentGroupOption = (group) => {
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
    const setDisabledMoveToGroupBtn = () => {
        return setSelectDisabled();
    };
    const changeStudentItem = (group, student) => {
        let resData = {};
        if (student.checked) {
            const { checked, ...res } = student;
            resData = { ...res, group: { id: group.id } };
        }
        return resData;
    };
    const handleSubmitGroupStudents = () => {
        if (isObjectEmpty(groupOption)) {
            successHandler(
                i18n.t('serviceMessages:students_exist_in_this_group', {
                    cardType: i18n.t('common:student_title'),
                    actionType: i18n.t('serviceMessages:student_label')
                })
            );
        } else {
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
            ;
            resData.forEach(item => updateStudentService({ ...item, prevGroup }));
        }
        handleClearCheckedAllBtn();
    };
    const handleOpenDialogFile = () => {
        setOpenUploadFile(true);
    };
    const handleCloseDialogFile = () => {
        setOpenUploadFile(false);
    };
    return (
        <Dialog
            disableBackdropClick={true}
            onClose={handleClose}
            aria-labelledby='confirm-dialog-title'
            open={open}
        >

            <DialogTitle id='confirm-dialog-title'>
                <>

                    <>

                        {students.length === 0 ?

                            <>

                                <h2 className='title-align'>{`${t('group_label')} - `}<span>{`${props.group.title}`}</span>
                                </h2>
                                {t('no_exist_students_in_group')}
                            </>

                            :
                            <span className='table-student-data'>
                                    <h6>
                                      <Select
                                          className={'group-select'}
                                          defaultValue={defaultGroup}
                                          options={groupsOption}
                                          onChange={setCurrentGroupOption}
                                          isOptionDisabled={() => setSelectDisabled()}
                                      />
                                  </h6>
                                <h3 className='title-align'><span>{students.length !== 1 ? `${t('students_label')} ` : `${t('student_label')} `}</span>{`${t('group_students')} `}<span>{`${props.group.title}`}</span></h3>

                                    <RenderStudentTable group={props.group} onDeleteStudent={onDeleteStudent}
                                                        students={students} onSubmit={onSubmit}
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
                        }
                    </>
                </>
            </DialogTitle>
            <div className='buttons-container'>
                {<UploadFile group={group} open={openUploadFile} handleCloseDialogFile={handleCloseDialogFile} />}
                <Button
                    className={students.length !== 0 ? 'student-dialog-button-data' : 'student-dialog-button-no-data'}
                    variant='contained'
                    onClick={handleOpenDialogFile}
                    color='primary'
                    title={i18n.t('upload_from_file')}
                >
                    {i18n.t('common:upload_from_file_title')}
                </Button>
                {students.length !== 0 ?
                    <Button
                        className='student-dialog-button-data'
                        variant='contained'
                        onClick={handleSubmitGroupStudents}
                        color='primary'
                        disabled={setDisabledMoveToGroupBtn()}
                        title={i18n.t('move_to_group_title')}
                    >
                        {i18n.t('common:move_to_group_title')}
                    </Button>
                    : null}
                <Button
                    className={students.length !== 0 ? 'student-dialog-button-data' : 'student-dialog-button-no-data'}
                    variant='contained'
                    onClick={() => onClose('')}
                    color='primary'
                    title={i18n.t('close_title')}
                >
                    {i18n.t('common:close_title')}
                </Button>
            </div>
        </Dialog>
    );
};

ShowStudentsDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
    //currentGroup:state.groups.currentGroup
});

export default connect(mapStateToProps, {})(ShowStudentsDialog);

