import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    fetchEnabledGroups,
    fetchDisabledGroups,
    fetchGroupsForCurrentSemester,
    createGroup,
    updateGroup,
    deleteGroup,
} from '../api/groupApi';
import { handleSnackbarOpenService } from '../services/snackbarService';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import { snackbarTypes } from '../constants/snackbarTypes';
import {
    BACK_END_SUCCESS_OPERATION,
    CREATED_LABEL,
    DELETED_LABEL,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_GROUP_LABEL } from '../constants/translationLabels/formElements';

export const ENABLED_GROUPS_QUERY_KEY = 'enabledGroups';
export const DISABLED_GROUPS_QUERY_KEY = 'disabledGroups';
export const SCHEDULE_GROUPS_QUERY_KEY = 'scheduleGroups';

export const useEnabledGroups = () =>
    useQuery({
        queryKey: [ENABLED_GROUPS_QUERY_KEY],
        queryFn: fetchEnabledGroups,
    });

export const useDisabledGroups = () =>
    useQuery({
        queryKey: [DISABLED_GROUPS_QUERY_KEY],
        queryFn: fetchDisabledGroups,
    });

export const useGroupsForCurrentSemester = () =>
    useQuery({
        queryKey: [SCHEDULE_GROUPS_QUERY_KEY],
        queryFn: fetchGroupsForCurrentSemester,
    });

export const useCreateGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENABLED_GROUPS_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_GROUP_LABEL, CREATED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};

export const useUpdateGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENABLED_GROUPS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DISABLED_GROUPS_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_GROUP_LABEL, UPDATED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};

export const useDeleteGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteGroup,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENABLED_GROUPS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DISABLED_GROUPS_QUERY_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_GROUP_LABEL, DELETED_LABEL),
            );
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};

export const useToggleGroupStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (group) => updateGroup({ ...group, disable: !group.disable }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENABLED_GROUPS_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DISABLED_GROUPS_QUERY_KEY] });
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};

export const useDragAndDropGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ dragGroup, afterGroupId }) =>
            updateGroup({ ...dragGroup, afterId: afterGroupId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENABLED_GROUPS_QUERY_KEY] });
        },
        onError: (error) => {
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
    });
};