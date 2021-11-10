import './UploadFile.scss';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import BackupIcon from '@material-ui/icons/Backup';
// import InfoIcon from '@material-ui/icons/Info';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { uploadStudentsToGroupFile } from '../../services/uploadFile';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import { dialogCloseButton, dialogUploadButton } from '../../constants/dialogs';
import { setLoadingService } from '../../services/loadingService';
import {
    SELECT_FILE,
    // SELECT_CORRECT_FORMAT,
    // COMMON_NAME_LABEL,
    // COMMON_TYPE_LABEL,
    // COMMON_BYTE_SIZE_LABEL,
    // COMMON_UPLOAD_FROM_FILE_TITLE,
} from '../../constants/translationLabels/common';

export const UploadFile = (props) => {
    const { t } = useTranslation('common');
    const [isHideRules, setIsHideRules] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef();
    const {
        group: { id },
        open,
        handleCloseDialogFile,
    } = props;

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmission = () => {
        setLoadingService(true);
        uploadStudentsToGroupFile(selectedFile, id);
        fileInputRef.current.value = '';
        setSelectedFile(null);
    };

    const setDisabledSendButton = () => {
        return selectedFile === null;
    };
    const buttonTitle = selectedFile ? selectedFile.name : t(SELECT_FILE);
    return (
        <CustomDialog
            // title={t(COMMON_UPLOAD_FROM_FILE_TITLE)}
            open={open}
            onClose={handleCloseDialogFile}
            buttons={[
                dialogUploadButton(handleSubmission, setDisabledSendButton()),
                dialogCloseButton(handleCloseDialogFile),
            ]}
        >
            <div className="upload-dialog">
                {isHideRules && (
                    <div className="upload-title">
                        <div> * This File has to be in csv format.</div>
                        <div>
                            * Each line of the file should consist of four fields, separated by
                            commas.
                        </div>
                        <div>* First line of the file is a header.</div>
                    </div>
                )}
                <div className="upload-example-btn">
                    <div className="upload-example">Example of file</div>
                    <HelpOutlineIcon
                        className="upload-button"
                        onClick={() => setIsHideRules(!isHideRules)}
                    />
                </div>
                <div className="upload-text-file">
                    <div> surname,name,patronymic,email</div>
                    <div> example,example,example,example@gmail.com</div>
                </div>
                <label htmlFor="file-upload" className="upload-file">
                    <input
                        id="file-upload"
                        type="file"
                        accept=".txt, .csv"
                        onChange={changeHandler}
                        ref={fileInputRef}
                        className="upload-input"
                    />
                    <BackupIcon></BackupIcon>
                    <div className="upload-text">{t(buttonTitle)}</div>
                </label>
            </div>
        </CustomDialog>
    );
};
