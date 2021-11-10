import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
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
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import TeachersList from './TeachersList/TeachersList';
import './TeachersList/TeachersList.scss';

const TeachersPage = (props) => {
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

    const changeDisable = () => {
        setIsDisabled((prev) => !prev);
    };

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

    const closeSelectionDialog = () => {
        // del
        setIsOpenMultiSelectDialog(false);
    };
    const clearSelection = () => {
        // del
        setSelected([]);
    };
    const cancelSelection = () => {
        clearSelection();
        closeSelectionDialog();
    };
    const sendTeachers = () => {
        closeSelectionDialog(); // change
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
                    <div>
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
                        <AddTeacherForm
                            departments={departmentOptions}
                            teachers={enabledTeachers}
                            onSubmit={teacherSubmit}
                            onSetSelectedCard={selectedTeacherCard}
                        />
                    </div>
                )}
            </aside>

            <TeachersList
                visibleItems={visibleItems}
                isDisabled={isDisabled}
                setTeacherId={setTeacherId}
                showConfirmDialog={showConfirmDialog}
                selectedTeacherCard={selectedTeacherCard}
            />
        </div>
    );
};

export default TeachersPage;
