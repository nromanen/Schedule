import React from 'react';
import './StudentTable.scss';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { useTranslation } from 'react-i18next';
import Checkbox from '@material-ui/core/Checkbox';
import {
    SELECT_ALL,
    EMAIL_LABEL,
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
                    {/* <span className="checked-all">
                        <input
                            id="student-checked-all-box"
                            type="checkbox"
                            checked={checkedAll}
                            onChange={checkedAllOnPageClick}
                            value="checkedAll"
                            title={`${t(SELECT_ALL)}`}
                            color="primary"
                        />
                    </span> */}
                    <Checkbox
                        value="checkedAll"
                        checked={checkedAll}
                        onChange={checkedAllOnPageClick}
                        color="primary"
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
