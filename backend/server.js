//const { SSL_OP_EPHEMERAL_RSA } = require('constants');
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


//task 4
router.put('/schedule/:name', (req,res) =>{
    const name = req.params.name;
    for(var i=0; i<db.getState().schedules.length;i++){
        if(db.getState().schedules[i].scheduleName===name){
            res.status(404).send("The schedule " + name + "has been created");
            return;
        }
    }
    db.get('schedule').push({scheduleName:name,
                                  subject:"  ",
                                  courseName:"  "}).write();
    res.status(200).send();
}); 

//task 5


//task 6
router.get('/schedule/:name/', (req,res)=>{
    const name = req.params.name;
    
    for(let i = 0; i<db.getState().schedules.length; i++){
        if(db.getState().schedules[i].scheduleName===name){
            first =db.getState().schedules[i].courseName
            second = db.getState().schedules[i].subject;
            const display = first +" "+second;
  
            res.send(display);
            return;

        }
    }
    res.status(404).send("Get request have been recieved")

});

//task 7
router.post('/schedule/:name', (req,res)=>{
    const sch_name = req.params.name;
    for(let i = 0; i<db.getState().schedules.length; i++){
        if(db.getState().schedules[i].scheduleName===sch_name){
            db.get("schedules").remove({scheduleName: sch_name}).write();
            res.send("Posted")
        }
    }
    res.status(404).send("Name doesn't exist")
    
});






app.use('/data', router)


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
