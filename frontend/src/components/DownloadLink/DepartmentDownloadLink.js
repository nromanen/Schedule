import React from 'react';
import {MdPictureAsPdf} from 'react-icons/md';
import i18n from '../../i18n';
import {COMMON_DOWNLOAD_PDF} from '../../constants/translationLabels/common';
import {lessonTypeColors} from '../../constants/lessonTypeColors';

const DepartmentDownloadLink = ({departmentName, semesterDescription, semesterStartDay, semesterEndDay}) => {

    const handlePrint = () => {
        const tableElement = document.querySelector('.department-schedule');
        if (!tableElement) return;

        const semesterTitle = `${semesterDescription || ''} (${semesterStartDay || ''} - ${semesterEndDay || ''})`;
        const departmentTitle = `${i18n.t('common:department_label')}: ${departmentName || ''}`;

        const clonedTable = tableElement.cloneNode(true);

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
                * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
                    @page {
                        size: A4 landscape;
                        margin: 8mm;
                    }
                    .print-hint {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #7a4f00;
    background-color: #fff8e1;
    border: 2px solid #ffc000;
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 16px;
}
                    body {
                        font-family: Arial, sans-serif;
                        padding: 10px;
                    }
                    .print-btn {
                        display: block;
                        margin: 0 auto 16px;
                        padding: 8px 24px;
                        font-size: 14px;
                        cursor: pointer;
                        background: #1976d2;
                        color: white;
                        border: none;
                        border-radius: 4px;
                    }
                    @media print {
    .print-hint { display: none; }
    .print-btn  { display: none; }
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
                    td.day-cell {
                        background-color: #e8f1f8 !important;
                        font-weight: bold;
                        border-right: 2px solid #757575;
                        width: 25px;
                    }
                    td.class-cell-wrapper {
                        border-right: 2px solid #bdbdbd;
                    }
                    td.week-cell {
                        font-weight: bold;
                        color: #757575;
                        font-size: 9px;
                    }
                    tr.day-even td {
                        background-color: #ffffff;
                    }
                    tr.day-odd td {
                        background-color: #fafafa;
                    }
                    tr.day-last td {
                        border-bottom: 3px solid #757575;
                    }
                    tr.class-last td {
                        border-bottom: 2px solid #bdbdbd;
                    }
                    td.type-lecture    { background-color: ${lessonTypeColors.lecture.light} !important; }
                    td.type-practical  { background-color: ${lessonTypeColors.practical.light} !important; }
                    td.type-laboratory { background-color: ${lessonTypeColors.laboratory.light} !important; }
                    td.type-seminar    { background-color: ${lessonTypeColors.seminar.light} !important; }
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
                    @media print {
                        .print-btn { display: none; }
                    }
                    @page {
    size: landscape;
    margin: 0;
}

body {
    font-family: Arial, sans-serif;
    padding: 8mm;
}
                </style>
            </head>
            <body>
                <p class="print-hint">
    Рекомендована орієнтація: альбомна. Якщо таблиця не вміщається — зменшіть масштаб.
</p>
<button class="print-btn" onclick="window.print()">
            Зберегти як PDF
        </button>
                <div class="title-block">
                    <div class="semester-title">${semesterTitle}</div>
                    <div class="department-title">${departmentTitle}</div>
                </div>
                ${clonedTable.outerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        // setTimeout(() => {
        //     printWindow.focus();
        //     printWindow.print();
        // }, 500);
        printWindow.onafterprint = () => {
            printWindow.close();
        };
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