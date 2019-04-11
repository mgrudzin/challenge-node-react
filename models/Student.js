var mongoose = require('mongoose');

var schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
};

var studentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, unique: true},
    age: Number,
    grade: Number
}, schemaOptions);

studentSchema.virtual('gradeDisplay').get(function() {
   let returnValue = 'N/A';
   if(this.grade === 0) {
       returnValue = 'Kindergarten';
   }
   else if(this.grade === 1) {
       returnValue = this.grade + 'st';
   }
   else if(this.grade === 2) {
       returnValue = this.grade + 'nd';
   }
   else if(this.grade === 3) {
       returnValue = this.grade + 'rd';
   }
   else {
       returnValue = this.grade + 'th';
   }

   return returnValue;
});

studentSchema.statics.retrieveAll = function (cb) {
    return this.find({}, cb);
};

studentSchema.statics.exists = function (email) {
    let returnValue = false;
    this.findOne({email: email}, (err, student) => {
        if(student) returnValue = true;
    });

    return returnValue;
};

studentSchema.statics.add = function (firstName, lastName, email, age, grade, cb) {
    return this.create({firstName: firstName, lastName: lastName, email: email, age: age, grade: grade}, cb);
};

studentSchema.statics.update = function (id, firstName, lastName, email, age, grade, cb) {
    return this.findOneAndUpdate({_id: id}, {firstName: firstName, lastName: lastName, email: email, age: age, grade: grade}, {new: true}, cb);
};

studentSchema.statics.delete = function (id) {
    let returnValue = true;
    this.findOneAndRemove({_id: id}, (err) => {
        if(err) returnValue = false;
    });

    return returnValue;
};

var Student = mongoose.model('Student', studentSchema);

/*Student.insertMany([{firstName: 'Frank', lastName: 'Smith', email: 'fsmith@gmail.com', age: 10, grade: 5},
    {firstName: 'Christine', lastName: 'Williams', email: 'cwilliams@aol.com', age: 6, grade: 0},
    {firstName: 'Henry', lastName: 'Billings', email: 'hbillings@msn.com', age: 14, grade: 8}], function (err) {
    //if(err) return ;
});*/

module.exports = Student;
