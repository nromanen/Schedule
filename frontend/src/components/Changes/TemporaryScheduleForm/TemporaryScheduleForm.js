import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../../share/Card/Card';
import { reduxForm } from 'redux-form';
import { TEMPORARY_SCHEDULE_FORM } from '../../../constants/reduxForms';

let TemporaryScheduleForm = props => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, reset, submitting } = props;

    const temporarySchedule = props.temporarySchedule;
    const temporaryScheduleId = temporarySchedule?.id;

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
            {temporaryScheduleId ? (
                <h2 className="form-title under-line">
                    {temporaryScheduleId ? t('edit_title') : t('create_title')}
                    {t('temporary_schedule_label')}
                </h2>
            ) : (
                ''
            )}
            <form onSubmit={handleSubmit}></form>
        </Card>
    );
};

TemporaryScheduleForm = reduxForm({
    form: TEMPORARY_SCHEDULE_FORM
})(TemporaryScheduleForm);

export default TemporaryScheduleForm;
