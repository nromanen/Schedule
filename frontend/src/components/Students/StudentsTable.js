import React, { useState, useEffect } from 'react';
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
    const { students, setCheckBoxStudents, checkBoxStudents, setIsGroupButtonDisabled } = props;
    const classes = useStyles2();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [checkedAll, setCheckedAll] = useState(false);

    const parseStudentToCheckBox = () => {
        const newData = students.map((item) => {
            return { ...item, checked: false };
        });
        setCheckBoxStudents(newData);
    };

    useEffect(() => {
        parseStudentToCheckBox();
    }, [students]);

    const currentStudentsOnList = checkBoxStudents.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    const checkedAllOnPageClick = () => {
        setCheckBoxStudents(
            checkBoxStudents.map((item) => {
                const newItem = item;
                currentStudentsOnList.forEach((element) => {
                    if (element.id === item.id) newItem.checked = !checkedAll;
                });
                return newItem;
            }),
        );
    };

    const isCheckedAll = () => {
        setCheckedAll(currentStudentsOnList.every((item) => item.checked));
    };

    const checkStudent = (event) => {
        setCheckBoxStudents(
            checkBoxStudents.map((item) => {
                const checkbox = item;
                if (item.id === Number(event.target.value)) {
                    checkbox.checked = event.target.checked;
                }
                return checkbox;
            }),
        );
        isCheckedAll();
    };
    const checkIsDisabledBtn = () => {
        if (checkBoxStudents.find((item) => item.checked === true)) {
            setIsGroupButtonDisabled(false);
        } else {
            setIsGroupButtonDisabled(true);
        }
    };

    useEffect(() => {
        isCheckedAll();
        checkIsDisabledBtn();
    }, [currentStudentsOnList]);

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="custom pagination table">
                    <StudentsTableHead
                        checkedAll={checkedAll}
                        checkedAllOnPageClick={checkedAllOnPageClick}
                    />
                    <StudentsTableBody
                        page={page}
                        students={students}
                        rowsPerPage={rowsPerPage}
                        checkStudent={checkStudent}
                        setCheckedAll={setCheckedAll}
                        setCheckBoxStudents={setCheckBoxStudents}
                        currentStudentsOnList={currentStudentsOnList}
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
