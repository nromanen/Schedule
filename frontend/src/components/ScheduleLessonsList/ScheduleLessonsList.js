import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Autocomplete from '@material-ui/lab/Autocomplete';
import { styled } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DragDropCard from '../DragDropCard/DragDropCard';
import ScheduleItem from '../ScheduleItem/ScheduleItem';

import { FORM_GROUP_LABEL } from '../../constants/translationLabels/formElements';
import {
    COMMON_SELECT_GROUP_SCHEDULE,
    LESSON_NO_LESSON_FOR_GROUP_LABEL,
} from '../../constants/translationLabels/common';
import { selectGroupId } from '../../actions';

const GroupField = styled(TextField)({
    width: '150px',
});

const ScheduleLessonsList = (props) => {
    const {
        groups,
        setDragItemData,
        groupId,
        lessons,
        selectByGroupId,
        items,
        translation: t,
    } = props;
    const [listItems, setListItems] = useState([]);

    const lessonItems = () => {
        const lessonItem = [];
        lessons.forEach((lesson) => {
            const { hours } = lesson;
            const modifiedLesson = lesson;
            let els = [];
            let hoursInSchedule = 0;

            if (items.length > 0) {
                els = items.filter((item) => item.lesson.id === lesson.id);
            }

            els.forEach(() => {
                hoursInSchedule += 1;
            });
            for (let i = 0; i < hours - hoursInSchedule; i += 1) {
                lessonItem.push(modifiedLesson);
            }
        });
        // <section key={lesson.id + i}>
        //     <ScheduleItem
        //         index={i}
        //         lesson={lesson}
        //         lessons={lessons}
        //         fStrLetterCapital={firstStringLetterCapitalHandle}
        //         translation={t}
        //         classScheduler={props.classScheduler}
        //     />
        // </section>,
        return lessonItem;
    };

    useEffect(() => {
        setListItems(lessonItems());
    }, [lessons]);

    const handleGroupSelect = (group) => {
        if (group) selectByGroupId(group.id);
    };

    const groupFinderHandle = (groupIdProp) => {
        if (groupIdProp) return groups.find((group) => group.id === groupIdProp);
        return '';
    };

    const defaultProps = {
        options: groups,
        getOptionLabel: (option) => (option ? option.title : ''),
    };

    // console.log(listItems);
    return (
        <>
            {t(COMMON_SELECT_GROUP_SCHEDULE)}
            <Autocomplete
                {...defaultProps}
                id="group"
                clearOnEscape
                openOnFocus
                value={groupFinderHandle(groupId)}
                onChange={(_, newValue) => {
                    handleGroupSelect(newValue);
                }}
                renderInput={(params) => (
                    <GroupField {...params} label={t(FORM_GROUP_LABEL)} margin="normal" />
                )}
            />
            {lessons.length > 0
                ? listItems.map((item, index) => (
                      <DragDropCard
                          key={`${item.id}_${index}_${item.index}`}
                          index={index}
                          lesson={item}
                          lessons={lessons}
                          setDragItemData={setDragItemData}
                          translation={t}
                          classScheduler={props.classScheduler}
                      />
                  ))
                : groupId && t(LESSON_NO_LESSON_FOR_GROUP_LABEL)}
        </>
    );
};

const mapDispatchToProps = (dispatch) => ({
    selectByGroupId: (groupId) => dispatch(selectGroupId(groupId)),
});

export default connect(null, mapDispatchToProps)(ScheduleLessonsList);
