/**
 * 名人堂系统模块
 * 包含：详细人物介绍、分类检索、个性化推荐
 */

const hallOfFameData = [
    {
        id: 1,
        name: "高斯",
        title: "数学王子",
        era: "公元前 1777-1855",
        country: "德国",
        category: "数学家",
        avatar: "🧮",
        coverImage: "📐",
        biography: "约翰·卡尔·弗里德里希·高斯，德国著名数学家、物理学家、天文学家。他从小就展现出惊人的数学天赋，3 岁时就能纠正父亲的计算错误，10 岁时发现了等差数列求和公式。高斯在数论、代数、几何、天文学、物理学等多个领域都有杰出贡献，被誉为'数学王子'。",
        achievements: [
            { name: "数论研究", desc: "创立现代数论，著有《算术研究》", year: "1801" },
            { name: "代数基本定理", desc: "证明了代数基本定理", year: "1799" },
            { name: "正态分布", desc: "发现正态分布曲线（高斯分布）", year: "1809" },
            { name: "最小二乘法", desc: "发明最小二乘法用于天文计算", year: "1795" },
            { name: "非欧几何", desc: "发现非欧几何的可能性", year: "1816" }
        ],
        events: [
            { year: "1777", event: "出生于德国不伦瑞克" },
            { year: "1787", event: "10 岁发现等差数列求和公式" },
            { year: "1795", event: "进入哥廷根大学学习" },
            { year: "1799", event: "证明代数基本定理，获博士学位" },
            { year: "1801", event: "发表《算术研究》，奠定数论基础" },
            { year: "1809", event: "发表天体运动理论" },
            { year: "1855", event: "在哥廷根去世，享年 77 岁" }
        ],
        quotes: [
            "数学是科学的皇后，数论是数学的皇后。",
            "给我最大快乐的，不是已懂得知识，而是不断的学习；不是已有的东西，而是不断的获取；不是已达到的高度，而是继续不断的攀登。"
        ],
        influence: "高斯的工作影响了整个 19 世纪的数学发展，他的名字出现在 100 多个数学定理和概念中。月球上有一个环形山以他的名字命名。",
        relatedPeople: [2, 3, 5],
        difficulty: 1,
        views: 15234,
        likes: 8923
    },
    {
        id: 2,
        name: "牛顿",
        title: "经典力学之父",
        era: "1643-1727",
        country: "英国",
        category: "数学家",
        avatar: "🍎",
        coverImage: "🔭",
        biography: "艾萨克·牛顿，英国物理学家、数学家、天文学家。1665-1666 年伦敦大瘟疫期间，牛顿回到家乡，在这短短 18 个月里，他发明了微积分、发现了万有引力定律、奠定了光学基础，这被称为'奇迹年'。他的《自然哲学的数学原理》是科学史上最重要的著作之一。",
        achievements: [
            { name: "微积分", desc: "独立发明微积分（与莱布尼茨同时）", year: "1666" },
            { name: "万有引力", desc: "发现万有引力定律", year: "1687" },
            { name: "运动定律", desc: "建立经典力学三大定律", year: "1687" },
            { name: "光学研究", desc: "发明反射望远镜，研究光的本质", year: "1668" }
        ],
        events: [
            { year: "1643", event: "出生于英国林肯郡" },
            { year: "1661", event: "进入剑桥大学三一学院" },
            { year: "1665-1666", event: "奇迹年：发明微积分、发现引力" },
            { year: "1687", event: "发表《自然哲学的数学原理》" },
            { year: "1703", event: "当选英国皇家学会会长" },
            { year: "1727", event: "去世，葬于威斯敏斯特教堂" }
        ],
        quotes: [
            "如果我看得更远，那是因为我站在巨人的肩膀上。",
            "我不知道世人怎样看我，但我自己以为我不过像一个在海边玩耍的孩子。"
        ],
        influence: "牛顿的经典力学统治了物理学 200 多年，直到爱因斯坦相对论的出现。他的微积分是现代科学的基础工具。",
        relatedPeople: [1, 3],
        difficulty: 2,
        views: 18567,
        likes: 9834
    },
    {
        id: 3,
        name: "欧拉",
        title: "分析学的化身",
        era: "1707-1783",
        country: "瑞士",
        category: "数学家",
        avatar: "📐",
        coverImage: "∫",
        biography: "莱昂哈德·欧拉，瑞士数学家、物理学家。他是史上最多产的数学家，全集达 75 卷。欧拉 20 多岁就成名，晚年双目失明，但仍靠心算和惊人的记忆力继续研究。他创立了图论，发展了复变函数论，建立了变分法，完善了现代数学符号体系。",
        achievements: [
            { name: "图论", desc: "解决哥尼斯堡七桥问题，创立图论", year: "1736" },
            { name: "复变函数", desc: "发展复变函数理论", year: "1748" },
            { name: "变分法", desc: "建立变分法基础", year: "1744" },
            { name: "数学符号", desc: "引入 f(x)、e、i、π等符号", year: "1734" }
        ],
        events: [
            { year: "1707", event: "出生于瑞士巴塞尔" },
            { year: "1720", event: "13 岁进入巴塞尔大学" },
            { year: "1727", event: "前往圣彼得堡科学院" },
            { year: "1736", event: "解决哥尼斯堡七桥问题" },
            { year: "1766", event: "返回圣彼得堡，完全失明" },
            { year: "1783", event: "在研究中去世，享年 76 岁" }
        ],
        quotes: [
            "欧拉公式 e^(iπ)+1=0 被誉为'上帝创造的公式'。"
        ],
        influence: "欧拉的名字出现在数学的各个领域，有 80 多个概念以他命名。他的工作为现代数学奠定了基础。",
        relatedPeople: [1, 2, 4],
        difficulty: 3,
        views: 12456,
        likes: 7654
    },
    {
        id: 4,
        name: "伽罗瓦",
        title: "群论之父",
        era: "1811-1832",
        country: "法国",
        category: "数学家",
        avatar: "⚔️",
        coverImage: "📜",
        biography: "埃瓦里斯特·伽罗瓦，法国数学家。他是数学史上最悲情的人物。15 岁开始研究方程理论，19 岁创立群论。然而他的论文被柯西弄丢，被傅里叶去世，被泊松说'完全看不懂'。21 岁时，他为一场荒唐的决斗写下遗书，一整夜疯狂写下群论思想，旁边批注'我没有时间了！'第二天，他中弹身亡。他的理论在 14 年后才被理解，彻底改变了代数学。",
        achievements: [
            { name: "群论", desc: "创立群论，奠定抽象代数基础", year: "1830" },
            { name: "方程可解性", desc: "解决方程根式可解问题", year: "1830" },
            { name: "伽罗瓦理论", desc: "建立伽罗瓦理论", year: "1830" }
        ],
        events: [
            { year: "1811", event: "出生于法国" },
            { year: "1826", event: "15 岁开始研究方程理论" },
            { year: "1829", event: "首次提交论文，被柯西弄丢" },
            { year: "1830", event: "再次提交，傅里叶去世" },
            { year: "1831", event: "第三次提交，被泊松拒绝" },
            { year: "1832", event: "决斗前夕写下遗书，次日身亡" }
        ],
        quotes: [
            "不要哭，阿尔弗雷德！我需要全部的勇气，在二十岁死去。",
            "我没有时间了！"
        ],
        influence: "伽罗瓦理论彻底改变了代数学，使数学从具体计算转向抽象结构研究。他的故事激励了无数数学家。",
        relatedPeople: [3, 5],
        difficulty: 4,
        views: 9876,
        likes: 6543
    },
    {
        id: 5,
        name: "黎曼",
        title: "现代几何之父",
        era: "1826-1866",
        country: "德国",
        category: "数学家",
        avatar: "🌀",
        coverImage: "🌌",
        biography: "格奥尔格·弗里德里希·伯恩哈德·黎曼，德国数学家。他只活了 39 岁，但他的工作影响了整个现代数学。他创立了黎曼几何，为爱因斯坦的广义相对论奠定基础。1859 年，他提出了'黎曼猜想'，关于素数分布的奥秘。这个猜想至今未解，是数学界最重要的难题。",
        achievements: [
            { name: "黎曼几何", desc: "创立黎曼几何，为相对论奠基", year: "1854" },
            { name: "黎曼猜想", desc: "提出黎曼猜想（未解）", year: "1859" },
            { name: "复变函数", desc: "发展复变函数论", year: "1851" },
            { name: "黎曼积分", desc: "建立黎曼积分理论", year: "1854" }
        ],
        events: [
            { year: "1826", event: "出生于德国" },
            { year: "1846", event: "进入哥廷根大学" },
            { year: "1851", event: "获博士学位" },
            { year: "1854", event: "发表就职演讲《论几何基础》" },
            { year: "1859", event: "提出黎曼猜想" },
            { year: "1866", event: "在意大利去世，年仅 39 岁" }
        ],
        quotes: [
            "数学的目标是理解自然中的规律。"
        ],
        influence: "黎曼几何是广义相对论的数学基础，黎曼猜想是当今数学界最重要的未解之谜，克雷数学研究所为其设立了 100 万美元奖金。",
        relatedPeople: [1, 2],
        difficulty: 5,
        views: 11234,
        likes: 7890
    },
    {
        id: 6,
        name: "欧几里得",
        title: "几何学之父",
        era: "公元前 330-275",
        country: "古希腊",
        category: "数学家",
        avatar: "📏",
        coverImage: "📐",
        biography: "欧几里得，古希腊数学家，被誉为'几何学之父'。他在亚历山大城教学期间完成了《几何原本》，这是数学史上最重要的著作之一。《几何原本》系统整理了当时的几何知识，建立了公理化体系，影响了后世 2000 多年的数学教育。他的名言'几何无王者之路'表明数学学习没有捷径。",
        achievements: [
            { name: "《几何原本》", desc: "编写数学史上最伟大的教科书", year: "公元前 300" },
            { name: "公理化方法", desc: "建立几何学的公理体系", year: "公元前 300" },
            { name: "欧几里得几何", desc: "奠定经典几何基础", year: "公元前 300" },
            { name: "数论基础", desc: "证明质数无穷性", year: "公元前 300" }
        ],
        events: [
            { year: "公元前 330", event: "出生于古希腊" },
            { year: "公元前 300", event: "在亚历山大城教学，编写《几何原本》" },
            { year: "公元前 275", event: "去世，但其著作流传千古" }
        ],
        quotes: [
            "几何无王者之路！",
            "对于学习几何学的人，没有皇家大道。"
        ],
        influence: "《几何原本》是历史上最成功的教科书，被翻译成多种语言，发行量仅次于《圣经》。他的公理化方法成为数学研究的标准范式。",
        relatedPeople: [1, 3, 5],
        difficulty: 1,
        views: 13456,
        likes: 8234
    },
    {
        id: 7,
        name: "阿基米德",
        title: "力学之父",
        era: "公元前 287-212",
        country: "古希腊",
        category: "数学家",
        avatar: "🛁",
        coverImage: "⚖️",
        biography: "阿基米德，古希腊数学家、物理学家、工程师。他是古代最伟大的科学家，发现了浮力定律（阿基米德原理）、杠杆原理。传说他在洗澡时发现浮力定律，兴奋地大喊'Eureka!'（我发现了！）。他设计了多种战争机械保卫叙拉古，最终在城破时被罗马士兵杀害。",
        achievements: [
            { name: "浮力定律", desc: "发现阿基米德原理", year: "公元前 250" },
            { name: "杠杆原理", desc: "建立杠杆理论', year: '公元前 250" },
            { name: "圆周率计算", desc: "用穷竭法计算π的近似值", year: "公元前 250" },
            { name: "球体体积", desc: "推导球体体积公式", year: "公元前 250" }
        ],
        events: [
            { year: "公元前 287", event: "出生于叙拉古（今西西里岛）" },
            { year: "公元前 250", event: "发现浮力定律和杠杆原理" },
            { year: "公元前 212", event: "在叙拉古围城战中被杀" }
        ],
        quotes: [
            "给我一个支点，我可以撬动地球。",
            "Eureka!（我发现了！）"
        ],
        influence: "阿基米德的方法预见了微积分的发明，他的工程发明展示了数学的实际应用价值。",
        relatedPeople: [6, 2],
        difficulty: 2,
        views: 14567,
        likes: 8765
    },
    {
        id: 8,
        name: "笛卡尔",
        title: "解析几何之父",
        era: "1596-1650",
        country: "法国",
        category: "数学家",
        avatar: "🕸️",
        coverImage: "📊",
        biography: "勒内·笛卡尔，法国数学家、哲学家。他创立了解析几何，将代数与几何联系起来，发明了笛卡尔坐标系。传说他躺在床上看苍蝇在天花板上飞，想到了用坐标描述位置的方法。他的哲学名言'我思故我在'影响深远。他是近代哲学和数学的双重奠基人。",
        achievements: [
            { name: "解析几何", desc: "创立坐标几何，统一代数与几何", year: "1637" },
            { name: "笛卡尔坐标系", desc: "发明直角坐标系", year: "1637" },
            { name: "符号代数", desc: "引入字母表示未知数", year: "1637" },
            { name: "哲学体系", desc: "建立理性主义哲学", year: "1637" }
        ],
        events: [
            { year: "1596", event: "出生于法国" },
            { year: "1618", event: "参军，开始思考数学问题" },
            { year: "1637", event: "发表《方法论》，创立解析几何" },
            { year: "1650", event: "在瑞典去世" }
        ],
        quotes: [
            "我思故我在。",
            "征服自己，而非世界。"
        ],
        influence: "解析几何的创立是数学史上的里程碑，为微积分的发明铺平了道路。",
        relatedPeople: [2, 3],
        difficulty: 2,
        views: 12890,
        likes: 7654
    },
    {
        id: 9,
        name: "莱布尼茨",
        title: "微积分发明者",
        era: "1646-1716",
        country: "德国",
        category: "数学家",
        avatar: "∫",
        coverImage: "📝",
        biography: "戈特弗里德·威廉·莱布尼茨，德国数学家、哲学家。他与牛顿独立发明了微积分，并发明了更优秀的微积分符号体系。他还是二进制的发现者，发明了机械计算器。莱布尼茨是历史上少见的通才，在数学、哲学、法学、外交等多个领域都有杰出贡献。",
        achievements: [
            { name: "微积分", desc: "独立发明微积分（与牛顿同时）", year: "1684" },
            { name: "微积分符号", desc: "引入∫和 d 等符号", year: "1684" },
            { name: "二进制", desc: "发现二进制系统", year: "1703" },
            { name: "计算器", desc: "发明能进行四则运算的机械计算器", year: "1673" }
        ],
        events: [
            { year: "1646", event: "出生于德国莱比锡" },
            { year: "1673", event: "发明机械计算器" },
            { year: "1684", event: "发表微积分论文" },
            { year: "1703", event: "发表二进制研究" },
            { year: "1716", event: "去世" }
        ],
        quotes: [
            "历史使人明智，数学使人精确。",
            "现在是 Leibniz 先生和 Newton 先生之间的争论。"
        ],
        influence: "莱布尼茨的微积分符号至今仍在使用的二进制是现代计算机的基础。",
        relatedPeople: [2, 3],
        difficulty: 3,
        views: 11234,
        likes: 6789
    },
    {
        id: 10,
        name: "柯西",
        title: "分析学大师",
        era: "1789-1857",
        country: "法国",
        category: "数学家",
        avatar: "📚",
        coverImage: "∞",
        biography: "奥古斯丁 - 路易·柯西，法国数学家。他是数学分析严格化的先驱，提出了极限、连续、收敛等概念的严格定义。柯西是史上最多产的数学家之一，全集达 27 卷。他在复变函数、微分方程、群论等领域都有重要贡献。可惜他弄丢了伽罗瓦的重要论文，成为数学史的遗憾。",
        achievements: [
            { name: "分析严格化", desc: "建立极限、连续的严格理论", year: "1821" },
            { name: "复变函数", desc: "发展复分析基础", year: "1814" },
            { name: "柯西不等式", desc: "发现重要不等式", year: "1821" },
            { name: "群论基础", desc: "研究置换群", year: "1815" }
        ],
        events: [
            { year: "1789", event: "出生于法国巴黎" },
            { year: "1814", event: "开始研究复变函数" },
            { year: "1821", event: "发表《分析教程》，严格化微积分" },
            { year: "1829", event: "收到伽罗瓦论文，但弄丢了" },
            { year: "1857", event: "去世" }
        ],
        quotes: [
            "数学是精确的科学。",
            "当真理被发现，它总是简单的。"
        ],
        influence: "柯西的工作使微积分从直观走向严格，奠定了现代分析学的基础。",
        relatedPeople: [3, 4],
        difficulty: 4,
        views: 9876,
        likes: 5432
    },
    {
        id: 11,
        name: "希尔伯特",
        title: "现代数学领袖",
        era: "1862-1943",
        country: "德国",
        category: "数学家",
        avatar: "🎯",
        coverImage: "📋",
        biography: "大卫·希尔伯特，德国数学家，被誉为'现代数学领袖'。1900 年，他在巴黎国际数学家大会上提出了 23 个数学问题，为 20 世纪数学发展指明方向。他在不变量理论、代数数论、几何基础、泛函分析等领域都有开创性贡献。他的名言'我们必须知道，我们必将知道'体现了数学家的信念。",
        achievements: [
            { name: "希尔伯特问题", desc: "提出 23 个数学问题", year: "1900" },
            { name: "几何基础", desc: "建立欧几里得几何的严格公理体系", year: "1899" },
            { name: "泛函分析", desc: "发展希尔伯特空间理论", year: "1904" },
            { name: "不变量理论", desc: "解决不变量理论的难题", year: "1888" }
        ],
        events: [
            { year: "1862", event: "出生于德国柯尼斯堡" },
            { year: "1888", event: "解决不变量理论难题" },
            { year: "1899", event: "发表《几何基础》" },
            { year: "1900", event: "提出 23 个数学问题" },
            { year: "1943", event: "在哥廷根去世" }
        ],
        quotes: [
            "我们必须知道，我们必将知道。",
            "数学中没有无知之幕。"
        ],
        influence: "希尔伯特问题指引了 20 世纪数学的发展方向，他的形式主义哲学影响深远。",
        relatedPeople: [4, 5],
        difficulty: 5,
        views: 10567,
        likes: 6234
    },
    {
        id: 12,
        name: "庞加莱",
        title: "最后一位数学全才",
        era: "1854-1912",
        country: "法国",
        category: "数学家",
        avatar: "🌍",
        coverImage: "🔮",
        biography: "亨利·庞加莱，法国数学家、物理学家、哲学家。他被认为是最后一个精通数学所有分支的人。26 岁就成为教授，一生获得 30 多个学位和荣誉。他创立了拓扑学，提出了著名的'庞加莱猜想'，这个猜想在 100 年后才被佩雷尔曼证明。他还发现了混沌理论，提出了三体问题的复杂性。",
        achievements: [
            { name: "拓扑学", desc: "创立代数拓扑", year: "1895" },
            { name: "庞加莱猜想", desc: "提出拓扑学基本问题", year: "1904" },
            { name: "混沌理论", desc: "发现三体问题的混沌现象", year: "1887" },
            { name: "自守函数", desc: "发展自守函数理论", year: "1881" }
        ],
        events: [
            { year: "1854", event: "出生于法国南锡" },
            { year: "1880", event: "开始研究微分方程" },
            { year: "1887", event: "发现混沌现象" },
            { year: "1904", event: "提出庞加莱猜想" },
            { year: "1912", event: "去世" }
        ],
        quotes: [
            "科学家研究自然不是因为它有用，而是因为他从中获得乐趣。",
            "创造就是选择，但选择在于有用和有趣。"
        ],
        influence: "庞加莱的工作影响了拓扑学、动力学、相对论等多个领域，他的猜想推动了百年数学发展。",
        relatedPeople: [5, 11],
        difficulty: 5,
        views: 11890,
        likes: 7123
    },
    {
        id: 13,
        name: "图灵",
        title: "计算机科学之父",
        era: "1912-1954",
        country: "英国",
        category: "数学家",
        avatar: "💻",
        coverImage: "🤖",
        biography: "艾伦·图灵，英国数学家、逻辑学家、密码学家。他提出了通用计算机概念（图灵机），奠定了计算机科学的理论基础。二战期间，他破解了德军的 Enigma 密码，拯救了无数生命。战后，他提出了'图灵测试'，开创了人工智能研究。他因同性恋身份被迫害，42 岁自杀身亡。2013 年，英国女王正式赦免了他。",
        achievements: [
            { name: "图灵机", desc: "提出通用计算机模型", year: "1936" },
            { name: "密码破解", desc: "破解 Enigma 密码", year: "1942" },
            { name: "图灵测试", desc: "提出人工智能判定标准", year: "1950" },
            { name: "形态发生", desc: "研究生物图案形成", year: "1952" }
        ],
        events: [
            { year: "1912", event: "出生于英国伦敦" },
            { year: "1936", event: "发表图灵机论文" },
            { year: "1942", event: "破解 Enigma 密码" },
            { year: "1950", event: "提出图灵测试" },
            { year: "1954", event: "去世" }
        ],
        quotes: [
            "我们能问'机器能思考吗？'",
            "有时候，正是那些无人看好之人，最终成就了无人能及之事。"
        ],
        influence: "图灵是计算机科学与人工智能之父，他的理论奠定了现代计算机的基础。",
        relatedPeople: [2, 8],
        difficulty: 4,
        views: 16789,
        likes: 9876
    },
    {
        id: 14,
        name: "冯·诺依曼",
        title: "计算机架构之父",
        era: "1903-1957",
        country: "美国",
        category: "数学家",
        avatar: "🖥️",
        coverImage: "⚛️",
        biography: "约翰·冯·诺依曼，美籍匈牙利数学家。他是 20 世纪最杰出的数学家之一，在量子力学、博弈论、计算机科学、核物理等领域都有开创性贡献。他建立了现代计算机的架构（冯·诺依曼架构），至今仍是计算机设计的基础。他参与了曼哈顿计划，是氢弹的主要设计者之一。",
        achievements: [
            { name: "计算机架构", desc: "建立冯·诺依曼架构", year: "1945" },
            { name: "博弈论", desc: "创立博弈论基础", year: "1944" },
            { name: "量子力学", desc: "建立量子力学的数学基础", year: "1932" },
            { name: "自复制自动机", desc: "提出自复制机器概念", year: "1951" }
        ],
        events: [
            { year: "1903", event: "出生于匈牙利布达佩斯" },
            { year: "1930", event: "前往美国普林斯顿" },
            { year: "1944", event: "发表《博弈论与经济行为》" },
            { year: "1945", event: "提出计算机架构" },
            { year: "1957", event: "去世" }
        ],
        quotes: [
            "在数学中，你不理解事物，只是习惯它们。",
            "如果人们不相信数学是简单的，那只是因为他们没有意识到生活有多复杂。"
        ],
        influence: "冯·诺依曼架构至今仍是计算机设计的基础，他的工作影响了多个学科的发展。",
        relatedPeople: [13, 2],
        difficulty: 5,
        views: 15234,
        likes: 8901
    },
    {
        id: 15,
        name: "怀尔斯",
        title: "费马大定理征服者",
        era: "1953-",
        country: "英国",
        category: "数学家",
        avatar: "🏆",
        coverImage: "📜",
        biography: "安德鲁·怀尔斯，英国数学家。10 岁时在图书馆看到费马大定理，从此着迷。这个看似简单的问题困扰了人类 358 年。1993 年，40 岁的怀尔斯在剑桥演讲中宣布证明了它，但被发现有一个漏洞。经过一年多的闭关，1994 年，他终于补全了证明。他说：'解决这个难题就像在黑暗中摸索，突然找到了开关。'",
        achievements: [
            { name: "费马大定理", desc: "证明费马大定理（x^n+y^n=z^n 无正整数解，n>2）", year: "1994" },
            { name: "椭圆曲线", desc: "发展椭圆曲线理论", year: "1990" },
            { name: "谷山 - 志村猜想", desc: "证明谷山 - 志村猜想", year: "1994" },
            { name: "数论研究", desc: "推动现代数论发展", year: "1990" }
        ],
        events: [
            { year: "1953", event: "出生于英国剑桥" },
            { year: "1963", event: "10 岁看到费马大定理" },
            { year: "1993", event: "宣布证明费马大定理" },
            { year: "1994", event: "补全证明，完成证明" },
            { year: "1998", event: "获得国际数学联盟特别奖" }
        ],
        quotes: [
            "费马大定理是我童年的迷恋，现在它已成往事。",
            "解决这个难题就像在黑暗中摸索，突然找到了开关。"
        ],
        influence: "怀尔斯的证明发展了椭圆曲线理论，推动了数论的进步，激励了无数数学爱好者。",
        relatedPeople: [4, 11],
        difficulty: 5,
        views: 18234,
        likes: 10234
    }
];

