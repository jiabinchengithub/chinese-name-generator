// 名字数据库示例
const nameDatabase = {
    characters: {
        'mi': { char: '米', meaning: 'rice, meter', tone: 3 },
        'kai': { char: '凯', meaning: 'triumph, victory', tone: 3 },
        'le': { char: '乐', meaning: 'happy, joy', tone: 4 },
        'ming': { char: '明', meaning: 'bright, clear', tone: 2 },
        'mai': { char: '麦', meaning: 'wheat', tone: 4 },
        'ke': { char: '克', meaning: 'overcome', tone: 4 },
        'long': { char: '龙', meaning: 'dragon', tone: 2 },
    }
};

// 中文字符数据库
const chineseCharacters = {
    // 声母对应
    initialMap: {
        'b': ['博', '白', '柏', '北', '百', '碧'],
        'p': ['平', '佩', '培', '鹏', '普'],
        'm': ['明', '美', '梅', '米', '茉', '敏'],
        'f': ['芳', '凡', '芬', '菲', '芙'],
        'd': ['德', '东', '丹', '达', '大'],
        't': ['天', '泰', '图', '陶', '廷'],
        'n': ['宁', '南', '娜', '妮', '念'],
        'l': ['兰', '丽', '莉', '灵', '璐'],
        'g': ['国', '光', '高', '广', '格'],
        'k': ['凯', '康', '开', '克', '恺'],
        'h': ['华', '海', '宏', '汉', '翰'],
        'j': ['金', '佳', '嘉', '静', '晶'],
        'q': ['青', '秋', '清', '晴', '琴'],
        'x': ['心', '新', '欣', '晓', '雪'],
        'zh': ['志', '智', '中', '真', '忠'],
        'ch': ['长', '昌', '畅', '春', '辰'],
        'sh': ['世', '书', '诗', '善', '生'],
        'r': ['容', '荣', '蓉', '然', '柔'],
        'z': ['子', '紫', '卓', '志', '哲'],
        'c': ['才', '彩', '晨', '成', '辰'],
        's': ['思', '素', '诗', '书', '双'],
        'y': ['雅', '艺', '怡', '仪', '宜'],
        'w': ['文', '雯', '婉', '维', '薇'],
        'a': ['安', '爱', '昂', '奥'],
        'e': ['恩', '尔', '而', '二'],
        'o': ['欧', '鸥', '偶'],
        'u': ['玉', '宇', '雨', '语'],
        'i': ['伊', '依', '易', '艺']
    },
    // 韵母对应
    finalMap: {
        'a': ['雅', '华', '达', '嘉'],
        'ai': ['爱', '海', '凯', '泰'],
        'ei': ['蕊', '睿', '瑞', '蕊'],
        'ao': ['昊', '皓', '耀', '瑶'],
        'ou': ['欧', '柔', '诺', '若'],
        'an': ['安', '然', '岸', '翰'],
        'en': ['恩', '真', '森', '任'],
        'ang': ['昂', '航', '康', '朗'],
        'eng': ['盛', '晟', '铮', '棱'],
        'er': ['尔', '而', '儿', '耳'],
        'i': ['伊', '依', '怡', '仪'],
        'ia': ['夏', '霞', '嘉', '佳'],
        'iao': ['晓', '笑', '瑶', '耀'],
        'ie': ['叶', '蕊', '谢', '协'],
        'iu': ['秀', '柔', '宥', '岫'],
        'ian': ['贤', '仙', '典', '见'],
        'in': ['心', '欣', '信', '新'],
        'iang': ['祥', '翔', '香', '想'],
        'ing': ['英', '婴', '莹', '荧'],
        'u': ['宇', '雨', '语', '玉'],
        'ua': ['华', '雅', '霞', '瓜'],
        'uo': ['若', '诺', '朵', '多'],
        'uai': ['怀', '帅', '快', '乖'],
        'ui': ['蕊', '睿', '瑞', '蕊'],
        'uan': ['源', '缘', '园', '远'],
        'un': ['文', '云', '君', '群'],
        'uang': ['光', '黄', '煌', '皇'],
        'ong': ['龙', '荣', '融', '容']
    }
};

// API配置
const API_CONFIG = {
    url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    apiKey: localStorage.getItem('zhipuai_api_key') || '' // 从本地存储获取API密钥
};

