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
        setIsOpenUpdateDialog,
        currentStudentsOnList,
        setIsOpenConfirmDialog,
    } = props;
    const { t } = useTranslation('formElements');

    const sendMail = (email) => {
        const mailto = `mailto:${email}`;
        window.location.href = mailto;
    };

    return (
        <TableBody>
            {currentStudentsOnList.map((student) => (
                <StyledTableRow key={student.id}>
                    <StyledTableCell component="th" scope="row" align="center">
                        <input
                            onClick={(e) => checkStudent(e)}
                            type="checkbox"
                            checked={student.checked}
                            value={student.id}
                            className="checked-box"
                            title={`${t(SELECT_STUDENT)} ${getTeacherFullName(student)}`}
                        />
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="center">
                        {getTeacherFullName(student)}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="center">
                        <span>
                            <button
                                className="send-letter-button"
                                title={`${t(SEND_LETTER_LABEL)} ${student.email}`}
                                onClick={() => sendMail(student.email)}
                                type="button"
                            >
                                {student.email}
                            </button>
                        </span>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="center">
                        <span className="edit-cell">
                            <Link
                                to={`${GROUP_LIST_LINK}${GROUP_LINK}/${group.id}${STUDENT_LINK}/${student.id}${EDIT_LINK}`}
                            >
                                <FaEdit
                                    className="edit-button"
                                    title={t(EDIT_TITLE)}
                                    onClick={() => {
                                        setStudent(student);
                                        setIsOpenUpdateDialog(true);
                                    }}
                                />
                            </Link>
                            <Link
                                to={`${GROUP_LIST_LINK}${GROUP_LINK}/${group.id}${STUDENT_LINK}/${student.id}${DELETE_LINK}`}
                            >
                                <Delete
                                    title={t(DELETE_TITLE_LABEL)}
                                    className="delete-button"
                                    onClick={() => {
                                        setStudent(student);
                                        setIsOpenConfirmDialog(true);
                                    }}
                                />
                            </Link>
                        </span>
                    </StyledTableCell>
                </StyledTableRow>
            ))}
        </TableBody>
    );
};