// 历史大事件数据
const historicalEvents = [
    {
        id: 1,
        title: "《几何原本》诞生",
        year: "公元前 300 年",
        category: "著作",
        era: "古代",
        description: "欧几里得在亚历山大城完成了《几何原本》，这是数学史上最重要的著作之一。它系统整理了当时的几何知识，建立了公理化体系，影响了后世 2000 多年的数学教育。",
        impact: "奠定了几何学的基础，公理化方法成为数学研究的标准范式。",
        people: ["欧几里得"],
        location: "亚历山大城，埃及",
        image: "📜",
        importance: 5
    },
    {
        id: 2,
        title: "微积分的发明",
        year: "1666-1684",
        category: "发现",
        era: "近代",
        description: "牛顿和莱布尼茨分别独立发明了微积分。牛顿从物理学角度出发，莱布尼茨从几何学角度出发，两人的工作共同奠定了微积分的基础。",
        impact: "微积分成为现代科学的基础工具，推动了物理学、工程学的发展。",
        people: ["牛顿", "莱布尼茨"],
        location: "英国、德国",
        image: "∫",
        importance: 5
    },
    {
        id: 3,
        title: "非欧几何的发现",
        year: "1820s-1830s",
        category: "发现",
        era: "近代",
        description: "罗巴切夫斯基、波尔约和高斯分别独立发现了非欧几何，打破了欧几里得几何的垄断，开创了全新的几何学领域。",
        impact: "拓展了几何学的范围，为广义相对论提供了数学工具。",
        people: ["罗巴切夫斯基", "波尔约", "高斯"],
        location: "俄国、匈牙利、德国",
        image: "🔷",
        importance: 4
    },
    {
        id: 4,
        title: "群论的创立",
        year: "1830",
        category: "理论",
        era: "近代",
        description: "伽罗瓦在研究方程根式可解问题时创立了群论，这是抽象代数的开端。尽管他英年早逝，但他的理论彻底改变了代数学。",
        impact: "开创了抽象代数，成为现代数学的核心语言。",
        people: ["伽罗瓦"],
        location: "法国",
        image: "📐",
        importance: 5
    },
    {
        id: 5,
        title: "黎曼猜想的提出",
        year: "1859",
        category: "猜想",
        era: "近代",
        description: "黎曼在研究素数分布时提出了黎曼猜想，这是关于黎曼ζ函数零点分布的猜想。160 多年过去，它仍然是数学界最重要的未解之谜。",
        impact: "推动了数论、复分析的发展，是克雷数学研究所七大千禧年难题之一。",
        people: ["黎曼"],
        location: "德国",
        image: "🌀",
        importance: 5
    },
    {
        id: 6,
        title: "费马大定理的证明",
        year: "1994",
        category: "证明",
        era: "现代",
        description: "英国数学家怀尔斯在 1993 年宣布证明了费马大定理，但发现了一个漏洞。经过一年多的努力，1994 年终于补全了证明，结束了这个困扰数学界 358 年的难题。",
        impact: "证明了数学史上最著名的猜想，发展了椭圆曲线理论。",
        people: ["怀尔斯"],
        location: "英国、美国",
        image: "🏆",
        importance: 5
    },
    {
        id: 7,
        title: "庞加莱猜想的证明",
        year: "2003",
        category: "证明",
        era: "现代",
        description: "俄罗斯数学家佩雷尔曼使用里奇流方法证明了庞加莱猜想，这是拓扑学中最重要的问题之一。他拒绝了菲尔兹奖和千禧年大奖。",
        impact: "解决了拓扑学基本问题，推动了微分几何的发展。",
        people: ["佩雷尔曼", "庞加莱"],
        location: "俄罗斯",
        image: "🔮",
        importance: 5
    },
    {
        id: 8,
        title: "计算机的发明",
        year: "1940s",
        category: "发明",
        era: "现代",
        description: "图灵提出通用计算机概念，冯·诺依曼建立现代计算机架构。计算机的发明彻底改变了人类社会，也推动了计算数学的发展。",
        impact: "开启了信息时代，推动了数值计算、密码学等领域的发展。",
        people: ["图灵", "冯·诺依曼"],
        location: "英国、美国",
        image: "💻",
        importance: 5
    },
    {
        id: 9,
        title: "《算术研究》发表",
        year: "1801",
        category: "著作",
        era: "近代",
        description: "高斯发表了《算术研究》，这是数论领域的里程碑式著作。它系统整理了数论知识，引入了同余记号，证明了二次互反律，奠定了现代数论的基础。",
        impact: "奠定了现代数论的基础，影响了 19 世纪的数论发展。",
        people: ["高斯"],
        location: "德国",
        image: "📖",
        importance: 5
    },
    {
        id: 10,
        title: "微积分严格化",
        year: "1821",
        category: "理论",
        era: "近代",
        description: "柯西发表《分析教程》，首次给出了极限、连续、导数等概念的严格定义，使微积分从直观走向严谨，奠定了现代数学分析的基础。",
        impact: "使微积分理论严格化，为现代分析学奠定了基础。",
        people: ["柯西"],
        location: "法国",
        image: "📚",
        importance: 4
    },
    {
        id: 11,
        title: "集合论的创立",
        year: "1874",
        category: "理论",
        era: "近代",
        description: "康托尔发表了关于集合论的第一篇论文，引入了无穷集合的概念，建立了超限数理论。这一理论引发了第三次数学危机，但也极大地拓展了数学的边界。",
        impact: "创立了集合论，为现代数学提供了基础语言。",
        people: ["康托尔"],
        location: "德国",
        image: "∞",
        importance: 5
    },
    {
        id: 12,
        title: "希尔伯特 23 问题提出",
        year: "1900",
        category: "会议",
        era: "近代",
        description: "在巴黎国际数学家大会上，希尔伯特提出了 23 个数学问题，为 20 世纪数学发展指明方向。这些问题涵盖了数论、代数、几何、分析等多个领域。",
        impact: "指引了 20 世纪数学的发展方向，其中多个问题已被解决。",
        people: ["希尔伯特"],
        location: "法国巴黎",
        image: "📋",
        importance: 5
    },
    {
        id: 13,
        title: "哥德尔不完备性定理",
        year: "1931",
        category: "证明",
        era: "现代",
        description: "哥德尔证明了不完备性定理：在任何包含算术的形式系统中，都存在既不能证明也不能证伪的命题。这一定理震惊了数学界和哲学界。",
        impact: "揭示了形式系统的局限性，影响了数学基础和计算机科学。",
        people: ["哥德尔"],
        location: "奥地利",
        image: "🔐",
        importance: 5
    },
    {
        id: 14,
        title: "博弈论创立",
        year: "1944",
        category: "理论",
        era: "现代",
        description: "冯·诺依曼和摩根斯坦发表《博弈论与经济行为》，创立了博弈论。这一理论后来被广泛应用于经济学、政治学、生物学等领域。",
        impact: "创立了博弈论，影响了经济学和社会科学。",
        people: ["冯·诺依曼", "摩根斯坦"],
        location: "美国",
        image: "🎮",
        importance: 4
    },
    {
        id: 15,
        title: "P vs NP 问题提出",
        year: "1971",
        category: "猜想",
        era: "现代",
        description: "库克和列文独立提出了 P vs NP 问题：是否存在这样的问题，它的解可以快速验证，但不能快速求解？这是计算机科学最重要的未解问题。",
        impact: "成为计算机科学和数学的核心问题，是千禧年大奖难题之一。",
        people: ["库克", "列文"],
        location: "美国、苏联",
        image: "❓",
        importance: 5
    },
    {
        id: 16,
        title: "朗兰兹纲领提出",
        year: "1967",
        category: "理论",
        era: "现代",
        description: "朗兰兹在给韦伊的信中提出了'朗兰兹纲领'，试图建立数论、代数几何和表示论之间的深刻联系。这被誉为'数学的大统一理论'。",
        impact: "统一了多个数学分支，成为现代数学研究的核心方向。",
        people: ["朗兰兹"],
        location: "美国",
        image: "🌌",
        importance: 5
    },
    {
        id: 17,
        title: "第一台电子计算机 ENIAC",
        year: "1946",
        category: "发明",
        era: "现代",
        description: "世界上第一台通用电子计算机 ENIAC 在美国宾夕法尼亚大学诞生。它重 30 吨，使用了 18000 个电子管，标志着电子计算机时代的开始。",
        impact: "开启了电子计算机时代，为计算数学提供了强大工具。",
        people: ["莫奇利", "埃克特"],
        location: "美国",
        image: "🖥️",
        importance: 4
    },
    {
        id: 18,
        title: "万维网发明",
        year: "1989",
        category: "发明",
        era: "现代",
        description: "蒂姆·伯纳斯 - 李在欧洲核子研究中心工作时发明了万维网（World Wide Web）。他提出了 HTML、HTTP 和 URL 等核心概念，彻底改变了信息共享方式。",
        impact: "改变了人类信息共享和传播方式，推动了数学知识的普及。",
        people: ["蒂姆·伯纳斯 - 李"],
        location: "瑞士",
        image: "🌐",
        importance: 4
    },
    {
        id: 19,
        title: "四色定理证明",
        year: "1976",
        category: "证明",
        era: "现代",
        description: "阿佩尔和哈肯使用计算机辅助证明了四色定理：任何平面地图只需四种颜色就能使相邻区域颜色不同。这是首个主要依赖计算机证明的定理。",
        impact: "开创了计算机辅助证明的先河，引发了关于数学证明本质的讨论。",
        people: ["阿佩尔", "哈肯"],
        location: "美国",
        image: "🎨",
        importance: 4
    },
    {
        id: 20,
        title: "有限单群分类完成",
        year: "1983",
        category: "证明",
        era: "现代",
        description: "经过数百位数学家 100 多年的努力，有限单群的分类工作最终完成。这个证明长达 10000 多页，是数学史上最长的证明之一。",
        impact: "完成了群论的重要分类，是 20 世纪代数学的重大成就。",
        people: ["多位数学家"],
        location: "多国",
        image: "🧩",
        importance: 4
    }
];

