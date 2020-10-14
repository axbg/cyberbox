
function showGranted() {
    document.getElementById("granted").style.display = "block";
    document.getElementById("received").style.display = "none";
}

function showReceived() {
    document.getElementById("received").style.display = "block";
    document.getElementById("granted").style.display = "none";
}

function getReceived() {
    axios.get(address + "/api/permissions/get/received")
        .then((response) => {
            let received = document.getElementById("received");
            received.innerHTML = "";
            let content = "";

            if (response.data.length) {
                content += "<ul>";
                for (let i = 0; i < response.data.length; i++) {
                    content += "<li class='li-wrapper'><a class='fa fa-user'></a>" +
                        "<span id=" + response.data[i].id + ' email=' + response.data[i].email +
                        " onclick='othersMenu(this)'>" + response.data[i].email.split('@')[0] + "</span>" +
                        "<i class='icons'><i class='fa fa-arrow-right' id=" + response.data[i].id + ' email=' + response.data[i].email + " onclick='othersMenu(this)'></i>" +
                        "</i></li>";
                }

                content += "</ul>";
            } else {
                content += "<h1>Nobody gave you access</h1>";
            }
            received.innerHTML = content;
        })
}

function getGranted() {
    axios.get(address + "/api/permissions/get/granted")
        .then((response) => {
            let content = "";
            let received = document.getElementById("permissions-wrapper");
            received.innerHTML = "";

            if (response.data.length) {
                content += "<ul>";
                for (let i = 0; i < response.data.length; i++) {
                    content += "<li class='li-wrapper'><a class='fa fa-user'></a>" +
                        "<span id=" + response.data[i].email +
                        ">" + response.data[i].email.split('@')[0] + "</span>" +
                        "<i class='icons'><i class='fa fa-ban' id=" + response.data[i].email + " onclick='revokeAccess(this)'></i>" +
                        "</i></li>";
                }

                content += "</ul>";
            } else {
                content += "<h1>You gave access to no one</h1>";
            }
            received.innerHTML = content;
        })
}

function showResult(element) {
    let liveSearch = document.getElementById("liveSearch");
    liveSearch.innerHTML = '<p id="op0" onclick="liveSelected(this)"></p>';
    liveSearch.innerHTML += '<p id="op1" onclick="liveSelected(this)"></p>';
    liveSearch.innerHTML += '<p id="op2" onclick="liveSelected(this)"></p>';
    liveSearch.innerHTML += '<p id="op3" onclick="liveSelected(this)"></p>';

    if (element.length === 0) {
        liveSearch.style.display = "none";
    } else {
        axios.get(address + "/api/permissions/searchEmail/" + document.getElementById("email").value)
            .then((result) => {

                if (result.status === 200) {
                    for (let i = 0; i < result.data.length; i++) {
                        document.getElementById("op" + i).innerText = result.data[i]['email'];
                    }

                } else if (result.status === 203) {
                    liveSearch.innerHTML = "nothing found";
                }
            });

        liveSearch.style.border = "1px solid #A5ACB2";
        liveSearch.style.display = "block";
    }
}

function liveSelected(element) {
    document.getElementById("email").value = element.innerText;
    document.getElementById("liveSearch").style.display = "none";
}

function openGrantModal() {
    let modalcontent = document.getElementById('modal-content');
    modalcontent.innerHTML = "<span onclick='closeModal()' style='float:right;margin-top:-10px;'>X</span>";
    modalcontent.innerHTML += '<h3>Email</h3>';
    modalcontent.innerHTML += '<input id="email" class="input-fls" type="text" onkeyup="showResult(this.value)" ' +
        ' autocomplete="off" style="font-size:40px;height:50px;width:50%">';
    modalcontent.innerHTML += '<div id="liveSearch"</div>';
    modalcontent.innerHTML += '<button style="margin-top:5px;height:50px;width:50%;" ' +
        'onclick="grantAccess()">Grant Access</button>';

    openModal();
}

function grantAccess() {
    let email = document.getElementById("email").value;

    axios.post(address + "/api/permissions/create", { email: email })
        .then((response) => {
            if (response.status === 200) {
                toastr.warning(response.data.message);
                closeModal();
                getGranted();
            } else if (response.status === 201) {
                toastr.success(response.data.message);
                closeModal();
                getGranted();
            } else if (response.status === 203) {
                toastr.error(response.data.message);
            } else if (response.status === 204) {
                toastr.warning("You cannot grant permission to yourself");
            }
        });
}

