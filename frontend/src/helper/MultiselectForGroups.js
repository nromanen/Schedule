import React, { useRef } from 'react';
import ReactSelect from 'react-select';
import Button from '@material-ui/core/Button';
import './multiselect.scss';
import { useTranslation } from 'react-i18next';
import {
    CHOOSE_GROUPS,
    CONFIRM_GROUPS,
    CANCEL_BUTTON_LABEL,
    ALL_GROUPS,
} from '../constants/translationLabels/common';
import { CustomDialog } from '../share/DialogWindows';

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
        return false;
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
        <CustomDialog
            id="select-dialog"
            title=""
            aria-labelledby="confirm-dialog-title"
            open={open}
            onClose={onClose}
            buttons={
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
                        {t(CANCEL_BUTTON_LABEL)}
                    </Button>
                </div>
            }
        >
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
        </CustomDialog>
    );
};
