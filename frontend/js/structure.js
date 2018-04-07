const address = "https://cyberboxx.me";
const publicKey = 'BLRPNGqbj2rv4_nq73DyEtxf4TEObI514MTLCpUt1qtB7hiQC-Ip52Kj1KHXq6QKbIJ_hjw2o6FzIimPUzmndBA';

navigator.serviceWorker && navigator.serviceWorker.register('./js/sw.js').then(function(registration) {
    console.log('Excellent, registered with scope: ', registration.scope);
});

navigator.serviceWorker && navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            if (subscription) {
                console.info('Got existing', subscription);
                window.subscription = subscription;
                return;  // got one, yay
            }

            const applicationServerKey = urlB64ToUint8Array(publicKey);
            serviceWorkerRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
            })
                .then(function(subscription) {
                    console.info('Newly subscribed to push!', subscription);
                    window.subscription = subscription;
                });
        });
});


function openNav() {
    document.getElementById("mySidenav").style.height = "100%";

}

function closeNav() {
    document.getElementById("mySidenav").style.height = "0%";

}

function changeMenu(element){

    document.getElementById("mySidenav").style.height = "0";


    let nodes = document.getElementById('main').childNodes;
    for(let i=0; i<nodes.length; i++) {
       if(nodes[i].nodeName === 'DIV') {
            document.getElementById(nodes[i].id).style.display = "none";
        }
    }


    document.getElementById(element).style.display = "block";
}

window.onload = function(){

    let nodes = document.getElementById('main').childNodes;
    for(let i=0; i<nodes.length; i++) {

        if(nodes[i].nodeName === 'DIV') {
            document.getElementById(nodes[i].id).style.display = "none";
        }
    }


    document.getElementById('welcome').style.display = "block";
    document.getElementById('received').style.display = "none";

    welcome();

    document.documentElement.style.display = "block";

};


function welcome() {

    axios.get(address + "/api/users/welcome")
        .then((response) => {

            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'];
            let d = new Date();
            let dayName = days[d.getDay()];
            let monthName = months[d.getMonth()];

            document.getElementById('welcome-name').innerHTML = "Welcome " + response.data.name;
            document.getElementById('welcome-day').innerHTML = "It's " + dayName;
            document.getElementById('welcome-day-numbers').innerHTML = d.getDate() + " " + monthName + " " + d.getFullYear();
            document.getElementById('welcome-files').innerHTML = "You have " + response.data.files + " files";
            document.getElementById('welcome-notes').innerHTML = "You have " + response.data.notes + " notes";
            document.getElementById('welcome-reminders').innerHTML = "You have " + response.data.reminders + " reminders";
        })
        .catch(() => {
            localStorage.setItem("logged", 0);
            alert("Your cookie expired. Please log in");
            window.location.replace("index.html");
        });
}