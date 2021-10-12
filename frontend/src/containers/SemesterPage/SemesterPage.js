import { connect } from 'react-redux';
import { FaEdit, FaUsers, FaFileArchive } from 'react-icons/fa';
import { MdDelete, MdDonutSmall, MdEdit } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import './SemesterPage.scss';
import { GiSightDisabled, IoMdEye, FaCopy } from 'react-icons/all';
import Card from '../../share/Card/Card';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import ConfirmDialog from '../../share/modals/dialog';
import ModalWindow from '../../share/modals/modal/modal';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import SemesterForm from '../../components/SemesterForm/SemesterForm';
import SemesterCopyForm from '../../components/SemesterCopyForm/SemesterCopyForm';
import {
    clearSemesterService,
    getDisabledSemestersService,
    handleSemesterService,
    removeSemesterCardService,
    selectSemesterService,
    setDisabledSemestersService,
    setEnabledSemestersService,
    showAllSemestersService,
    semesterCopy,
    createArchiveSemesterService,
    getArchivedSemestersService,
    viewArchivedSemester,
    setDefaultSemesterById,
    setGroupsToSemester,
} from '../../services/semesterService';
import { setScheduleTypeService } from '../../services/scheduleService';
import { disabledCard } from '../../constants/disabledCard';

import GroupSchedulePage from '../../components/GroupSchedulePage/GroupSchedulePage';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import SetDefaultDialog from '../../share/modals/modal/setDefaultDialog';
import SetChangeDialog from '../../share/modals/modal/setDefaultDialog';
import { MultiselectForGroups } from '../../helper/MultiselectForGroups';
import { showAllGroupsService } from '../../services/groupService';
import { successHandler } from '../../helper/handlerAxios';
import i18n from '../../helper/i18n';
import {
    EXIST_LABEL,
    GROUP_EXIST_IN_THIS_SEMESTER,
} from '../../constants/translationLabels/serviceMessages';
import {
    EDIT_TITLE,
    CLOSE_LABEL,
    DELETE_TITLE,
    SEMESTER_COPY_LABEL,
    COPY_LABEL,
    SEMESTERY_LABEL,
    FORM_SHOW_GROUPS,
    SET_DEFAULT_TITLE,
} from '../../constants/translationLabels/formElements';
import {
    COMMON_GROUP_TITLE,
    COMMON_SET_DISABLED,
    COMMON_DAY_LABEL,
    COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE,
    SEMESTER_LABEL,
    COMMON_PREVIEW,
    COMMON_MAKE_ARCHIVE,
    COMMON_SET_ENABLED,
} from '../../constants/translationLabels/common';

