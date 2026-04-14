import React from 'react';
import './Card.scss';

const Card = ({ children, additionClassName = '', variant = 'default' }) => (
    <div className={`card ${variant === 'entity' ? 'card--entity' : ''} ${additionClassName}`}>
        {children}
    </div>
);

export default Card;
