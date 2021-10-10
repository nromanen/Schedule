import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { FaChalkboardTeacher, FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import Card from '../../share/Card/Card';
import AddDepartment from '../../components/AddDepartmentForm/AddDepartmentForm';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import ConfirmDialog from '../../share/modals/dialog';
import { disabledCard } from '../../constants/disabledCard';
import { navigation, navigationNames } from '../../constants/navigation';
import NavigationPage from '../../components/Navigation/NavigationPage';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import { showAllPublicTeachersByDepartmentService } from '../../services/scheduleService';
import ShowDataDialog from '../../share/modals/modal/showDataDialog';
import {
    clearDepartment,
    createDepartmentService,
    deleteDepartmentsService,
    getAllDepartmentsService,
    getDepartmentByIdService,
    getDisabledDepartmentsService,
    setDisabledDepartmentService,
    setEnabledDepartmentService,
    updateDepartmentService,
} from '../../services/departmentService';

const DepartmentPage = (props) => {
    const {
        teachers,
        snackbarType,
        isSnackbarOpen,
        snackbarMessage,
        enabledDepartments,
        disabledDepartments,
    } = props;
    const { t } = useTranslation('formElements');
    const [term, setTerm] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    const [departmentId, setDepartmentId] = useState('');
    const [teacherDialog, setTeacherDialog] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [isEnabledDisabled, setsIsEnabledDisabled] = useState('');

    useEffect(() => {
        if (isDisabled) getDisabledDepartmentsService();
    }, [isDisabled]);
    useEffect(() => getAllDepartmentsService(), []);

    const SearchChange = setTerm;
    const visibleDepartments = isDisabled
        ? search(disabledDepartments, term, ['name'])
        : search(enabledDepartments, term, ['name']);

    const clearDepartmentForm = () => {
        clearDepartment();
    };

    useEffect(() => clearDepartmentForm(), []);

    const submitAddForm = (data) => {
        return data.id ? createDepartmentService(data) : updateDepartmentService(data);
    };
    const displayConfirmDialog = (id, enableDisable) => {
        if (enableDisable) setsIsEnabledDisabled(enableDisable);
        setDepartmentId(id);
        setConfirmDialog(true);
    };
    const setDepartmentToUpdate = (id) => {
        getDepartmentByIdService(id);
        setUpdateForm(true);
    };
    const setEnabledDisabledDepartment = (id) => {
        const department = [...disabledDepartments, ...enabledDepartments].find(
            (departmentItem) => departmentItem.id === id,
        );
        const newDepartment = { ...department, disable: !department.disable };
        const setEnabDisab = {
            Show: setEnabledDepartmentService(newDepartment),
            Hide: setDisabledDepartmentService(newDepartment),
        };
        return setEnabDisab[isEnabledDisabled];
    };
    const acceptConfirmDialogGroup = (id) => {
        setConfirmDialog(false);
        if (!id) return;
        if (isEnabledDisabled) setEnabledDisabledDepartment(id);
        deleteDepartmentsService(id);
    };
    const handleSnackbarClose = () => {
        handleSnackbarCloseService();
    };
    const changeDisable = () => {
        setIsDisabled((prev) => !prev);
    };
    const closeTeacherDialog = () => {
        setTeacherDialog(false);
    };

    return (
        <>
            <NavigationPage name={navigationNames.DEPARTMENTS} val={navigation.DEPARTMENTS} />
            <ConfirmDialog
                isHide={isEnabledDisabled}
                cardId={departmentId}
                whatDelete="department"
                open={confirmDialog}
                onClose={acceptConfirmDialogGroup}
            />
            <ShowDataDialog
                isHide={isEnabledDisabled}
                cardId={departmentId}
                open={teacherDialog}
                onClose={closeTeacherDialog}
                teachers={teachers}
            />
            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={changeDisable} />
                    {!isDisabled && (
                        <AddDepartment
                            onSubmit={submitAddForm}
                            clear={clearDepartmentForm}
                            editDepartment={updateForm}
                        />
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleDepartments.length === 0 && <NotFound name={t('department_y_label')} />}
                    {visibleDepartments.map((departmentItem) => (
                        <Card key={departmentItem.id} class="subject-card department-card">
                            <h2 className="subject-card__name">{departmentItem.name}</h2>
                            <div className="cards-btns">
                                {isDisabled ? (
                                    <IoMdEye
                                        className="svg-btn copy-btn"
                                        title={t('common:set_enabled')}
                                        onClick={() => {
                                            displayConfirmDialog(
                                                departmentItem.id,
                                                disabledCard.SHOW,
                                            );
                                        }}
                                    />
                                ) : (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                displayConfirmDialog(
                                                    departmentItem.id,
                                                    disabledCard.HIDE,
                                                );
                                            }}
                                        />

                                        <FaEdit
                                            className="svg-btn edit-btn"
                                            title={t('edit_title')}
                                            onClick={() => {
                                                setDepartmentToUpdate(departmentItem.id);
                                            }}
                                        />
                                    </>
                                )}

                                <MdDelete
                                    className="svg-btn delete-btn"
                                    title={t('delete_title')}
                                    onClick={() => {
                                        displayConfirmDialog(departmentItem.id);
                                    }}
                                />
                                <FaChalkboardTeacher
                                    className="svg-btn delete-btn"
                                    title={t('show_teacher_title')}
                                    onClick={() => {
                                        showAllPublicTeachersByDepartmentService(departmentItem.id);
                                        getDepartmentByIdService(departmentItem.id);
                                        setTeacherDialog(true);
                                    }}
                                />
                            </div>
                        </Card>
                    ))}
                </section>
            </div>
            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarClose}
            />
        </>
    );
};

const mapStateToProps = (state) => ({
    enabledDepartments: state.departments.departments,
    disabledDepartments: state.departments.disabledDepartments,
    department: state.departments.department,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    teachers: state.teachers.teachers,
});

export default connect(mapStateToProps, {})(DepartmentPage);
