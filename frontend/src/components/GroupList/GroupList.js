import '../../router/Router.scss';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { dialogTypes } from '../../constants/dialogs';
import { GROUP_Y_LABEL } from '../../constants/translationLabels/formElements';
import { goToGroupPage } from '../../helper/pageRedirection';
import { search } from '../../helper/search';
import GroupCard from '../GroupCard/GroupCard';
import NotFound from '../../share/NotFound/NotFound';
import {
    // ShowStudentsOnGroupDialog,
    // AddStudentDialog,
    CustomDialog,
} from '../../share/DialogWindows';
import AddStudentDialog from '../../containers/Student/AddStudentDialog';
import {
    getAllStudentsByGroupId,
    createStudentService,
    deleteStudentService,
    updateStudentService,
} from '../../services/studentService';

const GroupList = (props) => {
    const {
        startFetchDisabledGroups,
        startFetchEnabledGroups,
        toggleDisabledStatus,
        startDeleteGroup,
        // disabledGroups,
        groups,
        selectGroup,
        loading,
        match,
        term,
        isDisabled,
    } = props;
    const history = useHistory();
    const { t } = useTranslation('formElements');

    const [group, setGroup] = useState();
    const [groupId, setGroupId] = useState(-1);
    const [subDialogType, setSubDialogType] = useState('');
    const [showStudents, setShowStudents] = useState(false);
    const [openSubDialog, setOpenSubDialog] = useState(false);
    const [openAddStudentDialog, setAddStudentDialog] = useState(false);

    useEffect(() => {
        startFetchEnabledGroups();
    }, []);
    useEffect(() => {
        if (isDisabled) {
            startFetchDisabledGroups();
        } else {
            startFetchEnabledGroups();
        }
    }, [isDisabled]);

    const visibleGroups = search(groups, term, ['title']);

    const showCustomDialog = (currentId, disabledStatus) => {
        setGroupId(currentId);
        setSubDialogType(disabledStatus);
        setOpenSubDialog(true);
    };
    const acceptConfirmDialog = (currentGroupId) => {
        setOpenSubDialog(false);
        if (!currentGroupId) return;
        if (subDialogType !== dialogTypes.DELETE_CONFIRM) {
            toggleDisabledStatus(currentGroupId, isDisabled);
        } else startDeleteGroup(currentGroupId);
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

    return (
        <>
            <CustomDialog
                type={subDialogType}
                cardId={groupId}
                whatDelete="group"
                open={openSubDialog}
                onClose={acceptConfirmDialog}
                setOpenSubDialog={setOpenSubDialog}
            />
            {openAddStudentDialog && <AddStudentDialog group={group} open={openAddStudentDialog} />}
            {/* {showStudents && (
                <ShowStudentsOnGroupDialog
                    onClose={() => setShowStudents(false)}
                    open={showStudents}
                    students={students}
                    group={group}
                    onDeleteStudent={(studentItem) => deleteStudentService(studentItem)}
                    onSubmit={studentSubmit}
                    match={match}
                    student={student}
                    groups={groups}
                />
            )} */}
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
