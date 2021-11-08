import React from 'react';
import SearchPanel from '../SearchPanel/SearchPanel';

export const Sidebar = (props) => {
    const { toggleDisabled, isDisabled, setSearchName, children, searchName } = props;

    return (
        <aside className="sidebar">
            <SearchPanel
                SearchChange={setSearchName}
                showDisabled={() => toggleDisabled(!isDisabled)}
            />
            <div>{searchName}</div>
            {!isDisabled && children}
        </aside>
    );
};
