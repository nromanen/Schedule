import React from 'react';
import AddGroup from '../../containers/GroupList/GroupForm';
import SearchPanel from '../../share/SearchPanel/SearchPanel';

const GroupSidebar = (props) => {
    const {
        createGroupStart,
        updateGroupStart,
        clearGroupStart,
        setIsDisabled,
        isDisabled,
        setTerm,
    } = props;

    const SearchChange = setTerm;

    const onSubmitGroupForm = (data) => {
        return !data.id ? createGroupStart(data) : updateGroupStart(data);
    };

    return (
        <aside className="search-list__panel">
            <SearchPanel
                SearchChange={SearchChange}
                showDisabled={() => setIsDisabled((prev) => !prev)}
            />
            {!isDisabled && (
                <AddGroup
                    className="form"
                    onSubmit={onSubmitGroupForm}
                    onReset={() => clearGroupStart()}
                />
            )}
        </aside>
    );
};

export default GroupSidebar;
