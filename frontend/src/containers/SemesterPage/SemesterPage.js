import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { isEqual, isEmpty } from 'lodash';
import './SemesterPage.scss';
import Button from '@material-ui/core/Button';

import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import SemesterForm from './SemesterForm';
import SemesterItem from './SemesterItem';
import SemesterCopyForm from './SemesterCopyForm';
import {
    handleSemesterService,
    getDisabledSemestersService,
    removeSemesterCardService,
    setDisabledSemestersService,
    setEnabledSemestersService,
    showAllSemestersService,
    semesterCopy,
    getArchivedSemestersService,
    setDefaultSemesterById,
    setGroupsToSemester,
} from '../../services/semesterService';
import { setScheduleTypeService } from '../../services/scheduleService';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import { MultiselectForGroups } from '../../helper/MultiselectForGroups';
import { showAllGroupsService } from '../../services/groupService';
import { successHandler } from '../../helper/handlerAxios';
import i18n from '../../i18n';
import { CustomDialog } from '../../share/DialogWindows';
import { dialogTypes } from '../../constants/dialogs';
import {
    EXIST_LABEL,
    GROUP_EXIST_IN_THIS_SEMESTER,
} from '../../constants/translationLabels/serviceMessages';
import {
    CLOSE_LABEL,
    SEMESTER_COPY_LABEL,
    COPY_LABEL,
} from '../../constants/translationLabels/formElements';
import { COMMON_GROUP_TITLE } from '../../constants/translationLabels/common';
import { getGroupsOptionsForSelect } from '../../utils/selectUtils';

const SemesterPage = (props) => {
    const {
        isSnackbarOpen,
        snackbarType,
        snackbarMessage,
        groups,
        semester,
        archivedSemesters,
        enabledSemesters,
        disabledSemesters,
    } = props;

    const { t } = useTranslation('formElements');

    const [openSubDialog, setOpenSubDialog] = useState(false);
    const [subDialogType, setSubDialogType] = useState('');
    const [openGroupsDialog, setOpenGroupsDialog] = useState(false);
    const [isOpenSemesterCopyForm, setIsOpenSemesterCopyForm] = useState(false);

    const [term, setTerm] = useState('');
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [archived, setArchived] = useState(false);
    const [semesterId, setSemesterId] = useState(null);

    const options = getGroupsOptionsForSelect(groups);

    useEffect(() => {
        if (!isEmpty(semester.semester_groups)) {
            setSemesterOptions(getGroupsOptionsForSelect(semester.semester_groups));
        }
    }, [semester.id]);

    useEffect(() => {
        showAllGroupsService();
        showAllSemestersService();
        getDisabledSemestersService();
        // doesnt work
        // getArchivedSemestersService();
    }, []);

    const submitSemesterForm = (values) => {
        const semesterGroups = selectedGroups.map((group) => {
            return { id: group.id, title: group.label };
        });
        handleSemesterService({ ...values, semester_groups: semesterGroups });
        setSelectedGroups([]);
    };

    const closeSemesterCopyForm = () => {
        setIsOpenSemesterCopyForm(false);
    };

    const changeGSemesterDisabledStatus = (currentSemesterId) => {
        const foundSemester = [...disabledSemesters, ...enabledSemesters].find(
            (semesterEl) => semesterEl.id === currentSemesterId,
        );
        const changeDisabledStatus = {
            [dialogTypes.SET_VISIBILITY_ENABLED]: setEnabledSemestersService(foundSemester),
            [dialogTypes.SET_VISIBILITY_DISABLED]: setDisabledSemestersService(foundSemester),
        };
        return changeDisabledStatus[subDialogType];
    };

    const acceptConfirmDialog = (currentSemesterId) => {
        setOpenSubDialog(false);
        if (!currentSemesterId) return;
        if (subDialogType === dialogTypes.SET_DEFAULT) {
            setDefaultSemesterById(currentSemesterId);
        } else if (subDialogType !== dialogTypes.DELETE_CONFIRM) {
            changeGSemesterDisabledStatus(currentSemesterId);
        } else {
            removeSemesterCardService(currentSemesterId);
        }
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
        setArchived(false);
    };

    const showArchivedHandler = () => {
        setArchived(!archived);
        setDisabled(false);
        return !archived ? setScheduleTypeService('archived') : setScheduleTypeService('default');
    };

    const submitSemesterCopy = (values) => {
        semesterCopy({
            fromSemesterId: +semesterId,
            toSemesterId: +values.toSemesterId,
        });
        setIsOpenSemesterCopyForm(false);
    };

    const onChangeGroups = () => {
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
        setSemesterOptions(getGroupsOptionsForSelect(semester.semester_groups));
        setOpenGroupsDialog(false);
    };
    const cancelMultiselect = () => {
        setOpenGroupsDialog(false);
    };

    return (
        <>
            <NavigationPage name={navigationNames.SEMESTER_PAGE} val={navigation.SEMESTERS} />
            <CustomDialog
                type={subDialogType}
                cardId={semesterId}
                whatDelete="semester"
                open={openSubDialog}
                onClose={acceptConfirmDialog}
            />
            <CustomDialog
                title={t(SEMESTER_COPY_LABEL)}
                open={isOpenSemesterCopyForm}
                onClose={closeSemesterCopyForm}
                buttons={
                    <Button
                        className="dialog-button"
                        variant="contained"
                        onClick={closeSemesterCopyForm}
                    >
                        {t(CLOSE_LABEL)}
                    </Button>
                }
            >
                <SemesterCopyForm
                    semesterId={semesterId}
                    onSubmit={submitSemesterCopy}
                    submitButtonLabel={t(COPY_LABEL)}
                />
            </CustomDialog>

            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel
                        SearchChange={setTerm}
                        showDisabled={showDisabledHandle}
                        showArchived={showArchivedHandler}
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
                <SemesterItem
                    term={term}
                    archived={archived}
                    disabled={disabled}
                    setSemesterId={setSemesterId}
                    setSubDialogType={setSubDialogType}
                    setOpenSubDialog={setOpenSubDialog}
                    setIsOpenSemesterCopyForm={setIsOpenSemesterCopyForm}
                    setOpenGroupsDialog={setOpenGroupsDialog}
                />
            </div>
            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarCloseService}
            />
            <MultiselectForGroups
                open={openGroupsDialog}
                options={options}
                value={semesterOptions}
                onChange={setSemesterOptions}
                onCancel={cancelMultiselect}
                onClose={onChangeGroups}
            />
        </>
    );
};
const mapStateToProps = (state) => ({
    enabledSemesters: state.semesters.semesters,
    disabledSemesters: state.semesters.disabledSemesters,
    archivedSemesters: state.semesters.archivedSemesters,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    semester: state.semesters.semester,
    groups: state.groups.groups,
});

export default connect(mapStateToProps)(SemesterPage);
