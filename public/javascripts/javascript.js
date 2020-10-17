// make incrementable index for form input id
let n = -1
function genId(){
    n = n + 1    
    return n
}
var players = []
var tasks = []

//add players to array

function addInput(name){
    var list = document.getElementById("inputlist")
    var number = genId()
    var player = { indx : number, name: name}     
    if(name){
        players.push(player)
        list.innerHTML += 
        '<li class="list-group-item mb-2 d-flex justify-content-between" id="player'
        +number+'"><p>'+ name +
        '</p><button type="button" class="btn btn-link" onclick = "deleteInput('+number+')">Delete</button></li>' 
    }
}  

function addPlayer(){
    var identity = document.getElementById('inputperson').value
    addInput(identity)
}

function deleteInput(id){
    // delete input from list display
    var child = document.getElementById("player"+id)
    var list = document.getElementById("inputlist")
    list.removeChild(child)

    // filter original array and remove deleted items
    var itemNumber =  players.map((item) => {
        return item.indx
    })
    players.splice(itemNumber.indexOf(id),1)
}

function store(category){
    var done = document.getElementById('done')
    var donediv = document.getElementById('donediv')
    console.log(category)
    if (players.length>1){
        localStorage.setItem("playerstorage", JSON.stringify(players));
        done.href="/"+category
    }
    else{ 
        donediv.innerHTML = '<div class="alert alert-warning alert-dismissible fade show w-75" role="alert">'
        +'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
        +'<span aria-hidden="true">&times;</span></button>'
        +'<strong>Error!</strong> You need to add atleast two players</div>'           
    }
}  

var gotten = JSON.parse(localStorage.getItem("playerstorage"));


function addStuff(task, genre){
    let table
    var number = genId()
    var item = { indx : number, task: task, genre: genre}     
    if(task && genre){
        console.log(typeof genre)
        // push tasks to task array and display added tasks on webpage
        table = document.querySelector('.task-table');
        tasks.push(item)
        table.innerHTML += 
        `<tr id ="row${item.indx+1}">
            <td>${item.genre}</td>
            <td>${item.task}</td>
            <td>
                <button type="button" class="btn btn-link" onclick = "deleteTask(${item.indx+1})">Delete</button>
            </td>
        </tr>`
        
    }

    if(!task && cat){
        //push added categories to category array and display added categories

    }
}  
function addTask(){
    // check for empty feilds (on add-task form) before adding calling addStuff function
    var genre =  document.querySelector('#genre').value
    var task = document.querySelector('#task').value

    if(genre == 'Genre' || task ==""){
        document.querySelector('.error-msg').innerHTML = 
        `<div class="alert alert-warning alert-dismissible fade show w-75" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            <strong>Error!</strong> You havent filled the form correctly
        </div>`
    }
    else{
        addStuff(task, genre)
        localStorage.setItem("taskstorage", JSON.stringify(tasks));
        
    }             
}

function deleteTask(id){
    document.querySelector('#row'+id).innerHTML = " "
    var itemNumber =  tasks.map((item) => {
        return item.indx
    })
    tasks.splice(itemNumber.indexOf(id),1)
    localStorage.setItem("taskstorage", JSON.stringify(tasks));

    console.log(tasks)
}

function deleteAll(path, storageKey){
    document.querySelector(path).innerHTML = ""
    localStorage.removeItem(storageKey);
}

var storedTasks = JSON.parse(localStorage.getItem("taskstorage"));

async function renderTask(task, url){ 
    try {
        let res = await fetch(url,{
            method: "POST",
            body: JSON.stringify(task),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        });
        console.log(task)
        let response =  await res.json();
        let html = document.querySelector('#donediv')
        html.innerHTML += `<div>${response.message}</div>`
    } catch (error) {
        console.log(error);
    }       
}

         


