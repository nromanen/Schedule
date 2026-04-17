import React from 'react';
import './StudentTable.scss';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import {useTranslation} from 'react-i18next';
import Checkbox from '@mui/material/Checkbox';
import {
    EMAIL_LABEL,
    SELECT_ALL,
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
                    <Checkbox
                        className="checkbox-table-body"
                        value="checkedAll"
                        checked={checkedAll}
                        onChange={checkedAllOnPageClick}
                        color="primary"
                        size="small"
                        title={`${t(SELECT_ALL)}`}
                    />
                </TableCell>
                <TableCell>{t(STUDENT_FULL_NAME)}</TableCell>
                <TableCell>{t(EMAIL_LABEL)}</TableCell>
                <TableCell>{t(STUDENT_ACTIONS)}</TableCell>
            </TableRow>
        </TableHead>
    );
};
