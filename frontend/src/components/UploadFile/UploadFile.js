import React, { useState } from 'react';
import { uploadStudentsToGroupFile } from '../../services/uploadFile';
import { Dialog, DialogTitle } from '@material-ui/core';
import './UploadFile.scss';
import { FaWindowClose } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { setLoadingService } from '../../services/loadingService';
import { CLOSE_LABEL } from '../../constants/translationLabels';
import {
    COMMON_NAME_LABEL,
    COMMON_TYPE_LABEL,
    COMMON_BYTE_SIZE_LABEL,
    COMMON_SELECT_FILE_LABEL,
    COMMON_UPLOAD_TITLE,
} from '../../constants/translationLabels/common.js';

export const UploadFile = (props) => {
    const { t } = useTranslation('formElements');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = React.useRef();
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
    return (
        <Dialog disableBackdropClick aria-labelledby="confirm-dialog-title" open={open}>
            <DialogTitle className="upload-dialog" id="confirm-dialog-title">
                <FaWindowClose
                    title={t(CLOSE_LABEL)}
                    className="close-dialog"
                    variant="contained"
                    onClick={handleCloseDialogFile}
                />
                <div>
                    <input
                        type="file"
                        name="file"
                        accept=".txt, .csv"
                        onChange={changeHandler}
                        ref={fileInputRef}
                    />
                    {selectedFile ? (
                        <div>
                            <p>{`${t(COMMON_NAME_LABEL)}: ${selectedFile.name}`}</p>
                            <p>{`${t(COMMON_TYPE_LABEL)}: ${selectedFile.type}`}</p>
                            <p>{`${t(COMMON_BYTE_SIZE_LABEL)}: ${selectedFile.size}`}</p>
                            {/* <p>{`${t('common:last_modified_date')}: ${selectedFile.lastModifiedDate.toLocaleDateString()}`}</p> */}
                        </div>
                    ) : (
                        <p>{t(COMMON_SELECT_FILE_LABEL)}</p>
                    )}
                    <div>
                        <Button
                            className="dialog-button"
                            variant="contained"
                            onClick={handleSubmission}
                            color="primary"
                            title={t(COMMON_UPLOAD_TITLE)}
                            disabled={setDisabledSendButton()}
                        >
                            {t(COMMON_UPLOAD_TITLE)}
                        </Button>
                    </div>
                </div>
            </DialogTitle>
        </Dialog>
    );
};
