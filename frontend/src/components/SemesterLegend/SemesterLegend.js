import React from 'react';
import { SEMESTER_COLORS } from '../../constants/semesterColors';
import './SemesterLegend.scss';

const SemesterLegend = ({ semesters, activeSemesterIds, onToggle }) => {
    if (!semesters || semesters.length <= 1) return null;

    return (
        <div className="semester-legend">
            {semesters.map((sem, index) => {
                const color = SEMESTER_COLORS[index % SEMESTER_COLORS.length];
                const isActive = activeSemesterIds.includes(sem.id);
                return (
                    <label
                        key={sem.id}
                        className={`semester-legend__item ${isActive ? 'active' : 'inactive'}`}
                        style={{ borderColor: color, color: isActive ? 'white' : color, backgroundColor: isActive ? color : 'transparent' }}
                    >
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => onToggle(sem.id)}
                        />
                        {sem.description} ({sem.startDay?.slice(0, 5)}–{sem.endDay?.slice(0, 5)})
                    </label>
                );
            })}
        </div>
    );
};

export default SemesterLegend;