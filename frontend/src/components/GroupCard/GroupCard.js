import React from 'react';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { FaEdit, FaUserPlus, FaUsers } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { dialogTypes } from '../../constants/dialogs';
import { links } from '../../constants/links';
import {
    COMMON_EDIT,
    COMMON_SET_ENABLED,
    COMMON_SET_DISABLED,
} from '../../constants/translationLabels/common';
import {
    GROUP_LABEL,
    DELETE_TITLE_LABEL,
    FORM_SHOW_STUDENTS,
    FORM_STUDENT_ADD_LABEL,
} from '../../constants/translationLabels/formElements';
import { getShortTitle } from '../../helper/shortTitle';

const GroupCard = (props) => {
    const {
        item,
        disabled,
        showCustomDialog,
        showStudentsByGroup,
        showAddStudentDialog,
        getGroupToUpdateForm,
    } = props;
    const { t } = useTranslation('formElements');
    return (
        <section className="group-card">
            <div className="group__buttons-wrapper">
                {!disabled ? (
                    <>
                        <Link to={`${links.GroupList}${links.Group}/${item.id}${links.SetDisable}`}>
                            <IoMdEye
                                className="group__buttons-hide link-href"
                                title={t(COMMON_SET_DISABLED)}
                                onClick={() => {
                                    showCustomDialog(item.id, dialogTypes.SET_VISIBILITY_DISABLED);
                                }}
                            />
                        </Link>
                        <Link to={`${links.GroupList}${links.Group}${links.Edit}/${item.id}`}>
                            <FaEdit
                                className="group__buttons-edit link-href"
                                title={t(COMMON_EDIT)}
                                onClick={() => getGroupToUpdateForm(item.id)}
                            />
                        </Link>
                    </>
                ) : (
                    <GiSightDisabled
                        className="group__buttons-hide link-href"
                        title={t(COMMON_SET_ENABLED)}
                        onClick={() => {
                            showCustomDialog(item.id, dialogTypes.SET_VISIBILITY_ENABLED);
                        }}
                    />
                )}
                <Link to={`${links.GroupList}${links.Group}${links.Delete}/${item.id}`}>
                    <MdDelete
                        className="group__buttons-delete link-href"
                        title={t(DELETE_TITLE_LABEL)}
                        onClick={() => showCustomDialog(item.id, dialogTypes.DELETE_CONFIRM)}
                    />
                </Link>
                <Link to={`${links.GroupList}${links.Group}/${item.id}${links.AddStudent}`}>
                    <FaUserPlus
                        title={t(FORM_STUDENT_ADD_LABEL)}
                        className="svg-btn copy-btn align-left info-btn"
                        onClick={() => {
                            showAddStudentDialog(item.id);
                        }}
                    />
                </Link>
            </div>
            <p className="group-card__description">{`${t(GROUP_LABEL)}:`}</p>
            <h1 className="group-card__number">{getShortTitle(item.title, 5)}</h1>
            <Link to={`${links.GroupList}${links.Group}/${item.id}${links.ShowStudents}`}>
                <span className="students-group">
                    <FaUsers
                        title={t(FORM_SHOW_STUDENTS)}
                        className="svg-btn copy-btn align-left info-btn students"
                        onClick={() => {
                            showStudentsByGroup(item);
                        }}
                    />
                </span>
            </Link>
        </section>
    );
};

export default GroupCard;
