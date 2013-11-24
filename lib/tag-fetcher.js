function TagFetcher() {
    // let db = null;
    // let request = indexedDB.open("merpDerp", 1);
    // request.onupgradeneeded = function(e) {
    //     db = e.target.result;

    //     if (!db.objectStoreNames.contains("todo")) {
    //         console.log("Creating TODO store");
    //         db.createObjectStore("todo", {
    //             keyPath: "timeStamp"
    //         });
    //     } else {
    //         console.log("Already contains TODO store");
    //     }
    // }

    // request.onsuccess = function(e) {
    //     db = e.target.result;
    //     console.log("Success with indexedDB!");

    //     let trans = db.transaction(["todo"], "readwrite");
    //     let store = trans.objectStore("todo");
    //     let req = store.put({
    //         "text": "merpily derp herp :D",
    //         "timeStamp": "booooo a date v2"
    //     });
    //     req.onsuccess = function(e) {
    //         console.log("yayyy we put in data!");
    //     };
    //     req.onerror = function(e) {
    //         console.log("booo an error");
    //         console.log(e.value);
    //     };
    // }
}

exports.TagFetcher = TagFetcher;