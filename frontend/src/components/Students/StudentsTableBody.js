import React from 'react';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { useTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import { FaEdit } from 'react-icons/all';
import { Delete } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import '../../helper/renderStudentTable.scss';
import { getTeacherFullName } from '../../helper/renderTeacher';
import {
    STUDENT_LINK,
    EDIT_LINK,
    DELETE_LINK,
    GROUP_LINK,
    GROUP_LIST_LINK,
} from '../../constants/links';
import {
    EDIT_TITLE,
    SEND_LETTER_LABEL,
    SELECT_STUDENT,
    DELETE_TITLE_LABEL,
} from '../../constants/translationLabels/formElements';

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

export const StudentsTableBody = (props) => {
    const {
        group,
        setStudent,
        checkStudent,
        selectStudentSuccess,
        setIsOpenUpdateDialog,
        currentStudentsOnList,
        setIsOpenConfirmDialog,
    } = props;
    const { t } = useTranslation('formElements');

    const sendMail = (email) => {
        const mailto = `mailto:${email}`;
        window.location.href = mailto;
    };

    const showUpdateStudentDialog = (currentStudent) => {
        setIsOpenUpdateDialog(true);
        selectStudentSuccess(currentStudent);
    };

    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, students.length - page * rowsPerPage);
    return (
        <TableBody>
            {currentStudentsOnList.map((singleStudent) => (
                <StyledTableRow key={singleStudent.id}>
                    <StyledTableCell component="th" scope="row" align="center">
                        <input
                            key={singleStudent.id}
                            onClick={(e) => checkStudent(e)}
                            type="checkbox"
                            checked={singleStudent.checked}
                            value={singleStudent.id}
                            className="checked-box"
                            title={`${t(SELECT_STUDENT)} ${getTeacherFullName(singleStudent)}`}
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
                                    onClick={() => {
                                        setStudent(singleStudent);
                                        showUpdateStudentDialog(singleStudent);
                                    }}
                                />
                            </Link>
                            <Link
                                to={`${GROUP_LIST_LINK}${GROUP_LINK}/${group.id}${STUDENT_LINK}/${singleStudent.id}${DELETE_LINK}`}
                            >
                                <Delete
                                    title={t(DELETE_TITLE_LABEL)}
                                    className="delete-button"
                                    onClick={() => {
                                        setStudent(singleStudent);
                                        setIsOpenConfirmDialog(true);
                                    }}
                                />
                            </Link>
                        </span>
                    </StyledTableCell>
                </StyledTableRow>
            ))}

            {/* {emptyRows > 0 && (
                <StyledTableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                </StyledTableRow>
            )} */}
        </TableBody>
    );
};
