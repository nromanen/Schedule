import { connect } from 'react-redux';
import { FaEdit, FaUsers, FaFileArchive } from 'react-icons/fa';
import { MdDelete, MdDonutSmall } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import './SemesterPage.scss';
import { GiSightDisabled, IoMdEye, FaCopy } from 'react-icons/all';
import Card from '../../share/Card/Card';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import { ConfirmDialog } from '../../share/modals/dialog';
import { ModalWindow } from '../../share/modals/modal/modal';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import SemesterForm from '../../components/SemesterForm/SemesterForm';
import SemesterCopyForm from '../../components/SemesterCopyForm/SemesterCopyForm';
import {
    clearSemesterService,
    selectSemesterService,
    handleSemesterService,
    getDisabledSemestersService,
    removeSemesterCardService,
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
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import { SetChangeDialog } from '../../share/modals/modal/setDefaultDialog';
import { MultiselectForGroups } from '../../helper/MultiselectForGroups';
import { showAllGroupsService } from '../../services/groupService';
import { successHandler } from '../../helper/handlerAxios';
import i18n from '../../helper/i18n';

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
    const [term, setTerm] = useState('');
    const [openGroupsDialog, setOpenGroupsDialog] = useState(false);
    const [selected, setSelected] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [semesterOptions, setSemesterOptions] = useState([]);
    const [edit, setEdit] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [archived, setArchived] = useState(false);
    const [isOpenChangeDialog, setIsOpenChangeDialog] = useState(false);
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
    const [isOpenSemesterCopyForm, setIsOpenSemesterCopyForm] = useState(null);
    const [semesterCard, setSemesterCard] = useState({ id: null, disabledStatus: null });
    const [visibleItems, setVisibleItems] = useState([]);
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
    useEffect(() => {
        showAllGroupsService();
        showAllSemestersService();
        getDisabledSemestersService();
        getArchivedSemestersService();
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
        const semesterGroups = selected.map((group) => {
            return { id: group.id, title: group.label };
        });
        handleSemesterService({ ...values, semesterGroups });
    };
    const resetSemesterForm = () => {
        setSelectedGroups([]);
        clearSemesterService();
    };

    const showConfirmDialog = (id, disabledStatus) => {
        setSemesterCard({ id, disabledStatus });
        setIsOpenConfirmDialog(true);
    };
    const showDefaultSemesterDialog = (id) => {
        setSemesterCard({ id });
        setIsOpenChangeDialog(true);
    };

    const showSemesterCopyForm = (id) => {
        setSemesterCard({ id });
        setIsOpenSemesterCopyForm(true);
    };
    const closeSemesterCopyForm = () => {
        setIsOpenSemesterCopyForm(false);
        setIsOpenSemesterCopyForm(null);
    };
    const acceptDefaultSemesterDialog = (semesterId) => {
        setDefaultSemesterById(semesterId);
        setIsOpenChangeDialog(false);
    };
    const changeGSemesterDisabledStatus = (semesterId) => {
        const foundSemester = [...disabledSemesters, ...enabledSemesters].find(
            (semesterEl) => semesterEl.id === semesterId,
        );
        const changeDisabledStatus = {
            Show: setEnabledSemestersService(foundSemester),
            Hide: setDisabledSemestersService(foundSemester),
        };
        return changeDisabledStatus[semesterCard.disabledStatus];
    };

    const acceptConfirmDialog = (semesterId) => {
        setIsOpenConfirmDialog(false);
        if (!semesterId) return;
        if (semesterCard.disabledStatus) {
            changeGSemesterDisabledStatus(semesterId);
        } else {
            removeSemesterCardService(semesterId);
        }
        setSemesterCard((prev) => ({ ...prev, disabledStatus: null }));
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
        setArchived(false);
    };

    const showArchivedHandler = () => {
        setArchived(!archived);
        setDisabled(false);
        return !archived === true
            ? setScheduleTypeService('archived')
            : setScheduleTypeService('default');
    };
    const submitSemesterCopy = (values) => {
        semesterCopy({
            fromSemesterId: +semesterCard.id,
            toSemesterId: +values.toSemesterId,
        });
        setIsOpenSemesterCopyForm(null);
    };
    const onChangeGroups = () => {
        const beginGroups =
            semester.semester_groups !== undefined ? getGroupOptions(semester.semester_groups) : [];
        const finishGroups = [...semesterOptions];
        if (isEqual(beginGroups, finishGroups)) {
            successHandler(
                i18n.t('serviceMessages:group_exist_in_this_semester', {
                    cardType: i18n.t('common:group_title'),
                    actionType: i18n.t('serviceMessages:student_label'),
                }),
            );
            return;
        }
        setGroupsToSemester(semesterCard.id, semesterOptions);
        setOpenGroupsDialog(false);
    };

    const handleSemesterArchivedPreview = (semesterId) => {
        viewArchivedSemester(+semesterId);
    };
    const setClassNameForDefaultSemester = (currentSemester) => {
        const defaultSemesterName = 'default';
        const className = 'svg-btn edit-btn';
        return currentSemester.defaultSemester === true
            ? `${className} ${defaultSemesterName}`
            : className;
    };

    const handleSnackbarClose = () => {
        handleSnackbarCloseService();
    };

    // setScheduleTypeService('archived');
    return (
        <>
            <NavigationPage name={navigationNames.SEMESTER_PAGE} val={navigation.SEMESTERS} />
            <ConfirmDialog
                cardId={semesterCard.id}
                whatDelete="semester"
                isHide={semesterCard.disabledStatus}
                open={isOpenConfirmDialog}
                onClose={acceptConfirmDialog}
            />
            <SetChangeDialog
                cardId={semesterCard.id}
                isHide={semesterCard.disabledStatus}
                open={isOpenChangeDialog}
                onClose={acceptDefaultSemesterDialog}
            />
            <ModalWindow
                whatDelete="semester"
                isHide={semesterCard.disabledStatus}
                open={isOpenSemesterCopyForm}
                onClose={closeSemesterCopyForm}
                windowTitle={t('semester_copy_label')}
                isOkButton={false}
                isNoButton
                noButtonLabel={t('close_label')}
            >
                <SemesterCopyForm
                    semesterId={semesterCard.id}
                    onSubmit={submitSemesterCopy}
                    submitButtonLabel={t('copy_label')}
                />
            </ModalWindow>
            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel
                        SearchChange={SearchChange}
                        showDisabled={showDisabledHandle}
                        showArchived={showArchivedHandler}
                    />
                    {!(disabled || archived) && (
                        <SemesterForm
                            selectedGroups={selectedGroups}
                            setSelectedGroups={setSelectedGroups}
                            selected={selected}
                            setSelected={setSelected}
                            className="form"
                            onSubmit={submitSemesterForm}
                            onReset={resetSemesterForm}
                            semester={edit && semester}
                        />
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleItems.length === 0 && <NotFound name={t('semestry_label')} />}
                    {visibleItems.map((semesterItem) => {
                        const semDays = [];
                        semesterItem.semester_days.forEach((day) =>
                            semDays.push(t(`common:day_of_week_${day}`)),
                        );
                        return (
                            <Card
                                key={semesterItem.id}
                                class={`semester-card done-card ${
                                    semesterItem.currentSemester ? 'current' : ''
                                }`}
                            >
                                <div className="cards-btns">
                                    {!(disabled || archived) && (
                                        <>
                                            <GiSightDisabled
                                                className="svg-btn copy-btn"
                                                title={t('common:set_disabled')}
                                                onClick={() => {
                                                    showConfirmDialog(
                                                        semesterItem.id,
                                                        disabledCard.HIDE,
                                                    );
                                                }}
                                            />
                                            <FaEdit
                                                className="svg-btn edit-btn"
                                                title={t('edit_title')}
                                                onClick={() => {
                                                    selectSemesterService(semesterItem.id);
                                                    setEdit(true);
                                                }}
                                            />
                                            <FaCopy
                                                className="svg-btn copy-btn"
                                                title={t('copy_label')}
                                                onClick={() => {
                                                    showSemesterCopyForm(semesterItem.id);
                                                }}
                                            />
                                            {!semesterItem.currentSemester && (
                                                <FaFileArchive
                                                    className="svg-btn archive-btn"
                                                    title={t('common:make_archive')}
                                                    onClick={() => {
                                                        createArchiveSemesterService(
                                                            semesterItem.id,
                                                        );
                                                    }}
                                                />
                                            )}
                                        </>
                                    )}
                                    {!archived && (
                                        <IoMdEye
                                            className="svg-btn copy-btn"
                                            title={t('common:set_enabled')}
                                            onClick={() => {
                                                showConfirmDialog(
                                                    semesterItem.id,
                                                    disabledCard.SHOW,
                                                );
                                            }}
                                        />
                                    )}
                                    {archived && (
                                        <IoMdEye
                                            className="svg-btn copy-btn"
                                            title={t('common:preview')}
                                            onClick={() => {
                                                handleSemesterArchivedPreview(semesterItem.id);
                                            }}
                                        />
                                    )}
                                    <MdDelete
                                        className="svg-btn delete-btn"
                                        title={t('delete_title')}
                                        onClick={() => showConfirmDialog(semesterItem.id)}
                                    />

                                    <MdDonutSmall
                                        className={setClassNameForDefaultSemester(semesterItem)}
                                        title={t('set_default_title')}
                                        onClick={() => showDefaultSemesterDialog(semesterItem.id)}
                                    />
                                </div>

                                <p className="semester-card__description">
                                    <small>{`${t('semester_label')}:`}</small>
                                    <b>{semesterItem.description}</b>
                                    {` ( ${semesterItem.year} )`}
                                </p>
                                <p className="semester-card__description">
                                    <b>
                                        {semesterItem.startDay} - {semesterItem.endDay}
                                    </b>
                                </p>
                                <p className="semester-card__description">
                                    {`${t('common:days_label')}: `}
                                    {semDays.join(', ')}
                                </p>
                                <p className="semester-card__description">
                                    {`${t('common:ClassSchedule_management_title')}: `}
                                    {semesterItem.semester_classes
                                        .map((classItem) => {
                                            return classItem.class_name;
                                        })
                                        .join(', ')}
                                </p>

                                <FaUsers
                                    title={t('formElements:show_groups')}
                                    className="svg-btn copy-btn  semester-groups"
                                    onClick={() => {
                                        setSemesterCard(semesterItem.id);
                                        selectSemesterService(semesterItem.id);
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

export default connect(mapStateToProps, {})(SemesterPage);
