import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import {MdGroup} from 'react-icons/md';
import {IoMdMore} from 'react-icons/all';

import Card from '@material-ui/core/Card';
import {FORM_GROUPED_LABEL} from '../../../constants/translationLabels/formElements';
import {COMMON_DELETE_HOVER_TITLE, COMMON_EDIT} from '../../../constants/translationLabels/common';
import {actionType} from '../../../constants/actionTypes';
import {getTeacherName} from '../../../helper/renderTeacher';
import LessonTypeBadge from '../../../components/LessonTypeBadge/LessonTypeBadge';

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
    const [anchorEl, setAnchorEl] = useState(null);
    const { lesson } = itemData;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handelEdit = () => {
        const { group } = lesson;
        const { id, period, dayOfWeek, evenOdd } = itemData;
        const editObj = {
            id,
            dayOfWeek,
            periodId: period.id,
            evenOdd,
            semesterId: lesson.semesterId,
        };
        checkRoomAvailability(editObj);
        selectByGroupId(group.id);
        openDialogWithData({ type: actionType.UPDATED, item: editObj, groupId: group.id });
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
            <h5 className="lesson-title">{lesson.subjectForSite}</h5>
            <LessonTypeBadge lessonType={lesson.lessonType} showIcon={false} size="small" />
            <p className="teacher-name">{getTeacherName(lesson.teacher)}</p>
            {lesson.grouped && (
                <MdGroup
                    title={t(FORM_GROUPED_LABEL)}
                    className="svg-btn copy-btn grouped-icon align-left info-btn"
                />
            )}
            <p className="lesson-duration" style={{ color: '#757575' }}>
                {itemData.room?.name || '—'}
            </p>
        </Card>
    );
};

export default ScheduleItem;