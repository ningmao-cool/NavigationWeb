# 前言

反射和aop在另外一个笔记中

---

# **杂七杂八**

### **1. 方法重载**

- **概念**：方法重载是指同一个类中允许多个方法名称相同，但参数列表不同。参数列表的差异可以包括：
    
    - 参数类型不同
    - 参数个数不同
    - 参数顺序不同
- **注意**：
    
    - **与返回值类型无关**：返回值不同不能作为方法重载的依据。
    - **与修饰符无关**：访问修饰符的变化不会影响方法重载。

---

### **2. 构造方法的重载**

- **无参构造**：
    
    ```java
    t1.name = "帅哥"; // 手动赋值给对象的成员变量
    ```
    
- **有参构造**：
    
    ```java
    t1 = new Test("帅哥");
    ```
    
    通常情况下，有参构造方法内部会调用无参构造方法，以便完成基础初始化：
    
    ```java
    public Test(String name) {
        this(); // 调用无参构造
        this.name = name; // 再对name赋值
    }
    ```
    

---

### **3. this 关键字**

- `this` 用于区分**成员变量**和**局部变量**，帮助将两者串联起来。
- 示例：
    
    ```java
    public void setName(String name) {
        this.name = name; // this指代当前对象的成员变量
    }
    ```
    

---

### **4. 字符串比较**

- **字符串存储**：
    
    - 通过 `String str = "text";` 声明的字符串存储在**常量池**中。
    - 通过 `new String("text");` 创建的字符串存储在**堆区**中。
- **比较方式**：
    
    - 使用 `==` 比较的是**地址**（引用是否指向同一对象）。
    - 使用 `equals()` 比较的是**内容**。
    - 示例：
        
        ```java
        String s1 = "hello";
        String s2 = new String("hello");
        
        System.out.println(s1 == s2); // false，因为地址不同
        System.out.println(s1.equals(s2)); // true，因为内容相同
        ```
        
- **特殊情况**：通过 `Scanner` 类读取字符串时存储在**栈区**，比较时需格外注意。
    

---

### **5. 测试方法**

- **要求**：JUnit 测试方法必须满足以下条件：
    
    1. **无参**：不能带有参数。
    2. **无返回值**：必须是 `void` 类型。
    3. **访问修饰符**：必须是 `public`。
- 示例：
    
    ```java
    @Test
    public void testExample() {
        // 测试逻辑
        System.out.println("测试方法运行成功！");
    }
    ```
    


### **6.三个区的区别 **
 
#### **1. 栈区（Stack）**

**定义**：  
栈区是线程私有的内存区域，主要用于存储**局部变量**、**方法调用信息**（如参数、返回地址）等。

**特点**：

1. **线程私有**：每个线程都有自己的栈区，不与其他线程共享，天生线程安全。
2. **自动分配和释放**：栈内存的分配和释放由 JVM 自动完成。
3. **存储内容**：
    - **局部变量**：方法中的基本数据类型（`int`、`float` 等）和对象的引用（不存储实际对象）。
    - **方法调用信息**：包括方法参数、返回地址等。
4. **生命周期短**：随着方法调用创建，方法结束后立即释放。
5. **速度快**：栈区是内存中最快的一块区域，基于后进先出（LIFO）的数据结构实现。

**示例**：

```java
public void example() {
    int x = 10;       // x 是局部变量，存储在栈中
    String s = "hello"; // s 是引用变量，存储在栈中，指向堆或常量池
}
```

---

#### **2. 堆区（Heap）**

**定义**：  
堆区是 JVM 中线程共享的内存区域，用于存储**通过 `new` 创建的对象实例和数组**。

**特点**：

1. **线程共享**：堆区是线程共享的，多个线程可以访问同一堆对象。
2. **垃圾回收管理**：堆区内存由垃圾回收器（GC）管理，不需要手动释放。
3. **存储内容**：
    - **对象实例**：通过 `new` 关键字创建的对象。
    - **数组**：无论是基本数据类型数组还是引用类型数组。
4. **生命周期长**：堆中的对象生命周期较长，直到没有引用指向时才会被垃圾回收。
5. **访问速度慢**：由于动态分配和 GC 的开销，堆的访问速度比栈慢。

**示例**：

```java
public void example() {
    String s = new String("hello"); // s 是栈上的引用，指向堆中的字符串对象
    int[] arr = new int[10];        // 数组对象存储在堆中，引用存储在栈中
}
```

---

#### **3. 常量池（Constant Pool）**

**定义**：  
常量池是 JVM 内存中专门存储**编译期确定的常量**和**字符串字面量**的区域，位于方法区中。

**特点**：

1. **存储内容**：
    - **字符串常量**：比如 `"hello"`。
    - **基本数据类型的常量**：如 `10`、`3.14`。
    - **符号引用**：类名、方法名、字段名等。
2. **优化内存使用**：常量池中的常量是全局唯一的，避免了重复创建相同常量对象。
3. **生命周期长**：常量池中的内容在 JVM 加载类时创建，并且在 JVM 运行期间一直存在。
4. **不可变**：常量池中的值是不可变的，具有线程安全性。

**示例**：

```java
public void example() {
    String s1 = "hello";       // s1 指向常量池中的字符串 "hello"
    String s2 = "hello";       // s2 和 s1 指向同一个常量池对象
    String s3 = new String("hello"); // s3 是堆中的新对象，与常量池无关
}
```

---

#### **4. 堆区、栈区和常量池的对比**

| **特点**    | **栈区（Stack）**   | **堆区（Heap）**  | **常量池（Constant Pool）** |
| --------- | --------------- | ------------- | ---------------------- |
| **存储内容**  | 局部变量、方法参数       | 对象实例、数组       | 编译期确定的常量和字符串字面量        |
| **存储位置**  | 每个线程私有，位于线程栈中   | 所有线程共享        | 方法区的一部分                |
| **内存分配**  | 自动分配和释放         | 动态分配，由垃圾回收器管理 | 编译期确定，运行期间不可变          |
| **生命周期**  | 方法调用时创建，方法结束时释放 | 对象被垃圾回收时销毁    | JVM 加载类时创建，一直存在        |
| **访问速度**  | 速度快             | 速度较慢          | 速度更快，常量全局共享            |
| **线程安全性** | 线程私有，天生线程安全     | 线程共享，需同步控制    | 不可变值，天生线程安全            |

---

#### **5. 代码理解：栈区、堆区与常量池的配合**

```java
public class MemoryExample {
    public static void main(String[] args) {
        int x = 10; // 栈区：局部变量 x
        String s1 = "hello"; // 栈区：引用 s1，指向常量池
        String s2 = "hello"; // 栈区：引用 s2，指向常量池中的同一对象
        String s3 = new String("hello"); // 栈区：引用 s3，指向堆中的新对象
        String s4 = s3.intern(); // s4 指向常量池中的 "hello"，与 s1 相同
    }
}
```

**内存分布**：

1. `x = 10`：存储在栈区。
2. `s1` 和 `s2`：存储在栈区，指向常量池中的 `"hello"`。
3. `s3`：存储在栈区，指向堆中的字符串对象。
4. `s4`：存储在栈区，指向常量池中的 `"hello"`。

---

#### **6. 注意事项**

1. **基本类型和引用类型的区别**：
    
    - 基本类型变量直接存储在栈中。
    - 引用类型变量存储在栈中，实际对象存储在堆中。
2. **字符串池的特殊性**：
    
    - 字符串字面量会自动存储在常量池中，具有唯一性。
    - 通过 `new` 创建的字符串存储在堆中，和常量池无关。
3. **垃圾回收的作用**：
    
    - 垃圾回收器主要管理堆中的对象，不会回收栈中的局部变量和常量池的内容。
4. **性能优化**：
    
    - 优先使用字符串字面量（常量池），避免频繁创建堆对象。

---


### **总结：**

- **重载**：参数列表是区分重载方法的关键。
- **构造方法**：可以通过 `this()` 实现构造方法之间的调用。
- **this 关键字**：用于区分成员变量和局部变量。
- **字符串**：比较内容用 `equals()`，比较地址用 `==`。
- **测试方法**：遵循无参、无返回值的规则，确保规范性。
- **栈区**：用于存储方法的局部变量、方法调用信息，生命周期短，速度快。
- **堆区**：用于存储运行时创建的对象和数组，生命周期由 GC 决定。
- **常量池**：存储编译期确定的常量和字符串字面量，全局共享，生命周期长。

---

# 封装
封装是面向对象编程（OOP）的核心思想之一，通过将对象的状态（属性）私有化，并提供公共方法（getter 和 setter）来控制对这些属性的访问和修改，从而保护数据的完整性和安全性。

---
**例子**是：
1. 你可以创建一个 `A` 类的对象，然后将它传递给 `B` 类的有参构造器。
2. 在 `B` 类中，通过 `private` 修饰一个 `A` 类型的属性，并在构造器中通过 `this.a = a;` 的方式将传入的对象赋值给它。  
- 这种方式使得 `B` 类能够封装对 `A` 对象的访问权限，外部无法直接操作，而只能通过 `B` 类提供的方法间接使用它。

---
# 修饰符
### 1. 访问修饰符

- **public**：对所有类可见。
- **protected**：对同一包中的类和所有子类可见。
- **default**（包私有）：仅对同一包中的类可见，接口中的方法默认是`public`。
- **private**：仅对当前类可见。

### 2. 关键字修饰符

- **static**：表示静态成员，属于类而非实例。静态方法只能访问静态成员，无法直接访问实例成员（需要通过对象）。
- **final**：
    - 对变量：只能赋值一次，常用于定义常量。
    - 对类：不能被继承。
    - 对方法：不能被重写。
    - 对数组：数组内容可以修改，但不能修改数组引用的地址。

### 3. 实例与静态成员访问

- **实例成员**：可以通过对象直接访问，或者使用`this`访问。如果参数名和成员名相同，需使用`this`来区分。
- **静态成员**：只能通过类名访问，无法直接访问实例成员。

### 4. 抽象类与方法

- **abstract**：抽象类不能被实例化，必须由子类实现所有抽象方法；非抽象方法可以选择性地重写。


---
# 继承

- **静态成员**：
    
    - 父类和子类共用一份静态成员。静态方法和变量是类级别的成员，不依赖于对象实例，因此无论是父类还是子类，都共享相同的静态成员。
    - 子类可以直接调用父类的静态方法和变量。如果子类覆盖了父类的静态方法，则可以通过`super.method`来调用父类的方法。
    - 子类可以通过`super()`调用父类构造器来初始化父类的部分成员，这样父类的初始化赋值将先于子类进行。注意：此时父类的字段（如getter等）需要提前定义在父类中，以确保子类能够正确继承，构造器必须是子类构造器的第一行
	```java
		    class Parent {
		    Parent() {
		        System.out.println("Parent constructor");
		    }
		}
		
		class Child extends Parent {
		    Child() {
		        super();  // 调用父类构造器，初始化父类部分
		        System.out.println("Child constructor");
		    }
		}
		
		public class Test {
		    public static void main(String[] args) {
		        new Child();  // 输出 Parent constructor \n Child constructor
		    }
		}
	```
- **访问父类成员**：
    
    - 一般情况下，子类会访问自己类中没有的成员（包括变量和方法），否则直接使用子类自身的成员。如果子类没有定义某个成员，那么就会通过`super`来访问父类中的成员。
    - `super`用于访问父类的成员（包括变量和方法），尤其是在成员名称发生重名时，`super`能帮助区分父类和子类的成员。
- **方法重写**：
    
    - 重写（Override）是指子类重新定义父类的方法，方法签名和参数列表必须保持一致。
    - 子类不能重写父类的`private`方法，因为`private`方法对子类是不可见的。
    - 同理，`static`方法不能被重写（但可以被隐藏）（就是我也定义一个一样的，把内容换一下，除非你直接class.method，不然访问不到）。静态方法是与类相关的，不依赖于对象实例。
- **重写方法的访问权限**：
    
    - 子类重写父类的方法时，方法的访问权限必须大于或等于父类的方法访问权限。例如，父类的方法是`protected`，子类可以将其重写为`public`，但不能将`public`方法重写为`private`。
    - 返回值类型必须保持一致，或者范围更小。比如，如果父类返回`Object`类型，子类可以返回`String`（`String`是`Object`的子类）。但是不能反过来，返回类型范围不能扩大。
- **构造器和`super`/`this`**：
    
    - 子类构造器必须通过`super()`显式调用父类构造器，以确保父类部分在子类实例化之前已经正确初始化。
    - `super()`和`this()`必须出现在**子类构造器的第一行**。如果存在`super()`，则不能同时调用`this()`，反之亦然。因为这两者涉及到不同的初始化顺序，调用顺序混乱会导致程序行为不明确。
- **兄弟构造器（`this()`）**：
    
    - 通过`this()`可以在同一个类中调用其他构造器，通常用于减少代码重复。
    - `this()`调用必须是构造器的第一行，且只能在同一类内调用。
	```java
	class Parent {
	    Parent() {
	        System.out.println("Parent constructor");
	    }
	}
	
	class Child extends Parent {
	    Child() {
	        // this();  // 编译错误，无法同时调用super()和this()
	        super();  // 调用父类构造器
	        System.out.println("Child constructor");
	    }
	}
	
	public class Test {
	    public static void main(String[] args) {
	        new Child();
	    }
	}
	
	```
---
# 多态

- **多态的基本概念**：
    
    - **行为多态**（或称动态多态）指的是相同的方法调用，在不同对象上表现出不同的行为。多态是面向对象编程的核心特性之一。
    - 多态通过父类引用指向子类对象来实现，调用的是子类重写的方法。
- **编译时与运行时的多态**：
    
    - **编译时（静态）多态**：编译时，Java会根据对象引用的类型来确定方法调用。在方法调用时，编译器只能根据变量声明的类型来检查调用是否合法。
    - **运行时（动态）多态**：在运行时，JVM根据实际对象的类型来决定调用哪个方法。即使引用类型是父类，实际运行时调用的是子类的重写方法（如果存在）。
    
    **规则**：
    
    - 编译时，方法调用是通过引用类型来解析的，通常查看左侧的变量类型（即引用类型）。
    - 运行时，实际调用哪个方法是通过对象的真实类型来决定的，通常查看右侧的对象类型（即实际对象类型）。
    - 如果父类中声明的方法被子类重写，编译器会检查方法签名是否匹配，如果不匹配，会报错。
