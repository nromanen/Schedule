import './GroupPage.scss';
import React, { useState } from 'react';
import GroupList from './GroupList';
import GroupSidebar from './GroupSidebar';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';

const GroupPage = (props) => {
    const { isSnackbarOpen, snackbarMessage, snackbarType, match, ...rest } = props;

    const [term, setTerm] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <>
            <div className="cards-container">
                <GroupSidebar
                    {...rest}
                    setTerm={setTerm}
                    isDisabled={isDisabled}
                    setIsDisabled={setIsDisabled}
                />
                <div className="group-wrapper group-list">
                    <GroupList match={match} term={term} isDisabled={isDisabled} {...rest} />
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
