import React from 'react';
import AddGroup from '../../containers/GroupPage/GroupForm';
import SearchPanel from '../../share/SearchPanel/SearchPanel';

const GroupSidebar = (props) => {
    const { clearGroupStart, setIsDisabled, isDisabled, setTerm } = props;

    return (
        <aside className="search-list__panel">
            <SearchPanel
                SearchChange={setTerm}
                showDisabled={() => setIsDisabled((prev) => !prev)}
            />
            {!isDisabled && <AddGroup className="form" onReset={() => clearGroupStart()} />}
        </aside>
    );
};

export default GroupSidebar;
