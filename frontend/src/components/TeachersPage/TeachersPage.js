import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import i18n from 'i18next';

import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import { SEND_SCHEDULE_FOR_TEACHER } from '../../constants/translationLabels/common';
import { search } from '../../helper/search';
import { MultiSelect } from '../../helper/multiselect';
import { getFirstLetter } from '../../helper/renderTeacher';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import { clearDepartment, getAllDepartmentsService } from '../../services/departmentService';
import { getPublicClassScheduleListService } from '../../services/classService';
import AddTeacherForm from './AddTeacherForm/AddTeacherForm';
import { setIsOpenConfirmDialog } from '../../actions/dialog';
import { getAllSemestersStart } from '../../actions/semesters';
import {
    getAllPublicSemestersStart,
    getCurrentSemesterRequsted,
    getDefaultSemesterRequsted,
    sendTeacherScheduleStart,
} from '../../actions/schedule';
import { getLessonTypes, selectTeacherCard } from '../../actions';
import {
    deleteTeacherStart,
    handleTeacherStart,
    setDisabledTeachersStart,
    showAllTeachersStart,
} from '../../actions/teachers';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import TeacherList from './TeachersList/TeacherList';
import './TeachersList/TeachersList.scss';

const TeacherPage = (props) => {
    const { t } = useTranslation('common');

    const {
        enabledTeachers,
        disabledTeachers,
        defaultSemester,
        departments,
        department,
        semesters,
        getAllSemestersItems,
        setOpenConfirmDialog,
        isOpenConfirmDialog,
        getCurrentSemester,
        getDefaultSemester,
        getAllPublicSemesters,
        sendTeacherSchedule,
        selectedTeacherCard,
        deleteTeacher,
        showAllTeachers,
        getDisabledTeachers,
        handleTeacher,
    } = props;
    const [term, setTerm] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [selected, setSelected] = useState([]);
    const [teacherId, setTeacherId] = useState(-1);
    const [isOpenMultiSelectDialog, setIsOpenMultiSelectDialog] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [confirmDialogType, setConfirmDialogType] = useState('');

    useEffect(() => {
        getCurrentSemester();
        getDefaultSemester();
        getDisabledTeachers();
        showAllTeachers();
        getAllSemestersItems();
        getAllDepartmentsService();
        getAllPublicSemesters();
        getPublicClassScheduleListService();
    }, []);

    const visibleItems = search(isDisabled ? disabledTeachers : enabledTeachers, term, [
        'name',
        'surname',
        'patronymic',
    ]);

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

        handleTeacher(sendData);
        clearDepartment();
    };
    const setEnabledDisabled = (currentTeacherId) => {
        const teacher = [...enabledTeachers, ...disabledTeachers].find(
            (teacherEl) => teacherEl.id === currentTeacherId,
        );

        const isDisable = dialogTypes.SET_VISIBILITY_ENABLED !== confirmDialogType;
        handleTeacher({ ...teacher, disable: isDisable });
    };
    const showConfirmDialog = (id, dialogType) => {
        setTeacherId(id);
        setConfirmDialogType(dialogType);
        setOpenConfirmDialog(true);
    };
    const acceptConfirmDialog = () => {
        setOpenConfirmDialog(false);
        // if (!id) return;
        if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
            setEnabledDisabled(teacherId);
        } else {
            deleteTeacher(teacherId);
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
        sendTeacherSchedule(data);
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
        <div className="cards-container">
            <CustomDialog
                type={confirmDialogType}
                whatDelete={cardType.TEACHER}
                open={isOpenConfirmDialog}
                handelConfirm={acceptConfirmDialog}
            />

            <aside className="form-with-search-panel">
                <SearchPanel SearchChange={setTerm} showDisabled={changeDisable} />
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
                        onSetSelectedCard={selectedTeacherCard}
                    />
                )}
            </aside>

            <TeacherList
                visibleItems={visibleItems}
                isDisabled={isDisabled}
                setTeacherId={setTeacherId}
                showConfirmDialog={showConfirmDialog}
                selectedTeacherCard={selectedTeacherCard}
            />
        </div>
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
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
    subjects: state.subjects.subjects,
    lessonTypes: state.lesson.lessonTypes,
});
const mapDispatchToProps = (dispatch) => ({
    getLessonTypes: () => dispatch(getLessonTypes()),
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
    getAllSemestersItems: () => dispatch(getAllSemestersStart()),
    getCurrentSemester: () => dispatch(getCurrentSemesterRequsted()),
    getDefaultSemester: () => dispatch(getDefaultSemesterRequsted()),
    getAllPublicSemesters: () => dispatch(getAllPublicSemestersStart()),
    sendTeacherSchedule: (data) => dispatch(sendTeacherScheduleStart(data)),
    selectedTeacherCard: (teacherCardId) => dispatch(selectTeacherCard(teacherCardId)),
    deleteTeacher: (id) => dispatch(deleteTeacherStart(id)),
    showAllTeachers: () => dispatch(showAllTeachersStart()),
    getDisabledTeachers: () => dispatch(setDisabledTeachersStart()),
    handleTeacher: (values) => dispatch(handleTeacherStart(values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TeacherPage);
