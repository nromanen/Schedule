import React from 'react';
import { IoMdLink } from 'react-icons/all';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import './LinkToMeeting.scss';

const LinkToMeeting = (props) => {
    const { linkToMeeting, isOpenConfirmDialog, setOpenConfirmDialog } = props;
    const openWindowByUrl = (url) => {
        const win = window.open(url, '_blank');
        win.focus();
    };
    const handelRedirectToMeeting = (semesterId) => {
        setOpenConfirmDialog(false);
        if (semesterId !== '') {
            openWindowByUrl(linkToMeeting);
        }
    };

    return (
        <>
            <IoMdLink
                color="blue"
                className="svg-btn copy-btn link"
                onClick={() => {
                    setOpenConfirmDialog(true);
                }}
                title={linkToMeeting}
            />
            {isOpenConfirmDialog && (
                <CustomDialog
                    type={dialogTypes.MEETING_LINK}
                    handelConfirm={handelRedirectToMeeting}
                    open={isOpenConfirmDialog}
                    linkToMeeting={linkToMeeting}
                />
            )}
        </>
    );
};

export { LinkToMeeting };
