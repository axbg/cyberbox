

function loadUndoneReminders(){


    let container = document.getElementById('reminders-wrapper');
    let content  = "";

    axios.get(address + "/api/reminders/getUndone")
        .then((response) => {

            if(response.status === 200){
                content = '<ul>';

                for(let i = 0; i < response.data.length; i++){

                        content +=
                            "<li class='li-wrapper'><a class='fa fa-list'></a>" +
                            "<span>" + response.data[i].title +" - " + response.data[i].expiration + "</span>"+
                            "<i class='icons'><i class='fa fa-check' id=" + response.data[i].id + " onclick='makeDone(this)'></i>" +
                            "</i></li>";

                }

                content += '</ul>';

                container.innerHTML = content;
            } else if(response.status === 201){

                content+= '<h1>You have 0 Undone Reminders</h1>';
                container.innerHTML = content;

            }
        })
}

function loadDoneReminders(){

    let container = document.getElementById('reminders-wrapper');
    let content  = "";

    axios.get(address + "/api/reminders/getDone")
        .then((response) => {

            if(response.status === 200){
                content = '<ul>';

                for(let i = 0; i < response.data.length; i++){

                        content +=
                            "<li class='li-wrapper'><a class='fa fa-list'></a>" +
                            "<span>" + response.data[i].title +" - " + response.data[i].expiration + "</span>"+
                            "<i class='icons'><i class='fa fa-times' id=" + response.data[i].id + " onclick='makeUndone(this)'></i>" +
                            "</i></li>";

                }

                content += '</ul>';

                container.innerHTML = content;
            } else if(response.status === 201){

                content+= '<h1>You have 0 reminders</h1>';
                container.innerHTML = content;

            }
        })

}

function addModalReminder(){

    let modalcontent = document.getElementById('modal-content');
    modalcontent.innerHTML = "";

    modalcontent.innerHTML += "<span onclick='closeModal()' style='float:right;margin-top:-10px;'>X</span>";
    modalcontent.innerHTML += '<h3>New Reminder</h3>';
    modalcontent.innerHTML += '<input id="reminder" type="text" style="font-size:20px;height:30px;width:50%">';
    modalcontent.innerHTML += '<h3>Expiration Date</h3>';
    modalcontent.innerHTML += '<input id="date" type="date" style="font-size:20px;height:20px;width:50%">';
    modalcontent.innerHTML += '<button style="margin-top:5px;height:50px;width:50%;" onclick="createReminder()">Create</button>';

    openModal();
}

function createReminder(){

    let reminder = document.getElementById('reminder').value;
    let date = document.getElementById('date').value;

    axios.post(address + "/api/reminders/create", {title: reminder, expiration: date})
        .then((response) => {
            if(response.status === 201){
                toastr.success("Reminder created");
                closeModal();
                loadUndoneReminders();
            }
        }).catch(() => {toastr.error("Error occurred")});
}

function makeDone(element) {

    axios.post(address + "/api/reminders/makeDone", {reminder_id: element.id})
        .then((response) => {
            if(response.status === 200){
                toastr.success("Reminder set as done");
                loadUndoneReminders();
            }
        }).catch(() => {toastr.error("Error occurred")});
}

function makeUndone(element) {

    axios.post(address + "/api/reminders/makeUndone", {reminder_id: element.id})
        .then((response) => {
            if(response.status === 200){
                toastr.success("Reminder set as undone");
                loadDoneReminders();
            }
        }).catch(() => {toastr.error("Error occurred")});
}

