import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import './GroupList.scss';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import AddGroup from '../../components/AddGroupForm/AddGroupForm';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import { goToGroupPage } from '../../helper/pageRedirection';
import GroupCard from '../../components/GroupCard/GroupCard';
import {
    createStudentService,
    deleteStudentService,
    getAllStudentsByGroupId,
    updateStudentService,
} from '../../services/studentService';
import {
    clearGroupService,
    getDisabledGroupsService,
    handleGroupService,
    removeGroupCardService,
    selectGroupService,
    setDisabledGroupService,
    setEnabledGroupService,
    showAllGroupsService,
} from '../../services/groupService';
import { setIsOpenConfirmDialog } from '../../actions/dialog';
import CustomDialog from '../Dialogs/CustomDialog';
import ShowStudentsOnGroupDialog from '../../share/DialogWindows/_dialogWindows/ShowStudentsOnGroupDialog';
import AddStudentDialog from '../../share/DialogWindows/_dialogWindows/AddStudentDialog';
import { dialogTypes } from '../../constants/dialogs';
import { GROUP_Y_LABEL } from '../../constants/translationLabels/formElements';

const GroupList = (props) => {
    const {
        isSnackbarOpen,
        snackbarMessage,
        disabledGroups,
        snackbarType,
        enabledGroup,
        students,
        group,
        match,
        setOpenConfirmDialog,
        isOpenConfirmDialog,
        student,
    } = props;
    const history = useHistory();
    const { t } = useTranslation('formElements');

    const [confirmDialogType, setConfirmDialogType] = useState('');

    const [groupId, setGroupId] = useState(-1);
    const [term, setTerm] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [isOpenShowStudentsDialog, setIsOpenShowStudentsDialog] = useState(false);
    const [isOpenAddStudentDialog, setIsOpenAddStudentDialog] = useState(false);

    useEffect(() => {
        showAllGroupsService();
        getDisabledGroupsService();
    }, []);

    const SearchChange = setTerm;
    const visibleGroups = isDisabled
        ? search(disabledGroups, term, ['title'])
        : search(enabledGroup, term, ['title']);

    const showConfirmDialog = (currentId, disabledStatus) => {
        setGroupId(currentId);
        setConfirmDialogType(disabledStatus);
        setOpenConfirmDialog(true);
    };
    const changeGroupDisabledStatus = (currentGroupId) => {
        const foundGroup = [...disabledGroups, ...enabledGroup].find(
            (groupItem) => groupItem.id === currentGroupId,
        );
        const changeDisabledStatus = {
            [dialogTypes.SET_VISIBILITY_ENABLED]: setEnabledGroupService(foundGroup),
            [dialogTypes.SET_VISIBILITY_DISABLED]: setDisabledGroupService(foundGroup),
        };
        return changeDisabledStatus[confirmDialogType];
    };
    const acceptConfirmDialog = (currentGroupId) => {
        setOpenConfirmDialog(false);
        if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
            changeGroupDisabledStatus(currentGroupId);
        } else removeGroupCardService(currentGroupId);
    };
    const onShowStudentByGroup = (currentGroupId) => {
        setIsOpenShowStudentsDialog(true);
        selectGroupService(currentGroupId);
        getAllStudentsByGroupId(currentGroupId);
    };
    const handleAddUser = (currentGroupId) => {
        setGroupId(currentGroupId);
        setIsOpenAddStudentDialog(true);
    };

    const selectStudentCard = () => {
        setIsOpenAddStudentDialog(false);
    };
    const onCloseShowStudents = () => {
        setIsOpenShowStudentsDialog(false);
    };
    const studentSubmit = (data) => {
        if (data.id !== undefined) {
            const sendData = { ...data, group: { id: data.group } };
            updateStudentService(sendData);
        } else {
            const sendData = { ...data, group: { id: groupId } };
            createStudentService(sendData);
        }
        setIsOpenAddStudentDialog(false);
        goToGroupPage(history);
    };
    const onDeleteStudent = () => {
        if (student !== '') {
            deleteStudentService(student);
        }
    };
    const changeDisable = () => {
        setIsDisabled((prev) => !prev);
    };
    return (
        <>

            <CustomDialog
                type={confirmDialogType}
                handelConfirm={() => acceptConfirmDialog(groupId)}
                whatDelete="group"
                open={isOpenConfirmDialog}
            />

            {isOpenAddStudentDialog && (
                <AddStudentDialog
                    open={isOpenAddStudentDialog}
                    onSubmit={studentSubmit}
                    onSetSelectedCard={selectStudentCard}
                />
            )}
            {isOpenShowStudentsDialog && (
                <ShowStudentsOnGroupDialog
                    onClose={onCloseShowStudents}
                    open={isOpenShowStudentsDialog}
                    students={students}
                    group={group}
                    onDeleteStudent={onDeleteStudent}
                    onSubmit={studentSubmit}
                    match={match}
                    student={student}
                    groups={[...enabledGroup, ...disabledGroups]}
                />
            )}

            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={changeDisable} />
                    {!isDisabled && (
                        <AddGroup
                            className="form"
                            onSubmit={handleGroupService}
                            onReset={clearGroupService}
                        />
                    )}
                </aside>
                <div className="group-wrapper group-list">
                    {visibleGroups.length === 0 && <NotFound name={t(GROUP_Y_LABEL)} />}
                    {visibleGroups.map((groupItem) => (
                        <GroupCard
                            key={groupItem.id}
                            groupItem={groupItem}
                            disabled={isDisabled}
                            handleAddUser={handleAddUser}
                            onShowStudentByGroup={onShowStudentByGroup}
                            showConfirmDialog={showConfirmDialog}
                            handleSetGroupToUpdateForm={selectGroupService}
                        />
                    ))}
                </div>
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
    enabledGroup: state.groups.groups,
    group: state.groups.group,
    disabledGroups: state.groups.disabledGroups,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    students: state.students.students,
    student: state.students.student,
    isOpenConfirmDialog: state.dialog.isOpenConfirmDialog,
});
const mapDispatchToProps = (dispatch) => ({
    setOpenConfirmDialog: (newState) => dispatch(setIsOpenConfirmDialog(newState)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupList);
