import './RoomCard.scss';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { dialogTypes } from '../../../../constants/dialogs';
import { COMMON_EDIT, COMMON_SET_DISABLED, COMMON_SET_ENABLED } from '../../../../constants/translationLabels/common';
import {
    DELETE_TITLE_LABEL,
    FORM_TYPE_LABEL,
    ROOM_LABEL,
} from '../../../../constants/translationLabels/formElements';
import Card from '../../../../share/Card/Card';
import { cardType } from '../../../../constants/cardType';

const RoomCard = ({ room, isDisabled, showConfirmDialog, setSelectRoom }) => {
    const { t } = useTranslation('formElements');

    return (
        <Card additionClassName="room-card" variant="entity">
            <h3 className="card-entity__title card-entity__title--uppercase">{room.name}</h3>
            <p className="room-card__type">
                <span className="room-card__type-label">{t(FORM_TYPE_LABEL)}: </span>
                {room.type.description}
            </p>
            <div className="cards-btns">
                {!isDisabled ? (
                    <>
                        <IoMdEye
                            className="svg-btn copy-btn"
                            title={t(COMMON_SET_DISABLED)}
                            onClick={() =>
                                showConfirmDialog(
                                    room.id,
                                    dialogTypes.SET_VISIBILITY_DISABLED,
                                    cardType.ROOM,
                                )
                            }
                        />
                        <FaEdit
                            className="svg-btn edit-btn"
                            title={t(COMMON_EDIT)}
                            onClick={() => setSelectRoom(room.id)}
                        />
                    </>
                ) : (
                    <GiSightDisabled
                        className="svg-btn copy-btn"
                        title={t(COMMON_SET_ENABLED)}
                        onClick={() =>
                            showConfirmDialog(
                                room.id,
                                dialogTypes.SET_VISIBILITY_ENABLED,
                                cardType.ROOM,
                            )
                        }
                    />
                )}
                <MdDelete
                    className="svg-btn delete-btn"
                    title={t(DELETE_TITLE_LABEL)}
                    onClick={() =>
                        showConfirmDialog(room.id, dialogTypes.DELETE_CONFIRM, cardType.ROOM)
                    }
                />
            </div>
        </Card>
    );
};

export default RoomCard;