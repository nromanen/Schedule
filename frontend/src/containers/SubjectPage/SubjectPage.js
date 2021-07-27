import { connect } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import './SubjectPage.scss';
import Card from '../../share/Card/Card';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import ConfirmDialog from '../../share/modals/dialog';
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
    getDisabledSubjectsService
} from '../../services/subjectService';
import { disabledCard } from '../../constants/disabledCard';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation } from '../../constants/navigationOrder';

const SubjectPage = props => {
    const { t } = useTranslation('formElements');
    const { isSnackbarOpen, snackbarType, snackbarMessage } = props;

    const [open, setOpen] = useState(false);
    const [subjectId, setSubjectId] = useState(-1);
    const [term, setTerm] = useState('');
    const [hideDialog, setHideDialog] = useState(null);

    const [disabled, setDisabled] = useState(false);

    useEffect(() => showAllSubjectsService(), []);
    useEffect(() => getDisabledSubjectsService(), []);

    const submit = values => handleSubjectService(values);
    const handleEdit = subjectId => selectSubjectService(subjectId);
    const handleFormReset = () => clearSubjectService();
    const visibleSubjects = disabled
        ? search(props.disabledSubjects, term, ['name'])
        : search(props.subjects, term, ['name']);
    const SearchChange = setTerm;

    const handleClickOpen = subjectId => {
        setSubjectId(subjectId);
        setOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        handleSnackbarCloseService();
    };

    const handleClose = subjectId => {
        setOpen(false);
        if (!subjectId) return;
        if (hideDialog) {
            if (disabled) {
                const group = props.disabledSubjects.find(
                    subject => subject.id === subjectId
                );
                setEnabledSubjectsService(group);
            } else {
                const group = props.subjects.find(
                    subject => subject.id === subjectId
                );
                setDisabledSubjectsService(group);
            }
        } else {
            removeSubjectCardService(subjectId);
        }
        setHideDialog(null);
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
    };

    return (
        <>
            <NavigationPage name={"SubjectPage"} val={navigation.SUBJECTS}/>
            <ConfirmDialog
                isHide={hideDialog}
                cardId={subjectId}
                whatDelete={'subject'}
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
                        <AddSubject
                            className="form"
                            onSubmit={submit}
                            onReset={handleFormReset}
                        />
                    )}
                </aside>
                <section className="container-flex-wrap wrapper">
                    {visibleSubjects.length === 0 && (
                        <NotFound name={t('subject_y_label')} />
                    )}
                    {visibleSubjects.map(subject => (
                        <Card key={subject.id} class="subject-card done-card">
                            <h2 className="subject-card__name">
                                {subject.name}
                            </h2>
                            <div className="cards-btns">
                                {disabled ? (
                                    <IoMdEye
                                        className="svg-btn copy-btn"
                                        title={t('common:set_enabled')}
                                        onClick={() => {
                                            setHideDialog(disabledCard.SHOW);
                                            handleClickOpen(subject.id);
                                        }}
                                    />
                                ) : (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                setHideDialog(
                                                    disabledCard.HIDE
                                                );
                                                handleClickOpen(subject.id);
                                            }}
                                        />
                                        <FaEdit
                                            className="svg-btn edit-btn"
                                            title={t('edit_title')}
                                            onClick={() =>
                                                handleEdit(subject.id)
                                            }
                                        />
                                    </>
                                )}

                                <MdDelete
                                    className="svg-btn delete-btn"
                                    title={t('delete_title')}
                                    onClick={() => handleClickOpen(subject.id)}
                                />
                            </div>
                            {/* <p className="subject-card__description">
                                {t('subject_label') + ':'}{' '}
                            </p> */}
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
const mapStateToProps = state => ({
    subjects: state.subjects.subjects,
    disabledSubjects: state.subjects.disabledSubjects,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message
});

export default connect(mapStateToProps, {})(SubjectPage);
