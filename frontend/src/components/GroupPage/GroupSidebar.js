import React from 'react';
import SearchPanel from '../../share/SearchPanel/SearchPanel';

const GroupSidebar = (props) => {
    const { setIsDisabled, isDisabled, setSearchItem, children } = props;

    return (
        <aside className="search-list__panel">
            <SearchPanel
                SearchChange={setSearchItem}
                showDisabled={() => setIsDisabled((prev) => !prev)}
            />
            {!isDisabled && children}
        </aside>
    );
};

export default GroupSidebar;
