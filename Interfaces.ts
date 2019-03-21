/**
 * TypeScript的一个核心原则是对给定了类型的值进行类型检查, 也叫做"鸭式辨型"或"结构亚型";
 * 在TypeScript中, 接口(interfaces)用于命名这些类型, 也是在你的项目代码内部甚至外部建立"契约"的有力工具.
 */

/**
 * 对于一个函数, TypeScript在编译时会检查传入该函数的参数个数及各自类型是否与声明时相匹配;
 */

function printLabel(obj: {label: string}) { // 参数必须是包含值为string类型的"label"属性的对象
    console.log(obj.label);
}
let myObj = {size: 10, label: "size 10 object"};
printLabel(myObj);
// 改写为接口形式
interface LabelValue { // 注意没有赋值符也没有冒号, 内部每一项类型声明结束需要分号
    label: string;
}

function printLabel1(obj: LabelValue) {
    console.log(obj.label);
}

// interface就像是规定一个"至少应该满足"的"形状",
// 对象必须至少拥有所有在接口中声明必需的属性并且其值类型相符, 才能通过编译器的类型检查;
// 另外, 接口对属性的顺序没有要求.

/**
 * interface可以规定有些属性不是必需, 在属性名后加"?";
 * TypeScript中使用接口的可选属性, 可以帮助检查函数中对属性访问时的拼写错误或误用:
 */
interface SquareConfig {
    color?: string;
    width?: number;
}
function createSquare(config: SquareConfig): {color: string; area: number} { // 参数为SquareConfig类型, 返回值包含color(string)和area(number)属性.
    let newSquare = {color: "white", area: 100, width: 10};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    // if (config.length) {
    //     // Error, Property 'length' does not exist on type 'SquareConfig'
    // }
    return newSquare;
}

/**
 * 只读属性: 接口中对属性规定初始化后不允许更改
 */

interface Point {
    readonly x: number;
    readonly y: number;
}

// 声明不可变数组的方式: ReadonlyArray<T>, 等同于移除了所有可变方法的Array<T>
let arr: number[] = [1, 2, 3];
let arrReadonly: ReadonlyArray<number> = arr;
// 此时arrReadonly失去了pop, shift, push等这类可变方法, 不能再赋值给普通数组类型的变量; 但可以通过断言来强制赋值
// arr = arrReadonly; // Error: Type 'ReadonlyArray<number>' is missing the following properties from type 'number[]': pop, push, reverse, shift, and 6 more.
arr = arrReadonly as number[]; // OK
// arrReadonly.push(5); // Error: Property 'push' does not exist on type 'ReadonlyArray<number>'

/**
 * 额外类型检查: 对象字面量被赋值给其他变量(包括作为参数传递)时会接受额外的属性类型检查;
 */
// 如果对象字面量有一些接口类型中没有的属性, 会报出错误
interface Excess {
    aaa?: number;
    bbb: string;
}

function testExcess(excess: Excess): number {
    if (excess.aaa) {
        return excess.aaa;
    }
    return 0;
}

testExcess({aaab: 2, bbb: "b"});
// Error: Argument of type '{ aaab: number; bbb: string; }' is not assignable to parameter of type 'Excess'.
// Object literal may only specify known properties, but 'aaab' does not exist in type 'Excess'. Did you mean to write 'aaa'?

// 因为TS认为在用对象字面量时应当只列出必要的变量; 而在type中都没有出现的属性, 在这里出现会被认为是"笔误"
// 但是如果赋值给变量通过变量传值, 则不会报错; 
const excess1 = {aaab: 2, bbb: "b"}
testExcess(excess1);

// 使用断言也可以绕过这些检查
testExcess({aaab: 2, bbb: "b"} as Excess);

// 另外比较好的方式是, 在interface中声明"可能有其他属性", 例如:
interface Excess {
    aaa?: number;
    bbb: string;
    [propName: string]: any;
}

/**
 * interface还能描述函数类型
 * 需要指定参数列表的名称和类型(函数签名), 以及返回值类型
 */
interface sampleFunc {
    (sampleName: string, sampleNum: number): boolean;
}
// 声明一个函数类型的变量, 并赋值为对应类型的函数:
let mySampleFunc: sampleFunc;
// 赋值为函数时,可以数返回值类型必须一致;
// 如果参数名称不必相同但对应位置的参数类型和函省略参数类型, TypeScript可以根据接口推断参数类型;
mySampleFunc = function(name, num) {
    return true;
} 

/**
 * 可索引的值--可以通过 something[index]的方式读取值; index 支持 string和number两种类型
 */
// 下面接口 StringArray 表示该类型通过number类型索引所返回的值是string类型;
interface StringArray {
    [index: number]: string;
}
// 可以同时支持两种索引方式, 但是通过数字索引返回的值类型必须是字符串索引返回值类型的子类型;
// 因为使用数字索引时, JavaScript会将先其转换为字符串, 所以number索引返回类型不能超过string索引的范围.
class Animal {
    name: string;
}
class Dog extends Animal {
    age: string;
}
interface Store {
    // [index: number]: Animal; //Error: Numeric index type 'Animal' is not assignable to string index type 'Dog'
    [index: string]: Dog;
}

// 在接口中声明string索引的返回类型时, 声明其他属性类型时也会检查其是否与其相匹配; 因为通过object['property']的方式读取任何属性同时都属于通过string索引获取值;
interface NumberDictionary {
    [index: string]: number;
    // name: string; // Error: Property 'name' of type 'string' is not assignable to string index type 'number'
}

/**
 * 只读索引: 不能通过索引方式重新赋值
 */
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Anne", "Tony"];
// myArray[0] = "Bai"; // Error: Index signature in type 'ReadonlyStringArray' only permits reading.
// myArray.push 等可变方法也不能使用

/**
 * 类的接口-- 可以像java语法中使用接口的方式 创建实现某个接口的类
 */
// 接口中可以定义属性和方法, 定义公共部分, 不包括私有部分;
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d) {}
    constructor(h: number, m: number) {}
}

// 因为类有静态部分和实例部分, 当类实现一个接口, TypeScript只检查实例部分; constructor属于静态部分,不会检查;
interface ClockConstructor {
    new (hour: number, minute: number);
}

// class Clock1 implements ClockConstructor {
//     currentTime: Date;
//     constructor(h: number, m: number) {} // Error Type 'Clock1' provides no match for the signature 'new (hour: number, minute: number): any'
// }

// 应该直接使用静态部分, 定义不同的constructor


/**
 * extending interfaces
 */
interface Shape {
    color: string;
}
interface Square extends Shape {
    sideLength: number;
}
interface PenStroke {
    penWidth: number;
}
// 继承多个接口
interface Circle extends Shape, PenStroke {
    radius: number;
}
 /**
  * 混合类型
  */

/**
* 继承类的接口
* 接口继承类的成员而非实现, 包含类中的私有private和受保护protected成员;
* 如果继承了一个具有这类成员的类, 意味着只有这个类的和它的子类能够实现这个接口;
*/

