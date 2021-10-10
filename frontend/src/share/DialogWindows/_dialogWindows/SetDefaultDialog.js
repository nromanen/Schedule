import React from 'react';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import i18n from 'i18next';
import { disabledCard } from '../../../constants/disabledCard';
import CustomDialog from '../CustomDialog';

const SetDefaultDialog = (props) => {
    const { onClose, cardId, isHide, open } = props;
    // TODO: add translation to title
    const handleClose = () => {
        onClose(cardId);
    };
    const isHidden =
        isHide === disabledCard.HIDE ? 'common:do_you_wanna_disable' : 'common:do_you_wanna_show';

    return (
        <CustomDialog
            open={open}
            onClose={handleClose}
            title=""
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
        >
            <>
                {isHide ? (
                    <>{i18n.t(isHidden)}</>
                ) : (
                    <>
                        {i18n.t('common:do_you_wanna')}{' '}
                        <span className="set-default">{i18n.t(`common:set_default_word`)}</span>{' '}
                    </>
                )}

                {i18n.t('common:this_card_type', {
                    cardType: i18n.t(`formElements:semester_element`),
                })}
            </>
        </CustomDialog>
    );
};

SetDefaultDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    isHide: PropTypes.string.isRequired,
};

export default SetDefaultDialog;
