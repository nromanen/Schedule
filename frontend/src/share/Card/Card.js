import React, { useRef } from 'react';

import './Card.scss';
import { colors } from '../../constants/schedule/colors';

import { setItemGroupIdService } from '../../services/scheduleService';
import { cssClasses } from '../../constants/schedule/cssClasses';

const Card = props => {
    let className = 'card';
    if (props.class) {
        className = className.concat(' ' + props.class);
    }

    let card = <div className={className}>{props.children}</div>;

    const dragItemNode = useRef();
    const dragItem = useRef();

    if (props.draggable) {
        const dragStart = e => {
            const item = JSON.parse(e.target.childNodes[0].value);
            const groupId = item.lesson.group.id;
            const groupTitle = document.getElementById(`group-${groupId}`);
            groupTitle.style.backgroundColor = colors.ALLOW;
            const boards = document.getElementsByClassName(`group-${groupId}`);

            const allBoards = document.getElementsByClassName('schedule-board');
            const groupTitles = document.getElementsByClassName('group-title');

            setTimeout(() => {
                for (const board of allBoards) {
                    board.style.display = 'none';
                }

                for (const groupTitle of groupTitles) {
                    groupTitle.style.display = 'none';
                }

                groupTitle.style.display = 'flex';

                for (const board of boards) {
                    board.style.display = 'flex';
                    if (
                        board.childNodes[0].classList.contains(
                            cssClasses.MORE_ICON
                        ) &&
                        !board.childNodes[1]
                    ) {
                        board.style.background = colors.POSSIBILITY;
                    }
                }
            }, 50);

            setItemGroupIdService(groupId);

            dragItemNode.current = e.target;
            dragItemNode.current.addEventListener('dragend', handleDragEnd);

            e.dataTransfer.setData('card_id', dragItemNode.current.id);
        };

        const handleDragEnd = e => {
            const groupId = +JSON.parse(e.target.childNodes[0].value).lesson
                .group.id;
            const groupTitleEl = document.getElementById(`group-${groupId}`);

            const allBoards = document.getElementsByClassName('schedule-board');
            const groupTitles = document.getElementsByClassName('group-title');

            const boards = document.getElementsByClassName(`group-${groupId}`);

            if (groupTitleEl) {
                groupTitleEl.style.backgroundColor = colors.NOTHING;
            }
            for (const board of boards) {
                if (board) {
                    board.style.background = colors.NOTHING;
                }
            }

            for (let board of allBoards) {
                board.style.display = 'flex';
            }

            for (const groupTitle of groupTitles) {
                groupTitle.style.display = 'flex';
            }

            dragItem.current = null;
            dragItemNode.current.removeEventListener('dragend', handleDragEnd);
            dragItemNode.current = null;
        };

        card = (
            <div
                id={props.id}
                className={className}
                onDragStart={dragStart}
                draggable={props.draggable}
            >
                {props.children}
            </div>
        );
    }

    return <>{card}</>;
};

export default Card;
