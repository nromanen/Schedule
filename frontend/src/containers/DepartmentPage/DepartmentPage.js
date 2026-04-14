import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { FaChalkboardTeacher, FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import SearchPanel from '../../share/SearchPanel/SearchPanel';
import Card from '../../share/Card/Card';
import AddDepartmentForm from '../../components/AddDepartmentForm/AddDepartmentForm';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import CustomDialog from '../Dialogs/CustomDialog';
import ShowDepartmentDataDialog from '../../share/DialogWindows/_dialogWindows/ShowDepartmentDataDialog';

import { dialogTypes } from '../../constants/dialogs';
import {
    DELETE_TITLE,
    DEPARTMENT_LABEL,
    EDIT_TITLE,
    SHOW_TEACHER_TITLE,
} from '../../constants/translationLabels/formElements';
import { COMMON_SET_DISABLED, COMMON_SET_ENABLED } from '../../constants/translationLabels/common';
import { setIsOpenConfirmDialog } from '../../actions/dialog';

import {
    useDepartments,
    useDisabledDepartments,
    useCreateDepartment,
    useUpdateDepartment,
    useDeleteDepartment,
} from '../../hooks/useDepartments';
import { usePublicTeachersByDepartment } from '../../hooks/useTeachers';

const DepartmentPage = () => {
    const { t } = useTranslation('formElements');
    const dispatch = useDispatch();

    // ── snackbar & dialog from Redux ──────────────────────────
    const isSnackbarOpen = useSelector((state) => state.snackbar.isSnackbarOpen);
    const snackbarType = useSelector((state) => state.snackbar.snackbarType);
    const snackbarMessage = useSelector((state) => state.snackbar.message);
    const isOpenConfirmDialog = useSelector((state) => state.dialog.isOpenConfirmDialog);
    const setOpenConfirmDialog = (state) => dispatch(setIsOpenConfirmDialog(state));

    // ── server state ──────────────────────────────────────────
    const { data: enabledDepartments = [] } = useDepartments();
    const { data: disabledDepartments = [] } = useDisabledDepartments();

    const createDepartment = useCreateDepartment();
    const updateDepartment = useUpdateDepartment();
    const deleteDepartment = useDeleteDepartment();

    // ── local UI state ────────────────────────────────────────
    const [term, setTerm] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [isOpenTeacherDialog, setIsOpenTeacherDialog] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    // ── teachers (only fetched when dialog opens) ─────────────
    const { data: teachers = [] } = usePublicTeachersByDepartment(
        selectedDepartment?.id,
        { enabled: isOpenTeacherDialog && !!selectedDepartment?.id },
    );

    // ── derived data ──────────────────────────────────────────
    const visibleDepartments = search(
        isDisabled ? disabledDepartments : enabledDepartments,
        term,
        ['name'],
    );

    // ── handlers ──────────────────────────────────────────────
    const handleSubmit = (data) => {
        data.id ? updateDepartment.mutate(data) : createDepartment.mutate(data);
        setSelectedDepartment(null);
    };

    const handleReset = () => setSelectedDepartment(null);

    const showConfirmDialog = (department, dialogType) => {
        setSelectedDepartment(department);
        setConfirmDialogType(dialogType);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setSelectedDepartment(null);
    };

    const acceptConfirmDialog = () => {
        setOpenConfirmDialog(false);
        if (confirmDialogType === dialogTypes.DELETE_CONFIRM) {
            deleteDepartment.mutate(selectedDepartment.id);
        } else {
            updateDepartment.mutate({ ...selectedDepartment, disable: !selectedDepartment.disable });
        }
        setSelectedDepartment(null);
    };

    return (
        <>
            <CustomDialog
                type={confirmDialogType}
                whatDelete="department"
                handelConfirm={acceptConfirmDialog}
                onClose={handleCloseConfirmDialog}
                open={isOpenConfirmDialog}
            />

            {isOpenTeacherDialog && (
                <ShowDepartmentDataDialog
                    isHide={selectedDepartment?.disable}
                    cardId={selectedDepartment?.id}
                    department={selectedDepartment}
                    open={isOpenTeacherDialog}
                    onClose={() => {
                        setIsOpenTeacherDialog(false);
                        setSelectedDepartment(null);
                    }}
                    teachers={teachers}
                />
            )}

            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel
                        SearchChange={setTerm}
                        showDisabled={() => setIsDisabled((prev) => !prev)}
                    />
                    {!isDisabled && (
                        <AddDepartmentForm
                            onSubmit={handleSubmit}
                            onReset={handleReset}
                            department={selectedDepartment}
                        />
                    )}
                </aside>

                <section className="container-flex-wrap wrapper">
                    {visibleDepartments.length === 0 && <NotFound name={t(DEPARTMENT_LABEL)} />}
                    {visibleDepartments.map((dept) => (
                        <Card key={dept.id} additionClassName="department-card" variant="entity">
                            <h2 className="card-entity__title">{dept.name}</h2>
                            <div className="cards-btns">
                                {isDisabled ? (
                                    <IoMdEye
                                        className="svg-btn copy-btn"
                                        title={t(COMMON_SET_ENABLED)}
                                        onClick={() => showConfirmDialog(dept, dialogTypes.SET_VISIBILITY_ENABLED)}
                                    />
                                ) : (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t(COMMON_SET_DISABLED)}
                                            onClick={() => showConfirmDialog(dept, dialogTypes.SET_VISIBILITY_DISABLED)}
                                        />
                                        <FaEdit
                                            className="svg-btn edit-btn"
                                            title={t(EDIT_TITLE)}
                                            onClick={() => setSelectedDepartment(dept)}
                                        />
                                    </>
                                )}
                                <MdDelete
                                    className="svg-btn delete-btn"
                                    title={t(DELETE_TITLE)}
                                    onClick={() => showConfirmDialog(dept, dialogTypes.DELETE_CONFIRM)}
                                />
                                <FaChalkboardTeacher
                                    className="svg-btn delete-btn"
                                    title={t(SHOW_TEACHER_TITLE)}
                                    onClick={() => {
                                        setSelectedDepartment(dept);
                                        setIsOpenTeacherDialog(true);
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

export default DepartmentPage;