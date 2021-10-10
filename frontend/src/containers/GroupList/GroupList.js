import '../../router/Router.scss';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import './GroupList.scss';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import ConfirmDialog from '../../share/modals/dialog';
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
        snackbarType,
        snackbarMessage,
        disabledGroups,
        students,
        groups,
        group,
        match,
        student,
    } = props;
    const history = useHistory();
    const { t } = useTranslation('formElements');
    const [open, setOpen] = useState(false);
    const [term, setTerm] = useState('');
    const [isHide, setIsHide] = useState('');
    const [groupId, setGroupId] = useState(-1);
    const [disabled, setDisabled] = useState(false);
    const [showStudents, setShowStudents] = useState(false);
    const [addStudentDialog, setAddStudentDialog] = useState(false);

    useEffect(() => showAllGroupsService(), []);
    useEffect(() => getDisabledGroupsService(), []);

    const SearchChange = setTerm;
    const displayedGroups = disabled
        ? search(disabledGroups, term, ['title'])
        : search(groups, term, ['title']);

    // group
    const handleClickDisplayDialog = (id, isHideOrNot) => {
        if (isHideOrNot) setIsHide(isHideOrNot);
        setGroupId(id);
        setOpen(true);
    };
    const hideShowGroup = (id) => {
        const allGroups = [...disabledGroups, ...groups];
        const foundGroup = allGroups.find((groupItem) => Number(groupItem.id) === Number(id));
        const showHide = {
            Show: setEnabledGroupService(foundGroup),
            Hide: setDisabledGroupService(foundGroup),
        };
        return showHide[isHide];
    };
    const handleConfirmDialogGroup = (id) => {
        setOpen(false);
        if (!id) return;
        if (isHide) {
            hideShowGroup(id);
        } else removeGroupCardService(id);
        setIsHide('');
    };
    const handleSetGroupToUpdateForm = (id) => selectGroupService(id);
    const submitGroupForm = (values) => handleGroupService(values);
    const handleGroupFormReset = () => clearGroupService();
    // students
    const onShowStudentByGroup = (id) => {
        setShowStudents(true);
        selectGroupService(id);
        getAllStudentsByGroupId(id);
    };
    const handleAddUser = (id) => {
        setGroupId(id);
        setAddStudentDialog(true);
    };
    const selectStudentCard = () => {
        setAddStudentDialog(false);
    };
    const onCloseShowStudents = () => {
        setShowStudents(false);
        goToGroupPage(history);
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
    // all
    const showDisabledHandle = () => {
        setDisabled(!disabled);
    };
    const handleSnackbarClose = () => {
        handleSnackbarCloseService();
    };

    return (
        <>
            <NavigationPage name={navigationNames.GROUP_LIST} val={navigation.GROUPS} />
            <ConfirmDialog
                isHide={isHide}
                cardId={groupId}
                whatDelete="group"
                open={open}
                onClose={handleConfirmDialogGroup}
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
                groups={[...groups, ...disabledGroups]}
            />

            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={showDisabledHandle} />
                    {!disabled && (
                        <AddGroup
                            match={match}
                            className="form"
                            onSubmit={submitGroupForm}
                            onReset={handleGroupFormReset}
                        />
                    )}
                </aside>
                <div className="group-wrapper group-list">
                    {displayedGroups.length === 0 && <NotFound name={t('group_y_label')} />}
                    {displayedGroups.map((groupItem) => (
                        <GroupCard
                            key={groupItem.id}
                            groupItem={groupItem}
                            disabled={disabled}
                            disabledCard={disabledCard}
                            handleAddUser={handleAddUser}
                            onShowStudentByGroup={onShowStudentByGroup}
                            handleClickDisplayDialog={handleClickDisplayDialog}
                            handleSetGroupToUpdateForm={handleSetGroupToUpdateForm}
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
    groups: state.groups.groups,
    group: state.groups.group,
    disabledGroups: state.groups.disabledGroups,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    students: state.students.students,
    student: state.students.student,
});

export default connect(mapStateToProps, {})(GroupList);
