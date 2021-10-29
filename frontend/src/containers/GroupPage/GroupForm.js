import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { GROUP_FORM } from '../../constants/reduxForms';
import { AddGroup } from '../../components/AddGroupForm/AddGroupForm';

const mapStateToProps = (state) => ({
    group: state.groups.group,
});

export default connect(mapStateToProps)(
    reduxForm({
        form: GROUP_FORM,
    })(AddGroup),
);
