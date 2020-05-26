import { connect } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import './SemesterPage.scss';
import Card from '../../share/Card/Card';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import ConfirmDialog from '../../share/modals/dialog';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import SemesterForm from '../../components/SemesterForm/SemesterForm';
import {
    clearSemesterService,
    getDisabledSemestersService,
    handleSemesterService,
    removeSemesterCardService,
    selectSemesterService,
    setDisabledSemestersService,
    setEnabledSemestersService,
    showAllSemestersService
} from '../../services/semesterService';
import { disabledCard } from '../../constants/disabledCard';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';

const SemesterPage = props => {
    const { t } = useTranslation('formElements');
    const [open, setOpen] = useState(false);
    const [semesterId, setSemesterId] = useState(-1);
    const [term, setTerm] = useState('');
    const { isSnackbarOpen, snackbarType, snackbarMessage } = props;

    useEffect(() => showAllSemestersService(), []);
    useEffect(() => {
        getDisabledSemestersService();
    }, []);

    const [hideDialog, setHideDialog] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const SearchChange = setTerm;
    const handleFormReset = () => clearSemesterService();
    const submit = values => handleSemesterService(values);
    const handleEdit = semesterId => selectSemesterService(semesterId);

    const searchArr = ['year', 'description', 'startDay', 'endDay'];
    const visibleItems = disabled
        ? search(props.disabledSemesters, term, searchArr)
        : search(props.semesters, term, searchArr);

    const handleClickOpen = semesterId => {
        setSemesterId(semesterId);
        setOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        handleSnackbarCloseService();
    };

    const handleClose = semesterId => {
        setOpen(false);
        if (!semesterId) return;
        if (hideDialog) {
            if (disabled) {
                const semester = props.disabledSemesters.find(
                    semester => semester.id === semesterId
                );
                setEnabledSemestersService(semester);
            } else {
                const semester = props.semesters.find(
                    semester => semester.id === semesterId
                );
                setDisabledSemestersService(semester);
            }
        } else {
            removeSemesterCardService(semesterId);
        }
        setHideDialog(null);
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
    };

    return (
        <>
            <ConfirmDialog
                cardId={semesterId}
                whatDelete={'semester'}
                isHide={hideDialog}
                open={open}
                onClose={handleClose}
            />
            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel
                        SearchChange={SearchChange}
                        showDisabled={showDisabledHandle}
                    />
                    {disabled ? (
                        ''
                    ) : (
                        <SemesterForm
                            className="form"
                            onSubmit={submit}
                            onReset={handleFormReset}
                        />
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleItems.length === 0 && (
                        <NotFound name={t('semestry_label')} />
                    )}
                    {visibleItems.map((semester, index) => {
                        const sem_days = [];
                        semester.semester_days.forEach(day =>
                            sem_days.push(t(`common:day_of_week_${day}`))
                        );
                        return (
                            <Card
                                key={index}
                                class={`semester-card done-card ${
                                    semester.currentSemester ? 'current' : ''
                                }`}
                            >
                                <div className="cards-btns">
                                    {!disabled ? (
                                        <>
                                            <GiSightDisabled
                                                className="svg-btn copy-btn"
                                                title={t('common:set_disabled')}
                                                onClick={() => {
                                                    setHideDialog(
                                                        disabledCard.HIDE
                                                    );
                                                    handleClickOpen(
                                                        semester.id
                                                    );
                                                }}
                                            />
                                            <FaEdit
                                                className="svg-btn edit-btn"
                                                title={t('edit_title')}
                                                onClick={() =>
                                                    handleEdit(semester.id)
                                                }
                                            />
                                        </>
                                    ) : (
                                        <IoMdEye
                                            className="svg-btn copy-btn"
                                            title={t('common:set_enabled')}
                                            onClick={() => {
                                                setHideDialog(
                                                    disabledCard.SHOW
                                                );
                                                handleClickOpen(semester.id);
                                            }}
                                        />
                                    )}
                                    <MdDelete
                                        className="svg-btn delete-btn"
                                        title={t('delete_title')}
                                        onClick={() =>
                                            handleClickOpen(semester.id)
                                        }
                                    />
                                </div>

                                <p className="semester-card__description">
                                    <small>{t('semester_label') + ':'}</small>
                                    <b>{semester.description}</b>
                                    {' ( ' + semester.year + ' )'}
                                </p>
                                <p className="semester-card__description">
                                    <b>
                                        {semester.startDay} - {semester.endDay}
                                    </b>
                                </p>
                                <p className="semester-card__description">
                                    {t('common:days_label') + ': '}
                                    {sem_days.join(', ')}
                                </p>
                                <p className="semester-card__description">
                                    {t(
                                        'common:ClassSchedule_management_title'
                                    ) + ': '}
                                    {semester.semester_classes
                                        .map(classItem => {
                                            return classItem.class_name;
                                        })
                                        .join(', ')}
                                </p>
                            </Card>
                        );
                    })}
                </section>
            </div>
            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarClose}
            />
        </>
    );
};
const mapStateToProps = state => ({
    semesters: state.semesters.semesters,
    disabledSemesters: state.semesters.disabledSemesters,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message
});

export default connect(mapStateToProps, {})(SemesterPage);
