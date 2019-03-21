/**
 * 泛型: 构建高复用组件的利器--可以适用于多种类型而非某一种
 * 可以构建泛型接口和泛型类, 但无法创建泛型枚举类型和泛型命名空间
 */
// 例如一个恒等函数, 返回参数本身;
// 1. 如果定义某种特定类型,就无法适用于其他类型:
function identity(arg: number): number {
    return arg;
}
// 2. 如果参数和返回都定义为any, 则不能体现返回值类型与参数类型相同:
function identity1(arg: any): any {
    return arg;
}
// 3. 需要一种方法,捕获传入参数的类型, 并用于表示返回值的类型
/**
 * 类型变量--用于表示类型而非值
 */
function identity2<T>(arg: T): T {
    return arg;
}

// 调用泛型函数时,可以显式赋值给<T>也可以省略, TS可以根据传入的参数推断类型并赋值给T
let output = identity2<string>("myString");
let output1 = identity2("myString");

// 如果需要在函数中访问某种属性,必须确保声明的类型的参数一定包含该属性;
// 如要访问length属性, 上面的声明会报错, 但如果声明参数为数组类型, 则可以工作:
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);
    return arg;
}
// 或
function loggingIdentity1<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}

/**
 * 泛型类型
 */
// 作为类型使用, (泛型变量名可以不同):
let myIdentity: <T>(arg: T) => T = identity2;
let myIdentity1: <U>(srg: U[]) => U[] = loggingIdentity1;
// 还可以把函数泛型以对象字面量的方式表达:
let myIdentity2: {<T>(arg: T) : T} = identity2;

/**
 * 泛型接口
 */
// 泛型变量可以声明在接口内部的函数上, 也可以声明在接口上:
interface GenericIdentityFn {
    <T>(arg: T): T;
}
interface GenericIdentityFn1<T> {
    (arg: T): T;
}
let myIdentity3: GenericIdentityFn = identity2;
let myIdentity4: GenericIdentityFn1<number> = identity2;
myIdentity3("myString"); // OK
// myIdentity4("myString"); // Error: Argument of type '"myString"' is not assignable to parameter of type 'number'.

/**
 * 泛型类
 * 在泛型类中, 类型参数只能在实例属性部分使用, 静态属性部分不能使用
 */

class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

/**
 * 泛型约束
 * 为了使用泛型同时约束参数必须具有某些成员, 可以使用继承某个接口的泛型
 */
interface Lengthwise {
    length: number;
}

function loggingIdentity2<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
loggingIdentity2("3"); // OK
// loggingIdentity2(3); // Error: Argument of type '3' is not assignable to parameter of type 'Lengthwise'.

// 可以使用类型参数约束另一个类型参数:
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}
let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // OK
// getProperty(x, "m"); // Error: Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.

// 使用泛型类创建工厂函数, 可以用于传入一个类得到该类的一个实例;
function create<T>(c: {new(): T; }): T {
    return new c();
}

class Fruit {
    color: string;
}
class Apple extends Fruit {
    sweetLevel: number;
}
class Pear extends Fruit {
    size: string;
}
function createFruit<F extends Fruit>(c: new () => F): F {
    return new c();
}
let apple = create(Apple);
let pear = create(Pear);
apple.sweetLevel = 3;
pear.size = "big";
// pear.sweetLevel  // Error: Property 'sweetLevel' does not exist on type 'Pear'.