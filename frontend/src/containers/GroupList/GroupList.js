import { connect } from 'react-redux';
import { FaEdit, FaUserPlus, FaUsers } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './GroupList.scss';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import {
    ConfirmDialog,
    ShowStudentsOnGroupDialog,
    AddStudentDialog,
} from '../../share/DialogWindows';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import AddGroup from '../../components/AddGroupForm/AddGroupForm';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import {
    clearGroupService,
    getDisabledGroupsService,
    handleGroupService,
    removeGroupCardService,
    selectGroupService,
    setDisabledGroupService,
    setEnabledGroupService,
    showAllGroupsService,
} from '../../services/groupService';
import { disabledCard } from '../../constants/disabledCard';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';

import {
    createStudentService,
    deleteStudentService,
    getAllStudentsByGroupId,
    selectStudentService,
    updateStudentService,
} from '../../services/studentService';
import { links } from '../../constants/links';

import '../../router/Router.scss';
import { goToGroupPage } from '../../helper/pageRedirection';
import { getShortTitle } from '../../helper/shortTitle';

const GroupList = (props) => {
    const {
        isSnackbarOpen,
        snackbarType,
        snackbarMessage,
        students,
        groups,
        group,
        match,
        student,
    } = props;
    const { t } = useTranslation('formElements');

    const [open, setOpen] = useState(false);
    const [groupId, setGroupId] = useState(-1);
    const [term, setTerm] = useState('');
    const [hideDialog, setHideDialog] = useState(null);
    const [addStudentDialog, setAddStudentDialog] = useState(false);

    const [disabled, setDisabled] = useState(false);
    const [showStudents, setShowStudents] = useState(false);

    const SearchChange = setTerm;
    const history = useHistory();
    // useEffect(()=>getAllStudentsByGroupId(groupId),[groupId])
    useEffect(() => {
        getDisabledGroupsService();
    }, []);
    useEffect(() => {
        if (match.path.includes(links.Edit)) {
            selectGroupService(match.params.id);
        }
    }, [props.groups.length]);
    useEffect(() => {
        if (match.path.includes(links.Delete)) {
            handleClickOpen(props.match.params.id);
        }
    }, [props.groups.length]);
    useEffect(() => {
        if (match.path.includes(links.AddStudent)) {
            handleAddUser(match.params.id);
        }
    }, [props.groups.length]);
    useEffect(() => {
        if (match.path.includes(links.SetDisable)) {
            handleSetDisable(props.match.params.id);
        }
    }, []);
    useEffect(() => {
        if (match.path.includes(links.ShowStudents)) {
            onShowStudentByGroup(Number(match.params.id));
        }
    }, [props.students.length]);
    useEffect(() => {
        if (match.path.includes(links.Student) && match.path.includes(links.Edit)) {
            onShowStudentByGroup(Number(match.params.id));
            selectStudentService(Number(match.params.idStudent));
        }
    }, [props.students.length]);
    useEffect(() => {
        if (match.path.includes(links.Student) && match.path.includes(links.Delete)) {
            onShowStudentByGroup(Number(match.params.id));
            selectStudentService(Number(match.params.idStudent));
        }
    }, [props.students.length]);

    useEffect(() => showAllGroupsService(), []);
    // useEffect(() => getDisabledGroupsService(), []);
    const handleFormReset = () => {
        clearGroupService();
    };
    const submit = (values) => handleGroupService(values);
    const handleEdit = (groupId) => selectGroupService(groupId);
    const visibleGroups = disabled
        ? search(props.disabledGroups, term, ['title'])
        : search(props.groups, term, ['title']);

    const handleClickOpen = (groupId) => {
        setGroupId(groupId);
        setOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        handleSnackbarCloseService();
    };
    const handleAddUser = (id) => {
        setGroupId(id);
        setAddStudentDialog(true);
    };

    const handleClose = (groupId) => {
        setOpen(false);
        if (!groupId) {
            goToGroupPage(history);
            return;
        }
        if (hideDialog) {
            if (disabled) {
                const group = props.disabledGroups.find((group) => group.id === groupId);
                setEnabledGroupService(group);
            } else {
                const group = groups.find((group) => Number(group.id) === Number(groupId));
                setDisabledGroupService(group);
            }
        } else {
            removeGroupCardService(groupId);
        }
        setHideDialog(null);
        goToGroupPage(history);
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
    };
    const studentSubmit = (data) => {
        if (data.id !== undefined) {
            const sendData = { ...data, group: { id: data.group } };
            updateStudentService(sendData);
        } else {
            const sendData = { ...data, group: { id: groupId } };
            createStudentService(sendData);
        }
        setAddStudentDialog(false);
        goToGroupPage(history);
    };

    const selectStudentCard = () => {
        setAddStudentDialog(false);
    };
    const onCloseShowStudents = () => {
        setShowStudents(false);
        goToGroupPage(history);
    };
    const onShowStudentByGroup = (groupId) => {
        setShowStudents(true);
        selectGroupService(groupId);
        getAllStudentsByGroupId(groupId);
    };
    const onDeleteStudent = (student) => {
        if (student !== '') {
            deleteStudentService(student);
        }
    };
    const handleSetDisable = (groupId) => {
        setHideDialog(disabledCard.HIDE);
        handleClickOpen(groupId);
    };
    const getGroupTitle = (title) => {
        const MAX_LENGTH = 5;
        return getShortTitle(title, MAX_LENGTH);
    };

    return (
        <>
            <NavigationPage name={navigationNames.GROUP_LIST} val={navigation.GROUPS} />

            <ConfirmDialog
                isHide={hideDialog}
                cardId={groupId}
                whatDelete="group"
                open={open}
                onClose={handleClose}
            />
            <AddStudentDialog
                open={addStudentDialog}
                onSubmit={studentSubmit}
                onSetSelectedCard={selectStudentCard}
            />
            <ShowStudentsOnGroupDialog
                onClose={onCloseShowStudents}
                open={showStudents}
                students={students}
                group={group}
                onDeleteStudent={onDeleteStudent}
                onSubmit={studentSubmit}
                match={match}
                student={student}
                groups={groups}
            />

            <div className="cards-container">
                <aside className="search-list__panel">
                    <SearchPanel SearchChange={SearchChange} showDisabled={showDisabledHandle} />
                    {disabled ? (
                        ''
                    ) : (
                        <AddGroup
                            match={match}
                            className="form"
                            onSubmit={submit}
                            onReset={handleFormReset}
                        />
                    )}
                </aside>
                <div className="group-wrapper group-list">
                    {visibleGroups.length === 0 && <NotFound name={t('group_y_label')} />}
                    {visibleGroups.map((group) => (
                        <section key={group.id} className="group-card">
                            <div className="group__buttons-wrapper">
                                {!disabled ? (
                                    <>
                                        <Link
                                            to={`${links.GroupList}${links.Group}/${group.id}${links.SetDisable}`}
                                        >
                                            <GiSightDisabled
                                                className="group__buttons-hide link-href"
                                                title={t('common:set_disabled')}
                                                onClick={() => {
                                                    handleSetDisable(group.id);
                                                }}
                                            />
                                        </Link>
                                        <Link
                                            to={`${links.GroupList}${links.Group}${links.Edit}/${group.id}`}
                                        >
                                            <FaEdit
                                                className="group__buttons-edit link-href"
                                                title={t('common:edit')}
                                                onClick={() => handleEdit(group.id)}
                                            />
                                        </Link>
                                    </>
                                ) : (
                                    <IoMdEye
                                        className="group__buttons-hide link-href"
                                        title={t('common:set_enabled')}
                                        onClick={() => {
                                            setHideDialog(disabledCard.SHOW);
                                            handleClickOpen(group.id);
                                        }}
                                    />
                                )}
                                <Link
                                    to={`${links.GroupList}${links.Group}${links.Delete}/${group.id}`}
                                >
                                    <MdDelete
                                        className="group__buttons-delete link-href"
                                        title={t('delete_title')}
                                        onClick={() => handleClickOpen(group.id)}
                                    />
                                </Link>
                                <Link
                                    to={`${links.GroupList}${links.Group}/${group.id}${links.AddStudent}`}
                                >
                                    <FaUserPlus
                                        title={t('formElements:student_add_label')}
                                        className="svg-btn copy-btn align-left info-btn"
                                        onClick={() => {
                                            handleAddUser(group.id);
                                            // setCurrentGroup(group);
                                        }}
                                    />
                                </Link>
                            </div>
                            <p className="group-card__description">{`${t('group_label')}:`}</p>
                            <h1 className="group-card__number">{getGroupTitle(group.title)}</h1>
                            <Link
                                to={`${links.GroupList}${links.Group}/${group.id}${links.ShowStudents}`}
                            >
                                <span className="students-group">
                                    <FaUsers
                                        title={t('formElements:show_students')}
                                        className="svg-btn copy-btn align-left info-btn students"
                                        onClick={() => {
                                            onShowStudentByGroup(group.id);
                                        }}
                                    />
                                </span>
                            </Link>
                        </section>
                    ))}
                </div>
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
    groups: state.groups.groups,
    group: state.groups.group,
    disabledGroups: state.groups.disabledGroups,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    students: state.students.students,
    student: state.students.student,
});

export default connect(mapStateToProps, {})(GroupList);
