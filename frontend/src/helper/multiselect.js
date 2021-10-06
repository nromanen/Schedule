import React, { useRef } from 'react';
import ReactSelect from 'react-select';
import { Dialog, DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import i18n from 'i18next';
import './multiselect.scss';
import { useTranslation } from 'react-i18next';

export const MultiSelect = (props) => {
    const { t } = useTranslation('common');
    const valueRef = useRef(props.value);
    valueRef.current = props.value;
    const { open, defaultSemester, semesters } = props;

    const selectAllOption = {
        value: '<SELECT_ALL>',
        label: t('all_teachers'),
    };

    const isSelectAllSelected = () => valueRef.current.length === props.options.length;

    const isOptionSelected = (option) =>
        valueRef.current.some(({ value }) => value === option.value) || isSelectAllSelected();

    const getOptions = () => [selectAllOption, ...props.options];

    const getValue = () => (isSelectAllSelected() ? [selectAllOption] : props.value);

    const onChange = (newValue, actionMeta) => {
        const { action, option, removedValue } = actionMeta;

        if (action === 'select-option' && option.value === selectAllOption.value) {
            props.onChange(props.options, actionMeta);
        } else if (
            (action === 'deselect-option' && option.value === selectAllOption.value) ||
            (action === 'remove-value' && removedValue.value === selectAllOption.value)
        ) {
            props.onChange([], actionMeta);
        } else if (actionMeta.action === 'deselect-option' && isSelectAllSelected()) {
            props.onChange(
                props.options.filter(({ value }) => value !== option.value),
                actionMeta,
            );
        } else {
            props.onChange(newValue || [], actionMeta);
        }
    };
    const handleChange = (newValue, actionMeta) => {
        props.onChangeSemesterValue(newValue);
    };

    return (
        <Dialog
            id="select-dialog"
            disableBackdropClick
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="select-dialog-title" className="confirm-dialog">
                <div className="teacher-semester">
                    <span>{`${t('schedule_for_semester')}:`}</span>
                    <Select
                        defaultValue={defaultSemester}
                        options={semesters}
                        onChange={handleChange}
                    />

                    <ReactSelect
                        classname="teacher"
                        isOptionSelected={isOptionSelected}
                        options={getOptions()}
                        value={getValue()}
                        onChange={onChange}
                        hideSelectedOptions={false}
                        closeMenuOnSelect={false}
                        isMulti
                        placeholder={t('choose_teachers')}
                    />
                </div>
            </DialogTitle>
            <div className="buttons-container">
                <Button
                    className="dialog-button"
                    variant="contained"
                    color="primary"
                    onClick={props.onCancel}
                >
                    {t('cancel_schedule')}
                </Button>
                <Button
                    className="dialog-button"
                    variant="contained"
                    color="primary"
                    onClick={props.onSentTeachers}
                    disabled={!props.isEnabledSentBtn}
                >
                    {t('sent_schedule')}
                </Button>
            </div>
        </Dialog>
    );
};
