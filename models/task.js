const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    task : {
        type : String,
        required : true
    },
    genre : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required : true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'   
    },
    asked: {
        type: String,
        required: true,
        default: "0"   
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'   
    }
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task