class HallOfFameManager {
    constructor() {
        this.userPreferences = {
            viewedPeople: [],
            likedPeople: [],
            favoriteCategories: [],
            searchHistory: []
        };
        this.loadUserPreferences();
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('math_hall_of_fame_v1');
        if (saved) {
            try {
                this.userPreferences = { ...this.userPreferences, ...JSON.parse(saved) };
            } catch (e) {
                console.error('加载用户偏好失败', e);
            }
        }
    }

    saveUserPreferences() {
        localStorage.setItem('math_hall_of_fame_v1', JSON.stringify(this.userPreferences));
    }

    // 获取所有名人
    getAllPeople() {
        return hallOfFameData;
    }

    // 根据 ID 获取名人
    getPerson(id) {
        return hallOfFameData.find(p => p.id === id);
    }

    // 按类别筛选
    filterByCategory(category) {
        return hallOfFameData.filter(p => p.category === category);
    }

    // 按难度筛选
    filterByDifficulty(difficulty) {
        return hallOfFameData.filter(p => p.difficulty === difficulty);
    }

    // 搜索
    search(keyword) {
        const lower = keyword.toLowerCase();
        return hallOfFameData.filter(p => 
            p.name.toLowerCase().includes(lower) ||
            p.title.toLowerCase().includes(lower) ||
            p.biography.toLowerCase().includes(lower)
        );
    }

