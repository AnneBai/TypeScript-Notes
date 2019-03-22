/**
 * 类型推断
 * 大部分情况下TS的类型推断是简单而直接的;
 *  1. 初始化赋值时, 如果没有显式声明类型, TS会进行类型推断;
 *      例如变量或成员的初始化, 设定函数参数默认值和函数返回值;
 *  2. Best common type, 最通用类型
 *      例如数组中的每一个元素是不同类型, TS会综合考虑所有类型然后从中选择能够涵盖所有其他类型的类型来作为该数组中的值类型;
 *      但是在已出现的类型中如果没有找到, 就会推断为联合类型(union array type)
 *  3. Contextual Type, 上下文类型
 *      当一个表达式的类型是通过其位置暗示的, 会进行上下文类型推断;
 *      例如一些事件回调函数的隐含参数event是事件对象, 传入的回调函数中第一个参数会被推断为时间对象类(除非显式设置为其他类型);
 *      其他还有右手边赋值,类型断言, 对象和数组字面量以及返回类型;
 *      * 上下文类型也会作为"最通用类型"的候选类型.
 */

window.onmousedown = function(mouseEvent) {
    // console.log(mouseEvent.clickTime);  //  Error: Property 'clickTime' does not exist on type 'MouseEvent'
};

class Animal {
    name: string;
}
class Rhino extends Animal {
    horn: number;
}
class Elephant extends Animal {
    height: number;
}
class Snake extends Animal {
    length: number;
}
// 没有最通用类型时, 类型推断为联合类型: (Rhino | Elephant | Snake)[], 只能在这三种类型的范围内;
let zoo = [new Rhino(), new Elephant(), new Snake()];
// 显式声明为 Animal[], 则不会使该数组不兼容其他Animal子类型
let zoo1: Animal[] = [new Rhino(), new Elephant(), new Snake()];

// 这里通过上下文推断返回值类型包括Animal[], 作为最通用类型的选项并被选择:
function createZoo(): Animal[] {
    return [new Rhino(), new Elephant(), new Snake()];
}