- **强制类型转换**：
    
    - 如果在使用多态时，调用的是子类特有的方法（即父类引用无法访问的子类方法），编译器会报错，此时需要进行类型转换。
    - 可以使用显式的类型转换来将父类引用转换为子类类型，但这只有在运行时对象的实际类型是子类时才有效。否则会抛出`ClassCastException`。
    
    **例子**：
    
    ```java
    class Animal {
        void speak() {
            System.out.println("Animal speaks");
        }
    }
    
    class Dog extends Animal {
        @Override
        void speak() {
            System.out.println("Dog barks");
        }
    
        void fetch() {
            System.out.println("Dog fetches the ball");
        }
    }
    
    public class Test {
        public static void main(String[] args) {
            Animal myAnimal = new Dog();  // 多态：父类引用指向子类对象
            myAnimal.speak();  // 运行时调用Dog的speak方法（动态绑定）
            
            // 如果需要调用Dog特有的方法，必须进行类型转换
            if (myAnimal instanceof Dog) {
                Dog myDog = (Dog) myAnimal;  // 强制类型转换
                myDog.fetch();  // 调用子类特有的方法
            }
        }
    }
    ```
    
- **注意事项**：
    
    1. **调用公用方法**：通过多态调用的行为只能是父类中声明的方法或子类中重写的方法。如果子类中有额外的方法，编译器无法通过父类引用调用这些方法，必须进行类型转换。
    2. **类型转换的安全性**：强制类型转换时，需要确保对象的实际类型是目标类型，否则会抛出`ClassCastException`。可以通过`instanceof`检查对象是否为指定类型，避免类型转换异常。
- **方法的动态绑定**：
    
    - Java采用**动态绑定**（或叫后期绑定），即方法的调用是根据对象的实际类型而非引用类型来决定的。
    - 如果父类中定义了一个方法，子类重写了该方法，且父类的引用指向子类的对象，那么调用该方法时，JVM会在运行时决定使用子类的方法。
    
    **例子**：
    
    ```java
    class Animal {
        void sound() {
            System.out.println("Animal sound");
        }
    }
    
    class Dog extends Animal {
        @Override
        void sound() {
            System.out.println("Bark");
        }
    }
    
    public class Test {
        public static void main(String[] args) {
            Animal animal = new Dog();  // 父类引用指向子类对象
            animal.sound();  // 运行时调用Dog的sound方法，输出：Bark
        }
    }
    ```
- **总结**

	1. **多态的优势**
	
	- **灵活性**：允许通过统一的接口处理不同类型的对象，可以大大简化代码。
	- **可扩展性**：可以轻松地新增类而不需要修改调用代码，实现开闭原则。
	- **可维护性**：减少了代码重复，简化了代码结构。
	- **支持设计模式**：实现了如策略模式、工厂模式的核心思想。
	
	2. **多态的前提条件**：
    
    - 子类必须重写父类的方法。
    - 父类的引用指向子类的对象。
	
	3. **实例与类型**：
    
    - 编译时，方法调用根据引用的类型确定；
    - 运行时，方法的调用根据实际对象的类型确定。

---


好的，以下是对**单例模式**的润色和补充，特别是**懒汉式**单例的详细说明，并附带实例代码。

---

# 单例模式（Singleton Pattern）

单例模式是一种设计模式，目的是确保一个类只有一个实例，并且提供一个全局的访问点。

## 单例模式的两种常见实现方式：

1. **懒汉式（Lazy Initialization）**：
    - 懒汉式单例在第一次使用时才创建对象，优点是节省内存，直到真正需要实例时才进行初始化。
    - 懒汉式通常用于对象创建成本较高，且使用频率不高的场景。
2. **饿汉式（Eager Initialization）**：
    - 饿汉式单例在类加载时就创建对象，缺点是如果在某些情况下不需要实例化对象，它就会浪费资源。

## 懒汉式单例

懒汉式单例的关键点是延迟加载：直到第一次访问实例时才创建对象，这样可以节省内存，避免不必要的资源浪费。为了保证线程安全，懒汉式单例通常使用同步机制来防止多个线程同时创建实例。

### 懒汉式单例的实现：

- 需要处理**线程安全**问题：可以使用`sychronized`关键字，确保只有一个线程可以进入创建实例的代码块，防止出现多个线程同时创建实例的情况。
- 但需要注意的是，`sychronized`可能会影响性能，因此有时会使用“双重检查锁定”（Double-Checked Locking）来优化。

#### 懒汉式（线程安全）单例实现（基本同步）：

```java
public class Singleton {
    // 用volatile关键字确保实例的可见性和防止指令重排
    private static volatile Singleton instance;

    // 私有构造函数，防止外部实例化
    private Singleton() {}

    // 获取实例的方法，使用synchronized确保线程安全
    public static synchronized Singleton getInstance() {
        if (instance == null) {  // 第一次访问时才创建对象
            instance = new Singleton();
        }
        return instance;
    }
}
```
**`volatile`**：

- `volatile` 是 Java 中的一个关键字，用于修饰变量，它保证了多个线程访问该变量时的可见性。
- 在多线程环境下，`volatile` 关键字确保当一个线程修改 `instance` 的值时，其他线程能够立即看到这个修改。
- 另外，`volatile` 还防止了“指令重排”问题（保证变量在内存中的顺序），即避免了 JVM 在优化时可能会把对 `instance` 的赋值操作与其他代码的执行顺序搞错。使用 `volatile` 保证了 `instance` 被正确初始化。

**解释**：

- `getInstance()`方法是单例类的唯一访问点。
- `synchronized`关键字用于保证只有一个线程能进入该方法，从而避免多线程环境下创建多个实例。
- `instance`是`volatile`的，确保当多个线程访问时，内存可见性问题得到解决。
#### 代码流程：

1. **第一次调用 `getInstance()`**：
    
    - 线程进入 `getInstance()` 方法时，发现 `instance` 为 `null`。
    - 然后线程进入同步代码块，通过 `synchronized` 确保其他线程无法进入，创建 `instance` 对象。
    - 创建完成后，`instance` 就不会再是 `null` 了，后续调用可以直接返回已经创建的实例。
2. **后续调用 `getInstance()`**：
    
    - 后续线程调用 `getInstance()` 时，`instance` 已经不为 `null`，因此不需要进入同步块，直接返回已有的实例。

---

#### 双重检查锁定优化：

为了避免每次获取实例都需要进行同步，影响性能，常用双重检查锁定（Double-Checked Locking）模式，它在第一次判断为`null`时不加锁，在加锁后再判断一次。这样，只有在实例为空时才会进行同步操作，避免不必要的同步。

```java
public class Singleton {
    // volatile关键字确保实例的正确初始化
    private static volatile Singleton instance;

    // 私有构造函数，防止外部实例化
    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {  // 第一次检查，不加锁
            synchronized (Singleton.class) {  // 第二次检查，加锁
                if (instance == null) {  // 防止多个线程同时创建实例
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

**解释**：

- **第一次检查**：`instance == null`用于避免每次调用`getInstance()`时都进行同步操作，提升性能。
- **加锁后检查**：`synchronized`关键字确保只有一个线程能进入同步代码块，且在获取锁后再次检查`instance`是否为`null`，防止多个线程同时创建实例。

**举例**

- 线程A进入 `getInstance()` 方法，第一次检查 `instance == null`，看到 `instance == null`，进入同步块。
- 线程B也同时到达 `getInstance()` 方法，看到 `instance == null`，并且没有等待线程A释放锁，进入了同步块。
- 然后线程A创建实例并赋值给 `instance`，此时线程B仍然会进入同步块并创建一个新的实例，因为第一次的检查是在同步块外完成的。
---
#### 关于`synchronized`
- **`synchronized`** 和 **`synchronized()`** 都是用来保证线程安全的方式。`synchronized` 用于修饰方法，它会锁定当前对象或类；
- - 对于实例方法，`synchronized` 锁住的是**当前实例对象**。
- 对于静态方法，`synchronized` 锁住的是**类对象**（即 `Class` 类型）。
-  `synchronized()` 块可以让我们更精确地控制锁定的范围，通常用于锁定特定对象。
- `synchronized(this)`锁定实例对象
- `synchronized(A.class)`锁定类对象

| 特性        | 锁定实例对象 (`this` 或其他实例对象)           | 锁定类对象 (`Class` 对象)                 |
| --------- | --------------------------------- | ---------------------------------- |
| **锁定对象**  | 锁定的是**当前实例对象** (`this`)           | 锁定的是**类的 `Class` 对象**              |
| **同步范围**  | 只影响当前实例对象的实例方法或实例代码块              | 影响整个类的静态方法或静态代码块                   |
| **多线程访问** | 访问不同实例对象的同步方法不会互相阻塞，但访问同一实例对象时会互斥 | 访问同一个类的静态方法时会互斥，多个线程无法同时访问同一类的静态方法 |
| **使用场景**  | 当你希望每个实例有自己独立的行为（例如实例方法）时使用       | 当你希望类级别的共享资源（例如静态字段、静态方法）得到互斥访问时使用 |

---


#### 懒汉式单例（静态内部类实现）：

另一种更优雅且线程安全的懒汉式单例实现方式是使用**静态内部类**。这种方法利用了**类加载机制**，它能保证实例的懒加载，并且避免了多次同步的性能损耗。

```java
public class Singleton {
    // 静态内部类，它只有在第一次被引用时才会被加载，从而实现懒加载
    private static class SingletonHelper {
        // 静态初始化器，JVM保证线程安全
        private static final Singleton INSTANCE = new Singleton();
    }

    // 私有构造函数，防止外部实例化
    private Singleton() {}

    public static Singleton getInstance() {
        return SingletonHelper.INSTANCE;  // 返回静态内部类中的单例对象
    }
}
```

**解释**：

- **静态内部类**：`SingletonHelper`类只有在`getInstance()`方法第一次被调用时才会被加载，从而保证了单例的懒加载。
- **线程安全**：JVM在加载类时会自动保证静态变量的线程安全，因此不需要显式的同步。
- **性能**：相比传统的同步方法，静态内部类实现方式在性能上有更高的优势。

---

### 懒汉式单例的优缺点：

#### 优点：

1. **节省内存**：懒汉式单例只在第一次使用时才创建实例，避免了不必要的资源浪费。
2. **线程安全**：通过同步或静态内部类机制，确保多线程环境下的安全性。

#### 缺点：

1. **性能开销**：如果使用同步块（特别是在基础实现中），每次访问`getInstance()`方法时都会加锁，可能会影响性能。
2. **复杂性**：使用双重检查锁定或静态内部类时，相较于简单的饿汉式，代码实现会更复杂一些。

---

### 总结：

- **懒汉式单例**适用于对象创建成本较高且使用频率不高的场景，通过延迟实例化避免浪费内存。
- 通过同步机制或静态内部类来保证线程安全，避免多线程环境下出现问题。
- 在性能敏感的场合，可以考虑使用静态内部类实现，因为它利用了Java的类加载机制，且性能较好。

---

## 饿汉式单例

在类加载时就创建对象，保证线程安全，但缺点是类加载时就会创建实例，如果实例不使用，会浪费资源。
### 饿汉式单例实现

饿汉式单例是在类加载时立即创建实例，因此不存在线程安全问题。它的实现非常简单且高效，因为实例在类加载时就已创建，因此可以直接返回该实例。

#### 饿汉式单例代码实现：

```java
public class Singleton {
    // 饿汉式单例，类加载时就会创建实例
    private static final Singleton instance = new Singleton();

    // 私有构造函数，防止外部实例化
    private Singleton() {}

    // 获取单例实例
    public static Singleton getInstance() {
        return instance;
    }
}
```

**解释**：

- `instance` 在类加载时就已经创建，因此可以直接返回该实例。此时，**线程安全**不是问题，因为类加载和静态字段初始化保证了线程安全。
- **私有构造函数**确保外部无法通过 `new` 来实例化对象。
- **静态实例** `instance` 在类加载时就被初始化，避免了懒汉式的同步问题。

#### 饿汉式单例的优缺点：

**优点**：

1. **简单且高效**：无需加锁，实例创建和初始化是由 JVM 自动控制的，性能较高。
2. **线程安全**：由于实例在类加载时创建，JVM 在初始化过程中会保证线程安全，避免了多线程环境下的创建问题。

**缺点**：

1. **资源浪费**：即使单例对象没有被使用，实例也会在类加载时创建。如果类的实例化成本较高，且不常用，可能会造成资源浪费。
2. **不支持延迟加载**：实例在类加载时就创建，无法实现懒加载。

---

### 总结

- **饿汉式单例**非常适合不需要懒加载、且对资源消耗不敏感的场景。
- 它的实现简单、线程安全，适用于类加载时就需要实例的情况。
- 如果你需要懒加载（即只在第一次访问时创建实例），则懒汉式单例是更合适的选择。

---

# 枚举类
### 1.定义枚举常量 
第一行只能写对象名称，并且用逗号隔开，本质是常量，编译时
![[Pasted image 20241027103618.png]]
```java
public enum Color {
    RED("Red", "Medium"),
    GREEN("Green", "High"),
    BLUE("Blue", "Low");

    private String description;
    private String brightnessLevel;

    // 构造函数
    private Color(String description, String brightnessLevel) {
        this.description = description;
        this.brightnessLevel = brightnessLevel;
    }

    // 获取描述的方法
    public String getDescription() {
        return description;
    }

    // 获取亮度级别
    public String getBrightnessLevel() {
        return brightnessLevel;
    }
}
```
- 枚举常量（如 `RED`, `GREEN`, `BLUE`）在定义时即被创建，并且是常量，不能重新赋值。
- 枚举类的构造方法通常是私有的，防止外部实例化。


#### 2. 不能被继承

- 枚举类是 `final` 类型的，不能被继承，确保了枚举类的唯一性和安全性。
- 枚举类本质上是一种单例模式，每个枚举常量相当于一个单例对象。
- 你不能通过 `new` 来实例化枚举类，它的构造方法是私有的。

#### 3. 枚举类的常量可以拥有属性和方法

- 枚举类不仅仅是常量列表，还可以定义属性、构造方法和方法。这使得枚举类的常量可以携带更多的业务信息。

例如，在上面的 `Color` 枚举类中，枚举常量有 `description` 和 `brightnessLevel` 属性，并且提供了 `getDescription()` 和 `getBrightnessLevel()` 方法。

#### 4. `toString()`方法

- 枚举类会自动重写 `toString()` 方法，因此你可以直接打印枚举常量的名称而不是对象的内存地址。例如：
```java
public class Main {     public static void main(String[] args) {         // 输出枚举常量的名称         
System.out.println(Color.RED); 
// 输出 RED     }
}

默认情况下，`toString()` 方法返回的是枚举常量的名称（如 `RED`，`GREEN`，`BLUE`），而不是对象的内存地址。
```

### 6.总结
- 枚举类是固定常量的集合，可以为每个枚举常量定义属性和方法。
- 枚举类不能被继承，构造函数默认是私有的。
- 枚举常量自动调用构造器，可以拥有不同的属性，且可以重写 `toString()` 方法输出友好的名称。
- 枚举类的设计模式本质上是单例模式，可以方便地管理常量，避免了传统常量类带来的问题。

---
# 接口（Interface）

接口是 Java 中的一种特殊类型的类，主要用于定义一组方法的声明，规定了实现该接口的类必须提供的方法实现。接口无法直接创建对象，它更多的是作为类与类之间的契约，用来规定实现类的行为。

### 1. 常量和方法

- **常量**：接口中的变量默认是 `public static final`，这意味着接口中的所有字段都自动成为常量，且必须初始化。你不需要显式地写 `public static final`，编译器会自动加上。
    
    ```java
    public interface MyInterface {
        int MY_CONSTANT = 100;  // 默认是 public static final
    }
    ```
    
- **方法**：接口中的方法默认是 `public abstract`，这意味着所有接口方法都是公共的，并且是抽象的。你可以省略 `public` 和 `abstract`，编译器会自动补全它们。
    
    ```java
    public interface MyInterface {
        void doSomething();  // 默认是 public abstract
    }
    ```
    
    - 接口方法不能有实现，只有声明，具体的实现由实现该接口的类提供。

### 2. 不能创建接口的实例

- 你不能直接实例化一个接口对象，接口只能通过实现它的类来创建对象。
    
    ```java
    MyInterface obj = new MyInterface();  // 错误，接口不能实例化
    ```
    

### 3. 接口的继承

- 接口可以继承多个其他接口，通过 `extends` 关键字。
    
- 一个类可以实现多个接口，通过 `implements` 关键字。
    
    ```java
    public interface A {
        void methodA();
    }
    