function othersMenu(element) {
    let container = document.getElementById("received");

    let content = '<div class="col"><i style="padding:0 !important;">';
    content += element.getAttribute('email').split('@')[0];
    content += '\'s Box</i></div>';
    content += '<div class="content-wrapper"><div class="col">' +
        '<i class="fa fa-pencil" onclick="othersNotes(this)" owner_id="' + element.id + '">Notes</i>' +
        '</div><div class="col">' +
        '<i class="fa fa-file" onclick="othersFilesRoot(this)" owner_id="' + element.id + '">Files</i>' +
        '</div><div id="playground" class="content-wrapper"</div>';

    container.innerHTML = content;
}

function othersFilesRoot(element) {
    let playground = document.getElementById("playground");

    axios.get(address + "/api/files/get/root/friend/" + element.getAttribute('owner_id'))
        .then((response) => {
            if (response.status === 200) {
                let content = "<ul>";

                for (let i = 0; i < response.data.length; i++) {

                    if (response.data[i].isFolder) {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            ' onclick="loadFolderFriend(this)">' + response.data[i].name + "</span>" +
                            "<i class='icons'><i class='fa fa-download' id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            " onclick='downloadFileFriend(this)'></i>" +
                            "</i></li>";
                    }
                    else {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].name + "</span>" +
                            "<i class='icons'><i class='fa fa-download' id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            " onclick='downloadFileFriend(this)'></i>" +
                            "</i></li>";
                    }
                }
                content += "</ul>";
                playground.innerHTML = content;

            } else if (response.status === 201) {
                playground.innerHTML = '<h1>' + response.data.message + '</h1>';
            }
        }).catch(() => { toastr.error("Error occured") });

}

function downloadFileFriend(element) {
    let owner_id = element.getAttribute("owner_id");
    let file_id = element.id;

    window.location = address + "/api/files/get/friend/download/" + owner_id + "/" + file_id;
}

function loadFolderFriend(element) {
    let playground = document.getElementById("playground");

    axios.get(address + "/api/files/get/friend/" + element.getAttribute('owner_id') + "/" + element.id)
        .then((response) => {
            if (response.status === 200) {
                let content = "";
                content += "<div><a owner_id='" + element.getAttribute('owner_id') + "' class='fa fa-arrow-left controller' onclick='navigateBackFriend(this)'></a></div>";
                content += "<ul>";

                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].isFolder) {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            ' onclick="loadFolderFriend(this)">' + response.data[i].name + "</span>" +
                            "<i class='icons'><i class='fa fa-download' id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            " onclick='downloadFileFriend(this)'></i>" +
                            "</i></li>";
                    }
                    else {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].name + "</span>" +
                            "<i class='icons'><i class='fa fa-download' id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            " onclick='downloadFileFriend(this)'></i>" +
                            "</i></li>";
                    }
                }
                content += "</ul>";
                playground.innerHTML = content;

            } else if (response.status === 201) {
                playground.innerHTML = "<div><a owner_id='" + element.getAttribute('owner_id') + "' class='fa fa-arrow-left controller'" +
                    " onclick='navigateBackFriend(this)'></a></div>"
                    + '<h1>' + response.data.message + '</h1>';
            }
        }).catch(() => { toastr.error("Error occured") });
}

function navigateBackFriend(element) {
    let playground = document.getElementById("playground");

    axios.get(address + "/api/files/get/back/friend/" + element.getAttribute('owner_id'))
        .then((response) => {
            if (response.status === 200) {
                let content = "<div><a owner_id='" + element.getAttribute('owner_id') + "' onclick='navigateBackFriend(this)' class='fa fa-arrow-left controller'></a></div>";
                content += "<ul>";

                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].isFolder) {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            ' onclick="loadFolderFriend(this)">' + response.data[i].name + "</span>" +
                            "<i class='icons'><i class='fa fa-download' id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            " onclick='downloadFileFriend(this)'></i>" +
                            "</i></li>";
                    }
                    else {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].name + "</span>" +
                            "<i class='icons'><i class='fa fa-download' id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            " onclick='downloadFileFriend(this)'></i>" +
                            "</i></li>";
                    }
                }
                content += "</ul>";
                playground.innerHTML = content;

            } else if (response.status === 203) {
                toastr.warning("This is the root folder");
            }
        }).catch(() => { toastr.error("Error occured") });
}

