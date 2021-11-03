import React, { useState } from 'react';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SemesterForm from '../../containers/SemesterPage/SemesterForm';
import i18n from '../../i18n';
import { COMMON_SEMESTER_IS_NOT_UNIQUE } from '../../constants/translationLabels/common';
import { semesterFormValueMapper } from '../../helper/semesterFormValueMapper';
import { checkUniqSemester } from '../../validation/storeValidation';
import { checkSemesterYears } from '../../utils/formUtils';

const SemesterSidebar = (props) => {
    const {
        setTerm,
        archived,
        disabled,
        showDisabledHandle,
        setOpenErrorSnackbar,
        setError,
        handleSemester,
        semester,
        options,
    } = props;

    const [selectedGroups, setSelectedGroups] = useState([]);

    const submitSemesterForm = (values) => {
        const semesterGroups = selectedGroups.map((group) => {
            return { id: group.id, title: group.label };
        });
        const formValues = { ...values, semester_groups: semesterGroups };
        const semester = semesterFormValueMapper(formValues);
        if (!checkUniqSemester(semester)) {
            const message = i18n.t(COMMON_SEMESTER_IS_NOT_UNIQUE);
            setOpenErrorSnackbar(message);
            setError(true);
            return;
        }
        if (!checkSemesterYears(semester.endDay, semester.startDay, semester.year)) return;
        handleSemester(semester);
        setSelectedGroups([]);
    };
    return (
        <aside className="search-list__panel">
            <SearchPanel
                SearchChange={setTerm}
                showDisabled={showDisabledHandle}
                // it doesnt work, need to finish implement archeved functionality
                // showArchived={showArchivedHandler}
            />
            {!(disabled || archived) && (
                <SemesterForm
                    selectedGroups={selectedGroups}
                    setSelectedGroups={setSelectedGroups}
                    className="form"
                    onSubmit={submitSemesterForm}
                    semester={semester}
                    options={options}
                />
            )}
        </aside>
    );
};

export default SemesterSidebar;
