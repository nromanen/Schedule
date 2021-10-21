import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SemesterForm.scss';
import { isEmpty, isNull, isNil } from 'lodash';
import Card from '../../share/Card/Card';
import { MultiselectForGroups } from '../../helper/MultiselectForGroups';
import {
    COMMON_EDIT,
    COMMON_CREATE,
    COMMON_SEMESTER,
} from '../../constants/translationLabels/common';
import FormSemester from './Form';
import { handleSemesterService } from '../../services/semesterService';

const AddSemesterForm = (props) => {
    const { t } = useTranslation('formElements');
    const {
        pristine,
        onReset,
        submitting,
        semester,
        groups,
        selectedGroups,
        setSelectedGroups,
        classScheduler,
    } = props;

    const [openGroupDialog, setOpenGroupDialog] = useState(false);
    const [selected, setSelected] = useState([]);

    const getGroupOptions = (groupOptions) => {
        return groupOptions.map((item) => {
            return { id: item.id, value: item.id, label: `${item.title}` };
        });
    };
    // Достає групи при редагувані, пробувати змінити по кліку
    useEffect(() => {
        const { semester_groups: semesterGroups } = semester;
        if (!isNil(semesterGroups)) {
            setSelectedGroups(getGroupOptions(semesterGroups));
        }
    }, [semester.id]);

    const options =
        selectedGroups.length === 0
            ? getGroupOptions(groups)
            : getGroupOptions(groups.filter((x) => !selectedGroups.includes(x)));

    const openDialogForGroup = () => {
        setOpenGroupDialog(true);
    };
    const closeDialogForGroup = () => {
        setOpenGroupDialog(false);
    };
    const clearSelection = () => {
        setSelected([]);
    };
    const onCancel = () => {
        clearSelection();
        closeDialogForGroup();
    };
    const getChosenSet = () => {
        const beginGroups = semester.semester_groups.map((item) => item.id);
        const resGroup = selectedGroups.map((item) => item.id);
        return resGroup.filter((x) => !beginGroups.includes(x));
    };
    const getChosenSetRemove = () => {
        const beginGroups = semester.semester_groups.map((item) => item.id);
        const resGroup = selectedGroups.map((item) => item.id);
        return beginGroups.filter((x) => !resGroup.includes(x));
    };
    const isChosenGroup = () => {
        const semesterCopy = { ...semester };
        if (semesterCopy.semester_groups.length < 0 || getChosenSet().length > 0) {
            return true;
        }
        return getChosenSetRemove().length > 0;
    };
    const getDisabledSaveButton = () => {
        if (!isEmpty(semester) && !isNull(semester.id)) {
            return (
                (selectedGroups.length > 0 ? !isChosenGroup() : selected.length === 0) &&
                (pristine || submitting)
            );
        }
        return pristine || submitting;
    };
    const submitSemesterForm = (values) => {
        const semesterGroups = selected.map((group) => {
            return { id: group.id, title: group.label };
        });
        handleSemesterService({ ...values, semester_groups: semesterGroups });
    };

    return (
        <Card additionClassName="form-card semester-form">
            <h2 style={{ textAlign: 'center' }}>
                {semester.id ? t(COMMON_EDIT) : t(COMMON_CREATE)}
                {` ${t(COMMON_SEMESTER)}`}
            </h2>
            <MultiselectForGroups
                open={openGroupDialog}
                options={options}
                value={selectedGroups.length === 0 ? selected : selectedGroups}
                onChange={selectedGroups.length === 0 ? setSelected : setSelectedGroups}
                onCancel={onCancel}
                onClose={closeDialogForGroup}
            />
            <FormSemester
                onSubmit={submitSemesterForm}
                openDialogForGroup={openDialogForGroup}
                getDisabledSaveButton={getDisabledSaveButton}
                semester={semester}
                onReset={onReset}
                setSelected={setSelected}
                classScheduler={classScheduler}
            />
        </Card>
    );
};

const mapStateToProps = (state) => ({
    semester: state.semesters.semester,
    classScheduler: state.classActions.classScheduler,
});

export default connect(mapStateToProps, {})(AddSemesterForm);