    public interface B {
        void methodB();
    }
    
    public class C implements A, B {
        @Override
        public void methodA() {
            System.out.println("methodA");
        }
    
        @Override
        public void methodB() {
            System.out.println("methodB");
        }
    }
    ```
    
- **接口与接口**：多个接口的继承没有问题，一个接口可以继承多个接口，形成多重继承。
    
- **类与接口**：类只能实现接口，不能继承多个类，但可以实现多个接口。Java 支持类的单继承和接口的多继承。
    

### 4. 接口方法的重写和同名方法问题

- **父类和接口同名**：当一个类同时继承父类并实现接口时，如果父类和接口有同名的方法，子类会优先使用父类中的实现。
    
    例如：
    
    ```java
    public interface MyInterface {
        void doSomething();
    }
    
    public class ParentClass {
        public void doSomething() {
            System.out.println("ParentClass implementation");
        }
    }
    
    public class MyClass extends ParentClass implements MyInterface {
        // 继承父类，重写接口方法
        @Override
        public void doSomething() {
            super.doSomething();  // 可以调用父类的实现
            System.out.println("MyClass implementation");
        }
    }
    ```
    
- **多个接口的同名方法**：如果一个类实现多个接口且这些接口包含同名的方法，编译器不会报错，但你需要重写该方法来指定实现。如果接口的方法签名完全相同，Java 会允许你通过实现类来提供一个统一的实现。
    
    例如：
    
    ```java
    public interface InterfaceA {
        void doSomething();
    }
    
    public interface InterfaceB {
        void doSomething();
    }
    
    public class MyClass implements InterfaceA, InterfaceB {
        @Override
        public void doSomething() {
            System.out.println("Implemented method from both interfaces");
        }
    }
    ```
    
    在这种情况下，`MyClass` 需要重写 `doSomething()` 方法，以便为两个接口提供统一的实现。
    

#### 总结

- **常量**：接口中的常量自动是 `public static final`。
- **方法**：接口中的方法自动是 `public abstract`，可以省略。
- **不能实例化**：不能直接创建接口的实例，接口需要由实现类来实例化。
- **继承与实现**：接口可以继承多个接口，类可以实现多个接口，但只能继承一个类。
- **同名方法**：如果父类和接口有同名方法，优先使用父类的方法；如果实现多个接口且有同名方法，必须重写该方法。

接口是 Java 中提供多继承的一种机制，可以帮助设计更加灵活、松耦合的代码架构，尤其在大规模系统开发中，接口发挥着至关重要的作用。


---
# 代码块（Code Blocks）

Java 中有三种常见的代码块类型：**静态代码块**、**实例代码块** 和 **普通方法**。其中，静态代码块和实例代码块在类加载和对象创建过程中起着重要的作用。

### 1. 静态代码块（Static Block）

静态代码块是指使用 `static` 关键字声明的代码块，它属于类级别，在类加载时执行，并且只会执行一次。

- **特性**：
    
    - 静态代码块在类加载时执行，且只执行一次。
    - 它通常用于初始化类级别的静态成员，或者执行一些只需要做一次的操作。
    - 静态代码块在构造函数之前执行。
- **代码示例**：
    
    ```java
    public class Person {
        static {
            System.out.println("Static block is executed.");
        }
        
        public Person() {
            System.out.println("Constructor is called.");
        }
    
        public static void main(String[] args) {
            // 创建对象
            Person p1 = new Person();
            Person p2 = new Person();
        }
    }
    ```
    
- **输出结果**：
    
    ```
    Static block is executed.
    Constructor is called.
    Constructor is called.
    ```
    
    **解释**：
    
    - 静态代码块 `static {}` 只会在类加载时执行一次，因此无论创建多少个 `Person` 对象，静态代码块只会执行一次。
    - 构造方法则会在每次创建对象时执行。

#### 2. 实例代码块（Instance Block）

实例代码块是属于实例的代码块，它在每次创建对象时执行，可以在构造方法之前执行。实例代码块的执行顺序是：**先执行实例代码块，再执行构造方法**。

- **特性**：
    
    - 每次创建对象时，都会执行一次实例代码块。
    - 可以在构造函数之前执行一些初始化操作，避免在每个构造函数中重复代码。
- **代码示例**：
    
    ```java
    public class Person {
        {
            System.out.println("Person instance block is called.");
        }
    
        public Person() {
            System.out.println("Constructor is called.");
        }
    
        public static void main(String[] args) {
            // 创建对象
            Person p1 = new Person();
            Person p2 = new Person();
        }
    }
    ```
    
- **输出结果**：
    
    ```
    Person instance block is called.
    Constructor is called.
    Person instance block is called.
    Constructor is called.
    ```
    
    **解释**：
    
    - 每次创建一个新的 `Person` 对象时，实例代码块都会执行一次，然后执行构造方法。

#### 总结：

- **静态代码块**：在类加载时执行一次，适用于类的静态初始化。它是类级别的代码块。
- **实例代码块**：每次创建对象时执行，适用于对象级别的初始化，可以在构造方法之前执行。

这些代码块提供了灵活的初始化机制，尤其在需要根据不同构造函数进行初始化时，可以避免重复代码，使代码更简洁。

---
# 内部类

内部类是定义在另一个类中的类。根据定义位置的不同，内部类有不同的种类：**成员内部类**、**静态内部类**、**匿名内部类** 等，它们各有不同的用途和特点。

### 1. **成员内部类**

成员内部类是定义在外部类的成员位置的类，它可以直接访问外部类的所有成员，包括私有的成员（字段和方法）。出现同名就this

```java
		public class OuterClass {
	    private String message = "Hello from OuterClass!";
	    
	    class InnerClass {
	        public void display() {
	            System.out.println(message);  // 可以直接访问外部类的实例成员
	        }
	    }
	}
	
	public class Main {
	    public static void main(String[] args) {
	        OuterClass outer = new OuterClass();
	        OuterClass.InnerClass inner = outer.new InnerClass();  // 创建内部类实例
	        inner.display();  // 输出: Hello from OuterClass!
	    }
	}
```

### 2. **静态内部类** 

静态内部类是使用 `static` 关键字声明的内部类，它与外部类的实例无关，因此无法直接访问外部类的实例成员，只有通过创建外部类的实例来访问外部类的非静态成员。
**特性**：

- 静态内部类只能访问外部类的静态成员。
- 静态内部类不依赖于外部类的实例，创建实例时不需要外部类的实例。
```java

public class OuterClass {
    private String instanceMessage = "Hello from instance!";
    private static String staticMessage = "Hello from static!";

    // 静态内部类
    static class StaticNestedClass {
        public void display() {
            // 下面这行会编译错误，因为静态内部类不能直接访问外部类的实例成员
            // System.out.println(instanceMessage);  // 错误：无法从静态上下文中引用非静态字段

            // 下面这行是可以的，因为静态内部类可以访问外部类的静态成员
            System.out.println(staticMessage);  // 输出: Hello from static!
        }
    }

    public static void main(String[] args) {
        // 创建静态内部类的实例
        StaticNestedClass nestedInstance = new StaticNestedClass();
        nestedInstance.display();  // 输出: Hello from static!
        
        // 要访问外部类的实例成员，必须通过外部类的实例
        OuterClass outer = new OuterClass();
        StaticNestedClass nestedInstance2 = new StaticNestedClass();
        // 这里的静态内部类实例仍然不能直接访问外部类的实例成员
        // 需要创建外部类的实例来访问实例成员
        System.out.println(outer.instanceMessage);  // 输出: Hello from instance!
    }
}


```


### 3. **匿名内部类**

匿名内部类是没有名字的类，它通常用于临时实现接口或继承某个类的场景。匿名内部类可以直接访问外部类的成员，并且通常用于事件监听器或回调机制等场景。

**特性**：

- 没有类名，通常在方法内创建实例。
- 常常用于实现接口或继承抽象类，并重写方法。
- 自动生成一个子类，类名类似 `类$1`。

![[Pasted image 20241027111638.png]]![[Pasted image 20241027112252.png]]==对象回调==
### 4. **省略方法Lambda**

Lambda 表达式是 Java 8 引入的语法糖，用于简化函数式接口（只有一个抽象方法的接口）的实现。Lambda 表达式常常与匿名内部类一起使用，用于提供函数式编程风格的代码。

**特性**：

- 适用于函数式接口，即只包含一个抽象方法的接口。
- 通过 `@FunctionalInterface` 注解标记接口为函数式接口。
- new class也不用写，直接写参数

![[Pasted image 20241027112459.png]]![[Pasted image 20241027112543.png]]

### 5. **静态方法引用**

静态方法引用是指通过类名直接引用类中的静态方法，可以作为 `Function` 类型的参数传递。

```java
class Helper {
    public static void printMessage(String message) {
        System.out.println(message);
    }
}

public class Main {
    public static void main(String[] args) {
        // 静态方法引用
        ProcessMessage process = Helper::printMessage;
        process.execute("Hello from static method reference!");  // 输出: Hello from static method reference!
    }
}

interface ProcessMessage {
    void execute(String message);
}

```
![[Pasted image 20241027112850.png]]


### 6. **实例方法引用**

实例方法引用是指通过实例对象引用类中的实例方法，也可以传递给函数式接口。

```java
class Printer {
    public void printMessage(String message) {
        System.out.println(message);
    }
}

public class Main {
    public static void main(String[] args) {
        Printer printer = new Printer();
        // 实例方法引用
        ProcessMessage process = printer::printMessage;
        process.execute("Hello from instance method reference!");  // 输出: Hello from instance method reference!
    }
}

interface ProcessMessage {
    void execute(String message);
}

```
![[Pasted image 20241027112954.png]]
### 7. **构造器引用**

构造器引用是通过 `ClassName::new` 来引用类的构造器，通常用于创建对象并将其传递给方法。

```java
class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}

public class Main {
    public static void main(String[] args) {
        // 构造器引用
        PersonFactory factory = Person::new;
        Person person = factory.create("John");
        System.out.println(person.getName());  // 输出: John
    }
}

interface PersonFactory {
    Person create(String name);
}

```

![[Pasted image 20241027113258.png]]
cf是一个实现了接口的类

---
# 异常

异常分为两类：**运行时异常**和**编译时异常**，它们的处理方式有所不同。Java 提供了 `throws` 和 `throw` 关键字用于异常的处理和传播。

### 1. 异常分类：

- **运行时异常（Runtime Exception）**：
    
    - 运行时异常是指程序在运行过程中可能发生的错误，通常是由于编程错误导致的，如访问数组越界、空指针引用等。
    - 运行时异常是 `RuntimeException` 类及其子类的实例。
    - 例如：`ArrayIndexOutOfBoundsException`（数组索引越界）和 `NullPointerException`（空指针异常）等。
    - 这些异常是**不强制要求处理**的，可以在方法签名中不声明 `throws`，也可以不使用 `try-catch` 捕获。

- **编译时异常（Checked Exception）**：
	
	- 编译时异常是指程序在编译阶段就能被检查出来的异常，通常是由于外部条件或资源问题（如文件未找到、网络连接失败等）。
	- 编译时异常是 `Exception` 类的子类，但不包括 `RuntimeException` 和它的子类。
	- 例如：`IOException`、`ParseException`（日期解析异常）等。
	- 这些异常是**强制要求处理**的，编译器会要求我们通过 `try-catch` 块处理，或者在方法签名中声明 `throws`。

 ### 2. `throws` 和 `throw`：

- **`throws`**：

- `throws` 关键字用于**方法签名**，通知调用该方法的上层代码可能会抛出异常，调用者需要处理或声明异常。
- 作用：方法的执行可能会出现问题，我们把问题“传递”给调用者，要求调用者进行处理。
 - 例如：
`public void readFile(String fileName) throws IOException`

**`throw`**：

- `throw` 关键字用于在**方法内部**抛出异常，通常用于手动触发异常。
- 作用：方法内部通过 `throw` 抛出异常，通常会伴随 `try-catch` 语句捕获异常并进行处理。
- 例如
```java
public void checkAge(int age) {
    if (age < 18) {
        throw new IllegalArgumentException("Age must be greater than or equal to 18");
    }
}

```

### 3. `try-catch` 块：

- 在 `try` 块中运行可能发生异常的代码。如果异常发生，控制将转到相应的 `catch` 块进行处理。
- 如果没有异常发生，则跳过 `catch` 块。
- 如果异常未被处理，可以将其继续抛出，直到被更高层次的调用者捕获。

### 4. 自定义异常
 ![[Pasted image 20241027114136.png]]

```java
// 自定义异常类
public class InvalidAgeException extends Exception {

    public InvalidAgeException() {
        super("Invalid age! Age must be greater than or equal to 18.");
    }

    public InvalidAgeException(String message) {
        super(message);
    }

    public InvalidAgeException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidAgeException(Throwable cause) {
        super(cause);
    }
}

// Person 类
public class Person {

    private int age;

    public Person(int age) throws InvalidAgeException {
        if (age < 18) {
            throw new InvalidAgeException("Age must be at least 18! Provided age: " + age);
        }
        this.age = age;
    }

    public int getAge() {
        return age;
    }
}

// 主类
public class Main {

