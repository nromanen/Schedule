import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { isEqual, isEmpty } from 'lodash';
import SnackbarComponent from '../../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../../services/snackbarService';
import SemesterList from '../../../containers/SemesterPage/SemesterList';
import SemesterCopyForm from '../../../containers/SemesterPage/SemesterCopyForm';
import { MultiselectForGroups } from '../../../helper/MultiselectForGroups';
import { successHandler } from '../../../helper/handlerAxios';
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
        removeSemesterCard,
        setDefaultSemesterById,
        setOpenConfirmDialog,
        isOpenConfirmDialog,
        updateSemester,
        semesterCopy,
        handleSemester,
        setOpenErrorSnackbar,
        setError,
        getAllGroupsItems,
        // it doesnt work, need to finish implement archeved functionality
        // getArchivedSemestersItems,
         // archivedSemesters,
    } = props;

    const { t } = useTranslation('formElements');

    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [isOpenGroupsDialog, setIsOpenGroupsDialog] = useState(false);
    const [isOpenSemesterCopyForm, setIsOpenSemesterCopyForm] = useState(false);

    const [term, setTerm] = useState('');
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [archived, setArchived] = useState(false);
    const [semesterId, setSemesterId] = useState(null);

    const options = getGroupsOptionsForSelect(groups);

    useEffect(() => {
        if (disabled) {
            getDisabledSemestersItems();
        } else {
            getAllSemestersItems();
        }
        getAllGroupsItems();
        // it doesnt work, need to finish implement archived functionality
        // getArchivedSemestersItems();
    }, [disabled]);

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

    const changeSemesterDisabledStatus = (currentSemesterId) => {
        const foundSemester = semesters.find(
            (semesterItem) => semesterItem.id === currentSemesterId,
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
        const isDisabled = disabled;
        if (confirmDialogType === dialogTypes.SET_DEFAULT) {
            setDefaultSemesterById(currentSemesterId, isDisabled);
        } else if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
            changeSemesterDisabledStatus(currentSemesterId);
        } else {
            removeSemesterCard(currentSemesterId);
        }
    };
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
            successHandler(
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
                        semesters={semesters}
                    />
                </CustomDialog>
            )}

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
                    setConfirmDialogType={setConfirmDialogType}
                    setOpenSubDialog={setOpenConfirmDialog}
                    setIsOpenSemesterCopyForm={setIsOpenSemesterCopyForm}
                    setOpenGroupsDialog={setIsOpenGroupsDialog}
                    semesters={semesters}
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
