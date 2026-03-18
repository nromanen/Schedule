import reducer from './groups';
import * as actionTypes from '../actions/actionsType';

describe('groups reducer', () => {
    const initialState = {
        groups: [],
        scheduleGroups: [],
        group: {},
    };

    it('should return initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('SELECT_GROUP_SUCCESS should find group in groups array', () => {
        const state = {
            ...initialState,
            groups: [
                { id: 1, title: '101' },
                { id: 2, title: '102' },
            ],
        };

        const result = reducer(state, {
            type: actionTypes.SELECT_GROUP_SUCCESS,
            id: 1,
        });

        expect(result.group).toEqual({ id: 1, title: '101' });
    });

    it('SELECT_GROUP_SUCCESS should find group in scheduleGroups when not in groups', () => {
        const state = {
            ...initialState,
            groups: [],
            scheduleGroups: [
                { id: 10, title: '201(з)' },
                { id: 20, title: '202(з)' },
            ],
        };

        const result = reducer(state, {
            type: actionTypes.SELECT_GROUP_SUCCESS,
            id: 10,
        });

        expect(result.group).toEqual({ id: 10, title: '201(з)' });
    });

    it('SELECT_GROUP_SUCCESS should return {id: null} when group not found', () => {
        const state = {
            ...initialState,
            groups: [],
            scheduleGroups: [],
        };

        const result = reducer(state, {
            type: actionTypes.SELECT_GROUP_SUCCESS,
            id: 999,
        });

        expect(result.group).toEqual({ id: null });
    });

    it('SELECT_GROUP_SUCCESS should prefer scheduleGroups over groups', () => {
        const state = {
            ...initialState,
            groups: [{ id: 1, title: '101-old' }],
            scheduleGroups: [{ id: 1, title: '101-current' }],
        };

        const result = reducer(state, {
            type: actionTypes.SELECT_GROUP_SUCCESS,
            id: 1,
        });

        expect(result.group).toEqual({ id: 1, title: '101-current' });
    });

    it('SET_SCHEDULE_GROUPS should set scheduleGroups', () => {
        const groups = [{ id: 1, title: '101' }];

        const result = reducer(initialState, {
            type: actionTypes.SET_SCHEDULE_GROUPS,
            payload: groups,
        });

        expect(result.scheduleGroups).toEqual(groups);
    });
});