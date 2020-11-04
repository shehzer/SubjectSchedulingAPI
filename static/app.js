async function getSubjects(){
    let subject_input = document.getElementById("Subject").value.toUpperCase();
    fetch(`/api/${subject_input}`).then(res => res.json()).then(data => {
        console.log(data)
       // searchSub(data)
      //display(data);
      console.log(makeTable(data));
    // display(data);
     document.getElementById('display1').innerHTML = makeTable(data);
         //document.getElementById("display").textContent = JSON.stringify(data);
        
    })
}



function getSubsandCourse(){
    let sub = document.getElementById("Subject").value.toUpperCase();
    let course = document.getElementById("course").value.toUpperCase();
    fetch(`/api/subject/${sub}/${course}`).then(res => res.json()).then(data => {
        console.log(data);
        console.log(data[0].course_info[0].ssr_component);
        var exists = data.filter(function(d){
            return d.subject === sub
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
function getSubsandCourseandComp(){
    let sub = document.getElementById("Subject").value.toUpperCase();
    let cour = document.getElementById("course").value.toUpperCase();
    let comp = document.getElementById("component").value.toUpperCase();
    fetch(`/api/subject/${sub}/${cour}/${comp}`).then(res => res.json()).then(data => {
        console.log(data[0].className)
        console.log(data);
        var exists = data.filter(function(d){
            return d.catalog_nbr.toString().toUpperCase() === cour;
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

function name_new(){
    let scheduleName = document.getElementById('courseList').value.toUpperCase()
    fetch(`api/schedule/${scheduleName}`, {
        method: 'PUT'
    }).then(res =>{
        if (res.status === 404){
            document.getElementById('display').textContent = "Name exists, please use a new name!"
        }
        else{
            document.getElementById('display').textContent = "Schedule " + scheduleName + " has been created"
        }
    })
}

function add_new(){
    let scheduleName = document.getElementById('courseList').value.toUpperCase()
    let sub = document.getElementById("Subject").value.toUpperCase();
    let cour = document.getElementById("course").value.toUpperCase();
    fetch(`/api/create/schedule/${scheduleName}`, {
        method: 'PUT',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({"subjectCode": sub,
                              "courseCode": cour})
    }).then(res =>{
        if (res.status === 404){
            document.getElementById('display').textContent = "Name doesn't exist!"
        }
    })
}
//fix this to make it show a schedule
function display(){
    let scheduleName = document.getElementById('courseList').value.toUpperCase();
    fetch(`/api/schedules/${scheduleName}`).then(res => res.json()).then(data => {
       // console.log(data[0].className)
       // console.log(JSON.stringify(data));
       console.log(data);
       let result = Object.keys(data).map(e => {
            var info = {
                "subject": data.subject,
                "course" : data.course
            };
        return info;
    });
        console.log(result[0]);
        document.getElementById('display1').innerHTML = makeTable1(result);
        document.getElementById("display").textContent = `Schedule: ${scheduleName}`;


    })
}



function list_Schedules(){
    fetch(`/api/show/schedule`).then(res => res.json()).then(data => {
        console.log(data);
        console.log(data.length)
    //     let result = Object.keys(data).map(e => {
    //         var info = {
    //             "Schedule name": data[0]["Schedule name"],
    //             "course" : data[0]["Number courses"]
    //         };
    //     return info;
    // });
    // console.log(result)
    if(data.length ==0){
        document.getElementById('display').textContent = "You have no Schedules!!!"
        document.getElementById('display1').innerHTML = makeTable2(data);

    }
    else{
        document.getElementById('display1').innerHTML = makeTable(data);
    }
   

        //document.getElementById("display").textContent = JSON.stringify(data)
    })
}
function delete_Schedule() {
    let scheduleName = document.getElementById('courseList').value.toUpperCase()
    fetch(`/api/schedules/${scheduleName}`,{
        method: 'POST'
    }).then(res =>{
        if (res.status ===404){
            document.getElementById('display').textContent = "Schedule Name does not exist!"
        }
    })
}
function delete_All() {
    fetch(`/api/deleteall/schedules`,{
        method: 'POST'
    }).then(res => res.json()).then(data => {
        document.getElementById('display').textContent = "All schedules have been deleted!"
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


  function makeTable1(D){
    var a = '';
    cols = Object.keys(D[0]);
    a += '<table><thead><tr>';
    for(j=0;j<cols.length;j++) {
      a+= `<th>${cols[j]}</th>`;
    }
    a += '</tr></thead><tbody>';
  
    for(i=0;i<D.length; i=2) {
      a += '<tr>';
      for(j=0;j<cols.length;j++) {
        a += `<td>${D[0][cols[j]]}</td>`;
      }
      a += '</tr>';
    }
    a += '</tbody></table>';
    return a;
  }

  
  function makeTable2(D){
    var a = '';
    cols = Object.keys(D);
    a += '<table><thead><tr>';
    for(j=0;j<cols.length;j++) {
      a+= `<th>${cols[j]}</th>`;
    }
    a += '</tr></thead><tbody>';
  
    for(i=0;i<D.length; i=2) {
      a += '<tr>';
      for(j=0;j<cols.length;j++) {
        a += `<td>${D[0][cols[j]]}</td>`;
      }
      a += '</tr>';
    }
    a += '</tbody></table>';
    return a;
  }