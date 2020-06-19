import React, { useEffect } from 'react';
import './TemporarySchedule.scss';
import { connect } from 'react-redux';
import TemporaryScheduleForm from '../../components/Changes/TemporaryScheduleForm/TemporaryScheduleForm';
import TemporaryScheduleList from '../../components/Changes/TemporaryScheduleList/TemporaryScheduleList';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getTemporarySchedulesService } from '../../services/temporaryScheduleService';

const TemporarySchedule = props => {
    const isLoading = props.loading;

    useEffect(() => {
        getTemporarySchedulesService();
    }, []);

    return (
        <div className="cards-container">
            <TemporaryScheduleForm
                temporarySchedule={props.temporarySchedule}
            />
            {isLoading ? (
                <section className="centered-container">
                    <CircularProgress />
                </section>
            ) : (
                <TemporaryScheduleList changes={props.temporarySchedules} />
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    temporarySchedules: state.temporarySchedule.temporarySchedules,
    temporarySchedule: state.temporarySchedule.temporarySchedule,
    loading: state.loadingIndicator.loading
});

export default connect(mapStateToProps)(TemporarySchedule);
