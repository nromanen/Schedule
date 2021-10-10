import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { FaEdit, FaUserPlus, FaUsers } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { links } from '../../constants/links';
import { getShortTitle } from '../../helper/shortTitle';

const GroupCard = (props) => {
    const {
        disabled,
        groupItem,
        disabledCard,
        handleAddUser,
        onShowStudentByGroup,
        handleClickDisplayDialog,
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
                                title={t('common:set_disabled')}
                                onClick={() => {
                                    handleClickDisplayDialog(groupItem.id, disabledCard.HIDE);
                                }}
                            />
                        </Link>
                        <Link to={`${links.GroupList}${links.Group}${links.Edit}/${groupItem.id}`}>
                            <FaEdit
                                className="group__buttons-edit link-href"
                                title={t('common:edit')}
                                onClick={() => handleSetGroupToUpdateForm(groupItem.id)}
                            />
                        </Link>
                    </>
                ) : (
                    <GiSightDisabled
                        className="group__buttons-hide link-href"
                        title={t('common:set_enabled')}
                        onClick={() => {
                            handleClickDisplayDialog(groupItem.id, disabledCard.SHOW);
                        }}
                    />
                )}
                <Link to={`${links.GroupList}${links.Group}${links.Delete}/${groupItem.id}`}>
                    <MdDelete
                        className="group__buttons-delete link-href"
                        title={t('delete_title')}
                        onClick={() => handleClickDisplayDialog(groupItem.id)}
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
            <p className="group-card__description">{`${t('group_label')}:`}</p>
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
