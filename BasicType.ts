// boolean
let isOk: boolean = false;

// number
let decimal: number = 2;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

// string
let color: string = "blue";
    // 模板字符串可直接换行
let sentence: string = `Hi, I am out ${Date.now}.
I'll be back at 17 O'clock`;

// Array
let result1: number[] = [1, 2, 3];
let result2: Array<number> = [1, 2, 3];

// Tuple
// 元组--数组中已知元素数量和类型(不必类型都相同)
let x: [number, string, boolean];
x = [1, "a", false]; // OK
x = ["a", 1, true] // Error, Type 'string' is not assignable to type 'number'
    // 通过已知的索引访问元素, 会使用正确的类型;
x[0].subStr(0)  //Error, Property 'subStr' does not exist on type 'number'
    // 通过未知的索引访问元素, 会使用联合类型(union type);


// Enum
// 枚举, 定义可枚举的值; 通过点访问得到值, 通过索引可以得到对应值的名称(name);
//  默认索引从0开始, 也可以自定义索引值
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
enum Color1 {Red = 2, Green = 5, Blue = 3}
let c1: string = Color1[3];
console.log("c1: ", c1); // "Blue"

// Any
// 对于无法预知类型的值, 为了通过编译可以设置为any类型; 数组中不确定对应位置的数据类型,也可以设置为any[]
let notSure: any = 4;
notSure = false;
notSure = "Ok, no error";
    // 如果设置为`Object`, 则只能赋任何值给该变量而不能调用任何方法;
let prettySure: Object = 4;
prettySure.toFixed(); // Error, Property 'toFixed' does not exist on type 'Object'.    

// Void
// 一般用于没有返回值的函数, 如果设置一个变量为void类型则只能赋值为undefined或null
function warnUser(): void {
    console.log("this is a function that returns void");
}

// Undefined 和 Null
// 默认情况下undefined和null是其他类型的子类型, 可以被赋值给其他类型的变量;
// 但是如果使用--strictNullChecks标识, 会不允许undefined被赋值给除undefined和void之外的类型;


// Never
// 代表永远不会出现的值, 一般用作抛出异常的函数表达式的返回值类型, 或者永远无法返回的函数的返回类型;
// never类型是其他任何类型的子类, 可以赋值给其他类型, 而除never本身其他任何类型都不能赋值给never类型;
function error(message: string): never {
    throw new Error(message);
}
function infiniteLoop(): never {
    while(true) {

    }
}

// Object
// 代表非原始类型值的任何值; (原始类型包括: number, string, boolean, symbol, null, undefined)
// 以Object.create为例
declare function create(o: object | null): void;

create({});
create(null);
create(44); // Argument of type '44' is not assignable to parameter of type 'object'
create(undefined);
create(false); // Argument of type 'false' is not assignable to parameter of type 'object'.

// Type assertions
// 类型断言类似于其他语言中的强制类型转换, 但不会对数据进行特殊的检查和重组;
// 它对运行时没有影响, 仅仅被编译器使用; typeScript假设程序作者-开发人员已经做过了所有检查工作.

let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
// 或
strLength = (someValue as string).length; // TypeScript with JSX 必须使用此语法
