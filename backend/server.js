const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const express = require('express');
const app = express();
const router = express.Router();
// const fs = require('fs');
// var data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
var data = require('./data.json');

const PORT = 4000;



// fs.readFile('./data.json', 'utf8', function(err,data){
//     if(err) throw err;
//     data = JSON.parse(data);
// });
//Setup serving front-end code
app.use('/', express.static('static'));

// Setup middleware to do logging
app.use((req, res, next) =>{
    console.log(req.method + " request for " + req.url );
    next(); 
})

//Parse data in body as JSON
router.use(express.json());

//get list of schedule items
router.get('/', (req, res) =>{
    res.send(data);
   // console.log(res)
})

//get details for a given node
router.get('/:data_id', (req,res) => {
    const id = req.params.data_id;
    
    const node = data.find(d => d.catalog_nbr.toString() === id);
    
    if(node){
        res.send(node);
    }
    else{
        res.status(404).send("Class code " + id + " was not found");
    }
})
//******************Put request does not overide  */
//create or replace class data for a given id
router.put('/:id', (req, res) =>{
    const new_node = req.body;
    console.log("class : ", new_node);
    //Add ID field
    new_node.catalog_nbr = parseInt(req.params.id);

    console.log(new_node);
    
    //Replace the node with a new one
    const node = data.findIndex(d => d.catalog_nbr === new_node.id);
    data[node] = req.body;
    res.send(new_node);
})


//Install the router at /api/parts
app.use('/data', router)


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});