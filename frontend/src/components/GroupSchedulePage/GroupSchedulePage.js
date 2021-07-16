import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    PUBLIC_DOWNLOAD_GROUP_SCHEDULE_URL,
    PUBLIC_DOWNLOAD_TEACHER_SCHEDULE_URL
} from '../../constants/axios';

import './GroupSchedulePage.scss';
import { MdPictureAsPdf } from 'react-icons/md';

import {
    makeGroupSchedule,
    makeFullSchedule,
    makeTeacherSchedule
} from '../../helper/prepareSchedule';
import {
    renderGroupTable,
    renderFullSchedule,
    renderWeekTable
} from '../../helper/renderScheduleTable';
import {
    setScheduleGroupIdService,
    setScheduleSemesterIdService,
    setScheduleTeacherIdService,
    submitSearchSchedule, submitSearchSchedule1
} from '../../services/scheduleService';

import GroupSchedulePageTop from '../GroupSchedulePageTop/GroupSchedulePageTop';
import { setLoadingService } from '../../services/loadingService';
import {useHistory,useLocation} from 'react-router-dom';
import { links } from '../../constants/links';
const GroupSchedulePage = props => {
    const [schedule,setSchedule]=useState("");
    let { groupSchedule, fullSchedule, teacherSchedule } = props;
    let history = useHistory();

    const location = useLocation();
    const emptySchedule = () => (
        <p className="empty_schedule">{t('common:empty_schedule')}</p>
    );
    const { t } = useTranslation('common');
    const renderDownloadLink = (entity, semesterId, entityId) => {
        let link = '';
        if (semesterId && entityId) {
            switch (entity) {
                case 'group':
                    link =
                        PUBLIC_DOWNLOAD_GROUP_SCHEDULE_URL +
                        '?groupId=' +
                        entityId +
                        '&semesterId=' +
                        semesterId;
                    break;
                case 'teacher':
                    link =
                        PUBLIC_DOWNLOAD_TEACHER_SCHEDULE_URL +
                        '?teacherId=' +
                        entityId +
                        '&semesterId=' +
                        semesterId;
                    break;
                default:
                    break;
            }
            return (
                <a
                    href={link}
                    target="_blank"
                    rel="noreferrer noopener"
                    variant="contained"
                    color="primary"
                    className="pdf_link"
                    download
                >
                    <MdPictureAsPdf className="svg-btn" />
                    {t('common:download_pdf')}
                </a>
            );
        }
    };

    const renderGroupScheduleTitle = (semester, group) => {
        let title = '';
        if (semester) {
            title +=
                semester.description +
                ' (' +
                semester.startDay +
                '-' +
                semester.endDay +
                ') : ';
        }
        if (group) {
            title += group.title ? group.title : '';
        }
        return title;
    };
    const renderTeacherScheduleTitle = (semester, teacher) => {
        let title = '';
        if (semester) {
            title +=
                semester.description +
                ' (' +
                semester.startDay +
                '-' +
                semester.endDay +
                ') : ';
        }
        if (teacher) {
            title +=
                teacher.position +
                ' ' +
                teacher.surname +
                ' ' +
                teacher.name +
                ' ' +
                teacher.patronymic;
        }
        return title;
    };

    const renderSchedule = () => {


        switch (props.scheduleType) {
            case 'group':
                if (
                    (!groupSchedule ||
                        (groupSchedule.schedule &&
                            groupSchedule.schedule.length === 0)) &&
                    !props.loading
                ) {
                    return emptySchedule();
                }

                const resultArrays = makeGroupSchedule(groupSchedule);
                if (resultArrays.done) {
                    setLoadingService(false);
                    return (
                        <>
                            <h1>
                                {renderGroupScheduleTitle(
                                    resultArrays.semester,
                                    resultArrays.group
                                )}
                                {renderDownloadLink(
                                    'group',
                                    props.semesterId,
                                    props.groupId
                                )}
                            </h1>
                            <h2>{t('common:odd_week')}</h2>
                            {renderGroupTable(
                                resultArrays.oddArray,
                                1,
                                resultArrays.semester
                            )}
                            <h2>{t('common:even_week')}</h2>
                            {renderGroupTable(
                                resultArrays.evenArray,
                                0,
                                resultArrays.semester
                            )}
                        </>
                    );
                }
                else setLoadingService(false)
                break;
            case 'teacher':
                if (
                    (!teacherSchedule ||
                        !teacherSchedule.days ||
                        teacherSchedule.days.length === 0) &&
                    !props.loading
                ) {
                    return emptySchedule();
                }
                    if(teacherSchedule) {
                        const teacher = makeTeacherSchedule(teacherSchedule);
                        if (teacher.done) {
                            setLoadingService(false);
                            return (
                                <>
                                    <h1>
                                        {renderTeacherScheduleTitle(
                                            teacher.semester,
                                            teacher.teacher
                                        )}
                                        {renderDownloadLink(
                                            'teacher',
                                            props.semesterId,
                                            props.teacherId
                                        )}
                                    </h1>
                                    <h2>{t('common:odd_week')}</h2>
                                    {renderWeekTable(teacher.odd, 1)}
                                    <h2>{t('common:even_week')}</h2>
                                    {renderWeekTable(teacher.even, 0)}
                                </>
                            );
                        }
                    }
                    else setLoadingService(false)
                break;
            case 'full':
                if (
                    (!fullSchedule.schedule ||
                        fullSchedule.schedule.length === 0) &&
                    !props.loading
                ) {
                    return emptySchedule();
                }
                const result = makeFullSchedule(fullSchedule);
                if (result.groupsCount || result.done) {
                    setLoadingService(false);
                    return renderFullSchedule(result);
                }
                else setLoadingService(false)
                break;
            case 'archived':
                if (
                    (!fullSchedule.schedule ||
                        fullSchedule.schedule.length === 0) &&
                    !props.loading
                ) {
                    return '';
                }
                const archive = makeFullSchedule(fullSchedule);
                if (archive.groupsCount || archive.done) {
                    setLoadingService(false);
                    return renderFullSchedule(archive);
                }
                else setLoadingService(false)
                break;


            default:
                return;
        }
    };

    const handleSubmit = values => {
        const {semester,group,teacher}=values
        const groupPath=group?"&group="+group:"";
        const teacherPath=teacher?"&teacher="+teacher:"";
        setLoadingService('true');
        submitSearchSchedule(values, history);

        history.push(links.ScheduleFor+"?semester="+semester+groupPath+teacherPath)




    };
   const getSchedule=()=>{
        console.log("getSchedule", props,location)
       if((props.scheduleType==="")&&(props.defaultSemester.semester!==undefined)){
           const semester=`${props.defaultSemester.semester.id}`;
          console.log("default",props.defaultSemester.semester)
           handleSubmit({ "semester":semester });
           return
       }
       if(props.scheduleType!==""|| location.pathname===links.HOME_PAGE){
           console.log("if(props.scheduleType!== location.search===links.HOME_PAGE){")
           return renderSchedule();
       }


       const params = new URLSearchParams(location.search);

       const semester= params.get("semester");
       const teacher=params.get("teacher");
       const group=params.get("group");

       // const groupPath=group?"&group="+group:"";
       // const teacherPath=teacher?"&teacher="+teacher:"";
       // history.push(links.ScheduleFor+"?semester="+12+groupPath+teacherPath)
       console.log("ASFDGHJKL")
       if(semester!==null) {

           handleSubmit({ semester, 'group': group != null ? group : 0, 'teacher': teacher != null ? teacher : 0 });

           console.log("set",semester,teacher,group);
        return null
       }
       else return null;
    }
    const getTop=()=>{

       if(props.scheduleType !== 'archived') {
         return ( <GroupSchedulePageTop
             scheduleType={props.scheduleType}
               history={history} onSubmit={handleSubmit} />);
       }
       return null;
    }
    return (
        <>
            {/*{*/}
            {/*    props.scheduleType !== 'archived' ? (*/}
            {/*    <GroupSchedulePageTop*/}
            {/*        history={history} onSubmit={handleSubmit} />*/}
            {/*) : (*/}
            {/*    ''*/}
            {/*)*/}
            {/*}*/}

            {getTop()}

            {getSchedule()}

        </>
    );
};
const mapStateToProps = state => ({
    scheduleType: state.schedule.scheduleType,
    groupSchedule: state.schedule.groupSchedule,
    fullSchedule: state.schedule.fullSchedule,
    teacherSchedule: state.schedule.teacherSchedule,
    groupId: state.schedule.scheduleGroupId,
    teacherId: state.schedule.scheduleTeacherId,
    semesterId: state.schedule.scheduleSemesterId,
    loading: state.loadingIndicator.loading,
    defaultSemester: state.schedule.defaultSemester
});
export default connect(mapStateToProps)(GroupSchedulePage);
