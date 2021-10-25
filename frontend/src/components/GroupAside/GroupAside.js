import React from 'react';
import AddGroup from '../AddGroupForm/AddGroupForm';
import SearchPanel from '../../share/SearchPanel/SearchPanel';

const GroupAside = (props) => {
    const {
        asyncCreateGroup,
        asyncUpdateGroup,
        asyncClearGroup,
        setIsDisabled,
        isDisabled,
        setTerm,
    } = props;
    const SearchChange = setTerm;

    const onSubmitGroupForm = (data) => {
        return !data.id ? asyncCreateGroup(data) : asyncUpdateGroup(data);
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
                    onReset={() => asyncClearGroup()}
                />
            )}
        </aside>
    );
};

export default GroupAside;
