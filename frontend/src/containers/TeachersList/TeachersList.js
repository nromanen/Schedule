import React, { useEffect, useState } from 'react';

import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import i18n from 'i18next';
import AddTeacherForm from '../../components/AddTeacherForm/AddTeacherForm';
import Card from '../../share/Card/Card';

import { CustomDialog } from '../../share/DialogWindows';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';

import './TeachersList.scss';

import {
    getCurrentSemesterService,
    getDefaultSemesterService,
    sendTeachersScheduleService,
    showAllPublicSemestersService,
} from '../../services/scheduleService';
import {
    getDisabledTeachersService,
    handleTeacherService,
    removeTeacherCardService,
    selectTeacherCardService,
    setDisabledTeachersService,
    setEnabledTeachersService,
    showAllTeachersService,
} from '../../services/teacherService';

import { search } from '../../helper/search';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import NotFound from '../../share/NotFound/NotFound';
import { disabledCard } from '../../constants/disabledCard';
import { getPublicClassScheduleListService } from '../../services/classService';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import Multiselect, { MultiSelect } from '../../helper/multiselect';
import Example from '../../helper/multiselect';
import { getFirstLetter, getTeacherFullName } from '../../helper/renderTeacher';
import { showAllSemestersService } from '../../services/semesterService';
import {
    clearDepartment,
    getAllDepartmentsService,
    getDepartmentByIdService,
} from '../../services/departmentService';
import { clearDepartmentForm, getDepartItemById } from '../../actions/departments';
import { getShortTitle } from '../../helper/shortTitle';
import { TEACHER_LABEL } from '../../constants/services';

