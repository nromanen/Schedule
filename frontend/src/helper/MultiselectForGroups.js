import React, { useRef } from 'react';
import ReactSelect from 'react-select';
import { Dialog, DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import './multiselect.scss';
import { useTranslation } from 'react-i18next';
import {
    CHOOSE_GROUPS,
    CONFIRM_GROUPS,
    CANCEL_SCHEDULE,
    ALL_GROUPS,
} from '../constants/translationLabels/common';

export const MultiselectForGroups = (props) => {
    const { t } = useTranslation('common');
    const valueRef = useRef(props.value);
    valueRef.current = props.value;
    const { open, onClose, onCancel } = props;

    const selectAllOption = {
        value: '<SELECT_ALL>',
        label: t(ALL_GROUPS),
    };

    const isSelectAllSelected = () => {
        if (props.options !== undefined && valueRef.current) {
            return valueRef.current.length === props.options.length;
        }
    };
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
    return (
        <Dialog
            id="select-dialog"
            disableBackdropClick
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="select-dialog-title" className="confirm-dialog">
                <ReactSelect
                    isOptionSelected={isOptionSelected}
                    options={getOptions()}
                    value={getValue()}
                    onChange={onChange}
                    hideSelectedOptions={false}
                    closeMenuOnSelect={false}
                    isMulti
                    placeholder={t(CHOOSE_GROUPS)}
                />
            </DialogTitle>
            <div className="buttons-container">
                <Button
                    className="dialog-button"
                    variant="contained"
                    color="primary"
                    onClick={onClose}
                >
                    {t(CONFIRM_GROUPS)}
                </Button>
                <Button
                    className="dialog-button"
                    variant="contained"
                    color="primary"
                    onClick={onCancel}
                >
                    {t(CANCEL_SCHEDULE)}
                </Button>
            </div>
        </Dialog>
    );
};
