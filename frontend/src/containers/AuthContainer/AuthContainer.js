import { connect } from 'react-redux';
import { authUser, registerUser, resetUserPassword, setAuthError, setLoading } from '../../actions';
import Auth from '../../components/Auth/Auth';

const mapStateToProps = (state) => ({
    response: state.auth.response,
    resetPasswordResponse: state.auth.resetPasswordResponse,
    error: state.auth.error,
    token: state.auth.token,
    userRole: state.auth.role,
    isLoading: state.loadingIndicator.loading,
});

const mapDispatchToProps = (dispatch) => ({
    onAuth: (data) => dispatch(authUser(data)),
    onRegister: (data) => dispatch(registerUser(data)),
    onResetPassword: (data) => dispatch(resetUserPassword(data)),
    setLoadingForm: (isLoading) => dispatch(setLoading(isLoading)),
    setError: (error) => dispatch(setAuthError(error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
