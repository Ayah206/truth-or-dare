const express = require('express');
const Account = require('../models/account');
const Task = require('../models/task');
const Category = require('../models/category');
const Genre = require('../models/genre');
const auth = require('../middleware/auth')
const router = express.Router();

let askedTasks =  []

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/accounts', async(req, res) => {
  //get all accounts
  try {
      const accounts = await Account.find()
      sendJSONresponse(res, 200, {accounts}) 
      if (!account) {
          throw error;
      }
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.post('/register', async (req, res) => {
  // Create an account
  try {
      const account = new Account(req.body)
      await account.save()
      const token = await account.generateAuthToken()
      sendJSONresponse(res, 200, {account, token});  
  } 
  catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.post('/login', async(req, res) => {
  //Login to the app
  try {
      const account = await Account.find({user: req.body.userName, password: req.body.password})
      sendJSONresponse(res, 200, {account}) 
      if (!account) {
          return sendJSONresponse(res, 401, {error:'Login failed! Check authentication credentials'});
      }

  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.post('/logout', auth, async (req, res) => {
  // Log out of the application
  try {
      req.account.tokens = req.account.tokens.filter((token) => {
          return token.token != req.token
      })
      await req.account.save()
      sendJSONresponse(res, 200, {message : 'logout'});
  } catch (error) {
      sendJSONresponse(res, 500, {error});
  }
})

//category APIs
router.post('/category', auth, async (req, res) => {
  // Create a game category with user login id. REMEMBER THAT THIS FEATURE IS ONLY AVAILABLE TO LOGGED IN USERS
  try {
      req.body.addedBy = req.account.id
      const category = new Category(req.body)
      await category.save()
      sendJSONresponse(res, 200, {category});  
  } 
  catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})
router.delete('/category/:id', auth, async (req, res) => {
  // delete a category using it's id.
  try {
    let category
    if(req.account.userName != 'Admin'){
      category = await Category.findOneAndDelete({_id: req.params.id, addedBy : req.account.id}); 
    }
    category = await Category.findOneAndDelete({_id: req.params.id});
    sendJSONresponse(res, 200, {message:'category deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.put('/category/:id', auth, async (req, res) => {
  // edit a category
  try {
      let category
      if(req.account.userName != 'Admin'){
        category = await Category.findOne({_id: req.params.id, addedBy : req.account.id }); 
      }
      category = await Category.findOne({_id: req.params.id});
      await Object.assign(category, req.body); 
      await category.save();
      sendJSONresponse(res, 200, {category});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.get('/categories', async (req, res) => {
  // get all categories
  try {
      const categories = await Category.find();
      sendJSONresponse(res, 200, categories);
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

//task API's
router.post('/task/:category', auth, async (req, res) => {
  // Create a task for a category with user login id. 
  //REMEMBER THAT THIS FEATURE IS ONLY AVAILABLE TO LOGGED IN USERS
  try {
    console.log('anything')
      req.body.addedBy = req.account.id
      req.body.category = req.params.category  
      const task = new Task(req.body).populate('genre')
      await task.save()
      sendJSONresponse(res, 200, {task});  
  } 
  catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.put('/task/:id', auth, async (req, res) => {
  // edit a task
  try {
      let task
      if(req.account.userName != 'Admin'){
        task = await Task.findOne({_id: req.params.id, addedBy : req.account.id }); 
      }
      task = await Task.findOne({_id: req.params.id});
      await Object.assign(task, req.body); 
      await task.save();
      sendJSONresponse(res, 200, {task});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.delete('/task/:id', auth, async (req, res) => {
  // delete a task using id of the task.
  try {
      let task
      if(req.account.userName != 'Admin'){
        task = await Task.findOneAndDelete({_id: req.params.id, addedBy : req.account.id }); 
      }
      task = await Task.findOneAndDelete({_id: req.params.id});
      sendJSONresponse(res, 200, {message:'item deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.get('/task/:category', async (req, res) => {
  // get a task
  try {
      const genre = await Genre.findOne({name: req.query.genre});
      var finalOutput
      const sent = req.session
      let task = null

      if(sent.asked){
       task = await Task.find({_id: {$nin : sent.asked},category: req.params.category, genre:genre._id});
      }
      else {
        sent.asked = []
        task = await Task.find({category: req.params.category, genre:genre._id});
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
        // req.session.destroy()
       }
      sendJSONresponse(res, 400, {finalOutput});
      
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.put('/task/:category/:genre', async (req, res) => {
  // reset game
  try {
      req.session.destroy()
      sendJSONresponse(res, 200, {message: 'success'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

//genre APIs
router.post('/genre', auth, async (req, res) => {
  // Create a genre
  try {
      if(req.account.userName !='Admin'){
        error = 'not authorised to use this resource'
      } 
      const genre = new Genre(req.body)
      await genre.save()
      sendJSONresponse(res, 200, {genre});  
  } 
  catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.put('/genre/:id', auth, async (req, res) => {
  // edit a genre
  try {
      const genre = await Genre.findOne({_id: req.params.id});
      await Object.assign(genre, req.body); 
      await genre.save();
      sendJSONresponse(res, 200, {genre});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.delete('/genre/:id', auth, async (req, res) => {
  // delete a task using id of the task.
  try {
      const genre = await Genre.findOneAndDelete({_id: req.params.id});
      sendJSONresponse(res, 200, {message:'item deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.get('/genres', async (req, res) => {
  // get all genres
  try {
      const genres = await Genre.find();
      sendJSONresponse(res, 200, genres);
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

module.exports = router;