    public static void main(String[] args) {
        try {
            Person person = new Person(15);  // 这里会抛出 InvalidAgeException
        } catch (InvalidAgeException e) {
            // 捕获自定义异常并处理
            System.out.println("Caught exception: " + e.getMessage());
        }
    }
}


```

---

# 泛型

- **提高代码重用性**：通过泛型，可以让同一个类、方法或接口支持多种类型。
- **避免类型转换异常**：在使用泛型时，编译器会自动进行类型检查，避免了手动转换带来的问题。
- **提供类型安全**：泛型能在编译阶段保证类型安全，避免了运行时类型错误。
![[Pasted image 20241027115823.png]]
## 泛型的基础语法

### 1. **泛型类**：
泛型类可以定义一个或多个类型参数。类型参数通常用大写字母表示，如 `T`、`E`、`K`、`V` 等。
```java
// 泛型类示例
public class Box<T> {
    private T value;

    public void setValue(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Box<String> stringBox = new Box<>();
        stringBox.setValue("Hello");
        System.out.println(stringBox.getValue());  // 输出 "Hello"
        
        Box<Integer> integerBox = new Box<>();
        integerBox.setValue(123);
        System.out.println(integerBox.getValue());  // 输出 "123"
    }
}

```

### 2. **泛型方法**： 
泛型方法允许在方法中定义类型参数。这样可以让方法支持不同的类型，而不需要定义多个重载方法。`<T>`在关键字修饰符里面写

```java
// 泛型方法示例
public class GenericMethod {
	// 返回值也可以是T，
    public <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.print(element + " ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        GenericMethod gm = new GenericMethod();
        Integer[] intArray = {1, 2, 3, 4};
        String[] strArray = {"Hello", "World"};
        gm.printArray(intArray);  // 输出 "1 2 3 4"
        gm.printArray(strArray);  // 输出 "Hello World"
    }
}

```


### 3. **泛型接口**：
泛型接口允许接口在定义时使用类型参数，使用时提供具体类型。

```java
// 泛型接口示例
public interface Pair<K, V> {
    K getKey();
    V getValue();
}

// 泛型接口的实现类
public class OrderedPair<K, V> implements Pair<K, V> {
    private K key;
    private V value;

    public OrderedPair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    @Override
    public K getKey() {
        return key;
    }

    @Override
    public V getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Pair<String, Integer> p = new OrderedPair<>("Age", 25);
        System.out.println(p.getKey() + ": " + p.getValue());  // 输出 "Age: 25"
    }
}

```

### 泛型的限制

1. **不能创建泛型数组**： 由于 Java 的类型擦除机制，泛型类型信息会在编译时被擦除，因此不能直接创建泛型数组。
```java
// 错误示例：不能创建泛型数组
public class Test {
    public static void main(String[] args) {
        // Compiler Error: Cannot create a generic array of T
        // T[] array = new T[10];
    }
}

```
解决方案：可以使用 `ArrayList` 等集合类，或者通过反射来创建数组。

2. **类型擦除**： 
- Java 在编译时会进行类型擦除，即泛型的类型信息会在编译阶段被删除，转而用原始类型代替。例如，`List<String>` 和 `List<Integer>` 在编译后都会变成 `List`。
```java

public class Test {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("Hello");
        // 泛型类型擦除
        List list2 = list;  // 编译通过，运行时可能出现问题
        list2.add(123);  // 运行时会抛出 ClassCastException
    }
}

```

3. **泛型的上限和下限（通配符）**： 
- Java 泛型提供了通配符 `?` 来表示未知类型。通过通配符，可以灵活地定义可以接受不同类型的泛型。

- **上限通配符（`? extends T`）**：表示该类型是 `T` 或其子类的类型。
- **下限通配符（`? super T`）**：表示该类型是 `T` 或其父类的类型。
```java
// 上限通配符（? extends T）
public static void printList(List<? extends Number> list) {
    for (Number num : list) {
        System.out.print(num + " ");
    }
}

// 下限通配符（? super T）
public static void addNumbers(List<? super Integer> list) {
    list.add(1);  // 可以添加 Integer 或其子类的对象
}

```


### 泛型与类型安全

泛型提供了一种机制，在编译时检查类型的正确性，避免了使用原始类型时常见的 `ClassCastException`。因此，使用泛型能够有效地提高代码的类型安全性。

### 泛型的优缺点
#### 优点：

1. **类型安全**：泛型在编译时进行类型检查，避免了 `ClassCastException`。
2. **代码复用性**：同一段代码可以处理多种类型的数据，提高了代码的复用性。
3. **简化代码**：不需要显式地进行类型转换，使代码更加简洁易懂。

#### 缺点：

1. **性能开销**：由于使用了类型擦除，某些情况下可能会有性能损失，尤其是在泛型方法中频繁进行类型转换时。

## 一些可能超纲的解释
### `Number` 类型及其继承体系

在 Java 中，`Number` 是一个抽象类，位于 `java.lang` 包下，它是所有数值类型的父类。`Number` 类本身不能直接实例化，但它的子类代表了不同的数值类型，包括整数类型（`Integer`, `Long`, `Byte`, `Short`）和浮点类型（`Float`, `Double`）。

以下是 `Number` 类及其常见子类的继承关系：

```vbnet
                Object
                  |
                Number
          _______|_______
         |               |
      Integer           Double
         |               |
       Long            Float
         |
      Short
         |
       Byte
```

- `Number` 类提供了一些方法来访问数值，比如：
    - `int intValue()`：返回 `Number` 对象的 `int` 值。
    - `long longValue()`：返回 `Number` 对象的 `long` 值。
    - `float floatValue()`：返回 `Number` 对象的 `float` 值。
    - `double doubleValue()`：返回 `Number` 对象的 `double` 值。

### `ClassCastException` 异常

`ClassCastException` 是 Java 中的一种运行时异常，通常发生在尝试将对象强制转换为不兼容的类型时。

例如：

```java
Object obj = "Hello";
Integer num = (Integer) obj;  // ClassCastException
```

在这个例子中，`obj` 实际上是一个 `String` 对象，而我们却试图将其转换为 `Integer` 类型，这会引发 `ClassCastException`。

#### 解决 `ClassCastException` 问题

要避免 `ClassCastException`，我们可以使用如下的方法：

1. **使用 `instanceof` 进行类型检查**：在转换对象之前，先检查对象的类型是否符合预期。
    
    ```java
    Object obj = "Hello";
    if (obj instanceof String) {
        String str = (String) obj;  // 安全转换
    } else {
        System.out.println("类型不匹配");
    }
    ```
    
2. **通过泛型确保类型安全**：在使用泛型时，编译器会强制进行类型检查，减少了 `ClassCastException` 的发生。
    
    ```java
    List<String> list = new ArrayList<>();
    list.add("Hello");
    String str = list.get(0);  // 不会抛出异常，因为编译器已经检查过类型
    ```
    

### 解决方案：创建泛型数组

Java 不允许直接创建泛型类型的数组，因为 Java 在编译时会对泛型进行类型擦除，使得运行时无法知道泛型的具体类型。比如，以下代码是不合法的：

```java
// 错误的代码：不能创建泛型数组
T[] array = new T[10];
```

**解决方法**：

1. **使用 `ArrayList`**： 在 Java 中，可以使用 `ArrayList` 替代数组，因为 `ArrayList` 是泛型支持的集合类，并且可以动态调整大小。`ArrayList` 会在运行时保持类型信息，因此能够避免类型擦除带来的问题。
    
    ```java
    // 使用 ArrayList 代替泛型数组
    public class Test {
        public static void main(String[] args) {
            // 使用 ArrayList 而非数组
            List<Integer> list = new ArrayList<>();
            list.add(1);
            list.add(2);
            list.add(3);
            System.out.println(list);  // 输出：[1, 2, 3]
        }
    }
    ```
    
2. **通过反射创建数组**： Java 允许通过反射来创建泛型数组。使用 `Array.newInstance()` 方法，可以在运行时动态地创建数组。
    
    ```java
    import java.lang.reflect.Array;
    
    public class Test {
        public static void main(String[] args) {
            // 使用反射创建泛型数组
            Class<?> clazz = Integer.class;  // 假设我们要创建 Integer 类型的数组
            Integer[] array = (Integer[]) Array.newInstance(clazz, 10);
            
            // 添加元素
            array[0] = 1;
            array[1] = 2;
            System.out.println(array[0] + ", " + array[1]);  // 输出 "1, 2"
        }
    }
    ```
    
    解释：
    
    - 使用 `Array.newInstance(clazz, 10)` 可以创建一个指定类型的数组，其中 `clazz` 是数组元素的类型，`10` 是数组的大小。
    - 反射机制允许我们在运行时根据具体类型创建数组，绕开了泛型数组不能直接创建的限制。

### 总结

- `Number` 是 Java 中所有数值类型的父类，提供了一个统一的接口来访问各种类型的数值。
- `ClassCastException` 是类型转换错误时抛出的异常，通常发生在尝试将一个对象转换为与其实际类型不兼容的类型时。
- 解决 `ClassCastException` 问题的办法之一是使用泛型和 `instanceof` 来确保类型安全。
- 在创建泛型数组时，由于类型擦除，Java 不允许直接创建泛型数组。可以使用 `ArrayList` 或通过反射机制创建数组。

---
# 自动装箱拆箱

**自动装箱**和**自动拆箱**是 Java 中的一种特性，用来简化基本数据类型和它们对应的包装类之间的转换。集合中常用。

- **自动装箱（Autoboxing）**：将基本数据类型自动转换为对应的包装类对象。
- **自动拆箱（Unboxing）**：将包装类对象自动转换为对应的基本数据类型。
- ![[Pasted image 20241027120356.png]]

### 自动装箱和拆箱的注意事项

1. **性能问题**：虽然自动装箱和拆箱可以简化代码，但它们会带来一些性能开销。每次装箱和拆箱都会创建对象（对于装箱），并进行类型转换（对于拆箱）。因此，如果在性能敏感的场景下，频繁进行装箱和拆箱，可能会对性能产生影响。
    
2. **空指针异常**：如果包装类对象为 `null`，在进行拆箱时会抛出 `NullPointerException`。例如：
```java

Integer num = null;
int x = num;  // 会抛出 NullPointerException

```
解决方法是确保包装类对象不为 `null`，或者在拆箱前进行 `null` 检查（instanceof）。



---
# 关于集合
### Collection

- **List** 和 **Set** 是 `Collection` 的两个子接口。
    - **List** 接口支持有序列表，并且允许重复元素。
        - **ArrayList**：基于数组实现的列表。
        - **LinkedList**：基于链表实现的列表。
    - **Set** 接口支持无序集合，并且不允许重复元素。
        - **HashSet**：基于哈希表实现的集合。
        - **TreeSet**：基于红黑树实现的集合。
        - **LinkedHashSet**：基于链表和哈希表实现的集合，保持插入顺序。

---

#### 常用方法


| **方法名**                                 | **功能描述**       |
| --------------------------------------- | -------------- |
| `public boolean add(E e)`               | 将指定的对象添加到当前集合中 |
| `public void clear()`                   | 清空集合中的所有元素     |
| `public boolean remove(E e)`            | 删除集合中的指定对象     |
| `public boolean contains(Object obj)`   | 判断集合中是否包含指定的对象 |
| `public boolean isEmpty()`              | 判断集合是否为空       |
| `public int size()`                     | 返回集合中元素的个数     |
| `public Object[] toArray()`             | 将集合中的元素存储到数组中  |
| `public boolean addAll(Collection<>())` | 批量添加元素         |
| `public void shuffle(List<> list)`      | 随机打乱元素         |

---

#### 遍历数组

1. **使用迭代器**
```java
Collection<String> names = new ArrayList<>();
names.add("张无忌");
names.add("玄冥二老");
names.add("宋青书");
names.add("殷素素");
System.out.println(names);// 调用toString()方法，
 // 输出 [张无忌, 玄冥二老, 宋青书，殷素素]

Iterator<String> it = names.iterator();
while (it.hasNext()) { 
	if (it.next().equals("宋青书")) {
		it.remove(); // 安全删除 
	} 
}

```
**注意**：

- 迭代器是移位操作，必须“一取一用”，不能跳过。
- 在遍历时使用 `it.remove()` 可以安全地删除元素，直接使用 `collection.remove()` 会导致遍历错误。
**错误原因**:
- 当你通过 **迭代器** 遍历集合时，迭代器会维护一个**内部计数器**，用来记录集合的结构性修改。
- 如果在遍历过程中使用集合的 `remove()` 方法直接删除元素，会破坏迭代器的结构一致性，因为此时集合的修改没有通知迭代器。
- 这种情况下，迭代器检测到集合的结构被修改，就会抛出 `ConcurrentModificationException`。


2. **增强for循环**
```java

List<String> names = new ArrayList<>();
names.add("张无忌");
names.add("宋青书");
names.add("殷素素");

for (String name : names) {
    if (name.equals("宋青书")) {
        names.remove(name); // 抛出 ConcurrentModificationException
    }
}


```
 **注意**：增强 for 循环本质是基于迭代器的，不允许在遍历过程中修改集合内容。如果需要删除，可以使用迭代器的 `remove()` 方法。
 
 
3. **forEach方法**
- **适用于 JDK 8 及以上版本**。
- 需要传入 `Consumer` 的实现类或其匿名内部类。
```java

names.forEach(name -> System.out.println(name));

```

---

### 自定义功能实现

- **自定义去重逻辑**
    
    - 在使用 `HashSet` 或 `TreeSet` 时，如果集合中的对象是自定义类，需要重写 `hashCode()` 和 `equals()` 方法。
    - 可以使用 Lombok 的 `@Data` 注解，它会自动为类生成 `hashCode()` 和 `equals()` 方法。
- **TreeSet 自定义排序**
    
    - 可以通过实现 `Comparable` 接口或者传入 `Comparator` 来定义排序规则。
    
    
```java
	TreeSet<Integer> numbers = new TreeSet<>((a, b) -> b - a); // 降序排列`
```
	
- **使用工具方法比较数值**
    
    - `Double.compare(a, b)`：用于比较两个浮点数，返回 `-1`、`0` 或 `1`。
```java
// 使用 Double.compare 进行升序排序 
Collections.sort(numbers, (a, b) -> Double.compare(a, b));
```

---

### Map集合的体系

- **Map<K, V>**
    
    - **HashMap<K, V>**：无序、不重复、无索引；（用的最多）
        
    - **TreeMap<K, V>**：按照大小默认升序排序、不重复、无索引。
        
    - **LinkedHashMap<K, V>**：有序、不重复、无索引。
        

#### Map集合体系的特点

- 注意：Map系列集合的特点都是由键决定的，值只是一个附属品，值是不做要求的。
    

#### 常用方法

|**方法名**|**功能描述**|
|---|---|
|`public V put(K key, V value)`|添加元素|
|`public int size()`|获取集合的大小|
|`public void clear()`|清空集合|
|`public boolean isEmpty()`|判断集合是否为空|
|`public V get(Object key)`|根据键获取对应值|
|`public V remove(Object key)`|根据键删除整个元素|
|`public boolean containsKey(Object key)`|判断是否包含某个键|
|`public boolean containsValue(Object value)`|判断是否包含某个值|
|`public Set<K> keySet()`|获取全部键的集合|
|`public Collection<V> values()`|获取Map集合的全部值|

---

#### 遍历Map集合

1. **使用entrySet遍历**
```java