const SemesterPage = (props) => {
    const { t } = useTranslation('formElements');
    const [open, setOpen] = useState(false);
    const [openDefault, setOpenDefault] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openGroupsDialog, setOpenGroupsDialog] = useState(false);
    const [semesterId, setSemesterId] = useState(-1);
    const [term, setTerm] = useState('');
    const { isSnackbarOpen, snackbarType, snackbarMessage, semester, groups } = props;
    const [selected, setSelected] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [edit, setEdit] = useState(false);
    const getGroupOptions = (groupOptions) => {
        return groupOptions.map((item) => {
            return { id: item.id, value: item.id, label: `${item.title}` };
        });
    };
    const options = getGroupOptions(groups.filter((x) => !selectedGroups.includes(x)));
    useEffect(() => {
        if (semester.semester_groups !== undefined && semester.semester_groups.length > 0) {
            setSemesterOptions(getGroupOptions(semester.semester_groups));
        }
    }, [semester.id]);
    useEffect(() => showAllSemestersService(), []);
    useEffect(() => {
        getDisabledSemestersService();
    }, []);
    useEffect(() => getArchivedSemestersService(), []);
    useEffect(() => showAllGroupsService(), []);
    const [hideDialog, setHideDialog] = useState(null);
    const [hideDialogModal, setHideDialogModal] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [archived, setArchived] = useState(false);

    setScheduleTypeService('archived');

    const SearchChange = setTerm;
    const isEqualsArrObjects = (arr1, arr2) => {
        const a = [...arr1];
        const b = [...arr2];
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) if (a[i].id !== b[i].id) return false;
        return true;
    };
    const onChangeGroups = () => {
        const beginGroups =
            semester.semester_groups !== undefined ? getGroupOptions(semester.semester_groups) : [];
        const finishGroups = [...semesterOptions];
        if (isEqualsArrObjects(beginGroups, finishGroups)) {
            successHandler(
                i18n.t(GROUP_EXIST_IN_THIS_SEMESTER, {
                    cardType: i18n.t(COMMON_GROUP_TITLE),
                    actionType: i18n.t(EXIST_LABEL),
                }),
            );
            return;
        }
        setGroupsToSemester(semesterId, semesterOptions);
        setOpenGroupsDialog(false);
    };
    const onCancel = () => {
        setSemesterOptions(getGroupOptions(semester.semester_groups));
        setOpenGroupsDialog(false);
    };
    const handleFormReset = () => {
        setSelectedGroups([]);
        clearSemesterService();
    };

    const submit = (values) => {
        const groupsForService = selected.length === 0 ? selectedGroups : selected;
        const semester_groups = groupsForService.map((group) => {
            return { id: group.id, title: group.label };
        });
        const data = { ...values, semester_groups };
        handleSemesterService(data);
    };
    const handleEdit = (semesterId) => selectSemesterService(semesterId);
    const handleCreateArchive = (semesterId) => createArchiveSemesterService(semesterId);

    const searchArr = ['year', 'description', 'startDay', 'endDay'];

    let visibleItems = [];
    if (disabled) {
        visibleItems = search(props.disabledSemesters, term, searchArr);
    } else if (archived) {
        visibleItems = search(props.archivedSemesters, term, searchArr);
    } else {
        visibleItems = search(props.semesters, term, searchArr);
    }

    const handleClickOpen = (semesterId) => {
        setSemesterId(semesterId);
        setOpen(true);
    };
    const handleClickOpenDefault = (semesterId) => {
        setSemesterId(semesterId);
        setOpenDefault(true);
    };
    const handleClickOpenModal = (semesterId) => {
        setSemesterId(semesterId);
        setOpenModal(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        handleSnackbarCloseService();
    };

    const handleCloseModal = (event, reason) => {
        setOpenModal(false);
        setHideDialogModal(null);
        if (reason === 'clickaway') return;
    };

    const handleClose = (semesterId) => {
        const setDelete = open;
        const setDefault = openDefault;
        setOpen(false);
        setOpenDefault(false);
        if (!semesterId) return;
        if (hideDialog) {
            if (disabled) {
                const semester = props.disabledSemesters.find(
                    (semester) => semester.id === semesterId,
                );
                setEnabledSemestersService(semester);
            } else {
                const semester = props.semesters.find((semester) => semester.id === semesterId);
                setDisabledSemestersService(semester);
            }
        } else if (setDelete) {
            removeSemesterCardService(semesterId);
        } else if (setDefault) {
            setDefaultSemesterById(semesterId);
        }
        setHideDialog(null);
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
        setArchived(false);
    };

    const showArchivedHandler = () => {
        setArchived(!archived);
        !archived === true ? setScheduleTypeService('archived') : setScheduleTypeService('default');
        setDisabled(false);
    };
    const handleSemesterCopySubmit = (values) => {
        semesterCopy({
            fromSemesterId: +semesterId,
            toSemesterId: +values.toSemesterId,
        });
        setOpenModal(false);
        setHideDialogModal(null);
    };

    const handleSemesterArchivedPreview = (semesterId) => {
        viewArchivedSemester(+semesterId);
    };
    const setClassNameForDefaultSemester = (semester) => {
        const defaultSemesterName = 'default';
        const className = 'svg-btn edit-btn';
        return semester.defaultSemester === true
            ? `${className} ${defaultSemesterName}`
            : className;
    };

    return (
        <>
            <NavigationPage name={navigationNames.SEMESTER_PAGE} val={navigation.SEMESTERS} />
            <ConfirmDialog
                cardId={semesterId}
                whatDelete="semester"
                isHide={hideDialog}
                open={open}
                onClose={handleClose}
            />
            <SetChangeDialog
                cardId={semesterId}
                isHide={hideDialog}
                open={openDefault}
                onClose={handleClose}
            />
            <ModalWindow
                whatDelete="semester"
                isHide={hideDialogModal}
                open={openModal}
                onClose={handleCloseModal}
                windowTitle={t(SEMESTER_COPY_LABEL)}
                isOkButton={false}
                isNoButton
                noButtonLabel={t(CLOSE_LABEL)}
            >
                <SemesterCopyForm
                    semesterId={semesterId}
                    onSubmit={handleSemesterCopySubmit}
                    submitButtonLabel={t(COPY_LABEL)}
                />
            </ModalWindow>
            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel
                        SearchChange={SearchChange}
                        showDisabled={showDisabledHandle}
                        showArchived={showArchivedHandler}
                    />
                    {disabled || archived ? (
                        ''
                    ) : (
                        <SemesterForm
                            selectedGroups={selectedGroups}
                            setSelectedGroups={setSelectedGroups}
                            selected={selected}
                            setSelected={setSelected}
                            className="form"
                            onSubmit={submit}
                            onReset={handleFormReset}
                            semester={edit ? semester : {}}
                        />
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleItems.length === 0 && <NotFound name={t(SEMESTERY_LABEL)} />}
                    {visibleItems.map((semester, index) => {
                        const sem_days = [];

                        semester.semester_days.forEach((day) =>
                            sem_days.push(t(`common:day_of_week_${day}`)),
                        );
                        return (
                            <Card
                                key={index}
                                class={`semester-card done-card ${
                                    semester.currentSemester ? 'current' : ''
                                }`}
                            >
                                <div className="cards-btns">
                                    {!disabled && !archived ? (
                                        <>
                                            <GiSightDisabled
                                                className="svg-btn copy-btn"
                                                title={t(COMMON_SET_DISABLED)}
                                                onClick={() => {
                                                    setHideDialog(disabledCard.HIDE);
                                                    handleClickOpen(semester.id);
                                                }}
                                            />
                                            <FaEdit
                                                className="svg-btn edit-btn"
                                                title={t(EDIT_TITLE)}
                                                onClick={() => {
                                                    handleEdit(semester.id);
                                                    setEdit(true);
                                                }}
                                            />
                                            <FaCopy
                                                className="svg-btn copy-btn"
                                                title={t(COPY_LABEL)}
                                                onClick={() => {
                                                    handleClickOpenModal(semester.id);
                                                }}
                                            />
                                            {semester.currentSemester ? (
                                                ''
                                            ) : (
                                                <FaFileArchive
                                                    className="svg-btn archive-btn"
                                                    title={t(COMMON_MAKE_ARCHIVE)}
                                                    onClick={() => {
                                                        handleCreateArchive(semester.id);
                                                    }}
                                                />
                                            )}
                                        </>
                                    ) : !archived ? (
                                        <IoMdEye
                                            className="svg-btn copy-btn"
                                            title={t(COMMON_SET_ENABLED)}
                                            onClick={() => {
                                                setHideDialog(disabledCard.SHOW);
                                                handleClickOpen(semester.id);
                                            }}
                                        />
                                    ) : (
                                        <IoMdEye
                                            className="svg-btn copy-btn"
                                            title={t(COMMON_PREVIEW)}
                                            onClick={() => {
                                                handleSemesterArchivedPreview(semester.id);
                                            }}
                                        />
                                    )}
                                    <MdDelete
                                        className="svg-btn delete-btn"
                                        title={t(DELETE_TITLE)}
                                        onClick={() => handleClickOpen(semester.id)}
                                    />

                                    <MdDonutSmall
                                        className={setClassNameForDefaultSemester(semester)}
                                        title={t(SET_DEFAULT_TITLE)}
                                        onClick={() => handleClickOpenDefault(semester.id)}
                                    />
                                </div>

                                <p className="semester-card__description">
                                    <small>{`${t(SEMESTER_LABEL)}:`}</small>
                                    <b>{semester.description}</b>
                                    {` ( ${semester.year} )`}
                                </p>
                                <p className="semester-card__description">
                                    <b>
                                        {semester.startDay} - {semester.endDay}
                                    </b>
                                </p>
                                <p className="semester-card__description">
                                    {`${t(COMMON_DAY_LABEL)}: `}
                                    {sem_days.join(', ')}
                                </p>
                                <p className="semester-card__description">
                                    {`${t(COMMON_CLASS_SCHEDULE_MANAGEMENT_TITLE)}: `}
                                    {semester.semester_classes
                                        .map((classItem) => {
                                            return classItem.class_name;
                                        })
                                        .join(', ')}
                                </p>

                                <FaUsers
                                    title={t(FORM_SHOW_GROUPS)}
                                    className="svg-btn copy-btn  semester-groups"
                                    onClick={() => {
                                        setSemesterId(semester.id);
                                        selectSemesterService(semester.id);
                                        setOpenGroupsDialog(true);
                                    }}
                                />
                            </Card>
                        );
                    })}
                </section>
            </div>
            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarClose}
            />
            <MultiselectForGroups
                open={openGroupsDialog}
                options={options}
                value={semesterOptions}
                onChange={setSemesterOptions}
                onCancel={onCancel}
                onClose={onChangeGroups}
            />
        </>
    );
};
const mapStateToProps = (state) => ({
    semesters: state.semesters.semesters,
    semester: state.semesters.semester,
    disabledSemesters: state.semesters.disabledSemesters,
    archivedSemesters: state.semesters.archivedSemesters,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    groups: state.groups.groups,
});

export default connect(mapStateToProps, {})(SemesterPage);
