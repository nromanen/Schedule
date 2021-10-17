import React from 'react';
import { Route } from 'react-router-dom';

export default function AccessRoute({ component: Component, condition, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => {
                return condition ? <Component {...props} /> : null;
            }}
        ></Route>
    );
}
