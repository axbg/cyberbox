function loadNotes() {

    axios.get("http://cyberboxx.me/api/notes/get/folder/root")
        .then((response)=>{

            if(response.status === 200) {

                let files = document.getElementById("notes-wrapper");
                let content = "";

                content += "<ul>";

                for(let i = 0; i < response.data.length; i++){

                    if(response.data[i].isFolder){
                        content +=
                            "<li><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            " onclick='loadFolderNotes(this)'>" + response.data[i].title + "</span>"+
                            "<i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteNote(this)'></i>" +
                            "</li>";
                    }
                    else {
                        content +=
                            "<li><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].title + "</span>"+
                            "<i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteNote(this)'></i>" +
                            "<i class='fa fa-edit' id=" + response.data[i].id + " onclick='editModalNote(this)'></i>" +
                            "</li>";
                    }
                }

                content += "</ul>";
                files.innerHTML = content;

                controller = document.getElementById("notes-controller");
                controller.innerHTML = "";
                controller.innerHTML += '<i class="fa fa-plus" onclick="addModalNotesFolder();"></i>';
                controller.innerHTML += '<i class="fa fa-upload" onclick="addModalNotes()"></i>';

            } else if(response.status === 204) {

                let files = document.getElementById("files-wrapper");
                files.innerHTML = "";
                files.innerHTML = "<h1>No files here</h1>";

            } else {
                toastr.error("You are not allowed");
            }
        })
}

function loadFolderNotes(folder){

    axios.get("http://cyberboxx.me/api/notes/get/folder/" + folder.id)
        .then((response) => {

            if(response.status === 200) {

                let files = document.getElementById("notes-wrapper");
                let content = "";

                content += "<ul>";

                for(let i = 0; i < response.data.length; i++){

                    if(response.data[i].isFolder){
                        content +=
                            "<li><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            " onclick='loadFolderNotes(this)'>" + response.data[i].title + "</span>"+
                            "<i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteNote(this)'></i>" +
                            "</li>";
                    }
                    else {
                        content +=
                            "<li><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].title + "</span>"+
                            "<i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteNote(this)'></i>" +
                            "<i class='fa fa-edit' id=" + response.data[i].id + " onclick='editModalNote(this)'></i>" +
                            "</li>";
                    }
                }

                content += "</ul>";
                files.innerHTML = content;

                controller = document.getElementById("notes-controller");
                controller.innerHTML = "";
                controller.innerHTML += '<i class="fa fa-backward" onclick="loadNotes()"></i>';
                controller.innerHTML += '<i class="fa fa-upload" onclick="addModalNotes()"></i>';

            } else if(response.status === 204) {

                let files = document.getElementById("notes-wrapper");
                files.innerHTML = "";
                files.innerHTML = "<h1>No files here</h1>";

                controller = document.getElementById("notes-controller");
                controller.innerHTML = "";
                controller.innerHTML += '<i class="fa fa-backward" onclick="loadNotes()"></i>';
                controller.innerHTML += '<i class="fa fa-upload" onclick="addModalNotes()"></i>';

            } else {
                toastr.error("You are not allowed");
            }
        })
}

function addModalNotesFolder(){

        let modalcontent = document.getElementById('modal-content');
        modalcontent.innerHTML = "";

        openModal();
        modalcontent.innerHTML += '<h1>Folder Name</h1>';
        modalcontent.innerHTML += '<input id="title" type="text" style="font-size:40px;height:50px;width:50%">';
        modalcontent.innerHTML += '<button style="margin-top:5px;height:50px;width:50%;" onclick="createFolderNotes()">Create</button>';

}

function createFolderNotes(){

    let folder_name = document.getElementById("title").value;

    if(folder_name.length !=0 ) {
        axios.post("http://cyberboxx.me/api/notes/create/folder", {title:folder_name})
            .then((result) => {
                console.log(result.status);

                if(result.status === 201){

                    toastr.success("Folder was created!");
                    loadNotes();
                    closeModal();

                } else if(result.status === 200){

                    toastr.warning("Folder already exists!");

                } else {
                    toastr.error("Error");
                }
            }).catch(() => {toastr.error("error")});
    } else {
        toastr.error("Folder name is empty!");
    }
}

function deleteNote(element){

    if(confirm("Do you really want to delete this note?")) {
        axios.post("http://cyberboxx.me/api/notes/delete", {note_id: element.id})
            .then((result) => {

                if (result.status === 200) {
                    toastr.success(result.data.message);
                    loadNotes();
                }

            }).catch(() => {
            toastr.error("Error occurred");
        })
    }
}

function addModalNotes() {
    let modalcontent = document.getElementById('modal-content');

    modalcontent.innerHTML = "";

    openModal();
    modalcontent.innerHTML += '<h3>Note Title</h3>';
    modalcontent.innerHTML += '<input id="title" type="text" style="font-size:40px;height:50px;width:50%">';
    modalcontent.innerHTML += '<h3>Content</h3>';
    modalcontent.innerHTML += '<textarea id="content" style="font-size:20px;height:200px;width:50%;resize:none;"maxlenght=900000000000></textarea>';
    modalcontent.innerHTML += '<button style="margin-top:5px;height:50px;width:50%;" ' +
        'onclick="createNote()">Create</button>';
}

function createNote(){

    let noteTitle = document.getElementById("title").value;
    let noteContent = document.getElementById("content").value;


    axios.post("http://cyberboxx.me/api/notes/create/note", {title: noteTitle, content: noteContent})
        .then((response) => {

            if(response.status === 204){
                toastr.warning("Note already exists");
            } else if(response.status === 201){
                toastr.success(response.data.message);
                closeModal();
                loadNotes();
            }

        }).catch(() => {toastr.warning("Error occured")});

}

function editModalNote(note){

    let modalcontent = document.getElementById('modal-content');

    modalcontent.innerHTML = "";


    axios.get("http://cyberboxx.me/api/notes/get/note/" + note.id)
        .then((result) => {

            openModal();
            modalcontent.innerHTML += '<h3>Note Title</h3>';
            modalcontent.innerHTML += '<input id="title" type="text" style="font-size:20px;height:50px;width:50%"' +
                'value="' + result.data.title + '">';
            modalcontent.innerHTML += '<h3>Content</h3>';
            modalcontent.innerHTML += '<textarea id="content" style="font-size:20px;height:200px;width:50%;resize:none;"' +
                '>' + result.data.content + '</textarea>';
            modalcontent.innerHTML += '<button style="margin-top:5px;height:50px;width:50%;" ' +
                'onclick="editNote('+ note.id +')">Edit</button>';


        }).catch(() => toastr.error("Error occured"));


}

function editNote(element){

    let noteTitle = document.getElementById("title").value;
    let noteContent = document.getElementById("content").value;

    axios.post("http://cyberboxx.me/api/notes/edit/note", {note_id: element, title: noteTitle, content: noteContent})
        .then((response) => {

            if(response.status === 204){
                toastr.warning("A file with this name already exists");
            } else if(response.status === 200){
                toastr.success(response.data.message);
                closeModal();
                loadNotes();
            }

        }).catch(() => {toastr.warning("Error occured")});

}