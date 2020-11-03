

async function getSubjects(){
    let sInput = document.getElementById("Subject").value.toUpperCase();
    fetch(`/api/${sInput}`).then(res => res.json()).then(data => {
        console.log(data)
       // searchSub(data)
      //display(data);
      console.log(makeTable(data));
    // display(data);
     document.getElementById('display1').innerHTML = makeTable(data);
         //document.getElementById("display").textContent = JSON.stringify(data);
        
    })
}



function getSubjectsandCourse(){
    let sInput = document.getElementById("Subject").value.toUpperCase();
    let cInput = document.getElementById("courseName").value.toUpperCase();
    fetch(`/api/timetable/${sInput}/${cInput}`).then(res => res.json()).then(data => {
        console.log(data);
        console.log(data[0].course_info[0].ssr_component);
        var exists = data.filter(function(d){
            return d.subject === sInput
        })
        .map(function(d){
            var i =0, j=0, k=0
                var info = {
    
                    "subject": d.subject,
                    "catalog_nbr": d.catalog_nbr,
                    "ssr_component": data[i].course_info[j].ssr_component,
                    "class_nbr": data[i].course_info[j].class_nbr,
                    "start_time": data[i].course_info[j].start_time,
                    "end_time": data[i].course_info[j].end_time,
                    "campus": data[i].course_info[j].campus,
                    "facility_ID": data[i].course_info[j].facility_ID,
                    "days": data[i].course_info[j].days[k],
                    "class_section": data[i].course_info[j].class_section,
                    "enrl_stat": data[i].course_info[j].enrl_stat,
                    "descrlong": data[i].course_info[j].descrlong,
                    

                   }
                   i++;
                   j++;
                   k++
                   return info;
            
        });
        data = JSON.stringify(exists)
        console.log(exists);       
        console.log(makeTable(exists));
        document.getElementById('display1').innerHTML = makeTable(exists);
    })
}
function getSubjectsandCourseandComponent(){
    let sInput = document.getElementById("Subject").value.toUpperCase();
    let cInput = document.getElementById("courseName").value.toUpperCase();
    let comInput = document.getElementById("component").value.toUpperCase();
    fetch(`/api/timetable/${sInput}/${cInput}/${comInput}`).then(res => res.json()).then(data => {
        console.log(data[0].className)
        console.log(data);
        var exists = data.filter(function(d){
            return d.catalog_nbr.toString().toUpperCase() === cInput;
        })
        .map(function(d){
            var i=0, j=0
            var info = {
                "subject": d.subject,
                "catalog_nbr": d.catalog_nbr,
                "ssr_component": data[i].course_info[j].ssr_component,
            }
            i++;
            j++;
            return info;
        });
        data = JSON.stringify(exists)

        console.log(makeTable(exists));
        document.getElementById('display1').innerHTML = makeTable(exists);
    
    })
}

function nameSchedule(){
    let scheduleName = document.getElementById('courseList').value.toUpperCase()
    fetch(`api/schedule/${scheduleName}`, {
        method: 'PUT'
    }).then(res =>{
        if (res.status === 404){
            document.getElementById('display').textContent = "Name already exists!"
        }
        else{
            document.getElementById('display').textContent = "Schedule " + scheduleName + " has been created"
        }
    })
}

function addContent(){
    let scheduleName = document.getElementById('courseList').value.toUpperCase()
    let sInput = document.getElementById("Subject").value.toUpperCase();
    let cInput = document.getElementById("courseName").value.toUpperCase();
    fetch(`/api/create/schedule/${scheduleName}`, {
        method: 'PUT',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({"subjectCode": sInput,
                              "courseCode": cInput})
    }).then(res =>{
        if (res.status === 404){
            document.getElementById('display').textContent = "Name doesn't exist!"
        }
    })
}
//fix this to make it show a schedule
function displaySchedule(){
    let scheduleName = document.getElementById('courseList').value.toUpperCase()
    fetch(`/api/schedules/${scheduleName}`,{
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(res => {
        if (res.status === 404) {
            document.getElementById("display").textContent = "Error no schedule exists"
        }
        res.text().then(data => {
            
            document.getElementById("display").textContent = `Schedule: ${scheduleName} Classes + data`;
        })
    })
}
function listOfSchedules(){
    fetch(`/api/show/schedule`).then(res => res.json()).then(data => {
        document.getElementById("display").textContent = JSON.stringify(data)
    })
}
function deleteSchedName() {
    let scheduleName = document.getElementById('courseList').value.toUpperCase()
    fetch(`/api/schedules/${scheduleName}`,{
        method: 'POST'
    }).then(res =>{
        if (res.status ===404){
            document.getElementById('display').textContent = "Name doesn't exist!"
        }
    })
}
function deleteSchedAll() {
    fetch(`/api/deleteall/schedules`,{
        method: 'POST'
    }).then(res => res.json()).then(data => {
        document.getElementById('display').textContent = "Deleted all schedules!"
    })
}





























// function display(data){
//     const ol = document.getElementById('list');
//        data.forEach(element => {
//            const item = document.createElement('li');
//            item.style.width  = '100px';
//            item.style.border = '1px solid black';

//            item.appendChild(document.createTextNode(`Subject: ${element.subject} Course:${element.catalog_nbr}`));
//            ol.appendChild(item);

//        })
// }



function makeTable(D){
    var a = '';
    cols = Object.keys(D[0]);
    a += '<table><thead><tr>';
    for(j=0;j<cols.length;j++) {
      a+= `<th>${cols[j]}</th>`;
    }
    a += '</tr></thead><tbody>';
  
    for(i=0;i<D.length; i++) {
      a += '<tr>';
      for(j=0;j<cols.length;j++) {
        a += `<td>${D[i][cols[j]]}</td>`;
      }
      a += '</tr>';
    }
    a += '</tbody></table>';
    return a;
  }