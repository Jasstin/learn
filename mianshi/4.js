var list = [
    { id: 1, name: '苹果', parentId: '0' },
    { id: 2, name: '香蕉', parentId: '1' },
    { id: 3, name: '猕猴桃', parentId: '2' },
    { id: 4, name: '西红柿', parentId: '2' }
]
console.log(convert2(list));
function convert(list, parent = '0', level = 0) {
    var out = []
    for (var node of list) {
        if (node.parentId == parent) {
            node.level = level;
            var children = convert(list, node.id, level + 1)
            if (children.length) {
                node.children = children
            }
            out.push(node)
        }
    }
    return out
}
function convert2(list, parent = '0') {
    var out = []
    for (var node of list) {
        if (node.parentId == parent) {
            var children = convert2(list, node.id)
            if (children.length) {
                node.children = children
            }
            out.push(node)
        }
    }
    return out
}