import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MdGroup } from 'react-icons/md';
import { IoMdMore } from 'react-icons/all';
import Card from '@mui/material/Card';
import { FORM_GROUPED_LABEL } from '../../../constants/translationLabels/formElements';
import {
    COMMON_DELETE_HOVER_TITLE,
    COMMON_EDIT,
    COMMON_MOVE_LABEL,
} from '../../../constants/translationLabels/common';
import { actionType } from '../../../constants/actionTypes';
import { getTeacherName } from '../../../helper/renderTeacher';
import LessonTypeBadge from '../../../components/LessonTypeBadge/LessonTypeBadge';
import MoveScheduleDialog from '../MoveScheduleDialog/MoveScheduleDialog';

const ScheduleItem = (props) => {
    const {
        deleteScheduleItem,
        checkRoomAvailability,
        itemData,
        selectByGroupId,
        t,
        openDialogWithData,
        currentSemester,
        scheduleItems,
        moveScheduleItem,
    } = props;

    const [anchorEl, setAnchorEl] = useState(null);
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const { lesson } = itemData;

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleMoveClose = () => setIsMoveDialogOpen(false);

    const handleEdit = () => {
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
        openDialogWithData({ type: actionType.UPDATED, item: editObj, groupId: group.id, currentRoom: itemData.room });
        handleClose();
    };

    const handleDelete = () => {
        const { group } = lesson;
        deleteScheduleItem(itemData.id);
        selectByGroupId(group.id);
        handleClose();
    };

    const handleMove = () => {
        handleClose();
        setIsMoveDialogOpen(true);
    };

    return (
        <>
            <Card className="schedule-item" title={lesson.group.title}>
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
                    <MenuItem className="edit-item" onClick={handleEdit}>
                        {t(COMMON_EDIT)}
                    </MenuItem>
                    <MenuItem className="move-item" onClick={handleMove}>
                        {t(COMMON_MOVE_LABEL)}
                    </MenuItem>
                    <MenuItem className="delete-item" onClick={handleDelete}>
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
                <p className="lesson-duration room-name" >
                    {itemData.room?.name || '—'}
                </p>
            </Card>

            <MoveScheduleDialog
                open={isMoveDialogOpen}
                onClose={handleMoveClose}
                itemData={itemData}
                currentSemester={currentSemester}
                scheduleItems={scheduleItems}
                checkRoomAvailability={checkRoomAvailability}
                moveScheduleItem={moveScheduleItem}
                t={t}
            />
        </>
    );
};

export default ScheduleItem;