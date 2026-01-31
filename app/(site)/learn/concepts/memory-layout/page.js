import {jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import LearnLayout from '@/components/LearnLayout';
import MemoryLayout3D from '@/components/MemoryLayout3D';
export const metadata = {
  title: '内存布局 - Vision-RS',
  description: 'Rust 的内存布局与对齐'
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
    ul: "ul",
    ...props.components
  };
  return _jsxs(LearnLayout, {
    children: [_jsx(_components.h1, {
      id: "内存布局",
      children: _jsx(_components.a, {
        href: "#内存布局",
        children: "内存布局"
      })
    }), _jsx(_components.p, {
      children: "理解 Rust 如何在内存中组织数据是编写高效代码的关键。"
    }), _jsx(_components.h2, {
      id: "基本类型的大小",
      children: _jsx(_components.a, {
        href: "#基本类型的大小",
        children: "基本类型的大小"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use std::mem;\n\nfn main() {\n    println!(\"bool: {} bytes\", mem::size_of::<bool>());      // 1\n    println!(\"i32: {} bytes\", mem::size_of::<i32>());        // 4\n    println!(\"i64: {} bytes\", mem::size_of::<i64>());        // 8\n    println!(\"f64: {} bytes\", mem::size_of::<f64>());        // 8\n    println!(\"char: {} bytes\", mem::size_of::<char>());      // 4\n    println!(\"&i32: {} bytes\", mem::size_of::<&i32>());      // 8 (64位系统)\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "结构体布局",
      children: _jsx(_components.a, {
        href: "#结构体布局",
        children: "结构体布局"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "#[repr(C)]  // 使用 C 语言的布局规则\nstruct Point {\n    x: i32,  // 4 bytes\n    y: i32,  // 4 bytes\n}  // 总共 8 bytes\n\n#[repr(C)]\nstruct MixedStruct {\n    a: u8,   // 1 byte\n    // 填充 3 bytes\n    b: u32,  // 4 bytes\n    c: u16,  // 2 bytes\n    // 填充 2 bytes\n}  // 总共 12 bytes（有对齐）\n\nfn main() {\n    println!(\"Point: {} bytes\", mem::size_of::<Point>());\n    println!(\"MixedStruct: {} bytes\", mem::size_of::<MixedStruct>());\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "内存对齐",
      children: _jsx(_components.a, {
        href: "#内存对齐",
        children: "内存对齐"
      })
    }), _jsx(_components.p, {
      children: "Rust 会自动添加填充（padding）以满足对齐要求："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "struct Aligned {\n    a: u8,   // 1 byte\n    // 填充 7 bytes\n    b: u64,  // 8 bytes\n    c: u8,   // 1 byte\n    // 填充 7 bytes\n}  // 24 bytes（不是 10 bytes！）\n\n// 优化布局：将大字段放在前面\nstruct Optimized {\n    b: u64,  // 8 bytes\n    a: u8,   // 1 byte\n    c: u8,   // 1 byte\n    // 填充 6 bytes\n}  // 16 bytes\n"
      })
    }), _jsx(_components.h2, {
      id: "枚举的布局",
      children: _jsx(_components.a, {
        href: "#枚举的布局",
        children: "枚举的布局"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "enum Message {\n    Quit,                       // 0 bytes\n    Move { x: i32, y: i32 },    // 8 bytes\n    Write(String),              // 24 bytes\n}\n\n// 枚举大小 = 判别式(discriminant) + 最大变体的大小\n// 约 32 bytes（24 + 8 判别式 + 对齐）\n\nfn main() {\n    println!(\"Message: {} bytes\", mem::size_of::<Message>());\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "零大小类型zst",
      children: _jsx(_components.a, {
        href: "#零大小类型zst",
        children: "零大小类型（ZST）"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "struct Unit;\nstruct Empty {}\n\nfn main() {\n    println!(\"Unit: {} bytes\", mem::size_of::<Unit>());    // 0\n    println!(\"Empty: {} bytes\", mem::size_of::<Empty>());  // 0\n    println!(\"(): {} bytes\", mem::size_of::<()>());        // 0\n}\n"
      })
    }), _jsx(_components.p, {
      children: "ZST 的优势："
    }), _jsxs(_components.ul, {
      children: ["\n", _jsx(_components.li, {
        children: "不占用内存"
      }), "\n", _jsx(_components.li, {
        children: "编译器可以优化掉"
      }), "\n"]
    }), _jsx(_components.h2, {
      id: "3d-内存布局可视化",
      children: _jsx(_components.a, {
        href: "#3d-内存布局可视化",
        children: "3D 内存布局可视化"
      })
    }), _jsx(MemoryLayout3D, {
      scenario: "stack"
    }), _jsx(_components.h2, {
      id: "胖指针",
      children: _jsx(_components.a, {
        href: "#胖指针",
        children: "胖指针"
      })
    }), _jsx(_components.p, {
      children: "某些类型的引用包含额外元数据："
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    // 普通引用：1 个指针\n    let x: i32 = 42;\n    let r: &i32 = &x;\n    println!(\"&i32: {} bytes\", mem::size_of_val(&r));  // 8\n\n    // 切片引用：指针 + 长度\n    let arr = [1, 2, 3, 4, 5];\n    let slice: &[i32] = &arr;\n    println!(\"&[i32]: {} bytes\", mem::size_of_val(&slice));  // 16\n\n    // trait 对象：指针 + vtable 指针\n    let b: &dyn std::fmt::Debug = &42;\n    println!(\"&dyn Debug: {} bytes\", mem::size_of_val(&b));  // 16\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "表示优化",
      children: _jsx(_components.a, {
        href: "#表示优化",
        children: "表示优化"
      })
    }), _jsx(_components.h3, {
      id: "optiont-优化",
      children: _jsxs(_components.a, {
        href: "#optiont-优化",
        children: [_jsx(_components.code, {
          children: "Option<&T>"
        }), " 优化"]
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "fn main() {\n    println!(\"Option<&i32>: {} bytes\",\n        mem::size_of::<Option<&i32>>());  // 8（不是 16！）\n\n    println!(\"&i32: {} bytes\",\n        mem::size_of::<&i32>());  // 8\n}\n"
      })
    }), _jsxs(_components.p, {
      children: ["Rust 利用引用不能为 NULL 的特性，用 NULL 表示 ", _jsx(_components.code, {
        children: "None"
      }), "。"]
    }), _jsx(_components.h3, {
      id: "非零类型",
      children: _jsx(_components.a, {
        href: "#非零类型",
        children: "非零类型"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "use std::num::NonZeroU32;\n\nfn main() {\n    println!(\"Option<u32>: {} bytes\",\n        mem::size_of::<Option<u32>>());  // 8\n\n    println!(\"Option<NonZeroU32>: {} bytes\",\n        mem::size_of::<Option<NonZeroU32>>());  // 4\n}\n"
      })
    }), _jsx(_components.h2, {
      id: "内存布局属性",
      children: _jsx(_components.a, {
        href: "#内存布局属性",
        children: "内存布局属性"
      })
    }), _jsx(_components.pre, {
      children: _jsx(_components.code, {
        className: "language-rust",
        children: "// 使用 C 布局\n#[repr(C)]\nstruct CLayout {\n    a: u8,\n    b: u32,\n}\n\n// 紧凑布局（移除填充）\n#[repr(packed)]\nstruct Packed {\n    a: u8,\n    b: u32,\n}  // 5 bytes（危险：未对齐访问）\n\n// 透明布局（单字段）\n#[repr(transparent)]\nstruct Wrapper(u32);\n"
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
        children: "// 1. 将大字段放在前面以减少填充\n#[repr(C)]\nstruct Optimized {\n    large: u64,   // 8 bytes\n    medium: u32,  // 4 bytes\n    small: u8,    // 1 byte\n    // 只需填充 3 bytes\n}\n\n// 2. 使用 #[repr(C)] 与 C 互操作\n#[repr(C)]\nstruct FFIStruct {\n    x: i32,\n    y: i32,\n}\n\n// 3. 检查大小和对齐\nconst _: () = assert!(mem::size_of::<MyStruct>() == 16);\n"
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
        children: "// ❌ 不必要的 #[repr(packed)]\n#[repr(packed)]\nstruct Bad {\n    a: u32,  // 未对齐访问可能很慢\n}\n\n// ❌ 忽略内存布局\n// 在性能关键的代码中应该考虑布局\nstruct Unoptimized {\n    a: u8,   // 1 byte\n    b: u64,  // 填充 7 bytes\n    c: u8,   // 填充 7 bytes\n}  // 浪费 14 bytes\n"
      })
    }), _jsx(_components.h2, {
      id: "小结",
      children: _jsx(_components.a, {
        href: "#小结",
        children: "小结"
      })
    }), _jsxs(_components.ul, {
      children: ["\n", _jsx(_components.li, {
        children: "✅ 不同类型有不同的内存大小"
      }), "\n", _jsx(_components.li, {
        children: "✅ 结构体会有对齐填充"
      }), "\n", _jsx(_components.li, {
        children: "✅ 优化字段顺序可以减少内存使用"
      }), "\n", _jsx(_components.li, {
        children: "✅ ZST 不占用内存"
      }), "\n", _jsx(_components.li, {
        children: "✅ Rust 对某些类型做了表示优化"
      }), "\n", _jsxs(_components.li, {
        children: ["✅ 使用 ", _jsx(_components.code, {
          children: "mem::size_of"
        }), " 检查大小"]
      }), "\n"]
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
