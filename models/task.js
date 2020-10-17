const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    task : {
        type : String,
        required : true
    },
    genre : {
        type: String,
        required : true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'   
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'Account'   
    },
    indx : {
        type: Number,
        required: false
    }
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task