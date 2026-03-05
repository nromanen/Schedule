import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { handleSnackbarOpenService } from '../services/snackbarService';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import { snackbarTypes } from '../constants/snackbarTypes';
import {
    BACK_END_SUCCESS_OPERATION,
    CREATED_LABEL,
    DELETED_LABEL,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_SUBJECT_LABEL } from '../constants/translationLabels/formElements';
import { createSubject, fetchDisabledSubjects, fetchSubjects, deleteSubject, updateSubject } from '../api/subjectApi';

export const SUBJECTS_QUERY_KEY = 'subjects';
export const DISABLED_SUBJECTS_QUERY_KEY = 'disabledSubjects';

export const useSubjects = () =>
    useQuery({
        queryKey: [SUBJECTS_QUERY_KEY],
        queryFn: fetchSubjects,
    });

export const useDisabledSubjects = () =>
    useQuery({
        queryKey: [DISABLED_SUBJECTS_QUERY_KEY],
        queryFn: fetchDisabledSubjects,
    });

export const useCreateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_SUBJECT_LABEL, CREATED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};

export const useUpdateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DISABLED_SUBJECTS_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_SUBJECT_LABEL, UPDATED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};

export const useDeleteSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DISABLED_SUBJECTS_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_SUBJECT_LABEL, DELETED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};