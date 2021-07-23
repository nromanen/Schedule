import React, { useRef } from "react";
import ReactSelect from "react-select";
import { Dialog, DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import i18n from 'i18next';
import '../helper/multiselect.scss'
export const MultiSelect = props => {
    // isOptionSelected sees previous props.value after onChange
    const valueRef = useRef(props.value);
    valueRef.current = props.value;
    const {open}=props;
    const selectAllOption = {
        value: "<SELECT_ALL>",
        label: "All People"
    };

    const isSelectAllSelected = () =>
        valueRef.current.length === props.options.length;

    const isOptionSelected = option =>
        valueRef.current.some(({ value }) => value === option.value) ||
        isSelectAllSelected();

    const getOptions = () => [selectAllOption, ...props.options];

    const getValue = () =>
        isSelectAllSelected() ? [selectAllOption] : props.value;

    const onChange = (newValue, actionMeta) => {
        const { action, option, removedValue } = actionMeta;

        if (action === "select-option" && option.value === selectAllOption.value) {
            props.onChange(props.options, actionMeta);
        } else if (
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

        <Dialog

                disableBackdropClick={true}
                // onClose={handleClose}
                aria-labelledby="confirm-dialog-title"
                open={open}
        >
            {console.log(props)}
            <DialogTitle id="select-dialog" className="confirm-dialog">
        <ReactSelect
            isOptionSelected={isOptionSelected}
            options={getOptions()}
            value={getValue()}
            onChange={onChange}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            isMulti
        />
            </DialogTitle>
            <div className="buttons-container">
                <Button
                    className="dialog-button"
                    variant="contained"
                    color="primary"
                    onClick={props.onCancel}
                >
                    {"Cancel"}
                </Button>
                <Button
                    className="dialog-button"
                    variant="contained"
                    onClick={props.onSentTeachers}
                    disabled={!props.isEnabledSentBtn}
                >
                    {"Sent teachers"}
                </Button>
            </div>
        </Dialog>
    );
};
