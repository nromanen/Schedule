import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { components } from 'react-select';
import ReactSelect from 'react-select';
import { useTranslation } from 'react-i18next';
import './BusyRoomsPage.scss';
import BusyRoomsTable from './BustRoomsTable/BusyRoomsTable';
import SemesterLegend from '../SemesterLegend/SemesterLegend';
import { COMMON_TABLE_COLUMNS_SIZE } from '../../constants/translationLabels/common';
import { columnSizeArray } from '../../constants/schedule/schedule';
import BusyRoomsLegend from './BusyRoomsLegend/BusyRoomsLegend';
import { useCombinedBusyRooms } from '../../hooks/useRooms';
import { useMergedBusyRooms } from '../../hooks/useMergedBusyRooms';
import { useRoomFilters } from '../../hooks/useRoomFilters';
import { exportRoomPdf } from './exportRoomPdf';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';

const ValueContainer = ({ children, getValue, ...props }) => {
    const selected = getValue();
    if (selected.length > 3) {
        return (
            <components.ValueContainer {...props}>
                {`${selected.length} аудиторій`}
            </components.ValueContainer>
        );
    }
    return (
        <components.ValueContainer {...props}>
            {children}
        </components.ValueContainer>
    );
};

const BusyRoomsPage = () => {
    const { t } = useTranslation('common');
    const [columnsSize, setColumnsSize] = useState(
        localStorage.getItem('roomsTableColumnsSize') || 'base',
    );
    const [activeSemesterIds, setActiveSemesterIds] = useState([]);
    const [filtersOpen, setFiltersOpen] = useState(true);

    const { data: combinedBusyRooms, isLoading } = useCombinedBusyRooms();

    const semesters = combinedBusyRooms?.semesters || [];
    const semesterIds = semesters.map(s => s.id).join(',');

    useEffect(() => {
        if (semesters.length) {
            setActiveSemesterIds(semesters.map(s => s.id));
        }
    }, [semesterIds]);

    const mergedBusyRooms = useMergedBusyRooms(combinedBusyRooms, activeSemesterIds);

    const {
        roomTypes,
        roomOptions,
        selectedOptions,
        filteredRooms,
        activeRoomTypes,
        selectedRoomIds,
        handleRoomTypeToggle,
        handleRoomSelect,
    } = useRoomFilters(mergedBusyRooms);

    const handleChange = ({ target }) => {
        setColumnsSize(target.value);
        localStorage.setItem('roomsTableColumnsSize', target.value);
    };

    const handleSemesterToggle = (semesterId) => {
        setActiveSemesterIds(prev =>
            prev.includes(semesterId)
                ? prev.filter(id => id !== semesterId)
                : [...prev, semesterId]
        );
    };

    const days = semesters[0]?.semester_days || [];
    const classes = semesters[0]?.semester_classes || [];

    const handlePdfExport = () => exportRoomPdf(filteredRooms[0], days, classes, t);

    const isSingleRoomSelected = filteredRooms.length === 1;

    return (
        <section className="schedule-card busy-rooms-control-panel">
            {isLoading ? (
                <CircularProgress className="loading-circle" />
            ) : (
                <>
                    <div className="filters-header">
                        <IconButton onClick={() => setFiltersOpen(prev => !prev)}>
                            {filtersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon fontSize="large" />}
                        </IconButton>
                    </div>
                    {filtersOpen && (
                        <div className="table-size-container">
                            <div className="control-block">
                                <FormControl component="div" className="radio-control">
                                    <FormLabel component="legend">{`${t(COMMON_TABLE_COLUMNS_SIZE)}:`}</FormLabel>
                                    <RadioGroup
                                        aria-label="columns-size"
                                        className="radio-group"
                                        value={columnsSize}
                                        onChange={handleChange}
                                    >
                                        {columnSizeArray.map((item) => (
                                            <FormControlLabel
                                                key={item.value}
                                                value={item.value}
                                                control={<Radio />}
                                                label={t(item.label)}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </div>

                            <div className="control-block">
                                <FormControl component="div" className="radio-control">
                                    <FormLabel component="legend">{t('room_type_label')}:</FormLabel>
                                    <div className="radio-group">
                                        {roomTypes.map(type => (
                                            <FormControlLabel
                                                key={type}
                                                control={
                                                    <Checkbox
                                                        checked={activeRoomTypes.includes(type)}
                                                        onChange={() => handleRoomTypeToggle(type)}
                                                    />
                                                }
                                                label={type}
                                            />
                                        ))}
                                    </div>
                                </FormControl>
                                <FormControl component="div" className="radio-control">
                                    <FormLabel component="legend">{t('choose_rooms_label')}:</FormLabel>
                                    <ReactSelect
                                        classNamePrefix="react-select"
                                        options={roomOptions}
                                        value={selectedRoomIds === null ? [] : selectedOptions}
                                        onChange={handleRoomSelect}
                                        isMulti
                                        isClearable
                                        hideSelectedOptions={false}
                                        closeMenuOnSelect={false}
                                        menuPlacement="auto"
                                        placeholder={t('all_rooms_label')}
                                        components={{ ValueContainer }}
                                        styles={{
                                            container: (base) => ({ ...base, minWidth: '200px', width: '200px' }),
                                            menu: (base) => ({ ...base, zIndex: 9999 }),
                                        }}
                                    />
                                </FormControl>
                            </div>

                            {semesters.length > 1 && (
                                <div className="control-block">
                                    <SemesterLegend
                                        semesters={semesters}
                                        activeSemesterIds={activeSemesterIds}
                                        onToggle={handleSemesterToggle}
                                    />
                                    <BusyRoomsLegend />
                                </div>
                            )}

                            {isSingleRoomSelected && (
                                <IconButton onClick={handlePdfExport}>
                                    <PictureAsPdfIcon />
                                </IconButton>
                            )}
                        </div>
                    )}
                    <BusyRoomsTable
                        days={days}
                        t={t}
                        columnsSize={columnsSize}
                        classes={classes}
                        busyRooms={filteredRooms}
                        activeSemesterIds={activeSemesterIds}
                    />
                </>
            )}
        </section>
    );
};

export default BusyRoomsPage;