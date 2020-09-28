// make incrementable index for form input id
let n = -1
function genId(){
    n = n + 1    
    return n
}
var players = []

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

function addNow(){
    var identity = document.getElementById('inputperson').value
    addInput(identity)
}

function deleteInput(id){
    var child = document.getElementById("player"+id)
    var list = document.getElementById("inputlist")
    list.removeChild(child)
    // filter original array and remove deleted items
    var itemNumber =  players.map((item) => {
        return item.indx
    })
    console.log(itemNumber)
    players.splice(itemNumber.indexOf(id),1)
}

function store(category){
    var done = document.getElementById('done')
    var donediv = document.getElementById('donediv')
    console.log(category)
    if (players.length>0){
        localStorage.setItem("playerstorage", JSON.stringify(players));
        done.href="/"+category
    }
    else{ 
        donediv.innerHTML = '<div class="alert alert-warning alert-dismissible fade show w-75" role="alert">'
        +'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
        +'<span aria-hidden="true">&times;</span></button>'
        +'<strong>Error!</strong> You havent added any player.</div>'           
    }
}  

var gotten = JSON.parse(localStorage.getItem("playerstorage"));




         


