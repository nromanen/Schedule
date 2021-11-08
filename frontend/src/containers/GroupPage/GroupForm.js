import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { GROUP_FORM } from '../../constants/reduxForms';
import { AddGroup } from '../../components/AddGroupForm/AddGroupForm';
import { submitGroupStart, clearGroupStart } from '../../actions/groups';

const mapDispatchToProps = {
    submitGroupStart,
    clearGroupStart,
};

export default connect(
    null,
    mapDispatchToProps,
)(
    reduxForm({
        form: GROUP_FORM,
    })(AddGroup),
);
