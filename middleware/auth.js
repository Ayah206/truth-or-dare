const jwt = require('jsonwebtoken')
const Account = require('../models/account')

const sendJSONresponse = (res, status, content) => {
    res.status(status);
    res.json(content);
};
  

const auth = async(req, res, next) => {
    try {
        const authHeader = req.header('Authorization')
        if (!authHeader) {
            throw new Error()
        }
        const token = authHeader.replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY || 'ssshhhhhhh')
        const account = await Account.findOne({ _id: data._id, 'tokens.token': token })
        if (!account) {
            throw new Error()
        }
        req.account = account
        req.token = token
        next()
    } catch (error) {
        sendJSONresponse(res, 401, {error: 'You are not logged in.'});
    }
}


module.exports = auth