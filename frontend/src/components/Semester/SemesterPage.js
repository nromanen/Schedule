import React, { useEffect, useState } from 'react';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import SemesterList from '../../containers/SemesterPage/SemesterList';
import { getGroupsOptionsForSelect } from '../../utils/selectUtils';
import SemesterSidebar from './SemesterSidebar';

const SemesterPage = (props) => {
    const {
        isSnackbarOpen,
        snackbarType,
        snackbarMessage,
        groups,
        semester,
        getAllSemestersItems,
        getDisabledSemestersItems,
        handleSemester,
        setOpenErrorSnackbar,
        setError,
        getAllGroupsItems,
        // it doesnt work, need to finish implement archived functionality
        // getArchivedSemestersItems,
        // archivedSemesters,
    } = props;

    const [term, setTerm] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [archived, setArchived] = useState(false);


    const options = getGroupsOptionsForSelect(groups);
    useEffect(() => {
        getAllGroupsItems();
    }, []);

    useEffect(() => {
        if (disabled) {
            getDisabledSemestersItems();
        } else {
            getAllSemestersItems();
        }
        // it doesnt work, need to finish implement archived functionality
        // getArchivedSemestersItems();
    }, [disabled]);
    // it doesnt work, need to finish implement archeved functionality
    // const showArchivedHandler = () => {
    //     setArchived(!archived);
    //     setDisabled(false);
    //     return !archived ? setScheduleTypeService('archived') : setScheduleTypeService('default');
    // };

    return (
        <>
            <div className="cards-container">
                <SemesterSidebar
                    setTerm={setTerm}
                    archived={archived}
                    disabled={disabled}
                    showDisabledHandle={() => {
                        setDisabled(!disabled);
                        setArchived(false);
                    }}
                    setOpenErrorSnackbar={setOpenErrorSnackbar}
                    handleSemester={handleSemester}
                    semester={semester}
                    options={options}
                    setError={setError}
                />
                <SemesterList
                    term={term}
                    archived={archived}
                    disabled={disabled}
                    options={options}
                />
            </div>
            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarCloseService}
            />
        </>
    );
};

export default SemesterPage;
