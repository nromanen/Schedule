import '../../router/Router.scss';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import { dialogTypes } from '../../constants/dialogs';
import { GROUP_Y_LABEL } from '../../constants/translationLabels/formElements';
import { goToGroupPage } from '../../helper/pageRedirection';
import { search } from '../../helper/search';
import GroupCard from '../GroupCard/GroupCard';
import NotFound from '../../share/NotFound/NotFound';
import { CustomDialog } from '../../share/DialogWindows';
import AddStudentDialog from '../../containers/Student/AddStudentDialog';
import ShowStudentsOnGroupDialog from '../../containers/Student/ShowStudentsOnGroupDialog';
import { links } from '../../constants/links';

const GroupList = (props) => {
    const {
        fetchDisabledGroupsStart,
        fetchEnabledGroupsStart,
        toggleDisabledStatus,
        deleteStudentStart,
        deleteGroupStart,
        selectGroup,
        loading,
        groups,
        match,
        term,
        isDisabled,
    } = props;
    const { t } = useTranslation('formElements');

    const [group, setGroup] = useState();
    const [groupId, setGroupId] = useState(-1);
    const [subDialogType, setSubDialogType] = useState('');
    const [showStudents, setShowStudents] = useState(false);
    const [openSubDialog, setOpenSubDialog] = useState(false);
    const [openAddStudentDialog, setAddStudentDialog] = useState(false);

    useEffect(() => {
        fetchEnabledGroupsStart();
    }, []);
    useEffect(() => {
        if (isDisabled) {
            fetchDisabledGroupsStart();
        } else {
            fetchEnabledGroupsStart();
        }
    }, [isDisabled]);

    const visibleGroups = search(groups, term, ['title']);

    const showCustomDialog = (currentId, disabledStatus) => {
        setGroupId(currentId);
        setSubDialogType(disabledStatus);
        setOpenSubDialog(true);
        return undefined;
    };
    const acceptConfirmDialog = (currentGroupId) => {
        setOpenSubDialog(false);
        if (!currentGroupId) return;
        if (subDialogType !== dialogTypes.DELETE_CONFIRM) {
            toggleDisabledStatus(currentGroupId, isDisabled);
        } else deleteGroupStart(currentGroupId);
    };

    const showAddStudentDialog = (currentGroupId) => {
        setGroupId(currentGroupId);
        setAddStudentDialog(true);
    };
    const showStudentsByGroup = (currentGroup) => {
        setGroup(currentGroup);
        setShowStudents(true);
    };
    const onDeleteStudent = (id) => {
        deleteStudentStart(id);
    };

    return (
        <>
            {openSubDialog && (
                <CustomDialog
                    type={subDialogType}
                    cardId={groupId}
                    whatDelete="group"
                    open={openSubDialog}
                    onClose={acceptConfirmDialog}
                    setOpenSubDialog={setOpenSubDialog}
                />
            )}
            {openAddStudentDialog && (
                <AddStudentDialog
                    groupId={groupId}
                    open={openAddStudentDialog}
                    setOpen={setAddStudentDialog}
                />
            )}
            {showStudents && (
                <ShowStudentsOnGroupDialog
                    onClose={() => setShowStudents(false)}
                    open={showStudents}
                    group={group}
                    match={match}
                    onDeleteStudent={onDeleteStudent}
                    groups={groups}
                />
            )}
            <div className="group-wrapper group-list">
                {!loading && visibleGroups.length === 0 ? (
                    <NotFound name={t(GROUP_Y_LABEL)} />
                ) : (
                    visibleGroups.map((item) => (
                        <GroupCard
                            key={item.id}
                            item={item}
                            disabled={isDisabled}
                            showCustomDialog={showCustomDialog}
                            getGroupToUpdateForm={(id) => selectGroup(id)}
                            showAddStudentDialog={showAddStudentDialog}
                            showStudentsByGroup={showStudentsByGroup}
                        />
                    ))
                )}
                {loading && (
                    <section className="centered-container">
                        <CircularProgress />
                    </section>
                )}
            </div>
        </>
    );
};

export default GroupList;