Set<Map.Entry<String, Integer>> entries = map.entrySet();
for (Map.Entry<String, Integer> entry : entries) {
    String key = entry.getKey();
    Integer value = entry.getValue();
    System.out.println(key + "=" + value);
}

```
2. **使用forEach**
```java
map.forEach((k, v) -> System.out.println(k + "=" + v));
```


---
# Stream流

## Stream 流的使用步骤

#### 1. 数据源
- **来源**：集合、数组等。
- **特点**：Stream 流代表一条流水线，能够与数据源建立连接。

---

#### 2. 调用流水线的各种方法
- **功能**：对数据进行处理、计算。
- 常见操作：
  - **过滤**（Filter）
  - **排序**（Sort）
  - **去重**（Distinct）
  - 其他操作...

---

#### 3. 获取处理结果
- **结果类型**：
  - 遍历
  - 统计
  - 收集到一个新集合中返回

---


## 如何操作 Stream

### 获取集合的 Stream 流

#### 1. Collection 的 Stream 流

- 调用集合的 `stream()` 方法获取。

```java
Collection<String> list = new ArrayList<>();
Stream<String> s1 = list.stream();
```

---

#### 2. Map 集合的 Stream 流

- **获取键的流**：

```java
Stream<String> keyStream = map.keySet().stream();
```

- **获取值的流**：

```java
Stream<Integer> valueStream = map.values().stream();
```

- **获取键值对的流**：

```java
Stream<Map.Entry<String, Integer>> entryStream = map.entrySet().stream();
```

---

#### 3. 数组的 Stream 流

- 使用 `Arrays.stream()`：

```java
String[] names = {"张三丰", "张无忌", "张翠山"};
Stream<String> s1 = Arrays.stream(names);
System.out.println(s1.count()); // 输出 3
```

- 使用 `Stream.of()`：

```java
Stream<String> s2 = Stream.of(names);
Stream<String> s3 = Stream.of("张三丰", "张无忌", "张翠山");
```

---

### Stream 的中间方法

#### 1. **过滤 (`filter`)**

- 筛选满足条件的元素。

```java
list.stream()
    .filter(s -> s.startsWith("张") && s.length() == 3)
    .forEach(System.out::println);
```

---

#### 2. **排序 (`sorted`)**

- **默认升序排序**：

```java
scores.stream()
      .sorted()
      .forEach(System.out::println);
```

- **降序排序**：

```java
scores.stream()
      .sorted((s1, s2) -> Double.compare(s2, s1))
      .forEach(System.out::println);
```

---

#### 3. **限制与跳过**

- **限制输出数量 (`limit`)**：

```java
scores.stream()
      .sorted((s1, s2) -> Double.compare(s2, s1))
      .limit(2)
      .forEach(System.out::println);
```

- **跳过前几个元素 (`skip`)**：

```java
scores.stream()
      .sorted((s1, s2) -> Double.compare(s2, s1))
      .skip(2)
      .forEach(System.out::println);
```

---

#### 4. **去重 (`distinct`)**

- 需要自定义对象时重写 `hashCode` 和 `equals` 方法：

```java
scores.stream()
      .distinct()
      .forEach(System.out::println);
```

---

#### 5. **映射 (`map`)**

- 对流中的数据进行加工或转换。

```java
scores.stream()
      .map(s -> "加10分后: " + (s + 10))
      .forEach(System.out::println);
```

---

#### 6. **合并流 (`concat`)**

- 合并两个流：

```java
Stream<String> s1 = Stream.of("张三丰", "张无忌");
Stream<Integer> s2 = Stream.of(100, 200);
Stream<Object> combinedStream = Stream.concat(s1, s2);
System.out.println(combinedStream.count());
```

---

### Stream 的最终方法

#### 1. **遍历 (`forEach`)**

- 遍历流中的每个元素：

```java
teachers.stream()
        .filter(t -> t.getSalary() > 15000)
        .forEach(System.out::println);
```

---

#### 2. **统计数量 (`count`)**

- 统计满足条件的元素数量：

```java
long count = teachers.stream()
                     .filter(t -> t.getSalary() > 15000)
                     .count();
System.out.println(count);
```

---

#### 3. **获取最大值与最小值 (`max` / `min`)**

- 获取薪资最高的老师：

```java
Optional<Teacher> maxTeacher = teachers.stream()
                                       .max((t1, t2) -> Double.compare(t1.getSalary(), t2.getSalary()));
System.out.println(maxTeacher.orElse(null));
```

- 获取薪资最低的老师：

```java
Optional<Teacher> minTeacher = teachers.stream()
                                       .min((t1, t2) -> Double.compare(t1.getSalary(), t2.getSalary()));
System.out.println(minTeacher.orElse(null));
```

`Optional` 是 Java 8 引入的一个容器类，用于表示一个值可能存在，也可能不存在（避免出现 `NullPointerException` 的问题）。它主要用于显式地处理可能为 `null` 的情况。

##### **`orElse(T other)` 方法**

- **定义**：`T orElse(T other)`
- **功能**：如果 `Optional` 中有值，返回该值；如果没有值，返回 `orElse` 方法提供的参数值。
---

#### 4. **收集到集合 (`collect`)**

- 收集到 `Map`：

```java
Map<String, Double> teacherMap = teachers.stream()
                                         .collect(Collectors.toMap(
                                             Teacher::getName,
                                             Teacher::getSalary
                                         ));
System.out.println(teacherMap);
```

- 收集到 `List`：

```java
List<String> nameList = list.stream()
                            .filter(s -> s.startsWith("张"))
                            .collect(Collectors.toList());
System.out.println(nameList);
```

- 收集到 `Set`：

```java
Set<String> nameSet = list.stream()
                          .filter(s -> s.startsWith("张"))
                          .collect(Collectors.toSet());
System.out.println(nameSet);
```

---

#### 5. **转换为数组 (`toArray`)**

- 将流转换为数组：

```java
Object[] namesArray = list.stream().toArray();
System.out.println(Arrays.toString(namesArray));
```

---

### Stream API 总结

1. **获取流**：从集合、数组或 `Stream.of` 中获取。
2. **中间操作**：`filter`、`sorted`、`distinct`、`limit`、`map` 等。
3. **最终操作**：`forEach`、`count`、`max`、`min`、`collect` 等。
4. **灵活应用**：结合 `Collectors` 工具类可轻松实现复杂操作。


# 可变参数

在 Java 中，可变参数允许在方法调用时传递可变数量的参数，而不需要定义多个方法重载。  
可变参数通过 **`...`**（三点）语法实现，本质上是将可变参数当作数组处理。

```java
public class ParamDemo1 {
    public static void main(String[] args) {
        // 认识可变参数
        sum(); // 不传参数
        sum(10); // 可以传一个参数
        sum(10, 20, 30, 40, 50); // 可以传多个参数
        sum(new int[]{11, 22, 33, 44}); // 可以传数组
    }

    public static void sum(int... nums) {
        // 可变参数实际上内部是一个数组
        System.out.println("数组长度: " + nums.length);
        System.out.println("数组内容: " + Arrays.toString(nums));
        System.out.println("---------------------------------");
    }
}

```

---

### **可变参数的优点**

1. **灵活性高**：允许传递零个、一个或多个参数。
2. **简化代码**：避免重载方法的繁琐实现。
3. **与数组兼容**：可以直接传递数组作为参数。


---


### **使用可变参数的注意事项**

1. **可变参数在方法参数列表中只能有一个**：
    
    ```java
    public void method(int... nums, String...  name) {} // 错误 
    public void method( int... nums) {} // 正确`
	```

2. **可变参数必须放在参数列表的最后**：
    
    ```java
	public void method(String name, int... nums) {} // 正确
	 public void method(int... nums, String name) {} // 错误`
	```

3. **可变参数本质是数组**：在方法内部，`nums` 就是一个数组，可以通过数组的方式处理。

---

### **补充：方法重载与可变参数**

如果一个类中同时存在重载方法和可变参数方法，调用时会优先匹配参数个数相同的重载方法。

```java

public class OverloadDemo {
    public static void main(String[] args) {
        print(1); // 调用重载方法
        print(1, 2); // 调用可变参数方法
    }

    public static void print(int a) {
        System.out.println("调用重载方法");
    }

    public static void print(int... nums) {
        System.out.println("调用可变参数方法");
    }
}

```


---



# io流

## IO流的体系


### 字节流
- **字节输入流**
  - InputStream
    - FileInputStream
    - BufferedInputStream
    - DataInputStream
- **字节输出流**
  - OutputStream
    - FileOutputStream
    - BufferedOutputStream
    - PrintStream
    - DataOutputStream

### 字符流
- **字符输入流**
  - Reader
    - FileReader
    - BufferedReader
    - InputStreamReader
- **字符输出流**
  - Writer
    - FileWriter
    - BufferedWriter
    - PrintWriter





---

## 字节流

### 字节输入流

#### 1. 创建字节输入流

- **作用**：用于从文件中读取字节数据。

```java
public class FileInputStreamDemo {
    public static void main(String[] args) throws Exception {
        // 创建字节输入流对象，指向源文件路径
        InputStream is = new FileInputStream("path/to/your/file.txt");
        
        // 开始读取文件中的字节并输出
        int b;
        while ((b = is.read()) != -1) {
            System.out.print((char) b);
        }
    }
}
```

- **解释**：
    - 使用 `FileInputStream` 创建字节输入流对象，并指定文件路径。
    - `is.read()` 每次读取一个字节，返回该字节的值，文件末尾返回 `-1`。

#### 2. 读取字节数组

- **作用**：通过字节数组来高效读取文件内容。

```java
byte[] buffer = new byte[3];
int len;

