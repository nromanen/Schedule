import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { GROUP_FORM } from '../../constants/reduxForms';
import { AddGroup } from '../../components/AddGroupForm/AddGroupForm';
import { submitGroupStart, clearGroupStart } from '../../actions/groups';

const mapStateToProps = (state) => ({
    group: state.groups.group,
});

export default connect(mapStateToProps, { submitGroupStart, clearGroupStart })(
    reduxForm({
        form: GROUP_FORM,
    })(AddGroup),
);
