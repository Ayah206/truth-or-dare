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
router.post('/task/:category', async (req, res) => {
  // Create a task for a category with user login id. 
  //REMEMBER THAT THIS FEATURE IS ONLY AVAILABLE TO LOGGED IN USERS
  try {
      console.log('anything')
      // req.body.addedBy = req.account.id
      req.body.category = req.params.category
      console.log(req.body)
      const task = new Task(req.body)
      await task.save()
      console.log(task)
      sendJSONresponse(res, 200, {message:'task added successfully'});  
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

router.delete('/task', auth, async (req, res) => {
  // delete a task using id of the task.
  try {
      let task
        task = await Task.deleteMany({}); 
      
      sendJSONresponse(res, 200, {message:'item deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.get('/task/truth/:category', async (req, res) => {
  // get a truth
 try {
      const sent = req.session
      let task = null
      const genre = 'Truth'
      if(sent.askedTruth){
       task = await Task.find({_id: {$nin : sent.askedTruth},category: req.params.category, genre:genre});
      }
      else {
        sent.askedTruth = []
        task = await Task.find({category: req.params.category, genre:genre});
      }
      if(task.length>0){      
      //get a random task from task array.
      const send = task[Math.floor(Math.random() * task.length)]
      console.log(task)

      //add sent tasks to array of sent tasks
      sent.askedTruth.push(send._id)
      var outputTask = send.task
      }
      else{
        var outOfTask = 'out of tasks, click the reset button to restart'
      }
   
      sendJSONresponse(res, 200, {outputTask, outOfTask, genre});
      
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.get('/task/dare/:category', async (req, res) => {
  // get a dare
  try {
      const sent = req.session
      let task = null
      const genre = 'Dare'
      if(sent.askedDare){
       task = await Task.find({_id: {$nin : sent.askedDare},category: req.params.category, genre:genre});
      }
      else {
        sent.askedDare = []
        task = await Task.find({category: req.params.category, genre:genre});
      }
      if(task.length>0){      
      //get a random task from task array.
      const send = task[Math.floor(Math.random() * task.length)]
      console.log(task)

      //add sent tasks to array of sent tasks
      sent.askedDare.push(send._id)
      var outputTask = send.task
      }
      else{
        var outOfTask = 'out of tasks, click the reset button to restart'
      }
   
      sendJSONresponse(res, 200, {outputTask, outOfTask, genre});
      
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

router.get('/tasks', async (req, res) => {
  // get all tasks
  try {
      const task = await Task.find().populate('genre');
      sendJSONresponse(res, 200, task);
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})
router.get('/reset/:genre', async (req, res) => {
  // reset game
  try {
      const genre =  req.params.genre
      if(genre === 'Truth'){
        delete req.session.askedTruth
        sendJSONresponse(res, 200, {message: 'truth reset successful'});
      }
      else if(genre === 'Dare'){
        delete req.session.askedDare
        sendJSONresponse(res, 200, {message: 'dare reset successful'});
      }
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

router.delete('/genre', auth, async (req, res) => {
  // delete a task using id of the task.
  try {
    const genre = await Genre.deleteMany({});
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


//new accounts
router.get('/new_accounts', async(req, res) => {
  //get all accounts
  try {
      const new_accounts = await Account.find()
      sendJSONresponse(res, 200, {accounts}) 
      if (!account) {
          throw error;
      }
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
})

// new register
router.post('/new_register', async (req, res) => {
  // Create an account
  try {
      const account = new Account(req.body)
      await account.save()
      const token = await account.generateAuthToken()
      sendJSONresponse(res, 200, {account, token});  
  } 
  catch (error) {
      sendJSONresponse(res, 401, {error});
  }
})

module.exports = router;

