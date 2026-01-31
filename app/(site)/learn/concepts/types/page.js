/*markdownlint-disable MD046*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import LearnLayout from '@/components/LearnLayout';
import MermaidDiagram from '@/components/MermaidDiagram';
import MemoryLayout3D from '@/components/MemoryLayout3D';
export const metadata = {
  title: '数据类型 - Vision-RS',
  description: 'Rust 的标量类型与复合类型详解'
};
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h1: "h1",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  };
  return _jsxs(_Fragment, {
    children: ["\n", "\n", "\n", _jsxs(LearnLayout, {
      children: [_jsx(_components.h1, {
        id: "数据类型",
        children: _jsx(_components.a, {
          href: "#数据类型",
          children: "数据类型"
        })
      }), _jsxs(_components.p, {
        children: ["Rust 是", _jsx(_components.strong, {
          children: "静态类型"
        }), "（statically typed）语言，编译时必须知道所有变量的类型。"]
      }), _jsx(_components.h2, {
        id: "类型系统概览",
        children: _jsx(_components.a, {
          href: "#类型系统概览",
          children: "类型系统概览"
        })
      }), _jsx(MermaidDiagram, {
        chart: `
graph TD
  A[Rust 类型系统] --> B[标量类型<br/>Scalar Types]
  A --> C[复合类型<br/>Compound Types]

  B --> B1[整数<br/>Integers]
  B --> B2[浮点数<br/>Floats]
  B --> B3[布尔<br/>Boolean]
  B --> B4[字符<br/>Character]

  C --> C1[元组<br/>Tuple]
  C --> C2[数组<br/>Array]

  B1 --> B1A[有符号: i8, i16, i32, i64, i128, isize]
  B1 --> B1B[无符号: u8, u16, u32, u64, u128, usize]

  B2 --> B2A[f32: 单精度]
  B2 --> B2B[f64: 双精度]

  style B fill:#8aadf4,stroke:#8aadf4,color:#24273a
  style C fill:#a6da95,stroke:#a6da95,color:#24273a

`
      }), _jsx(_components.h2, {
        id: "标量类型",
        children: _jsx(_components.a, {
          href: "#标量类型",
          children: "标量类型"
        })
      }), _jsxs(_components.p, {
        children: ["标量类型代表", _jsx(_components.strong, {
          children: "单个值"
        }), "。Rust 有四种主要的标量类型："]
      }), _jsx(_components.h3, {
        id: "1-整数类型",
        children: _jsx(_components.a, {
          href: "#1-整数类型",
          children: "1. 整数类型"
        })
      }), _jsx(_components.p, {
        children: "整数是没有小数部分的数字："
      }), _jsxs(_components.table, {
        children: [_jsx(_components.thead, {
          children: _jsxs(_components.tr, {
            children: [_jsx(_components.th, {
              children: "长度"
            }), _jsx(_components.th, {
              children: "有符号"
            }), _jsx(_components.th, {
              children: "无符号"
            }), _jsx(_components.th, {
              children: "范围（有符号）"
            }), _jsx(_components.th, {
              children: "范围（无符号）"
            })]
          })
        }), _jsxs(_components.tbody, {
          children: [_jsxs(_components.tr, {
            children: [_jsx(_components.td, {
              children: "8-bit"
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "i8"
              })
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "u8"
              })
            }), _jsx(_components.td, {
              children: "-128 ~ 127"
            }), _jsx(_components.td, {
              children: "0 ~ 255"
            })]
          }), _jsxs(_components.tr, {
            children: [_jsx(_components.td, {
              children: "16-bit"
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "i16"
              })
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "u16"
              })
            }), _jsx(_components.td, {
              children: "-32,768 ~ 32,767"
            }), _jsx(_components.td, {
              children: "0 ~ 65,535"
            })]
          }), _jsxs(_components.tr, {
            children: [_jsx(_components.td, {
              children: "32-bit"
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "i32"
              })
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "u32"
              })
            }), _jsx(_components.td, {
              children: "-2³¹ ~ 2³¹-1"
            }), _jsx(_components.td, {
              children: "0 ~ 2³²-1"
            })]
          }), _jsxs(_components.tr, {
            children: [_jsx(_components.td, {
              children: "64-bit"
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "i64"
              })
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "u64"
              })
            }), _jsx(_components.td, {
              children: "-2⁶³ ~ 2⁶³-1"
            }), _jsx(_components.td, {
              children: "0 ~ 2⁶⁴-1"
            })]
          }), _jsxs(_components.tr, {
            children: [_jsx(_components.td, {
              children: "128-bit"
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "i128"
              })
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "u128"
              })
            }), _jsx(_components.td, {
              children: "-2¹²⁷ ~ 2¹²⁷-1"
            }), _jsx(_components.td, {
              children: "0 ~ 2¹²⁸-1"
            })]
          }), _jsxs(_components.tr, {
            children: [_jsx(_components.td, {
              children: "arch"
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "isize"
              })
            }), _jsx(_components.td, {
              children: _jsx(_components.code, {
                children: "usize"
              })
            }), _jsx(_components.td, {
              children: "取决于架构"
            }), _jsx(_components.td, {
              children: "取决于架构"
            })]
          })]
        })]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let a: i32 = -42;         // 有符号 32 位\n    let b: u32 = 42;          // 无符号 32 位\n    let c = 98_222;           // 默认 i32\n    let d: isize = 100;       // 平台相关（64位系统 = i64）\n\n    // 整数字面量\n    let decimal = 98_222;      // 十进制\n    let hex = 0xff;            // 十六进制\n    let octal = 0o77;          // 八进制\n    let binary = 0b1111_0000;  // 二进制\n    let byte = b'A';           // 字节（仅限 u8）\n}\n"
        })
      }), _jsxs(_components.p, {
        children: [_jsx(_components.strong, {
          children: "整数溢出"
        }), "："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let mut x: u8 = 255;\n    // x = x + 1;  // Debug 模式：panic!\n                   // Release 模式：溢出回绕（wrap around）为 0\n\n    // 显式处理溢出\n    let y = x.wrapping_add(1);      // 256 → 0\n    let z = x.checked_add(1);       // 返回 Option<u8>: None\n    let w = x.saturating_add(1);    // 饱和为 255\n    let o = x.overflowing_add(1);   // 返回 (值, 是否溢出)\n}\n"
        })
      }), _jsx(_components.h3, {
        id: "2-浮点类型",
        children: _jsx(_components.a, {
          href: "#2-浮点类型",
          children: "2. 浮点类型"
        })
      }), _jsxs(_components.p, {
        children: ["Rust 有两种浮点类型：", _jsx(_components.code, {
          children: "f32"
        }), "（单精度）和 ", _jsx(_components.code, {
          children: "f64"
        }), "（双精度，", _jsx(_components.strong, {
          children: "默认"
        }), "）："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let x = 2.0;        // f64（默认）\n    let y: f32 = 3.0;   // f32\n\n    // 浮点运算\n    let sum = 5.0 + 10.0;\n    let difference = 95.5 - 4.3;\n    let product = 4.0 * 30.0;\n    let quotient = 56.7 / 32.2;\n\n    // 特殊值\n    let inf = f64::INFINITY;\n    let neg_inf = f64::NEG_INFINITY;\n    let nan = f64::NAN;\n\n    println!(\"NaN == NaN? {}\", nan == nan);  // false!\n}\n"
        })
      }), _jsxs(_components.p, {
        children: ["⚠️ ", _jsx(_components.strong, {
          children: "注意"
        }), "：浮点数遵循 IEEE-754 标准，可能有精度问题。"]
      }), _jsx(_components.h3, {
        id: "3-布尔类型",
        children: _jsx(_components.a, {
          href: "#3-布尔类型",
          children: "3. 布尔类型"
        })
      }), _jsxs(_components.p, {
        children: ["布尔类型只有两个值：", _jsx(_components.code, {
          children: "true"
        }), " 和 ", _jsx(_components.code, {
          children: "false"
        }), "，占用 1 字节："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let t = true;\n    let f: bool = false;\n\n    // 常用于条件语句\n    if t {\n        println!(\"这是真的！\");\n    }\n\n    // 布尔运算\n    let and = true && false;   // false\n    let or = true || false;    // true\n    let not = !true;           // false\n}\n"
        })
      }), _jsx(_components.h3, {
        id: "4-字符类型",
        children: _jsx(_components.a, {
          href: "#4-字符类型",
          children: "4. 字符类型"
        })
      }), _jsxs(_components.p, {
        children: [_jsx(_components.code, {
          children: "char"
        }), " 类型代表一个 Unicode 标量值，占用 ", _jsx(_components.strong, {
          children: "4 字节"
        }), "："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let c = 'z';\n    let z: char = 'ℤ';\n    let heart_eyed_cat = '😻';\n    let chinese = '中';\n\n    println!(\"Size of char: {} bytes\", std::mem::size_of::<char>());  // 4\n\n    // char 是 Unicode 标量值\n    let emoji = '🦀';  // Rust 的吉祥物 Ferris！\n}\n"
        })
      }), _jsxs(_components.p, {
        children: [_jsx(_components.strong, {
          children: "char vs 字符串"
        }), "："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let c: char = 'A';          // 单个 Unicode 字符，4 字节\n    let s: &str = \"A\";          // 字符串切片，1 字节（UTF-8 编码）\n\n    // char 可以包含任何 Unicode\n    let rustacean = '🦀';       // ✅ 合法\n    // let invalid = '🦀😻';    // ❌ 编译错误：char 只能是单个字符\n}\n"
        })
      }), _jsx(_components.h2, {
        id: "复合类型",
        children: _jsx(_components.a, {
          href: "#复合类型",
          children: "复合类型"
        })
      }), _jsx(_components.p, {
        children: "复合类型可以将多个值组合成一个类型。"
      }), _jsx(_components.h3, {
        id: "1-元组tuple",
        children: _jsx(_components.a, {
          href: "#1-元组tuple",
          children: "1. 元组（Tuple）"
        })
      }), _jsxs(_components.p, {
        children: ["元组可以组合", _jsx(_components.strong, {
          children: "不同类型"
        }), "的值："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let tup: (i32, f64, u8) = (500, 6.4, 1);\n\n    // 解构（destructuring）\n    let (x, y, z) = tup;\n    println!(\"y 的值: {}\", y);  // 6.4\n\n    // 通过索引访问\n    let five_hundred = tup.0;\n    let six_point_four = tup.1;\n    let one = tup.2;\n\n    // 单元类型（unit type）\n    let unit = ();  // 空元组，大小为 0 字节\n}\n"
        })
      }), _jsxs(_components.p, {
        children: [_jsx(_components.strong, {
          children: "元组的内存布局"
        }), "："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let tuple: (u8, u16, u8) = (1, 2, 3);\n    println!(\"Size: {} bytes\", std::mem::size_of_val(&tuple));  // 6 bytes（可能有填充）\n}\n"
        })
      }), _jsx(MemoryLayout3D, {
        scenario: "stack"
      }), _jsx(_components.h3, {
        id: "2-数组array",
        children: _jsx(_components.a, {
          href: "#2-数组array",
          children: "2. 数组（Array）"
        })
      }), _jsxs(_components.p, {
        children: ["数组中的所有元素必须是", _jsx(_components.strong, {
          children: "相同类型"
        }), "，且", _jsx(_components.strong, {
          children: "长度固定"
        }), "："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    // 数组声明\n    let a = [1, 2, 3, 4, 5];\n    let b: [i32; 5] = [1, 2, 3, 4, 5];  // 类型标注：[类型; 长度]\n\n    // 初始化相同值\n    let c = [3; 5];  // [3, 3, 3, 3, 3]\n\n    // 访问元素\n    let first = a[0];\n    let second = a[1];\n\n    // 数组是栈分配的\n    println!(\"数组大小: {} bytes\", std::mem::size_of_val(&a));  // 20 bytes (5 * 4)\n}\n"
        })
      }), _jsxs(_components.p, {
        children: [_jsx(_components.strong, {
          children: "数组 vs Vec"
        }), "："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    // 数组：固定长度，栈分配\n    let arr = [1, 2, 3, 4, 5];\n    // arr.push(6);  // ❌ 编译错误：数组不能改变长度\n\n    // Vec：动态长度，堆分配\n    let mut vec = vec![1, 2, 3, 4, 5];\n    vec.push(6);  // ✅ 可以增长\n}\n"
        })
      }), _jsxs(_components.p, {
        children: [_jsx(_components.strong, {
          children: "越界访问"
        }), "："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let a = [1, 2, 3, 4, 5];\n\n    // let index = 10;\n    // let element = a[index];  // ⚠️ 运行时 panic!（而非编译错误）\n    //                           // thread 'main' panicked at 'index out of bounds'\n\n    // 安全访问\n    match a.get(10) {\n        Some(value) => println!(\"值: {}\", value),\n        None => println!(\"索引越界\"),\n    }\n}\n"
        })
      }), _jsx(_components.h2, {
        id: "切片类型",
        children: _jsx(_components.a, {
          href: "#切片类型",
          children: "切片类型"
        })
      }), _jsxs(_components.p, {
        children: ["切片（slice）是对连续序列的引用，", _jsx(_components.strong, {
          children: "没有所有权"
        }), "："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let a = [1, 2, 3, 4, 5];\n\n    // 切片\n    let slice: &[i32] = &a[1..3];  // [2, 3]\n\n    println!(\"切片: {:?}\", slice);\n\n    // 字符串切片\n    let s = String::from(\"hello world\");\n    let hello: &str = &s[0..5];    // \"hello\"\n    let world: &str = &s[6..11];   // \"world\"\n}\n"
        })
      }), _jsx(_components.h2, {
        id: "类型转换",
        children: _jsx(_components.a, {
          href: "#类型转换",
          children: "类型转换"
        })
      }), _jsxs(_components.p, {
        children: ["Rust ", _jsx(_components.strong, {
          children: "不会"
        }), "隐式转换数值类型："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let x: i32 = 10;\n    // let y: i64 = x;  // ❌ 编译错误：类型不匹配\n\n    // 必须显式转换\n    let y: i64 = x as i64;  // ✅ 使用 as 关键字\n\n    // 转换可能截断\n    let a: i32 = 1000;\n    let b: u8 = a as u8;  // 232（溢出，取低 8 位）\n\n    println!(\"b = {}\", b);\n}\n"
        })
      }), _jsxs(_components.p, {
        children: [_jsx(_components.strong, {
          children: "安全转换"
        }), "："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let x: i32 = 1000;\n\n    // 使用 try_into（需要 use std::convert::TryInto）\n    use std::convert::TryInto;\n\n    let y: Result<u8, _> = x.try_into();\n    match y {\n        Ok(val) => println!(\"转换成功: {}\", val),\n        Err(_) => println!(\"转换失败：值超出范围\"),\n    }\n}\n"
        })
      }), _jsx(_components.h2, {
        id: "类型别名",
        children: _jsx(_components.a, {
          href: "#类型别名",
          children: "类型别名"
        })
      }), _jsxs(_components.p, {
        children: ["使用 ", _jsx(_components.code, {
          children: "type"
        }), " 关键字创建类型别名："]
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "type Kilometers = i32;\n\nfn main() {\n    let distance: Kilometers = 100;\n    let another: i32 = 50;\n\n    // Kilometers 和 i32 完全相同\n    let total = distance + another;  // ✅ 可以相加\n}\n"
        })
      }), _jsx(_components.h2, {
        id: "类型推导",
        children: _jsx(_components.a, {
          href: "#类型推导",
          children: "类型推导"
        })
      }), _jsx(_components.p, {
        children: "Rust 的类型推导非常强大："
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    // 从使用方式推导\n    let mut v = Vec::new();  // 类型未知\n\n    v.push(1);  // 现在编译器知道 v 是 Vec<i32>\n\n    // 从返回类型推导\n    let x = \"42\".parse().expect(\"Not a number!\");  // ❌ 编译错误：类型不明确\n\n    let x: i32 = \"42\".parse().expect(\"Not a number!\");  // ✅ 明确类型\n}\n"
        })
      }), _jsx(_components.h2, {
        id: "内存大小",
        children: _jsx(_components.a, {
          href: "#内存大小",
          children: "内存大小"
        })
      }), _jsx(_components.p, {
        children: "查看类型的内存大小："
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "use std::mem;\n\nfn main() {\n    println!(\"i32: {} bytes\", mem::size_of::<i32>());    // 4\n    println!(\"f64: {} bytes\", mem::size_of::<f64>());    // 8\n    println!(\"bool: {} bytes\", mem::size_of::<bool>());  // 1\n    println!(\"char: {} bytes\", mem::size_of::<char>());  // 4\n\n    println!(\"(i32, f64, u8): {} bytes\",\n        mem::size_of::<(i32, f64, u8)>());  // 16（有对齐填充）\n\n    println!(\"[i32; 10]: {} bytes\",\n        mem::size_of::<[i32; 10]>());  // 40\n}\n"
        })
      }), _jsx(_components.h2, {
        id: "实践建议",
        children: _jsx(_components.a, {
          href: "#实践建议",
          children: "实践建议"
        })
      }), _jsx(_components.h3, {
        id: "-推荐做法",
        children: _jsx(_components.a, {
          href: "#-推荐做法",
          children: "✅ 推荐做法"
        })
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    // 1. 使用类型推导（除非有歧义）\n    let count = 42;  // 清晰，推导为 i32\n\n    // 2. 在需要时标注类型\n    let parsed: i64 = \"100\".parse().unwrap();\n\n    // 3. 使用 usize/isize 作为索引和大小\n    let arr = [1, 2, 3];\n    for i in 0..arr.len() {  // len() 返回 usize\n        println!(\"{}\", arr[i]);\n    }\n\n    // 4. 优先使用 f64 而不是 f32\n    let pi = 3.14159;  // 默认 f64，精度更高\n}\n"
        })
      }), _jsx(_components.h3, {
        id: "-避免做法",
        children: _jsx(_components.a, {
          href: "#-避免做法",
          children: "❌ 避免做法"
        })
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    // ❌ 过度标注类型（类型推导已足够）\n    let x: i32 = 5;\n    let y: i32 = 10;\n    let sum: i32 = x + y;\n\n    // ❌ 不必要的类型转换\n    let a: i32 = 10;\n    let b: i32 = a as i32;  // 多余\n\n    // ❌ 混用不同整数类型\n    let x: i32 = 10;\n    let y: i64 = 20;\n    // let z = x + y;  // ❌ 需要显式转换\n}\n"
        })
      }), _jsx(_components.h2, {
        id: "练习题",
        children: _jsx(_components.a, {
          href: "#练习题",
          children: "练习题"
        })
      }), _jsx(_components.h3, {
        id: "练习-1计算内存占用",
        children: _jsx(_components.a, {
          href: "#练习-1计算内存占用",
          children: "练习 1：计算内存占用"
        })
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let data = (42u8, 3.14f64, 'A', [1i32, 2, 3]);\n    // 问：data 占用多少字节？\n}\n"
        })
      }), _jsxs("details", {
        children: [_jsx("summary", {
          children: "查看答案"
        }), _jsx(_components.pre, {
          children: _jsx(_components.code, {
            className: "language-rust",
            children: "use std::mem;\n\nfn main() {\n    let data = (42u8, 3.14f64, 'A', [1i32, 2, 3]);\n    println!(\"{} bytes\", mem::size_of_val(&data));  // 32 bytes\n    // u8(1) + padding(7) + f64(8) + char(4) + [i32;3](12) = 32\n}\n"
          })
        })]
      }), _jsx(_components.h3, {
        id: "练习-2类型转换",
        children: _jsx(_components.a, {
          href: "#练习-2类型转换",
          children: "练习 2：类型转换"
        })
      }), _jsx(_components.p, {
        children: "修复以下代码："
      }), _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-rust",
          children: "fn main() {\n    let x: u8 = 255;\n    let y: u16 = x;\n    println!(\"{}\", y);\n}\n"
        })
      }), _jsxs("details", {
        children: [_jsx("summary", {
          children: "查看答案"
        }), _jsx(_components.pre, {
          children: _jsx(_components.code, {
            className: "language-rust",
            children: "fn main() {\n    let x: u8 = 255;\n    let y: u16 = x as u16;  // 显式转换\n    println!(\"{}\", y);  // 255\n}\n"
          })
        })]
      }), _jsx(_components.h2, {
        id: "小结",
        children: _jsx(_components.a, {
          href: "#小结",
          children: "小结"
        })
      }), _jsxs(_components.ul, {
        children: ["\n", _jsxs(_components.li, {
          children: ["✅ Rust 是", _jsx(_components.strong, {
            children: "静态类型"
          }), "语言，编译时确定类型"]
        }), "\n", _jsxs(_components.li, {
          children: ["✅ ", _jsx(_components.strong, {
            children: "标量类型"
          }), "：整数、浮点数、布尔、字符"]
        }), "\n", _jsxs(_components.li, {
          children: ["✅ ", _jsx(_components.strong, {
            children: "复合类型"
          }), "：元组、数组"]
        }), "\n", _jsxs(_components.li, {
          children: ["✅ 整数默认 ", _jsx(_components.code, {
            children: "i32"
          }), "，浮点数默认 ", _jsx(_components.code, {
            children: "f64"
          })]
        }), "\n", _jsxs(_components.li, {
          children: ["✅ ", _jsx(_components.code, {
            children: "char"
          }), " 是 ", _jsx(_components.strong, {
            children: "4 字节"
          }), "的 Unicode 标量值"]
        }), "\n", _jsxs(_components.li, {
          children: ["✅ 数组长度", _jsx(_components.strong, {
            children: "固定"
          }), "，栈分配；Vec 长度", _jsx(_components.strong, {
            children: "动态"
          }), "，堆分配"]
        }), "\n", _jsxs(_components.li, {
          children: ["✅ ", _jsx(_components.strong, {
            children: "不会"
          }), "隐式类型转换，使用 ", _jsx(_components.code, {
            children: "as"
          }), " 显式转换"]
        }), "\n", _jsxs(_components.li, {
          children: ["✅ 使用 ", _jsx(_components.code, {
            children: "std::mem::size_of"
          }), " 查看类型大小"]
        }), "\n"]
      }), _jsxs(_components.p, {
        children: ["下一步，我们将深入学习 Rust 的", _jsx(_components.strong, {
          children: "所有权系统"
        }), "。"]
      })]
    })]
  });
}
export default function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
