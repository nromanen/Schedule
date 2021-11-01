import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import { FaEnvelope } from 'react-icons/fa';
import TableHead from '@material-ui/core/TableHead';
import { withStyles } from '@material-ui/core';
import { FaEdit } from 'react-icons/all';
import { Delete } from '@material-ui/icons';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectStudentService } from '../services/studentService';
import { setIsOpenConfirmDialog } from '../actions';
import './renderStudentTable.scss';
import { getTeacherFullName } from './renderTeacher';
import {
    STUDENT_LINK,
    EDIT_LINK,
    DELETE_LINK,
    GROUP_LINK,
    GROUP_LIST_LINK,
} from '../constants/links';
import {
    EDIT_TITLE,
    SELECT_ALL,
    STUDENT_LABEL,
    SEND_LETTER_LABEL,
    STUDENT_ACTIONS,
    SELECT_STUDENT,
    DELETE_TITLE_LABEL,
    ALL_PAGE,
    ROWS_PER_PAGE,
} from '../constants/translationLabels/formElements';
import CustomDialog from '../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../constants/dialogs';
import AddStudentDialog from '../containers/Students/AddStudentDialog';
import { TableFooterComponent } from '../components/Table/TableFooter';
import MovingGroupsDialog from '../share/DialogWindows/_dialogWindows/MovingGroupsDialog';

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function RenderStudentTable(props) {
    const ALL_ROWS = -1;
    const classes = useStyles2();
    const {
        students,
        onDeleteStudent,
        onSubmit,
        group,
        handleClearCheckedAllBtn,
        checkedAllBtn,
        setOpenConfirmDialog,
        isOpenConfirmDialog,
        setIsGroupButtonDisabled,
        isOpenStudentListDialog,
        setIsOpenStudentListDialog,
        groups,
    } = props;
    const [page, setPage] = useState(0);
    const [student, setStudent] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
    const [checkBoxStudents, setCheckBoxStudents] = useState([]);
    const [checkedAll, setCheckedAll] = useState(false);
    const { t } = useTranslation('formElements');
    const handleEdit = (curentStudent) => {
        setIsOpenEditDialog(true);
        setStudent(curentStudent);
    };

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
        parseStudentToCheckBox();
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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, students.length - page * rowsPerPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        handleAllClear();
        handleClearCheckedAllBtn();
    };
    const sendMail = (email) => {
        const mailto = `mailto:${email}`;
        window.location.href = mailto;
    };
    const deleteStudent = (studentItem) => {
        setOpenConfirmDialog(false);
        onDeleteStudent(studentItem);
    };
    const handleCloseEditDialog = () => {
        setIsOpenEditDialog(false);
        selectStudentService(null);
    };
    const handleSubmit = (data) => {
        setIsOpenEditDialog(false);
        const sendObject = { ...data, prevGroup: group };
        onSubmit(sendObject);
    };
    const getCorrectRowCount = (pageItemsCount) => {
        const resRows = checkBoxStudents.length - pageItemsCount * page;
        if (pageItemsCount > resRows || pageItemsCount === ALL_ROWS) {
            return resRows;
        }
        return pageItemsCount;
    };
    const handleAllOnPageClick = (event) => {
        const rowsCount = getCorrectRowCount(rowsPerPage);
        handleChangeCheckedAllBtn();
        handleAllChecked(event, rowsCount, page, rowsPerPage);
    };
    const detectCheckingCheckAllBtn = () => {
        const rowsCount = getCorrectRowCount(rowsPerPage);
        handleAllCheckedBtn(rowsCount, page, rowsPerPage);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleCheckElem = (event) => {
        handleCheckElement(event);
        detectCheckingCheckAllBtn();
    };
    useEffect(() => {
        detectCheckingCheckAllBtn();
    }, [page]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell className="check-box">
                                <span className="checked-all">
                                    <input
                                        id="checked-all-input"
                                        type="checkbox"
                                        checked={checkedAllBtn}
                                        onClick={handleAllOnPageClick}
                                        value="checkedAll"
                                        title={`${t(SELECT_ALL)}`}
                                    />
                                </span>
                            </StyledTableCell>
                            <StyledTableCell>{t(STUDENT_LABEL)}</StyledTableCell>
                            <StyledTableCell>
                                <FaEnvelope
                                    className="svg-btn send-message"
                                    title={`${t(SEND_LETTER_LABEL)}`}
                                />
                            </StyledTableCell>
                            <StyledTableCell>{t(STUDENT_ACTIONS)}</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {(rowsPerPage > 0
                            ? checkBoxStudents.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage,
                              )
                            : checkBoxStudents
                        ).map((singleStudent) => (
                            <StyledTableRow key={singleStudent.id}>
                                <StyledTableCell component="th" scope="row" align="center">
                                    <input
                                        key={singleStudent.id}
                                        onClick={handleCheckElem}
                                        type="checkbox"
                                        checked={singleStudent.checked}
                                        value={singleStudent.id}
                                        className="checked-box"
                                        title={`${t(SELECT_STUDENT)} ${getTeacherFullName(
                                            singleStudent,
                                        )}`}
                                    />
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row" align="center">
                                    {getTeacherFullName(singleStudent)}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row" align="center">
                                    <span>
                                        <button
                                            className="send-letter-button"
                                            title={`${t(SEND_LETTER_LABEL)} ${singleStudent.email}`}
                                            onClick={() => sendMail(singleStudent.email)}
                                            type="button"
                                        >
                                            {singleStudent.email}
                                        </button>
                                    </span>
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row" align="center">
                                    <span className="edit-cell">
                                        <Link
                                            to={`${GROUP_LIST_LINK}${GROUP_LINK}/${group.id}${STUDENT_LINK}/${singleStudent.id}${EDIT_LINK}`}
                                        >
                                            <FaEdit
                                                className="edit-button"
                                                title={t(EDIT_TITLE)}
                                                onClick={() => handleEdit(singleStudent)}
                                            />
                                        </Link>
                                        <Link
                                            to={`${GROUP_LIST_LINK}${GROUP_LINK}/${group.id}${STUDENT_LINK}/${singleStudent.id}${DELETE_LINK}`}
                                        >
                                            <Delete
                                                title={t(DELETE_TITLE_LABEL)}
                                                className="delete-button"
                                                onClick={() => setOpenConfirmDialog(true)}
                                            />
                                        </Link>
                                    </span>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}

                        {emptyRows > 0 && (
                            <StyledTableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </StyledTableRow>
                        )}
                    </TableBody>
                    <TableFooterComponent />
                </Table>
            </TableContainer>
            
            {isOpenEditDialog && (
                <AddStudentDialog
                    open={isOpenEditDialog}
                    student={student}
                    group={group}
                    setOpen={handleCloseEditDialog}
                />
            )}

            <CustomDialog
                type={dialogTypes.DELETE_CONFIRM}
                whatDelete="student"
                open={isOpenConfirmDialog}
                handelConfirm={() => deleteStudent(student)}
            />
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
        </>
    );
}

const mapStateToProps = (state) => ({
    student: state.students.student,
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});
const mapDispatchToProps = (dispatch) => ({
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RenderStudentTable);
