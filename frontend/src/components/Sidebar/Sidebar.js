import React from 'react';
import './Sidebar.scss';
import SearchPanel from '../../share/SearchPanel/SearchPanel';

export const Sidebar = (props) => {
    const { toggleDisabled, isDisabled, setSearchDisabled, children, searchName } = props;

    return (
        <aside className="sidebar">
            <SearchPanel
                SearchChange={setSearchDisabled}
                showDisabled={() => toggleDisabled(!isDisabled)}
            />
            <div>{searchName}</div>
            {!isDisabled && children}
        </aside>
    );
};

export default Sidebar;
