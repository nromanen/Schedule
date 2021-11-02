import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import '../../helper/renderStudentTable.scss';
import { makeStyles } from '@material-ui/core/styles';

import { TableFooterComponent } from '../Table/TableFooter';
import { StudentsTableBody } from './StudentsTableBody';
import { StudentsTableHead } from './StudentsTableHead';

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

export const StudentsTable = (props) => {
    const { students } = props;
    const classes = useStyles2();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
console.log(rowsPerPage);
    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="custom pagination table">
                    <StudentsTableHead {...props} />
                    <StudentsTableBody
                        page={page}
                        students={students}
                        rowsPerPage={rowsPerPage}
                        {...props}
                    />
                    <TableFooterComponent
                        page={page}
                        items={students}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                    />
                </Table>
            </TableContainer>
        </>
    );
};
