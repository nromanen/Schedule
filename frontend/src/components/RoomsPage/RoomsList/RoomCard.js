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
import { selectOneRoomService } from '../../../services/roomService';
import { cardType } from '../../../constants/cardType';

const RoomCard = (props) => {
    const { roomItem, isDisabled, showConfirmDialog, setDeleteLabel } = props;
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
                                showConfirmDialog(roomItem.id, dialogTypes.SET_VISIBILITY_DISABLED);
                            }}
                        />
                        <FaEdit
                            className="svg-btn"
                            onClick={() => selectOneRoomService(roomItem.id)}
                        />
                    </>
                ) : (
                    <GiSightDisabled
                        className="svg-btn copy-btn"
                        title={t(COMMON_SET_ENABLED)}
                        onClick={() => {
                            showConfirmDialog(roomItem.id, dialogTypes.SET_VISIBILITY_ENABLED);
                        }}
                    />
                )}

                <MdDelete
                    className="svg-btn"
                    onClick={() => {
                        showConfirmDialog(roomItem.id, dialogTypes.DELETE_CONFIRM, cardType.ROOM);
                        setDeleteLabel(cardType.ROOM);
                    }}
                />
            </div>

            <span> {`${t(ROOM_LABEL)}:`} </span>
            <h2 className="room-card__number">{roomItem.name}</h2>
            <span>{`${t(TYPE_LABEL)}:`}</span>
            <h2 className="room-card__number">{roomItem.type.description}</h2>
        </Card>
    );
};

export default RoomCard;
