import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    fetchEnabledRooms,
    fetchDisabledRooms,
    fetchAllRoomTypes,
    saveRoom,
    deleteRoom,
    toggleRoom,
    reorderRoom,
    saveRoomType,
    deleteRoomType,
    fetchCombinedBusyRooms,
} from '../api/roomApi';
import { handleSnackbarOpenService } from '../services/snackbarService';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import { snackbarTypes } from '../constants/snackbarTypes';
import {
    BACK_END_SUCCESS_OPERATION,
    CREATED_LABEL,
    DELETED_LABEL,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { FORM_ROOM_LABEL, FORM_TYPE_LABEL } from '../constants/translationLabels/formElements';


export const COMBINED_BUSY_ROOMS_QUERY_KEY = 'combinedBusyRooms';

export const useCombinedBusyRooms = () =>
    useQuery({
        queryKey: [COMBINED_BUSY_ROOMS_QUERY_KEY],
        queryFn: fetchCombinedBusyRooms,
    });

export const ENABLED_ROOMS_KEY = 'enabledRooms';
export const DISABLED_ROOMS_KEY = 'disabledRooms';
export const ROOM_TYPES_KEY = 'roomTypes';

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useEnabledRooms = () =>
    useQuery({ queryKey: [ENABLED_ROOMS_KEY], queryFn: fetchEnabledRooms });

export const useDisabledRooms = () =>
    useQuery({ queryKey: [DISABLED_ROOMS_KEY], queryFn: fetchDisabledRooms });

export const useAllRoomTypes = () =>
    useQuery({ queryKey: [ROOM_TYPES_KEY], queryFn: fetchAllRoomTypes });

// ─── Room mutations ───────────────────────────────────────────────────────────

export const useSaveRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveRoom,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [ENABLED_ROOMS_KEY] });
            const label = variables.id ? UPDATED_LABEL : CREATED_LABEL;
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_ROOM_LABEL, label),
            );
        },
        onError: (error) =>
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error)),
    });
};

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRoom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENABLED_ROOMS_KEY] });
            queryClient.invalidateQueries({ queryKey: [DISABLED_ROOMS_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_ROOM_LABEL, DELETED_LABEL),
            );
        },
        onError: (error) =>
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error)),
    });
};

export const useToggleRoomVisibility = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: toggleRoom,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENABLED_ROOMS_KEY] });
            queryClient.invalidateQueries({ queryKey: [DISABLED_ROOMS_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_ROOM_LABEL, UPDATED_LABEL),
            );
        },
        onError: (error) =>
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error)),
    });
};

export const useReorderRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: reorderRoom,
        onMutate: async ({ dragRoom, afterRoomId }) => {
            await queryClient.cancelQueries({ queryKey: [ENABLED_ROOMS_KEY] });
            const previous = queryClient.getQueryData([ENABLED_ROOMS_KEY]);

            queryClient.setQueryData([ENABLED_ROOMS_KEY], (old = []) => {
                const filtered = old.filter((r) => r.id !== dragRoom.id);
                const idx = filtered.findIndex((r) => r.id === afterRoomId);
                filtered.splice(idx + 1, 0, dragRoom);
                return filtered;
            });

            return { previous };
        },
        onError: (error, _, context) => {
            queryClient.setQueryData([ENABLED_ROOMS_KEY], context.previous);
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [ENABLED_ROOMS_KEY] });
        },
    });
};

// ─── RoomType mutations ───────────────────────────────────────────────────────

export const useSaveRoomType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: saveRoomType,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [ROOM_TYPES_KEY] });
            const label = variables.id ? UPDATED_LABEL : CREATED_LABEL;
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_TYPE_LABEL, label),
            );
        },
        onError: (error) =>
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error)),
    });
};

export const useDeleteRoomType = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRoomType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ROOM_TYPES_KEY] });
            handleSnackbarOpenService(
                true,
                snackbarTypes.SUCCESS,
                createMessage(BACK_END_SUCCESS_OPERATION, FORM_TYPE_LABEL, DELETED_LABEL),
            );
        },
        onError: (error) =>
            handleSnackbarOpenService(true, snackbarTypes.ERROR, createErrorMessage(error)),
    });
};