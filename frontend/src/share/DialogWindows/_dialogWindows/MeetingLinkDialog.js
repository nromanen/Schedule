import React from 'react';

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import '../dialog.scss';
import i18n from 'i18next';
import { disabledCard } from '../../../constants/disabledCard';
import CustomDialog from '../CustomDialog';

const MeetingLinkDialog = (props) => {
    const { onClose, cardId, isHide, open, linkToMeeting } = props;

    const handleClose = () => {
        onClose(cardId);
    };
    const isHidden =
        isHide === disabledCard.HIDE ? 'common:do_you_wanna_disable' : 'common:do_you_wanna_show';
    return (
        <CustomDialog
            title=""
            open={open}
            onClose={handleClose}
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
                        {i18n.t('common:do_you_wanna')}
                        <span>
                            <a
                                className="go-to-meeting"
                                href={linkToMeeting}
                                target="_blank"
                                title={linkToMeeting}
                                rel="noreferrer"
                            >
                                {i18n.t(`common:go_to_meeting_word`)}
                            </a>
                        </span>
                    </>
                )}

                {i18n.t('common:by_this_card_type', {
                    cardType: i18n.t(`formElements:reference_element`),
                })}
            </>
        </CustomDialog>
    );
};

MeetingLinkDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    isHide: PropTypes.string.isRequired,
};

export default MeetingLinkDialog;
