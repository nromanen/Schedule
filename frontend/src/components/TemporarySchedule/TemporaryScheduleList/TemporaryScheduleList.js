import React from 'react';
import Card from '../../../share/Card/Card';
import { FaEdit, MdDelete } from 'react-icons/all';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';

const TemporaryScheduleList = props => {
    const { t } = useTranslation('common');

    const changes = props.changes || [];
    return (
        <>
            {/*{changes.length > 0 ? (*/}
            {/*    changes.map(change => (*/}
            {/*        <Card class="done-card" key={change.id}>*/}
            {/*            <div className="cards-btns">*/}
            {/*                <FaEdit*/}
            {/*                    title={t('delete_lesson_changes')}*/}
            {/*                    className="svg-btn edit-btn"*/}
            {/*                />*/}
            {/*                <MdDelete*/}
            {/*                    title={t('edit_lesson_lesson')}*/}
            {/*                    className="svg-btn delete-btn"*/}
            {/*                />*/}
            {/*            </div>*/}
            {/*        </Card>*/}
            {/*    ))*/}
            {/*) : (*/}
            {/*    <section className="centered-container">*/}
            {/*        <h2>{t('no_changes')}</h2>*/}
            {/*    </section>*/}
            {/*)}*/}
            <section className="temporary-schedule-row">
                <Card class="done-card" key={1}>
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
                    Hello
                </Card>
                <Divider orientation="vertical" flexItem className="divider" />
                <Card class="done-card" key={1}>
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
                    Hello
                </Card>
            </section>
            <section className="temporary-schedule-row">
                <Card class="done-card" key={1}>
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
                    Hello
                </Card>
            </section>
            <section className="temporary-schedule-row">
                <Card class="done-card" key={1}>
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
                    Hello
                </Card>
                <Divider orientation="vertical" flexItem className="divider" />
                <Card class="done-card" key={1}>
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
                    Hello
                </Card>
            </section>
            <section className="temporary-schedule-row">
                <Card class="done-card" key={1}>
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
                    Hello
                </Card>
            </section>
        </>
    );
};

export default TemporaryScheduleList;
