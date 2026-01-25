import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import { isEmpty } from 'lodash';
import NotFound from '../../../share/NotFound/NotFound';
import { ROOM_Y_LABEL } from '../../../constants/translationLabels/formElements';
import RoomCard from './RoomCard/RoomCard';
import { search } from '../../../helper/search';
import { DraggableCard } from '../../../share/DraggableCard/DraggableCard';

const RoomList = (props) => {
    const { isDisabled, disabledRooms, term, rooms, loading, dragAndDropRoom, ...rest } = props;
    const { t } = useTranslation('formElements');

    const [dragRoom, setDragRoom] = useState(null);

    const visibleItems = isDisabled
        ? search(disabledRooms, term, ['name'])
        : search(rooms, term, ['name']);

    const dragAndDropItem = (afterItemId) => {
        dragAndDropRoom(dragRoom, afterItemId);
    };

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

    if (isDisabled) {
        return (
            <section className="container-flex-wrap">
                {visibleItems.map((room) => (
                    <RoomCard key={room.id} {...rest} room={room} isDisabled={isDisabled} />
                ))}
            </section>
        );
    }

    return (
        <section className="container-flex-wrap">
            {visibleItems.map((room) => (
                <DraggableCard
                    key={room.id}
                    item={room}
                    setGroupStart={setDragRoom}
                    dragAndDropItem={dragAndDropItem}
                    cardClassName="room-card"
                >
                    <RoomCard {...rest} room={room} isDisabled={isDisabled} />
                </DraggableCard>
            ))}
        </section>
    );
};

export default RoomList;