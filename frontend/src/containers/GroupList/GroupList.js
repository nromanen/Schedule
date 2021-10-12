import '../../router/Router.scss';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import './GroupList.scss';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import { ConfirmDialog } from '../../share/modals/dialog';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import AddGroup from '../../components/AddGroupForm/AddGroupForm';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import { ShowStudentsDialog } from '../../share/modals/modal/showStudentsDialog';
import AddStudentDialog from '../../share/modals/modal/AddStudentDialog';
import { disabledCard } from '../../constants/disabledCard';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';
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
        student,
    } = props;
    const history = useHistory();
    const { t } = useTranslation('formElements');
    const [term, setTerm] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [showStudents, setShowStudents] = useState(false);
    const [addStudentDialog, setAddStudentDialog] = useState(false);
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
    const [groupCard, setGroupCard] = useState({ id: null, disabledStatus: null });

    useEffect(() => {
        showAllGroupsService();
        getDisabledGroupsService();
    }, []);

    const SearchChange = setTerm;
    const visibleGroups = isDisabled
        ? search(disabledGroups, term, ['title'])
        : search(enabledGroup, term, ['title']);

    const showConfirmDialog = (id, disabledStatus) => {
        setGroupCard({ id, disabledStatus });
        setIsOpenConfirmDialog(true);
    };
    const changeGroupDisabledStatus = (groupId) => {
        const foundGroup = [...disabledGroups, ...enabledGroup].find(
            (groupItem) => groupItem.id === groupId,
        );
        const changeDisabledStatus = {
            Show: setEnabledGroupService(foundGroup),
            Hide: setDisabledGroupService(foundGroup),
        };
        return changeDisabledStatus[groupCard.disabledStatus];
    };
    const acceptConfirmDialog = (groupId) => {
        setIsOpenConfirmDialog(false);
        if (!groupId) return;
        if (groupCard) {
            changeGroupDisabledStatus(groupId);
        } else removeGroupCardService(groupId);
        setGroupCard((prev) => ({ ...prev, disabledStatus: null }));
    };

    const onShowStudentByGroup = (groupId) => {
        setShowStudents(true);
        selectGroupService(groupId);
        getAllStudentsByGroupId(groupId);
    };
    const handleAddUser = (groupId) => {
        setGroupCard((prev) => ({ ...prev, id: groupId }));
        setAddStudentDialog(true);
    };
    const selectStudentCard = () => {
        setAddStudentDialog(false);
    };
    const onCloseShowStudents = () => {
        setShowStudents(false);
    };
    const studentSubmit = (data) => {
        if (data.id !== undefined) {
            const sendData = { ...data, group: { id: data.group } };
            updateStudentService(sendData);
        } else {
            const sendData = { ...data, group: { id: groupCard.id } };
            createStudentService(sendData);
        }
        setAddStudentDialog(false);
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
    const handleSnackbarClose = () => {
        handleSnackbarCloseService();
    };

    return (
        <>
            <NavigationPage name={navigationNames.GROUP_LIST} val={navigation.GROUPS} />
            <ConfirmDialog
                isHide={groupCard.disabledStatus}
                cardId={groupCard.id}
                whatDelete="group"
                open={isOpenConfirmDialog}
                onClose={acceptConfirmDialog}
            />
            <AddStudentDialog
                open={addStudentDialog}
                onSubmit={studentSubmit}
                onSetSelectedCard={selectStudentCard}
            />
            <ShowStudentsDialog
                onClose={onCloseShowStudents}
                open={showStudents}
                students={students}
                group={group}
                onDeleteStudent={onDeleteStudent}
                onSubmit={studentSubmit}
                match={match}
                student={student}
                groups={[...enabledGroup, ...disabledGroups]}
            />

            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={changeDisable} />
                    {!isDisabled && (
                        <AddGroup
                            match={match}
                            className="form"
                            onSubmit={handleGroupService}
                            onReset={clearGroupService}
                        />
                    )}
                </aside>
                <div className="group-wrapper group-list">
                    {visibleGroups.length === 0 && <NotFound name={t('group_y_label')} />}
                    {visibleGroups.map((groupItem) => (
                        <GroupCard
                            key={groupItem.id}
                            groupItem={groupItem}
                            disabled={isDisabled}
                            disabledCard={disabledCard}
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
                handleSnackbarClose={handleSnackbarClose}
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
});

export default connect(mapStateToProps, {})(GroupList);
