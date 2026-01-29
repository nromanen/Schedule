import React from 'react';
import {MdPictureAsPdf} from 'react-icons/md';
import i18n from '../../i18n';
import {COMMON_DOWNLOAD_PDF} from '../../constants/translationLabels/common';

const DepartmentDownloadLink = ({departmentName, semesterDescription, semesterStartDay, semesterEndDay}) => {

    const handlePrint = () => {
        const tableElement = document.querySelector('.department-schedule');
        if (!tableElement) return;

        const semesterTitle = `${semesterDescription || ''} (${semesterStartDay || ''} - ${semesterEndDay || ''})`;
        const departmentTitle = `${i18n.t('common:department_label')}: ${departmentName || ''}`;

        // Клонуємо таблицю
        const clonedTable = tableElement.cloneNode(true);

        // Замінюємо повні назви днів на скорочені
        const dayCells = clonedTable.querySelectorAll('.day-cell');
        const dayMap = {
            [i18n.t('common:day_of_week_MONDAY')]: i18n.t('common:day_of_week_short_MONDAY'),
            [i18n.t('common:day_of_week_TUESDAY')]: i18n.t('common:day_of_week_short_TUESDAY'),
            [i18n.t('common:day_of_week_WEDNESDAY')]: i18n.t('common:day_of_week_short_WEDNESDAY'),
            [i18n.t('common:day_of_week_THURSDAY')]: i18n.t('common:day_of_week_short_THURSDAY'),
            [i18n.t('common:day_of_week_FRIDAY')]: i18n.t('common:day_of_week_short_FRIDAY'),
            [i18n.t('common:day_of_week_SATURDAY')]: i18n.t('common:day_of_week_short_SATURDAY'),
            [i18n.t('common:day_of_week_SUNDAY')]: i18n.t('common:day_of_week_short_SUNDAY'),
        };

        dayCells.forEach(cell => {
            const fullName = cell.textContent.trim();
            if (dayMap[fullName]) {
                cell.textContent = dayMap[fullName];
            }
        });

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${departmentName}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                    }
                    .title-block {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .semester-title {
                        font-size: 16px;
                        margin-bottom: 5px;
                    }
                    .department-title {
                        font-size: 18px;
                        font-weight: bold;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 10px;
                    }
                    th, td {
                        border: 1px solid #d1d5db;
                        padding: 4px 6px;
                        text-align: center;
                        vertical-align: middle;
                    }
                    th {
                        background-color: #edeef1;
                        font-weight: bold;
                    }
                    
                    /* Day cell */
                    td.day-cell {
                        background-color: #e8f1f8;
                        font-weight: bold;
                        border-right: 2px solid #757575;
                        width: 25px;
                    }
                    
                    /* Class cell */
                    td.class-cell-wrapper {
                        border-right: 2px solid #bdbdbd;
                    }
                    
                    /* Week cell */
                    td.week-cell {
                        font-weight: bold;
                        color: #757575;
                        font-size: 9px;
                    }
                    
                    /* Row stripes */
                    tr.day-even td {
                        background-color: #ffffff;
                    }
                    tr.day-odd td {
                        background-color: #fafafa;
                    }
                    
                    /* Keep day-cell color */
                    tr.day-even td.day-cell,
                    tr.day-odd td.day-cell {
                        background-color: #e8f1f8;
                    }
                    
                    /* Border between days */
                    tr.day-last td {
                        border-bottom: 3px solid #757575;
                    }
                    
                    /* Border between classes */
                    tr.class-last td {
                        border-bottom: 2px solid #bdbdbd;
                    }
                    
                    /* Lesson content */
                    .empty-cell {
                        color: #ccc;
                    }
                    .lesson-cell {
                        text-align: center;
                    }
                    .lesson-cell .subject {
                        font-weight: 500;
                    }
                    .lesson-cell .group,
                    .lesson-cell .room {
                        font-size: 9px;
                        color: #666;
                    }
                    
                    /* Hide meeting links in print */
                    .meeting-link {
                        display: none;
                    }
                    
                    @media print {
                        body { padding: 10px; }
                    }
                </style>
            </head>
            <body>
                <div class="title-block">
                    <div class="semester-title">${semesterTitle}</div>
                    <div class="department-title">${departmentTitle}</div>
                </div>
                ${clonedTable.outerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                handlePrint();
            }}
            className="pdf_link"
            style={{color: '-webkit-link'}}
        >
            <MdPictureAsPdf className="svg-btn"/>
            {i18n.t(COMMON_DOWNLOAD_PDF)}
        </a>
    );
};

export default DepartmentDownloadLink;