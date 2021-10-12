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
import { ConfirmDialog } from '../../share/modals/dialog';
import { disabledCard } from '../../constants/disabledCard';
import { navigation, navigationNames } from '../../constants/navigation';
import NavigationPage from '../../components/Navigation/NavigationPage';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import { showAllPublicTeachersByDepartmentService } from '../../services/scheduleService';
import { ShowDataDialog } from '../../share/modals/modal/showDataDialog';
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
    const [isUpdateForm, setIsUpdateForm] = useState(false);
    const [departmentCard, setDepartmentCard] = useState({ id: null, disabledStatus: null });
    const [teacherDialog, setTeacherDialog] = useState(false);
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);

    const clearDepartmentForm = () => {
        clearDepartment();
    };

    useEffect(() => {
        getDisabledDepartmentsService();
        getAllDepartmentsService();
        clearDepartmentForm();
    }, []);

    const SearchChange = setTerm;
    const visibleDepartments = isDisabled
        ? search(disabledDepartments, term, ['name'])
        : search(enabledDepartments, term, ['name']);

    const submitAddForm = (data) => {
        return data.id ? createDepartmentService(data) : updateDepartmentService(data);
    };
    const showConfirmDialog = (departmentId, disabledStatus) => {
        setDepartmentCard({ departmentId, disabledStatus });
        setIsOpenConfirmDialog(true);
    };
    const setDepartmentToUpdate = (departmentCurrentId) => {
        getDepartmentByIdService(departmentCurrentId);
        setIsUpdateForm(true);
    };
    const changeDepartmentDisabledStatus = (departmentCurrentId) => {
        const foundDepartment = [...disabledDepartments, ...enabledDepartments].find(
            (departm) => departm.id === departmentCurrentId,
        );
        const newDepartment = { ...foundDepartment, disable: !foundDepartment.disable };
        const changeDisabledStatus = {
            Show: setEnabledDepartmentService(newDepartment),
            Hide: setDisabledDepartmentService(newDepartment),
        };
        return changeDisabledStatus[departmentCard.disabledStatus];
    };
    const acceptConfirmDialog = (departmentId) => {
        setIsOpenConfirmDialog(false);
        if (!departmentId) return;
        if (departmentCard.disabledStatus) {
            changeDepartmentDisabledStatus(departmentId);
        } else deleteDepartmentsService(departmentId);
        setDepartmentCard((prev) => ({ ...prev, disabledStatus: null }));
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
                isHide={departmentCard.disabledStatus}
                cardId={departmentCard.id}
                whatDelete="department"
                open={isOpenConfirmDialog}
                onClose={acceptConfirmDialog}
            />
            <ShowDataDialog
                isHide={teacherDialog}
                cardId={departmentCard.id}
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
                            editDepartment={isUpdateForm}
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
                                            showConfirmDialog(departmentItem.id, disabledCard.SHOW);
                                        }}
                                    />
                                ) : (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                showConfirmDialog(
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
                                        showConfirmDialog(departmentItem.id);
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
