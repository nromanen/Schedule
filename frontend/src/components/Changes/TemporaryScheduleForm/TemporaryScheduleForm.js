import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../../share/Card/Card';
import { Field, reduxForm } from 'redux-form';
import { TEMPORARY_SCHEDULE_FORM } from '../../../constants/reduxForms';
import Button from '@material-ui/core/Button';
import { setUniqueErrorService } from '../../../services/lessonService';
import renderTextField from '../../../share/renderedFields/input';

let TemporaryScheduleForm = props => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, reset, submitting } = props;

    const temporarySchedule = props.temporarySchedule;
    const temporaryScheduleId = temporarySchedule?.id;

    const teacherId = props.teacherId;

    useEffect(() => {
        if (temporaryScheduleId) {
            initializeFormHandler(temporarySchedule);
        } else {
            props.initialize();
        }
    }, [temporaryScheduleId]);

    const initializeFormHandler = temporarySchedule => {
        props.initialize({});
    };

    return (
        <Card class="form-card">
            {teacherId ? (
                <>
                    <h2 className="form-title under-line">
                        {temporaryScheduleId
                            ? t('edit_title')
                            : t('create_title')}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <Field component={renderTextField} />
                        <div className="form-buttons-container">
                            <Button
                                className="buttons-style"
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={pristine || submitting}
                            >
                                {t('save_button_label')}
                            </Button>
                            <Button
                                className="buttons-style"
                                type="button"
                                variant="contained"
                                disabled={pristine || submitting}
                                onClick={() => {
                                    reset();
                                    setUniqueErrorService(null);
                                    props.onSetSelectedCard(null);
                                }}
                            >
                                {t('clear_button_label')}
                            </Button>
                        </div>
                    </form>
                </>
            ) : (
                <h2 className="form-title">Teacher is not selected</h2>
            )}
        </Card>
    );
};

TemporaryScheduleForm = reduxForm({
    form: TEMPORARY_SCHEDULE_FORM
})(TemporaryScheduleForm);

export default TemporaryScheduleForm;
