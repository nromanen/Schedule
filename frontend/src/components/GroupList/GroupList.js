import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { dialogTypes } from '../../constants/dialogs';
import { navigation, navigationNames } from '../../constants/navigation';
import { GROUP_Y_LABEL } from '../../constants/translationLabels/formElements';
import { goToGroupPage } from '../../helper/pageRedirection';
import { search } from '../../helper/search';
import '../../router/Router.scss';
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
import { handleSnackbarCloseService } from '../../services/snackbarService';
import {
    createStudentService,
    deleteStudentService,
    getAllStudentsByGroupId,
    updateStudentService,
} from '../../services/studentService';
import {
    AddStudentDialog,
    CustomDialog,
    ShowStudentsOnGroupDialog,
} from '../../share/DialogWindows';
import NotFound from '../../share/NotFound/NotFound';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import AddGroup from '../AddGroupForm/AddGroupForm';
import GroupCard from '../GroupCard/GroupCard';
import NavigationPage from '../Navigation/NavigationPage';
import './GroupList.scss';
import {
    asyncFetchDisabledGroups,
    asyncFetchEnabledGroups,
    asyncUpdateGroup,
    asyncDeleteGroup,
    asyncCreateGroup,
    asyncClearGroup,
    selectGroup,
} from '../../actions/groups';

const GroupList = (props) => {
    const {
        isSnackbarOpen,
        snackbarMessage,
        disabledGroups,
        snackbarType,
        enabledGroups,
        students,
        loading,
        student,
        group,
        match,
    } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation('formElements');

    const [term, setTerm] = useState('');
    const [groupId, setGroupId] = useState(-1);
    const [isDisabled, setIsDisabled] = useState(false);
    const [subDialogType, setSubDialogType] = useState('');
    const [showStudents, setShowStudents] = useState(false);
    const [openSubDialog, setOpenSubDialog] = useState(false);
    const [openAddStudentDialog, setAddStudentDialog] = useState(false);

    useEffect(() => {
        dispatch(asyncFetchDisabledGroups());
        dispatch(asyncFetchEnabledGroups());
    }, []);

    const SearchChange = setTerm;
    const visibleGroups = isDisabled
        ? search(disabledGroups, term, ['title'])
        : search(enabledGroups, term, ['title']);

    const changeGroupDisabledStatus = (currentGroupId) => {
        const foundGroup = [...disabledGroups, ...enabledGroups].find(
            (groupItem) => groupItem.id === currentGroupId,
        );
        const changeDisabledStatus = {
            [dialogTypes.SET_VISIBILITY_ENABLED]: setEnabledGroupService(foundGroup),
            [dialogTypes.SET_VISIBILITY_DISABLED]: setDisabledGroupService(foundGroup),
        };
        return changeDisabledStatus[subDialogType];
    };
    const showCustomDialog = (currentId, disabledStatus) => {
        setGroupId(currentId);
        setSubDialogType(disabledStatus);
        setOpenSubDialog(true);
    };
    const acceptConfirmDialog = (currentGroupId) => {
        setOpenSubDialog(false);
        if (!currentGroupId) return;
        if (subDialogType !== dialogTypes.DELETE_CONFIRM) {
            changeGroupDisabledStatus(currentGroupId);
        } else dispatch(asyncDeleteGroup(currentGroupId));
    };

    const showAddStudentDialog = (currentGroupId) => {
        setGroupId(currentGroupId);
        setAddStudentDialog(true);
    };

    const showStudentsByGroup = (currentGroupId) => {
        setShowStudents(true);
        selectGroup(currentGroupId);
        getAllStudentsByGroupId(currentGroupId);
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
            const sendData = { ...data, group: { id: groupId } };
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

    const onSubmitGroupForm = (data) => {
        return !data.id ? dispatch(asyncCreateGroup(data)) : dispatch(asyncUpdateGroup(data));
    };

    return (
        <>
            <NavigationPage name={navigationNames.GROUP_LIST} val={navigation.GROUPS} />
            <CustomDialog
                type={subDialogType}
                cardId={groupId}
                whatDelete="group"
                open={openSubDialog}
                onClose={acceptConfirmDialog}
            />
            <AddStudentDialog
                onSubmit={studentSubmit}
                open={openAddStudentDialog}
                onSetSelectedCard={selectStudentCard}
            />
            <ShowStudentsOnGroupDialog
                onClose={onCloseShowStudents}
                open={showStudents}
                students={students}
                group={group}
                onDeleteStudent={onDeleteStudent}
                onSubmit={studentSubmit}
                match={match}
                student={student}
                groups={[...enabledGroups, ...disabledGroups]}
            />

            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel
                        SearchChange={SearchChange}
                        showDisabled={() => setIsDisabled((prev) => !prev)}
                    />
                    {!isDisabled && (
                        <AddGroup
                            match={match}
                            className="form"
                            onSubmit={onSubmitGroupForm}
                            onReset={() => dispatch(asyncClearGroup())}
                        />
                    )}
                </aside>
                <div className="group-wrapper group-list">
                    {loading && (
                        <section className="centered-container">
                            <CircularProgress />
                        </section>
                    )}
                    {!loading && visibleGroups.length === 0 ? (
                        <NotFound name={t(GROUP_Y_LABEL)} />
                    ) : (
                        visibleGroups.map((item) => (
                            <GroupCard
                                key={item.id}
                                item={item}
                                disabled={isDisabled}
                                showCustomDialog={showCustomDialog}
                                getGroupToUpdateForm={(id) => dispatch(selectGroup(id))}
                                showAddStudentDialog={showAddStudentDialog}
                                showStudentsByGroup={showStudentsByGroup}
                            />
                        ))
                    )}
                </div>
            </div>
            <SnackbarComponent
                type={snackbarType}
                isOpen={isSnackbarOpen}
                message={snackbarMessage}
                handleSnackbarClose={handleSnackbarCloseService}
            />
        </>
    );
};

export default GroupList;

// {visibleGroups.length === 0 && <NotFound name={t(GROUP_Y_LABEL)} />}
