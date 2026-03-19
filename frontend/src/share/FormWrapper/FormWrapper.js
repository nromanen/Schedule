import React from 'react';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import Card from '../Card/Card';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import { SAVE_BUTTON_LABEL } from '../../constants/translationLabels/formElements';

const FormWrapper = ({
                         title,
                         onSubmit,
                         onReset,
                         isDirty,
                         isSubmitting,
                         entityId,
                         children,
                     }) => {
    const { t } = useTranslation('formElements');

    return (
        <Card additionClassName="form-card">
            <h2 style={{ textAlign: 'center' }}>{title}</h2>
            <form onSubmit={onSubmit}>
                {children}
                <div className="form-buttons-container form-btns">
                    <Button
                        variant="contained"
                        color="primary"
                        className="buttons-style"
                        disabled={!isDirty || isSubmitting}
                        type="submit"
                    >
                        {t(SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        className="buttons-style"
                        disabled={setDisableButton(!isDirty, isSubmitting, entityId)}
                        onClick={onReset}
                    >
                        {getClearOrCancelTitle(entityId, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default FormWrapper;