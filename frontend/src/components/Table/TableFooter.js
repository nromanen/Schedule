import React from 'react';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { useTranslation } from 'react-i18next';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core';

import { ALL_PAGE, ROWS_PER_PAGE } from '../../constants/translationLabels/formElements';
import { RenderStudentTableActions } from './Pagination';

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

export const TableFooterComponent = (props) => {
    const { handleChangeRowsPerPage, handleChangePage, page, rowsPerPage, students = [] } = props;
    const ALL_ROWS = -1;
    const { t } = useTranslation('formElements');
    return (
        <TableFooter>
            <StyledTableRow>
                <TablePagination
                    labelRowsPerPage={`${t(ROWS_PER_PAGE)}`}
                    rowsPerPageOptions={[5, 10, 25, { label: `${t(ALL_PAGE)}`, value: ALL_ROWS }]}
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
    );
};
