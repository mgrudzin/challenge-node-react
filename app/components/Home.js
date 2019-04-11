var util = require('util');

import React from 'react';
import {connect} from 'react-redux'
import {getAllStudents, addStudent, updateStudent, deleteStudent} from '../actions/student';
import Messages from './Messages';
import {inspect} from 'util'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            students: props.students,
            loading: true,
            newStudentFirstName: '',
            newStudentFirstNameError: false,
            newStudentLastName: '',
            newStudentLastNameError: false,
            newStudentEmail: '',
            newStudentEmailError: false,
            newStudentAge: '',
            newStudentAgeError: false,
            newStudentGrade: '',
            newStudentGradeError: false,
            editStudentId: undefined
        };

        //this.props.dispatch(getAllStudents(() => this.state.loading = false));
    }

    createStudentTableRecords() {
        if (this.state.loading) {
            return <tr>
                <td colSpan="6">Loading...</td>
            </tr>;
        } else {
            return this.state.students.map((student, index) => {
                let hideActions = false;

                if(this.state.editStudentId) {
                    //editing a record so only allow actions for that record
                    if(this.state.editStudentId === student._id) {
                        //found the record we are editing
                        return <tr key={student._id}>
                            {this.createInput('text', 'newStudentFirstName', 'First Name', this.state.newStudentFirstName, this.state.newStudentFirstNameError)}
                            {this.createInput('text', 'newStudentLastName', 'Last Name', this.state.newStudentLastName, this.state.newStudentLastNameError)}
                            {this.createInput('email', 'newStudentEmail', 'Email', this.state.newStudentEmail, this.state.newStudentEmailError)}
                            {this.createInput('number', 'newStudentAge', 'Age', this.state.newStudentAge, this.state.newStudentAgeError)}
                            <td>
                                <select name="newStudentGrade" id="newStudentGrade" className="form-control"
                                        value={this.state.newStudentGrade} onChange={this.handleChange.bind(this)}>
                                    <option value={null} label="-- Select Grade --" disabled="disabled"/>
                                    <option value="0" label="Kindergarten"/>
                                    <option value="1" label="1st"/>
                                    <option value="2" label="2nd"/>
                                    <option value="3" label="3rd"/>
                                    <option value="4" label="4th"/>
                                    <option value="5" label="5th"/>
                                    <option value="6" label="6th"/>
                                    <option value="7" label="7th"/>
                                    <option value="8" label="8th"/>
                                    <option value="9" label="9th"/>
                                    <option value="10" label="10th"/>
                                    <option value="11" label="11th"/>
                                    <option value="12" label="12th"/>
                                </select>
                            </td>
                            <td>
                                <form onSubmit={this.handleEditSave.bind(this)}>
                                    <button type="submit" className="btn btn-primary">Save</button>
                                </form>
                                <form onSubmit={this.handleEditCancel.bind(this)}>
                                    <button type="submit" className="btn btn-danger">Cancel</button>
                                </form>
                            </td>
                        </tr>;
                    }
                    else {
                        //not editing record so don't allow actions
                        hideActions = true;
                    }
                }

                //get to here if not editing -or- not current record being edited
                if(hideActions) {
                    return <tr key={student._id}>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.email}</td>
                        <td>{student.age}</td>
                        <td>{student.gradeDisplay}</td>
                        <td>&nbsp;</td>
                    </tr>;
                }
                else {
                    return <tr key={student._id}>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.email}</td>
                        <td>{student.age}</td>
                        <td>{student.gradeDisplay}</td>
                        <td>
                            <form onSubmit={(e) => this.handleEdit(e, student)}>
                                <button type="submit" className="btn btn-primary">Edit</button>
                            </form>
                            <form onSubmit={(e) => this.handleDelete(e, student._id)}>
                                <button type="submit" className="btn btn-danger">Delete</button>
                            </form>
                        </td>
                    </tr>;
                }
            });
        }
    }

    createNewStudentTableRecord() {
        if(this.state.editStudentId) {
            //editing a record so don't allow to add one
            return;
        }
        else {
            return <tr>
                {this.createInput('text', 'newStudentFirstName', 'First Name', this.state.newStudentFirstName, this.state.newStudentFirstNameError)}
                {this.createInput('text', 'newStudentLastName', 'Last Name', this.state.newStudentLastName, this.state.newStudentLastNameError)}
                {this.createInput('email', 'newStudentEmail', 'Email', this.state.newStudentEmail, this.state.newStudentEmailError)}
                {this.createInput('number', 'newStudentAge', 'Age', this.state.newStudentAge, this.state.newStudentAgeError)}
                <td>
                    <select name="newStudentGrade" id="newStudentGrade" className="form-control"
                            value={this.state.newStudentGrade} onChange={this.handleChange.bind(this)}>
                        <option value={null} label="-- Select Grade --" disabled="disabled"/>
                        <option value="0" label="Kindergarten"/>
                        <option value="1" label="1st"/>
                        <option value="2" label="2nd"/>
                        <option value="3" label="3rd"/>
                        <option value="4" label="4th"/>
                        <option value="5" label="5th"/>
                        <option value="6" label="6th"/>
                        <option value="7" label="7th"/>
                        <option value="8" label="8th"/>
                        <option value="9" label="9th"/>
                        <option value="10" label="10th"/>
                        <option value="11" label="11th"/>
                        <option value="12" label="12th"/>
                    </select>
                </td>
                <td>
                    <form onSubmit={this.handleAdd.bind(this)}>
                        <button type="submit" className="btn btn-primary">Add</button>
                    </form>
                </td>
            </tr>;
        }
    }

    createInput(type, nameId, placeholder, value, inError) {
        let className = '';
        let errorElement;
        if(inError) {
            className += 'has-error';
            errorElement = <p className="text-danger">Value is required</p>;
        }
        return <td className={className}><input type={type} name={nameId} id={nameId}
                      placeholder={placeholder} className="form-control"
                      value={value} onChange={this.handleChange.bind(this)}/>{errorElement}</td>;
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleAdd(event) {
        event.preventDefault();

        let firstNameError = false;
        let lastNameError = false;
        let emailError = false;
        let ageError = false;
        let gradeError = false;

        if(this.isBlankString(this.state.newStudentFirstName)) {
            //missing first name
            firstNameError = true;
        }
        if(this.isBlankString(this.state.newStudentLastName)) {
            //missing last name
            lastNameError = true;
        }
        if(this.isBlankString(this.state.newStudentEmail)) {
            //missing email
            emailError = true;
        }
        if(!this.state.newStudentAge || this.state.newStudentAge < 1) {
            //bad age
            ageError = true;
        }
        if(!this.state.newStudentGrade) {
            //missing grade
            gradeError = true;
        }

        if(!firstNameError && !lastNameError && !emailError && !ageError && !gradeError) {
            this.props.dispatch(addStudent(this.state.newStudentFirstName, this.state.newStudentLastName, this.state.newStudentEmail, this.state.newStudentAge, this.state.newStudentGrade));
            this.setState({
                newStudentFirstName: '',
                newStudentLastName: '',
                newStudentEmail: '',
                newStudentAge: '',
                newStudentGrade: '',
                newStudentFirstNameError: false,
                newStudentLastNameError: false,
                newStudentEmailError: false,
                newStudentAgeError: false,
                newStudentGradeError: false});
            this.retrieveAllStudents();
        }
        else {
            this.setState({
                newStudentFirstNameError: firstNameError,
                newStudentLastNameError: lastNameError,
                newStudentEmailError: emailError,
                newStudentAgeError: ageError,
                newStudentGradeError: gradeError});
        }
    }

    handleEdit(event, student) {
        event.preventDefault();
        this.setState({
            editStudentId: student._id,
            newStudentFirstName: student.firstName,
            newStudentLastName: student.lastName,
            newStudentEmail: student.email,
            newStudentAge: student.age,
            newStudentGrade: student.grade});
    }

    handleEditCancel(event) {
        event.preventDefault();
        this.setState({
            editStudentId: undefined,
            newStudentFirstName: '',
            newStudentLastName: '',
            newStudentEmail: '',
            newStudentAge: '',
            newStudentGrade: ''});
    }

    handleEditSave(event) {
        event.preventDefault();

        let firstNameError = false;
        let lastNameError = false;
        let emailError = false;
        let ageError = false;
        let gradeError = false;

        if(this.isBlankString(this.state.newStudentFirstName)) {
            //missing first name
            firstNameError = true;
        }
        if(this.isBlankString(this.state.newStudentLastName)) {
            //missing last name
            lastNameError = true;
        }
        if(this.isBlankString(this.state.newStudentEmail)) {
            //missing email
            emailError = true;
        }
        if(!this.state.newStudentAge || this.state.newStudentAge < 1) {
            //bad age
            ageError = true;
        }
        if(!this.state.newStudentGrade) {
            //missing grade
            gradeError = true;
        }

        if(!firstNameError && !lastNameError && !emailError && !ageError && !gradeError) {
            this.props.dispatch(updateStudent(this.state.editStudentId, this.state.newStudentFirstName, this.state.newStudentLastName, this.state.newStudentEmail, this.state.newStudentAge, this.state.newStudentGrade));
            this.setState({
                editStudentId: undefined,
                newStudentFirstName: '',
                newStudentLastName: '',
                newStudentEmail: '',
                newStudentAge: '',
                newStudentGrade: '',
                newStudentFirstNameError: false,
                newStudentLastNameError: false,
                newStudentEmailError: false,
                newStudentAgeError: false,
                newStudentGradeError: false});
            this.retrieveAllStudents();
        }
        else {
            this.setState({
                newStudentFirstNameError: firstNameError,
                newStudentLastNameError: lastNameError,
                newStudentEmailError: emailError,
                newStudentAgeError: ageError,
                newStudentGradeError: gradeError});
        }
    }

    handleDelete(event, id) {
        event.preventDefault();
        this.props.dispatch(deleteStudent(id));
        this.retrieveAllStudents();
    }

    retrieveAllStudents() {
        //this.props.dispatch(getAllStudents(() => this.state.loading = false));
        this.setState({students: [], loading: true});
        fetch('/students').then((response) => {
            response.json().then((json) => {
                this.setState({students: json.students, loading: false});
            });
        });
    }

    isBlankString(val) {
        return !val || val === "";
    }

    render() {
        //console.log("STATE: " + util.inspect(this.state));
        return (
            <div className="container-fluid">
                <Messages messages={this.props.messages}/>

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Age</th>
                            <th>Grade</th>
                            <th>&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.createStudentTableRecords()}
                        {this.createNewStudentTableRecord()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.retrieveAllStudents();
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages,
        students: state.student.students
    };
};

export default connect(mapStateToProps)(Home);
