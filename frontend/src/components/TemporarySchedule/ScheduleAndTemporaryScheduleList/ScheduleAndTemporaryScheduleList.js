import React, { useState } from 'react';
import { MdExpandMore } from 'react-icons/all';

import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import shortId from 'shortid';
import Card from '../../../share/Card/Card';
import ConfirmDialog from '../../../share/modals/dialog';

import TemporaryScheduleCard from '../TemporaryScheduleCard/TemporaryScheduleCard';
import TemporaryScheduleCardButtons from '../TemporaryScheduleCardButtons/TemporaryScheduleCardButtons';

import { cardType } from '../../../constants/cardType';

import { deleteTemporaryScheduleService } from '../../../services/temporaryScheduleService';

const ScheduleAndTemporaryScheduleList = (props) => {
    const schedulesAndTemporarySchedules = props.schedulesAndTemporarySchedules || [];

    const [open, setOpen] = useState(false);
    const [temporaryScheduleId, setTemporaryScheduleId] = useState(-1);
    const [date, setDate] = useState(null);
    const [teacherId, setTeacherId] = useState(null);

    let expandedProp;

    if (schedulesAndTemporarySchedules.length === 1) {
        expandedProp = {
            expanded: true,
        };
    }

    const handleClickOpen = (id) => {
        setTemporaryScheduleId(id);
        setOpen(true);
    };

    const handleClose = (id) => {
        setOpen(false);
        if (!id) {
            return;
        }
        deleteTemporaryScheduleService(id, date, teacherId);
    };

    return (
        <main className="temporary-schedule-section">
            <ConfirmDialog
                cardId={temporaryScheduleId}
                whatDelete={cardType.TEMPORARY_SCHEDULE.toLowerCase()}
                open={open}
                onClose={handleClose}
            />
            {schedulesAndTemporarySchedules.map((scheduleAndTemporarySchedule) => (
                <ExpansionPanel key={shortId.generate()} {...expandedProp}>
                    <ExpansionPanelSummary
                        expandIcon={<MdExpandMore />}
                        id={`panel1a-header${shortId.generate()}`}
                    >
                        <h2>{scheduleAndTemporarySchedule.date}</h2>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Divider />
                        <section className="temporary-schedule-list">
                            {scheduleAndTemporarySchedule.schedules.map((schedule) => (
                                <section
                                    className="temporary-schedule-row"
                                    key={shortId.generate()}
                                >
                                    <Card
                                        class={`done-card text-center ${
                                            schedule.schedule.vacation && 'vacation-card '
                                        }`}
                                    >
                                        {!schedule.temporary_schedule && (
                                            <TemporaryScheduleCardButtons
                                                schedule={schedule.schedule}
                                                date={scheduleAndTemporarySchedule.date}
                                                isTemporary={false}
                                                scheduleId={schedule.schedule.id}
                                            />
                                        )}
                                        <TemporaryScheduleCard schedule={schedule.schedule} />
                                    </Card>
                                    <Divider orientation="vertical" flexItem className="divider" />
                                    {schedule.temporary_schedule ? (
                                        <Card
                                            class={`done-card text-center ${
                                                schedule.temporary_schedule_vacation &&
                                                'vacation-card '
                                            }`}
                                        >
                                            <TemporaryScheduleCardButtons
                                                schedule={schedule.temporary_schedule}
                                                date={scheduleAndTemporarySchedule.date}
                                                scheduleId={schedule.schedule.id}
                                                isTemporary
                                                onOpenDialog={handleClickOpen}
                                                setDate={setDate}
                                                setTeacherId={setTeacherId}
                                            />
                                            <TemporaryScheduleCard
                                                schedule={schedule.temporary_schedule}
                                            />
                                        </Card>
                                    ) : (
                                        <Card additionClassName="done-card hidden-card">Hidden</Card>
                                    )}
                                </section>
                            ))}
                        </section>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            ))}
        </main>
    );
};

export default ScheduleAndTemporaryScheduleList;
