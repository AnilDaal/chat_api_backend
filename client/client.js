if ("serviceWorker" in navigator) {
  send().catch((err) => console.error(err));
}

async function send() {
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/",
  });

  function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const publicVapidKey =
    "BGTENNG-UZ4kRGsmegXHnYQWfds4rpsL_DA9ctGHl0bYJCtJLPqjw697QmvTYUzx0qDYCJuMTrEBxDi71dJfsAs";
  const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);
  const subscriber = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey,
  });
  console.log("push Registred...");

  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscriber),
    headers: {
      "Content-type": "application/json",
    },
  });
  console.log("push sent...");
}
