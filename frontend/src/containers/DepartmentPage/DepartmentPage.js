import React, { useEffect, useState } from 'react';
import AddDepartment from '../../components/AddDepartmentForm/AddDepartmentForm';
import {
    clearDepartment,
    createDepartmentService,
    deleteDepartmentsService,
    getAllDepartmentsService,
    getDepartmentByIdService,
    getDisabledDepartmentsService,
    setDisabledDepartmentService,
    updateDepartmentService
} from '../../services/departmentService';
import { connect } from 'react-redux';
import Card from '../../share/Card/Card';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { setDisabledDepartment } from '../../redux/actions/departments';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import Button from '@material-ui/core/Button';
import { search } from '../../helper/search';
import NotFound from '../../share/NotFound/NotFound';
function DepartmentPage(props) {
    const { t } = useTranslation('formElements');
    const { departments,disabledDepartments } = props;
    const [isDisabled,setIsDisabled]=useState(false);
    const [term, setTerm] = useState('');
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
        console.log("delete",id);
        deleteDepartmentsService(id);
    }
    const setDisabled=(department)=>{

        const disabledDepartment={...department,disabled:true};
        console.log("setDisabledDepartment()",department,disabledDepartment)
        setDisabledDepartmentService(disabledDepartment);
    }
    const setDepartmentIntoForm=(id)=>{
        getDepartmentByIdService(id)
    }
    useEffect(() => getAllDepartmentsService(), [])
    useEffect(()=>getDisabledDepartmentsService(),[])
    const outputData=isDisabled?disabledDepartments:departments;
    return (
        <>
            <aside>
                <AddDepartment onSubmit={submit} clear={clearDepartmentForm} />
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
                            {/*{disabled ? (*/}
                            {/*    <IoMdEye*/}
                            {/*        className="svg-btn copy-btn"*/}
                            {/*        title={t('common:set_enabled')}*/}
                            {/*        onClick={() => {*/}
                            {/*            setHideDialog(disabledCard.SHOW);*/}
                            {/*            handleClickOpen(subject.id);*/}
                            {/*        }}*/}
                            {/*    />*/}
                            {/*) : (*/}
                            <>
                                <GiSightDisabled
                                    className="svg-btn copy-btn"
                                    title={t('common:set_disabled')}
                                    onClick={() => {
                                        setDisabled(department)
                                        // setHideDialog(
                                        //     disabledCard.HIDE
                                        // );
                                        // handleClickOpen(subject.id);
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


                            <MdDelete
                                className="svg-btn delete-btn"
                                title={t('delete_title')}
                                onClick={() => deleteDepartment(department.id)}
                            />
                        </div>
                        {/* <p className="subject-card__description">
                                {t('subject_label') + ':'}{' '}
                            </p> */}
                    </Card>
                ))}


            </section>
        </>
    )
}

const mapStateToProps = state => ({
    departments: state.departments.departments,
    disabledDepartments: state.departments.disabledDepartments,
    department: state.departments.department
});

export default connect(mapStateToProps, {})(DepartmentPage);