self.addEventListener('notificationclose', function(event) {
    var notification = event.notification;
    console.log(notification);
});

self.addEventListener('notificationclick', function(event) {
    var notification = event.notification;
    console.log(notification);
    self.clients.matchAll()
        .then(clients => clients
            .forEach(client => client
                .postMessage(event.action)));
});