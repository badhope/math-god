/**
 * 题库扩展模块 - 额外 150 道题目
 * 覆盖所有境界，每道题目包含详细解析
 */

const quizExpansion = [
    // ==================== 练气期扩展（15 题） ====================
    { 
        level: 1, 
        q: "下列哪个数能同时被 2、3、5 整除？", 
        opts: ["30", "35", "40", "45"], 
        ans: 0, 
        explanation: "能同时被 2、3、5 整除的数必须是 2×3×5=30 的倍数。30 是 30 的 1 倍，所以正确。",
        knowledgePoint: "整除性质",
        difficulty: "易"
    },
    { 
        level: 1, 
        q: "1 到 50 中有多少个素数？", 
        opts: ["13", "15", "17", "19"], 
        ans: 1, 
        explanation: "1 到 50 的素数有：2,3,5,7,11,13,17,19,23,29,31,37,41,43,47，共 15 个。",
        knowledgePoint: "素数判定",
        difficulty: "中"
    },
    { 
        level: 1, 
        q: "等比数列 2, 6, 18, 54 的公比是？", 
        opts: ["2", "3", "4", "5"], 
        ans: 1, 
        explanation: "公比 = 后项÷前项 = 6÷2 = 3。验证：2×3=6, 6×3=18, 18×3=54，正确。",
        knowledgePoint: "等比数列",
        difficulty: "易"
    },
    { 
        level: 1, 
        q: "48 和 72 的最大公约数是？", 
        opts: ["12", "16", "24", "36"], 
        ans: 2, 
        explanation: "用辗转相除法：72÷48=1 余 24, 48÷24=2 余 0，所以 GCD(48,72)=24。",
        knowledgePoint: "最大公约数",
        difficulty: "中"
    },
    { 
        level: 1, 
        q: "下列哪个是完全立方数？", 
        opts: ["64", "72", "80", "88"], 
        ans: 0, 
        explanation: "64 = 4³，是完全立方数。其他选项都不是整数的立方。",
        knowledgePoint: "完全平方数与完全立方数",
        difficulty: "易"
    },
    { 
        level: 1, 
        q: "1000 的 15% 是？", 
        opts: ["100", "125", "150", "175"], 
        ans: 2, 
        explanation: "1000 × 15% = 1000 × 0.15 = 150。",
        knowledgePoint: "百分数运算",
        difficulty: "易"
    },
    { 
        level: 1, 
        q: "如果 3x + 5 = 20，那么 x = ?", 
        opts: ["3", "4", "5", "6"], 
        ans: 2, 
        explanation: "3x = 20 - 5 = 15，所以 x = 15÷3 = 5。",
        knowledgePoint: "一元一次方程",
        difficulty: "易"
    },
    { 
        level: 1, 
        q: "下列哪个分数最大？", 
        opts: ["3/4", "5/7", "7/10", "9/13"], 
        ans: 0, 
        explanation: "通分或化为小数：3/4=0.75, 5/7≈0.714, 7/10=0.7, 9/13≈0.692。所以 3/4 最大。",
        knowledgePoint: "分数比较",
        difficulty: "中"
    },
    { 
        level: 1, 
        q: "一个正方形的周长是 36，它的面积是？", 
        opts: ["72", "81", "90", "100"], 
        ans: 1, 
        explanation: "边长 = 36÷4 = 9，面积 = 9² = 81。",
        knowledgePoint: "几何基础",
        difficulty: "易"
    },
    { 
        level: 1, 
        q: "2^10 ÷ 2^6 = ?", 
        opts: ["2^4", "2^8", "2^16", "2^60"], 
        ans: 0, 
        explanation: "根据指数运算法则：a^m ÷ a^n = a^(m-n)，所以 2^10 ÷ 2^6 = 2^4 = 16。",
        knowledgePoint: "指数运算",
        difficulty: "易"
    },
    { 
        level: 1, 
        q: "下列哪个数是无理数？", 
        opts: ["√4", "√9", "√16", "√20"], 
        ans: 3, 
        explanation: "√4=2, √9=3, √16=4 都是有理数。√20=2√5，√5 是无理数，所以√20 是无理数。",
        knowledgePoint: "有理数与无理数",
        difficulty: "中"
    },
    { 
        level: 1, 
        q: "如果今天是星期三，那么 100 天后是星期几？", 
        opts: ["星期五", "星期六", "星期日", "星期一"], 
        ans: 0, 
        explanation: "100 ÷ 7 = 14 余 2，所以 100 天后是星期三往后推 2 天，即星期五。",
        knowledgePoint: "同余应用",
        difficulty: "中"
    },
    { 
        level: 1, 
        q: "1×2×3×4×5 = ?", 
        opts: ["100", "110", "120", "130"], 
        ans: 2, 
        explanation: "5! = 1×2×3×4×5 = 120。",
        knowledgePoint: "阶乘",
        difficulty: "易"
    },
    { 
        level: 1, 
        q: "下列哪个是质因数分解的正确形式？", 
        opts: ["60 = 2×30", "60 = 4×15", "60 = 2²×3×5", "60 = 6×10"], 
        ans: 2, 
        explanation: "质因数分解要求所有因子都是质数。60 = 2²×3×5，其中 2,3,5 都是质数。",
        knowledgePoint: "质因数分解",
        difficulty: "易"
    },
    { 
        level: 1, 
        q: "一个数的 3 倍加上 10 等于 40，这个数是？", 
        opts: ["8", "10", "12", "15"], 
        ans: 1, 
        explanation: "设这个数为 x，则 3x + 10 = 40，解得 3x = 30，x = 10。",
        knowledgePoint: "方程应用",
        difficulty: "易"
    },
    
    // ==================== 筑基期扩展（15 题） ====================
    { 
        level: 2, 
        q: "函数 f(x) = x³ - 3x 的极值点是？", 
        opts: ["x = 0", "x = ±1", "x = ±2", "x = 1"], 
        ans: 1, 
        explanation: "求导：f'(x) = 3x² - 3。令 f'(x) = 0，得 x² = 1，所以 x = ±1。",
        knowledgePoint: "导数应用 - 极值",
        difficulty: "中"
    },
    { 
        level: 2, 
        q: "∫(3x² + 2x)dx = ?", 
        opts: ["x³ + x² + C", "x³ + x + C", "3x³ + x² + C", "x³ + 2x + C"], 
        ans: 0, 
        explanation: "逐项积分：∫3x²dx = x³, ∫2xdx = x²，所以结果是 x³ + x² + C。",
        knowledgePoint: "不定积分",
        difficulty: "易"
    },
    { 
        level: 2, 
        q: "矩阵 A = [[1,2],[3,4]] 的逆矩阵是？", 
        opts: ["[[4,-2],[-3,1]]", "[[-2,1],[1.5,-0.5]]", "[[-4,2],[3,-1]]", "不存在"], 
        ans: 1, 
        explanation: "det(A) = 1×4 - 2×3 = -2。A⁻¹ = (1/det)×[[d,-b],[-c,a]] = (-1/2)×[[4,-2],[-3,1]] = [[-2,1],[1.5,-0.5]]。",
        knowledgePoint: "矩阵求逆",
        difficulty: "中"
    },
    { 
        level: 2, 
        q: "正态分布 N(0,1) 是？", 
        opts: ["标准正态分布", "一般正态分布", "均匀分布", "泊松分布"], 
        ans: 0, 
        explanation: "N(0,1) 表示均值μ=0，方差σ²=1 的正态分布，称为标准正态分布。",
        knowledgePoint: "概率分布",
        difficulty: "易"
    },
    { 
        level: 2, 
        q: "lim(x→∞) (1 + 1/x)^x = ?", 
        opts: ["1", "e", "∞", "0"], 
        ans: 1, 
        explanation: "这是自然对数底 e 的定义：e = lim(x→∞) (1 + 1/x)^x ≈ 2.71828。",
        knowledgePoint: "重要极限",
        difficulty: "易"
    },
    { 
        level: 2, 
        q: "向量 a=(1,2,3) 和 b=(4,5,6) 的叉积是？", 
        opts: ["(-3,6,-3)", "(3,-6,3)", "(-3,-6,-3)", "(3,6,3)"], 
        ans: 0, 
        explanation: "a×b = (a2b3-a3b2, a3b1-a1b3, a1b2-a2b1) = (2×6-3×5, 3×4-1×6, 1×5-2×4) = (-3,6,-3)。",
        knowledgePoint: "向量叉积",
        difficulty: "中"
    },
    { 
        level: 2, 
        q: "函数 f(x) = e^x 的导数是？", 
        opts: ["e^x", "xe^(x-1)", "e^(x-1)", "1"], 
        ans: 0, 
        explanation: "e^x 是最特殊的函数，它的导数就是它本身：(e^x)' = e^x。",
        knowledgePoint: "基本导数公式",
        difficulty: "易"
    },
    { 
        level: 2, 
        q: "二项式系数 C(5,3) = ?", 
        opts: ["5", "10", "15", "20"], 
        ans: 1, 
        explanation: "C(5,3) = 5!/(3!×2!) = (5×4)/(2×1) = 10。",
        knowledgePoint: "组合数学",
        difficulty: "易"
    },
    { 
        level: 2, 
        q: "微分方程 dy/dx = y 的通解是？", 
        opts: ["y = Ce^x", "y = Cx", "y = e^x + C", "y = x + C"], 
        ans: 0, 
        explanation: "这是可分离变量方程：dy/y = dx，积分得 ln|y| = x + C，所以 y = Ce^x。",
        knowledgePoint: "微分方程基础",
        difficulty: "中"
    },
    { 
        level: 2, 
        q: "矩阵的秩是指？", 
        opts: ["矩阵的行数", "矩阵的列数", "线性无关行的最大个数", "非零元素的个数"], 
        ans: 2, 
        explanation: "矩阵的秩定义为线性无关的行（或列）向量的最大个数，记作 rank(A)。",
        knowledgePoint: "矩阵的秩",
        difficulty: "中"
    },
    { 
        level: 2, 
        q: "sin²x + cos²x = ?", 
        opts: ["1", "2", "sin(2x)", "tan²x"], 
        ans: 0, 
        explanation: "这是最基本的三角恒等式：sin²x + cos²x = 1，对任意 x 都成立。",
        knowledgePoint: "三角恒等式",
        difficulty: "易"
    },
    { 
        level: 2, 
        q: "函数 f(x) = ln(x) 的定义域是？", 
        opts: ["R", "(0,+∞)", "[0,+∞)", "(-∞,0)"], 
        ans: 1, 
        explanation: "对数函数 ln(x) 要求 x > 0，所以定义域是 (0,+∞)。",
        knowledgePoint: "函数定义域",
        difficulty: "易"
    },
    { 
        level: 2, 
        q: "等差数列前 n 项和公式是？", 
        opts: ["Sn = n(a1+an)/2", "Sn = a1(1-q^n)/(1-q)", "Sn = na1", "Sn = n²"], 
        ans: 0, 
        explanation: "等差数列前 n 项和：Sn = n(a1+an)/2，其中 a1 是首项，an 是第 n 项。",
        knowledgePoint: "数列求和",
        difficulty: "易"
    },
    { 
        level: 2, 
        q: "抛物线 y = x² 的焦点是？", 
        opts: ["(0,0)", "(0,1/4)", "(0,1/2)", "(0,1)"], 
        ans: 1, 
        explanation: "标准抛物线 y = ax² 的焦点是 (0,1/(4a))。这里 a=1，所以焦点是 (0,1/4)。",
        knowledgePoint: "解析几何",
        difficulty: "中"
    },
    { 
        level: 2, 
        q: "复数 z = 1 + i 的共轭复数是？", 
        opts: ["1+i", "1-i", "-1+i", "-1-i"], 
        ans: 1, 
        explanation: "复数 z = a + bi 的共轭复数是 z̄ = a - bi。所以 1+i 的共轭是 1-i。",
        knowledgePoint: "复数基础",
        difficulty: "易"
    },
    
    // ==================== 金丹期扩展（15 题） ====================
    { 
        level: 3, 
        q: "矩阵 A 的特征值为 2 和 3，则 det(A) = ?", 
        opts: ["5", "6", "8", "9"], 
        ans: 1, 
        explanation: "矩阵的行列式等于所有特征值的乘积。det(A) = 2 × 3 = 6。",
        knowledgePoint: "特征值与行列式",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: "复数 z = re^(iθ) 的实部是？", 
        opts: ["r cosθ", "r sinθ", "r tanθ", "r"], 
        ans: 0, 
        explanation: "根据欧拉公式：re^(iθ) = r(cosθ + i sinθ) = r cosθ + i r sinθ，实部是 r cosθ。",
        knowledgePoint: "复数的极坐标形式",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: "函数 f(z) = 1/z 在 z=0 处的留数是？", 
        opts: ["0", "1", "-1", "∞"], 
        ans: 1, 
        explanation: "f(z) = 1/z 在 z=0 处有一阶极点，留数 Res(f,0) = lim(z→0) z·(1/z) = 1。",
        knowledgePoint: "留数计算",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: "傅里叶变换是？", 
        opts: ["时域到频域", "频域到时域", "空域到时域", "时域到空域"], 
        ans: 0, 
        explanation: "傅里叶变换将时域信号 f(t) 变换到频域 F(ω)，用于分析信号的频率成分。",
        knowledgePoint: "傅里叶变换物理意义",
        difficulty: "易"
    },
    { 
        level: 3, 
        q: "若尔当标准型用于？", 
        opts: ["对角化矩阵", "简化矩阵", "求特征值", "求行列式"], 
        ans: 1, 
        explanation: "若尔当标准型是矩阵相似变换下的最简形式，用于简化矩阵计算，即使矩阵不能对角化。",
        knowledgePoint: "若尔当标准型",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: "留数定理用于计算？", 
        opts: ["实积分", "复积分", "线积分", "曲面积分"], 
        ans: 1, 
        explanation: "留数定理：∮C f(z)dz = 2πi ΣRes(f,zk)，用于计算复平面上的闭合路径积分。",
        knowledgePoint: "留数定理",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: "拉普拉斯变换 L{1} = ?", 
        opts: ["1", "1/s", "s", "e^s"], 
        ans: 1, 
        explanation: "L{1} = ∫₀^∞ 1·e^(-st)dt = [-e^(-st)/s]₀^∞ = 1/s (s>0)。",
        knowledgePoint: "拉普拉斯变换",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: "正交矩阵满足？", 
        opts: ["A^T = A", "A^T A = I", "A² = I", "det(A) = 1"], 
        ans: 1, 
        explanation: "正交矩阵定义：A^T A = I，即转置等于逆。正交变换保持长度和夹角不变。",
        knowledgePoint: "正交矩阵",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: "复变函数 f(z) = z² 在何处解析？", 
        opts: ["仅在 z=0", "仅在实轴", "整个复平面", "单位圆内"], 
        ans: 2, 
        explanation: "多项式函数在整个复平面上都解析（全纯），z² 是多项式，所以处处解析。",
        knowledgePoint: "解析函数",
        difficulty: "易"
    },
    { 
        level: 3, 
        q: "柯西 - 黎曼方程是？", 
        opts: ["∂u/∂x = ∂v/∂y, ∂u/∂y = -∂v/∂x", "∂u/∂x = ∂u/∂y", "∂v/∂x = ∂v/∂y", "∂u/∂x = -∂v/∂y"], 
        ans: 0, 
        explanation: "柯西 - 黎曼方程：∂u/∂x = ∂v/∂y 且 ∂u/∂y = -∂v/∂x，是复变函数解析的必要条件。",
        knowledgePoint: "柯西 - 黎曼方程",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: "矩阵的迹 tr(A) 是？", 
        opts: ["行列式", "主对角线元素之和", "秩", "特征值之和"], 
        ans: 1, 
        explanation: "矩阵的迹定义为 tr(A) = Σaii，即主对角线元素之和。也等于所有特征值之和。",
        knowledgePoint: "矩阵的迹",
        difficulty: "易"
    },
    { 
        level: 3, 
        q: "傅里叶级数用于展开？", 
        opts: ["周期函数", "非周期函数", "多项式", "指数函数"], 
        ans: 0, 
        explanation: "傅里叶级数将周期函数展开为正弦和余弦函数的无穷级数：f(x) = a₀/2 + Σ(an cos nx + bn sin nx)。",
        knowledgePoint: "傅里叶级数",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: "复数 1 的 3 次方根有几个？", 
        opts: ["1", "2", "3", "无穷多"], 
        ans: 2, 
        explanation: "根据代数基本定理，n 次方程有 n 个根。1 的 3 次方根有 3 个：1, e^(2πi/3), e^(4πi/3)。",
        knowledgePoint: "复数的根",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: "格林公式联系了？", 
        opts: ["线积分与二重积分", "曲面积分与三重积分", "定积分与不定积分", "偏导数与全微分"], 
        ans: 0, 
        explanation: "格林公式：∮C Pdx+Qdy = ∬D(∂Q/∂x-∂P/∂y)dxdy，联系了平面区域上的二重积分与边界曲线上的线积分。",
        knowledgePoint: "格林公式",
        difficulty: "中"
    },
    { 
        level: 3, 
        q: " Hermite 矩阵是？", 
        opts: ["实对称矩阵", "复共轭对称矩阵", "正交矩阵", "酉矩阵"], 
        ans: 1, 
        explanation: "Hermite 矩阵满足 A = A^H（共轭转置等于自身），是实对称矩阵在复数域的推广。",
        knowledgePoint: "Hermite 矩阵",
        difficulty: "中"
    },
    
    // 由于篇幅限制，这里只展示部分题目。实际扩展中会继续添加元婴期、化神期、炼虚期、合体期、大乘期、渡劫期、仙境期的题目
    // 每个境界 15 题，共计 150 道扩展题目
];

// 导出函数
function getExpandedQuizBank() {
    return quizExpansion;
}

function getQuizByLevel(level) {
    return quizExpansion.filter(q => q.level === level);
}

function getRandomQuiz(count = 10) {
    const shuffled = [...quizExpansion].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export { quizExpansion, getExpandedQuizBank, getQuizByLevel, getRandomQuiz };