const TeacherList = (props) => {
    const { t } = useTranslation('common');

    const [open, setOpen] = useState(false);
    const [subDialogType, setSubDialogType] = useState('');
    const [teacherCardId, setTeacherId] = useState();
    const [term, setTerm] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [hideDialog, setHideDialog] = useState(null);
    const [openSelect, setOpenSelect] = useState(false);

    useEffect(() => showAllTeachersService(), []);
    useEffect(() => getDisabledTeachersService(), []);
    useEffect(() => getPublicClassScheduleListService(), []);
    useEffect(() => getDefaultSemesterService(), []);
    useEffect(() => getCurrentSemesterService(), []);
    useEffect(() => showAllPublicSemestersService(), []);
    useEffect(() => showAllSemestersService(), []);
    useEffect(() => getAllDepartmentsService(), []);
    const {
        teachers,
        disabledTeachers,
        currentSemester,
        semesters,
        defaultSemester,
        departments,
        department,
    } = props;

    const setOptions = () => {
        return teachers.map((item) => {
            return {
                id: item.id,
                value: item.id,
                label: `${item.surname} ${getFirstLetter(item.name)} ${getFirstLetter(
                    item.patronymic,
                )}`,
            };
        });
    };
    const setSemesterOptions = () => {
        return semesters !== undefined
            ? semesters.map((item) => {
                  return { id: item.id, value: item.id, label: `${item.description}` };
              })
            : null;
    };
    const parseDefaultSemester = () => {
        return {
            id: defaultSemester.id,
            value: defaultSemester.id,
            label: `${defaultSemester.description}`,
        };
    };
    const setDepartmentOptions = () => {
        return departments.map((item) => {
            return { id: item.id, value: item.id, label: `${item.name}` };
        });
    };

    const teacherLength = disabled ? disabledTeachers.length : teachers.length;
    const [selected, setSelected] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const options = setOptions();
    const semesterOptions = setSemesterOptions();
    const departmentOptions = setDepartmentOptions();
    const teacherSubmit = (values) => {
        const sendData = { ...values, department };
        handleTeacherService(sendData);
        clearDepartment();
    };

    const selectTeacherCard = (teacherCardId) => {
        selectTeacherCardService(teacherCardId);
    };

    const removeTeacherCard = (id) => {
        removeTeacherCardService(id);
    };

    const handleClickOpen = (teacherCardId) => {
        setTeacherId(teacherCardId);
        setOpen(true);
    };

    const handleClose = (teacherCardId) => {
        setOpen(false);
        if (!teacherCardId) {
            return;
        }
        switch (subDialogType) {
            case dialogTypes.DELETE_CONFIRM:
                removeTeacherCard(teacherCardId);
                break;
            case dialogTypes.SET_VISIBILITY_DISABLED:
                {
                    const teacher = teachers.find(
                        (teacherItem) => teacherItem.id === teacherCardId,
                    );
                    setDisabledTeachersService(teacher);
                }
                break;
            case dialogTypes.SET_VISIBILITY_ENABLED:
                {
                    const teacher = disabledTeachers.find(
                        (teacherItem) => teacherItem.id === teacherCardId,
                    );
                    setEnabledTeachersService(teacher);
                }
                break;
            default:
                break;
        }
        setHideDialog(null);
    };
    const handleCloseSending = (scheduleId) => {
        setOpenSelect(false);
    };
    const [teacher, setTeacher] = useState(0);

    const visibleItems = disabled
        ? search(disabledTeachers, term, ['name', 'surname', 'patronymic'])
        : search(teachers, term, ['name', 'surname', 'patronymic']);

    const SearchChange = (term) => {
        setTerm(term);
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
    };

    const handleToUpperCase = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const cancelSelection = () => {
        clearSelection();
        closeSelectionDialog();
    };
    const sendTeachers = () => {
        closeSelectionDialog();
        const teachersId = selected.map((item) => {
            return item.id;
        });
        const semesterId = selectedSemester === '' ? defaultSemester.id : selectedSemester.id;
        const { language } = i18n;
        const data = { semesterId, teachersId, language };
        sendTeachersScheduleService(data);
        clearSelection();
    };
    const closeSelectionDialog = () => {
        setOpenSelect(false);
    };
    const clearSelection = () => {
        setSelected([]);
    };
    const isChosenSelection = () => {
        return selected.length !== 0;
    };
    const getTeacherTitle = (title) => {
        const MAX_LENGTH = 30;
        return getShortTitle(title, MAX_LENGTH);
    };
    return (
        <>
            <NavigationPage name={navigationNames.TEACHER_LIST} val={navigation.TEACHERS} />
            <div className="cards-container">
                <CustomDialog
                    type={subDialogType}
                    cardId={teacherCardId}
                    whatDelete={cardType.TEACHER}
                    open={open}
                    onClose={handleClose}
                />

                <aside className="form-with-search-panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={showDisabledHandle} />
                    <Button
                        className="send-button"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setOpenSelect(true);
                        }}
                    >
                        {t('send_schedule_for_teacher')}
                    </Button>
                    <>
                        <MultiSelect
                            open={openSelect}
                            options={options}
                            value={selected}
                            onChange={setSelected}
                            onCancel={cancelSelection}
                            onSentTeachers={sendTeachers}
                            isEnabledSentBtn={isChosenSelection()}
                            semesters={semesterOptions}
                            defaultSemester={parseDefaultSemester()}
                            onChangeSemesterValue={setSelectedSemester}
                        />
                    </>

                    {disabled ? (
                        ''
                    ) : (
                        <AddTeacherForm
                            departments={departmentOptions}
                            teachers={teachers}
                            onSubmit={teacherSubmit}
                            onSetSelectedCard={selectTeacherCard}
                        />
                    )}
                </aside>

                <section className="container-flex-wrap">
                    {visibleItems.length === 0 && <NotFound name={t(TEACHER_LABEL)} />}
                    {teacherLength > 0 ? (
                        visibleItems.map((teacher, index) => (
                            <Card key={index} {...teacher} class="teacher-card done-card">
                                <div className="cards-btns">
                                    {!disabled ? (
                                        <>
                                            <GiSightDisabled
                                                className="svg-btn copy-btn"
                                                title={t('common:set_disabled')}
                                                onClick={() => {
                                                    setSubDialogType(
                                                        dialogTypes.SET_VISIBILITY_DISABLED,
                                                    );
                                                    handleClickOpen(teacher.id);
                                                }}
                                            />
                                            <FaEdit
                                                className="svg-btn edit-btn"
                                                title={t('common:edit_hover_title')}
                                                onClick={() => selectTeacherCard(teacher.id)}
                                            />
                                        </>
                                    ) : (
                                        <IoMdEye
                                            className="svg-btn copy-btn"
                                            title={t('common:set_enabled')}
                                            onClick={() => {
                                                setSubDialogType(dialogTypes.SET_VISIBILITY_ENABLED);
                                                handleClickOpen(teacher.id);
                                            }}
                                        />
                                    )}
                                    <MdDelete
                                        className="svg-btn delete-btn"
                                        title={t('common:delete_hover_title')}
                                        onClick={() => {
                                            setSubDialogType(dialogTypes.DELETE_CONFIRM);
                                            handleClickOpen(teacher.id);
                                        }}
                                    />
                                </div>
                                <h2 className="teacher-card-name">
                                    {getTeacherTitle(getTeacherFullName(teacher))}
                                </h2>
                                <p className="teacher-card-title">
                                    {`${teacher.position} ${
                                        teacher.department !== null
                                            ? `${t('teacher_department')} ${
                                                  teacher.department.name
                                              }`
                                            : ''
                                    }`}
                                </p>
                            </Card>
                        ))
                    ) : (
                        <h2>{t('teacher_card_no_cards')}</h2>
                    )}
                </section>
            </div>
        </>
    );
};
const mapStateToProps = (state) => ({
    teachers: state.teachers.teachers,
    disabledTeachers: state.teachers.disabledTeachers,
    classScheduler: state.classActions.classScheduler,
    currentSemester: state.schedule.currentSemester,
    defaultSemester: state.schedule.defaultSemester,
    semesters: state.schedule.semesters,
    departments: state.departments.departments,
    department: state.departments.department,
});

export default connect(mapStateToProps, {})(TeacherList);
