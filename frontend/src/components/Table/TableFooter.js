import React from 'react';
import './TableFooter.scss';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { useTranslation } from 'react-i18next';

import { ALL_PAGE, ROWS_PER_PAGE } from '../../constants/translationLabels/formElements';
import { RenderStudentTableActions } from './Pagination';

export const TableFooterComponent = (props) => {
    const { page, setPage, rowsPerPage, setRowsPerPage, items } = props;
    const ALL_ROWS = -1;
    const { t } = useTranslation('formElements');
    const onRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <TableFooter>
            <div className="table-footer">
                <TablePagination
                    labelRowsPerPage={`${t(ROWS_PER_PAGE)}`}
                    rowsPerPageOptions={[5, 10, 25, { label: `${t(ALL_PAGE)}`, value: ALL_ROWS }]}
                    colSpan={4}
                    count={items.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                    }}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={onRowsPerPageChange}
                    ActionsComponent={RenderStudentTableActions}
                />
            </div>
        </TableFooter>
    );
};
