/**
 *  Intersection Types  交叉类型 &
 *  把多个类型合并为一个
 */
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id]
        }
    }
    return result;
}

/**
 *  Union Types 联合类型 |
 *  满足多种类型其中之一
 *  对一个联合类型的值, 只能通过它访问到联合类型中共同拥有的成员
 */
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`)
}

interface Bird {
    fly();
    layEggs();
}

interface Fish {
    swim();
    layEggs();
}
let pet: (Bird | Fish);
pet.layEggs // 可以访问
// pet.fly // Error: Property 'fly' does not exist on type 'Bird | Fish'.

/**
 *  类型防守 和 区分类型
 *  对联合类型的值访问非公共成员会报错, 需要使用 类型断言-确定具体类型
 */
if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
}
// 自定义类型防护, 返回的类型为 {variable} is {type} 形式的类型断定;
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
// TS会根据类型断定的结果 收紧变量的类型
if (isFish(pet)) {
    pet.swim();
} else {
    pet.fly();
}

// typeof 操作符对基本类型判断也会被TS作为类型断定, 但只能是JS中已有的类型;
// if (typeof pet === "Fish") {} // Error: This condition will always return 'false' since the types '"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"' and '"Fish"' have no overlap.

// instanceof 操作符 可以用于判断是否属于某构造函数所属的类;

interface Padder {
    getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
    constructor(private numSpaces: number) {}
    getPaddingString() {
        return Array(this.numSpaces + 1).join(" ");
    }
}

class StringPadder implements Padder {
    constructor(private value: string) {}
    getPaddingString() {
        return this.value;
    }
}

function getRandomPadder() {
    return Math.random() < 0.5 ?
        new SpaceRepeatingPadder(4) :
        new StringPadder("  ");
}

let padder: Padder = getRandomPadder();

// instanceof 右侧需要是 构造函数, 变量类型收紧结果按以下顺序:
    // 1. 该构造函数所属的原型(如果不是any)
    // 2. 该函数签名中返回类型的联合类型

if (padder instanceof SpaceRepeatingPadder) {
    // padder 类型收紧至 "SpaceRepeatingPadder"
}
if (padder instanceof StringPadder) {
    // padder 类型收紧至 "StringPadder"
}

/** Nullable types 
 * 默认情况下, TS 认为 null和undefined是任何其他类型的子类型(即能够赋值给其他类型);并且它们两个可以互相赋值;
 * 但是如果配置了--strictNullChecks 标识, 代表null 和 undefined只能是它们自己的类型并且只有自己唯一值,不能赋值给其他类型.
 */ 
let a: null = undefined;
let b: undefined = null;
let c: string = undefined;
// 开启了 --strictNullChecks 的情况下, 函数的可选参数以及类的可选属性的类型会自动添加 `| undefined`;
// 对于可能是null类型的值, 使用时添加`!`标识符后缀, 可以移除类型中的null/undefined;
function broken(name: string | null) {
    function postfix(epithet: string) {
        // 嵌套函数声明, TS不能排除name的null类型, 因为无法追踪所有对该嵌套函数的调用(尤其是嵌套函数被外部函数返回时), 无法确定其将会何时调用以及调用时name的具体状态.
        return name!.charAt(0) + '.  the ' + epithet;
    }
    name = name || "Bob";
    return postfix("great");
}

/**
 * 类型别名--某个类型的另一个名字(引用), 并非创建新类型;
 * 和接口类似, 但它还可以用来命名 原始类型, 联合类型,元组等任何其他类型;
 */

type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === "string") {
        return n;
    } else {
        return n();
    }
}

// 类型别名可以是泛型的, 在别名之后添加类型参数并在赋值时使用;
type Container<T> = {value: T};
type LinkedList<T> = T & { next: LinkedList<T> };
// 可以在类型的属性中引用自身, 但是不能在其他地方引用自身:
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
type Nodex = {
    left: Nodex;
    right: Nodex;
}
// type Yikes = Array<Yikes>; // Error: Type alias 'Yikes' circularly references itself.

type N = {
    value: string;
}
interface N1 {
    value: string;
}
function aliased(arg: N) {}
function interfaced(arg: N1) {}

/**
 * alias和interface的区别
 * 1. alias不能被扩展也不能被实现, interface是可以被扩展和实现的;
 * 2. 在编辑器中, TS对两者的提示不同, alias会直接显示对应的type: 字面量或type: 引用的类型, 而interface的名称本身就代表独立类型;
 * 遵循可扩展性, 一般情况下使用interface, 在面对一个interface不便表达而需要使用union/tuple时, 可以用alias辅助;
 */

/**
 * 字符串字面量类型--规定字符串的字面量在给定范围
 * 可以与union/type guards/type alias结合使用;
 * 特定字符串也可以用作重载函数中区分参数类型(字符串值)
 */
type Easing = "ease-in" | "ease-out" | "ease-in-out";
type M = 3 | "3";
let m: M = 3;

/**
 * 数值字面类型: 1|2|3|4
 * 枚举成员类型: 以字面量初始化(未赋值或赋值为字符串或(正负)数值字面量)的枚举成员, 有它们自己的类型, 它们是单例类型(singleton types);
 * 
 */

 /**
  * 可识别的联合类型 Discriminated Unions
  * 组成: 
  * 1. 多种类型有一个相同的,单例类型的属性 --- 辨别属性
  * 2. 一个类型别名, 值为这些类型的联合类型 --- 并集
  * 3. 通过共有的属性, 用type guards进行类型辨别
  */
// *1. 共同拥有kind属性, 值不同
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}
// *2. 联合类型
type Shape = Square | Rectangle | Circle;
// *3. 通过kind属性辨别
function area(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
    }
}

// * 穷举检查提示
// 如果在类型辨别时,给出处理方式的类型不能覆盖所有可能类型,希望编译时报告错误---
// *1. 开启--strictNullChecks , 并设置确定的返回值类型
// *2. 使用never类型断言, 在出现所列情况之外其他实际类型值时抛出错误
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}
function area1(s: Shape) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return Math.PI * s.radius ** 2;
        default: return assertNever(s); // error here if there are missing cases
    }
}

/**
 * 多态 this 类型
 * 代表一个当前包含类或接口的子类型(例如继承的类型), 被称作"F-bounded polymorphism"; 在用于链式调用时很方便:
 * 方法返回类型为this, 并在方法体中 return this;
 */

class BasicCalculator {
    public constructor(protected value: number = 0) {}
    public currentValue(): number {
        return this.value;
    }
    public add(operand: number): this {
        this.value += operand;
        return this;
    }
    public multiply(operand: number): this {
        this.value *= operand;
        return this;
    }
}
let v = new BasicCalculator(2)
    .multiply(5)
    .add(1)
    .currentValue();

// * 继承BasicCalculator时, 可以直接使用其返回了this的方法用于链式调用, 返回this类型是调用时的具体子类;
// * 如果父类方法没有设置返回this类型, 那么子类调用父类方法后返回的是父类BasicCalculator对象而非子类型;
class ScientificCalculator extends BasicCalculator {
    public constructor(value = 0) {
        super(value);
    }
    public sin() {
        this.value = Math.sin(this.value);
        return this;
    }
}
let v1 = new ScientificCalculator(2)
    .multiply(5) //* 父类方法,但是返回的this属于子类
    .sin()
    .add(1)
    .currentValue();

/**
 * 索引类型 Index types
 * 1. 索引类型查询(index type query)操作符: `keyof T`, 代表T类型下所有已知和public的属性组成的联合属性;
 * 2. 索引访问(index access)操作符: `T[K]`,代表T类型中某个有效属性的值的类型;
 */
// * 例如从一个对象中读取若干属性值:
function pluck<T, K extends keyof T> (o, names): T[K][] {
    return names.map(n => o[n]);
}

interface Person {
    name: string;
    age: number;
}
let person: Person = {
    name: "Anne",
    age: 18,
}
let info: string[] = pluck(person, ["name", "age"]); // OK

/**
 * 类型映射 Mapped types -- 基于已有类型创建新类型
 * 1. 例如把一个已有类型的所有属性设置为可选的或只读的,
 */
// 复制某类型的属性并都设置为只读
type Readonly_1<T> = {
    readonly [P in keyof T]: T[P];
}
// 复制某类型的属性并都设置为可选
type Partial_1<T> = {
    [P in keyof T]?: T[P];
}
// * 使用映射的类型
type PersonPartial = Partial<Person>;
type ReadOnlyPerson = Readonly<Person>;
// 复制某类型的属性
type Pick_1<T, K extends keyof T> = {
    [P in K]: T[P];
}
// * ReadOnly/Partial已被加入TypeScript标准库, 另外还有Pick, Record;
// * Record是非同态(non-homomorphic)的类型, 因为它不接收用来复制属性的基本对象类型; 它可以用来创建新属性而非从其他地方复制;
type Record_1<K extends keyof any, T> = {
    [P in K]: T;
}
type ThreeStringProps = Record<'prop1' | 'prop2' | 'prop3', string>
/**
 * 包装属性类型(wrapped)和解包装属性类型(unwrapped)
 * 
 */
// * 被包装的属性类型
type Proxy<T> = {
    get(): T;
    set(value: T): void;
}
// * 属性已被包装后的对象类型
type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>;
}
// * 对参数对象的每个属性进行包装, 变成包含get/set方法的对象
function proxify<T>(o: T): Proxify<T> {
    let result = {} as Proxify<T>;
    for (const k in o) {
        result[k] = {
            get: () => o[k],
            set: (v) => {o[k] = v},
        }
    }
    return result;
}
let proxifyPerson: Proxify<Person> = proxify(person);
// * 解包装是把被包装的对象还原为普通对象
function unproxify<T>(t: Proxify<T>): T {
    let result = {} as T;
    for (const k in t) {
        result[k] = t[k].get();
    }
    return result;
}
let unproxifyPerson: Person = unproxify(proxifyPerson);
// * unwrapping interface仅仅用于同态映射类型, 否则需要在unwrapping函数中明确指定类型参数;


/**
 * *条件类型 -- Conditional Types
 * 
 */
