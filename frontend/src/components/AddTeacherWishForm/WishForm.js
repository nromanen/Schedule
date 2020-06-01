import React, { useEffect } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { required } from '../../validation/validateFields';
import Button from '@material-ui/core/Button';
import renderSelectField from '../../share/renderedFields/select';
import { TEACHER_WISH_FORM } from '../../constants/reduxForms';
import { useTranslation } from 'react-i18next';

let WishForm = props => {
    const { t } = useTranslation('formElements');

    const { handleSubmit, classScheduler, pristine, submitting, reset } = props;

    const class_on_day = [];

    if (classScheduler.length > 0) {
        classScheduler.map(classSchedulerOne => {
            class_on_day.push(classSchedulerOne.class_name);
        });
    }

    const days_of_week = [
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
        'SUNDAY'
    ];

    const wishOne = props.wish;
    const wishDays = wishOne.day_of_week;

    useEffect(() => {
        if (wishDays) {
            initializeFormWish(wishOne);
        } else {
            props.initialize();
        }
    }, [wishDays]);

    const initializeFormWish = wishOne => {
        props.initialize({
            day_of_week: wishOne.day_of_week,
            evenOdd: wishOne.evenOdd
        });

        const classStats = [];
        wishOne.class_status.map(classStatus => {
            classStats.push(classStatus);
        });

        for (let i = 0; i < classStats.length; i++) {
            props.change(
                `class_number${classStats[i].class_name}`,
                `${classStats[i].status}`
            );
        }
    };

    return (
        <form className="wish-form" onSubmit={handleSubmit}>
            <Field
                name="day_of_week"
                className="week-days"
                component={renderSelectField}
                label={t('teacher_wish_day')}
                type="text"
                validate={[required]}
                disabled
            >
                <option />
                {days_of_week.map((day_of_week, index) => (
                    <option key={index} value={`${day_of_week}`}>
                        {t(`common:day_of_week_${day_of_week}`)}
                    </option>
                ))}
            </Field>
            {class_on_day.map(class_number => (
                <Field
                    key={class_number}
                    name={`class_number${class_number}`}
                    component={renderSelectField}
                    validate={[required]}
                    label={`${t(
                        'teacher_wish_class_number'
                    )}: ${class_number}`}
                >
                    <option />
                    <option value={'OK'}>
                        {t('common:teacher_wish_class_status_OK')}
                    </option>
                    <option value={'GOOD'}>
                        {t('common:teacher_wish_class_status_GOOD')}
                    </option>
                    <option value={'BAD'}>
                        {t('common:teacher_wish_class_status_BAD')}
                    </option>
                </Field>
            ))}
            <div className="form-buttons-container wish-margin-top">
                <Button
                    className="buttons-style"
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={pristine || submitting}
                >
                    {t('save_button_label')}
                </Button>
                <Button
                    className="buttons-style"
                    variant="contained"
                    type="button"
                    disabled={pristine || submitting}
                    onClick={() => {
                        reset();
                    }}
                >
                    {t('clear_button_label')}
                </Button>
            </div>
        </form>
    );
};
const mapStateToProps = state => ({ wish: state.teachersWish.wish });

WishForm = reduxForm({
    form: TEACHER_WISH_FORM
})(WishForm);

export default connect(mapStateToProps)(WishForm);