function othersNotes(element) {
    let playground = document.getElementById("playground");

    axios.get(address + "/api/notes/get/friend/root/" + element.getAttribute('owner_id'))
        .then((response) => {
            if (response.status === 200) {
                let content = "<ul>";

                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].isFolder) {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-folder-open'></a>" +
                            "<span id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            ' onclick="loadFolderNotesFriend(this)">' + response.data[i].title + "</span>"
                            + "</li>";
                    }
                    else {
                        content +=
                            "<li class='li-wrapper'><a class='fa fa-file'></a>" +
                            "<span>" + response.data[i].title + "</span>" +
                            "<i class='icons'><i class='fa fa-edit' id=" + response.data[i].id +
                            ' owner_id="' + element.getAttribute('owner_id') + '"' +
                            " onclick='openNoteFriend(this)'></i>" +
                            "<i class='fa fa-text-height' id=" + response.data[i].id + " owner_id=" +
                            element.getAttribute('owner_id') + " onclick='rawNoteFriend(this)'></i>" +
                            "</i></li>";
                    }
                }

                content += "</ul>";
                playground.innerHTML = content;
            } else if (response.status === 201) {
                playground.innerHTML = '<h1>' + response.data.message + '</h1>';
            }
        }).catch(() => { toastr.error("Error occured") });
}

function loadFolderNotesFriend(element) {
    let playground = document.getElementById("playground");

    axios.get(address + "/api/notes/get/friend/folder/" + element.getAttribute('owner_id') + "/" + element.id)
        .then((response) => {
            if (response.status === 200) {
                let content = "<ul>";

                for (let i = 0; i < response.data.length; i++) {
                    content +=
                        "<li><a class='fa fa-file'></a>" +
                        "<span>" + response.data[i].title + "</span>" +
                        "<i class='fa fa-edit' id=" + response.data[i].id +
                        ' owner_id="' + element.getAttribute('owner_id') + '"' +
                        " onclick='openNoteFriend(this)'></i>" +
                        "<i class='fa fa-text-height' id=" + response.data[i].id + " owner_id=" +
                        element.getAttribute('owner_id') + " onclick='rawNoteFriend(this)'></i>" +
                        "</li>";
                }
                content += "</ul>";
                playground.innerHTML = content;

            } else if (response.status === 201) {
                playground.innerHTML = '<h1>' + response.data.message + '</h1>';
            }
        }).catch(() => { toastr.error("Error occured") });

}

function openNoteFriend(element) {
    let modalcontent = document.getElementById('modal-content');
    modalcontent.innerHTML = "";

    axios.get(address + "/api/notes/get/friend/note/" + element.getAttribute("owner_id") + "/" + element.id)
        .then((result) => {
            if (result.status === 200) {
                modalcontent.innerHTML += "<span onclick='closeModal()' style='float:right;margin-top:-10px;'>X</span>";
                modalcontent.innerHTML += '<h3>Note Title</h3>';
                modalcontent.innerHTML += '<input id="title" type="text" class="input-fls" style="font-size:20px;height:50px;width:50%"' +
                    'value="' + result.data.title + '" readonly>';
                modalcontent.innerHTML += '<h3>Content</h3>';
                modalcontent.innerHTML += '<textarea id="content" class="small-text" style="font-size:20px;height:200px;width:90%;resize:none;"' +
                    ' readonly>' + result.data.content + '</textarea>';
                openModal();
            }
        }).catch(() => toastr.error("Error occured"));
}

function rawNoteFriend(element) {
    window.open(address + "/api/notes/get/raw/" + element.id + "/" + element.getAttribute('owner_id'));
}

function revokeAccess(element) {
    axios.post(address + "/api/permissions/create", { email: element.id })
        .then((response) => {
            if (response.status === 200) {
                toastr.warning(response.data.message);
                closeModal();
                getGranted();
            } else if (response.status === 201) {
                toastr.success(response.data.message);
                closeModal();
                getGranted();
            } else if (response.status === 203) {
                toastr.error(response.data.message);
            }
        });
}