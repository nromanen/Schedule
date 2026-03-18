import React from 'react';
import './GroupPage.scss';
import SearchPanel from '../../share/SearchPanel/SearchPanel';

const Sidebar = (props) => {
    const { setIsDisabled, isDisabled, setSearchItem, children } = props;

    return (
        <aside className="group-aside">
            <SearchPanel
                SearchChange={setSearchItem}
                showDisabled={() => setIsDisabled((prev) => !prev)}
            />
            <div style={{ display: isDisabled ? 'none' : 'block' }}>{children}</div>
        </aside>
    );
};

export default Sidebar;
