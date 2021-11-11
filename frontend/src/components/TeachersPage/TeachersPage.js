import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { dialogTypes } from '../../constants/dialogs';
import { cardType } from '../../constants/cardType';
import { SEND_SCHEDULE_FOR_TEACHER } from '../../constants/translationLabels/common';
import { search } from '../../helper/search';
import { MultiSelect } from '../../helper/multiselect';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import { clearDepartment, getAllDepartmentsService } from '../../services/departmentService';
import { getPublicClassScheduleListService } from '../../services/classService';
import AddTeacherForm from './AddTeacherForm/AddTeacherForm';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import TeachersList from './TeachersList/TeachersList';
import './TeachersList/TeachersList.scss';
import { setDepartmentOptions, setOptions, setSemesterOptions } from '../../utils/selectUtils';

const TeachersPage = (props) => {
    const { t } = useTranslation('common');

    const {
        teacher,
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
        'department.name',
    ]);

    const changeDisable = () => {
        setIsDisabled((prev) => !prev);
    };

    const teacherSubmit = (values) => {
        const sendData = { ...values, department };

        handleTeacher(sendData);
        clearDepartment();
    };

    const setEnabledDisabled = (currentTeacherId) => {
        const findTeacher = [...enabledTeachers, ...disabledTeachers].find(
            (teacherEl) => teacherEl.id === currentTeacherId,
        );

        const isDisable = dialogTypes.SET_VISIBILITY_ENABLED !== confirmDialogType;
        handleTeacher({ ...findTeacher, disable: isDisable });
    };

    const showConfirmDialog = (id, dialogType) => {
        setTeacherId(id);
        setConfirmDialogType(dialogType);
        setOpenConfirmDialog(true);
    };
    const acceptConfirmDialog = () => {
        setOpenConfirmDialog(false);
        if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
            setEnabledDisabled(teacherId);
        } else {
            deleteTeacher(teacherId);
        }
    };

    const cancelSelection = () => {
        setSelected([]);
        setIsOpenMultiSelectDialog(false);
    };

    const sendTeachers = () => {
        setIsOpenMultiSelectDialog(false);
        const teachersId = selected.map((item) => {
            return item.id;
        });
        const semesterId = selectedSemester === '' && defaultSemester.id;
        const { language } = i18n;
        const data = { semesterId, teachersId, language };
        sendTeacherSchedule(data);
        setSelected([]);
    };

    const isChosenSelection = () => {
        return selected.length !== 0;
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
            <div className="form-with-search-panel">
                <div className="teacher-search">
                    <SearchPanel SearchChange={setTerm} showDisabled={changeDisable} />
                </div>

                {!isDisabled && (
                    <div className="teacher-form">
                        <div className="send-schedule">
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
                        </div>
                        <div className="add-form">
                            <AddTeacherForm
                                departments={setDepartmentOptions(departments)}
                                teachers={enabledTeachers}
                                onSubmit={teacherSubmit}
                                onSetSelectedCard={selectedTeacherCard}
                                teacher={teacher}
                            />
                        </div>
                    </div>
                )}
            </div>
            <TeachersList
                visibleItems={visibleItems}
                isDisabled={isDisabled}
                setTeacherId={setTeacherId}
                showConfirmDialog={showConfirmDialog}
                selectedTeacherCard={selectedTeacherCard}
            />

            {isOpenMultiSelectDialog && (
                <MultiSelect
                    open={isOpenMultiSelectDialog}
                    options={setOptions(enabledTeachers)}
                    value={selected}
                    onChange={setSelected}
                    onCancel={cancelSelection}
                    onSentTeachers={sendTeachers}
                    isEnabledSentBtn={isChosenSelection()}
                    semesters={setSemesterOptions(semesters)}
                    defaultSemester={parseDefaultSemester()}
                    onChangeSemesterValue={setSelectedSemester}
                />
            )}

            <CustomDialog
                type={confirmDialogType}
                whatDelete={cardType.TEACHER}
                open={isOpenConfirmDialog}
                handelConfirm={acceptConfirmDialog}
            />
        </div>
    );
};

export default TeachersPage;
