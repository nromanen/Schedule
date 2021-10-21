import React, { useState } from 'react';
import './UploadFile.scss';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { uploadStudentsToGroupFile } from '../../services/uploadFile';
import { CustomDialog } from '../../share/DialogWindows';
import { setLoadingService } from '../../services/loadingService';
import { CLOSE_LABEL } from '../../constants/translationLabels/formElements';
import {
    COMMON_NAME_LABEL,
    COMMON_TYPE_LABEL,
    COMMON_BYTE_SIZE_LABEL,
    COMMON_SELECT_FILE_LABEL,
    COMMON_UPLOAD_TITLE,
} from '../../constants/translationLabels/common';

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
        <CustomDialog
            title="Upload file"
            open={open}
            onClose={handleCloseDialogFile}
            buttons={
                <>
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
                    <Button
                        className="dialog-button"
                        variant="contained"
                        onClick={handleCloseDialogFile}
                        color="primary"
                        title={t(CLOSE_LABEL)}
                    >
                        {t(CLOSE_LABEL)}
                    </Button>
                </>
            }
        >
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
                </div>
            ) : (
                <p>{t(COMMON_SELECT_FILE_LABEL)}</p>
            )}
        </CustomDialog>
    );
};
