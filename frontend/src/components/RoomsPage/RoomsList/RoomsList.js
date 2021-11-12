import React from 'react';
import { useTranslation } from 'react-i18next';
import NotFound from '../../../share/NotFound/NotFound';
import { ROOM_Y_LABEL } from '../../../constants/translationLabels/formElements';
import RoomCard from './RoomCard';
import { search } from '../../../helper/search';

const RoomList = (props) => {
    const { isDisabled, disabledRooms, term, rooms, ...rest } = props;
    const { t } = useTranslation('formElements');

    const visibleItems = isDisabled
        ? search(disabledRooms, term, ['name'])
        : search(rooms, term, ['name']);
    return (
        <section className="container-flex-wrap wrapper">
            {visibleItems.length === 0 && <NotFound name={t(ROOM_Y_LABEL)} />}
            {visibleItems.map((room) => (
                <RoomCard key={room.id} room={room} isDisabled={isDisabled} {...rest} />
            ))}
        </section>
    );
};

export default RoomList;