    // 记录浏览
    recordView(personId) {
        if (!this.userPreferences.viewedPeople.includes(personId)) {
            this.userPreferences.viewedPeople.push(personId);
            this.saveUserPreferences();
        }
    }

    // 点赞
    like(personId) {
        if (!this.userPreferences.likedPeople.includes(personId)) {
            this.userPreferences.likedPeople.push(personId);
            this.saveUserPreferences();
            return true;
        }
        return false;
    }

    // 个性化推荐
    getRecommendations(limit = 5) {
        const viewed = this.userPreferences.viewedPeople;
        const liked = this.userPreferences.likedPeople;
        
        // 基于浏览和点赞历史推荐
        let scores = hallOfFameData.map(person => {
            let score = 0;
            
            // 浏览过的相关人物加分
            if (person.relatedPeople && person.relatedPeople.some(id => viewed.includes(id))) {
                score += 2;
            }
            
            // 点赞过的人物强烈推荐
            if (liked.includes(person.id)) {
                score += 5;
            }
            
            // 未浏览过的适当加分
            if (!viewed.includes(person.id)) {
                score += 1;
            }
            
            return { ...person, score };
        });
        
        // 按分数排序
        scores.sort((a, b) => b.score - a.score);
        
        return scores.slice(0, limit);
    }

