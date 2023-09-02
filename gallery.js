setTimeout(() => {
    if (db) {
        // video retreval
        let vidDbTranscation = db.transaction("video", "readonly");
        let videoStore = vidDbTranscation.objectStore("video");
        let videoRequest = videoStore.getAll(); //Event Driven
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont")
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = `
                <div class="media">
                <video autoplay loop src="${url}"></video>
                </div>
                <div class="download action-btn">DOWNLOAD</div>
                <div class="delete action-btn">DELETE</div>
                `;
                galleryCont.appendChild(mediaElem)


                let deletebtn = mediaElem.querySelector(".delete")
                if(deletebtn) deletebtn.addEventListener("click", deleteListener)
                let downloadbtn = mediaElem.querySelector(".download")
                if(downloadbtn) downloadbtn.addEventListener("click", downloadListener);
            });
        }


        // img retreval

        let imgDbTranscation = db.transaction("image", "readonly");
        let imgStore = imgDbTranscation.objectStore("image");
        let imgRequest = imgStore.getAll(); //Event Driven
        imgRequest.onsuccess = (e) => {
            let imgResult = imgRequest.result;
            let galleryCont = document.querySelector(".gallery-cont")
            imgResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.id)

                let url = imageObj.url;
                mediaElem.innerHTML = `
                    <div class="media">
                        <img src="${url}" />
                    </div>
                    <div class="download action-btn">DOWNLOAD</div>
                    <div class="delete action-btn">DELETE</div>
                `;
                galleryCont.appendChild(mediaElem);


                let deletebtn = mediaElem.querySelector(".delete")
                if(deletebtn) deletebtn.addEventListener("click", deleteListener)
                let downloadbtn = mediaElem.querySelector(".download")
                if(downloadbtn) downloadbtn.addEventListener("click", downloadListener);
            });
        }
    }
}, 100)

// UI remove, DB remove
function deleteListener(e) {

    // DB removal
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let vidDbTranscation = db.transaction("video", "readwrite");
        let videoStore = vidDbTranscation.objectStore("video");
        videoStore.delete(id);

    } else if (type === "img") {

        let imgDbTranscation = db.transaction("image", "readwrite");
        let imgStore = imgDbTranscation.objectStore("image");
        imgStore.delete(id);
    }

    //UI removal
    e.target.parentElement.remove();
}

function downloadListener(e) {
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3);
    if (type === "vid") {
        let vidDbTranscation = db.transaction("video", "readwrite");
        let videoStore = vidDbTranscation.objectStore("video");
        let vidRequest = videoStore.get(id);
        vidRequest.onsuccess = (e) => {
            let vidResult = vidRequest.result;
            let url = URL.createObjectURL(vidResult.blobData);
            let a = document.createElement("a");
            a.href = url;
            a.download = "stream.mp4";
            a.click();
        }

    } else if (type === "img") {

        let imgDbTranscation = db.transaction("image", "readwrite");
        let imgStore = imgDbTranscation.objectStore("image");
        let imgRequest = imgStore.get(id);
        imgRequest.onsuccess = (e) => {
            let imgResult = imgRequest.result;
            let a = document.createElement("a");
            a.href = imgResult.url;
            a.download = "img.jpg";
            a.click();
        }
    }

}