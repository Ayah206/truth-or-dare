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
      const categories = await Category.find();
      var category = req.query.category
      res.render('addplayers',
      { 
        title: 'TRUTH/DARE',
        category: category,
        cats: categories
       });
       console.log(category)
      } 
      catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})
router.get('/addtask', async (req, res) => {
  try {
    const categories = await Category.find();
    const category =req.query.category;
    const genres = await Genre.find();
    res.render('addtasks',
    { 
      title: 'TRUTH/DARE',
      category: category,
      genres: genres,
      cats: categories
     });
    
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.get('/play/:category', async (req, res) => {
  try {
    const categories = await Category.find();
    var category = req.params.category
    res.render('play',
    { 
      title: 'TRUTH/DARE',
      cats: categories,
      category: category
     });
    
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})





module.exports = router;
