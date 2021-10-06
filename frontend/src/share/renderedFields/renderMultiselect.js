import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect } from 'react';

export let RenderMultiselect = ({
                                    input, options, hidePlaceholder, placeholder,
                                    displayValue, selectedValues, alwaysDisplayedItem,
                                    meta: { touched, invalid, error }
                                }) => {

    useEffect(() => {
        input.onChange([alwaysDisplayedItem]);
    }, [alwaysDisplayedItem.id]);
    return (<>

        <Multiselect {...input}
                     onBlur={() => input.onBlur()}
                     onSelect={(e) => input.onChange([...e])}
                     onRemove={(e) => input.onChange([...e])}
                     options={options}
                     displayValue={displayValue}
                     placeholder={placeholder}
                     hidePlaceholder={hidePlaceholder}
                     selectedValues={selectedValues}
                     preSelectedValues={selectedValues}
                     disablePreSelectedValues={true}

        />

    </>);
};