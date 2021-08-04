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
import { getTeacherFullName } from './renderTeacher';
import { useTranslation } from 'react-i18next';
import { FaEnvelope } from 'react-icons/fa';
import TableHead from '@material-ui/core/TableHead';
import { withStyles } from '@material-ui/core';
import { FaEdit } from 'react-icons/all';
import { Delete } from '@material-ui/icons';
import ConfirmDialog from '../share/modals/dialog';
import  AddStudentDialog  from '../share/modals/modal/AddStudentDialog';
import { selectStudentService } from '../services/studentService';
import './renderStudentTable.scss'
import { links } from '../constants/links';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

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
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
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
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const {students,onDeleteStudent,onSubmit,group}=props;
    const [openDeleteDialog,setOpenDeleteDialog]=useState(false);
    const [openEditDialog,setOpenEditDialog]=useState(false);
    const { t } = useTranslation('formElements');
    const {match,student}=props;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, students.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const sendMail = (email) => {
        const mailto =
            // "mailto:mail@gmail.com?subject=Test subject&body=Body content";
            `mailto:${email}`;
        window.location.href = mailto;
    }
    const deleteStudent = (student) => {
        setOpenDeleteDialog(false);
        onDeleteStudent(student);
    }
    const handleEdit=(studentId)=>{
        setOpenEditDialog(true);
        selectStudentService(studentId)
    }
    const handleCloseEditDialog=()=>{
        setOpenEditDialog(false);
        selectStudentService(null)
    }
    const handleSubmit=(data)=>{
        setOpenEditDialog(false);
        const sendObject={...data,prevGroup:group}
        onSubmit(sendObject);
    }
    useEffect(()=>{
        if(match.path.includes(links.Student)&&match.path.includes(links.Edit)) {
            handleEdit(student.id)
        }
    },[props.group.id])
    useEffect(()=>{
        if(match.path.includes(links.Student)&&match.path.includes(links.Delete)) {
            setOpenDeleteDialog(true)
        }
    },[props.group.id])
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">

                <TableHead>
                    <TableRow>
                        <StyledTableCell>{t('student_label')}</StyledTableCell>
                        <StyledTableCell>
                            <FaEnvelope
                                className="svg-btn send-message"
                                title={`${t('send_letter_title')}`}
                            />
                        </StyledTableCell>
                        <StyledTableCell>{t('change_student')}</StyledTableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {(rowsPerPage > 0
                            ? students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : students
                    ).map((student) => (
                        <StyledTableRow key={student.id}>
                            <StyledTableCell component="th" scope="row" align="center" style={{ width: 160 }}>
                                {getTeacherFullName(student)}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row" align="center">
                                <span>
                                   <button className="send-letter-button"
                                       title={`${t('send_letter_title')} ${student.email}`}
                                       onClick={()=>sendMail(student.email)}
                                   >
                                       {student.email}
                                   </button>
                                </span>

                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row" align="center"  style={{ width: 160 }}>
                                <span className="edit-cell">
                                     <Link to={`${links.GroupList}${links.Group}/${group.id}${links.Student}/${student.id}${links.Edit}`}>
                                    <FaEdit
                                        className="edit-button"
                                        title={t('edit_title')}
                                        onClick={() => handleEdit(student.id)}
                                    />
                                     </Link>
                                     <Link to={`${links.GroupList}${links.Group}/${group.id}${links.Student}/${student.id}${links.Delete}`}>
                                <Delete
                                    title={t('delete-title')}
                                    className="delete-button"
                                    onClick={()=>setOpenDeleteDialog(true)}
                                />
                                     </Link>
                                </span>

                            </StyledTableCell>

                            <AddStudentDialog
                                open={openEditDialog}
                                onSubmit={handleSubmit}
                                onSetSelectedCard={handleCloseEditDialog}
                                match={match}
                            />

                            <ConfirmDialog
                                selectedValue={''}
                                cardId={student}
                                whatDelete={'student'}
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
                            labelRowsPerPage={`${t('rows_per_page')}`}
                            rowsPerPageOptions={[5, 10, 25, { label: `${t('all_page')}`, value: -1 }]}
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

const mapStateToProps = state => ({
    student:state.students.student
});

 connect(mapStateToProps, {})(RenderStudentTable);