import { connect } from 'react-redux';
import { FaEdit, FaUserPlus, FaUsers } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import './GroupList.scss';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import ConfirmDialog from '../../share/modals/dialog';
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
    showAllGroupsService
} from '../../services/groupService';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { disabledCard } from '../../constants/disabledCard';
import NavigationPage from '../../components/Navigation/NavigationPage';
import { navigation, navigationNames } from '../../constants/navigation';


import {
    createStudentService,
    deleteStudentService,
    getAllStudentsByGroupId,
    updateStudentService
} from '../../services/studentService';
import { ShowStudentsDialog } from '../../share/modals/modal/showStudentsDialog';
import { getAllDepartmentsService } from '../../services/departmentService';
import AddStudentDialog from '../../share/modals/modal/AddStudentDialog';
import groups from '../../redux/reducers/groups';
import { links } from '../../constants/links';

let GroupList = props => {
    useEffect(()=>{
        if(props.match.path.includes("edit")) {
            selectGroupService(props.match.params.id);
        }

    },[props.groups.length])
    useEffect(()=>{
        if(props.match.path.includes("delete")) {
            handleClickOpen(props.match.params.id);
        }

    },[props.groups.length])

    useEffect(() => showAllGroupsService(), []);
    useEffect(() => getDisabledGroupsService(), []);

    const { isSnackbarOpen, snackbarType, snackbarMessage,students } = props;
    const { t } = useTranslation('formElements');

    const [open, setOpen] = useState(false);
    const [groupId, setGroupId] = useState(-1);
    const [term, setTerm] = useState('');
    const [hideDialog, setHideDialog] = useState(null);
    const [addStudentDialog, setAddStudentDialog] = useState(false);

    const [disabled, setDisabled] = useState(false);
    const [currentGroup,setCurrentGroup]=useState({});
    const [currentStudent,setCurrentStudent]=useState({});
    const [showStudents, setShowStudents]=useState(false);

    const SearchChange = setTerm;
    const handleFormReset = () => clearGroupService();
    const submit = values => handleGroupService(values);
    const handleEdit = groupId => selectGroupService(groupId);
    const visibleGroups = disabled
        ? search(props.disabledGroups, term, ['title'])
        : search(props.groups, term, ['title']);

    const handleClickOpen = groupId => {
        setGroupId(groupId);
        setOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        handleSnackbarCloseService();
    };


    const handleClose = groupId => {
        setOpen(false);
        if (!groupId) return;
        if (hideDialog) {
            if (disabled) {
                const group = props.disabledGroups.find(
                    group => group.id === groupId
                );
                setEnabledGroupService(group);
            } else {
                const group = props.groups.find(group => group.id === groupId);
                setDisabledGroupService(group);
            }
        } else {
            removeGroupCardService(groupId);
        }
        setHideDialog(null);
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
    };
    const studentSubmit = (data) => {
        if(data.id!==undefined){
            const sendData={...data,group:{id:data.group}};
            updateStudentService(sendData);
        }
        else {
            const sendData={...data,group:currentGroup}
            // setAddStudentDialog(false)
            createStudentService(sendData)
        }
        // const sendData={...data,group:currentGroup}
        setAddStudentDialog(false)
        //   createStudentService(sendData)
    }
    const selectStudentCard = () => {
        setAddStudentDialog(false)
    };
    const onCloseShowStudents = () => {
        setShowStudents(false)
    }
    const onShowStudentByGroup = (group) => {
        setShowStudents(true)
        setCurrentGroup(group);
        getAllStudentsByGroupId(group.id)
    }
    const onDeleteStudent = (student) => {
        if (student!=='') {
            deleteStudentService(student);
        }
    }

    return (
        <>

            {console.log(props.match.params.id)}
            <NavigationPage name={navigationNames.GROUP_LIST} val={navigation.GROUPS}/>
            <ConfirmDialog
                isHide={hideDialog}
                cardId={groupId}
                whatDelete={'group'}
                open={open}
                onClose={handleClose}
            />
            <AddStudentDialog
                open={addStudentDialog}
                onSubmit={studentSubmit}
                onSetSelectedCard={selectStudentCard}
            />
            <ShowStudentsDialog
                onClose={onCloseShowStudents}
                open={showStudents}
                students={students}
                group={currentGroup}
                onDeleteStudent={onDeleteStudent}

                onSubmit={studentSubmit}
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

                        <AddGroup
                            className="form"
                            onSubmit={submit}
                            onReset={handleFormReset}
                        />
                    )}
                </aside>
                <div className="group-wrapper group-list">
                    {visibleGroups.length === 0 && (
                        <NotFound name={t('group_y_label')} />
                    )}
                    {visibleGroups.map(group => (
                        <section key={group.id} className="group-card">

                            <div className="group__buttons-wrapper">
                                {!disabled ? (
                                    <>
                                        <GiSightDisabled
                                            className="group__buttons-hide"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                setHideDialog(
                                                    disabledCard.HIDE
                                                );
                                                handleClickOpen(group.id);
                                            }}
                                        />
                                        <Link to={`${links.GroupList}${links.Group}${links.Edit}/${group.id}`}>
                                        <FaEdit
                                            className="group__buttons-edit"
                                            title={t('edit_title')}
                                            onClick={() => handleEdit(group.id)}
                                        />
                                        </Link>
                                    </>
                                ) : (
                                    <IoMdEye
                                        className="group__buttons-hide"
                                        title={t('common:set_enabled')}
                                        onClick={() => {
                                            setHideDialog(disabledCard.SHOW);
                                            handleClickOpen(group.id);
                                        }}
                                    />
                                )}
                                <Link to={`${links.GroupList}${links.Group}${links.Delete}/${group.id}`}>
                                <MdDelete
                                    className="group__buttons-delete"
                                    title={t('delete_title')}
                                    onClick={() => handleClickOpen(group.id)}
                                />
                                </Link>
                                <FaUserPlus
                                    title={t('formElements:student_add_label')}
                                    className="svg-btn copy-btn align-left info-btn"
                                    onClick={()=> {
                                        setAddStudentDialog(true);
                                        setCurrentGroup(group)

                                    }}
                                />

                            </div>
                            <p className="group-card__description">
                                {t('group_label') + ':'}
                            </p>
                            <h1 className="group-card__number">
                                {group.title}
                            </h1>
                            <span className="students-group">
                                <FaUsers
                                    title={t('formElements:show_students')}
                                    className="svg-btn copy-btn align-left info-btn students"
                                    onClick={
                                        ()=> {
                                            onShowStudentByGroup(group)
                                        }
                                    }
                                />
                            </span>

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
const mapStateToProps = state => ({
    groups: state.groups.groups,
    disabledGroups: state.groups.disabledGroups,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    students: state.students.students
});

export default connect(mapStateToProps, {})(GroupList);
