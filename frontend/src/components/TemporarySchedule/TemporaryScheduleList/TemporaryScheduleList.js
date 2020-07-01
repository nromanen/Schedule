import React from 'react';
import Card from '../../../share/Card/Card';
import { FaEdit, MdDelete } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import { selectTemporaryScheduleService } from '../../../services/temporaryScheduleService';

const TemporaryScheduleList = props => {
    const { t } = useTranslation('formElements');

    const shortId = require('shortid');

    const temporarySchedules = props.temporarySchedules || [];

    return (
        <main className="container-flex-wrap">
            {temporarySchedules.map(temporarySchedule => (
                <Card class="done-card" key={shortId.generate()}>
                    <div className="cards-btns">
                        <FaEdit
                            title={t('common:edit_hover_title')}
                            className="svg-btn edit-btn"
                            onClick={() =>
                                selectTemporaryScheduleService(
                                    temporarySchedule
                                )
                            }
                        />
                        <MdDelete
                            title={t('common:delete_hover_title')}
                            className="svg-btn delete-btn"
                        />
                    </div>
                    <p>
                        Subject:{' '}
                        <b>
                            {temporarySchedule.subjectForSite}(
                            {temporarySchedule.lessonType})
                        </b>
                    </p>
                    <p>
                        Room: <b>{temporarySchedule.room.name}</b>
                    </p>
                    <p>
                        Teacher: <b>{temporarySchedule.teacherForSite}</b>
                    </p>
                    <p>
                        Period:{' '}
                        <b>
                            {temporarySchedule.class.startTime} -{' '}
                            {temporarySchedule.class.endTime}
                        </b>
                    </p>
                    <p>
                        Group: <b>{temporarySchedule.group.title}</b>
                    </p>
                </Card>
            ))}
        </main>
    );
};

export default TemporaryScheduleList;
