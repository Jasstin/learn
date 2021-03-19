// var scope = "global scope";
// function checkscope() {
//     var scope = "local scope";
//     function f() {
//         return scope;
//     }
//     return f();
// }
// let r = checkscope();
// console.log(r);
var scope = "global scope";
function checkscope() {
    var scope = "local scope";
    function f() {
        return scope;
    }
    return f;
}
r = checkscope()();
console.log(r,'2');