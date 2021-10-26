import React from 'react';
import AddGroup from '../../containers/Group/GroupForm';
import SearchPanel from '../../share/SearchPanel/SearchPanel';

const GroupSidebar = (props) => {
    const {
        startCreateGroup,
        startUpdateGroup,
        startClearGroup,
        setIsDisabled,
        isDisabled,
        setTerm,
    } = props;

    const SearchChange = setTerm;

    const onSubmitGroupForm = (data) => {
        return !data.id ? startCreateGroup(data) : startUpdateGroup(data);
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
                    onReset={() => startClearGroup()}
                />
            )}
        </aside>
    );
};

export default GroupSidebar;
