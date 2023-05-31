console.log("Service Worker Loaded...");

self.addEventListener("push", function (e) {
  console.log("SW Received Message: " + e.data);
  const data = e.data.json();
  console.log(data);
  self.registration.showNotification(data.name, {
    body: data.message,
    icon: "https://pacifencesolutions.com/wp-content/uploads/2022/08/pacifence-solutions-logo.webp",
    // tag: data.tag,
    // data: data.url,
  });
});
