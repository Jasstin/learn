var EventEmitter = new require('events').EventEmitter;
var event = new EventEmitter();
event.on('some_event', function () {
    console.log('事件触发',arguments);
});
event.on('some_event', function () {
    console.log('事件触发2',arguments);
});
setTimeout(function () {
    event.emit('some_event', 11, 22, 33);
}, 1000);

