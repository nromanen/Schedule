import React from 'react';
import Card from '../../../share/Card/Card';
import { FaEdit, MdDelete } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import { selectTemporaryScheduleService } from '../../../services/temporaryScheduleService';
import Divider from '@material-ui/core/Divider';
import { handleTeacherShortInfo } from '../../../helper/handleTeacherInfo';

const TemporaryScheduleList = props => {
    const { t } = useTranslation('common');

    const shortId = require('shortid');

    const temporarySchedules = props.temporarySchedules || [];

    return (
        <main className="container-flex-wrap">
            {temporarySchedules.map(temporarySchedule => (
                <Card
                    class={
                        'done-card' +
                        (temporarySchedule.vacation ? ' vacation-card' : '')
                    }
                    key={shortId.generate()}
                >
                    <div className="cards-btns">
                        <FaEdit
                            title={t('edit_hover_title')}
                            className="svg-btn edit-btn"
                            onClick={() =>
                                selectTemporaryScheduleService(
                                    temporarySchedule
                                )
                            }
                        />
                        <MdDelete
                            title={t('delete_hover_title')}
                            className="svg-btn delete-btn"
                        />
                    </div>
                    {!temporarySchedule.vacation ? (
                        <>
                            <p>
                                Subject:{' '}
                                <b>
                                    {temporarySchedule.subjectForSite}(
                                    {temporarySchedule.lessonType})
                                </b>
                            </p>
                            <p>
                                Room: <b>{temporarySchedule.room?.name}</b>
                            </p>
                            <p>
                                Teacher:{' '}
                                <b>{temporarySchedule.teacherForSite}</b>
                            </p>
                            <p>
                                Period:{' '}
                                <b>
                                    {temporarySchedule.class?.startTime} -{' '}
                                    {temporarySchedule.class?.endTime}
                                </b>
                            </p>
                            <p>
                                Group: <b>{temporarySchedule.group?.title}</b>
                            </p>
                        </>
                    ) : (
                        <>
                            <h2>{t('holiday_label')}</h2>
                            <p>
                                (
                                {temporarySchedule.teacher?.name
                                    ? handleTeacherShortInfo(
                                          temporarySchedule.teacher
                                      )
                                    : t('for_all')}
                                )
                            </p>
                            <Divider />
                        </>
                    )}
                    <p>
                        {!temporarySchedule.vacation && <>Date:</>}
                        <b>{temporarySchedule.date}</b>
                    </p>
                </Card>
            ))}
        </main>
    );
};

export default TemporaryScheduleList;
