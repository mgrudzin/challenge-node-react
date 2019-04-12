var Student = require('../models/Student');

/**
 * GET /students
 */
exports.studentsGet = function (req, res) {
    Student.retrieveAll(function (err, results) {
        return res.send({students: results});
    });
};

/**
 * POST /student
 */
exports.studentPost = function (req, res) {
    req.assert('firstName', 'First Name cannot be blank').notEmpty();
    req.assert('lastName', 'Last Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('age', 'Age cannot be blank').notEmpty();
    req.assert('grade', 'Grade cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({remove_dots: false});

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    Student.exists(req.body.email, (err, student) => {
        if(student) {
            return res.status(400).send({ msg: 'The email address entered is already associated with another student.' });
        }
        else {
            Student.add(req.body.firstName, req.body.lastName, req.body.email, req.body.age, req.body.grade, (err, student) => {
                return res.send({student: student, msg: 'Student added successfully'});
            });
        }
    });
};

/**
 * PUT /student
 */
exports.studentPut = function (req, res) {
    req.assert('id', 'ID cannot be blank').notEmpty();
    req.assert('firstName', 'First Name cannot be blank').notEmpty();
    req.assert('lastName', 'Last Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('age', 'Age cannot be blank').notEmpty();
    req.assert('grade', 'Grade cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({remove_dots: false});

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    Student.update(req.body.id, req.body.firstName, req.body.lastName, req.body.email, req.body.age, req.body.grade, (err, student) => {
        return res.send({student: student, msg: 'Student updated successfully'});
    });
};

/**
 * DELETE /student
 */
exports.studentDelete = function (req, res) {
    req.assert('id', 'ID cannot be blank').notEmpty();

    var errors = req.validationErrors();
    if(errors) {
        return res.status(400).send(errors);
    }

    Student.delete(req.body.id, (err) => {
        if(err) {
            return res.status(400).send({msg: 'Student could not be deleted'});
        }
        else {
            return res.send({msg: 'Student deleted successfully'});
        }
    });
};
