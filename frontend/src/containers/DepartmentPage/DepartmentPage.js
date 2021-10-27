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
import { navigation, navigationNames } from '../../constants/navigation';
import NavigationPage from '../../components/Navigation/NavigationPage';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
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
import { CustomDialog, ShowDepartmentDataDialog } from '../../share/DialogWindows';
import { dialogTypes } from '../../constants/dialogs';
import {
    EDIT_TITLE,
    DEPARTMENT_LABEL,
    DELETE_TITLE,
    SHOW_TEACHER_TITLE,
} from '../../constants/translationLabels/formElements';
import { COMMON_SET_DISABLED, COMMON_SET_ENABLED } from '../../constants/translationLabels/common';
import { getAllPublicTeachersByDepartmentStart } from '../../actions/schedule';

const DepartmentPage = (props) => {
    const {
        teachers,
        snackbarType,
        isSnackbarOpen,
        snackbarMessage,
        enabledDepartments,
        disabledDepartments,
        getAllPublicTeachersByDepartment,
    } = props;
    const { t } = useTranslation('formElements');
    const [term, setTerm] = useState('');

    const [subDialogType, setSubDialogType] = useState('');

    const [isDisabled, setIsDisabled] = useState(false);
    const [isUpdateForm, setIsUpdateForm] = useState(false);
    const [departmentId, setDepartmentId] = useState(-1);
    const [teacherDialog, setTeacherDialog] = useState(false);
    const [openSubDialog, setOpenSubDialog] = useState(false);

    const clearDepartmentForm = () => {
        clearDepartment();
    };

    useEffect(() => {
        getDisabledDepartmentsService();
        getAllDepartmentsService();
        clearDepartment();
    }, []);

    const SearchChange = setTerm;
    const visibleDepartments = isDisabled
        ? search(disabledDepartments, term, ['name'])
        : search(enabledDepartments, term, ['name']);

    const submitAddForm = (data) => {
        return data.id ? createDepartmentService(data) : updateDepartmentService(data);
    };
    const showConfirmDialog = (currentId, dialogType) => {
        setDepartmentId(currentId);
        setSubDialogType(dialogType);
        setOpenSubDialog(true);
    };
    const setDepartmentToUpdate = (currentId) => {
        getDepartmentByIdService(currentId);
        setIsUpdateForm(true);
    };
    const changeDepartmentDisabledStatus = (currentId) => {
        const foundDepartment = [...disabledDepartments, ...enabledDepartments].find(
            (departm) => departm.id === currentId,
        );
        const newDepartment = { ...foundDepartment, disable: !foundDepartment.disable };
        const changeDisabledStatus = {
            [dialogTypes.SET_VISIBILITY_ENABLED]: setEnabledDepartmentService(newDepartment),
            [dialogTypes.SET_VISIBILITY_DISABLED]: setDisabledDepartmentService(newDepartment),
        };
        return changeDisabledStatus[subDialogType];
    };
    const acceptConfirmDialog = (currentId) => {
        setOpenSubDialog(false);
        if (!currentId) return;
        if (subDialogType !== dialogTypes.DELETE_CONFIRM) {
            changeDepartmentDisabledStatus(currentId);
        } else deleteDepartmentsService(currentId);
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
            {openSubDialog && (
                <CustomDialog
                    type={subDialogType}
                    cardId={departmentId.id}
                    whatDelete="department"
                    open={openSubDialog}
                    onClose={acceptConfirmDialog}
                />
            )}
            {teacherDialog && (
                <ShowDepartmentDataDialog
                    isHide={departmentId.disabledStatus}
                    cardId={departmentId.id}
                    open={teacherDialog}
                    onClose={closeTeacherDialog}
                    teachers={teachers}
                />
            )}
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
                    {visibleDepartments.length === 0 && <NotFound name={t(DEPARTMENT_LABEL)} />}
                    {visibleDepartments.map((departmentItem) => (
                        <Card
                            key={departmentItem.id}
                            additionClassName="subject-card department-card"
                        >
                            <h2 className="subject-card__name">{departmentItem.name}</h2>
                            <div className="cards-btns">
                                {isDisabled ? (
                                    <IoMdEye
                                        className="svg-btn copy-btn"
                                        title={t(COMMON_SET_ENABLED)}
                                        onClick={() => {
                                            showConfirmDialog(
                                                departmentItem.id,
                                                dialogTypes.SET_VISIBILITY_ENABLED,
                                            );
                                        }}
                                    />
                                ) : (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t(COMMON_SET_DISABLED)}
                                            onClick={() => {
                                                showConfirmDialog(
                                                    departmentItem.id,
                                                    dialogTypes.SET_VISIBILITY_DISABLED,
                                                );
                                            }}
                                        />

                                        <FaEdit
                                            className="svg-btn edit-btn"
                                            title={t(EDIT_TITLE)}
                                            onClick={() => {
                                                setDepartmentToUpdate(departmentItem.id);
                                            }}
                                        />
                                    </>
                                )}

                                <MdDelete
                                    className="svg-btn delete-btn"
                                    title={t(DELETE_TITLE)}
                                    onClick={() => {
                                        showConfirmDialog(
                                            departmentItem.id,
                                            dialogTypes.DELETE_CONFIRM,
                                        );
                                    }}
                                />
                                <FaChalkboardTeacher
                                    className="svg-btn delete-btn"
                                    title={t(SHOW_TEACHER_TITLE)}
                                    onClick={() => {
                                        getAllPublicTeachersByDepartment(departmentItem.id);
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
                handleSnackbarClose={handleSnackbarCloseService}
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

const mapDispatchToProps = (dispatch) => ({
    getAllPublicTeachersByDepartment: (id) => dispatch(getAllPublicTeachersByDepartmentStart(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepartmentPage);
