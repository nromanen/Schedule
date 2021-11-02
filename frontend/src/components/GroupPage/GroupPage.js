import './GroupPage.scss';
import React, { useState } from 'react';
import GroupList from './GroupList';
import GroupSidebar from './GroupSidebar';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import AddGroup from '../../containers/GroupPage/GroupForm';

const GroupPage = (props) => {
    const { isSnackbarOpen, snackbarMessage, snackbarType, match, ...rest } = props;

    const [searchItem, setSearchItem] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <>
            <div className="cards-container">
                <GroupSidebar
                    isDisabled={isDisabled}
                    setIsDisabled={setIsDisabled}
                    setSearchItem={setSearchItem}
                >
                    <AddGroup />
                </GroupSidebar>
                <div className="group-wrapper group-list">
                    <GroupList
                        match={match}
                        searchItem={searchItem}
                        isDisabled={isDisabled}
                        {...rest}
                    />
                </div>
            </div>
            <SnackbarComponent
                type={snackbarType}
                isOpen={isSnackbarOpen}
                message={snackbarMessage}
                handleSnackbarClose={handleSnackbarCloseService}
            />
        </>
    );
};

export default GroupPage;
