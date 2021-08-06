import React, { useEffect, useState } from 'react';
import AddDepartment from '../../components/AddDepartmentForm/AddDepartmentForm';
import {
    clearDepartment,
    createDepartmentService,
    deleteDepartmentsService,
    getAllDepartmentsService,
    getDepartmentByIdService,
    getDisabledDepartmentsService,
    setDisabledDepartmentService, setEnabledDepartmentService,
    updateDepartmentService
} from '../../services/departmentService';
import { connect } from 'react-redux';
import Card from '../../share/Card/Card';
import { GiSightDisabled, IoMdEye, MdFace } from 'react-icons/all';
import { FaChalkboardTeacher, FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { setDisabledDepartment, setEnabledDepartment } from '../../redux/actions/departments';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import Button from '@material-ui/core/Button';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import ConfirmDialog from '../../share/modals/dialog';
import { disabledCard } from '../../constants/disabledCard';
import { navigation, navigationNames } from '../../constants/navigation';
import NavigationPage from '../../components/Navigation/NavigationPage';
import SnackbarComponent from '../../share/Snackbar/SnackbarComponent';
import { handleSnackbarCloseService } from '../../services/snackbarService';
import { getAllTeachersByDepartmentId } from '../../redux/actions/teachers';
import { showAllPublicTeachersByDepartmentService } from '../../services/scheduleService';
import ShowDataDialog from '../../share/modals/modal/showDataDialog';
function DepartmentPage(props) {
    const { t } = useTranslation('formElements');
    const { departments,disabledDepartments } = props;
    const [isDisabled,setIsDisabled]=useState(false);
    const [term, setTerm] = useState('');
    const [deleteDialog,setDeleteDialog]=useState(false);
    const [departmentId,setDepartmentId]=useState("");
    const [hideDialog, setHideDialog] = useState(null);
    const [department,setDepartment]=useState({});
    const [teacherDialog,setTeacherDialog]=useState(false);
    const [editDepartment,setEditDepartment]=useState(false);
    const { isSnackbarOpen, snackbarType, snackbarMessage,teachers } = props;
    useEffect(()=>clearDepartmentForm(),[])
    const visibleDepartments = isDisabled
        ? search(disabledDepartments, term, ['name'])
        : search(departments, term, ['name']);
    const SearchChange = setTerm;
    const changeDisable=()=>{
        setIsDisabled(prev=>!prev);
    }
    const submit = (data) => {
        data.id===undefined?
            createDepartmentService(data):
            updateDepartmentService(data);
    }
    const clearDepartmentForm = () => {
        clearDepartment();
    }
    const deleteDepartment=(id)=>{
        setDepartmentId(id);
        setDeleteDialog(true);
    }
    const setDisabled=(department)=>{

        const disabledDepartment={...department,disabled:true};
        setDisabledDepartmentService(disabledDepartment);
    }
    const setEnabled=(department)=>{
        setDepartmentId(department.id);
        setDeleteDialog(true);
        const enabledDepartment={...department,disabled:false};
        setEnabledDepartment(enabledDepartment);
    }
    const setDepartmentIntoForm=(id)=>{
        getDepartmentByIdService(id)
    }
    const closeTeacherDialog = () => {
      setTeacherDialog(false)
    }
    const handleClose=(id)=>{
        if(id!=='') {
            if(department.id!==undefined) {
                if (hideDialog === disabledCard.SHOW) {
                    const { id, name } = department;
                    const enabledDepartment = { id, name, disable: false };
                    setEnabledDepartmentService(enabledDepartment);
                } else if (hideDialog === disabledCard.HIDE) {

                    const { id, name } = department;
                    const enabledDepartment = { id, name, disable: true };
                    setDisabledDepartmentService(enabledDepartment);
                }

            }
            else {
                deleteDepartmentsService(departmentId);
            }
        }
         setDeleteDialog(false);
    }
    useEffect(() => getAllDepartmentsService(), [isDisabled])
    useEffect(()=> {
        if (isDisabled)
            getDisabledDepartmentsService();
    },[])
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        handleSnackbarCloseService();
    };
    return (
        <>
            <NavigationPage name={navigationNames.DEPARTMENTS} val={navigation.DEPARTMENTS}/>
            <ConfirmDialog
                isHide={hideDialog}
                cardId={departmentId}
                whatDelete={'department'}
                open={deleteDialog}
                onClose={handleClose}
            />
            <ShowDataDialog
                isHide={hideDialog}
                cardId={departmentId}
                open={teacherDialog}
                onClose={closeTeacherDialog}
                teachers={teachers}
            />
            <div className="cards-container">
            <aside className="search-list__panel">
                <SearchPanel
                    SearchChange={SearchChange}
                    showDisabled={changeDisable}
                />
                {
                    isDisabled?'':
                    <AddDepartment
                    onSubmit={submit} clear={clearDepartmentForm} editDepartment={editDepartment}
                    />
                }
            </aside>
            <section className="container-flex-wrap wrapper">
                {visibleDepartments.length === 0 && (
                    <NotFound name={t('department_y_label')} />
                )}
                {visibleDepartments.map(department => (
                    <Card key={department.id} class="subject-card done-card">
                        <h2 className="subject-card__name">
                            {department.name}
                        </h2>
                        <div className="cards-btns">
                            {isDisabled?
                                <IoMdEye
                                    className="svg-btn copy-btn"
                                    title={t('common:set_enabled')}
                                    onClick={() => {
                                        setHideDialog(disabledCard.SHOW);
                                        deleteDepartment(department.id);
                                        setDepartment(department);
                                    }}
                                />:

                                (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                //setDisabled(department)
                                                setHideDialog(
                                                    disabledCard.HIDE
                                                );
                                                deleteDepartment(department.id);
                                                setDepartment(department);
                                            }}
                                        />

                                        <FaEdit
                                            className="svg-btn edit-btn"
                                            title={t('edit_title')}
                                            onClick={() => {
                                                setEditDepartment(true);
                                                setDepartmentIntoForm(department.id);
                                            }
                                            }
                                        />
                                    </>

                                )
                            }



                            <MdDelete
                                className="svg-btn delete-btn"
                                title={t('delete_title')}
                                onClick={() => {
                                    setDepartment({});
                                    deleteDepartment(department.id);
                                }}
                            />
                            <FaChalkboardTeacher
                                className="svg-btn delete-btn"
                                title={t('show_teacher_title')}
                                onClick={() => {
                                    showAllPublicTeachersByDepartmentService(department.id);
                                    getDepartmentByIdService(department.id);
                                    setDepartmentIntoForm(department.id)
                                    setTeacherDialog(true);

                                    // setDepartment({});
                                    // deleteDepartment(department.id);
                                }}
                            />
                            {/*<Button*/}
                            {/*    type='button'*/}
                            {/*    variant='contained'*/}
                            {/*    className='buttons-style'*/}
                            {/*    */}
                            {/*    onClick={()=>console.log(props.teachers)}*/}
                            {/*>*/}
                            {/*    {t('clear_button_label')}*/}
                            {/*</Button>*/}

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
    )
}

const mapStateToProps = state => ({
    departments: state.departments.departments,
    disabledDepartments: state.departments.disabledDepartments,
    department: state.departments.department,
    isSnackbarOpen: state.snackbar.isSnackbarOpen,
    snackbarType: state.snackbar.snackbarType,
    snackbarMessage: state.snackbar.message,
    teachers:state.teachers.teachers

});

export default connect(mapStateToProps, {})(DepartmentPage);