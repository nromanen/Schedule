import React, { useState } from 'react';
import { IoMdLink } from 'react-icons/all';
import { CustomDialog } from '../../share/DialogWindows';
import { dialogTypes } from '../../constants/dialogs';
import './LinkToMeeting.scss';

const LinkToMeeting = (props) => {
    const { linkToMeeting } = props;
    const [openDialog, setOpenDialog] = useState(false);
    const openWindowByUrl = (url) => {
        const win = window.open(url, '_blank');
        win.focus();
    };
    const handleClose = (semesterId) => {
        setOpenDialog(false);
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
                    setOpenDialog(true);
                }}
                title={linkToMeeting}
            />
            {openDialog && (
                <CustomDialog
                    type={dialogTypes.MEETING_LINK}
                    cardId={1}
                    open={openDialog}
                    onClose={handleClose}
                    linkToMeeting={linkToMeeting}
                />
            )}
        </>
    );
};
export { LinkToMeeting };
