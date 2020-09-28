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
    var finalOutput
    const sent = req.session
    let task = null
    if(sent.asked){
     task = await Task.find({_id: {$nin : sent.asked},category: req.params.category, genre:req.query.genre});
    }
    else {
      sent.asked = []
      task = await Task.find({category: req.params.category, genre:req.query.genre});
    }
    if(task.length>0){      
    //get a random task from task array.
    const send = task[Math.floor(Math.random() * task.length)]

    //add sent tasks to array of sent tasks
    sent.asked.push(send._id)
    finalOutput = send.task
    }
    else{
    finalOutput = "Questions exhausted use the reset botton to start again" 
     }
    res.render('play',
    { 
      title: 'TRUTH/DARE',
      send : finalOutput
     });
    
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})



module.exports = router;
