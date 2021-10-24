import './GroupPage.scss';
import '../../router/Router.scss';
import React, { useState } from 'react';
import GroupList from '../GroupList/GroupList';
import GroupAside from '../GroupAside/GroupAside';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { navigation, navigationNames } from '../../constants/navigation';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import NavigationPage from '../Navigation/NavigationPage';

const GroupPage = (props) => {
    const { isSnackbarOpen, snackbarMessage, snackbarType, match, ...rest } = props;

    const [term, setTerm] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);

    return (
        <>
            <NavigationPage name={navigationNames.GROUP_LIST} val={navigation.GROUPS} />
            <div className="cards-container">
                <GroupAside
                    match={match}
                    setTerm={setTerm}
                    isDisabled={isDisabled}
                    setIsDisabled={setIsDisabled}
                />
                <div className="group-wrapper group-list">
                    <GroupList term={term} isDisabled={isDisabled} {...rest} />
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
