import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import { isEmpty } from 'lodash';
import NotFound from '../../../share/NotFound/NotFound';
import { ROOM_Y_LABEL } from '../../../constants/translationLabels/formElements';
import RoomCard from './RoomCard/RoomCard';
import { search } from '../../../helper/search';
import {DraggableCard} from "../../../share/DraggableCard/DraggableCard";
import {ADD_STUDENT_ACTION, SHOW_STUDENTS_ACTION} from "../../../constants/actionsUrl";

const RoomList = (props) => {
    const { isDisabled, disabledRooms, term, rooms, loading, ...rest } = props;
    const { t } = useTranslation('formElements');
    const [dragRoom, setRoomStart] = useState();

    const visibleItems = isDisabled
        ? search(disabledRooms, term, ['name'])
        : search(rooms, term, ['name']);

    if (loading) {
        return (
            <section className="centered-container">
                <CircularProgress />
            </section>
        );
    }
    if (isEmpty(visibleItems)) {
        return <NotFound name={t(ROOM_Y_LABEL)} />;
    }

    const dragAndDropItem = (afterItemId) => {
        props.dragAndDropRoomStart(dragRoom, afterItemId);
    };

    return (
        <section className="container-flex-wrap">
            {visibleItems.map((room) => (
                <DraggableCard
                    key={room.id}
                    item={room}
                    setGroupStart={setRoomStart}
                    dragAndDropItem={dragAndDropItem}
                >
                    <RoomCard key={room.id} {...rest} room={room} isDisabled={isDisabled} />
                </DraggableCard>

            ))}
        </section>
    );
};

export default RoomList;
