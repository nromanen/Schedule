import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, FormControlLabel } from '@material-ui/core';
import './SchedulePublishBanner.scss';
import {DELETE, POST} from "../../../constants/methods";
import {axiosCall} from "../../../services/axios";

const SchedulePublishBanner = () => {
    const { t } = useTranslation('common');
    const [published, setPublished] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosCall('schedules/public/status')
            .then(({ data }) => setPublished(data.published))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleToggle = () => {
        if (published) {
            axiosCall('schedules/publish', DELETE)
                .then(() => setPublished(false))
                .catch(console.error);
        } else {
            axiosCall('schedules/publish', POST)
                .then(() => setPublished(true))
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

export default SchedulePublishBanner;