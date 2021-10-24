import './GroupList.scss';
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
import { handleSnackbarCloseService } from '../../services/snackbarService';
import GroupCard from '../GroupCard/GroupCard';
import NotFound from '../../share/NotFound/NotFound';
import AddGroup from '../AddGroupForm/AddGroupForm';
import NavigationPage from '../Navigation/NavigationPage';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import {
    AddStudentDialog,
    CustomDialog,
    ShowStudentsOnGroupDialog,
} from '../../share/DialogWindows';
import {
    createStudentService,
    deleteStudentService,
    getAllStudentsByGroupId,
    updateStudentService,
} from '../../services/studentService';
import {
    asyncFetchDisabledGroups,
    asyncFetchEnabledGroups,
    asyncUpdateGroup,
    asyncDeleteGroup,
    asyncCreateGroup,
    asyncToggleGroup,
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
        match,
    } = props;
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation('formElements');

    const [term, setTerm] = useState('');
    const [group, setGroup] = useState();
    const [groupId, setGroupId] = useState(-1);
    const [isDisabled, setIsDisabled] = useState(false);
    const [subDialogType, setSubDialogType] = useState('');
    const [showStudents, setShowStudents] = useState(false);
    const [openSubDialog, setOpenSubDialog] = useState(false);
    const [openAddStudentDialog, setAddStudentDialog] = useState(false);

    useEffect(() => {
        dispatch(asyncFetchEnabledGroups());
    }, []);
    useEffect(() => {
        dispatch(asyncFetchDisabledGroups());
    }, [isDisabled]);

    const SearchChange = setTerm;
    const visibleGroups = isDisabled
        ? search(disabledGroups, term, ['title'])
        : search(enabledGroups, term, ['title']);

    const onSubmitGroupForm = (data) => {
        return !data.id ? dispatch(asyncCreateGroup(data)) : dispatch(asyncUpdateGroup(data));
    };
    const changeGroupDisabledStatus = (currentGroupId) => {
        const disabledGroup = disabledGroups.find((groupItem) => groupItem.id === currentGroupId);
        const enabledGroup = enabledGroups.find((groupItem) => groupItem.id === currentGroupId);
        dispatch(asyncToggleGroup(enabledGroup, disabledGroup));
    };
    const showCustomDialog = (currentId, disabledStatus) => {
        setGroupId(currentId);
        setSubDialogType(disabledStatus);
        setOpenSubDialog(true);
    };
    const acceptConfirmDialog = (currentGroupId) => {
        setOpenSubDialog(false);
        if (subDialogType !== dialogTypes.DELETE_CONFIRM) {
            changeGroupDisabledStatus(currentGroupId);
        } else dispatch(asyncDeleteGroup(currentGroupId));
    };

    const showAddStudentDialog = (currentGroupId) => {
        setGroupId(currentGroupId);
        setAddStudentDialog(true);
    };

    const showStudentsByGroup = (currentGroup) => {
        setGroup(currentGroup);
        getAllStudentsByGroupId(currentGroup.id);
        setShowStudents(true);
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

    const groupList = (
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
    );

    return (
        <>
            <NavigationPage name={navigationNames.GROUP_LIST} val={navigation.GROUPS} />
            <CustomDialog
                type={subDialogType}
                cardId={groupId}
                whatDelete="group"
                open={openSubDialog}
                onClose={acceptConfirmDialog}
                setOpenSubDialog={setOpenSubDialog}
            />
            <AddStudentDialog
                onSubmit={studentSubmit}
                open={openAddStudentDialog}
                onSetSelectedCard={() => setAddStudentDialog(false)}
            />
            {showStudents && (
                <ShowStudentsOnGroupDialog
                    onClose={() => setShowStudents(false)}
                    open={showStudents}
                    students={students}
                    group={group}
                    onDeleteStudent={(studentItem) => deleteStudentService(studentItem)}
                    onSubmit={studentSubmit}
                    match={match}
                    student={student}
                    groups={enabledGroups}
                />
            )}
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
                <div className="group-wrapper group-list">{groupList}</div>
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
