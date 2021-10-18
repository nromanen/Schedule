import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { FaEdit, FaUserPlus, FaUsers } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { links } from '../../constants/links';
import { getShortTitle } from '../../helper/shortTitle';
import { dialogTypes } from '../../constants/dialogs';
import {
    COMMON_SET_DISABLED,
    COMMON_EDIT,
    COMMON_SET_ENABLED,
} from '../../constants/translationLabels/common';
import { GROUP_LABEL } from '../../constants/translationLabels/formElements';

const GroupCard = (props) => {
    const {
        disabled,
        groupItem,
        handleAddUser,
        onShowStudentByGroup,
        showConfirmDialog,
        handleSetGroupToUpdateForm,
    } = props;
    const { t } = useTranslation('formElements');
    return (
        <section key={groupItem.id} className="group-card">
            <div className="group__buttons-wrapper">
                {!disabled ? (
                    <>
                        <Link
                            to={`${links.GroupList}${links.Group}/${groupItem.id}${links.SetDisable}`}
                        >
                            <IoMdEye
                                className="group__buttons-hide link-href"
                                title={t(COMMON_SET_DISABLED)}
                                onClick={() => {
                                    showConfirmDialog(
                                        groupItem.id,
                                        dialogTypes.SET_VISIBILITY_DISABLED,
                                    );
                                }}
                            />
                        </Link>
                        <Link to={`${links.GroupList}${links.Group}${links.Edit}/${groupItem.id}`}>
                            <FaEdit
                                className="group__buttons-edit link-href"
                                title={t(COMMON_EDIT)}
                                onClick={() => handleSetGroupToUpdateForm(groupItem.id)}
                            />
                        </Link>
                    </>
                ) : (
                    <GiSightDisabled
                        className="group__buttons-hide link-href"
                        title={t(COMMON_SET_ENABLED)}
                        onClick={() => {
                            showConfirmDialog(groupItem.id, dialogTypes.SET_VISIBILITY_ENABLED);
                        }}
                    />
                )}
                <Link to={`${links.GroupList}${links.Group}${links.Delete}/${groupItem.id}`}>
                    <MdDelete
                        className="group__buttons-delete link-href"
                        title={t('delete_title')}
                        onClick={() => showConfirmDialog(groupItem.id, dialogTypes.DELETE_CONFIRM)}
                    />
                </Link>
                <Link to={`${links.GroupList}${links.Group}/${groupItem.id}${links.AddStudent}`}>
                    <FaUserPlus
                        title={t('formElements:student_add_label')}
                        className="svg-btn copy-btn align-left info-btn"
                        onClick={() => {
                            handleAddUser(groupItem.id);
                        }}
                    />
                </Link>
            </div>
            <p className="group-card__description">{`${t(GROUP_LABEL)}:`}</p>
            <h1 className="group-card__number">{getShortTitle(groupItem.title, 5)}</h1>
            <Link to={`${links.GroupList}${links.Group}/${groupItem.id}${links.ShowStudents}`}>
                <span className="students-group">
                    <FaUsers
                        title={t('formElements:show_students')}
                        className="svg-btn copy-btn align-left info-btn students"
                        onClick={() => {
                            onShowStudentByGroup(groupItem.id);
                        }}
                    />
                </span>
            </Link>
        </section>
    );
};

export default GroupCard;
