const mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
    uid: { // _id of user
        type: mongoose.SchemaTypes.ObjectId,
        required: 'User id cannot be empty'
    },
    title: {
        type: String,
        required: 'Title cannot be empty'
    },
    description: {
        type: String,
        default: 'NA',
        set: (value) => {
            if(value === undefined || value === null) return 'NA';
            else return value
        }
    },
    createdOn: {
        type: mongoose.SchemaTypes.Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ['done', 'pending', 'doing'],
        default: 'pending',
        set: (value) => {
            if(value === undefined || value === null || value === '') return 'pending'
            else return value
        }
    }
});

module.exports = mongoose.model('ToDo', todoSchema, 'ToDo');