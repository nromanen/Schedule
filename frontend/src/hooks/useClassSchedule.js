import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClass, deleteClass, fetchClasses, updateClass } from '../api/classApi';
import { handleSnackbarOpenService } from '../services/snackbarService';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import { snackbarTypes } from '../constants/snackbarTypes';
import {
    BACK_END_SUCCESS_OPERATION,
    CREATED_LABEL,
    DELETED_LABEL,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_CLASS_LABEL } from '../constants/translationLabels/formElements';

export const CLASSES_QUERY_KEY = 'classes';

export const useClasses = () =>
    useQuery({
        queryKey: [CLASSES_QUERY_KEY],
        queryFn: fetchClasses,
    });

export const useCreateClass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CLASSES_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_CLASS_LABEL, CREATED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};

export const useUpdateClass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CLASSES_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_CLASS_LABEL, UPDATED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};

export const useDeleteClass = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CLASSES_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_CLASS_LABEL, DELETED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};