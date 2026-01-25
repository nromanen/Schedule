import React, { useState } from 'react';
import './DraggableCard.scss';

export const DraggableCard = (props) => {
    const { children, item, dragAndDropItem, setGroupStart, cardClassName = 'group-card' } = props;
    const [isDragging, setIsDragging] = useState(false);

    const findCard = (e) => {
        return e.target.closest(`.${cardClassName}`);
    };

    const dragStartHandler = (card) => {
        setIsDragging(true);
        setGroupStart(card);
    };

    const dragEndHandler = () => {
        setIsDragging(false);
    };

    const dragLeaveHandler = (e) => {
        const card = findCard(e);
        if (card) {
            card.classList.remove('drag-border-card');
        }
    };

    const dragOverHandler = (e) => {
        e.preventDefault();
        const card = findCard(e);
        if (card) {
            card.classList.add('drag-border-card');
        }
    };

    const dropHandler = (e, cardItem) => {
        e.preventDefault();
        const card = findCard(e);
        if (card) {
            card.classList.remove('drag-border-card');
        }
        dragAndDropItem(cardItem.id);
    };

    return (
        <div
            className={`drag-and-drop-card ${isDragging ? 'dragging' : ''}`}
            onDragStart={() => dragStartHandler(item)}
            onDragEnd={dragEndHandler}
            onDragLeave={(e) => dragLeaveHandler(e)}
            onDragOver={(e) => dragOverHandler(e)}
            onDrop={(e) => dropHandler(e, item)}
            draggable
        >
            {children}
        </div>
    );
};