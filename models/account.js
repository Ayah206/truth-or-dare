const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')

const accountSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid work Email address'})
            }
        }
    },
    tokens: [
        {
            token: 
            {
                type: String,
                required: true
            }
        }
    ] 
})
accountSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

accountSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const account = this
    if (account.isModified('password')) {
        account.password = await bcrypt.hash(account.password, 8)
    }
    next()
})

accountSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const account = this
    const token = jwt.sign({_id: account._id}, process.env.JWT_KEY || 'ssshhhhhhh')
    account.tokens = account.tokens.concat({token})
    await account.save()
    return token
}

const Account = mongoose.model('Account', accountSchema)

module.exports = Account