while ((len = is.read(buffer)) != -1) {
    String str = new String(buffer, 0, len);
    System.out.println(str);
}
```

- **解释**：
    - 定义一个字节数组 `buffer` 来批量读取字节。
    - 通过 `is.read(buffer)` 读取字节并返回实际读取的字节数。
    - 将字节数组转换为字符串并输出。

### 字节输出流

#### 1. 创建字节输出流

- **作用**：用于将字节数据写入文件。

```java
public class FileOutputStreamDemo {
    public static void main(String[] args) throws Exception {
        OutputStream os = new FileOutputStream("path/to/output/file.txt");
        
        // 写入数据
        os.write(97);  // 写入一个字节数据
        os.write('b');  // 写入一个字符数据
        os.write('徐'.getBytes()); // 写入一个字符串数据（可能会乱码）
        os.write("\r\n".getBytes()); // 换行
        
        // 写一个字节数组出去
        byte[] bytes = "我爱你中国666".getBytes();
        os.write(bytes);
        os.write("\r\n".getBytes()); // 换行
        
        // 写一个字节数组的一部分出去
        os.write(bytes, 0, 3);
        os.write("\r\n".getBytes()); // 换行
    }
}
```

- **解释**：
    - 使用 `FileOutputStream` 创建字节输出流对象。
    - 可以直接写入字节、字符数据，或通过 `getBytes()` 方法将字符串转换为字节数组写入。

#### 2. 文件复制

- **作用**：使用字节流实现文件复制。

```java
public class FileCopyDemo {
    public static void copyFile(String srcPath, String destPath) {
        try (InputStream fis = new FileInputStream(srcPath);
             OutputStream fos = new FileOutputStream(destPath)) {
            
            byte[] buffer = new byte[1024];
            int len;
            while ((len = fis.read(buffer)) != -1) {
                fos.write(buffer, 0, len); // 读取多少字节，写入多少字节
            }
            System.out.println("复制成功！");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

- **解释**：
    - 使用 `FileInputStream` 读取文件内容并通过 `FileOutputStream` 写入目标文件。
    - `try-with-resources` 语法保证流对象在操作完毕后自动关闭。

---

## 字符流

### 字符输出流

#### 1. 文件字符输出流 (`FileWriter`)

- **作用**：用于将字符数据写入文件，常用于处理文本数据。

```java
import java.io.FileWriter;
import java.io.IOException;

public class FileWriterDemo {
    public static void main(String[] args) {
        try (FileWriter writer = new FileWriter("output.txt", true)) { // 追加模式
            writer.write("Hello, ");
            writer.write("World!\n");
            writer.write("This is a test.\r\n");
            writer.write("Another line.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- **构造器**：
    
    - `FileWriter(File file)`：使用文件对象创建 `FileWriter`。
    - `FileWriter(String filepath)`：使用文件路径创建 `FileWriter`。
    - `FileWriter(File file, boolean append)`：使用文件对象和追加模式创建 `FileWriter`。
    - `FileWriter(String filepath, boolean append)`：使用文件路径和追加模式创建 `FileWriter`。
- **方法**：
    
    - `write(int c)`：写一个字符。
    - `write(String str)`：写一个字符串。
    - `write(String str, int off, int len)`：写一个字符串的一部分。
    - `write(char[] cbuf)`：写入一个字符数组。
    - `write(char[] cbuf, int off, int len)`：写入字符数组的一部分。
- **特殊注意事项**：
    
    - 可以写 `\r\n` 来换行。
    - 写出数据后需要刷新或关闭流，`flush` 和 `close` 会确保数据被正确写入文件。

---

## 缓冲流

### 字节缓冲输入流

#### 1. `BufferedInputStream`

`BufferedInputStream` 是字节流的缓冲输入流，常用于从文件中读取字节数据。它通过缓冲区来减少每次读取时与磁盘的交互次数，从而提高性能。

##### 作用

- **提高读取性能**，通过缓冲区减少磁盘读取次数。
- **减少读取次数**，每次从缓冲区读取大块数据，减少了与磁盘的交互。

##### 示例代码

```java
import java.io.*;

public class BufferedInputStreamDemo {
    public static void copyFile(String srcPath, String destPath) {
        try {
            // 创建字节输入流
            InputStream fis = new FileInputStream(srcPath);
            // 包装成缓冲输入流
            BufferedInputStream bis = new BufferedInputStream(fis);
            // 创建字节输出流
            OutputStream fos = new FileOutputStream(destPath);
            
            // 缓冲区（默认为8KB）
            byte[] buffer = new byte[1024];
            int len;
            while ((len = bis.read(buffer)) != -1) {
                fos.write(buffer, 0, len);  // 将读取到的字节写入输出流
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

- **解释**：
    - `BufferedInputStream` 使用一个内存缓冲区来减少读取磁盘的次数，从而提高读取速度。
    - 默认情况下，缓冲区大小是 8KB，但可以在创建流时指定不同的缓冲区大小。

---

### 字节缓冲输出流

#### 1. `BufferedOutputStream`

`BufferedOutputStream` 是字节流的缓冲输出流，通常用于将字节数据写入文件。它减少了与磁盘的交互次数，从而提高了写入性能。

##### 作用

- **提高写入性能**，通过缓冲区减少与磁盘的交互。
- **减少写入次数**，数据先写入缓冲区，再一次性写入磁盘。

##### 示例代码

```java
import java.io.*;

public class BufferedOutputStreamDemo {
    public static void main(String[] args) {
        try {
            // 创建字节输出流
            OutputStream fos = new FileOutputStream("day03-file-io\\src\\output.txt");
            // 包装成缓冲输出流
            BufferedOutputStream bos = new BufferedOutputStream(fos);
            
            // 写入字节数据
            String data = "Hello, BufferedOutputStream!";
            bos.write(data.getBytes()); // 将字符串转换为字节数组并写入
            
            // 刷新并关闭流
            bos.flush();
            bos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- **解释**：
    - `BufferedOutputStream` 使用缓冲区将数据缓存在内存中，直到缓冲区满了或调用 `flush()` 方法时才会一次性写入磁盘。

---

### 字符流缓冲

#### 1. `BufferedReader`

`BufferedReader` 是字符流的缓冲输入流，用于高效地读取文本文件。它通过缓冲区来减少磁盘读取的次数，并且提供了很多方便的方法，如 `readLine()` 来按行读取文本。

##### 作用

- **提高读取性能**，通过缓冲区减少读取磁盘的次数。
- **按行读取**，`readLine()` 方法可以逐行读取文本文件。

##### 示例代码

```java
import java.io.*;

public class BufferedReaderDemo {
    public static void main(String[] args) {
        try {
            // 创建文件读取流
            Reader fr = new FileReader("day03-file-io\\src\\lei08.txt");
            // 包装成缓冲读取流
            BufferedReader br = new BufferedReader(fr);
            
            // 按行读取文件内容
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);  // 输出每一行
            }
            br.close();  // 关闭流
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- **解释**：
    - `BufferedReader` 使用缓冲区进行高效读取，通过 `readLine()` 方法按行读取文本数据。
    - 缓冲区默认大小为 8KB，但可以在创建时通过第二个参数自定义缓冲区大小。

#### 2. `BufferedWriter`

`BufferedWriter` 是字符流的缓冲输出流，用于将字符数据写入文件。它可以将字符数据缓冲到内存中，减少了每次写入文件的磁盘 I/O 操作。

##### 示例代码

```java
import java.io.*;

public class BufferedWriterDemo {
    public static void main(String[] args) {
        try {
            // 创建字符输出流
            Writer fw = new FileWriter("day03-file-io\\src\\output.txt", true);
            // 包装成缓冲输出流
            BufferedWriter bw = new BufferedWriter(fw);
            
            // 写入字符数据
            bw.write("Hello, ");
            bw.newLine();  // 换行
            bw.write("World!");
            bw.newLine();
            
            // 刷新并关闭流
            bw.flush();
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- **解释**：
    - `BufferedWriter` 将字符数据写入内存缓冲区，当缓冲区满时，它会一次性写入文件。
    - `newLine()` 用于插入换行符（操作系统相关）。

---


## 打印流

### PrintStream

#### 1. 创建 PrintStream

- **作用**：`PrintStream` 是字节流，它可以将内容输出到文件、控制台等，并且提供了打印各种数据类型的方法。

```java
public class PrintStreamDemo {
    public static void main(String[] args) throws Exception {
        // 创建 PrintStream 输出流对象，指向目标文件
        PrintStream ps = new PrintStream("path/to/output/file.txt");

        // 输出基本数据类型
        ps.println(123);   // 输出整数
        ps.println(3.14);  // 输出浮点数
        ps.println(true);  // 输出布尔值

        // 输出字符串
        ps.println("Hello, PrintStream!");

        // 输出对象（调用 toString 方法）
        ps.println(new Object());

        // 输出换行
        ps.println();
    }
}
```

- **解释**：
    - 使用 `PrintStream` 创建输出流对象，并指定目标文件路径。
    - `println()` 方法不仅可以输出基本数据类型，还可以自动添加换行符。
    - 继承`OutputStream`，且性能高效

#### 2. 控制台输出

- **作用**：`PrintStream` 也可以直接输出到控制台，`System.out` 是一个 `PrintStream` 对象。

```java
public class PrintStreamConsoleDemo {
    public static void main(String[] args) {
        PrintStream ps = System.out;
        
        // 输出基本数据类型
        ps.println(123);
        ps.println(3.14);
        ps.println(true);

        // 输出字符串
        ps.println("Hello, Console!");
    }
}
```

- **解释**：
    - `System.out` 是一个默认的 `PrintStream` 对象，它将输出内容打印到控制台。

### PrintWriter

#### 1. 创建 PrintWriter

- **作用**：`PrintWriter` 是字符流，与 `PrintStream` 类似，可以将内容输出到文件或控制台，但它是字符流，可以直接处理字符数据。

```java
public class PrintWriterDemo {
    public static void main(String[] args) throws Exception {
        // 创建 PrintWriter 输出流对象，指向目标文件
        PrintWriter pw = new PrintWriter("path/to/output/file.txt");

        // 输出基本数据类型
        pw.println(123);
        pw.println(3.14);
        pw.println(true);

        // 输出字符串
        pw.println("Hello, PrintWriter!");

        // 输出对象
        pw.println(new Object());

        // 输出换行
        pw.println();
        
        pw.close();  // 记得关闭流
    }
}
```

- **解释**：
    - 使用 `PrintWriter` 创建输出流对象，并指定目标文件路径。
    - `println()` 方法与 `PrintStream` 相似，可以输出多种数据类型并自动添加换行符。
    - 继承`Writer`，性能高效

#### 2. 控制台输出

- **作用**：`PrintWriter` 也可以输出到控制台，`System.out` 和 `System.err` 都是 `PrintWriter` 对象。

```java
public class PrintWriterConsoleDemo {
    public static void main(String[] args) {
        PrintWriter pw = new PrintWriter(System.out, true);  // 自动刷新

        // 输出基本数据类型
        pw.println(123);
        pw.println(3.14);
        pw.println(true);

        // 输出字符串
        pw.println("Hello, Console!");
    }
}
```

- **解释**：
    - 使用 `System.out` 或 `System.err` 创建 `PrintWriter` 对象，直接输出到控制台。
    - `true` 参数表示自动刷新，即每次写入数据后都会立即刷新缓冲区。

#### 3. 使用 PrintWriter 写入文件并自动刷新

```java
public class PrintWriterAutoFlushDemo {
    public static void main(String[] args) throws Exception {
        PrintWriter pw = new PrintWriter(new FileWriter("path/to/output/file.txt"), true);

        // 自动刷新
        pw.println("Hello, PrintWriter with auto flush!");

        // 写入更多内容
        pw.println(2025);

        // 无需手动调用 flush() 或 close()，因为是自动刷新
    }
}
```

- **解释**：
    - `true` 参数使得 `PrintWriter` 在每次写入数据后自动刷新缓冲区，无需手动调用 `flush()`。




###  `PrintStream` 和 `PrintWriter` 的区别

#### 字符流 vs 字节流

- **`PrintStream`** 是字节流，继承自 `OutputStream`，它用于输出字节数据。
- **`PrintWriter`** 是字符流，继承自 `Writer`，它用于输出字符数据。

虽然这两个类的功能相似，但是它们分别用于处理不同类型的数据：`PrintStream` 处理字节流，而 `PrintWriter` 处理字符流。因此：

- 如果你处理的是二进制数据（如图片、音频），你应该使用 `PrintStream`。
- 如果你处理的是文本数据，应该使用 `PrintWriter`，它能够更好地处理字符集编码和解码。

#### 编码支持

- **`PrintWriter`** 可以自动处理字符编码的问题。它会将字符编码转换成字节流，不需要额外的操作。
- **`PrintStream`** 只能处理字节数据，它没有直接的字符编码支持。如果你需要从 `PrintStream` 输出文本并指定编码，则需要额外指定编码（例如通过 `OutputStreamWriter` 来包裹 `PrintStream`）。
**示例**：

```java
import java.io.*;

public class PrintStreamWithEncodingDemo {
    public static void main(String[] args) throws Exception {
        // 创建文件输出流，输出到文件
        OutputStream fileOut = new FileOutputStream("path/to/output/file.txt");

        // 使用 OutputStreamWriter 包裹 PrintStream 来指定编码（例如UTF-8）
        OutputStreamWriter writer = new OutputStreamWriter(fileOut, "UTF-8");
        
        // 用 PrintStream 包裹 OutputStreamWriter
        PrintStream ps = new PrintStream(writer);

        // 输出数据，自动按照 UTF-8 编码
        ps.println("Hello, world! 你好，世界！");
        ps.println("PrintStream with UTF-8 encoding");

        // 关闭流
        ps.close();
    }
}

```

#### 自动刷新

- **`PrintWriter`** 具有自动刷新的功能，可以在每次调用 `println()`、`write()` 等方法时自动刷新缓冲区。如果需要控制是否自动刷新，可以通过构造函数来设置。
- **`PrintStream`** 不支持自动刷新，必须手动调用 `flush()`。

#### 异常处理

- **`PrintWriter`** 采用了非检查异常（`IOException`），它不会抛出 `IOException`，所有的错误都通过 `setError()` 标记。
- **`PrintStream`** 会抛出 `IOException`，并且你需要处理它。

##### 打印到控制台通常使用 `System.out`

在 Java 中，`System.out` 是 `PrintStream` 类型的对象，它是标准输出流（控制台输出）。因此，我们可以直接通过 `System.out.println()` 或 `System.out.print()` 来打印内容到控制台。

虽然 `PrintStream` 和 `PrintWriter` 在很多功能上是类似的，但是 `System.out` 作为一个输出流对象，它被定义为 `PrintStream` 类型，所以打印控制台的默认方式是使用 `System.out`。如果你需要使用 `PrintWriter` 进行控制台输出，可以创建一个新的 `PrintWriter` 对象并将其指向 `System.out`，如下面的代码所示：

```java
public class PrintWriterToConsoleDemo {
    public static void main(String[] args) {
        // 使用 PrintWriter 输出到控制台
        PrintWriter pw = new PrintWriter(System.out, true);  // 自动刷新

        // 输出基本数据类型
        pw.println(123);
        pw.println(3.14);
        pw.println(true);

        // 输出字符串
        pw.println("Hello, PrintWriter Console!");
    }
}
```

这段代码创建了一个 `PrintWriter` 对象，并将它绑定到 `System.out`。这样你就可以使用 `PrintWriter` 来打印到控制台了，但实际输出还是通过 `System.out` 完成的。


---


## 数据流

### 数据输出流

#### 1. 数据输出流 (`DataOutputStream`)

- **作用**：用于将基本数据类型（如 `int`、`byte`、`double`）和字符串数据以二进制形式写入文件。

```java
import java.io.DataOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class DataOutputStreamDemo {
    public static void main(String[] args) {
        try (DataOutputStream dos = new DataOutputStream(new FileOutputStream("data.dat"))) {
            dos.writeByte(34);  // 写入一个字节
            dos.writeUTF("你好");  // 写入一个UTF字符串
            dos.writeInt(3665);  // 写入一个整数
            dos.writeDouble(9.9);  // 写入一个双精度浮点数
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- **构造器**：
    
    - `DataOutputStream(OutputStream out)`：创建一个 `DataOutputStream`，并将其与输出流绑定。
- **方法**：
    
    - `writeByte(int v)`：写一个字节。
    - `writeUTF(String str)`：写一个 UTF 编码的字符串。
    - `writeInt(int v)`：写一个整数。
    - `writeDouble(double v)`：写一个双精度浮点数。
    - `flush()`：刷新缓冲区，将数据写入目标流。
    - `close()`：关闭流并释放资源。
- **特殊注意事项**：
    
    - 写入数据的顺序必须与读取时的顺序一致。
    - `writeUTF` 方法会将字符串转换为 UTF 编码格式存储，适合处理文本数据。
    - `flush()` 和 `close()` 方法可以确保数据被正确写入文件，避免数据丢失。

---

### 数据输入流

#### 2. 数据输入流 (`DataInputStream`)

- **作用**：用于从文件中读取基本数据类型和字符串数据。

```java
import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.IOException;

public class DataInputStreamDemo {
    public static void main(String[] args) {
        try (DataInputStream dis = new DataInputStream(new FileInputStream("data.dat"))) {
            System.out.println(dis.readByte());  // 读取一个字节
            System.out.println(dis.readUTF());  // 读取一个UTF字符串
            System.out.println(dis.readInt());  // 读取一个整数
            System.out.println(dis.readDouble());  // 读取一个双精度浮点数
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

- **构造器**：
    - `DataInputStream(InputStream in)`：创建一个 `DataInputStream`，并将其与输入流绑定。
- **方法**：
    - `readByte()`：读取一个字节。
    - `readUTF()`：读取一个 UTF 编码的字符串。
    - `readInt()`：读取一个整数。
    - `readDouble()`：读取一个双精度浮点数。
- **特殊注意事项**：
    - 读取数据的顺序必须与写入时的顺序一致。
    - `readUTF()` 会根据 UTF 编码读取字符串数据。

---



## IO框架（Apache Commons IO）

### **简介**

- **Commons-IO** 是 Apache 开源基金会提供的一组与 IO 操作相关的工具类库。它旨在简化和提升 Java IO 流的使用效率。通过使用 `Commons-IO`，开发者可以更轻松地进行文件处理、流操作等，避免重复代码的编写。

### **引入 Apache Commons IO 框架**

1. **创建 lib 文件夹**：在项目中创建一个名为 `lib` 的文件夹。
2. **将 commons-io-2.6.jar 复制到 lib 文件夹**：下载并将 `commons-io-2.6.jar` 文件复制到项目的 `lib` 文件夹中。
3. **添加 JAR 作为库**：右键点击 JAR 文件，选择 `Add as Library`，然后点击 `OK` 完成添加。
4. **在项目中使用**：在代码中导入相应的类，即可开始使用该库提供的功能。

### **Commons-IO 类库提供的功能**

#### **FileUtils 类方法**

- **copyFile**：复制文件。
    
    ```java
    public static void copyFile(File srcFile, File destFile)
    ```
    
    - 用途：将一个文件复制到另一个文件。
- **copyDirectory**：复制目录。
    
    ```java
    public static void copyDirectory(File srcDir, File destDir)
    ```
    
    - 用途：将一个目录及其中的所有文件复制到目标目录。
- **deleteDirectory**：删除目录。
    
    ```java
    public static void deleteDirectory(File directory)
    ```
    
    - 用途：删除指定的目录及其内容。
- **readFileToString**：将文件内容读取为字符串。
    
    ```java
    public static String readFileToString(File file, String encoding)
    ```
    
    - 用途：读取文件内容并返回字符串。
- **writeStringToFile**：将字符串写入文件。
    
    ```java
    public static void writeStringToFile(File file, String data, String charsetName, boolean append)
    ```
    
    - 用途：将字符串内容写入指定文件中，支持字符集和追加模式。

#### **IOUtils 类方法**

- **copy**：复制文件内容。
    
    ```java
    public static int copy(InputStream inputStream, OutputStream outputStream)
    ```
    
    - 用途：将输入流的数据复制到输出流。
- **copy**（重载版本）：复制文件。
    
    ```java
    public static int copy(Reader reader, Writer writer)
    ```
    
    - 用途：将字符流数据从一个源复制到目标。
- **write**：将字符串写入输出流。
    
    ```java
    public static void write(String data, OutputStream outputStream, String charsetName)
    ```
    
    - 用途：将字符串数据写入输出流。

### **JDK 自带的功能与 Commons IO 的对比**

- **Commons IO** 提供了更简洁、方便，功能丰富的文件操作方法，减少了代码冗余。

---


# 线程-Thread

#### 线程的创建方式

1. **继承Thread类**
    
    ```java
    class MyThread extends Thread {
        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + " is running");
        }
    }
    
    public class ThreadExample {
        public static void main(String[] args) {
            MyThread thread = new MyThread();
            thread.start(); // 启动线程
        }
    }
    ```
    
    - **注意**: `start()` 方法会启动新线程，而 `run()` 是线程的执行体，`run()` 是普通方法，不能直接调用它来启动线程。
    - 线程的执行顺序由操作系统的线程调度器控制，可能与代码的书写顺序不一致。
2. **实现Runnable接口**
    
    ```java
    class MyRunnable implements Runnable {
        @Override
        public void run() {
            System.out.println(Thread.currentThread().getName() + " is running");
        }
    }
    
    public class RunnableExample {
        public static void main(String[] args) {
            MyRunnable runnable = new MyRunnable();
            Thread thread = new Thread(runnable);
            thread.start(); // 启动线程
        }
    }
    ```
    
    **匿名内部类的写法**:
    
    ```java
    public class AnonymousRunnableExample {
        public static void main(String[] args) {
            Thread thread = new Thread(new Runnable() {
                @Override
                public void run() {
                    System.out.println(Thread.currentThread().getName() + " is running");
                }
            });
            thread.start();
        }
    }
    ```
    
    **使用Callable与Future获取返回值**:
    
    ```java
    import java.util.concurrent.*;
    
    public class CallableExample {
        public static void main(String[] args) throws ExecutionException, InterruptedException {
            ExecutorService executor = Executors.newSingleThreadExecutor();
            Callable<Integer> task = () -> {
                return 123;
            };
            Future<Integer> future = executor.submit(task);
            Integer result = future.get(); // 获取任务执行结果
            System.out.println("Result: " + result);
            executor.shutdown();
        }
    }
    ```
    

#### 线程安全

1. **synchronized关键字**
    
    - **同步方法**：
        
        ```java
        class Counter {
            private int count = 0;
        
            public synchronized void increment() {
                count++;
            }
        
            public synchronized int getCount() {
                return count;
            }
        }
        
        public class SynchronizedExample {
            public static void main(String[] args) throws InterruptedException {
                Counter counter = new Counter();
                Runnable task = () -> {
                    for (int i = 0; i < 1000; i++) {
                        counter.increment();
                    }
                };
                Thread thread1 = new Thread(task);
                Thread thread2 = new Thread(task);
                thread1.start();
                thread2.start();
                thread1.join();
                thread2.join();
                System.out.println("Final count: " + counter.getCount());
            }
        }
        ```
        
    - **同步代码块**：
        
        ```java
        class Counter {
            private int count = 0;
        
            public void increment() {
                synchronized (this) {  // 对当前对象加锁
                    count++;
                }
            }
        
            public int getCount() {
                return count;
            }
        }
        ```
        
2. **ReentrantLock**
    
    - `ReentrantLock` 提供了比 `synchronized` 更强大的功能，比如公平锁、可中断锁等。
        
    - **使用ReentrantLock**:
        
        ```java
        import java.util.concurrent.locks.Lock;
        import java.util.concurrent.locks.ReentrantLock;
        
        class Counter {
            private int count = 0;
            private Lock lock = new ReentrantLock();
        
            public void increment() {
                lock.lock();  // 获取锁
                try {
                    count++;
                } finally {
                    lock.unlock();  // 确保解锁
                }
            }
        
            public int getCount() {
                return count;
            }
        }
        
        public class LockExample {
            public static void main(String[] args) throws InterruptedException {
                Counter counter = new Counter();
                Runnable task = () -> {
                    for (int i = 0; i < 1000; i++) {
                        counter.increment();
                    }
                };
                Thread thread1 = new Thread(task);
                Thread thread2 = new Thread(task);
                thread1.start();
                thread2.start();
                thread1.join();
                thread2.join();
                System.out.println("Final count: " + counter.getCount());
            }
        }
        ```
        
    - **公平锁**:
        
        ```java
        Lock lock = new ReentrantLock(true);  // 参数为true表示公平锁
        ```
        
    - **可中断锁**:
        
        ```java
        lock.lockInterruptibly();  // 获取锁时支持中断
        ```
        

#### 线程池

1. **ExecutorService**与**ThreadPoolExecutor**
    
    - `ThreadPoolExecutor` 允许你定制线程池的行为，如核心线程数、最大线程数、线程空闲时间等。
        
    - **线程池的创建**:
        
        ```java
        import java.util.concurrent.*;
        
        public class ThreadPoolExample {
            public static void main(String[] args) throws InterruptedException {
                ExecutorService executor = new ThreadPoolExecutor(
                    2,  // 核心线程数
                    4,  // 最大线程数
                    60, // 线程空闲时间
                    TimeUnit.SECONDS,
                    new LinkedBlockingQueue<>(10)  // 任务队列
                );
        
                for (int i = 0; i < 20; i++) {
                    executor.submit(() -> {
                        try {
                            Thread.sleep(1000); // 模拟任务执行
                            System.out.println(Thread.currentThread().getName() + " is executing task");
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        }
                    });
                }
        
                executor.shutdown();  // 关闭线程池
            }
        }
        ```
        
    - **使用`Executors`创建线程池**:
        
        ```java
        ExecutorService executor = Executors.newFixedThreadPool(4); // 固定大小线程池
        executor.submit(() -> {
            System.out.println(Thread.currentThread().getName() + " is working");
        });
        executor.shutdown();
        ```
        
2. **线程池的拒绝策略**
    
    ```java
    ExecutorService executor = new ThreadPoolExecutor(
        2, 4, 60, TimeUnit.SECONDS,
        new LinkedBlockingQueue<>(2),  // 阻塞队列，最大存放2个任务
        new ThreadPoolExecutor.DiscardOldestPolicy()  // 丢弃最老的任务
    );
    ```
    
3. **线程池关闭**
    
    - `shutdown()` 会平滑关闭线程池，等待所有提交的任务执行完毕。
    - `shutdownNow()` 会尝试停止所有正在执行的任务，并返回尚未执行的任务列表。
    
    ```java
    executor.shutdown();  // 优雅关闭线程池
    if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
        executor.shutdownNow();  // 强制关闭线程池
    }
    ```
    

#### 实际应用中的线程池配置

1. **合理配置线程池参数**
    
    - `corePoolSize`：核心线程数。如果线程池的线程数小于这个数，线程池会创建新的线程。
    - `maximumPoolSize`：线程池最大线程数，线程池中最大可以同时执行的线程数。
    - `keepAliveTime`：线程空闲时间，超过这个时间的线程会被销毁。
2. **工作队列的选择**
    
    - **有界队列**（如 `ArrayBlockingQueue`）：可以防止任务过多时导致内存溢出。
    - **无界队列**（如 `LinkedBlockingQueue`）：线程池会不断扩展，直到达到最大线程数。

---

### 总结与实际应用

- **合理配置线程池**: 根据实际的任务类型和数量，选择合适的线程池配置，避免线程池资源耗尽。
- **线程池的动态调整**: 使用`ThreadPoolExecutor`时，可以动态调整线程池大小来适应不同的负载。
- **避免过度同步**: 在需要高并发的场景中，过度使用`synchronized`会影响性能，尽量使用`ReentrantLock`等高级锁机制。
- **线程池管理**: 一定要确保线程池的关闭操作，并考虑合适的任务拒绝策略。

---

、
# 网络环节


### 概念

#### 1. **IP地址**

- **定义**: IP地址（Internet Protocol Address）是设备在计算机网络中唯一标识符。每个联网设备都需要有一个IP地址才能进行通信。
- **分类**:
    - **公网IP**: 可直接连接到互联网的IP地址，通常由互联网服务提供商（ISP）分配。公网IP是全球唯一的，能够让设备与外部互联网进行通信。
    - **内网IP**: 局域网内部使用的IP地址（例如：192.168.x.x、10.x.x.x、172.16.x.x - 172.31.x.x），不能直接被互联网访问。内网IP通常通过路由器与公网IP进行地址转换（NAT）。
    - **本机IP**: 127.0.0.1（也叫`localhost`），指向本机的IP地址，常用于测试本地应用程序或连接服务。

#### 2. **端口**

- **定义**: 端口是用于标识设备内不同应用程序或服务的数字标识符。每个IP地址可以绑定多个端口，用来支持多个应用或服务。
- **分类**:
    - **周知端口（Well-Known Ports）**: 端口号范围是 0~1023，通常由系统或特定服务使用，例如：
        - HTTP: 80
        - FTP: 21
        - SMTP: 25
        - DNS: 53
    - **注册端口（Registered Ports）**: 端口号范围是 1024~49151，分配给应用程序和用户进程，用于一些特定的服务和程序。
    - **动态端口（Dynamic Ports）**: 端口号范围是 49152~65535，通常用于临时连接的分配，如客户端和服务器之间的临时通信端口。

#### 3. **协议**

- **定义**: 协议是一套网络中数据通信的规则和约定，决定了数据的格式、传输方式、错误校验等。常见的网络协议有TCP、UDP、HTTP、FTP等。
- **常见协议**:
    - **TCP**: 可靠传输协议，提供数据的顺序传输、数据完整性和重传机制。
    - **UDP**: 无连接、不可靠协议，适用于对实时性要求高但对可靠性要求低的场景（如视频流）。
    - **HTTP**: 超文本传输协议，用于浏览器与Web服务器之间的通信。
    - **FTP**: 文件传输协议，用于文件的上传和下载。

#### 4. **域名系统（DNS）**

- **定义**: DNS是一个将域名（如www.baidu.com）转换为IP地址的系统。因为IP地址难以记忆，DNS通过将域名映射到对应的IP地址，使得用户能够方便地访问网站。
- **工作原理**: 当用户输入域名时，DNS服务器会查询对应的IP地址并返回给客户端，客户端随后通过该IP地址建立连接。

#### 5. **IP常用命令**

- **ipconfig**: 用于Windows系统查看网络配置信息，包括IP地址、子网掩码、默认网关等。
    - 示例命令: `ipconfig /all`
- **InetAddress类（Java）**:
    - `getLocalHost()`: 获取本机的IP地址。
        
        ```java
        InetAddress localHost = InetAddress.getLocalHost();
        System.out.println(localHost.getHostAddress());
        ```
        
    - `getByName(String host)`: 获取指定主机的IP地址。
        
        ```java
        InetAddress address = InetAddress.getByName("www.baidu.com");
        System.out.println(address.getHostAddress());
        ```
        
    - `isReachable(int timeout)`: 判断主机是否可达，类似于ping命令。
        
        ```java
        boolean reachable = address.isReachable(1000);  // 1000ms 超时
        System.out.println("可达: " + reachable);
        ```
        

#### 6. **通信协议**

- **OSI模型与TCP/IP模型的对应关系**:
    - **应用层**: 处理应用程序的交互，OSI模型中的应用层、表示层和会话层都属于此层。比如HTTP、FTP、SMTP等。
    - **传输层**: 负责端到端的通信，OSI模型的传输层对应TCP/IP模型中的传输层。常见协议：TCP、UDP。
    - **网络层**: 负责路由选择、数据包转发。OSI模型的网络层对应IP协议。
    - **数据链路层+物理层**: 负责数据的传输与错误检测。TCP/IP模型将这两层合并称为“网络接口层”。

#### 7. **TCP与UDP协议**

- **UDP协议**:
    
    - **特点**: 无连接、不可靠通信。传输速度快，但无法保证数据是否按顺序到达，且不提供重传机制。
    - **用途**: 适用于实时传输应用（如VoIP、视频流、在线游戏）。
    - **数据包格式**:
        - UDP包包含源端口、目标端口、长度、校验和和数据部分。
        - 示例代码（Java）:
            
            ```java
            DatagramSocket socket = new DatagramSocket();
            byte[] message = "Hello, UDP!".getBytes();
            DatagramPacket packet = new DatagramPacket(message, message.length, InetAddress.getByName("localhost"), 8080);
            socket.send(packet);
            socket.close();
            ```
            
- **TCP协议**:
    
    - **特点**: 面向连接、可靠通信。通过三次握手建立连接，数据传输过程确保数据按顺序到达，并进行重传控制。
    - **用途**: 适用于对数据可靠性要求高的应用（如网页浏览、文件传输、电子邮件）。
    - **三次握手**:
        1. **客户端**发送SYN请求。
        2. **服务器**回应SYN-ACK。
        3. **客户端**发送ACK，连接建立。
    - **四次挥手**:
        1. **客户端**发送FIN，表示终止连接。
        2. **服务器**回应ACK，表示确认收到断开请求。
        3. **服务器**发送FIN，表示关闭连接。
        4. **客户端**回应ACK，连接完全断开。
    - 示例代码（Java）:
        
        ```java
        // TCP Client Example
        Socket socket = new Socket("localhost", 8080);
        PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
        out.println("Hello, Server!");
        socket.close();
        ```
        

#### 8. **TCP三次握手示例**

假设客户端与服务器建立TCP连接：

1. **客户端发送SYN**:
    - 客户端A发送一个SYN包给服务器B，表示请求建立连接。
    - 包含：SYN标志位、初始序列号（SEQ=X）等。
2. **服务器回应SYN-ACK**:
    - 服务器B收到客户端的SYN包后，发送一个SYN-ACK包作为回应。
    - 包含：SYN标志位、ACK标志位、确认号（ACK=X+1）、服务器的初始序列号（SEQ=Y）等。
3. **客户端发送ACK**:
    - 客户端A收到服务器B的SYN-ACK后，发送ACK包确认连接。
    - 包含：ACK标志位、确认号（ACK=Y+1）。

连接建立后，客户端和服务器可以开始数据传输。


---

## 协议的实现

### UDP Communication

#### UDP通信的实现

- **DatagramSocket 类** 用于创建客户端和服务端的Socket对象，支持UDP协议的通信。
    
    - **创建客户端：**
    
    ```java
    public DatagramSocket()  // 创建客户端的Socket对象，系统会随机分配端口号。
    public DatagramSocket(int port)  // 创建服务端的Socket对象，并指定端口号。
    ```
    
- **方法**
    
    - **send(DatagramPacket p)：** 用于发送数据包。
    - **receive(DatagramPacket p)：** 用于接收数据包。
- **DatagramPacket 类** 用于封装数据包，发送或接收数据。
    
    - **构造函数：**
    
    ```java
    public DatagramPacket(byte[] buf, int length, InetAddress address, int port)  // 创建用于发送的UDP数据包。
    public DatagramPacket(byte[] buf, int length)  // 创建用于接收数据的UDP数据包。
    ```
    
    - **示例：**
    
    ```java
    public static void main(String[] args) throws Exception {
        DatagramSocket socket = new DatagramSocket();
        byte[] bytes = "UDP协议".getBytes();
        DatagramPacket packet = new DatagramPacket(bytes, bytes.length, InetAddress.getByName("192.168.25.40"), 9876);
        socket.send(packet);
    }
    ```
    

#### UDP Server 示例：

```java
public static void main(String[] args) throws Exception {
    byte[] buf = new byte[1024];
    DatagramPacket packet = new DatagramPacket(buf, buf.length);
    DatagramSocket socket = new DatagramSocket();
    socket.receive(packet);

    int len = packet.getLength();  // 获取接收到的数据长度。
    String data = new String(buf, 0, len);  // 解析接收到的字节数据。
    System.out.println("服务端接收到: " + data);

    String ip = packet.getAddress().getHostAddress();
    int port = packet.getPort();  // 获取发送数据的端口号。
}
```

### TCP Communication

#### TCP通信的实现

- **TCP的特点：** 面向连接，可靠通信，数据包有序，发送数据前需要先建立连接（通过三次握手）,如果链接后有一方先下线会报错或者进入catch
- **实现：** Java提供了`java.net.Socket`类来实现TCP协议通信。

#### 客户端代码示例：

```java
public class ClientDemo1 {
    public static void main(String[] args) throws Exception {
        Socket socket = new Socket("127.0.0.1", 9999);  // 创建Socket连接到服务器
        OutputStream os = socket.getOutputStream();
        DataOutputStream dos = new DataOutputStream(os);

        dos.writeInt(1);  // 发送整数数据
        dos.writeUTF("我想你了，你在哪儿?");  // 发送UTF-8编码的字符串

        socket.close();  // 关闭Socket连接
    }
}
```

#### 服务器端代码示例：

```java
public class ServerDemo2 {
    public static void main(String[] args) throws Exception {
        ServerSocket ss = new ServerSocket(9999);  // 创建服务端Socket，监听端口9999
        Socket socket = ss.accept();  // 接受客户端的连接请求

        InputStream is = socket.getInputStream();
        DataInputStream dis = new DataInputStream(is);

        int id = dis.readInt();  // 接收整数数据
        String msg = dis.readUTF();  // 接收UTF-8编码的字符串

        System.out.println("客户端ID: " + id);
        System.out.println("客户端发送的信息: " + msg);

        System.out.println("客户端IP: " + socket.getInetAddress().getHostAddress());
        System.out.println("客户端端口号: " + socket.getPort());

        socket.close();  // 关闭连接
    }
}
```

### 总结

- **UDP** 是无连接的协议，适合对实时性要求较高、数据量小的应用，如视频直播、VoIP等。
- **TCP** 是面向连接的协议，适用于要求数据传输可靠的应用，如文件传输、HTTP等。


---

## BS架构

$$学了前端后会更好理解$$
### HTTP响应报文格式规范

#### 1. 基本结构
HTTP响应报文由以下几个部分组成：
- 状态行（第一行）
- 响应头（Header）
- 空行（必须）
- 响应正文（Body）

#### 2. 格式详解

##### 2.1 状态行
包含三个字段：
```
HTTP/1.1 200 OK
```
- 协议版本：HTTP/1.1
- 状态码：200
- 状态描述：OK

##### 2.2 响应头
由多个头部字段组成，每个字段占一行：
```
Content-Type: text/html; charset=UTF-8
```
常见的响应头字段：
- Content-Type：指定响应内容的类型和字符编码
- Content-Length：响应内容的长度
- Cache-Control：缓存控制
- Set-Cookie：设置Cookie
- Location：重定向地址

##### 2.3 空行
- 响应头和响应正文之间必须有一个空行
- 使用 \r\n（回车换行）分隔

##### 2.4 响应正文
- 实际返回给浏览器展示的数据内容
- 可以是HTML、JSON、图片等各种格式
- 格式由Content-Type指定

#### 3. 补充说明

##### 3.1 响应状态码
常见状态码：
- 2xx：成功
  - 200 OK：请求成功
  - 201 Created：已创建
- 3xx：重定向
  - 301 Moved Permanently：永久重定向
  - 302 Found：临时重定向
- 4xx：客户端错误
  - 400 Bad Request：请求语法错误
  - 404 Not Found：资源不存在
- 5xx：服务器错误
  - 500 Internal Server Error：服务器内部错误
  - 503 Service Unavailable：服务不可用

##### 3.2 最佳实践
1. 正确设置Content-Type
   - 确保浏览器能正确解析响应内容
   - 设置正确的字符编码，避免乱码

2. 规范响应格式
   - 严格遵守HTTP协议规范
   - 保证响应头与响应体之间有空行
   - 使用标准的换行符(\r\n)

3. 合理使用状态码
   - 准确反映响应状态
   - 有助于客户端正确处理响应

4. 注意安全头部
   - 设置安全相关的响应头
   - 如：X-Frame-Options、Content-Security-Policy等


---
# 日期--字符串--防止丢失精度的api


1. 日期时间处理 (LocalDateTime)
```java
// 获取当前日期时间
LocalDateTime now = LocalDateTime.now();

// 日期时间操作
LocalDateTime now2 = now.plusSeconds(60); // 增加60秒

// 格式化日期时间
DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss EEE a");
String result2 = dtf.format(now);
```

2. 字符串拼接优化
```java
// 使用 StringBuilder 进行字符串拼接以提高性能
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000000; i++) {
    sb.append("abc");
}
```

3. BigDecimal精确计算
```java
// 创建BigDecimal对象的推荐方式
BigDecimal a1 = BigDecimal.valueOf(0.1);
BigDecimal b1 = BigDecimal.valueOf(0.2);

// 计算操作
BigDecimal c1 = a1.add(b1);
double result = c1.doubleValue();

// 除法操作（包含精度控制和舍入模式）
BigDecimal i = BigDecimal.valueOf(0.1);
BigDecimal j = BigDecimal.valueOf(0.3);
BigDecimal k = i.divide(j, 2, BigDecimal.ROUND_HALF_UP); // 保留2位小数，四舍五入
```

重要注意点：
1. 处理日期时间推荐使用LocalDateTime而不是旧的Date类
2. 大量字符串拼接操作使用StringBuilder而不是String直接相加
3. 涉及金额计算等精确计算场景必须使用BigDecimal
4. BigDecimal创建推荐使用valueOf方法而不是构造函数
5. BigDecimal的除法运算必须指定精度和舍入模式，否则可能抛出异常

补充说明：
- BigDecimal提供了完整的数学运算API：add(加)、subtract(减)、multiply(乘)、divide(除)
- BigDecimal的divide操作一定要设置精度(scale)和舍入模式(RoundingMode)，避免无限小数情况
- 在需要精确计算的场景（如金融计算）中，避免使用float和double，应该使用BigDecimal

为什么推荐使用 BigDecimal.valueOf() 而不是构造函数：

1. 精度问题
```java
// 使用构造函数
BigDecimal a1 = new BigDecimal(0.1);
System.out.println(a1); 
// 输出：0.1000000000000000055511151231257827021181583404541015625

// 使用valueOf
BigDecimal a2 = BigDecimal.valueOf(0.1);
System.out.println(a2); 
// 输出：0.1
```

这是因为：
- 使用构造函数 `new BigDecimal(double)` 会保留 double 类型的全部精度，包括由于二进制浮点数表示导致的误差
- 而 `BigDecimal.valueOf(double)` 内部会先将 double 转换为 String，然后再创建 BigDecimal，这样可以避免 double 类型固有的精度问题

2. 性能优化
```java
// valueOf 方法内部实现（简化版）
public static BigDecimal valueOf(double val) {
    // 对常用的值进行缓存
    if (val == 0.0) {
        return ZERO;
    }
    return new BigDecimal(Double.toString(val));
}
```

valueOf 方法有以下优势：
- 对于常用值（如 0、1 等）会使用缓存，避免重复创建对象
- 通过 Double.toString() 转换可以得到最优的字符串表示，避免不必要的精度

3. 推荐的创建方式
```java
// 最佳实践
BigDecimal b1 = BigDecimal.valueOf(0.1);        // 从 double 创建
BigDecimal b2 = new BigDecimal("0.1");          // 从 String 创建，精确控制
BigDecimal b3 = BigDecimal.valueOf(10L);        // 从 long 创建
```

总结：
- 使用 valueOf() 可以避免浮点数精度问题
- valueOf() 通过缓存机制提供更好的性能
- 如果需要精确的数值，可以使用字符串构造函数 new BigDecimal(String)
- 处理整数时，可以使用 BigDecimal.valueOf(long) 或 new BigDecimal(int/long)

---

# 注解(Annotation)

## 一、注解的基本概念
1. 注解可以应用在:
   - 类上
   - 构造器上  
   - 方法上
   - 成员变量上
  
2. 注解的简化写法:
   ```java
   @MyBook(name = "java", age = 13, address = {"上海", "北京"})
   ```
   - 有默认值的属性可以省略
   - 如果只剩value属性可以省略属性名
   - value是第一个属性也可以省略
   - 比如默认值省略后只有value，这时value可以省略属性名

## 二、注解的原理
1. 注解本质是一个接口,Java中所有注解都继承了Annotation接口
2. 定义示例:
   ```java
   public @interface MyTest1 {
       String aaa();
       boolean bbb();
       String[] ccc();
   }
   ```

3. 注解使用示例:
   ```java
   @MyTest1(aaa = "李四", bbb=true, ccc={"Go", "Python"})
   public void test(){}
   ```

## 三、元注解
1. @Target - 指定注解使用位置
   - TYPE: 类、接口
   - FIELD: 成员变量  
   - METHOD: 方法
   - PARAMETER: 参数
   - CONSTRUCTOR: 构造器
   - LOCAL_VARIABLE: 局部变量

2. @Retention - 定义注解保留策略
   - SOURCE: 仅在源码阶段,编译后消失
   - CLASS: 保留到字节码,运行时不存在
   - RUNTIME: 运行期仍然存在(最常用)

## 四、注解的解析步骤

### 解析类上的注解:
```java
// 1. 获取类对象
Class c1 = Demo.class;

// 2. 判断是否存在注解
if (c1.isAnnotationPresent(MyTest2.class)) {

    // 3. 获取注解对象
    MyTest2 myTest2 = (MyTest2)c1.getAnnotation(MyTest2.class);
    
    // 4. 获取注解属性
    String[] address = myTest2.address();
    double height = myTest2.height();
    String value = myTest2.value();
    
    // 5. 处理注解信息
    System.out.println(address);  
    System.out.println(height);
}
```

### 解析方法上的注解:
```java
// 1. 获取类对象
Class c1 = Demo.class;

// 2. 获取方法对象
Method method = c1.getMethod("name: go");

// 3. 判断注解是否存在
if (method.isAnnotationPresent(MyTest2.class)) {

    // 4. 获取注解对象
    MyTest2 myTest2 = method.getDeclaredAnnotation(MyTest2.class);
    
    // 5. 获取注解属性
    String[] address = myTest2.address();
    double height = myTest2.height();
    String value = myTest2.value();
    
    // 6. 输出注解信息
    System.out.println(Arrays.toString(address));
    System.out.println(height);
}
```

## 五、注解的工作原理
1. **元数据**：注解本质上是一种元数据，可以附加到类、方法、字段或构造函数上。在Java中使用@interface关键字定义，并可包含可选的元素(属性)。

2. **处理机制**：当Java程序运行时，通过反射机制访问这些注解，并根据注解内容执行相应操作。在Spring框架中，注解主要用于配置组件和定义行为。

3. **处理器**：Spring框架内部有注解处理器组件，在应用程序启动时扫描带有特定注解的类和方法，根据注解内容进行处理。



## 六、注解的高级用法

1. **默认值的设置**：
    
    - 可以在注解中为元素设置默认值，减少使用时的书写。
        
        ```java
        public @interface MyTest2 {
            String value() default "default value";  // 默认值
            int number() default 0;
        }
        ```
        
    - 使用时可以省略默认值的属性：
        
        ```java
        @MyTest2(value = "Hello")  // 只传递不带默认值的参数
        public void test() {}
        ```
        
2. **注解继承**：
    
    - 注解本身不能继承其他注解，但可以通过 `@Inherited` 元注解让注解继承。
        
        ```java
        @Inherited
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.TYPE)
        public @interface MyInheritedAnnotation {}
        ```
        
3. **注解的组合**：
    
    - 可以通过组合多个注解来给一个元素添加多个功能。
        
        ```java
        @MyTest1
        @MyTest2
        public void testMethod() {}
        ```
        
4. **注解与反射的结合**：
    
    - 注解在 Java 中通常和反射一起使用，通过反射可以动态地获取类、方法、字段上的注解并执行特定的逻辑。

### 补充

1. **注解与泛型**：
    
    - 注解可以使用在泛型类或方法上，但需要注意泛型信息在编译时会被擦除，可能影响反射获取注解时的行为。
2. **自定义注解处理器**：
    
    - 你可以通过 `AnnotationProcessor` 处理器在编译期间对注解进行处理（用于编译时注解处理）。
3. **注解的性能**：
    
    - 注解本身并不影响性能，但反射机制和动态代理可能会对性能产生影响，尤其是在注解使用频繁的场景中。


## 注意事项
1. 类的注解获取时需要强制类型转换
2. 方法的注解获取可以直接使用
3. 使用反射API获取注解时需要考虑异常处理


---
