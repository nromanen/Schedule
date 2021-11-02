import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { isEqual, isEmpty } from 'lodash';
import SearchPanel from '../../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../../services/snackbarService';
import SemesterForm from '../../../containers/SemesterPage/SemesterForm';
import SemesterItem from '../../../containers/SemesterPage/SemesterItem';
import SemesterCopyForm from '../../../containers/SemesterPage/SemesterCopyForm';
import { MultiselectForGroups } from '../../../helper/MultiselectForGroups';
import { showAllGroupsService } from '../../../services/groupService';
import { successHandler } from '../../../helper/handlerAxios';
import i18n from '../../../i18n';
import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import { dialogTypes, dialogCloseButton } from '../../../constants/dialogs';
import {
    EXIST_LABEL,
    GROUP_EXIST_IN_THIS_SEMESTER,
} from '../../../constants/translationLabels/serviceMessages';
import { SEMESTER_COPY_LABEL, COPY_LABEL } from '../../../constants/translationLabels/formElements';
import {
    COMMON_GROUP_TITLE,
    COMMON_SEMESTER_IS_NOT_UNIQUE,
} from '../../../constants/translationLabels/common';
import { getGroupsOptionsForSelect } from '../../../utils/selectUtils';
import { semesterFormValueMapper } from '../../../helper/semesterFormValueMapper';
import { checkUniqSemester } from '../../../validation/storeValidation';
import { checkSemesterYears } from '../../../utils/formUtils';

const SemesterPage = (props) => {
    const {
        isSnackbarOpen,
        snackbarType,
        snackbarMessage,
        groups,
        semester,
        // it doesnt work, need to finish implement archeved functionality
        // archivedSemesters,
        enabledSemesters,
        disabledSemesters,
        getAllSemestersItems,
        getDisabledSemestersItems,
        // it doesnt work, need to finish implement archeved functionality
        // getArchivedSemestersItems,
        setGroupsToSemester,
        removeSemesterCard,
        setDefaultSemesterById,
        setOpenConfirmDialog,
        isOpenConfirmDialog,
        updateSemester,
        semesterCopy,
        handleSemester,
        setOpenErrorSnackbar,
        setError,
    } = props;

    const { t } = useTranslation('formElements');

    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [isOpenGroupsDialog, setIsOpenGroupsDialog] = useState(false);
    const [isOpenSemesterCopyForm, setIsOpenSemesterCopyForm] = useState(false);

    const [term, setTerm] = useState('');
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [archived, setArchived] = useState(false);
    const [semesterId, setSemesterId] = useState(null);

    const options = getGroupsOptionsForSelect(groups);

    useEffect(() => {
        // TODO change to saga
        showAllGroupsService();
        getAllSemestersItems();
        getDisabledSemestersItems();
        // it doesnt work, need to finish implement archeved functionality
        // getArchivedSemestersItems();
    }, []);

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
    const submitSemesterCopy = ({ toSemesterId }) => {
        semesterCopy({
            fromSemesterId: semesterId,
            toSemesterId,
        });
        setIsOpenSemesterCopyForm(false);
    };
    const closeSemesterCopyForm = () => {
        setIsOpenSemesterCopyForm(false);
    };

    const changeGSemesterDisabledStatus = (currentSemesterId) => {
        const foundSemester = [...disabledSemesters, ...enabledSemesters].find(
            (semesterEl) => semesterEl.id === currentSemesterId,
        );
        const changeDisabledStatus = {
            [dialogTypes.SET_VISIBILITY_ENABLED]: updateSemester({
                ...foundSemester,
                disable: false,
            }),
            [dialogTypes.SET_VISIBILITY_DISABLED]: updateSemester({
                ...foundSemester,
                disable: true,
            }),
        };
        return changeDisabledStatus[confirmDialogType];
    };

    const acceptConfirmDialog = (currentSemesterId) => {
        setOpenConfirmDialog(false);
        if (!currentSemesterId) return;
        if (confirmDialogType === dialogTypes.SET_DEFAULT) {
            setDefaultSemesterById(currentSemesterId);
        } else if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
            changeGSemesterDisabledStatus(currentSemesterId);
        } else {
            removeSemesterCard(currentSemesterId);
        }
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
        setArchived(false);
    };
    // it doesnt work, need to finish implement archeved functionality
    // const showArchivedHandler = () => {
    //     setArchived(!archived);
    //     setDisabled(false);
    //     return !archived ? setScheduleTypeService('archived') : setScheduleTypeService('default');
    // };

    const onChangeGroups = () => {
        const semester = enabledSemesters.find((semesterItem) => semesterItem.id === semesterId);
        const beginGroups = !isEmpty(semester.semester_groups)
            ? getGroupsOptionsForSelect(semester.semester_groups)
            : [];
        const finishGroups = [...semesterOptions];
        if (isEqual(beginGroups, finishGroups)) {
            successHandler(
                i18n.t(GROUP_EXIST_IN_THIS_SEMESTER, {
                    cardType: i18n.t(COMMON_GROUP_TITLE),
                    actionType: i18n.t(EXIST_LABEL),
                }),
            );
            return;
        }
        setGroupsToSemester(semesterId, semesterOptions);
        // setSemesterOptions(getGroupsOptionsForSelect(semester.semester_groups));
        setIsOpenGroupsDialog(false);
    };
    const cancelMultiselect = () => {
        setIsOpenGroupsDialog(false);
    };

    return (
        <>
            {isOpenConfirmDialog && (
                <CustomDialog
                    type={confirmDialogType}
                    whatDelete="semester"
                    open={isOpenConfirmDialog}
                    handelConfirm={() => acceptConfirmDialog(semesterId)}
                />
            )}
            {isOpenSemesterCopyForm && (
                <CustomDialog
                    title={t(SEMESTER_COPY_LABEL)}
                    open={isOpenSemesterCopyForm}
                    onClose={closeSemesterCopyForm}
                    buttons={[dialogCloseButton(closeSemesterCopyForm)]}
                >
                    <SemesterCopyForm
                        semesterId={semesterId}
                        onSubmit={submitSemesterCopy}
                        submitButtonLabel={t(COPY_LABEL)}
                        semesters={enabledSemesters}
                    />
                </CustomDialog>
            )}

            <div className="cards-container">
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
                            groups={groups}
                        />
                    )}
                </aside>
                <SemesterItem
                    term={term}
                    archived={archived}
                    disabled={disabled}
                    setSemesterId={setSemesterId}
                    setSubDialogType={setConfirmDialogType}
                    setOpenSubDialog={setOpenConfirmDialog}
                    setIsOpenSemesterCopyForm={setIsOpenSemesterCopyForm}
                    setOpenGroupsDialog={setIsOpenGroupsDialog}
                    enabledSemesters={enabledSemesters}
                    disabledSemesters={disabledSemesters}
                    setSemesterOptions={setSemesterOptions}
                />
            </div>
            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarCloseService}
            />
            <MultiselectForGroups
                open={isOpenGroupsDialog}
                options={options}
                value={semesterOptions}
                onChange={setSemesterOptions}
                onCancel={cancelMultiselect}
                onClose={onChangeGroups}
            />
        </>
    );
};

export default SemesterPage;
