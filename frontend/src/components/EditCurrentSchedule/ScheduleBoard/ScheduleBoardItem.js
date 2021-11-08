import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { MdGroup } from 'react-icons/md';

import { IoMdMore } from 'react-icons/all';

import Card from '@material-ui/core/Card';
import {
    FORM_GROUPED_LABEL,
    FORM_HOURS_LABEL,
} from '../../../constants/translationLabels/formElements';
import {
    COMMON_EDIT,
    COMMON_DELETE_HOVER_TITLE,
} from '../../../constants/translationLabels/common';
import { actionType } from '../../../constants/actionTypes';
import { getTeacherName } from '../../../helper/renderTeacher';

const ScheduleItem = (props) => {
    const {
        deleteScheduleItem,
        checkRoomAvailability,
        itemData,
        getLessonsByGroupId,
        selectByGroupId,
        t,
        openDialogWithData,
    } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { lesson } = itemData;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handelEdit = () => {
        const { group } = lesson;
        const editObj = {
            id: itemData.id,
            dayOfWeek: itemData.dayOfWeek,
            periodId: itemData.period.id,
            evenOdd: itemData.evenOdd,
            semesterId: lesson.semester.id,
        };
        checkRoomAvailability(editObj);
        selectByGroupId(group.id);
        openDialogWithData({ type: actionType.UPDATED, item: editObj, groupId: group.id });
        getLessonsByGroupId(group.id);
        handleClose();
    };
    const handelDelete = () => {
        const { group } = lesson;
        deleteScheduleItem(itemData.id);
        selectByGroupId(group.id);
        getLessonsByGroupId(group.id);
        handleClose();
    };

    return (
        <Card className="schedule-item">
            <div>
                <Button
                    aria-controls="simple-menu"
                    className="schedule-item-menu"
                    onClick={handleClick}
                >
                    <IoMdMore title="more" className="svg-btn delete-btn" />
                </Button>
                <Menu
                    className="action-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem className="edit-item" onClick={handelEdit}>
                        {t(COMMON_EDIT)}
                    </MenuItem>
                    <MenuItem className="delete-item" onClick={handelDelete}>
                        {t(COMMON_DELETE_HOVER_TITLE)}
                    </MenuItem>
                </Menu>
            </div>
            <h5 className="lesson-title">
                {lesson.subjectForSite} (
                {t(`formElements:lesson_type_${lesson.lessonType.toLowerCase()}_label`)})
            </h5>
            <p className="teacher-name">{getTeacherName(lesson.teacher)}</p>
            {lesson.grouped && (
                <span className="grouped-icon">
                    <MdGroup
                        title={t(FORM_GROUPED_LABEL)}
                        className="svg-btn copy-btn align-left info-btn"
                    />
                </span>
            )}
            <p className="lesson-duration">
                <b>1</b> {t(FORM_HOURS_LABEL)}
            </p>
        </Card>
    );
};

export default ScheduleItem;
