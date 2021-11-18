import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import { dialogTypes } from '../../constants/dialogs';
import { GROUP_Y_LABEL } from '../../constants/translationLabels/formElements';
import { search } from '../../helper/search';
import GroupCard from './GroupCard';
import NotFound from '../../share/NotFound/NotFound';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import AddStudentDialog from '../../containers/Student/AddStudentDialog';
import ShowStudentsOnGroupDialog from '../../containers/Student/ShowStudentsOnGroupDialog';

const GroupList = (props) => {
    const {
        fetchDisabledGroupsStart,
        fetchEnabledGroupsStart,
        setIsOpenConfirmDialog,
        toggleDisabledStatus,
        isOpenConfirmDialog,
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
    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [isOpenShowStudentsDialog, setIsOpenShowStudentsDialog] = useState(false);
    const [isOpenAddStudentDialog, setIsOpenAddStudentDialog] = useState(false);

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

    const showConfirmDialog = (currentId, disabledStatus) => {
        setGroupId(currentId);
        setConfirmDialogType(disabledStatus);
        setIsOpenConfirmDialog(true);
    };
    const acceptConfirmDialog = (currentGroupId) => {
        setIsOpenConfirmDialog(false);
        if (!currentGroupId) return;
        if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
            toggleDisabledStatus(currentGroupId, isDisabled);
        } else deleteGroupStart(currentGroupId);
    };

    const showAddStudentDialog = (currentGroupId) => {
        setGroupId(currentGroupId);
        setIsOpenAddStudentDialog(true);
    };
    const showStudentsByGroup = (currentGroup) => {
        setGroup(currentGroup);
        setIsOpenShowStudentsDialog(true);
    };
    const onDeleteStudent = (id) => {
        deleteStudentStart(id);
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
                    groupId={groupId}
                    open={isOpenAddStudentDialog}
                    setOpen={setIsOpenAddStudentDialog}
                />
            )}
            {isOpenShowStudentsDialog && (
                <ShowStudentsOnGroupDialog
                    onClose={() => setIsOpenShowStudentsDialog(false)}
                    open={isOpenShowStudentsDialog}
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
                            showConfirmDialog={showConfirmDialog}
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
