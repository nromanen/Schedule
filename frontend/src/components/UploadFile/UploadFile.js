import React, { useState } from 'react';
import { uploadStudentsToGroupFile } from '../../services/uploadFile';
import './UploadFile.scss';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import { CustomDialog } from '../../share/DialogWindows';
import { setLoadingService } from '../../services/loadingService';

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
            onClick={handleCloseDialogFile}
            buttons={
                <>
                    <Button
                        className="dialog-button"
                        variant="contained"
                        onClick={handleSubmission}
                        color="primary"
                        title={t('common:upload_title')}
                        disabled={setDisabledSendButton()}
                    >
                        {t('common:upload_title')}
                    </Button>
                    <Button
                        className="dialog-button"
                        variant="contained"
                        onClick={handleCloseDialogFile}
                        color="primary"
                        title={t('close_label')}
                    >
                        {t('close_label')}
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
                    <p>{`${t('common:name_label')}: ${selectedFile.name}`}</p>
                    <p>{`${t('common:type_label')}: ${selectedFile.type}`}</p>
                    <p>{`${t('common:byte_size_label')}: ${selectedFile.size}`}</p>
                    {/* <p>{`${t('common:last_modified_date')}: ${selectedFile.lastModifiedDate.toLocaleDateString()}`}</p> */}
                </div>
            ) : (
                <p>{t('common:select_file_label')}</p>
            )}
        </CustomDialog>
    );
};
