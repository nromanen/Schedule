import React from 'react';
import { FaSadCry } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import './NotFound.scss';

const NotFound = ({ name }) => {
    const { t } = useTranslation('formElements');

    return (
        <div className="not-found__wrapper">
            <div>
                <FaSadCry className="not-found__icon" />
            </div>
            <p className="not-found__text">
                {t('there_is_no')} {name}
            </p>
        </div>
    );
};

export default NotFound;
