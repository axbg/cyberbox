
function login(){

    let email = 'bisagalexstefan@gmail.com';

    axios.post("http://localhost:8080/auth/login", {email:email})
        .then((result)=>{
            if(result.status === 200){
                window.location.replace('new_index.html');

            } else {
                toastr.info("Your email is not allowed");
            }
        });
}

function logout(){

    axios.post("http://localhost:8080/auth/logout")
        .then((result) => {
            window.location.replace('index.html');
            toastr.success("You've been logged out");

        })
}

function loadFiles() {

    axios.get("http://localhost:8080/api/files/get")
        .then((response)=>{

            if(response.status === 200) {

                let files = document.getElementById("files-wrapper");
                let content = "";

                content += "<ul>";

                for(let i = 0; i < response.data.length; i++){

                    if(response.data[i].isFolder){
                        content +=
                            "<li><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            " onclick='loadFolder(this)'>" + response.data[i].name + "</span>"+
                            "<i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "</li>";
                    }
                    else {
                        content +=
                            "<li><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].name + "</span>"+
                            "<i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "</li>";
                    }
                }

                content += "</ul>";
                files.innerHTML = content;

            } else if(response.status === 204) {

                let files = document.getElementById("files-wrapper");
                files.innerHTML = "";
                files.innerHTML = "<h1>No files here</h1>";

            } else {
                toastr.error("You are not allowed");
            }
        })

}

function loadFolder(folder) {

    axios.get("http://localhost:8080/api/files/get/" + folder.id)
        .then((response) => {

            if(response.status === 200) {

                let files = document.getElementById("files-wrapper");
                let content = "";

                content += "<ul>";

                for(let i = 0; i < response.data.length; i++){

                    if(response.data[i].isFolder){
                        content +=
                            "<li><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            " onclick='loadFolder(this)'>" + response.data[i].name + "</span>"+
                            "<i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "</li>";
                    }
                    else {
                        content +=
                            "<li><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].name + "</span>"+
                            "<i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "</li>";
                    }
                }

                content += "</ul>";
                files.innerHTML = content;

            } else if(response.status === 204) {

                let files = document.getElementById("files-wrapper");
                files.innerHTML = "";
                files.innerHTML = "<h1>No files here</h1>";

            } else {
                toastr.error("You are not allowed");
            }
        })
}

function backFolder() {

    axios.get("http://localhost:8080/api/files/back")
        .then((response) => {
            if(response.status === 200) {

                let files = document.getElementById("files-wrapper");
                let content = "";

                content += "<ul>";

                for(let i = 0; i < response.data.length; i++){

                    if(response.data[i].isFolder){
                        content +=
                            "<li><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            " onclick='loadFolder(this)'>" + response.data[i].name + "</span>"+
                            "<i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "</li>";
                    }
                    else {
                        content +=
                            "<li><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].name + "</span>"+
                            "<i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download'  id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "</li>";
                    }
                }

                content += "</ul>";
                files.innerHTML = content;

            } else if(response.status === 204) {

                let files = document.getElementById("files-wrapper");
                files.innerHTML = "";
                files.innerHTML = "<h1>No files here</h1>";

            } else if(response.status === 203) {
                    toastr.warning("This is your root folder");
            }
                else {
                    toastr.error("You are not allowed");
                }
        })
}

function addModalFolder(){

    let modalcontent = document.getElementById('modal-content');
    modalcontent.innerHTML = "";

    openModal();
    modalcontent.innerHTML += '<h1>Folder Name</h1>';
    modalcontent.innerHTML += '<input id="folder_name" type="text" style="font-size:40px;height:50px;width:50%">';
    modalcontent.innerHTML += '<button style="margin-top:5px;height:50px;width:50%;" onclick="addFolder()">Create</button>';

}

function addFolder() {

    let folder_name = document.getElementById("folder_name").value;

    if(folder_name.length !=0 ){

    axios.post("http://localhost:8080/api/files/create", {name:folder_name})
        .then((result) => {

            if(result.status === 201){

                toastr.success("Folder was created!");
                loadFiles();

            } else if(result.status === 200){

                toastr.warning("Folder already exists!");

            } else {
                toastr.error("Error");
            }
        }).catch(() => {toastr.error("error")});

    } else {
        toastr.error("Empty names are not allowed");
    }

    closeModal();
}

function deleteFile(element){

    if(confirm("Do you really want to delete this file?")) {

        axios.post("http://localhost:8080/api/files/delete", {file_id: element.id})
            .then((response) => {
                toastr.success("File was deleted");
                loadFiles();
            }).catch((error) => {
            toastr.error("An error occured");
            console.log(error)
        });
    }
}

function downloadFile(element){

    axios.get("http://localhost:8080/api/files/download/" + element.id)
        .then((result)=>{
            window.location = "http://localhost:8080/api/files/download/" + element.id;
        })
}

function uploadModalFiles(){

    let modalcontent = document.getElementById('modal-content');
    modalcontent.innerHTML = "";


    modalcontent.innerHTML += '<h1>Upload Files</h1>';
    modalcontent.innerHTML += '<form method="post" enctype="multipart/form-data">';
    modalcontent.innerHTML += '<p><input id="files-input" name="fisier[]" type="file" value="Browse" multiple ' +
        'style="font-size:30px;height:40px;width:40%"></p>';
    modalcontent.innerHTML += '<button style="margin-top:5px;height:30px;width:40%;" onclick="uploadFiles()">Upload</button>';
    modalcontent.innerHTML += '</form>';


    openModal();
}

function uploadFiles(){

    let files = document.getElementById("files-input");
    let modalcontent = document.getElementById('modal-content');
    modalcontent.innerHTML = '<div class="container col loader"></div>';

    let form = new FormData();


    for(let i = 0; i < files.files.length; i++){
        form.append("fisiere", files.files[i]);
    }


    axios.post("http://localhost:8080/api/files/upload", form)
        .then((response) => {

            if(response.status === 201){
                toastr.success("Files Uploaded");
                loadFiles();
                closeModal();
            } else if(response.status === 200){
                for(let i=0; i < response.data.message.length; i++){
                    toastr.warning(response.data.message[i]);
                    uploadModalFiles();
                }
            } else if(response.status === 204){
                toastr.error("File bigger than 5MB");
                closeModal();
            }
        }).catch(() => toastr.error("Error occured"));

}

//modal controllers
function openModal() {
    document.getElementById('myModal').style.display = "block";
}

function closeModal(){
    document.getElementById('myModal').style.display = "none";
}


    let modal = document.getElementById('myModal');


    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };


