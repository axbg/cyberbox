function loadSettings() {
    axios.get(address + "/api/settings/get")
        .then((response) => {
            let settings = document.getElementById("settings-wrapper");
            settings.innerHTML = "";

            let content = "";
            content += '<div class="content-wrapper files-perm-wrapper smaller\">';

            for (i = 0; i < 2; i++) {
                if (i === 0) {
                    content += '<a class="fa fa-envelope">  Email </a>\n';

                    if (response.data.mail === 1) {
                        content += '<i class="fa fa-check" onclick="changeMail()"></i>';
                    } else {
                        content += '<i class="fa fa-times-circle" onclick="changeMail()"></i>';
                    }

                    content += '<br/>';
                } else {
                    content += '<a class="fa fa-mobile">  Phone </a>\n';

                    if (response.data.push === 1) {
                        content += '<i class="fa fa-check" onclick="changePush()"></i>';
                    } else {
                        content += '<i class="fa fa-times-circle" onclick="changePush()"></i>';
                    }
                }
            }

            content += "</div>";
            settings.innerHTML = content;
        });
}

function changePush() {
    axios.post(address + "/api/settings/push")
        .then((result) => {
            if (result.status === 200) {
                toastr.success(result.data.message);
                loadSettings();
            }
        }).catch(() => toastr.warning("An error occurred"));
}

function changeMail() {
    axios.post(address + "/api/settings/mail")
        .then((result) => {
            if (result.status === 200) {
                toastr.success(result.data.message);
                loadSettings();
            }
        }).catch(() => toastr.warning("An error occurred"));
}

function getParentFolders() {
    let parents_container = document.getElementById("files-perm-wrapper");
    let content = "";

    axios.get(address + "/api/files/get/parents")
        .then((response) => {
            if (response.status === 200) {
                content += '<ul>';

                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].isPublic) {
                        content += "<li><a class='fa fa-folder-open'></a>" +
                            "<span>" + response.data[i].name + "</span>" +
                            "<i class='fa fa-eye'  id=" + response.data[i].id + " onclick='changeAccess(this)'></i>" +
                            "</li>";
                    } else {
                        content += "<li><a class='fa fa-folder-open'></a>" +
                            "<span>" + response.data[i].name + "</span>" +
                            "<i class='fa fa-eye-slash'  id=" + response.data[i].id + " onclick='changeAccess(this)'></i>" +
                            "</li>";
                    }
                }

                content += '</ul>';
            } else if (response.status === 203) {
                content += '<h1>You have no files</h1>';
            }

            parents_container.innerHTML = "";
            parents_container.innerHTML += content;
        });
}

function changeAccess(element) {
    axios.post(address + "/api/files/access", { file_id: element.id })
        .then((response) => {
            if (response.status === 201) {
                toastr.success(response.data.message);
                getParentFolders();
            } else if (response.status === 200) {
                toastr.success(response.data.message);
                getParentFolders();
            }
        });

}

function getParentNotes() {
    let parents_container = document.getElementById("notes-perm-wrapper");
    let content = "";

    axios.get(address + "/api/notes/get/folder/root")
        .then((response) => {
            if (response.status === 200) {
                content += '<ul>';

                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].isFolder) {
                        if (response.data[i].isPublic) {
                            content += "<li><a class='fa fa-folder-open'></a>" +
                                "<span>" + response.data[i].title + "</span>" +
                                "<i class='fa fa-eye'  id=" + response.data[i].id + " onclick='changeAccessNotes(this)'></i>" +
                                "</li>";
                        } else {
                            content += "<li><a class='fa fa-folder-open'></a>" +
                                "<span>" + response.data[i].title + "</span>" +
                                "<i class='fa fa-eye-slash'  id=" + response.data[i].id + " onclick='changeAccessNotes(this)'></i>" +
                                "</li>";
                        }
                    }
                }

                content += '</ul>';
            } else if (response.status === 203) {
                content += '<h1>You have no files</h1>';
            }

            parents_container.innerHTML = "";
            parents_container.innerHTML += content;
        });
}

function changeAccessNotes(element) {
    axios.get(address + "/api/notes/access/" + element.id)
        .then((response) => {
            if (response.status === 201) {
                toastr.success(response.data.message);
                getParentNotes();
            } else if (response.status === 200) {
                toastr.success(response.data.message);
                getParentNotes();
            }
        });
}