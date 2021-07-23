import React, { useRef } from "react";
import ReactSelect from "react-select";
import { Dialog, DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import i18n from 'i18next';
import '../helper/multiselect.scss'
import { useTranslation } from 'react-i18next';
export const MultiSelect = props => {
    const { t } = useTranslation('common');
    const valueRef = useRef(props.value);
    valueRef.current = props.value;
    const {open}=props;

    const selectAllOption = {
        value: "<SELECT_ALL>",
        label: t('all_teachers')
    };

    // const selectNothingOption = {
    //     value: "<SELECT_NOTHING>",
    //     label: "Nothing Teachers"
    // };

    const isSelectAllSelected = () =>
        valueRef.current.length === props.options.length;

    const isOptionSelected = option =>
        valueRef.current.some(({ value }) => value === option.value) ||
        isSelectAllSelected();

    const getOptions = () => [selectAllOption, ...props.options];

    const getValue = () =>
        isSelectAllSelected() ? [selectAllOption] : props.value;

    const onChange = (newValue, actionMeta) => {
        console.log("actionMeta",actionMeta)
        const { action, option, removedValue } = actionMeta;

        if (action === "select-option" && option.value === selectAllOption.value) {
            props.onChange(props.options, actionMeta);
        }
        // else if(action === "select-option" && option.value === selectNothingOption.value){
        //     props.onChange([], actionMeta);
        // }
        else if (
            (action === "deselect-option" &&
                option.value === selectAllOption.value) ||
            (action === "remove-value" &&
                removedValue.value === selectAllOption.value)
        ) {
            props.onChange([], actionMeta);
        } else if (
            actionMeta.action === "deselect-option" &&
            isSelectAllSelected()
        ) {
            props.onChange(
                props.options.filter(({ value }) => value !== option.value),
                actionMeta
            );
        } else {
            props.onChange(newValue || [], actionMeta);
        }
    };

    return (

        <Dialog id="select-dialog"

                disableBackdropClick={true}
                // onClose={handleClose}
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
            placeholder={t('choose_teachers')}
        />
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
                    onClick={props.onSentTeachers}
                    disabled={!props.isEnabledSentBtn}
                >
                    {t('sent_schedule')}
                </Button>
            </div>
        </Dialog>
    );
};
