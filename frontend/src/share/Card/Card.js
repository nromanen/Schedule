import React, { useRef, useState } from 'react';

import './Card.scss';
import { connect } from 'react-redux';
import { colors } from '../../constants/schedule/colors';

import { cssClasses } from '../../constants/schedule/cssClasses';
import { setItemGroupId } from '../../actions';

// TODO: #30 Refactor Card shared component
const Card = (props) => {
    const { id, children, additionClassName = '', draggable = false, setGroupIdToItem } = props;
    const [groupId, setGroupId] = useState(0);
    const dragItemNode = useRef();
    const dragItem = useRef();

    const setNewGroupId = (newGroupId) => {
        setGroupId(newGroupId);
    };

    const handleDragEnd = () => {
        const groupTitleEl = document.querySelector(`.group-${groupId}`);
        const allBoards = document.querySelectorAll('#schedule-board');
        const groupTitles = document.querySelectorAll('#group-title');
        const boards = document.querySelectorAll(`#group-${groupId}`);

        if (groupTitleEl) {
            groupTitleEl.style.backgroundColor = colors.NOTHING;
        }
        boards.forEach((board, index) => {
            boards[index].style.background = colors.NOTHING;
        });
        allBoards.forEach((board, index) => {
            allBoards[index].style.display = 'flex';
        });
        groupTitles.forEach((board, index) => {
            groupTitles[index].style.display = 'flex';
        });

        dragItem.current = null;
        dragItemNode.current.removeEventListener('dragend', handleDragEnd);
        dragItemNode.current = null;
    };

    const dragStart = (e) => {
        const item = JSON.parse(e.target.childNodes[0].value);
        setNewGroupId(item.lesson.group.id);
        const groupTitle = document.querySelector(`#group-${item.lesson.group.id}`);
        groupTitle.style.backgroundColor = colors.ALLOW;
        const boards = document.querySelectorAll(`.group-${item.lesson.group.id}`);

        setTimeout(() => {
            groupTitle.style.display = 'flex';
            boards.forEach((board, index) => {
                boards[index].style.display = 'flex';
                if (board.classList.contains(cssClasses.MORE_ICON)) {
                    boards[index].style.background = colors.POSSIBILITY;
                }
            });
        }, 50);

        setGroupIdToItem(item.lesson.group.id);

        dragItemNode.current = e.target;
        dragItemNode.current.addEventListener('dragend', handleDragEnd);

        e.dataTransfer.setData('card_id', dragItemNode.current.id);
    };

    return (
        <div
            id={id}
            className={`card ${additionClassName}`}
            onDragStart={dragStart}
            draggable={draggable}
        >
            {children}
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    setGroupIdToItem: (id) => dispatch(setItemGroupId(id)),
});

export default connect(null, mapDispatchToProps)(Card);
