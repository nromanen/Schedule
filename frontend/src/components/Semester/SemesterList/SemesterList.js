import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SemesterList.scss';
import { isEqual, isEmpty, get } from 'lodash';
import NotFound from '../../../share/NotFound/NotFound';
import { dialogTypes, dialogCloseButton } from '../../../constants/dialogs';
import {
    COPY_LABEL,
    SEMESTER_COPY_LABEL,
    SEMESTERY_LABEL,
} from '../../../constants/translationLabels/formElements';
import {
    EXIST_LABEL,
    GROUP_EXIST_IN_THIS_SEMESTER,
} from '../../../constants/translationLabels/serviceMessages';
import { COMMON_GROUP_TITLE } from '../../../constants/translationLabels/common';
import { search } from '../../../helper/search';
import { getGroupsOptionsForSelect } from '../../../utils/selectUtils';
import SemesterCopyForm from '../../../containers/SemesterPage/SemesterCopyForm';
import SemesterCard from './SemesterCard';
import CustomDialog from '../../../containers/Dialogs/CustomDialog';
import { MultiselectForGroups } from '../../../helper/MultiselectForGroups';
import i18n from '../../../i18n';

const SemesterList = (props) => {
    const { t } = useTranslation('formElements');

    const {
        archived,
        disabled,
        term,
        semesters,
        selectSemester,
        createArchivedSemester,
        setOpenConfirmDialog,
        updateSemester,
        removeSemesterCard,
        setDefaultSemesterById,
        isOpenConfirmDialog,
        semesterCopy,
        options,
        setOpenSuccessSnackbar,
        setGroupsToSemester,
        // archivedSemesters,
        // getArchivedSemester,
    } = props;
    const [isOpenSemesterCopyForm, setIsOpenSemesterCopyForm] = useState(false);
    const [confirmDialogType, setConfirmDialogType] = useState('');
    const [isOpenGroupsDialog, setIsOpenGroupsDialog] = useState(false);

    const [semesterGroupsOptions, setSemesterGroupsOptions] = useState([]);
    const [semesterId, setSemesterId] = useState(null);

    const searchArr = ['year', 'description', 'startDay', 'endDay'];

    const visibleItems = search(semesters, term, searchArr);

    const showConfirmDialog = (id, dialogType) => {
        setSemesterId(id);
        setConfirmDialogType(dialogType);
        setOpenConfirmDialog(true);
    };
    const submitSemesterCopy = ({ toSemesterId }) => {
        semesterCopy({
            fromSemesterId: semesterId,
            toSemesterId,
        });
        setIsOpenSemesterCopyForm(false);
    };
    const closeSemesterCopyForm = () => {
        setIsOpenSemesterCopyForm(false);
    };
    const changeSemesterDisabledStatus = (currentSemesterId) => {
        const foundSemester = semesters.find(
            (semesterItem) => semesterItem.id === currentSemesterId,
        );
        const changeDisabledStatus = {
            [dialogTypes.SET_VISIBILITY_ENABLED]: updateSemester({
                ...foundSemester,
                disable: false,
            }),
            [dialogTypes.SET_VISIBILITY_DISABLED]: updateSemester({
                ...foundSemester,
                disable: true,
            }),
        };
        return changeDisabledStatus[confirmDialogType];
    };

    const acceptConfirmDialog = (currentSemesterId) => {
        setOpenConfirmDialog(false);
        const isDisabled = disabled;
        if (confirmDialogType === dialogTypes.SET_DEFAULT) {
            setDefaultSemesterById(currentSemesterId, isDisabled);
        } else if (confirmDialogType !== dialogTypes.DELETE_CONFIRM) {
            changeSemesterDisabledStatus(currentSemesterId);
        } else {
            removeSemesterCard(currentSemesterId);
        }
    };
    // it doesnt work, need to finish implement archeved functionality
    // const handleSemesterArchivedPreview = (currentSemesterId) => {
    //     getArchivedSemester(+currentSemesterId);
    // };
    const onChangeGroups = () => {
        const semester = semesters.find((semesterItem) => semesterItem.id === semesterId);
        const beginGroups = !isEmpty(semester.semester_groups)
            ? getGroupsOptionsForSelect(semester.semester_groups)
            : [];
        const finishGroups = [...semesterGroupsOptions];
        if (isEqual(beginGroups, finishGroups)) {
            setOpenSuccessSnackbar(
                i18n.t(GROUP_EXIST_IN_THIS_SEMESTER, {
                    cardType: i18n.t(COMMON_GROUP_TITLE),
                    actionType: i18n.t(EXIST_LABEL),
                }),
            );
            return;
        }
        setGroupsToSemester(semesterId, semesterGroupsOptions);
        setIsOpenGroupsDialog(false);
    };
    const cancelMultiselect = () => {
        setIsOpenGroupsDialog(false);
    };
    return (
        <>
            {isOpenConfirmDialog && (
                <CustomDialog
                    type={confirmDialogType}
                    whatDelete="semester"
                    open={isOpenConfirmDialog}
                    handelConfirm={() => acceptConfirmDialog(semesterId)}
                />
            )}
            {isOpenSemesterCopyForm && (
                <CustomDialog
                    title={t(SEMESTER_COPY_LABEL)}
                    open={isOpenSemesterCopyForm}
                    onClose={closeSemesterCopyForm}
                    buttons={[dialogCloseButton(closeSemesterCopyForm)]}
                >
                    <SemesterCopyForm
                        semesterId={semesterId}
                        onSubmit={submitSemesterCopy}
                        submitButtonLabel={t(COPY_LABEL)}
                        semesters={semesters}
                    />
                </CustomDialog>
            )}
            <section className="container-flex-wrap wrapper">
                {visibleItems.length === 0 && <NotFound name={t(SEMESTERY_LABEL)} />}
                {visibleItems.map((semesterItem) => {
                    const semDays = semesterItem.semester_days.map((day) =>
                        t(`common:day_of_week_${day}`),
                    );
                    const groups = get(semesterItem, 'semester_groups')
                        ? getGroupsOptionsForSelect(semesterItem.semester_groups)
                        : [];

                    return (
                        <SemesterCard
                            key={semesterItem.id}
                            semesterItem={semesterItem}
                            semDays={semDays}
                            groups={groups}
                            disabled={disabled}
                            archived={archived}
                            selectSemester={selectSemester}
                            showConfirmDialog={showConfirmDialog}
                            setIsOpenSemesterCopyForm={setIsOpenSemesterCopyForm}
                            setSemesterId={setSemesterId}
                            createArchivedSemester={createArchivedSemester}
                            setSemesterGroupsOptions={setSemesterGroupsOptions}
                            setIsOpenGroupsDialog={setIsOpenGroupsDialog}
                        />
                    );
                })}
            </section>
            <MultiselectForGroups
                open={isOpenGroupsDialog}
                options={options}
                value={semesterGroupsOptions}
                onChange={setSemesterGroupsOptions}
                onCancel={cancelMultiselect}
                onClose={onChangeGroups}
            />
        </>
    );
};

export default SemesterList;
