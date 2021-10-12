import React from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import './modal.scss';

import i18n from 'i18next';
import { disabledCard } from '../../../constants/disabledCard';
import './setDefaultDialog.scss';
import { FORM_SEMESTER_ELEMENT } from '../../../constants/translationLabels/formElements';
import {
    COMMON_NO_BUTTON_TITLE,
    COMMON_YES_BUTTON_TITLE,
} from '../../../constants/translationLabels/common';

export const SetChangeDialog = (props) => {
    const { onClose, cardId, isHide, open } = props;

    const handleClose = () => {
        onClose(cardId);
    };
    const className = 'set-default';
    return (
        <Dialog
            disableBackdropClick
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="confirm-dialog-title">
                <>
                    {isHide ? (
                        <>
                            {isHide === disabledCard.HIDE ? (
                                <>{i18n.t('common:do_you_wanna_disable')}</>
                            ) : (
                                <>{i18n.t('common:do_you_wanna_show')}</>
                            )}
                        </>
                    ) : (
                        <>
                            {i18n.t('common:do_you_wanna')}{' '}
                            <span className={className}>{i18n.t(`common:set_default_word`)}</span>{' '}
                        </>
                    )}

                    {i18n.t('common:this_card_type', {
                        cardType: i18n.t(FORM_SEMESTER_ELEMENT),
                    })}
                </>
            </DialogTitle>
            <div className="buttons-container">
                <Button
                    className="dialog-button"
                    variant="contained"
                    color="primary"
                    onClick={() => onClose(cardId)}
                >
                    {i18n.t(COMMON_YES_BUTTON_TITLE)}
                </Button>
                <Button className="dialog-button" variant="contained" onClick={() => onClose('')}>
                    {i18n.t(COMMON_NO_BUTTON_TITLE)}
                </Button>
            </div>
        </Dialog>
    );
};

SetChangeDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default SetChangeDialog;
