import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import Select from 'react-select';
import { isEmpty } from 'lodash';
import i18n from '../../../helper/i18n';

import { updateStudentService } from '../../../services/studentService';
import { successHandler } from '../../../helper/handlerAxios';
import CustomDialog from '../CustomDialog';

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
                actionType: i18n.t('serviceMessages:student_label'),
            })
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
            title='Moving to group'
            onClose={onClose}
            open={open}
            buttons={
                <>
                    <Button
                        variant='contained'
                        onClick={handleSubmitGroupStudents}
                        color='primary'
                        title={i18n.t('move_to_group_title')}
                    >
                        {i18n.t('common:move_to_group_title')}
                    </Button>
                    <Button
                        variant='contained'
                        onClick={clearSelection}
                        color='primary'
                        title={i18n.t('cancel_title')}
                    >
                        {i18n.t('cancel_title')}
                    </Button>
                </>
            }
        >
            <h6>
                <Select
                    className='group-select'
                    defaultValue={defaultGroup}
                    options={groupsOption}
                    onChange={setCurrentGroupOption}
                />
            </h6>
        </CustomDialog>
    );
};

MovingGroupsDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default MovingGroupsDialog;
