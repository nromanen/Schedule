import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { useTranslation } from 'react-i18next';
import { FaEnvelope } from 'react-icons/fa';
import TableHead from '@material-ui/core/TableHead';
import { withStyles } from '@material-ui/core';
import { FaEdit } from 'react-icons/all';
import { Delete } from '@material-ui/icons';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectStudentService } from '../services/studentService';
import './renderStudentTable.scss';
import { getTeacherFullName } from './renderTeacher';
import { links } from '../constants/links';
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
import { CustomDialog } from '../share/DialogWindows';
import { dialogTypes } from '../constants/dialogs';
import AddStudentDialog from '../containers/Student/AddStudentDialog';

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

function RenderStudentTableActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

RenderStudentTableActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

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

export default function RenderStudentTable(props) {
    const ALL_ROWS = -1;
    const classes = useStyles2();
    const {
        students,
        onDeleteStudent,
        onSubmit,
        group,
        match,
        checkBoxStudents,
        handleCheckElement,
        handleAllChecked,
        handleAllClear,
        handleChangeCheckedAllBtn,
        handleClearCheckedAllBtn,
        checkedAllBtn,
        handleAllCheckedBtn,
    } = props;
    const [page, setPage] = React.useState(0);
    const [student, setStudent] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const { t } = useTranslation('formElements');
    const handleEdit = (curentStudent) => {
        setOpenEditDialog(true);
        setStudent(curentStudent);
    };
    useEffect(() => {
        if (match.path.includes(links.Student) && match.path.includes(links.Edit)) {
            handleEdit(student.id);
        }
    }, [props.group.id]);
    useEffect(() => {
        if (match.path.includes(links.Student) && match.path.includes(links.Delete)) {
            setOpenDeleteDialog(true);
        }
    }, [props.group.id]);

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
        setOpenDeleteDialog(false);
        onDeleteStudent(studentItem);
    };
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        selectStudentService(null);
    };
    const handleSubmit = (data) => {
        setOpenEditDialog(false);
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
                                        to={`${links.GroupList}${links.Group}/${group.id}${links.Student}/${singleStudent.id}${links.Edit}`}
                                    >
                                        <FaEdit
                                            className="edit-button"
                                            title={t(EDIT_TITLE)}
                                            onClick={() => handleEdit(singleStudent)}
                                        />
                                    </Link>
                                    <Link
                                        to={`${links.GroupList}${links.Group}/${group.id}${links.Student}/${singleStudent.id}${links.Delete}`}
                                    >
                                        <Delete
                                            title={t(DELETE_TITLE_LABEL)}
                                            className="delete-button"
                                            onClick={() => setOpenDeleteDialog(true)}
                                        />
                                    </Link>
                                </span>
                            </StyledTableCell>

                            {openEditDialog && (
                                <AddStudentDialog
                                    open={openEditDialog}
                                    student={student}
                                    group={group}
                                    setOpen={handleCloseEditDialog}
                                />
                            )}

                            <CustomDialog
                                type={dialogTypes.DELETE_CONFIRM}
                                cardId={student}
                                whatDelete="student"
                                open={openDeleteDialog}
                                onClose={deleteStudent}
                            />
                        </StyledTableRow>
                    ))}

                    {emptyRows > 0 && (
                        <StyledTableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </StyledTableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <StyledTableRow>
                        <TablePagination
                            labelRowsPerPage={`${t(ROWS_PER_PAGE)}`}
                            rowsPerPageOptions={[
                                5,
                                10,
                                25,
                                { label: `${t(ALL_PAGE)}`, value: ALL_ROWS },
                            ]}
                            colSpan={3}
                            count={students.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={RenderStudentTableActions}
                        />
                    </StyledTableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

const mapStateToProps = (state) => ({
    student: state.students.student,
});

connect(mapStateToProps, {})(RenderStudentTable);
