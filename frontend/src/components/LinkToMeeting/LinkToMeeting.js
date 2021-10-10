import React, { useState } from 'react';
import { IoMdLink } from 'react-icons/all';
import { MeetingLinkDialog } from '../../share/DialogWindows';
import './LinkToMeeting.scss';

const LinkToMeeting = (props) => {
    const { linkToMeeting } = props;
    const [openDialog, setOpenDialog] = useState(false);
    const openWindowByUrl = (url) => {
        const win = window.open(linkToMeeting, '_blank');
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
            <MeetingLinkDialog
                cardId={1}
                isHide={false}
                open={openDialog}
                onClose={handleClose}
                linkToMeeting={linkToMeeting}
            />
        </>
    );
};
export { LinkToMeeting };
