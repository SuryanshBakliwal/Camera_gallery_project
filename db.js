// Open a DB
// Create ObjectStore
// Make Transaction

let db;
let openRequest = indexedDB.open("myDataBase");
openRequest.addEventListener("success", (e) => {
    console.log("DB success");
    db = openRequest.result;
})
openRequest.addEventListener("error", (e) => {
    console.log("DB error");
})
openRequest.addEventListener("upgradeneeded", (e) => {
    console.log("DB upgraded and also for initial DB creation");
    db = openRequest.result;
    // objectstore only created in upgradeneeded

    db.createObjectStore("video", { keyPath: "id" });
    db.createObjectStore("image", { keyPath: "id" });
})