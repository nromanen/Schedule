import './GroupPage.scss';
import React, { useState } from 'react';
import GroupList from './GroupList';
import Sidebar from './Sidebar';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import AddGroup from '../../containers/GroupPage/GroupForm';

const GroupPage = (props) => {
    const { isSnackbarOpen, snackbarMessage, snackbarType, match, ...rest } = props;

    const [group, setGroup] = useState({});
    const [searchItem, setSearchItem] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <>
            <div className="cards-container">
                <div className="group-sidebar">
                    <Sidebar
                        isDisabled={isDisabled}
                        setIsDisabled={setIsDisabled}
                        setSearchItem={setSearchItem}
                    >
                        <AddGroup group={group} setGroup={setGroup} />
                    </Sidebar>
                </div>
                <div className="group-wrapper">
                    <GroupList
                        match={match}
                        setGroup={setGroup}
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
