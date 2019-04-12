import {browserHistory} from "react-router";

export function getAllStudents(cb) {
    return (dispatch) => {
        dispatch({
            type: 'CLEAR_MESSAGES'
        });
        return fetch('/students').then((response) => {
            return response.json().then((json) => {
                if(response.ok) {
                    dispatch({
                        type: 'STUDENTS_RETRIEVE_SUCCESS',
                        students: json.students
                    });

                    if(cb) cb();
                }
                else {
                    dispatch({
                        type: 'STUDENTS_RETRIEVE_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });

                    if(cb) cb();
                }
            });
        });
    };
}

export function addStudent(firstName, lastName, email, age, grade) {
    return (dispatch) => {
        dispatch({
            type: 'CLEAR_MESSAGES'
        });
        return fetch('/student', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                age: age,
                grade: grade
            })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'STUDENT_ADD_SUCCESS',
                        messages: [{msg: 'Student added successfully'}],
                        student: json.student
                    });
                    browserHistory.push('/');
                });
            } else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'STUDENT_ADD_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}

export function updateStudent(id, firstName, lastName, email, age, grade) {
    return (dispatch) => {
        dispatch({
            type: 'CLEAR_MESSAGES'
        });
        return fetch('/student', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                age: age,
                grade: grade
            })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'STUDENT_UPDATE_SUCCESS',
                        messages: [{msg: 'Student updated successfully'}],
                        student: json.student
                    });
                    browserHistory.push('/');
                });
            } else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'STUDENT_UPDATE_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}

export function deleteStudent(id) {
    return (dispatch) => {
        dispatch({
            type: 'CLEAR_MESSAGES'
        });
        return fetch('/student', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id
            })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((json) => {
                    dispatch({
                        type: 'STUDENT_DELETE_SUCCESS',
                        messages: Array.isArray(json) ? json : [json]
                    });
                    browserHistory.push('/');
                });
            } else {
                return response.json().then((json) => {
                    dispatch({
                        type: 'STUDENT_DELETE_FAILURE',
                        messages: Array.isArray(json) ? json : [json]
                    });
                });
            }
        });
    };
}