    // 获取热门人物
    getPopular(limit = 5) {
        return [...hallOfFameData].sort((a, b) => b.views - a.views).slice(0, limit);
    }

    // 获取所有类别
    getCategories() {
        return [...new Set(hallOfFameData.map(p => p.category))];
    }
}

class HistoricalEventsManager {
    constructor() {
        this.timeline = historicalEvents.sort((a, b) => {
            // 按年份排序（处理公元前）
            const yearA = this.parseYear(a.year);
            const yearB = this.parseYear(b.year);
            return yearA - yearB;
        });
    }

    parseYear(yearStr) {
        if (yearStr.includes('公元前')) {
            return -parseInt(yearStr.replace('公元前', ''));
        }
        return parseInt(yearStr);
    }

    // 获取所有事件
    getAllEvents() {
        return this.timeline;
    }

    // 按类别筛选
    filterByCategory(category) {
        return this.timeline.filter(e => e.category === category);
    }

    // 按时代筛选
    filterByEra(era) {
        return this.timeline.filter(e => e.era === era);
    }

    // 按重要性筛选
    filterByImportance(minImportance) {
        return this.timeline.filter(e => e.importance >= minImportance);
    }

    // 搜索
    search(keyword) {
        const lower = keyword.toLowerCase();
        return this.timeline.filter(e => 
            e.title.toLowerCase().includes(lower) ||
            e.description.toLowerCase().includes(lower) ||
            e.people.some(p => p.toLowerCase().includes(lower))
        );
    }

    // 获取时间线
    getTimeline(startYear, endYear) {
        return this.timeline.filter(e => {
            const year = this.parseYear(e.year);
            return year >= startYear && year <= endYear;
        });
    }

    // 获取所有类别
    getCategories() {
        return [...new Set(this.timeline.map(e => e.category))];
    }

    // 获取所有时代
    getEras() {
        return [...new Set(this.timeline.map(e => e.era))];
    }
}

const hallOfFameManager = new HallOfFameManager();
const historicalEventsManager = new HistoricalEventsManager();

export { 
    hallOfFameData, 
    historicalEvents, 
    HallOfFameManager, 
    HistoricalEventsManager, 
    hallOfFameManager, 
    historicalEventsManager 
};
