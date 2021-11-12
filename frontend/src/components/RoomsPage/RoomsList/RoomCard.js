import React from 'react';

import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { dialogTypes } from '../../../constants/dialogs';
import Card from '../../../share/Card/Card';

import { ROOM_LABEL } from '../../../constants/translationLabels/formElements';
import {
    TYPE_LABEL,
    COMMON_SET_DISABLED,
    COMMON_SET_ENABLED,
} from '../../../constants/translationLabels/common';
import { cardType } from '../../../constants/cardType';

const RoomCard = (props) => {
    const { room, isDisabled, showConfirmDialog, setSelectRoom } = props;
    const { t } = useTranslation('formElements');

    return (
        <Card additionClassName="room-card done-card">
            <div className="cards-btns">
                {!isDisabled ? (
                    <>
                        <IoMdEye
                            className="svg-btn copy-btn"
                            title={t(COMMON_SET_DISABLED)}
                            onClick={() => {
                                showConfirmDialog(
                                    room.id,
                                    dialogTypes.SET_VISIBILITY_DISABLED,
                                    cardType.ROOM,
                                );
                            }}
                        />
                        <FaEdit className="svg-btn" onClick={() => setSelectRoom(room.id)} />
                    </>
                ) : (
                    <GiSightDisabled
                        className="svg-btn copy-btn"
                        title={t(COMMON_SET_ENABLED)}
                        onClick={() => {
                            showConfirmDialog(
                                room.id,
                                dialogTypes.SET_VISIBILITY_ENABLED,
                                cardType.ROOM,
                            );
                        }}
                    />
                )}

                <MdDelete
                    className="svg-btn"
                    onClick={() => {
                        showConfirmDialog(room.id, dialogTypes.DELETE_CONFIRM, cardType.ROOM);
                    }}
                />
            </div>

            <span> {`${t(ROOM_LABEL)}:`} </span>
            <h2 className="room-card__number">{room.name}</h2>
            <span>{`${t(TYPE_LABEL)}:`}</span>
            <h2 className="room-card__number">{room.type.description}</h2>
        </Card>
    );
};

export default RoomCard;
