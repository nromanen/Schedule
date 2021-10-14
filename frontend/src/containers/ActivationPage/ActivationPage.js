import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';

import { CircularProgress } from '@material-ui/core';
import { activateUser } from '../../actions';

import { links } from '../../constants/links';
import { snackbarTypes } from '../../constants/snackbarTypes';

import { handleSnackbarOpenService } from '../../services/snackbarService';

import './ActivationPage.scss';

const ActivationPage = (props) => {
    const { t } = useTranslation('common');

    const params = new URLSearchParams(props.location.search);
    const token = params.get('token');

    const { error } = props;

    const { response } = props;
    let redirect = null;

    if (response && get(response.data, 'message')) {
        redirect = <Redirect to={links.AUTH} />;
        handleSnackbarOpenService(true, snackbarTypes.SUCCESS, response.data.message);
    }

    let main = (
        <>
            <h2>{t('verifying_token')}</h2>
            <CircularProgress />
        </>
    );

    if (error) {
        main = (
            <>
                <h2>{t('token_error')}</h2>
                <p>{error}</p>
            </>
        );
    }

    useEffect(() => {
        if (token) {
            props.onActivate(token);
        }
    }, [token]);

    return (
        <>
            <section className="activation-page-container">
                {redirect}
                <section className="card activation-section">{main}</section>
            </section>
        </>
    );
};

const mapStateToProps = (state) => ({
    response: state.auth.response,
    error: state.auth.activationError,
});

const mapDispatchToProps = (dispatch) => {
    return {
        onActivate: (data) => dispatch(activateUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivationPage);
