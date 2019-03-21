// var 声明符的缺点:
// 访问没有块级作用域(例如for-if块)限制, 声明会自动提升至其声明所在函数/模块/命名空间顶层
// 可以重复声明而不会报出错误

// 在TypeScript中使用let/const来声明变量, 如果重复声明将会提醒错误
// const声明的变量为不可变的数据, 不允许重新赋值. 但如果是引用类型, 允许改变其属性; 这在typescript中使用interface可以进一步设定其是否为"readonly";

// 解构赋值(destructuring assignment)
// 数组
let [first, second] = [2, 3];
[first, second] = [second, first]; // 交换已知变量值

function f([first, second]: [number, number]) {
    console.log("first:", first, "second:", second);
}
f([1, 2])

    // ...操作符
let [one, ...rest] = [1,2,3];
console.log("one:", one, "rest:", rest); // oen: 1 rest:[2, 3]

// 对象
const o = {a: "a", b: "b", c: "c", d: "d"};
let {a, b} = o; // => let a = o.a; let b = o.b;
let {a: str1, b: str2} = o; // => let str1 = o.a; let str2 = o.b;
    // 设定类型:
let {c, d}: {c: string, d: string} = o;

    // 参数默认值
function keepWholeObject(wholeObject: {a: string, b?: number}) {
    let {a, b = 1001} = wholeObject; // 如果参数b没有传入, 默认为1001
}
    // 参数的默认值和参数属性的默认值
function fn({ a, b = 0 } = { a: "" }): void {
    // 如果没有传入参数则默认为{a: ""}
    // 如果传入参数则根据传入参数obj,按{a, b = 0} = obj进行解构赋值;
        // 此时typescript会认为obj中a属性是必须的
}
    // 应该慎用参数解构赋默认值, 尤其时嵌套较深的对象可能造成难于理解和维护
    // f({ a: "yes" }); // ok, default b = 0
    // f(); // ok, default to { a: "" }, which then defaults b = 0
    // f({}); // error, 'a' is required if you supply an argument

// 扩展运算符(Spread)
// 与解构相反, 扩展运算是把数组或对象进行展开:
let arr1 = [1, 2, 3];
let arr2 = [4, 5, ...arr1]; // [4, 5, 1, 2, 3]
let copyO = {...o};
    // 对对象进行展开, 仅包括对象自己所有且可枚举的属性;
    // TypeScript中不允许对泛型函数的类型参数进行扩展


