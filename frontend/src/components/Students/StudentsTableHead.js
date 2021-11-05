import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import './StudentTable.scss';
import { useTranslation } from 'react-i18next';
import {
    SELECT_ALL,
    SEND_LETTER_LABEL,
    STUDENT_ACTIONS,
    STUDENT_FULL_NAME,
} from '../../constants/translationLabels/formElements';

export const StudentsTableHead = (props) => {
    const { checkedAll, checkedAllOnPageClick } = props;
    const { t } = useTranslation('formElements');

    return (
        <TableHead>
            <TableRow>
                <TableCell>
                    <span className="checked-all">
                        <input
                            id="checked-all-input"
                            type="checkbox"
                            checked={checkedAll}
                            onClick={checkedAllOnPageClick}
                            value="checkedAll"
                            title={`${t(SELECT_ALL)}`}
                        />
                    </span>
                </TableCell>
                <TableCell>{t(STUDENT_FULL_NAME)}</TableCell>
                <TableCell>{t(SEND_LETTER_LABEL)}</TableCell>
                <TableCell>{t(STUDENT_ACTIONS)}</TableCell>
            </TableRow>
        </TableHead>
    );
};
