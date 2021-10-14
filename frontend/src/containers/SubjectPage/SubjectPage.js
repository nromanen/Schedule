import { connect } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import './SubjectPage.scss';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import Card from '../../share/Card/Card';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import { ConfirmDialog } from '../../share/modals/dialog';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import AddSubject from '../../components/AddSubjectForm/AddSubjectForm';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import {
    showAllSubjectsService,
    removeSubjectCardService,
    handleSubjectService,
    selectSubjectService,
    clearSubjectService,
    setEnabledSubjectsService,
    setDisabledSubjectsService,
    getDisabledSubjectsService,
} from '../../services/subjectService';
import { disabledCard } from '../../constants/disabledCard';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';

const SubjectPage = (props) => {
    const { t } = useTranslation('formElements');
    const { isSnackbarOpen, snackbarType, snackbarMessage, disabledSubjects, subjects } = props;

    const [open, setOpen] = useState(false);
    const [subjectId, setSubjectId] = useState(-1);
    const [term, setTerm] = useState('');
    const [hideDialog, setHideDialog] = useState(null);

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        showAllSubjectsService();
        getDisabledSubjectsService();
    }, []);

    const handleFormReset = () => clearSubjectService();
    const visibleSubjects = disabled
        ? search(disabledSubjects, term, ['name'])
        : search(subjects, term, ['name']);
    const SearchChange = setTerm;

    const showConfirmDialog = (subjId, disabledStatus) => {
        setHideDialog(disabledStatus);
        setSubjectId(subjId);
        setOpen(true);
    };

    const acceptConfirmDialog = (id) => {
        setOpen(false);
        if (!id) return;
        if (hideDialog) {
            if (disabled) {
                const group = disabledSubjects.find((subject) => subject.id === subjectId);
                setEnabledSubjectsService(group);
            } else {
                const group = subjects.find((subject) => subject.id === subjectId);
                setDisabledSubjectsService(group);
            }
        } else {
            removeSubjectCardService(subjectId);
        }
        setHideDialog(null);
    };

    const showDisabledHandle = () => {
        setDisabled((prev) => !prev);
    };
    const handleSnackbarClose = () => {
        handleSnackbarCloseService();
    };
    return (
        <>
            <NavigationPage name={navigationNames.SUBJECT_PAGE} val={navigation.SUBJECTS} />
            <ConfirmDialog
                isHide={hideDialog}
                cardId={subjectId}
                whatDelete="subject"
                open={open}
                onClose={acceptConfirmDialog}
            />
            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={showDisabledHandle} />
                    {disabled ? (
                        ''
                    ) : (
                        <AddSubject
                            className="form"
                            onSubmit={handleSubjectService}
                            onReset={handleFormReset}
                        />
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleSubjects.length === 0 && <NotFound name={t('subject_y_label')} />}
                    {visibleSubjects.map((subject) => (
                        <Card key={subject.id} additionClassName="subject-card done-card">
                            <h2 className="subject-card__name">{subject.name}</h2>
                            <div className="cards-btns">
                                {disabled ? (
                                    <GiSightDisabled
                                        className="svg-btn copy-btn"
                                        title={t('common:set_enabled')}
                                        onClick={() => {
                                            showConfirmDialog(subject.id, disabledCard.SHOW);
                                        }}
                                    />
                                ) : (
                                    <>
                                        <IoMdEye
                                            className="svg-btn copy-btn"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                showConfirmDialog(subject.id, disabledCard.HIDE);
                                            }}
                                        />
                                        <FaEdit
                                            className="svg-btn edit-btn"
                                            title={t('edit_title')}
                                            onClick={() => selectSubjectService(subject.id)}
                                        />
                                    </>
                                )}

                                <MdDelete
                                    className="svg-btn delete-btn"
                                    title={t('delete_title')}
                                    onClick={() => showConfirmDialog(subject.id)}
                                />
                            </div>
                        </Card>
                    ))}
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
const mapStateToProps = (state) => ({
    subjects: state.subjects.subjects,
    disabledSubjects: state.subjects.disabledSubjects,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
});

export default connect(mapStateToProps, {})(SubjectPage);
