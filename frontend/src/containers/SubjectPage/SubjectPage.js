import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { useTranslation } from 'react-i18next';

import './SubjectPage.scss';
import Card from '../../share/Card/Card';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import CustomDialog from '../Dialogs/CustomDialog';
import { dialogTypes } from '../../constants/dialogs';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import AddSubjectForm from '../../components/AddSubjectForm/AddSubjectForm';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import { setIsOpenConfirmDialog } from '../../actions';
import {
    DELETE_TITLE,
    EDIT_TITLE, GROUP_VIEW_GRID,
    SUBJECT_Y_LABEL, VIEW_AZ
} from '../../constants/translationLabels/formElements';
import { COMMON_SET_DISABLED, COMMON_SET_ENABLED } from '../../constants/translationLabels/common';
import {
    useSubjects,
    useDisabledSubjects,
    useCreateSubject,
    useUpdateSubject,
    useDeleteSubject,
} from '../../hooks/useSubjects';

// ── Subject Card ──────────────────────────────────────────────
const SubjectCard = ({ subject, isDisabled, onEdit, onDelete, onEnable, onDisable, t }) => (
    <Card additionClassName="subject-card">
        <h2 className="subject-card__name">{subject.name}</h2>
        <div className="cards-btns">
            {isDisabled ? (
                <IoMdEye
                    className="svg-btn copy-btn"
                    title={t(COMMON_SET_ENABLED)}
                    onClick={() => onEnable(subject)}
                />
            ) : (
                <>
                    <GiSightDisabled
                        className="svg-btn copy-btn"
                        title={t(COMMON_SET_DISABLED)}
                        onClick={() => onDisable(subject)}
                    />
                    <FaEdit
                        className="svg-btn edit-btn"
                        title={t(EDIT_TITLE)}
                        onClick={() => onEdit(subject)}
                    />
                </>
            )}
            <MdDelete
                className="svg-btn delete-btn"
                title={t(DELETE_TITLE)}
                onClick={() => onDelete(subject)}
            />
        </div>
    </Card>
);

// ── Grouped View ──────────────────────────────────────────────
const GroupedView = ({ subjects, ...cardProps }) => {

    const grouped = subjects.reduce((acc, subject) => {
        const letter = subject.name[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(subject);
        return acc;
    }, {});

    const letters = Object.keys(grouped).sort();

    return (
        <div className="grouped-view">
            <div className="letter-jump-bar" id="letter-jump-bar">
                {letters.map((letter) => (
                    <a key={letter} href={`#letter-${letter}`} className="letter-jump-btn">
                        {letter}
                    </a>
                ))}
            </div>

            {letters.map((letter) => (
                <div key={letter} id={`letter-${letter}`} className="letter-group">
                    <div className="letter-group__header">
                        <span className="letter-group__badge">{letter}</span>
                        <div className="letter-group__line" />
                        <span className="letter-group__count">{grouped[letter].length}</span>
                    </div>
                    <div className="container-flex-wrap">
                        {grouped[letter].map((subject) => (
                            <SubjectCard key={subject.id} subject={subject} {...cardProps} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────
const SubjectPage = () => {
    const { t } = useTranslation('formElements');
    const dispatch = useDispatch();

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ── snackbar & dialog from Redux ──────────────────────────
    const isSnackbarOpen = useSelector((state) => state.snackbar.isSnackbarOpen);
    const snackbarType = useSelector((state) => state.snackbar.snackbarType);
    const snackbarMessage = useSelector((state) => state.snackbar.message);
    const isOpenConfirmDialog = useSelector((state) => state.dialog.isOpenConfirmDialog);
    const setOpenConfirmDialog = (state) => dispatch(setIsOpenConfirmDialog(state));

    // ── server state ──────────────────────────────────────────
    const { data: subjects = [] } = useSubjects();
    const { data: disabledSubjects = [] } = useDisabledSubjects();

    const createSubject = useCreateSubject();
    const updateSubject = useUpdateSubject();
    const deleteSubject = useDeleteSubject();

    // ── local UI state ────────────────────────────────────────
    const [term, setTerm] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    // ── derived data ──────────────────────────────────────────
    const visibleSubjects = search(
        isDisabled ? disabledSubjects : subjects,
        term,
        ['name'],
    );

    // ── handlers ──────────────────────────────────────────────
    const handleSubmit = (data) => {
        data.id ? updateSubject.mutate(data) : createSubject.mutate(data);
        setSelectedSubject(null);
    };

    const handleReset = () => setSelectedSubject(null);

    const showConfirmDialog = (subject, dialogType) => {
        setSelectedSubject(subject);
        setConfirmDialogType(dialogType);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setSelectedSubject(null);
    };

    const acceptConfirmDialog = () => {
        setOpenConfirmDialog(false);
        const subject = selectedSubject;
        switch (confirmDialogType) {
            case dialogTypes.DELETE_CONFIRM:
                deleteSubject.mutate(subject.id);
                break;
            case dialogTypes.SET_VISIBILITY_DISABLED:
            case dialogTypes.SET_VISIBILITY_ENABLED:
                updateSubject.mutate({ ...subject, disable: !subject.disable });
                break;
            default:
                break;
        }
        setSelectedSubject(null);
    };

    const cardProps = {
        isDisabled,
        onEdit: setSelectedSubject,
        onDelete: (subject) => showConfirmDialog(subject, dialogTypes.DELETE_CONFIRM),
        onEnable: (subject) => showConfirmDialog(subject, dialogTypes.SET_VISIBILITY_ENABLED),
        onDisable: (subject) => showConfirmDialog(subject, dialogTypes.SET_VISIBILITY_DISABLED),
        t,
    };

    return (
        <>
            <CustomDialog
                type={confirmDialogType}
                whatDelete="subject"
                open={isOpenConfirmDialog}
                handelConfirm={acceptConfirmDialog}
                onClose={handleCloseConfirmDialog}
            />

            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel
                        SearchChange={setTerm}
                        showDisabled={() => setIsDisabled((prev) => !prev)}
                    />
                    {!isDisabled && (
                        <AddSubjectForm
                            onSubmit={handleSubmit}
                            onReset={handleReset}
                            subject={selectedSubject}
                        />
                    )}
                </aside>

                <section className="container-flex-wrap">
                    {/* View toggle */}
                    <div className="view-toggle">
                        <button
                            className={`view-toggle__btn ${viewMode === 'grid' ? 'view-toggle__btn--active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            ▦ {t(GROUP_VIEW_GRID)}
                        </button>
                        <button
                            className={`view-toggle__btn ${viewMode === 'grouped' ? 'view-toggle__btn--active' : ''}`}
                            onClick={() => setViewMode('grouped')}
                        >
                            🔤 {t(VIEW_AZ)}
                        </button>
                        <span className="view-toggle__count">{visibleSubjects.length}</span>
                    </div>

                    {visibleSubjects.length === 0 && <NotFound name={t(SUBJECT_Y_LABEL)} />}

                    {viewMode === 'grid'
                        ? visibleSubjects.map((subject) => (
                            <SubjectCard key={subject.id} subject={subject} {...cardProps} />
                        ))
                        : <GroupedView subjects={visibleSubjects} {...cardProps} />
                    }
                </section>
            </div>

            <SnackbarComponent
                message={snackbarMessage}
                type={snackbarType}
                isOpen={isSnackbarOpen}
                handleSnackbarClose={handleSnackbarCloseService}
            />
            {showScrollTop && (
                <button
                    className="scroll-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    ↑
                </button>
            )}
        </>
    );
};

export default SubjectPage;