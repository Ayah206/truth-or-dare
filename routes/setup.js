const express = require('express');
var Account = require('../models/account');
var Category = require('../models/category');
var Genre = require('../models/genre');
var Task = require('../models/task');

const router = express.Router();

const sendJSONresponse = (res, status, content) => {
    res.status(status);
    res.json(content);
  }
// seed data for accounts
router.get('/register', async(req, res) => {
    try{
        var account = 
            {
                userName : 'Admin',
                password : '11223344A',
                email : 'admin@gmail.com'
            };
        Account.create(account)
        sendJSONresponse(res, 200, {message : 'seed admin account added'});
    }
    catch(error){
        sendJSONresponse(res, 400, {error});
    }
})
//seed data for genre
router.get('/genres', async(req, res) => {
    try{
        var genre = [
            {
                name : 'Truth'
            },
            {
                name : 'Dare'
            }
        ];
        genre.forEach(async(item) =>{
            Genre.create(item)
        })
        sendJSONresponse(res, 200, {message : 'seed Genres added'});
    }
    catch(error){
        sendJSONresponse(res, 400, {error});
    }
})

//seed data for categories
router.get('/categories', async(req, res) => {
    try{
        var categories = [
            {
                name : 'Kids',
                description : 'fun questions for children and pre-teens'
            },
            {
                name : 'Regular',
                description : 'fun questions for teenagers and young adults'
            },
            {
                name : 'Couple edition',
                description : 'suitable for couples and flirts'
            },
            {
                name : 'Party',
                description : 'For wild parties and gatherings (adults only)'
            },
            {
                name : 'Spicy couple',
                description : 'For couples and flirts with extra spice'
            }
        ];
        categories.forEach(async(item) =>{
            Category.create(item)
        })
        sendJSONresponse(res, 200, {message : 'seed categories added'});
    }
    catch(error){
        sendJSONresponse(res, 400, {error});
    }
})
//seed data for tasks
router.get('/tasks', async(req, res) => {
    try{
        var tasks = [
            {
                task : 'have you ever peed in a pool',
                genre : 'Truth',
                category: '5f7247bef70d4922208c67a8',
                addedBy: '5f6b7cd78a23911e68b56955'
            },
            {
                task : 'what is the wierdest thing you have experienced',
                genre : 'Truth',
                category: '5f7247bef70d4922208c67a8',
                addedBy: '5f6b7cd78a23911e68b56955'
            },
            {
                task : 'fart in public',
                genre : 'Dare',
                category: '5f7247bef70d4922208c67a8',
                addedBy: '5f6b7cd78a23911e68b56955'
            },
            {
                task : 'sing a song with your tongue out',
                genre : 'Dare',
                category: '5f7247bef70d4922208c67a8',
                addedBy: '5f6b7cd78a23911e68b56955'
            },
            {
                task : 'eat a plate of food without using your hands',
                genre : 'Dare',
                category: '5f7247bef70d4922208c67a8',
                addedBy: '5f6b7cd78a23911e68b56955'
            },
            {
                task : 'kiss the previous person that took a turn',
                genre : 'Dare',
                category: '5f7247bef70d4922208c67a9',
                addedBy: '5f6b7cd78a23911e68b56955'
            },
            {
                task : 'Do 30 frog jumps',
                genre : 'Dare',
                category: '5f7247bef70d4922208c67a9',
                addedBy: '5f6b7cd78a23911e68b56955'
            },
            {
                task : 'perform a song from beginning to end',
                genre : 'Dare',
                category: '5f7247bef70d4922208c67a9',
                addedBy: '5f6b7cd78a23911e68b56955'
            },
            {
                task : 'when was your first crush',
                genre : 'Truth',
                category: '5f7247bef70d4922208c67a9',
                addedBy: '5f6b7cd78a23911e68b56955'
            },
            {
                task : 'if you could, what would you change about yourself',
                genre : 'Truth',
                category: '5f7247bef70d4922208c67a9',
                addedBy: '5f6b7cd78a23911e68b56955'
            },
        ];
        tasks.forEach(async(item) =>{
            Task.create(item)
        })
        sendJSONresponse(res, 200, {message : 'seed tasks added'});
    }
    catch(error){
        sendJSONresponse(res, 400, {error});
    }
})


    module.exports = router
