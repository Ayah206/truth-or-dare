var express = require('express');
var router = express.Router();
const Category = require('../models/category')
const Genre = require('../models/genre')
const Task = require('../models/task')


/* GET home page. */
router.get('/', async (req, res) => {
  try {
      const categories = await Category.find();
      res.render('index', 
      { 
        title: 'TRUTH/DARE',
        cats: categories
       });
      } 
      catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.get('/addplayers', async (req, res) => {
  try {
      var category = req.query.category
      res.render('addplayers',
      { 
        title: 'TRUTH/DARE',
        category: category
       });
       console.log(category)
      } 
      catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.get('/:category', async (req, res) => {
  try {
    var category = req.params.category
    res.render('play',
    { 
      title: 'TRUTH/DARE',
      category: category
     });
    
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})


// from emibrown

router.get('/:new_category', async (req, res) => {
  try {
    var category = req.params.category
    res.render('play',
    { 
      title: 'TRUTH/DARE',
      category: category
     });
    
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

//new addplayers
router.get('/new_addplayers', async (req, res) => {
  try {
      var category = req.query.category
      res.render('addplayers',
      { 
        title: 'TRUTH/DARE',
        category: category
       });
       console.log(category)
      } 
      catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

//current addplayers
router.get('/current_addplayers', async (req, res) => {
  try {
      var category = req.query.category
      res.render('addplayers',
      { 
        title: 'TRUTH/DARE',
        category: category
       });
       console.log(category)
      } 
      catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})





module.exports = router;
