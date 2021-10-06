import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import { FaEdit } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Card from '../../share/Card/Card';
import WishForm from '../../components/AddTeacherWishForm/WishForm';

import {
    getMyTeacherWishesService,
    selectTeacherWishService,
    updateTeacherWishService,
} from '../../services/teacherWishService';

import { getPublicClassScheduleListService } from '../../services/classService';

import './WishModal.scss';
import { userRoles } from '../../constants/userRoles';
import { getTeacherFullName } from '../../helper/renderTeacher';

const WishModal = (props) => {
    const { t } = useTranslation('common');
    const { onCloseWish, teacher, classScheduler, teacherWishes, openWish } = props;

    const [showForm, setShowForm] = useState(false);

    useEffect(() => getPublicClassScheduleListService, []);

    const class_names = [];

    if (classScheduler.length - 1 > 0) {
        classScheduler.map((classSchedulerOne) => {
            class_names.push(classSchedulerOne.class_name);
        });
    }

    let teacherWishList = [];

    if (teacherWishes[0] !== undefined) {
        teacherWishes.map((wishes) => {
            for (let i = 0; i < wishes.length; i++) {
                teacherWishList.push(wishes[i]);
            }
        });
    } else {
        teacherWishList = undefined;
    }

    const selectWishCard = (day) => {
        selectTeacherWishService(day);
    };

    const teacherWishSubmit = (values) => {
        const someWish = {
            day_of_week: values.day_of_week,
            evenOdd: values.evenOdd,
            class_status: [],
        };

        for (let i = 0; i <= classScheduler.length - 1; i++) {
            const new_class_status = {
                class_name: class_names[i],
                status: values[`class_number${class_names[i]}`],
            };

            someWish.class_status.push(new_class_status);
        }

        updateTeacherWishService(someWish, props.teacherWishes);
    };

    const handleClose = () => {
        onCloseWish();
        setShowForm(!showForm);
    };

    return (
        <Dialog onClose={handleClose} open={openWish} maxWidth="lg">
            <h2 className="modal-teacher-title">
                {t('teacher_wish_heading', {
                    teacherName: getTeacherFullName(teacher),
                })}
            </h2>

            <div className="cards-container">
                <Card class="wish-modal">
                    {showForm ? (
                        <WishForm
                            teacherWishId={teacher.id}
                            classScheduler={classScheduler}
                            onSubmit={teacherWishSubmit}
                            teacherWishList={teacherWishList}
                            selectWishCard={selectWishCard}
                        />
                    ) : (
                        <>{t('teacher_wish_edit_wish')}</>
                    )}
                </Card>

                <section className="container-flex-wrap">
                    {teacherWishList !== undefined ? (
                        <div className="wish-card">
                            {teacherWishList.map((teacherWish, index) => (
                                <Card class="day-week-status" key={index}>
                                    <div className="cards-btns">
                                        <FaEdit
                                            className="svg-btn edit-btn"
                                            title={t('edit_hover_title')}
                                            onClick={() => {
                                                selectWishCard(teacherWish.day_of_week);
                                                setShowForm(true);
                                            }}
                                        />
                                    </div>
                                    <h3 className="wish-title-day">
                                        {t(`day_of_week_${teacherWish.day_of_week}`)}
                                    </h3>
                                    {teacherWish.class_status.map((class_status, index) => (
                                        <div className="class-status-block" key={index}>
                                            <span>
                                                {t('teacher_wish_class')} {class_status.class_name}
                                            </span>
                                            <span className={`_${class_status.status}`}>
                                                {t(
                                                    `teacher_wish_class_status_${class_status.status}`,
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card class="teacher-without-wishes">
                            <p>{t('teacher_wish_no_wish')}</p>
                        </Card>
                    )}
                </section>
            </div>
        </Dialog>
    );
};

WishModal.propTypes = {
    onCloseWish: PropTypes.func.isRequired,
    openWish: PropTypes.bool.isRequired,
};

export default WishModal;
