
// import Multiselect from 'react-widgets/Multiselect'
// import React from 'react'
// export const renderMultiselect = ({ input, data, valueField, textField, placeholder,
//                                       meta: { touched, invalid, error } }) =>
//     <>
//         <Multiselect {...input}
//                      onBlur={() => input.onBlur()}
//                      value={input.value || []}
//                      data={data}
//                      valueField={valueField}
//                      textField={textField}
//                      placeholder={placeholder}
//         />
//
//     </>
import Multiselect from 'multiselect-react-dropdown'
import React, { useEffect } from 'react';
export let RenderMultiselect = ({ input, options, hidePlaceholder, placeholder,
                                      displayValue,selectedValues,alwaysDisplayedItem,
                                      meta: { touched, invalid, error } }) => {

useEffect(()=> {
    input.onChange([alwaysDisplayedItem])
    console.log(alwaysDisplayedItem);
},[alwaysDisplayedItem.id]);
    return(<>

        <Multiselect {...input}
                     onBlur={() => input.onBlur()}
                     onSelect={(e) => input.onChange([...e])}
                     onRemove={(e) => input.onChange([...e])}
            // selectedValues={input.value || []}
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