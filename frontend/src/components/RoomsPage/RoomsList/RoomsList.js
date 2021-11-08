import React from 'react';
import { useTranslation } from 'react-i18next';
import NotFound from '../../../share/NotFound/NotFound';
import { ROOM_Y_LABEL } from '../../../constants/translationLabels/formElements';
import RoomCard from './RoomCard';

const RoomList = (props) => {
    const { visibleItems, isDisabled, showConfirmDialog } = props;
    const { t } = useTranslation('formElements');

    return (
        <section className="container-flex-wrap wrapper">
            {visibleItems.length === 0 && <NotFound name={t(ROOM_Y_LABEL)} />}
            {visibleItems.map((roomItem) => (
                <RoomCard
                    key={roomItem.id}
                    roomItem={roomItem}
                    isDisabled={isDisabled}
                    showConfirmDialog={showConfirmDialog}
                />
            ))}
        </section>
    );
};

export default RoomList;
