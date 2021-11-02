import React from 'react';
import i18n from 'i18next';
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
import { actionType } from '../../../constants/actionTypes';
import { getTeacherName } from '../../../helper/renderTeacher';

const ScheduleItem = (props) => {
    const {
        deleteScheduleItem,
        checkRoomAvailability,
        itemData,
        getLessonsByGroupId,
        selectByGroupId,
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
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handelDelete}>Delete</MenuItem>
                    <MenuItem onClick={handelEdit}>Edit</MenuItem>
                </Menu>
            </div>
            <h5 className="lesson-title">
                {lesson.subjectForSite} (
                {i18n.t(`formElements:lesson_type_${lesson.lessonType.toLowerCase()}_label`)})
            </h5>
            <p className="teacher-name">{getTeacherName(lesson.teacher)}</p>
            {lesson.grouped && (
                <span className="grouped-icon">
                    <MdGroup
                        title={i18n.t(FORM_GROUPED_LABEL)}
                        className="svg-btn copy-btn align-left info-btn"
                    />
                </span>
            )}
            <p className="lesson-duration">
                <b>1</b> {i18n.t(FORM_HOURS_LABEL)}
            </p>
        </Card>
    );
};

export default ScheduleItem;
