import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createDepartment,
    deleteDepartment,
    fetchDepartments,
    fetchDisabledDepartments,
    updateDepartment,
} from '../api/departmentApi';
import { handleSnackbarOpenService } from '../services/snackbarService';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import { snackbarTypes } from '../constants/snackbarTypes';
import {
    BACK_END_SUCCESS_OPERATION,
    CREATED_LABEL,
    DELETED_LABEL,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_DEPARTMENT_LABEL } from '../constants/translationLabels/formElements';

export const DEPARTMENTS_QUERY_KEY = 'departments';
export const DISABLED_DEPARTMENTS_QUERY_KEY = 'disabledDepartments';

export const useDepartments = () =>
    useQuery({
        queryKey: [DEPARTMENTS_QUERY_KEY],
        queryFn: fetchDepartments,
    });

export const useDisabledDepartments = () =>
    useQuery({
        queryKey: [DISABLED_DEPARTMENTS_QUERY_KEY],
        queryFn: fetchDisabledDepartments,
    });

export const useCreateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_DEPARTMENT_LABEL, CREATED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};

export const useUpdateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DISABLED_DEPARTMENTS_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_DEPARTMENT_LABEL, UPDATED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};

export const useDeleteDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteDepartment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DISABLED_DEPARTMENTS_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_DEPARTMENT_LABEL, DELETED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};
