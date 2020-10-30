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

//get details for subject and class names
router.get('/:data_subject', (req,res) => {
    const subject = req.params.data_subject;

    var node = data.filter(function(d){
        return d.subject ===subject;
    })
    .map(function(d){
        var info = {"subject": d.subject,
                    "className": d.className
                   }
    return info;
    });
    // const node = data.map( function(d){
    //     if(d.subject === subject){
    //         var info = {"subject": d.subject,
    //                     "className": d.className
    //                     }
    //         return info;               
    //     }  
    res.send(node);
    
    })
    
    
    // const node = (data.map(d =>{
    //     d.subject == subject;
    // }))
    // // const node = data.find(d => d.subject  == subject);

    // if(node){
    //     res.send(node);
    //   //  res.send(node.className)
    // }else{
    //     res.status(404).send("Subject " + subject + " Was not found");
    // }
//})


//get 
//get details for a given node
router.get('/:data_subject/:data_id', (req,res) => {
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
    //Add class code field
    new_node.catalog_nbr = parseInt(req.params.id);
    
    

    console.log(new_node);
    
    //Replace the node with a new one
    const node = data.findIndex(d => d.catalog_nbr === new_node.id);
    if(node <0){
        console.log("creating new part");
        data.push(new_node);
    }
    else{
        console.log("Modifying part", req.params.id);
        data[node] = new_node;
    }
    res.send(new_node);
})

//Update existing schedule item
router.post('/:id', (req,res) => {
    const new_node = req.body;
    console.log("class : ", new_node);

    //find the node
    const node = data.findIndex(d => d.catalog_nbr === parseInt(req.params.id));

    if(node <0){
        res.status(404).send("Part" + req.params.id + "Not found");
    }
    else{
        console.log("Changing node for", req.params.id);
        data[node].stock += parseInt(req.body.stock);
        res.send(req.body);
    }
})



//Install the router at /api/parts
app.use('/data', router)


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
