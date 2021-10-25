import './TeachersList.scss';
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import i18n from 'i18next';
import Card from '../../share/Card/Card';

import { CustomDialog } from '../../share/DialogWindows';
import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import { search } from '../../helper/search';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import NotFound from '../../share/NotFound/NotFound';
import { MultiSelect } from '../../helper/multiselect';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
import { showAllSemestersService } from '../../services/semesterService';
import { getPublicClassScheduleListService } from '../../services/classService';
import { getFirstLetter, getTeacherFullName } from '../../helper/renderTeacher';
import AddTeacherForm from '../../components/AddTeacherForm/AddTeacherForm';
import { clearDepartment, getAllDepartmentsService } from '../../services/departmentService';
import { getShortTitle } from '../../helper/shortTitle';
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
import { FORM_TEACHER_A_LABEL } from '../../constants/translationLabels/formElements';
import {
    COMMON_SET_DISABLED,
    COMMON_EDIT_HOVER_TITLE,
    COMMON_DELETE_HOVER_TITLE,
    COMMON_SET_ENABLED,
    SEND_SCHEDULE_FOR_TEACHER,
    TEACHER_DEPARTMENT,
} from '../../constants/translationLabels/common';

const TeacherList = (props) => {
    const { t } = useTranslation('common');

    const {
        enabledTeachers,
        disabledTeachers,
        defaultSemester,
        departments,
        department,
        semesters,
    } = props;
    const [term, setTerm] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [selected, setSelected] = useState([]);
    const [teacherId, setTeacherId] = useState(-1);
    const [isOpenMultiSelectDialog, setIsOpenMultiSelectDialog] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState('');

    useEffect(() => {
        showAllTeachersService();
        showAllSemestersService();
        getAllDepartmentsService();
        getCurrentSemesterService();
        getDefaultSemesterService();
        getDisabledTeachersService();
        showAllPublicSemestersService();
        getPublicClassScheduleListService();
    }, []);

    const SearchChange = setTerm;
    const visibleItems = isDisabled
        ? search(disabledTeachers, term, ['name', 'surname', 'patronymic'])
        : search(enabledTeachers, term, ['name', 'surname', 'patronymic']);

    const setOptions = () => {
        return enabledTeachers.map((item) => {
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
    const setDepartmentOptions = () => {
        return departments.map((item) => {
            return { id: item.id, value: item.id, label: `${item.name}` };
        });
    };
    const options = setOptions();
    const semesterOptions = setSemesterOptions();
    const departmentOptions = setDepartmentOptions();

    const teacherSubmit = (values) => {
        const sendData = { ...values, department };
        handleTeacherService(sendData);
        clearDepartment();
    };
    const setEnabledDisabledDepartment = (currentTeacherId) => {
        const teacher = [...enabledTeachers, ...disabledTeachers].find(
            (teacherEl) => teacherEl.id === currentTeacherId,
        );
        const changeDisabledStatus = {
            [dialogTypes.SET_VISIBILITY_ENABLED]: setEnabledTeachersService(teacher),
            [dialogTypes.SET_VISIBILITY_DISABLED]: setDisabledTeachersService(teacher),
        };
        return changeDisabledStatus[confirmDialogType];
    };
    const showConfirmDialog = (id, dialogType) => {
        setTeacherId(id);
        setConfirmDialogType(dialogType);
        setIsOpenConfirmDialog(true);
    };
    const acceptConfirmDialog = (id) => {
        setIsOpenConfirmDialog(false);
        if (!id) return;
        if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
            setEnabledDisabledDepartment(id);
        } else {
            removeTeacherCardService(id);
        }
    };
    const closeSelectionDialog = () => {
        setIsOpenMultiSelectDialog(false);
    };
    const clearSelection = () => {
        setSelected([]);
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
        const semesterId = selectedSemester === '' && defaultSemester.id;
        const { language } = i18n;
        const data = { semesterId, teachersId, language };
        sendTeachersScheduleService(data);
        clearSelection();
    };
    const isChosenSelection = () => {
        return selected.length !== 0;
    };
    const changeDisable = () => {
        setIsDisabled((prev) => !prev);
    };
    const parseDefaultSemester = () => {
        return {
            id: defaultSemester.id,
            value: defaultSemester.id,
            label: `${defaultSemester.description}`,
        };
    };
    return (
        <>
            <NavigationPage name={navigationNames.TEACHER_LIST} val={navigation.TEACHERS} />
            <div className="cards-container">
                {isOpenConfirmDialog && (
                    <CustomDialog
                        type={confirmDialogType}
                        cardId={teacherId}
                        whatDelete={cardType.TEACHER}
                        open={isOpenConfirmDialog}
                        onClose={acceptConfirmDialog}
                    />
                )}

                <aside className="form-with-search-panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={changeDisable} />
                    <Button
                        className="send-button"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setIsOpenMultiSelectDialog(true);
                        }}
                    >
                        {t(SEND_SCHEDULE_FOR_TEACHER)}
                    </Button>
                    {isOpenMultiSelectDialog && (
                        <MultiSelect
                            open={isOpenMultiSelectDialog}
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
                    )}

                    {!isDisabled && (
                        <AddTeacherForm
                            departments={departmentOptions}
                            teachers={enabledTeachers}
                            onSubmit={teacherSubmit}
                            onSetSelectedCard={selectTeacherCardService}
                        />
                    )}
                </aside>

                <section className="container-flex-wrap">
                    {visibleItems.length === 0 && <NotFound name={t(FORM_TEACHER_A_LABEL)} />}
                    {visibleItems.map((teacherItem) => (
                        <Card key={teacherItem.id} additionClassName="teacher-card done-card">
                            <div className="cards-btns">
                                {!isDisabled ? (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t(COMMON_SET_DISABLED)}
                                            onClick={() => {
                                                showConfirmDialog(
                                                    teacherItem.id,
                                                    dialogTypes.SET_VISIBILITY_DISABLED,
                                                );
                                            }}
                                        />
                                        <FaEdit
                                            className="svg-btn edit-btn"
                                            title={t(COMMON_EDIT_HOVER_TITLE)}
                                            onClick={() => selectTeacherCardService(teacherItem.id)}
                                        />
                                    </>
                                ) : (
                                    <IoMdEye
                                        className="svg-btn copy-btn"
                                        title={t(COMMON_SET_ENABLED)}
                                        onClick={() => {
                                            showConfirmDialog(
                                                teacherItem.id,
                                                dialogTypes.SET_VISIBILITY_ENABLED,
                                            );
                                        }}
                                    />
                                )}
                                <MdDelete
                                    className="svg-btn delete-btn"
                                    title={t(COMMON_DELETE_HOVER_TITLE)}
                                    onClick={() =>
                                        showConfirmDialog(
                                            teacherItem.id,
                                            dialogTypes.DELETE_CONFIRM,
                                        )
                                    }
                                />
                            </div>
                            <h2 className="teacher-card-name">
                                {getShortTitle(getTeacherFullName(teacherItem), 30)}
                            </h2>
                            <p className="teacher-card-title">
                                {`${teacherItem.position} ${
                                    teacherItem.department !== null
                                        ? `${t(TEACHER_DEPARTMENT)} ${teacherItem.department.name}`
                                        : ''
                                }`}
                            </p>
                        </Card>
                    ))}
                </section>
            </div>
        </>
    );
};
const mapStateToProps = (state) => ({
    enabledTeachers: state.teachers.teachers,
    disabledTeachers: state.teachers.disabledTeachers,
    classScheduler: state.classActions.classScheduler,
    currentSemester: state.schedule.currentSemester,
    defaultSemester: state.schedule.defaultSemester,
    semesters: state.schedule.semesters,
    departments: state.departments.departments,
    department: state.departments.department,
});

export default connect(mapStateToProps, {})(TeacherList);
