const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    addedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account'
    },
    description : {
        type : String,
    }    
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category