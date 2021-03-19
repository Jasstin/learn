/**
 * 变量的作用域在定义的时候确定
 * 函数会最先执行
 */
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();

// 结果是 ???