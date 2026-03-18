import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Switch, FormControlLabel } from '@material-ui/core';
import './SchedulePublishBanner.scss';
import { DELETE, POST } from "../../../constants/methods";
import { axiosCall } from "../../../services/axios";
import { setSchedulePublished } from "../../../actions/schedule";

const SchedulePublishBanner = ({ published, setPublished }) => {
    const { t } = useTranslation('common');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        axiosCall('schedules/public/status')
            .then(({ data }) => {
                if (isMounted) setPublished(data.published);
            })
            .catch(console.error)
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggle = () => {
        if (published) {
            axiosCall('schedules/publish', DELETE)
                .then(() => setPublished(false)) // → Redux
                .catch(console.error);
        } else {
            axiosCall('schedules/publish', POST)
                .then(() => setPublished(true)) // → Redux
                .catch(console.error);
        }
    };

    if (loading) return null;

    return (
        <FormControlLabel
            className={`schedule-publish-banner ${published ? 'published' : 'unpublished'}`}
            control={
                <Switch
                    checked={published}
                    onChange={handleToggle}
                    color="primary"
                    size="small"
                />
            }
            label={published ? t('schedule_is_published') : t('admin_schedule_not_published')}
            labelPlacement="start"
        />
    );
};

const mapStateToProps = (state) => ({
    published: state.schedule.schedulePublished,
});

const mapDispatchToProps = (dispatch) => ({
    setPublished: (val) => dispatch(setSchedulePublished(val)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePublishBanner);