import React from 'react';
import { useDispatch } from 'react-redux';
import AddGroup from '../AddGroupForm/AddGroupForm';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import { asyncUpdateGroup, asyncCreateGroup, asyncClearGroup } from '../../actions/groups';

const GroupAside = (props) => {
    const { isDisabled, setIsDisabled, setTerm, match } = props;
    const dispatch = useDispatch();
    const SearchChange = setTerm;

    const onSubmitGroupForm = (data) => {
        return !data.id ? dispatch(asyncCreateGroup(data)) : dispatch(asyncUpdateGroup(data));
    };
    return (
        <aside className="search-list__panel">
            <SearchPanel
                SearchChange={SearchChange}
                showDisabled={() => setIsDisabled((prev) => !prev)}
            />
            {!isDisabled && (
                <AddGroup
                    match={match}
                    className="form"
                    onSubmit={onSubmitGroupForm}
                    onReset={() => dispatch(asyncClearGroup())}
                />
            )}
        </aside>
    );
};

export default GroupAside;
