const express = require('express');
const app = express();
const router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({schedules:[]}).write();

var data = require('./data.json');

const PORT = 4000;
//app.use(cors());




//Setup serving front-end code
app.use('/', express.static('static'));

app.use('/api', router)

// Setup middleware to do logging
app.use((req, res, next) =>{
    console.log(req.method + " request for " + req.url );
    next(); 
})

router.get('/', (req, res) => {
    res.send(db)
});

//Parse data in body as JSON
router.use(express.json());
//Task 1
router.route('/courses')
    .get((req,res)=>{
        const node= data.map(function(d){
            var info = {"subject": d.subject,
                        "className": d.className
                       }
            return info;
        });
    
        res.send(node);
    })

   
//Task 2
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

    //FIXXX IT UP BAD BOI -- add course component
    router.get('/timetable/:classes_subjects/:course_code/:course_component?', (req, res) => {
        const subjects = data.filter(c => c.subject.toString().toUpperCase() === req.params.classes_subjects.toString().toUpperCase());
        const course_code = subjects.filter(c => c.catalog_nbr.toString().toUpperCase() === req.params.course_code.toString().toUpperCase());
        if (subjects.length===0 || course_code.length===0) {
            res.status(404).send(`Subject ${subjects} was not found or course code ${course_code} was not found.`);
        }
        if(course_code.filter(c => c.course_info[0].ssr_component.toUpperCase() === req.params.course_component)){
            res.send(course_code)
        }
        else {
            res.send(course_code)
        }
    });

//task 4
router.put('/schedule/:name', (req,res) =>{
    const name = req.params.name;
    //check if the name already exists, if so then return error
    for(var i=0; i<db.getState().schedules.length;i++){
        if(db.getState().schedules[i].scheduleName===name){
            res.status(404).send("Error");
            return;
        }
    }
    //if the name does not exist then create a new schedule and instatiate subject/coursename pair as json objects
    db.get('schedules').push({scheduleName:name,
                                  subject: [],
                                  courseName:[] }).write();
    res.status(200).send("The schedule " + name + " has been created");
}); 

//task 5

router.put('/create/schedule/:name',(req,res)=>{
    const name = req.params.name;
    const schedule = req.body;
    let subCode = schedule.subjectCode
    let courCode = schedule.courseCode
    for(let i =0; i<db.getState().schedules.length; i++){
        if(db.getState().schedules[i].scheduleName===name){
            db.getState().schedules[i].subject = subCode;
            db.getState().schedules[i].courseName = courCode;
            db.update('schedules').write()
            res.status(200).send("Added")
            return;
        }
    }
    res.status(404).send('ERROR');
});

//task 6,7
router.route('/schedules/:name/')

    .get((req,res)=>{
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

})
    .post((req,res)=>{
    const sch_name = req.params.name;
    for(let i = 0; i<db.getState().schedules.length; i++){
        if(db.getState().schedules[i].scheduleName===sch_name){
            db.get("schedules").remove({scheduleName: sch_name}).write();
            res.send("Posted")
        }
    }
    res.status(404).send("Name doesn't exist")
    
});

//Task 8
router.get('/show/schedule', (req,res)=>{
    let scheduleList=[];
    for(let i = 0; i<db.getState().schedules.length; i++){
        scheduleList.push(`Schedule name:${db.getState().schedules[i].scheduleName}, Number of courses:${db.getState().schedules[i].courseName.length}`)
    }
    res.send(scheduleList);
});

//Task 9
router.post('/deleteall/schedules',(req,res)=>{
    for(let i = 0;i<db.getState().schedules.length;i++){
        db.set('schedules',[]).write();
        res.send("done")
    }
});





app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});