import React, { useState } from 'react';
import { uploadStudentsToGroupFile } from '../../services/uploadFile';
import { Dialog, DialogTitle } from '@material-ui/core';
import './UploadFile.scss';
import { FaWindowClose } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
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
        <Dialog disableBackdropClick aria-labelledby="confirm-dialog-title" open={open}>
            <DialogTitle className="upload-dialog" id="confirm-dialog-title">
                <FaWindowClose
                    title={t('close_label')}
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
                            <p>{`${t('common:name_label')}: ${selectedFile.name}`}</p>
                            <p>{`${t('common:type_label')}: ${selectedFile.type}`}</p>
                            <p>{`${t('common:byte_size_label')}: ${selectedFile.size}`}</p>
                            <p>{`${t(
                                'common:last_modified_date',
                            )}: ${selectedFile.lastModifiedDate.toLocaleDateString()}`}</p>
                        </div>
                    ) : (
                        <p>{t('common:select_file_label')}</p>
                    )}
                    <div>
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
                    </div>
                </div>
            </DialogTitle>
        </Dialog>
    );
};
