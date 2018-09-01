
(function (e) {
  console.log("hi");

  if (
    // process.env.NODE_ENV === 'production'
    // &&
    'serviceWorker' in navigator
  ){
console.log("ok");
    window.addEventListener('load', ()=>{
    console.log("kkkkkk");

      const swUrl = './service-worker.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration)=>{
          console.log("right");

          registration.onupdatefound = ()=>{
            console.log("yr");

            const installingWorker = registration.installing;

            installingWorker.onstatechange = ()=>{
              console.log("boo");

              if (installingWorker.state === 'installed'){
                if (navigator.serviceWorker.controller){
                  console.log('New content is available; please refresh.');
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error)=>{
          console.error('Error during service worker registration:', error);
        });
    });
  }
}).call(this);

// export function unregister (){
//   if ('serviceWorker' in navigator){
//     navigator.serviceWorker.ready.then((registration)=>{
//       registration.unregister();
//     });
//   }
// }
