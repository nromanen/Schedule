import React, { useState } from 'react';
import { IoMdLink } from 'react-icons/all';
import SetChangeDialog from '../../share/modals/modal/setDefaultDialog';
import {
    removeSemesterCardService, setDefaultSemesterById,
    setDisabledSemestersService,
    setEnabledSemestersService
} from '../../services/semesterService';
import LinkToMeetingDialog from '../../share/modals/modal/linkToMeetingDialog';
const LinkToMeeting=(props)=>{
   const {linkToMeeting}=props;
   const [openDialog,setOpenDialog]=useState(false);
    const handleClose = semesterId => {
        setOpenDialog(false);
    };

    return (<>
                    <IoMdLink
                        color={"red"}
                        className="svg-btn copy-btn"
                        onClick={() => {
                            setOpenDialog(true);
                        }}
                    />
                <LinkToMeetingDialog
                    cardId={1}
                    isHide={false}
                    open={openDialog}
                    onClose={handleClose}
                    linkToMeeting={linkToMeeting}
                />
                </>
           )

}
export {LinkToMeeting}