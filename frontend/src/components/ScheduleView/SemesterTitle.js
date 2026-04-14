import React from 'react';
import './SemesterTitle.scss'
import {formatDateRange} from "../../utils/titlesUtil";

const SemesterTitle = ({ semester }) => (
    <>
        {semester.description}
        <span className="schedule-date-badge">
            {formatDateRange(semester.startDay, semester.endDay)}
        </span>
    </>
);

export default SemesterTitle;