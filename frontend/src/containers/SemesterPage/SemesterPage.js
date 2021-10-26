import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { isEqual, isEmpty } from 'lodash';
import './SemesterPage.scss';
import Button from '@material-ui/core/Button';
import { search } from '../../helper/search';

import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import SemesterForm from './SemesterForm';
import SemesterItem from '../../components/Semester/SemesterItem';
import SemesterCopyForm from '../../components/Semester/SemesterCopyForm/SemesterCopyForm';
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
    const searchArr = ['year', 'description', 'startDay', 'endDay'];
    const { t } = useTranslation('formElements');
    const [openSubDialog, setOpenSubDialog] = useState(false);
    const [subDialogType, setSubDialogType] = useState('');
    const [openGroupsDialog, setOpenGroupsDialog] = useState(false);
    const [semesterId, setSemesterId] = useState(-1);

    const [term, setTerm] = useState('');
    const [prevSelectedGroups, setPrevSelectedGroups] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [archived, setArchived] = useState(false);
    const [isOpenSemesterCopyForm, setIsOpenSemesterCopyForm] = useState(null);
    const [semesterCard, setSemesterCard] = useState(null);
    const [visibleItems, setVisibleItems] = useState([]);
    const getGroupOptions = (groupOptions) => {
        return groupOptions.map((item) => {
            return { id: item.id, value: item.id, label: `${item.title}` };
        });
    };
    const options = getGroupOptions(groups);
    useEffect(() => {
        if (semester.semester_groups !== undefined && semester.semester_groups.length > 0) {
            setSemesterOptions(getGroupOptions(semester.semester_groups));
        }
    }, [semester.id]);
    useEffect(() => {
        showAllGroupsService();
        showAllSemestersService();
        getDisabledSemestersService();
        // getArchivedSemestersService();
    }, []);

    const SearchChange = setTerm;

    const cancelMultiselect = () => {
        setSemesterOptions(getGroupOptions(semester.semester_groups));
        setOpenGroupsDialog(false);
    };

    useEffect(() => {
        if (disabled) setVisibleItems(search(disabledSemesters, term, searchArr));
        if (archived) setVisibleItems(search(archivedSemesters, term, searchArr));
        if (!(archived || disabled)) setVisibleItems(search(enabledSemesters, term, searchArr));
    }, [disabled, archived, enabledSemesters]);

    const submitSemesterForm = (values) => {
        const semesterGroups = prevSelectedGroups.map((group) => {
            return { id: group.id, title: group.label };
        });
        handleSemesterService({ ...values, semester_groups: semesterGroups });
        setPrevSelectedGroups([]);
    };

    const closeSemesterCopyForm = () => {
        setIsOpenSemesterCopyForm(false);
        setIsOpenSemesterCopyForm(null);
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
            fromSemesterId: +semesterCard,
            toSemesterId: +values.toSemesterId,
        });
        setIsOpenSemesterCopyForm(null);
    };
    const onChangeGroups = () => {
        const beginGroups = !isEmpty(semester.semester_groups)
            ? getGroupOptions(semester.semester_groups)
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
        setGroupsToSemester(semesterCard, semesterOptions);
        setOpenGroupsDialog(false);
    };

    return (
        <>
            <NavigationPage name={navigationNames.SEMESTER_PAGE} val={navigation.SEMESTERS} />
            {openSubDialog && (
                <CustomDialog
                    type={subDialogType}
                    cardId={semesterId}
                    whatDelete="semester"
                    open={openSubDialog}
                    onClose={acceptConfirmDialog}
                />
            )}
            {isOpenSemesterCopyForm && (
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
                        semesterId={semesterCard.id}
                        onSubmit={submitSemesterCopy}
                        submitButtonLabel={t(COPY_LABEL)}
                    />
                </CustomDialog>
            )}

            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel
                        SearchChange={SearchChange}
                        showDisabled={showDisabledHandle}
                        showArchived={showArchivedHandler}
                    />
                    {!(disabled || archived) && (
                        <SemesterForm
                            prevSelectedGroups={prevSelectedGroups}
                            setPrevSelectedGroups={setPrevSelectedGroups}
                            className="form"
                            onSubmit={submitSemesterForm}
                            semester={semester}
                            semesterOptions={semesterOptions}
                            setSemesterOptions={setSemesterOptions}
                            options={options}
                        />
                    )}
                </aside>
                <SemesterItem
                    archived={archived}
                    disabled={disabled}
                    setSemesterId={setSemesterId}
                    setSubDialogType={setSubDialogType}
                    setOpenSubDialog={setOpenSubDialog}
                    setIsOpenSemesterCopyForm={setIsOpenSemesterCopyForm}
                    visibleItems={visibleItems}
                    setSemesterCard={setSemesterCard}
                    setOpenGroupsDialog={setOpenGroupsDialog}
                />
            </div>
            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarCloseService}
            />
            {openGroupsDialog && (
                <MultiselectForGroups
                    open={openGroupsDialog}
                    options={options}
                    value={semesterOptions}
                    onChange={setSemesterOptions}
                    onCancel={cancelMultiselect}
                    onClose={onChangeGroups}
                />
            )}
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
