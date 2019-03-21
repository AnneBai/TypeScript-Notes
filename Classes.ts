/**
 * 类的声明
 */
// 类的成员中可以使用this.[name]访问其他成员
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
    return `Hello, ${this.greeting}`;
    }
}
// 使用new操作符, 会新建一个继承该类type的对象, 并通过调用其中的constructor将其初始化
let greeter = new Greeter("world");

/**
 * 类的继承
 */
class Animal {
    name: string;
    constructor(theName: string) {
        this.name = theName;
    }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
// 子类 subclasses 从父类 superclasses 继承其中的属性和方法;
// 在子类中如果有constructor, 则必须在访问this之前执行super, 使this可以正确绑定
class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}
const dog = new Dog("Beibei");
dog.bark();
dog.move(10);
dog.bark();

// 在子类中可以覆写父类中的方法;
class Cat extends Animal {
    constructor(name: string) {
        super(name);
    }
    move(distanceInMeters: number = 0) {
        this.talk();
        super.move(distanceInMeters);
    }
    talk() {
        console.log('Meow! Meow!');
    }
}
// cat虽然被声明为Animal类型, 但是实际创建的对象是Cat类的实例, 运行方法会先在Cat类中查询, 如果没有才会查询父类;
let cat: Animal = new Cat("Mimi");
cat.move();


/**
 * 修饰符: public, private, protected
 * 在TS中, 类的成员默认情况下都为 public, 当然也可以显式声明为public;
 * private: 只能在当前类内部访问, 外部无法访问;
 * protected: 与private相似, 但可以在派生类中访问--不能通过实例访问;
 */
class Fruit {
    private name: string;
    constructor(name: string) {
        this.name = name;
    }
}
let apple = new Fruit("apple");
// apple.name // Error: Property 'name' is private and only accessible within class 'Fruit'.

// 如果constructor被设置为protected, 则不能在其类或其子类之外实例化

/**
 * 类的兼容
 * TS是结构化的类型系统, 当比较两个不同的类型, 不管它们源自哪里, 只要它们所有成员的类型是兼容的, 就可以说这两个类本身是兼容的
 * 但是对于有private和protected成员的情况不同, 如果一个类中有一个private成员, 那另一个类中也必须有一个private成员与它源于同一个声明(protected也同理), 才能是兼容的.
 */

/**
 * Readonly 修饰符
 * 属性可以设置为readonly, 这类属性必须在声明时或constructor中初始化;
 */
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}

// 也可以使用参数属性, 在constructor参数位置完成成员的声明和赋值;
// 使用参数属性的方法是给参数加以可访问性限定符或readonly或两者都有
class Octopus1 {
    readonly numberOfLegs: number = 8;
    constructor  (readonly name: string) {
    }
}

/**
 * 访问器属性 getter/setter
 * 可以在setter中执行对修改属性的权限的检查, 如没有权限则不能执行修改并返回warning信息
 * NOTE: 1. 编译器需设置为输出ES5或更高; 2. 只有getter而没有setter的属性将会被TS推断为readonly;
 */

let passcode = "secret passcode";
class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

/**
 * Static 属性
 * 存在于类内部而非实例上, 其值会被所有实例共享, 只能通过类来访问;
 */
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));

/**
 * 抽象类 Abstract Classes
 * abstract class , 可以看作基类, 能够被其他类继承, 但是不能直接实例化;
 * abstract method(): void; / abstract method1(name: string): boolean
 * 抽象方法: 声明函数签名, 但没有具体实现, 在派生的类中必须显式覆写该方法;
 */
abstract class Animal1 {
    abstract makeSound(name: string): void;
    move(): void {
        console.log("roaming the earth...");
    }
}

/**
 * 声明一个类, 创建了一种"类型"并且也创建了这个类的构造函数;
 * 可以使用interface的地方, 也可以使用class.
 */
