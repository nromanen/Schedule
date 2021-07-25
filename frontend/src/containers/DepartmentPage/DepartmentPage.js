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
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { setDisabledDepartment, setEnabledDepartment } from '../../redux/actions/departments';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import Button from '@material-ui/core/Button';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
import ConfirmDialog from '../../share/modals/dialog';
import { disabledCard } from '../../constants/disabledCard';
function DepartmentPage(props) {
    const { t } = useTranslation('formElements');
    const { departments,disabledDepartments } = props;
    const [isDisabled,setIsDisabled]=useState(false);
    const [term, setTerm] = useState('');
    const [deleteDialog,setDeleteDialog]=useState(false);
    const [departmentId,setDepartmentId]=useState("");
    const [hideDialog, setHideDialog] = useState(null);
    const [department,setDepartment]=useState({});
    const visibleDepartments = isDisabled
        ? search(disabledDepartments, term, ['name'])
        : search(departments, term, ['name']);
    const SearchChange = setTerm;
    const changeDisable=()=>{
        console.log("changeDisable")
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
        console.log("setDisabledDepartment()",department,disabledDepartment)
        setDisabledDepartmentService(disabledDepartment);
    }
    const setEnabled=(department)=>{
        setDepartmentId(department.id);
        setDeleteDialog(true);
        const enabledDepartment={...department,disabled:false};
        console.log("setDisabledDepartment()",department,enabledDepartment)
        setEnabledDepartment(enabledDepartment);
    }
    const setDepartmentIntoForm=(id)=>{
        getDepartmentByIdService(id)


    }
    const handleClose=(id)=>{
         console.log(id,hideDialog,department)
        if(id!=='') {
            if(department.id!==undefined) {
                if (hideDialog === disabledCard.SHOW) {
                    const { id, name } = department;
                    const enabledDepartment = { id, name, disable: false };
                    console.log('setDisabledDepartment()', department, enabledDepartment);
                    setEnabledDepartmentService(enabledDepartment);
                } else if (hideDialog === disabledCard.HIDE) {

                    const { id, name } = department;
                    const enabledDepartment = { id, name, disable: true };
                    console.log('ENAMLED', enabledDepartment);
                    setDisabledDepartmentService(enabledDepartment);
                }

            }
            else {
                deleteDepartmentsService(departmentId);
            }
        }




        // else if (id!==""){
        //     deleteDepartmentsService(departmentId);
        // }
         setDeleteDialog(false);
        //console.log(hideDialog);

    }
    useEffect(() => getAllDepartmentsService(), [isDisabled])
    useEffect(()=>getDisabledDepartmentsService(),[isDisabled])

    return (
        <>
            <ConfirmDialog
                isHide={hideDialog}
                cardId={departmentId}
                whatDelete={'department'}
                open={deleteDialog}
                onClose={handleClose}
            />
            <div className="cards-container">
            <aside>
                {
                    isDisabled?'':
                    <AddDepartment
                    onSubmit={submit} clear={clearDepartmentForm}
                    />
                }

                    <SearchPanel
                        SearchChange={SearchChange}
                        showDisabled={changeDisable}
                    />


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
                                            onClick={() =>
                                                setDepartmentIntoForm(department.id)
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
                        </div>
                        {/* <p className="subject-card__description">
                                {t('subject_label') + ':'}{' '}
                            </p> */}
                    </Card>
                ))}


            </section>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    departments: state.departments.departments,
    disabledDepartments: state.departments.disabledDepartments,
    department: state.departments.department
});

export default connect(mapStateToProps, {})(DepartmentPage);