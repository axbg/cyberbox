
function logout(){

    axios.post(address + "/auth/logout")
        .then((result) => {
            localStorage.setItem("logged", 0);
            window.location.replace('index.html');
        })
}

function loadFiles() {

    axios.get(address + "/api/files/get")
        .then((response)=>{

            if(response.status === 200) {

                let files = document.getElementById("files-wrapper");
                let content = "";

                content += "<ul>";

                for(let i = 0; i < response.data.length; i++){

                    if(response.data[i].isFolder){
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            " onclick='loadFolder(this)'>" + response.data[i].name + "</span>"+
                            "<i class='icons'><i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "<i class='fa fa-pencil-square' fileId='" + response.data[i].id + "' onclick='renameModal(this)' current='" +
                            response.data[i].name + "'></i>" +
                            "</i></li>";
                    }
                    else {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].name + "</span>"+
                            "<i class='icons'><i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "<i class='fa fa-pencil-square' fileId='" + response.data[i].id + "' onclick='renameModal(this)' current='" +
                            response.data[i].name + "'></i>" +
                            "</i></li>";
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

    axios.get(address + "/api/files/get/" + folder.id)
        .then((response) => {

            if(response.status === 200) {

                let files = document.getElementById("files-wrapper");
                let content = "";

                content += "<ul>";

                for(let i = 0; i < response.data.length; i++){

                    if(response.data[i].isFolder){
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            " onclick='loadFolder(this)'>" + response.data[i].name + "</span>"+
                            "<i class='icons'><i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "<i class='fa fa-pencil-square' fileId='" + response.data[i].id + "' onclick='renameModal(this)' current='" +
                            response.data[i].name + "'></i>" +
                            "</i></li>";
                    }
                    else {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].name + "</span>"+
                            "<i class='icons'><i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "<i class='fa fa-pencil-square' fileId='" + response.data[i].id + "' onclick='renameModal(this)' current='" +
                            response.data[i].name + "'></i>" +
                            "</i></li>";
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

    axios.get(address + "/api/files/back")
        .then((response) => {
            if(response.status === 200) {

                let files = document.getElementById("files-wrapper");
                let content = "";

                content += "<ul>";

                for(let i = 0; i < response.data.length; i++){

                    if(response.data[i].isFolder){
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            " onclick='loadFolder(this)'>" + response.data[i].name + "</span>"+
                            "<i class='icons'><i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "<i class='fa fa-pencil-square' fileId='" + response.data[i].id + "' onclick='renameModal(this)' current='" +
                            response.data[i].name + "'></i>" +
                            "</i></li>";
                    }
                    else {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].name + "</span>"+
                            "<i class='icons'><i class='fa fa-trash' id=" + response.data[i].id + " onclick='deleteFile(this)'></i>" +
                            "<i class='fa fa-download' id=" + response.data[i].id + " onclick='downloadFile(this)'></i>" +
                            "<i class='fa fa-pencil-square' fileId='" + response.data[i].id + "' onclick='renameModal(this)' current='" +
                            response.data[i].name + "'></i>" +
                            "</i></li>";
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

    modalcontent.innerHTML += "<span onclick='closeModal()' style='float:right;margin-top:-10px;'>X</span>";
    modalcontent.innerHTML += '<h1>Folder Name</h1>';
    modalcontent.innerHTML += '<input id="folder_name" class="input-fls small-text" type="text" style="font-size:30px;height:30px;width:50%">';
    modalcontent.innerHTML += '<button class="input-fls" style="margin-top:5px;height:50px;width:50%;" onclick="addFolder()">Create</button>';

    openModal();
}

function addFolder() {

    let folder_name = document.getElementById("folder_name").value;

    if(folder_name.length !=0 ){

    axios.post(address + "/api/files/create", {name:folder_name})
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

        axios.post(address + "/api/files/delete", {file_id: element.id})
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

    window.location = address + "/api/files/download/" + element.id;
}

function uploadModalFiles(){

    let modalcontent = document.getElementById('modal-content');
    modalcontent.innerHTML = "";
    modalcontent.innerHTML += "<span onclick='closeModal()' style='float:right;margin-top:-10px;'>X</span>";
    modalcontent.innerHTML += '<h1>Upload Files</h1>';
    modalcontent.innerHTML += '<form method="post" enctype="multipart/form-data">';
    modalcontent.innerHTML += '<p><input class="input-fls" id="files-input" name="fisier[]" type="file" value="Browse" multiple ' +
        'style="font-size:25px;height:40px;width:50%"></p>';
    modalcontent.innerHTML += '<button class="input-fls" style="margin-top:5px;height:30px;width:50%;" onclick="uploadFiles()">Upload</button>';
    modalcontent.innerHTML += '</form>';


    openModal();
}

function uploadFiles(){

    let files = document.getElementById("files-input");

    let size = 0;

    for(let i = 0; i < files.files.length; i++){
        size = size + files.files[i].size;
    }


    if(size !== 0 && size < 250000000) {

        let modalcontent = document.getElementById('modal-content');
        modalcontent.innerHTML = '<div class="container col loader"></div>';
        modalcontent.innerHTML += '<div id="percentage-loader"></div>';

        let form = new FormData();
        let percentageLoader = document.getElementById("percentage-loader");

        for (let i = 0; i < files.files.length; i++) {
            form.append("fisiere", files.files[i]);
        }

        axios.post(address + "/api/files/upload", form, {
            onUploadProgress: (progressEvent) => {
                const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');

                if (totalLength !== progressEvent.loaded) {
                    percentageLoader.innerHTML = '<h3>' + (Math.round( (progressEvent.loaded * 100) / totalLength ))
                                                        + '%</h3>';
                }
            }
        }).then((response) => {

                if (response.status === 201) {
                    toastr.success("Files Uploaded");
                    loadFiles();
                    closeModal();
                } else if (response.status === 200) {
                    for (let i = 0; i < response.data.message.length; i++) {
                        toastr.warning(response.data.message[i]);
                        loadFiles();
                        closeModal();
                    }
                } else if (response.status === 204) {
                    toastr.error("File bigger than 150MB");
                    closeModal();
                }
            }).catch(() => toastr.error("Error occured"));
    } else if(size >= 250000000) {

        toastr.error("Upload limit is 250MB");
    }
    else{

        toastr.error("You cannot upload empty files");
    }

}


function renameModal(file){

    let modalcontent = document.getElementById('modal-content');
    let currentTitle = file.getAttribute("current");
    let currentId = file.getAttribute("fileId");
    modalcontent.innerHTML = "";

    modalcontent.innerHTML += "<span onclick='closeModal()' style='float:right;margin-top:-10px;'>X</span>";
    modalcontent.innerHTML += '<h1>Rename File</h1>';
    modalcontent.innerHTML += '<input id="file_name" class="input-fls small-text" type="text"' +
        ' value="' + currentTitle + '"style="font-size:30px;height:30px;width:50%">';
    modalcontent.innerHTML += '<h3>Be aware that you can modify the file\'s extension too!</h3>';
    modalcontent.innerHTML += '<button id="' + currentId + '"class="input-fls" style="margin-top:5px;height:50px;width:50%;" onclick="renameFolder(this)">Rename</button>';

    openModal();

}

function renameFolder(element) {

    let file_name = document.getElementById("file_name").value;

    if(file_name.length !==0){

        axios.post(address + "/api/files/rename", {file_id: element.id, name:file_name})
            .then((result) => {

                if(result.status === 200){

                    toastr.success("File was renamed!");
                    loadFiles();
                    closeModal();

                } else if(result.status === 203){

                    toastr.warning("File already exists!");

                } else {
                    toastr.error(result.status);
                }
            }).catch(() => {toastr.error("error")});

    } else {
        toastr.error("Empty names are not allowed");
    }
}



function openModal() {
    document.getElementById('myModal').style.display = "block";
}

function closeModal(){
    document.getElementById('myModal').style.display = "none";
    modified = 0;
}


    let modal = document.getElementById('myModal');
    let modified = 0;

    window.onclick = function(event) {
        if (event.target === modal) {
            if(document.getElementById("content") && document.getElementById("content").value !== "" &&
                !document.getElementById("content").readOnly && modified === 1) {
                if (confirm("Do you really want to close?")) {
                    modal.style.display = "none";
                    modified = 0;
                }
            } else {
                modal.style.display = "none";
            }
        }
    };


