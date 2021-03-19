/**实现一个浅克隆，只拷贝对象或者数组的第一层内容 */
function copy(target) {
    // 1. 先检测是一个对象，不是对象直接返回
    if (typeof target === 'object' && target != null) {
        console.log('object')
    } else {
        console.log(target);
    }
}
copy(1)
copy('1')
copy(true)
copy(null)
copy(undefined)
copy([])
copy(['1', '2'])
copy({})
copy('{}')
copy({ a: 1 })