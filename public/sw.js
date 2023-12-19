// to run server: npx http-server

//import DbActions from "./DbActionsAPIs";
//importScripts("../src/DbActionsAPIs.js")

//importScripts("s1.js")
// importScripts("src/Dexie_Actions.js")


const CACHE_NAME = 'app1-v1.0.0.0';

// The list of files to cache
const filesToCache = [
    // The root of the app
    '/',
    // The HTML file
    '/index.html',
    // The manifest file
    '/manifest.json'
  ];

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    console.log('Installing..')
    
    self.skipWaiting();
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll([
        '/'//,
        // '/index.html',
        // '/src/main.jsx',
        // '/manifest.json',
        // '/logo192.png',
        // '/vite.svg',
        // '/@vite/client',
        // '/@react-refresh',
        
        


        // , 'style.css'
        //,'/converter.js' ,'/converter.css'
        ]);
        // cache.addAll(filesToCache)
    })());
    console.log('Completed Installing.')
});

self.addEventListener("activate", function(event) {
  // Claim control of the current page
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    // const method = event.metho
    // console.log(actionTime, method, 'Fetching..1.1.1 ')
    event.respondWith(GetResponse(event));
});

async function GetResponse(event){
    const method = event.request.clone().method
    const actionTime = Date.now()
    try {    
        //console.log(actionTime, event.request.clone())
        // console.log(actionTime, method, 'Fetching..1.1.1 ')
        
        const fetchResponse = await fetch(event.request.clone());
        // Save the resource in the cache and return it.
        const cache = await caches.open(CACHE_NAME);
        if(method == 'GET'){
            // console.log(actionTime, 'Fetching..1.1.2 ')
            try{
                cache.put(event.request.clone(), fetchResponse.clone()).then(()=>{
                    // console.log(actionTime, 'Fetching..31 ')
                })
                .catch(err=>{console.log(actionTime, "then error..", err)})
            }catch (ex1){
                console.log("put error..", ex1)
            }   
        }
        return fetchResponse;
    } catch (e) {
        // The network failed.
        console.log(actionTime, 'No netwoerk found, trying to get from cache...')
        console.log(e, event.request.clone())
        
        // Try to get the resource from the cache.
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            return cachedResponse;
        } else {
            //console.log('Fetching..5')
            //console.log('No caches found.')
        }
    }    
}

// self.addEventListener('fetch', event => {
//     event.respondWith(GetResponse(event));
// });

// // add a sync event listener
// self.addEventListener("sync", event => {
//     console.log("Syncing..");
//     // check the tag of the sync event
//     if (event.tag === "delete-waiting") {
//       // perform some actions when the sync event is fired
//       console.log("Sync event fired..");
//       // read products table from indexedDB and save them to MongoDB
//       // you can use Dexie and Dexie.Syncable to simplify the process
//       // see the following websites for more details
//       // [Dexie.js - Minimalistic IndexedDB Wrapper](https://stackoverflow.com/questions/53381870/service-workers-and-indexeddb)
//       // [Dexie.Syncable](https://stackoverflow.com/questions/76633228/how-can-i-sync-my-indexeddb-data-to-my-mongodb)
//     }
// });

self.addEventListener("sync", event => {
    // fetch("http://127.0.0.1:4002/api/subsc").then(res=>{
    //     if(res.ok){
    //         console.log(res)
    //         return res.json()
    //     }
    //     // console.log(res.body)
    // }).then(data => console.log(data))
    // if(event.)
    console.log("syncing..")
    // DbActions.Sync()
    DbActions.Sync()
    .then(() => console.log('Sync operation successful!'))
    .catch(() => {
      // Sync failed, so reregister for another attempt
      return self.registration.sync.register('witing');
    })
})




