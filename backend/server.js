const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const express = require('express');
const app = express();
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

//get list of schedule items
app.get('/data', (req, res) =>{
    console.log('Get Request for' + req.url);
    res.send(data);
   // console.log(res)
})

//get detials for a given node
app.get('/data/:data_id', (req,res) => {
    const id = req.params.data_id;
    console.log('Get Request for' + req.url);
    const node = data.find(d => d.catalog_nbr === parseInt(id));
    if(node){
        res.send(node);
    }
    else{
        res.status(404).send("Class code " + id + " was not found");
    }
})




app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});