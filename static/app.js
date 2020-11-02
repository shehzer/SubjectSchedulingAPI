document.getElementById("myBtn").addEventListener("click", getSubjects)

async function getSubjects(){
    fetch(`/api/`).then(res => res.json()).then(data => {
        console.log(data)
        //document.getElementById('display').textContent = data;
        searchSub(data)
    })
}

function searchSub(data){
    let display = []
    let input = document.getElementById("Subject");
    let filtered = input.value.toUpperCase()
    for (let i = 0; i<data.length; i++ ){
        let textValue = data[i].subject
        if(textValue.toUpperCase().indexOf(filtered) > -1){
            console.log(textValue)
            display.push(data.filter(c => c.subject.toString().toUpperCase() === filtered));
        }
    }
    console.log(display);
    document.getElementById("display").textContent = JSON.stringify(display);
}

function getSubjectsandCourse(){
    let sInput = document.getElementById("Subject").value.toUpperCase();
    let cInput = document.getElementById("courseName").value.toUpperCase();
    fetch(`/api/subject/${sInput}/${cInput}`)
        .then(res => res.json()).then(data => {
        console.log(data[0].className)
        data = JSON.stringify(data)
        document.getElementById('display').textContent = data;
        //searchSubandCourse(data)
    })
}
function getSubjectsandCourseandComponent(){
    let sInput = document.getElementById("Subject").value.toUpperCase();
    let cInput = document.getElementById("courseName").value.toUpperCase();
    let comInput = document.getElementById("courseName").value.toUpperCase();
    fetch(`/api/timetable/${sInput}/${cInput}/${comInput}`).then(res => res.json()).then(data => {
        console.log(data[0].className)
        data = JSON.stringify(data)
        document.getElementById('display').textContent = data;
        //searchSubandCourse(data)
    })
}