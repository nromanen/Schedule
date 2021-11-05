import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { isEmpty } from 'lodash';
import i18n from '../../../i18n';

import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import { COMMON_MOVE_TO_GROUP_TITLE } from '../../../constants/translationLabels/common';
import { dialogCloseButton, dialogMoveToGroupButton } from '../../../constants/dialogs';
import { getGroupsOptionsForSelect } from '../../../utils/selectUtils';

const MovingGroupsDialog = (props) => {
    const {
        open,
        group,
        groups,
        onClose,
        checkBoxStudents,
        moveStudentsToGroupStart,
        setExistingGroupStudentStart,
    } = props;

    const [newGroup, setNewGroup] = useState({});

    const groupsOption = getGroupsOptionsForSelect(groups);
    const defaultGroup = { value: `${group.id}`, label: `${group.title}`, ...group };

    const clearSelection = () => {
        onClose();
        setNewGroup({});
    };

    const setCurrentGroupOption = (currentGroup) => {
        if (currentGroup.id === defaultGroup.id) {
            setExistingGroupStudentStart();
            return;
        }
        setNewGroup(currentGroup);
    };

    const handleSubmitGroupStudents = () => {
        if (isEmpty(newGroup)) {
            setExistingGroupStudentStart();
            return;
        }
        const movedStudents = checkBoxStudents.filter((item) => item.checked === true);
        moveStudentsToGroupStart({ movedStudents, group, newGroup });
        clearSelection();
    };

    return (
        <CustomDialog
            title={i18n.t(COMMON_MOVE_TO_GROUP_TITLE)}
            className="select-dialog"
            onClose={onClose}
            open={open}
            buttons={[
                dialogMoveToGroupButton(handleSubmitGroupStudents),
                dialogCloseButton(clearSelection),
            ]}
        >
            <Select
                classNamePrefix="react-select"
                defaultValue={defaultGroup}
                options={groupsOption}
                onChange={setCurrentGroupOption}
            />
        </CustomDialog>
    );
};

MovingGroupsDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default MovingGroupsDialog;
