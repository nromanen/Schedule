import React, {useState} from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';

const LessonGroupRow = React.memo((props) => {
    const { group, groupKey, linkValue, getLessonTypeLabel, onUpdateLink, onDeleteLink, onLinkChange, t } = props;
    const [isExpanded, setIsExpanded] = useState(false);

    const groupTitles = group.lessons.map((l) => l.group?.title).filter(Boolean);
    const uniqueGroups = [...new Set(groupTitles)].sort((a, b) => a.localeCompare(b, 'uk'));
    const canExpand = uniqueGroups.length > 1;

    const getTypeCommonLink = () => {
        const { lessons } = group;
        if (lessons.length === 0) return null;
        const allHaveLinks = lessons.every(lesson => lesson.linkToMeeting);
        if (!allHaveLinks) return null;
        const firstLink = lessons[0].linkToMeeting;
        return lessons.every(lesson => lesson.linkToMeeting === firstLink) ? firstLink : null;
    };

    const typeCommonLink = getTypeCommonLink();
    const hasChanges = linkValue !== (typeCommonLink || '');

    const subjectDisplay = group.subjectForSite && group.subjectForSite !== group.subjectName
        ? `${group.subjectName} (${group.subjectForSite})`
        : group.subjectName;

    const handleLinkChange = (e) => {
        onLinkChange(groupKey, e.target.value);
    };

    const handleApplyLink = () => {
        if (!linkValue.trim() || !hasChanges) return;
        onUpdateLink(groupKey, group, linkValue.trim());
    };

    const handleOpenLink = (link) => {
        if (link) window.open(link, '_blank', 'noopener,noreferrer');
    };

    const renderLinkCell = (lesson) => (
        <TableCell className="link-cell">
            <div className="link-wrapper">
                {lesson?.linkToMeeting ? (
                    <span
                        className="link-text"
                        onClick={() => handleOpenLink(lesson.linkToMeeting)}
                        title={lesson.linkToMeeting}
                    >
                        {lesson.linkToMeeting.length > 30
                            ? `${lesson.linkToMeeting.substring(0, 30)}...`
                            : lesson.linkToMeeting}
                    </span>
                ) : (
                    <span className="no-link">{t('no_link') || 'Немає'}</span>
                )}
            </div>
        </TableCell>
    );

    const renderEditCell = (showDelete = true, showHint = false) => (
        <TableCell className="new-link-cell">
            <div className="new-link-wrapper">
                <TextField
                    value={linkValue}
                    onChange={handleLinkChange}
                    variant="outlined"
                    size="small"
                    placeholder={t('enter_link') || 'Введіть посилання'}
                    className={`new-link-input ${hasChanges ? 'unsaved-input' : ''}`}
                />
                <IconButton
                    size="small"
                    onClick={handleApplyLink}
                    disabled={!hasChanges || !linkValue.trim()}
                    className="apply-button"
                    title={t('apply') || 'Застосувати'}
                >
                    <CheckIcon />
                </IconButton>
                {showDelete && typeCommonLink && (
                    <IconButton
                        size="small"
                        onClick={() => onDeleteLink?.(group)}
                        className="delete-link-button"
                        title={t('delete_link') || 'Видалити посилання'}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
            </div>
            {showHint && (
                <span className="link-hint">
                {t('link_applies_to_all_groups') || '⚠ Застосується до всіх груп'}
            </span>
            )}
        </TableCell>
    );

    const renderGroupsCell = (title, showExpand, onExpandClick) => (
        <TableCell>
            <div className="groups-cell">
                {showExpand ? (
                    <IconButton size="small" onClick={onExpandClick} className="expand-button">
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                ) : (
                    <span className="expand-placeholder" />
                )}
                <span className="groups-list">{title}</span>
            </div>
        </TableCell>
    );

    const renderCommonCells = (lesson, showEdit = false, showHint = false) => (
        <>
            <TableCell>{subjectDisplay}</TableCell>
            <TableCell>{getLessonTypeLabel(group.lessonType)}</TableCell>
            <TableCell align="center">
                {lesson?.grouped && <CheckCircleIcon className="grouped-icon" />}
            </TableCell>
            {renderLinkCell(lesson)}
            {showEdit ? renderEditCell(true, showHint) : <TableCell />}
        </>
    );

    const renderCollapsedRow = () => (
        <TableRow className="lesson-group-row type-last-row">
            {renderGroupsCell(uniqueGroups.join(', '), canExpand, () => setIsExpanded(true))}
            {renderCommonCells(group, true)}
        </TableRow>
    );

    const renderExpandedRows = () => {
        const { lessons } = group;
        const totalLessons = lessons.length;

        return (
            <>
                <TableRow className={`lesson-group-row expanded-header ${totalLessons === 1 ? 'type-last-row' : ''}`}>
                    {renderGroupsCell(lessons[0]?.group?.title || '-', true, () => setIsExpanded(false))}
                    {renderCommonCells(lessons[0], true, canExpand)}
                </TableRow>

                {lessons.slice(1).map((lesson, index) => (
                    <TableRow
                        key={lesson.id || index}
                        className={`lesson-group-row expanded-row ${index === totalLessons - 2 ? 'type-last-row' : ''}`}
                    >
                        {renderGroupsCell(lesson.group?.title || '-', false, null)}
                        {renderCommonCells(lesson, false)}
                    </TableRow>
                ))}
            </>
        );
    };

    if (!canExpand) return renderCollapsedRow();

    return isExpanded ? renderExpandedRows() : renderCollapsedRow();
});

export default LessonGroupRow;