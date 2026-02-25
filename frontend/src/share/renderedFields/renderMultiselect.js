import Multiselect from 'multiselect-react-dropdown';
import React, {useEffect} from 'react';

export const RenderMultiselect = ({
                                      input,
                                      options,
                                      hidePlaceholder,
                                      placeholder,
                                      displayValue,
                                      selectedValues,
                                      alwaysDisplayedItem,
                                  }) => {
    useEffect(() => {
        input.onChange([alwaysDisplayedItem]);
    }, [alwaysDisplayedItem.id]);

    const currentIndex = options.findIndex((opt) => opt.id === alwaysDisplayedItem.id);
    const sortedOptions = [
        ...options.slice(currentIndex),
        ...options.slice(0, currentIndex),
    ];

    return (
        <Multiselect
            {...input}
            key={JSON.stringify(input.value)}
            onBlur={() => input.onBlur()}
            onSelect={(e) => input.onChange([...e])}
            onRemove={(e) => input.onChange([...e])}
            options={sortedOptions}
            displayValue={displayValue}
            placeholder={placeholder}
            hidePlaceholder={hidePlaceholder}
            selectedValues={input.value || selectedValues}
            disablePreSelectedValues
            preSelectedValues={input.value || selectedValues}
        />
    );
};
