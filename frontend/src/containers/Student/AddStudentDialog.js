import { connect } from 'react-redux';
import AddStudentDialog from '../../share/DialogWindows/_dialogWindows/AddStudentDialog';
import { startCreateStudent, startUpdateStudent } from '../../actions/students';

const mapStateToProps = (state) => ({
    groups: state.groups.groups,
});

const mapDispatchToProps = { startCreateStudent, startUpdateStudent };

export default connect(mapStateToProps, mapDispatchToProps)(AddStudentDialog);
