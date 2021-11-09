import React from 'react';
import { isEmpty } from 'lodash';
import { FaDoorOpen } from 'react-icons/fa';
import { ROOM_LABEL } from '../../constants/translationLabels/formElements';
import { TYPE_LABEL, COMMON_FREE_ROOMS_LIST_EMPTY } from '../../constants/translationLabels/common';
import Card from '../../share/Card/Card';

const FreeRoomsCardList = (props) => {
    const { freeRooms, t } = props;
    return (
        <>
            {isEmpty(freeRooms) ? (
                <div className="room-icon-container">
                    <FaDoorOpen className="room-icon" />
                    <p className="description-text">{t(COMMON_FREE_ROOMS_LIST_EMPTY)}</p>
                </div>
            ) : (
                freeRooms.map((freeRoom) => (
                    <Card key={freeRoom.id} className="container">
                        <div className="freeRoomCard">
                            <span> {`${t(ROOM_LABEL)}:`} </span>
                            <h2 className="room-card__number">{freeRoom.name}</h2>
                            <span>{`${t(TYPE_LABEL)}:`}</span>
                            <h2 className="room-card__number">{freeRoom.type.description}</h2>
                        </div>
                    </Card>
                ))
            )}
        </>
    );
};

export default FreeRoomsCardList;
