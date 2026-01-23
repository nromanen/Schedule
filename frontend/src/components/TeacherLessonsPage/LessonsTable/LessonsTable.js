import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Prompt} from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DeleteIcon from '@material-ui/icons/Delete';
import './LessonsTable.scss';
import LessonGroupRow from './LessonGroupRow';

const getCommonLink = (lessons) => {
    if (lessons.length === 0) return null;
    if (!lessons.every(lesson => lesson.linkToMeeting)) return null;

    const firstLink = lessons[0].linkToMeeting;
    return lessons.every(lesson => lesson.linkToMeeting === firstLink) ? firstLink : null;
};

const LessonsTable = ({ lessons, onUpdateLink, selectedTeacher, onUnsavedChanges, t }) => {
    const [expandedSubjects, setExpandedSubjects] = useState({});
    const [subjectLinks, setSubjectLinks] = useState({});
    const [globalLink, setGlobalLink] = useState('');
    const [rowLinks, setRowLinks] = useState({});

    const groupedBySubject = useMemo(() => {
        const subjects = {};

        lessons.forEach((lesson) => {
            const subjectName = lesson.subject?.name || '';
            const subjectId = lesson.subject?.id;
            const lessonType = lesson.lessonType || '';

            if (!subjects[subjectName]) {
                subjects[subjectName] = {
                    subjectName,
                    subjectId,
                    semesterId: lesson.semesterId,
                    types: {},
                };
            }

            if (!subjects[subjectName].types[lessonType]) {
                subjects[subjectName].types[lessonType] = {
                    subjectName,
                    subjectForSite: lesson.subjectForSite,
                    subjectId,
                    lessonType,
                    semesterId: lesson.semesterId,
                    grouped: lesson.grouped,
                    linkToMeeting: lesson.linkToMeeting,
                    lessons: [],
                };
            }
            subjects[subjectName].types[lessonType].lessons.push(lesson);
        });

        return Object.values(subjects).sort((a, b) =>
            a.subjectName.localeCompare(b.subjectName, 'uk')
        );
    }, [lessons]);

    const getSubjectCommonLink = useCallback((subject) => {
        const allLessons = Object.values(subject.types).flatMap(type => type.lessons);
        return getCommonLink(allLessons);
    }, []);

    const globalCommonLink = useMemo(() => getCommonLink(lessons), [lessons]);

    // Ініціалізація rowLinks
    useEffect(() => {
        const newRowLinks = {};
        groupedBySubject.forEach((subject) => {
            Object.values(subject.types).forEach((group) => {
                const groupKey = `${group.subjectName}_${group.lessonType}`;
                const commonLink = getCommonLink(group.lessons);
                newRowLinks[groupKey] = commonLink || '';
            });
        });
        setRowLinks(newRowLinks);
    }, [groupedBySubject]);

    useEffect(() => {
        const newSubjectLinks = {};
        groupedBySubject.forEach((subject) => {
            newSubjectLinks[subject.subjectName] = getSubjectCommonLink(subject) || '';
        });
        setSubjectLinks(newSubjectLinks);
    }, [groupedBySubject, getSubjectCommonLink]);

    useEffect(() => {
        setGlobalLink(globalCommonLink || '');
    }, [globalCommonLink]);

    useEffect(() => {
        setExpandedSubjects((prev) => {
            const newExpanded = { ...prev };
            groupedBySubject.forEach((subject) => {
                if (newExpanded[subject.subjectName] === undefined) {
                    newExpanded[subject.subjectName] = true;
                }
            });
            return newExpanded;
        });
    }, [groupedBySubject]);

    const hasUnsavedChanges = useMemo(() => {
        const globalChanged = globalLink !== (globalCommonLink || '');
        const subjectChanged = groupedBySubject.some((subject) => {
            const commonLink = getSubjectCommonLink(subject);
            return subjectLinks[subject.subjectName] !== (commonLink || '');
        });

        const rowsChanged = groupedBySubject.some((subject) => {
            return Object.values(subject.types).some((group) => {
                const groupKey = `${group.subjectName}_${group.lessonType}`;
                const commonLink = getCommonLink(group.lessons);
                return rowLinks[groupKey] !== (commonLink || '');
            });
        });

        return globalChanged || subjectChanged || rowsChanged;
    }, [globalLink, globalCommonLink, subjectLinks, groupedBySubject, rowLinks, getSubjectCommonLink]);

    useEffect(() => {
        onUnsavedChanges?.(hasUnsavedChanges);
    }, [hasUnsavedChanges, onUnsavedChanges]);

    const getLessonTypeLabel = useCallback((type) => {
        const types = {
            LECTURE: t('lesson_type_lecture') || 'Лекція',
            LABORATORY: t('lesson_type_lab') || 'Лабораторна',
            PRACTICAL: t('lesson_type_practical') || 'Практична',
        };
        return types[type] || type;
    }, [t]);

    const createLinkData = useCallback((base, extra = {}) => ({
        ...base,
        teacherId: selectedTeacher.id,
        ...extra,
    }), [selectedTeacher.id]);

    const handleApplyToAll = () => {
        if (!globalLink.trim() || globalLink === (globalCommonLink || '')) return;
        const firstLesson = lessons[0];
        if (!firstLesson) return;

        onUpdateLink(createLinkData({
            linkToMeeting: globalLink.trim(),
            semesterId: firstLesson.semesterId,
        }));
    };

    const handleDeleteAll = () => {
        const firstLesson = lessons[0];
        if (!firstLesson) return;

        onUpdateLink(createLinkData({
            linkToMeeting: null,
            semesterId: firstLesson.semesterId,
        }));
    };

    const handleApplyToSubject = (subject) => {
        const link = subjectLinks[subject.subjectName];
        const commonLink = getSubjectCommonLink(subject);
        if (!link?.trim() || link === (commonLink || '')) return;

        onUpdateLink(createLinkData({
            linkToMeeting: link.trim(),
            semesterId: subject.semesterId,
            subjectId: subject.subjectId,
        }));
    };

    const handleDeleteSubjectLink = (subject) => {
        onUpdateLink(createLinkData({
            linkToMeeting: null,
            semesterId: subject.semesterId,
            subjectId: subject.subjectId,
        }));
    };

    const handleRowLinkChange = useCallback((groupKey, value) => {
        setRowLinks(prev => ({
            ...prev,
            [groupKey]: value,
        }));
    }, []);

    const handleGroupLinkUpdate = useCallback((groupKey, group, newLink) => {
        onUpdateLink(createLinkData({
            linkToMeeting: newLink,
            semesterId: group.semesterId,
            subjectId: group.subjectId,
            lessonType: group.lessonType,
        }));
    }, [onUpdateLink, createLinkData]);

    const handleDeleteLink = useCallback((group) => {
        onUpdateLink(createLinkData({
            linkToMeeting: null,
            semesterId: group.semesterId,
            subjectId: group.subjectId,
            lessonType: group.lessonType,
        }));
    }, [onUpdateLink, createLinkData]);

    const toggleSubjectExpanded = (subjectName) => {
        setExpandedSubjects((prev) => ({
            ...prev,
            [subjectName]: !prev[subjectName],
        }));
    };

    const isSubjectExpanded = (subjectName) => expandedSubjects[subjectName] !== false;

    const subjectHasLinks = (subject) =>
        Object.values(subject.types).some(type =>
            type.lessons.some(lesson => lesson.linkToMeeting)
        );

    const subjectHasChanges = (subject) => {
        const commonLink = getSubjectCommonLink(subject);
        return subjectLinks[subject.subjectName] !== (commonLink || '');
    };

    const globalHasChanges = globalLink !== (globalCommonLink || '');

    return (
        <>
            <Prompt
                when={hasUnsavedChanges}
                message={t('unsaved_changes_warning') || 'У вас є незбережені дані. Ви впевнені, що хочете покинути сторінку?'}
            />
            <div className="lessons-table-wrapper">
                <TableContainer component={Paper} className="lessons-table-container">
                    <Table className="lessons-table" aria-label="lessons table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('groups') || 'Групи'}</TableCell>
                                <TableCell>{t('subject_name') || 'Предмет'}</TableCell>
                                <TableCell>{t('lesson_type') || 'Тип'}</TableCell>
                                <TableCell align="center">{t('grouped') || "Об'єднано"}</TableCell>
                                <TableCell>{t('current_link') || 'Поточне посилання'}</TableCell>
                                <TableCell>{t('link') || 'Посилання'}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupedBySubject.map((subject) => (
                                <React.Fragment key={subject.subjectName}>
                                    <TableRow className="subject-header-row">
                                        <TableCell colSpan={5}>
                                            <div className="subject-header">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => toggleSubjectExpanded(subject.subjectName)}
                                                    className="expand-button"
                                                >
                                                    {isSubjectExpanded(subject.subjectName)
                                                        ? <ExpandLessIcon />
                                                        : <ExpandMoreIcon />
                                                    }
                                                </IconButton>
                                                <span className="subject-title">{subject.subjectName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="subject-link-wrapper">
                                                <TextField
                                                    value={subjectLinks[subject.subjectName] || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setSubjectLinks(prev => ({
                                                            ...prev,
                                                            [subject.subjectName]: value,
                                                        }));
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    placeholder={t('enter_link') || 'Введіть посилання'}
                                                    className={`subject-link-input ${subjectHasChanges(subject) ? 'unsaved-input' : ''}`}
                                                />
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleApplyToSubject(subject)}
                                                    disabled={!subjectHasChanges(subject) || !subjectLinks[subject.subjectName]?.trim()}
                                                    className="subject-link-button"
                                                >
                                                    {t('apply_to_subject') || 'До предмету'}
                                                </Button>
                                                {subjectHasLinks(subject) && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteSubjectLink(subject)}
                                                        className="delete-subject-link-button"
                                                        title={t('delete_subject_links') || 'Видалити всі посилання предмету'}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {isSubjectExpanded(subject.subjectName) &&
                                        Object.values(subject.types)
                                            .sort((a, b) => a.lessonType.localeCompare(b.lessonType))
                                            .map((group) => {
                                                const groupKey = `${group.subjectName}_${group.lessonType}`;
                                                return (
                                                    <LessonGroupRow
                                                        key={groupKey}
                                                        groupKey={groupKey}
                                                        group={group}
                                                        linkValue={rowLinks[groupKey] || ''}
                                                        onLinkChange={handleRowLinkChange}
                                                        getLessonTypeLabel={getLessonTypeLabel}
                                                        onUpdateLink={handleGroupLinkUpdate}
                                                        onDeleteLink={handleDeleteLink}
                                                        t={t}
                                                    />
                                                );
                                            })
                                    }
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div className="global-link-section">
                    <div className="global-link-controls">
                        <TextField
                            value={globalLink}
                            onChange={(e) => setGlobalLink(e.target.value)}
                            variant="outlined"
                            size="small"
                            placeholder={t('enter_link_for_all') || 'Посилання для всіх пар'}
                            className={`global-link-input ${globalHasChanges ? 'unsaved-input' : ''}`}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApplyToAll}
                            disabled={!globalHasChanges || !globalLink.trim()}
                            className="global-link-button"
                        >
                            {t('apply_to_all') || 'Застосувати до всіх'}
                        </Button>
                        {globalCommonLink && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleDeleteAll}
                                className="delete-all-button"
                                startIcon={<DeleteIcon />}
                            >
                                {t('delete_all_links') || 'Видалити всі'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LessonsTable;