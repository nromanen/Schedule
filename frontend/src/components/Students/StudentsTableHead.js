import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { FaEnvelope } from 'react-icons/fa';
import TableHead from '@material-ui/core/TableHead';
import { withStyles } from '@material-ui/core';
import '../../helper/renderStudentTable.scss';
import { useTranslation } from 'react-i18next';
import {
    SELECT_ALL,
    STUDENT_LABEL,
    SEND_LETTER_LABEL,
    STUDENT_ACTIONS,
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

export const StudentsTableHead = (props) => {
    const { checkedAllBtn, handleAllOnPageClick } = props;
    const { t } = useTranslation('formElements');
    return (
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
    );
};
