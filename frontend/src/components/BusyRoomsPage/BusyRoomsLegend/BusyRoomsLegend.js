import React, { useState } from 'react';
import './BusyRoomsLegend.scss';

// Cell availability colors - synchronize with styles/colors.scss
const LEGEND_ITEMS = [
    { color: '#90ee90', label: 'Один семестр — все ок' },
    { color: '#f7f7c1', label: 'Один семестр — один викладач, різні предмети' },
    { color: '#2196f3', label: 'Другий семестр — все ок' },
    { color: '#a1887f', label: 'Другий семестр — один викладач, різні предмети' },
    { color: '#fdba74', label: 'Обидва семестри' },
    { color: '#ff7f7f', label: 'Різні викладачі' },
];

const BusyRoomsLegend = ({ t }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="busy-rooms-legend">
            <button
                className="busy-rooms-legend__toggle"
                onClick={() => setOpen(prev => !prev)}
            >
                ?
            </button>
            {open && (
                <div className="busy-rooms-legend__popup">
                    {LEGEND_ITEMS.map((item) => (
                        <div key={item.color} className="busy-rooms-legend__item">
                            <span
                                className="busy-rooms-legend__color"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="busy-rooms-legend__label">{item.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BusyRoomsLegend;