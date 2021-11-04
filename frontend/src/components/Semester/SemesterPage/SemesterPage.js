import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { isEqual, isEmpty } from 'lodash';
import SnackbarComponent from '../../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../../services/snackbarService';
import SemesterList from '../../../containers/SemesterPage/SemesterList';
import SemesterCopyForm from '../../../containers/SemesterPage/SemesterCopyForm';
import { MultiselectForGroups } from '../../../helper/MultiselectForGroups';
import i18n from '../../../i18n';
import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import { dialogTypes, dialogCloseButton } from '../../../constants/dialogs';
import {
    EXIST_LABEL,
    GROUP_EXIST_IN_THIS_SEMESTER,
} from '../../../constants/translationLabels/serviceMessages';
import { SEMESTER_COPY_LABEL, COPY_LABEL } from '../../../constants/translationLabels/formElements';
import { COMMON_GROUP_TITLE } from '../../../constants/translationLabels/common';
import { getGroupsOptionsForSelect } from '../../../utils/selectUtils';
import SemesterSidebar from '../SemesterSidebar';

const SemesterPage = (props) => {
    const {
        isSnackbarOpen,
        snackbarType,
        snackbarMessage,
        groups,
        semester,
        semesters,
        getAllSemestersItems,
        getDisabledSemestersItems,
        setGroupsToSemester,
        handleSemester,
        setOpenErrorSnackbar,
        setError,
        getAllGroupsItems,
        setOpenSuccessSnackbar,
        // it doesnt work, need to finish implement archeved functionality
        // getArchivedSemestersItems,
        // archivedSemesters,
    } = props;

    const [isOpenGroupsDialog, setIsOpenGroupsDialog] = useState(false);

    const [term, setTerm] = useState('');
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [archived, setArchived] = useState(false);
    const [semesterId, setSemesterId] = useState(null);

    const options = getGroupsOptionsForSelect(groups);
    useEffect(() => {
        getAllGroupsItems();
        // it doesnt work, need to finish implement archived functionality
        // getArchivedSemestersItems();
    }, []);

    useEffect(() => {
        if (disabled) {
            getDisabledSemestersItems();
        } else {
            getAllSemestersItems();
        }
        // it doesnt work, need to finish implement archived functionality
        // getArchivedSemestersItems();
    }, [disabled]);
    // it doesnt work, need to finish implement archeved functionality
    // const showArchivedHandler = () => {
    //     setArchived(!archived);
    //     setDisabled(false);
    //     return !archived ? setScheduleTypeService('archived') : setScheduleTypeService('default');
    // };

    const onChangeGroups = () => {
        const semester = semesters.find((semesterItem) => semesterItem.id === semesterId);
        const beginGroups = !isEmpty(semester.semester_groups)
            ? getGroupsOptionsForSelect(semester.semester_groups)
            : [];
        const finishGroups = [...semesterOptions];
        if (isEqual(beginGroups, finishGroups)) {
            setOpenSuccessSnackbar(
                i18n.t(GROUP_EXIST_IN_THIS_SEMESTER, {
                    cardType: i18n.t(COMMON_GROUP_TITLE),
                    actionType: i18n.t(EXIST_LABEL),
                }),
            );
            return;
        }
        setGroupsToSemester(semesterId, semesterOptions);
        setIsOpenGroupsDialog(false);
    };
    const cancelMultiselect = () => {
        setIsOpenGroupsDialog(false);
    };

    return (
        <>
            <div className="cards-container">
                <SemesterSidebar
                    setTerm={setTerm}
                    archived={archived}
                    disabled={disabled}
                    showDisabledHandle={() => {
                        setDisabled(!disabled);
                        setArchived(false);
                    }}
                    setOpenErrorSnackbar={setOpenErrorSnackbar}
                    handleSemester={handleSemester}
                    semester={semester}
                    options={options}
                    setError={setError}
                />
                <SemesterList
                    term={term}
                    archived={archived}
                    disabled={disabled}
                    setSemesterId={setSemesterId}
                    setOpenGroupsDialog={setIsOpenGroupsDialog}
                    semesters={semesters}
                    setSemesterOptions={setSemesterOptions}
                    semesterId={semesterId}
                />
                <MultiselectForGroups
                    open={isOpenGroupsDialog}
                    options={options}
                    value={semesterOptions}
                    onChange={setSemesterOptions}
                    onCancel={cancelMultiselect}
                    onClose={onChangeGroups}
                />
            </div>
            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarCloseService}
            />
        </>
    );
};

export default SemesterPage;
