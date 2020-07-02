import React from 'react';
import Card from '../../../share/Card/Card';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import TemporaryScheduleCard from '../TemporaryScheduleCard/TemporaryScheduleCard';
import TemporaryScheduleCardButtons from '../TemporaryScheduleCardButtons/TemporaryScheduleCardButtons';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { MdExpandMore } from 'react-icons/all';

const ScheduleAndTemporaryScheduleList = props => {
    const shortId = require('shortid');

    const schedulesAndTemporarySchedules =
        props.schedulesAndTemporarySchedules || [];

    return (
        <main className="temporary-schedule-section">
            {schedulesAndTemporarySchedules.map(
                scheduleAndTemporarySchedule => (
                    <ExpansionPanel key={shortId.generate()}>
                        <ExpansionPanelSummary
                            expandIcon={<MdExpandMore />}
                            id={'panel1a-header' + shortId.generate()}
                        >
                            <h2>{scheduleAndTemporarySchedule.date}</h2>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Divider />
                            <section className="temporary-schedule-list">
                                {scheduleAndTemporarySchedule.schedules.map(
                                    schedule => (
                                        <section
                                            className="temporary-schedule-row"
                                            key={shortId.generate()}
                                        >
                                            <Card
                                                class={
                                                    'done-card text-center ' +
                                                    (schedule.schedule.vacation
                                                        ? 'vacation-card'
                                                        : '')
                                                }
                                            >
                                                {!schedule.temporary_schedule && (
                                                    <TemporaryScheduleCardButtons
                                                        schedule={
                                                            schedule.schedule
                                                        }
                                                        date={
                                                            scheduleAndTemporarySchedule.date
                                                        }
                                                        isTemporary={false}
                                                    />
                                                )}
                                                <TemporaryScheduleCard
                                                    schedule={schedule.schedule}
                                                />
                                            </Card>
                                            <Divider
                                                orientation="vertical"
                                                flexItem
                                                className="divider"
                                            />
                                            {schedule.temporary_schedule ? (
                                                <Card
                                                    class={
                                                        'done-card text-center ' +
                                                        schedule.temporary_schedule_vacation
                                                            ? 'vacation-card'
                                                            : ''
                                                    }
                                                >
                                                    <TemporaryScheduleCardButtons
                                                        schedule={
                                                            schedule.temporary_schedule
                                                        }
                                                        date={
                                                            scheduleAndTemporarySchedule.date
                                                        }
                                                        isTemporary={true}
                                                    />
                                                    <TemporaryScheduleCard
                                                        schedule={
                                                            schedule.temporary_schedule
                                                        }
                                                    />
                                                </Card>
                                            ) : (
                                                <Card class="done-card hidden-card">
                                                    Hidden
                                                </Card>
                                            )}
                                        </section>
                                    )
                                )}
                            </section>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                )
            )}
        </main>
    );
};

export default ScheduleAndTemporaryScheduleList;
