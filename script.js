let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recorder;
let recordFlag = false;
let chunks = []; // media data in chunks
let transparentColor = "transparent"


let constraints = {
    video: true,
    audio: false
}
// navigator -> global, browser info
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;
        recorder = new MediaRecorder(stream);

        recorder.addEventListener("start", (e) => {
            chunks = []
        })
        recorder.addEventListener("dataavailable", (e) => {
            chunks.push(e.data);
        })
        recorder.addEventListener("stop", (e) => {
            // Conversion of media chunks data to video
            let blob = new Blob(chunks, { type: "video/mp4" });
            // let videoUrl = window.URL.createObjectURL(blob);

            if (db) {
                let videoId = shortid();
                let dbTranscation = db.transaction("video", "readwrite")
                let videoStore = dbTranscation.objectStore("video")
                let videoEntry = {
                    id: `vid-${videoId}`,
                    blobData: blob
                }
                videoStore.add(videoEntry);
            }


        })
    })

recordBtnCont.addEventListener("click", (e) => {
    if (!recorder) return;

    recordFlag = !recordFlag;

    if (recordFlag) {
        // start
        recorder.start();
        recordBtn.classList.add("scale-record");
        startTimer();
    }
    else {
        // stop
        recorder.stop();
        recordBtn.classList.remove("scale-record");
        stopTimer();
    }

})

captureBtn.addEventListener("click", (e) => {
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height)
    let imgURl = canvas.toDataURL();
    
    if (db) {
        let imgId = shortid();
        let dbTranscation = db.transaction("image", "readwrite")
        let imgStore = dbTranscation.objectStore("image")
        let imgEntry = {
            id: `img-${imgId}`,
            url: imgURl
        }
        imgStore.add(imgEntry);
    }

    setTimeout(() => {
       captureBtn.classList.remove("scale-capture") 
    }, 5000);

})


let timerID;
let counter = 0; // represent total sec
let timer = document.querySelector(".timer");


function startTimer() {
    timer.style.display = "block"
    counter = 0;
    setInterval(displayTimer, 1000)
}

function displayTimer() {
    let totalSec = counter;

    let hours = Number.parseInt(totalSec / 3600);
    totalSec = totalSec % 3600;

    let minutes = Number.parseInt(totalSec / 60);
    totalSec = totalSec % 60;

    let sec = totalSec;

    hours = (hours < 10) ? `0${hours}` : hours
    minutes = (minutes < 10) ? `0${minutes}` : minutes
    sec = (sec < 10) ? `0${sec}` : sec
    timer.innerText = `${hours}:${minutes}:${sec}`
    counter++;
}

function stopTimer() {
    timer.style.display = "none"
    clearInterval(timerID);
    timer.innerText = "00:00:00";
}

// Filtrering logic

let filterLayer = document.querySelector(".filter-layer")
let allFilter = document.querySelectorAll(".filter")
allFilter.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        transparentColor = window.getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
})
