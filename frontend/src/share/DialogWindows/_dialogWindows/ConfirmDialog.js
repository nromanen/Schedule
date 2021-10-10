import React from 'react';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CustomDialog from '../CustomDialog';
import i18n from '../../../helper/i18n';
import { disabledCard } from '../../../constants/disabledCard';

const ConfirmDialog = (props) => {
    const { onClose, whatDelete, cardId, isHide, open } = props;

    const handleClose = () => {
        onClose(cardId);
    };
    const isHidden =
        isHide === disabledCard.HIDE ? 'common:do_you_wanna_disable' : 'common:do_you_wanna_show';

    return (
        <CustomDialog
            onClose={handleClose}
            open={open}
            title={
                <>
                    {isHide ? (
                        i18n.t(isHidden)
                    ) : (
                        <>
                            {i18n.t('common:do_you_wanna')}{' '}
                            <span className="delete-word">{i18n.t('common:delete_word')}</span>{' '}
                        </>
                    )}
                    {i18n.t('common:this_card_type', {
                        cardType: i18n.t(`formElements:${whatDelete}_element`),
                    })}
                </>
            }
            buttons={
                <>
                    <Button
                        className="dialog-button"
                        variant="contained"
                        color="primary"
                        onClick={handleClose}
                    >
                        {i18n.t('common:yes_button_title')}
                    </Button>
                    <Button
                        className="dialog-button"
                        variant="contained"
                        onClick={() => onClose('')}
                    >
                        {i18n.t('common:no_button_title')}
                    </Button>
                </>
            }
        />
    );
};

ConfirmDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    whatDelete: PropTypes.string.isRequired,
    cardId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ConfirmDialog;
