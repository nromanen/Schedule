import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DragDropCard from '../DragDropCard';
import { divideLessonsByOneHourLesson } from '../../../helper/schedule';
import { FORM_GROUP_LABEL } from '../../../constants/translationLabels/formElements';
import {
    CLEAR_SCHEDULE_LABEL,
    COMMON_SELECT_GROUP_SCHEDULE,
    LESSON_NO_LESSON_FOR_GROUP_LABEL,
} from '../../../constants/translationLabels/common';
import './ScheduleLessonList.scss';
import i18n from '../../../i18n';

const ScheduleLessonsList = (props) => {
    const {
        groups,
        setDragItemData,
        groupId,
        lessons,
        handleClearSchedule,
        selectByGroupId,
        items,
    } = props;
    const [listItems, setListItems] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const isListEmpty = isEmpty(lessons);

    const handleGroupSelect = (group) => {
        if (group) selectByGroupId(group.id);
    };

    const groupFinderHandle = (groupIdProp) => {
        if (groupIdProp) return groups.find((group) => group.id === groupIdProp);
        return '';
    };

    useEffect(() => {
        setListItems(divideLessonsByOneHourLesson(items, lessons));
        setListLoading(false);
    }, [lessons]);

    useEffect(() => {
        if (groupId) {
            setListLoading(true);
        }
    }, [groupId]);

    return (
        <>
            <div className="app-button-container">
                <Button
                    className="common-button"
                    variant="contained"
                    color="primary"
                    onClick={handleClearSchedule}
                >
                    {i18n.t(CLEAR_SCHEDULE_LABEL)}
                </Button>
            </div>

            <>
                <p className="helper-text">{i18n.t(COMMON_SELECT_GROUP_SCHEDULE)}</p>
                <div className="autocomplete-container">
                    <Autocomplete
                        options={groups}
                        clearOnEscape
                        openOnFocus
                        value={groupFinderHandle(groupId)}
                        onChange={(_, newValue) => {
                            handleGroupSelect(newValue);
                        }}
                        getOptionLabel={(option) => (option ? option.title : '')}
                        getOptionSelected={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                className="form-input"
                                label={i18n.t(FORM_GROUP_LABEL)}
                                margin="normal"
                            />
                        )}
                    />
                </div>

                <section className={`lessons-container ${listLoading ? 'loading' : ''}`}>
                    {listLoading && (
                        <div className="content-center">
                            <CircularProgress className="loading-circle" />
                        </div>
                    )}
                    {!listLoading && !isListEmpty
                        ? listItems.map((item, index) => (
                              <DragDropCard
                                  key={`${item.id}_${index.toString()}`}
                                  index={index}
                                  lesson={item}
                                  lessons={lessons}
                                  setDragItemData={setDragItemData}
                                  classScheduler={props.classScheduler}
                              />
                          ))
                        : groupId && (
                              <p className="empty">{i18n.t(LESSON_NO_LESSON_FOR_GROUP_LABEL)}</p>
                          )}
                </section>
            </>
        </>
    );
};

export default ScheduleLessonsList;
