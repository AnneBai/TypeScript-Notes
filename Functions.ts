/**
 * 在JavaScript中, 函数是一个重要的组成部分,可以用来创建抽象层, 模仿类, 封装信息和模块;
 * 在TypeScript中有类,命名空间,模块, 函数依然承担一个关键的角色; TypeScript为函数添加了一些新的能力, 使它们更方便使用;
 */

/**
 * 声明方式: 可以命名或匿名
 * 声明参数列表及各参数类型, 返回值的类型可以省略, TS可以根据函数中的返回值推断返回类型;
 */

function add(x: number, y: number): number {
    return x + y;
}

let mySdd = function(x: number, y: number): number {
    return x + y;
}

// 写出完整的函数类型, 参数类型和返回类型都是必要的;
// 等号左边有完整函数类型, 等号右边函数实体中的类型可以省略, 因为可以根据完整函数类型进行推断---上下文类型
// 函数类型中的参数名只是为了可读性而放在参数列表中,承载该位置的参数类型; 具体函数中的参数名不必与之相同;

let myAdd: (baseNumber: number, increament: number) => number =
    function(x: number, y: number): number {
        return x + y;
    };

/**
 * 可选参数, 默认参数
 *  1. 在参数后加 ? ,表明为可选参数, 但其后不能再有其他非可选参数;
 *  2. 给参数赋默认值, 这个参数也同时是可选参数, 且不是必须放在必要参数之后, 但是如果在参数后面有其他必要参数, 这个参数所在位置必须传入值或传入undefined(使用默认值)
 * 
 * 参数列表中到最后一个必要参数为止, 是调用该函数时的必要参数列表, 不能少参数,也不能超过所有参数总数;
 */

function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}
// 当使用默认值时, TS可以根据默认值类型推断该参数类型
function buildName1(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

/**
 * rest参数
 * 除已声明的必要参数外, rest参数可以以数组的形式把其余参数收集到一个变量中;
 */

function buildName2(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName2("Joseph", "Samuel", "Lucas", "MacKinzie");

/**
 * 箭头函数和this
 * JavaScript普通函数中, 函数中的this是在函数被调用时设定值而非函数创建时;
 * 箭头函数在创建时捕获当前this值并绑定, 与调用时无关;
 * this伪参数: 在函数的参数列表中第一个; 可以指定this的类型
 */
// 指定this为void类型,表明在该函数中this不可用/不可访问
function f(this: void) {
    // make sure `this` is unusable in this standalone function
}
// 作为回调函数时, 传入的函数如果已经声明只接受this: void的函数, 则回调函数中也不能访问this;
// 如果需要访问this可以在声明类的时候使用箭头函数, 因为箭头函数不会访问外部this, 所以可以传给只接受this:void函数的函数而不会报错;
// 使用箭头函数赋值给属性的缺点是每个实例都会新创建这个函数;
interface MessageEvent {
    message: string;
}
class Handler {
    info: string;
    onClickGood = (e: MessageEvent) => { this.info = e.message }
}

/**
 * 方法的重载
 * 一个函数在传入不同类型或数量的参数时可能有不同的返回值类型;
 * 在typescript中,使用重载列表来表达, 使TS可以准确检查类型
 */
let suits = ["hearts", "spades", "clubs", "diamonds"];
// 以下两行为pickCard函数的重载列表; 编译器检查类型时会从上至下逐个匹配(参数列表及返回值), 找到准确匹配为止;
// 按最常用到最不常用的顺序排列有利于提高效率;
function pickCard(x: {suit: string; card: number;}[]): number;
function pickCard(x: number): {suit: string; card: number;};

function pickCard(x): any {
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

