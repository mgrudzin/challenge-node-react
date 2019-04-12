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
            editStudentId: undefined,
            sorted: false,
            sortField: undefined,
            sortAscending: undefined,
            sortStudents: []
        };

        //this.props.dispatch(getAllStudents(() => this.state.loading = false));
    }

    createStudentTableHeader() {
        let sortIconFirstName = '';
        if(this.state.sorted && this.state.sortField === 'firstName') {
            if(this.state.sortAscending) {
                sortIconFirstName = <span className={"glyphicon glyphicon-sort-by-attributes"} aria-hidden={"true"}></span>;
            }
            else {
                sortIconFirstName = <span className={"glyphicon glyphicon-sort-by-attributes-alt"} aria-hidden={"true"}></span>;
            }
        }

        let sortIconLastName = '';
        if(this.state.sorted && this.state.sortField === 'lastName') {
            if(this.state.sortAscending) {
                sortIconLastName = <span className={"glyphicon glyphicon-sort-by-attributes"} aria-hidden={"true"}></span>;
            }
            else {
                sortIconLastName = <span className={"glyphicon glyphicon-sort-by-attributes-alt"} aria-hidden={"true"}></span>;
            }
        }

        let sortIconEmail = '';
        if(this.state.sorted && this.state.sortField === 'email') {
            if(this.state.sortAscending) {
                sortIconEmail = <span className={"glyphicon glyphicon-sort-by-attributes"} aria-hidden={"true"}></span>;
            }
            else {
                sortIconEmail = <span className={"glyphicon glyphicon-sort-by-attributes-alt"} aria-hidden={"true"}></span>;
            }
        }

        let sortIconAge = '';
        if(this.state.sorted && this.state.sortField === 'age') {
            if(this.state.sortAscending) {
                sortIconAge = <span className={"glyphicon glyphicon-sort-by-attributes"} aria-hidden={"true"}></span>;
            }
            else {
                sortIconAge = <span className={"glyphicon glyphicon-sort-by-attributes-alt"} aria-hidden={"true"}></span>;
            }
        }

        let sortIconGrade = '';
        if(this.state.sorted && this.state.sortField === 'grade') {
            if(this.state.sortAscending) {
                sortIconGrade = <span className={"glyphicon glyphicon-sort-by-attributes"} aria-hidden={"true"}></span>;
            }
            else {
                sortIconGrade = <span className={"glyphicon glyphicon-sort-by-attributes-alt"} aria-hidden={"true"}></span>;
            }
        }

        return <tr>
            <th className={"sortable"} onClick={(e) => this.handleTableSort(e, 'firstName')}>First Name {sortIconFirstName}</th>
            <th className={"sortable"} onClick={(e) => this.handleTableSort(e, 'lastName')}>Last Name {sortIconLastName}</th>
            <th className={"sortable"} onClick={(e) => this.handleTableSort(e, 'email')}>Email {sortIconEmail}</th>
            <th className={"sortable"} onClick={(e) => this.handleTableSort(e, 'age')}>Age {sortIconAge}</th>
            <th className={"sortable"} onClick={(e) => this.handleTableSort(e, 'grade')}>Grade {sortIconGrade}</th>
            <th>&nbsp;</th>
        </tr>;
    }

    createStudentTableRecords() {
        if (this.state.loading) {
            return <tr>
                <td colSpan="6">Loading...</td>
            </tr>;
        } else {
            let studentList = this.state.students;
            if(this.state.sorted) {
                studentList = this.state.sortStudents;
            }

            return studentList.map((student, index) => {
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
                                <form style={{'display': 'inline', 'paddingRight': '0.5em'}} onSubmit={this.handleEditSave.bind(this)}>
                                    <button title={"Save"} type="submit" className="btn btn-primary">
                                        <span className={"glyphicon glyphicon-floppy-disk"} aria-hidden={"true"}></span>
                                    </button>
                                </form>
                                <form style={{'display': 'inline'}} onSubmit={this.handleEditCancel.bind(this)}>
                                    <button title={"Cancel"} type="submit" className="btn btn-danger">
                                        <span className={"glyphicon glyphicon-remove"} aria-hidden={"true"}></span>
                                    </button>
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
                            <form style={{'display': 'inline', 'paddingRight': '0.5em'}} onSubmit={(e) => this.handleEdit(e, student)}>
                                <button title={"Edit"} type="submit" className="btn btn-primary">
                                    <span className={"glyphicon glyphicon-pencil"} aria-hidden={"true"}></span>
                                </button>
                            </form>
                            <form style={{'display': 'inline'}}>
                                <button title={"Delete"} type="button" className="btn btn-danger" onClick={(e) => {if(window.confirm('Are you sure you want to delete this student?')) this.handleDelete(e, student._id)}}>
                                    <span className={"glyphicon glyphicon-trash"} aria-hidden={"true"}></span>
                                </button>
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
                        <button title={"Add"} type="submit" className="btn btn-primary">
                            <span className={"glyphicon glyphicon-plus"} aria-hidden={"true"}></span>
                        </button>
                    </form>
                </td>
            </tr>;
        }
    }

    createSpecialParagraphs() {
        return <div>
            <p className={"special"}>&nbsp;</p>
            <p className={"special"}>&nbsp;</p>
            <p className={"special"}>&nbsp;</p>
            <p className={"special"}>&nbsp;</p>
            <p className={"special"}>&nbsp;</p>
            <p className={"special"}>&nbsp;</p>

            <div>
                <h1 className={"special"}>One</h1>
                <h2 className={"special"}>Two</h2>
                <h3 className={"special"}>Three</h3>
                <h4 className={"special"}>Four</h4>
                <h5 className={"special"}>Five</h5>
            </div>
        </div>;
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

    handleTableSort(event, field) {
        let sortedList = [...this.state.students]; //clone the list so we always keep original
        let ascendingSort = this.state.sortAscending;
        let doSort = true;
        if(this.state.sorted && this.state.sortField === field) {
            //removing sort if already in descending
            if(!ascendingSort) {
                doSort = false;
            }
            else {
                //change sort direction
                ascendingSort = !ascendingSort;
            }
        }
        else {
            ascendingSort = true;
        }

        if(doSort) {
            if (field === 'firstName') {
                sortedList.sort((a, b) => {
                    let returnValue = 0;
                    if (a.firstName.toUpperCase() > b.firstName.toUpperCase()) {
                        returnValue = 1;
                    } else if (a.firstName.toUpperCase() < b.firstName.toUpperCase()) {
                        returnValue = -1;
                    }

                    if (!ascendingSort) {
                        returnValue *= -1;
                    }
                    return returnValue;
                });

                this.setState({sorted: true, sortField: field, sortAscending: ascendingSort, sortStudents: sortedList});
            } else if (field === 'lastName') {
                sortedList.sort((a, b) => {
                    let returnValue = 0;
                    if (a.lastName.toUpperCase() > b.lastName.toUpperCase()) {
                        returnValue = 1;
                    } else if (a.lastName.toUpperCase() < b.lastName.toUpperCase()) {
                        returnValue = -1;
                    }

                    if (!ascendingSort) {
                        returnValue *= -1;
                    }
                    return returnValue;
                });

                this.setState({sorted: true, sortField: field, sortAscending: ascendingSort, sortStudents: sortedList});
            } else if (field === 'email') {
                sortedList.sort((a, b) => {
                    let returnValue = 0;
                    if (a.email.toUpperCase() > b.email.toUpperCase()) {
                        returnValue = 1;
                    } else if (a.email.toUpperCase() < b.email.toUpperCase()) {
                        returnValue = -1;
                    }

                    if (!ascendingSort) {
                        returnValue *= -1;
                    }
                    return returnValue;
                });

                this.setState({sorted: true, sortField: field, sortAscending: ascendingSort, sortStudents: sortedList});
            } else if (field === 'age') {
                sortedList.sort((a, b) => {
                    let returnValue = 0;
                    if (a.age > b.age) {
                        returnValue = 1;
                    } else if (a.age < b.age) {
                        returnValue = -1;
                    }

                    if (!ascendingSort) {
                        returnValue *= -1;
                    }
                    return returnValue;
                });

                this.setState({sorted: true, sortField: field, sortAscending: ascendingSort, sortStudents: sortedList});
            } else if (field === 'grade') {
                sortedList.sort((a, b) => {
                    let returnValue = 0;
                    if (a.grade > b.grade) {
                        returnValue = 1;
                    } else if (a.grade < b.grade) {
                        returnValue = -1;
                    }

                    if (!ascendingSort) {
                        returnValue *= -1;
                    }
                    return returnValue;
                });

                this.setState({sorted: true, sortField: field, sortAscending: ascendingSort, sortStudents: sortedList});
            } else {
                this.setState({sorted: false, sortField: undefined, sortAscending: undefined, sortStudents: []});
            }
        }
        else {
            this.setState({sorted: false, sortField: undefined, sortAscending: undefined, sortStudents: []});
        }
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
                        {this.createStudentTableHeader()}
                        </thead>
                        <tbody>
                        {this.createStudentTableRecords()}
                        {this.createNewStudentTableRecord()}
                        </tbody>
                    </table>
                </div>
                {this.createSpecialParagraphs()}
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
