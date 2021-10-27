import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import Select from 'react-select';
import { isEmpty } from 'lodash';
import i18n from '../../../i18n';

import { updateStudentService } from '../../../services/studentService';
import { successHandler } from '../../../helper/handlerAxios';
import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import { EXIST_LABEL } from '../../../constants/translationLabels/serviceMessages';
import { COMMON_MOVE_TO_GROUP_TITLE } from '../../../constants/translationLabels/common';
import { dialogCloseButton, dialogMoveToGroupButton } from '../../../constants/dialogs';

const MovingGroupsDialog = (props) => {
    const { onClose, open, checkBoxStudents, setShowStudentList, groups, group } = props;

    const setDefaultGroupOption = () => {
        return { value: `${group.id}`, label: `${group.title}`, ...group };
    };
    const [groupOption, setGroupOption] = useState({});
    const [defaultGroup, setDefaultGroup] = useState({});

    useEffect(() => {
        if (group.id !== null) setDefaultGroup(setDefaultGroupOption());
    }, [group.id]);

    const setGroupsOption = () => {
        return !isEmpty(groups)
            ? groups.map((item) => ({ value: item.id, label: `${item.title}`, ...item }))
            : [];
    };

    const groupsOption = setGroupsOption();
    const getExistingGroupStudent = () => {
        return successHandler(
            i18n.t('serviceMessages:students_exist_in_this_group', {
                cardType: i18n.t('common:student_title'),
                actionType: i18n.t(EXIST_LABEL),
            }),
        );
    };
    const setCurrentGroupOption = (currentGroup) => {
        if (currentGroup.id === defaultGroup.id) {
            getExistingGroupStudent();
        }
        setGroupOption(currentGroup);
    };
    const changeStudentItem = (currentGroup, student) => {
        if (student.checked) {
            const { checked, ...res } = student;
            return { ...res, group: { id: currentGroup.id } };
        }
        return {};
    };

    const clearSelection = () => {
        onClose();
        setGroupOption({});
        setShowStudentList(false);
    };
    const handleSubmitGroupStudents = () => {
        if (isEmpty(groupOption)) {
            getExistingGroupStudent();
            return;
        }
        const { value, label, ...res } = groupOption;
        const prevGroup = { id: defaultGroup.id };
        const resData = checkBoxStudents.filter((item) => {
            const resItem = changeStudentItem(res, item);
            return !isEmpty(resItem);
        });
        resData.forEach((item) => updateStudentService({ ...item, prevGroup }));

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
