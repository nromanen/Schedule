import './GroupPage.scss';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';
import { goToGroupPage } from '../../helper/pageRedirection';
import { dialogTypes } from '../../constants/dialogs';
import {GROUP_VIEW_COURSES, GROUP_VIEW_GRID, GROUP_Y_LABEL} from '../../constants/translationLabels/formElements';
import { search } from '../../helper/search';
import GroupCard from './GroupCard/GroupCard';
import NotFound from '../../share/NotFound/NotFound';
import CustomDialog from '../../containers/Dialogs/CustomDialog';
import AddStudentDialog from '../../share/DialogWindows/_dialogWindows/AddStudentDialog';
import ShowStudentsOnGroupDialog from '../../containers/Students/ShowStudentsOnGroupDialog';
import { ADD_STUDENT_ACTION, SHOW_STUDENTS_ACTION } from '../../constants/actionsUrl';
import { DraggableCard } from '../../share/DraggableCard/DraggableCard';
import { setIsOpenConfirmDialog } from '../../actions';
import { selectGroupSuccess } from '../../actions';
import {
    useEnabledGroups,
    useDisabledGroups,
    useDeleteGroup,
    useToggleGroupStatus,
    useDragAndDropGroup,
} from '../../hooks/useGroups';

const groupByCategory = (groups) => {
    const result = {};

    groups.forEach((group) => {
        const title = group.title;
        const firstChar = title[0];
        const isDigit = /\d/.test(firstChar);
        const hasZ = /з/i.test(title);

        if (isDigit && !hasZ) {
            result[firstChar] = [...(result[firstChar] || []), group];
        } else if (hasZ) {
            result['Заочники'] = [...(result['Заочники'] || []), group];
        } else {
            result['Інші'] = [...(result['Інші'] || []), group];
        }
    });

    // сортуємо: цифри по порядку, потім Заочники, потім Інші
    const sorted = {};
    Object.keys(result)
        .sort((a, b) => {
            const aIsDigit = /^\d$/.test(a);
            const bIsDigit = /^\d$/.test(b);
            if (aIsDigit && bIsDigit) return a - b;
            if (aIsDigit) return -1;
            if (bIsDigit) return 1;
            if (a === 'Заочники') return -1;
            if (b === 'Заочники') return 1;
            return 0;
        })
        .forEach((key) => {
            sorted[key] = result[key];
        });

    return sorted;
};

const GroupList = ({ searchItem, isDisabled, setGroup, match }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { t } = useTranslation('formElements');

    const isOpenConfirmDialog = useSelector((state) => state.dialog.isOpenConfirmDialog);

    const { data: enabledGroups = [], isLoading: loadingEnabled } = useEnabledGroups();
    const { data: disabledGroups = [], isLoading: loadingDisabled } = useDisabledGroups();

    const deleteGroup = useDeleteGroup();
    const toggleStatus = useToggleGroupStatus();
    const dragAndDrop = useDragAndDropGroup();

    const groups = isDisabled ? disabledGroups : enabledGroups;
    const loading = isDisabled ? loadingDisabled : loadingEnabled;
    const visibleGroups = search(groups, searchItem, ['title']);

    const [groupId, setGroupId] = useState(-1);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [isOpenShowStudentsDialog, setIsOpenShowStudentsDialog] = useState(false);
    const [isOpenAddStudentDialog, setIsOpenAddStudentDialog] = useState(false);
    const [dragGroup, setGroupStart] = useState();
    const [viewMode, setViewMode] = useState('grid');
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showConfirmDialog = (group, disabledStatus) => {
        setGroupId(group.id);
        setSelectedGroup(group);
        setConfirmDialogType(disabledStatus);
        dispatch(setIsOpenConfirmDialog(true));
    };

    const acceptConfirmDialog = () => {
        dispatch(setIsOpenConfirmDialog(false));
        if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
            toggleStatus.mutate(selectedGroup);
        } else {
            deleteGroup.mutate(groupId);
        }
        setSelectedGroup(null);
    };

    const showAddStudentDialog = (currentGroupId) => {
        setGroupId(currentGroupId);
        setIsOpenAddStudentDialog(true);
    };

    const showStudentsByGroup = (currentGroupId) => {
        setGroupId(currentGroupId);
        dispatch(selectGroupSuccess(currentGroupId));
        setIsOpenShowStudentsDialog(true);
    };

    const closeShowStudentsByGroup = () => {
        goToGroupPage(history);
        setIsOpenShowStudentsDialog(false);
    };

    const dragAndDropItem = (afterItemId) => {
        dragAndDrop.mutate({ dragGroup, afterGroupId: afterItemId });
    };

    useEffect(() => {
        const { id, action } = match.params;
        const actions = {
            [ADD_STUDENT_ACTION]: showAddStudentDialog,
            [SHOW_STUDENTS_ACTION]: showStudentsByGroup,
        };
        const fn = actions[action];
        if (fn && id) fn(id);
    }, []);

    const cardProps = {
        setGroup,
        disabled: isDisabled,
        showConfirmDialog: (id, type) => {
            const group = visibleGroups.find((g) => g.id === id);
            if (group) showConfirmDialog(group, type);
        },
        showAddStudentDialog,
        showStudentsByGroup,
    };

    const renderCards = (groupsList) =>
        groupsList.map((item) => (
            <DraggableCard
                key={item.id}
                item={item}
                setGroupStart={setGroupStart}
                dragAndDropItem={dragAndDropItem}
            >
                <GroupCard group={item} {...cardProps} />
            </DraggableCard>
        ));

    const renderGrouped = () => {
        const grouped = groupByCategory(visibleGroups);
        return (
            <div className="grouped-view">
                {Object.entries(grouped).map(([category, categoryGroups]) => (
                    <div key={category} className="letter-group">
                        <div className="letter-group__header">
                            <span className="letter-group__badge">{category}</span>
                            <div className="letter-group__line" />
                            <span className="letter-group__count">{categoryGroups.length}</span>
                        </div>
                        <div className="container-flex-wrap">
                            {renderCards(categoryGroups)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <section className="centered-container">
                <CircularProgress />
            </section>
        );
    }

    return (
        <>
            <CustomDialog
                type={confirmDialogType}
                handelConfirm={acceptConfirmDialog}
                whatDelete="group"
                open={isOpenConfirmDialog}
            />
            {isOpenAddStudentDialog && (
                <AddStudentDialog
                    groups={groups}
                    groupId={groupId}
                    open={isOpenAddStudentDialog}
                    setOpen={setIsOpenAddStudentDialog}
                />
            )}
            {isOpenShowStudentsDialog && (
                <ShowStudentsOnGroupDialog
                    match={match}
                    groupId={groupId}
                    open={isOpenShowStudentsDialog}
                    onClose={closeShowStudentsByGroup}
                />
            )}

            <div className="group-wrapper">
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
                        # {t(GROUP_VIEW_COURSES)}
                    </button>
                    <span className="view-toggle__count">{visibleGroups.length}</span>
                </div>

                {isEmpty(visibleGroups) ? (
                    <NotFound name={t(GROUP_Y_LABEL)} />
                ) : viewMode === 'grid' ? (
                    <div className="container-flex-wrap">
                        {renderCards(visibleGroups)}
                    </div>
                ) : (
                    renderGrouped()
                )}
            </div>

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

export default GroupList;