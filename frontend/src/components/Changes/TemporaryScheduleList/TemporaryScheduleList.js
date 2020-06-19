import React from 'react';
import Card from '../../../share/Card/Card';
import { FaEdit, MdDelete } from 'react-icons/all';
import { useTranslation } from 'react-i18next';

const TemporaryScheduleList = props => {
    const { t } = useTranslation('common');

    const changes = props.changes || [];
    return (
        <section className="container-flex-wrap">
            {changes.length > 0 ? (
                changes.map(change => (
                    <Card class="done-card" key={change.id}>
                        <div className="cards-btns">
                            <FaEdit
                                title={t('delete_lesson_changes')}
                                className="svg-btn edit-btn"
                            />
                            <MdDelete
                                title={t('edit_lesson_lesson')}
                                className="svg-btn delete-btn"
                            />
                        </div>
                    </Card>
                ))
            ) : (
                <section className="centered-container">
                    <h2>{t('no_changes')}</h2>
                </section>
            )}
        </section>
    );
};

export default TemporaryScheduleList;
