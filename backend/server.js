const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const express = require('express');
const app = express();
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({schedules:[]}).write();
const cors = require('cors');
var data = require('./data.json');

const PORT = 4000;
app.use(cors());



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

router.route('/')
    .get((req,res)=>{
        const node= data.map(function(d){
            var info = {"subject": d.subject,
                        "className": d.className
                       }
            return info;
        });
    
        res.send(node);
    })

    // // Create a schedule
    .post((req,res)=>{
        const new_schedule = req.body;
        data.push(new_schedule);
        var info = {
                "message": "The schedule" + new_schedule + "has been successfully created"
                }
        res.send(info);


    })

    router.route('/:data_subject')

    .get((req,res) =>{
        const subject = req.params.data_subject;
        var exists = data.find(d => d.subject === subject);
        var node = data.filter(function(d){
            return d.subject ===subject;
        })
        .map(function(d){
            var info = {"subject": d.subject,
                        "catalog_nbr": d.catalog_nbr
                       }
        return info;
        });
        if(exists){
            res.send(node);
        }
        else{
            res.status(404).send("Subject " + subject + " was not found");
        }

    })

    // .post((req,res)=>{
    //     const new_schedule = req.body;
    //     if(new_schedule.)


    // })

    router.route('/:data_subject/:data_id')
    .get((req,res) =>{
        const subject = req.params.data_subject;
    const id = req.params.data_id;
    var exists = data.find(d => d.subject === subject);
    var not_Id = data.find( d=> d.catalog_nbr === id);
    var node = data.filter(function(d){
        return  d.subject ===subject;
    })
    .filter(function(d){
        return d.catalog_nbr.toString() ===id;
    })
    .map(function(d){
        var info = {

                    "subject": d.subject,
                    "catalog_nbr": d.catalog_nbr,
                    "course info": d.course_info 
                   }
        return info;
    });

    if(!exists){
        res.status(404).send("Subject " + subject + " was not found");
    }
    else if(!not_Id){
        res.status(404).send("Class code " + id + " was not found");
    }
    else{
        res.send(node);
    }
    })




//get details for the list
        // router.get('/', (req,res) => {

            
        // const node= data.map(function(d){
        //         var info = {"subject": d.subject,
        //                     "className": d.className
        //                 }
        //     return info;
        //     });

        //     res.send(node);
            
        //     });
//get details for subject and course code
        // router.get('/:data_subject', (req,res) => {
        //     const subject = req.params.data_subject;
        //     var exists = data.find(d => d.subject === subject);
        //     var node = data.filter(function(d){
        //         return d.subject ===subject;
        //     })
        //     .map(function(d){
        //         var info = {"subject": d.subject,
        //                     "catalog_nbr": d.catalog_nbr
        //                 }
        //     return info;
        //     });
        //     if(exists){
        //         res.send(node);
        //     }
        //     else{
        //         res.status(404).send("Subject " + subject + " was not found");
        //     }
            
            
        //     })
    
    


//Task 3: But ask what is optional course
            // router.get('/:data_subject/:data_id', (req,res) => {
            //     const subject = req.params.data_subject;
            //     const id = req.params.data_id;
            //     var exists = data.find(d => d.subject === subject);
            //     var not_Id = data.find( d=> d.catalog_nbr === id);
            //     var node = data.filter(function(d){
            //         return  d.subject ===subject;
            //     })
            //     .filter(function(d){
            //         return d.catalog_nbr.toString() ===id;
            //     })
            //     .map(function(d){
            //         var info = {

            //                     "subject": d.subject,
            //                     "catalog_nbr": d.catalog_nbr,
            //                     "course info": d.course_info 
            //                 }
            //         return info;
            //     });

            //     if(!exists){
            //         res.status(404).send("Subject " + subject + " was not found");
            //     }
            //     else if(!not_Id){
            //         res.status(404).send("Class code " + id + " was not found");
            //     }
            //     else{
            //         res.send(node);
            //     }
            // })



//******************Put request does not overide  */
//create or replace class data for a given id

router.get('/schedules', (req,res) => {
    const data = db.get("schedules").value()
    return res.json(data);
})

router.put('/schedules/:name', (req, res) =>{
    var name = req.params.name;

    for(var i =0; i<db.getState().schedules[i].length;i++){
        if(db.getState().schedules[i].name == name){
            res.status(404).send("ahlie")
            return;
        }
        
    }
    db.get('schedules').push({name}).write();
    res.json({ success: true})
    // res.status(200).send();
})

// //Update existing schedule item
// router.put('/:id', (req,res) => {
//     const new_node = req.body;
//     console.log("class : ", new_node);

//     //find the node
//     const node = data.findIndex(d => d.catalog_nbr === parseInt(req.params.id));

//     if(node <0){
//         res.status(404).send("Part" + req.params.id + "Not found");
//     }
//     else{
//         console.log("Changing node for", req.params.id);
//         data[node].stock += parseInt(req.body.stock);
//         res.send(req.body);
//     }
// })


// //create a new schedule
// router.post('/:schedule_name', (req,res) =>{
//     const new_node = req.body;
// })


//Install the router at /api/parts
app.use('/data', router)


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