// 系统提示词
const SYSTEM_PROMPT = `你是一位专业的中文起名专家，擅长为外国人起富有文化内涵的中文名字。
请根据用户输入的英文名，生成3个合适的中文名建议。每个建议必须包含以下字段：
- chinese: 中文名字（字符串）
- pinyin: 拼音（字符串）
- meaning: 名字的含义（字符串）
- culturalNotes: 包含 chinese 和 english 两个字段的对象，分别是中文和英文的文化解释

输出格式示例：
[
  {
    "chinese": "李明德",
    "pinyin": "Lǐ Míng Dé",
    "meaning": "光明和美德",
    "culturalNotes": {
      "chinese": "李是常见姓氏，明德体现了中国传统文化中对光明和美德的追求",
      "english": "Li is a common surname, Ming De reflects the pursuit of brightness and virtue in Chinese culture"
    }
  }
]`;

// 检查API密钥
function checkApiKey() {
    const apiKey = localStorage.getItem('zhipuai_api_key');
    if (!apiKey) {
        const key = prompt('请输入你的智谱AI API密钥（访问 https://open.bigmodel.cn/ 获取）：');
        if (key) {
            localStorage.setItem('zhipuai_api_key', key);
            API_CONFIG.apiKey = key;
            return true;
        }
        return false;
    }
    return true;
}

// 清除API密钥
function clearApiKey() {
    localStorage.removeItem('zhipuai_api_key');
    alert('API密钥已清除！');
    location.reload();
}

// 添加设置按钮
function addSettingsButton() {
    const settingsButton = document.createElement('button');
    settingsButton.textContent = '设置';
    settingsButton.className = 'settings-button';
    settingsButton.onclick = clearApiKey;
    document.body.appendChild(settingsButton);
}

// 调用API生成名字
async function generateChineseNames(englishName) {
    if (!checkApiKey()) {
        alert('需要API密钥才能使用此功能！');
        return [];
    }

    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';

    try {
        const requestBody = {
            model: "glm-4-flash",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: `请为英文名 "${englishName}" 生成3个合适的中文名建议。请确保返回的是标准JSON格式，包含所有必需字段。`
                }
            ],
            temperature: 0.7,
            top_p: 0.7,
            max_tokens: 1500,
            stream: false
        };

        console.log('发送请求...');
        const response = await fetch(API_CONFIG.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        console.log('API响应:', data);

        if (!data.choices?.[0]?.message?.content) {
            throw new Error('API响应格式不正确');
        }

        // 提取并解析JSON内容
        const content = data.choices[0].message.content;
        console.log('API返回的content:', content);

        // 尝试提取JSON部分
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('无法在响应中找到有效的JSON数组');
        }

        const cleanContent = jsonMatch[0].trim();
        console.log('提取的JSON字符串:', cleanContent);

        const suggestions = JSON.parse(cleanContent);
        console.log('解析后的建议:', suggestions);

        // 验证数据格式
        if (!Array.isArray(suggestions) || !suggestions.every(isValidNameSuggestion)) {
            throw new Error('API返回的数据格式不正确');
        }

        return suggestions;

    } catch (error) {
        console.error('生成名字时出错:', error);
        alert(`生成名字时出错: ${error.message}`);
        return [];
    } finally {
        loadingElement.style.display = 'none';
    }
}

// 验证名字建议的数据格式
function isValidNameSuggestion(suggestion) {
    return suggestion 
        && typeof suggestion.chinese === 'string'
        && typeof suggestion.pinyin === 'string'
        && typeof suggestion.meaning === 'string'
        && suggestion.culturalNotes
        && typeof suggestion.culturalNotes.chinese === 'string'
        && typeof suggestion.culturalNotes.english === 'string';
}

// 创建名字卡片HTML
function createNameCard(nameData) {
    if (!isValidNameSuggestion(nameData)) {
        console.error('无效的名字数据:', nameData);
        return '';
    }

    return `
        <div class="name-card">
            <h2>${nameData.chinese}</h2>
            <p class="pinyin"><strong>Pinyin: </strong>${nameData.pinyin}</p>
            <p class="meaning"><strong>Meaning: </strong>${nameData.meaning}</p>
            <div class="cultural-notes">
                <p class="chinese">${nameData.culturalNotes.chinese}</p>
                <p class="english">${nameData.culturalNotes.english}</p>
            </div>
        </div>
    `;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const englishNameInput = document.getElementById('englishName');
    const generateBtn = document.getElementById('generateBtn');
    const resultsSection = document.getElementById('results');

    generateBtn.addEventListener('click', async () => {
        const englishName = englishNameInput.value.trim();
        if (!englishName) {
            alert('Please enter your English name');
            return;
        }

        resultsSection.innerHTML = '';
        const suggestions = await generateChineseNames(englishName);
        
        if (suggestions.length > 0) {
            const html = suggestions.map(createNameCard).join('');
            resultsSection.innerHTML = html;
        }
    });

    // 添加回车键支持
    englishNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });

    // 添加设置按钮
    addSettingsButton();
});
