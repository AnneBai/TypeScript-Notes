/**
 * 类型兼容
 * 1. 基于结构子类型(structural subtyping), 与"名义子类型"不同, 它是基于类型的成员来将类型相关联, 而非类型之间声明的实现或继承关系;
 * 2. 基础 x = y
 *      "x类型可以兼容y类型": 当y类型至少拥有和x类型一样的成员, y类型的值可以赋值给x类型的变量;
 *      给变量赋值, 给函数传参时都会检查;
 * 3. 比较两个函数 x = y
 *      "x函数类型兼容y函数类型": y函数参数列表中的每个参数都必须兼容x函数参数列表中对应参数,
 *      源函数的返回值类型必须是目标函数返回值类型的子类型;
 *      可以理解为: 目标函数x的对应位置参数可以赋值给源函数y的对应位置参数; 源函数的返回值可以赋值给目标函数的返回值;
 */

interface Named {
    name: string;
}
interface Located {
    name: string;
    location: string;
}
// y's inferred type is { name: string; location: string; }
let m: Named = {name: "Anne"};
let y: Located = { name: "Alice", location: "Seattle" };
let x: Named = y; // OK
// let z: Located = m; // Error: Property 'location' is missing in type 'Named' but required in type 'Located'.

let h = (a: Named) => 0;
let g = (a: Located, b: number) => 0;
let p = () => ({name: "p"});
let q = () => ({name: "q", located: "anywhere"});

// h = g; // Error: Type '(a: Located, b: number) => number' is not assignable to type '(a: Named) => number'
g = h; // OK
// q = p; // Error: Property 'located' is missing in type '{ name: string; }' but required in type '{ name: string; located: string; }'
p = q; // OK

/**
 * Function Parameter Bivariance
 * 允许源函数的参数是目标函数参数的子类型尽管不是很可靠,但这复合开发者在使用JavaScript中常见的习惯;
 * 例如[].map()函数接收的回调函数包含三个参数, 但我们使用时一般只使用一个或两个
 */

/**
 * 可选参数和rest参数
 * 目标和源函数有多余的非必须参数都不会认为是错误;
 */

/**
 * 重载函数
 * 源函数的每一个重载签名都必须能被目标函数的兼容类型签名匹配
 */

/**
 * 枚举类型
 * 枚举类型和number类型可以互相兼容, 但是源于不同枚举类的枚举值互不兼容;
 */
enum Status {Ready, Waiting};
enum Color {Green, Blue};
let status1 = Status.Ready;
status1 = 1; // OK
// status1 = Color.Green; // Error: Type 'Color.Green' is not assignable to type 'Status'.

/**
 * Classes 类
 * 与对象字面量和接口的处理方式相似, 除了一点: 类包含静态部分和实例部分;当比较两个对象, 只有它们所属类的实例部分被检查, 静态部分和constructor不会影响兼容性.
 * 但类中的 private 和 protected成员会影响兼容性的判断;
 * 当目标类型中包含private或protected成员, 源对象类型中也必须包含对应的源自同一个声明的成员;
 * 
 */

/**
 * 泛型 Generics
 * 类型参数本身不会影响, 只有在用来作为某个成员类型时, 使用时会造成区别;
 */
// 未使用类型参数
interface one<T> {
    name: string;
}
let x1: one<number>;
let x2: one<string>;

x1 = x2; // OK

// 类型参数限定成员类型
interface two<T> {
    name: T;
}
let y1: two<number>;
let y2: two<string>;

// y1 = y2; // Error: Type 'two<string>' is not assignable to type 'two<number>'. Type 'string' is not assignable to type 'number'.

