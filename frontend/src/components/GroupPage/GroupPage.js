import './GroupPage.scss';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import GroupList from './GroupList';
import Sidebar from './Sidebar';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import AddGroup from "../AddGroupForm/AddGroupForm";

const GroupPage = ({ match }) => {
    const isSnackbarOpen = useSelector(state => state.snackbar.isSnackbarOpen);
    const snackbarMessage = useSelector(state => state.snackbar.message);
    const snackbarType = useSelector(state => state.snackbar.snackbarType);

    const [group, setGroup] = useState({});
    const [searchItem, setSearchItem] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <>
            <div className="group-container">
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