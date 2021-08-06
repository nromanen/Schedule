import { connect } from 'react-redux'
import React, { useEffect } from 'react'
import { Field, reduxForm } from 'redux-form'
import Button from '@material-ui/core/Button'
import { useTranslation}  from 'react-i18next'


import Card from '../../share/Card/Card'
import { DEPARTMENT_FORM} from '../../constants/reduxForms';
import renderTextField from '../../share/renderedFields/input'
import { required, uniqueSubject, maxLengthValue, uniqueDepartment } from '../../validation/validateFields';

const AddDepartment = props => {
    const { t } = useTranslation('formElements');
    const {handleSubmit,clear,department,pristine,submitting,editDepartment}=props;
    useEffect(() => {
        if (department&&editDepartment) {
            if (department.id) {
                props.initialize({
                    name: department.name,
                    id: department.id
                });
            } else {
                props.initialize();
            }
        }
    }, [department]);

    return (
        <Card class='form-card subject-form'>
            <h2 style={{ textAlign: 'center' }}>
                {t('department_y_label')}
            </h2>
            <form onSubmit={handleSubmit}>
                <Field
                    className='form-field'
                    name='name'
                    component={renderTextField}
                    label={t('department_add_label')+':'}
                    validate={[required, uniqueDepartment, maxLengthValue]}
                />
                <div className='form-buttons-container subject-btns'>
                    <Button
                        variant='contained'
                        color='primary'
                        className='buttons-style '
                        disabled={pristine || submitting}
                        type='submit'>
                        {t('save_button_label')}
                    </Button>
                    <Button
                        type='button'
                        variant='contained'
                        className='buttons-style'
                        disabled={pristine || submitting}
                        onClick={clear}
                        >
                        {t('clear_button_label')}
                    </Button>
                </div>
            </form>
        </Card>
    )
}

const mapStateToProps = state => ({
    department:state.departments.department
})

export default connect(mapStateToProps)(
    reduxForm({
        form: DEPARTMENT_FORM
    })(AddDepartment)
)
