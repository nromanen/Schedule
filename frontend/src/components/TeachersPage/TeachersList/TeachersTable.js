import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { isEmpty } from 'lodash';

import { dialogTypes } from '../../../constants/dialogs';
import {
    FORM_TEACHER_A_LABEL,
    TEACHER_SURNAME,
    TEACHER_FIRST_NAME,
    TEACHER_PATRONYMIC,
    TEACHER_POSITION,
    DEPARTMENT_TEACHER_LABEL,
    EMAIL_FIELD,
} from '../../../constants/translationLabels/formElements';
import {
    COMMON_DELETE_HOVER_TITLE,
    COMMON_EDIT_HOVER_TITLE,
    COMMON_SET_DISABLED,
    COMMON_SET_ENABLED,
} from '../../../constants/translationLabels/common';
import NotFound from '../../../share/NotFound/NotFound';
import './TeachersTable.scss';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const TeachersTable = (props) => {
    const { t } = useTranslation('formElements');
    const { t: tCommon } = useTranslation('common');

    const { visibleItems, isDisabled, showConfirmDialog, selectedTeacherCard } = props;

    const [sortConfig, setSortConfig] = useState({ key: 'surname', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        setCurrentPage(1);
    }, [visibleItems.length]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1); // Повернутися на першу сторінку при сортуванні
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <FaSort className="sort-icon" />;
        }
        return sortConfig.direction === 'asc'
            ? <FaSortUp className="sort-icon active" />
            : <FaSortDown className="sort-icon active" />;
    };

    const sortedItems = [...visibleItems].sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
            case 'surname':
                aValue = a.surname || '';
                bValue = b.surname || '';
                break;
            case 'name':
                aValue = a.name || '';
                bValue = b.name || '';
                break;
            case 'patronymic':
                aValue = a.patronymic || '';
                bValue = b.patronymic || '';
                break;
            case 'position':
                aValue = a.position || '';
                bValue = b.position || '';
                break;
            case 'department':
                aValue = a.department?.name || '';
                bValue = b.department?.name || '';
                break;
            case 'email':
                aValue = a.email || '';
                bValue = b.email || '';
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Пагінація
    const totalPages = Math.ceil(sortedItems.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedItems = sortedItems.slice(startIndex, startIndex + rowsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const sendMail = (email) => {
        window.location.href = `mailto:${email}`;
    };

    if (isEmpty(visibleItems)) {
        return <NotFound name={t(FORM_TEACHER_A_LABEL)} />;
    }

    return (
        <div className="teachers-table-container">
            <table className="teachers-table">
                <thead>
                <tr>
                    <th onClick={() => handleSort('surname')}>
                        {t(TEACHER_SURNAME)} {getSortIcon('surname')}
                    </th>
                    <th onClick={() => handleSort('name')}>
                        {t(TEACHER_FIRST_NAME)} {getSortIcon('name')}
                    </th>
                    <th onClick={() => handleSort('patronymic')}>
                        {t(TEACHER_PATRONYMIC)} {getSortIcon('patronymic')}
                    </th>
                    <th onClick={() => handleSort('position')}>
                        {t(TEACHER_POSITION)} {getSortIcon('position')}
                    </th>
                    <th onClick={() => handleSort('department')}>
                        {t(DEPARTMENT_TEACHER_LABEL)} {getSortIcon('department')}
                    </th>
                    <th onClick={() => handleSort('email')}>
                        {t(EMAIL_FIELD)} {getSortIcon('email')}
                    </th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {paginatedItems.map((teacher) => (
                    <tr key={teacher.id}>
                        <td>{teacher.surname}</td>
                        <td>{teacher.name}</td>
                        <td>{teacher.patronymic}</td>
                        <td>{teacher.position}</td>
                        <td>{teacher.department?.name || '—'}</td>
                        <td>
                            {teacher.email ? (
                                <button
                                    type="button"
                                    className="email-link"
                                    onClick={() => sendMail(teacher.email)}
                                >
                                    {teacher.email}
                                </button>
                            ) : '—'}
                        </td>
                        <td className="actions-cell">
                            {!isDisabled ? (
                                <>
                                    <IoMdEye
                                        className="action-icon copy-icon-btn"
                                        title={tCommon(COMMON_SET_DISABLED)}
                                        onClick={() => showConfirmDialog(
                                            teacher.id,
                                            dialogTypes.SET_VISIBILITY_DISABLED
                                        )}
                                    />
                                    <FaEdit
                                        className="action-icon edit-icon-btn"
                                        title={tCommon(COMMON_EDIT_HOVER_TITLE)}
                                        onClick={() => selectedTeacherCard(teacher.id)}
                                    />
                                </>
                            ) : (
                                <GiSightDisabled
                                    className="action-icon copy-icon-btn"
                                    title={tCommon(COMMON_SET_ENABLED)}
                                    onClick={() => showConfirmDialog(
                                        teacher.id,
                                        dialogTypes.SET_VISIBILITY_ENABLED
                                    )}
                                />
                            )}
                            <MdDelete
                                className="action-icon delete-icon-btn"
                                title={tCommon(COMMON_DELETE_HOVER_TITLE)}
                                onClick={() => showConfirmDialog(
                                    teacher.id,
                                    dialogTypes.DELETE_CONFIRM
                                )}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                <div className="pagination-rows">
                    <span>Рядків на сторінці:</span>
                    <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                        {ROWS_PER_PAGE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="pagination-info">
                    {startIndex + 1}–{Math.min(startIndex + rowsPerPage, sortedItems.length)} з {sortedItems.length}
                </div>

                <div className="pagination-controls">
                    <button
                        type="button"
                        className="pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        type="button"
                        className="pagination-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeachersTable;