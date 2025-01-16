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
    apiKey: '08489efe52b141f8822ab4d4a9067517.i3zzE72g9atIB167'
};

// 本地存储键
const STORAGE_KEYS = {
    SAVED_NAMES: 'savedNames',
    FEEDBACK: 'userFeedback'
};

// 系统提示词
const SYSTEM_PROMPT = `你是一位专业的中文姓名翻译专家。请基于用户提供的英文名，生成对应的中文名字。

生成中文名时请遵循以下规则：
1. 保持名字的音韵美感，尽量选用与英文名发音相近的汉字
2. 姓氏优先考虑单字姓，避免使用罕见姓氏
3. 名字要体现中国传统文化的优雅内涵
4. 字义要积极向上，寓意美好
5. 不要使用生僻字
6. 不要使用网络流行语或现代词汇
7. 不要使用明显不合适的姓氏（如：赵钱孙李）
8. 这些名字之间不要重复

返回格式要求：
{
    "names": [
        {
            "chineseName": "中文名",
            "pinyin": "拼音",
            "meaning": "名字的含义解释",
            "culturalNotes": {
                "chinese": "中文文化内涵说明",
                "english": "英文文化内涵说明"
            }
        }
    ]
}`;

// 语音合成
const speech = {
    synth: window.speechSynthesis,
    voices: [],
    async init() {
        if (this.voices.length > 0) return;
        
        // 等待voices加载
        if (speechSynthesis.getVoices().length === 0) {
            await new Promise(resolve => {
                speechSynthesis.addEventListener('voiceschanged', resolve, { once: true });
            });
        }
        
        this.voices = speechSynthesis.getVoices().filter(voice => 
            voice.lang.startsWith('zh')
        );
    },
    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voices[0];
        utterance.rate = 0.8;
        this.synth.speak(utterance);
    }
};

// 保存的名字管理
const savedNames = {
    items: JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_NAMES) || '[]'),
    add(nameData) {
        try {
            // 检查是否已经保存过
            const isDuplicate = this.items.some(item => 
                item.chineseName === nameData.chineseName && 
                item.pinyin === nameData.pinyin
            );
            
            if (!isDuplicate) {
                this.items.push({
                    ...nameData,
                    savedAt: Date.now()
                });
                this.save();
                this.render();
                showMessage('Name saved successfully!');
            } else {
                showMessage('This name is already saved.');
            }
        } catch (error) {
            console.error('Error saving name:', error);
            showMessage('Failed to save name.');
        }
    },
    remove(index) {
        this.items.splice(index, 1);
        this.save();
        this.render();
        showMessage('Name removed from saved list.');
    },
    save() {
        localStorage.setItem(STORAGE_KEYS.SAVED_NAMES, JSON.stringify(this.items));
    },
    render() {
        const container = document.querySelector('.saved-names-list');
        if (!container) return;
        
        if (this.items.length === 0) {
            container.innerHTML = '<p class="no-saved-names">No saved names yet.</p>';
            return;
        }
        
        container.innerHTML = this.items.map((item, index) => `
            <div class="saved-name-card">
                <div class="saved-name-content">
                    <div class="name-title">
                        <h3>${item.chineseName}</h3>
                        <span class="pinyin">(${item.pinyin})</span>
                    </div>
                    <p class="meaning">${item.meaning}</p>
                </div>
                <div class="saved-name-actions">
                    <button onclick="speech.speak('${item.chineseName}')" title="Play pronunciation">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button onclick="copyToClipboard('${item.chineseName}')" title="Copy name">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button onclick="savedNames.remove(${index})" title="Remove from saved">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
};

// 用户反馈
const feedback = {
    type: '',
    modal: null,
    toast: null,
    
    init() {
        this.modal = document.getElementById('feedbackModal');
        this.toast = document.getElementById('successToast');
        
        // 绑定反馈按钮事件
        document.getElementById('likeBtn').addEventListener('click', () => this.showModal('like'));
        document.getElementById('dislikeBtn').addEventListener('click', () => this.showModal('dislike'));
        
        // 绑定弹窗按钮事件
        document.querySelector('.close-modal').addEventListener('click', () => this.hideModal());
        document.getElementById('submitFeedback').addEventListener('click', () => this.submit());
    },
    
    showModal(type) {
        this.type = type;
        this.modal.style.display = 'flex';
        document.getElementById('feedbackText').focus();
    },
    
    hideModal() {
        this.modal.style.display = 'none';
        document.getElementById('feedbackText').value = '';
    },
    
    async submit() {
        const text = document.getElementById('feedbackText').value;
        const feedbackData = {
            type: this.type,
            text,
            timestamp: Date.now()
        };
        
        // 保存反馈到本地存储
        const feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
        feedbacks.push(feedbackData);
        localStorage.setItem('userFeedbacks', JSON.stringify(feedbacks));
        
        // 隐藏弹窗
        this.hideModal();
        
        // 显示成功提示
        this.showToast();
        
        // 隐藏反馈按钮
        document.getElementById('feedbackButtons').style.display = 'none';
    },
    
    showToast() {
        this.toast.style.display = 'block';
        setTimeout(() => {
            this.toast.style.display = 'none';
        }, 3000);
    }
};

// 社交分享
const social = {
    share(platform, nameData) {
        const text = `Check out my Chinese name: ${nameData.chineseName} (${nameData.pinyin}) - ${nameData.meaning}`;
        const url = encodeURIComponent(window.location.href);
        const encodedText = encodeURIComponent(text);
        
        let shareUrl = '';
        
        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent('My Chinese Name')}&summary=${encodedText}`;
                break;
        }
        
        // 打开分享窗口
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400,location=0,menubar=0');
        }
    }
};

// 调用API生成名字
async function generateChineseNames(englishName) {
    try {
        showLoading();
        clearResults();

        if (!englishName) {
            throw new Error('请输入英文名');
        }

        const batchMode = document.getElementById('batchMode').checked;
        const gender = document.querySelector('input[name="gender"]:checked').value;

        const requestBody = {
            model: "glm-4",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: `请为英文名 "${englishName}" 生成${batchMode ? '9' : '3'}个${gender !== 'neutral' ? gender === 'male' ? '男性' : '女性' : ''}的中文名。要求：
1. 尽量选用与 "${englishName}" 发音相近的汉字
2. 名字要朗朗上口，易于记忆
3. 要符合中国传统文化审美
4. 每个名字都要提供详细的文化含义解释
5. 这些名字之间不要重复`
                }
            ],
            temperature: 0.9,
            top_p: 0.9,
            max_tokens: 1024,
            stream: false
        };

        const response = await fetch(API_CONFIG.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': API_CONFIG.apiKey
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Failed to generate names');
        }

        const data = await response.json();
        const suggestions = parseSuggestions(data);
        
        if (!Array.isArray(suggestions) || suggestions.length === 0) {
            throw new Error('Invalid response format');
        }

        displayResults(suggestions);
    } catch (error) {
        console.error('生成名字时出错:', error);
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// 解析名字建议
function parseSuggestions(data) {
    try {
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid API response format');
        }

        const content = data.choices[0].message.content;
        let suggestions;

        try {
            // 尝试直接解析JSON
            suggestions = JSON.parse(content);
        } catch (e) {
            // 如果直接解析失败，尝试从文本中提取JSON
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }
            suggestions = JSON.parse(jsonMatch[0]);
        }

        // 确保返回的是数组格式
        if (suggestions.names && Array.isArray(suggestions.names)) {
            return suggestions.names;
        } else if (Array.isArray(suggestions)) {
            return suggestions;
        }

        throw new Error('Invalid name suggestions format');
    } catch (error) {
        console.error('Error parsing suggestions:', error);
        console.error('Raw response:', data);
        throw new Error('Failed to parse name suggestions');
    }
}

// 显示名字建议
function displayResults(suggestions) {
    const resultsSection = document.getElementById('results');
    const html = suggestions.map((nameData, index) => {
        // 为了安全地传递数据，对特殊字符进行编码
        const safeNameData = {
            chineseName: nameData.chineseName,
            pinyin: nameData.pinyin,
            meaning: nameData.meaning,
            culturalNotes: {
                chinese: nameData.culturalNotes.chinese,
                english: nameData.culturalNotes.english
            }
        };
        
        const encodedShareData = encodeURIComponent(JSON.stringify(safeNameData));
        
        return `
            <div class="name-card" data-index="${index}">
                <div class="name-header">
                    <h2 class="chinese-name">${nameData.chineseName}</h2>
                    <div class="name-actions">
                        <button class="save-name-btn" data-name-info='${JSON.stringify(safeNameData).replace(/'/g, "&apos;")}' title="Save name">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button onclick="speech.speak('${nameData.chineseName}')" title="Play pronunciation">
                            <i class="fas fa-volume-up"></i>
                        </button>
                        <button onclick="copyToClipboard('${nameData.chineseName}')" title="Copy name">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                </div>
                <p class="pinyin">${nameData.pinyin}</p>
                <p class="meaning">${nameData.meaning}</p>
                <div class="cultural-notes">
                    <p class="chinese">${nameData.culturalNotes.chinese}</p>
                    <p class="english">${nameData.culturalNotes.english}</p>
                </div>
                <div class="share-buttons">
                    <button class="share-btn" data-platform="twitter" data-share-info='${encodedShareData}'>
                        <i class="fab fa-twitter"></i> Twitter
                    </button>
                    <button class="share-btn" data-platform="facebook" data-share-info='${encodedShareData}'>
                        <i class="fab fa-facebook"></i> Facebook
                    </button>
                    <button class="share-btn" data-platform="linkedin" data-share-info='${encodedShareData}'>
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    resultsSection.innerHTML = html;
    
    // 添加保存按钮的事件监听器
    document.querySelectorAll('.save-name-btn').forEach(button => {
        button.addEventListener('click', function() {
            const nameInfo = JSON.parse(this.dataset.nameInfo);
            savedNames.add(nameInfo);
        });
    });
    
    // 添加分享按钮的事件监听器
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.dataset.platform;
            const nameInfo = JSON.parse(decodeURIComponent(this.dataset.shareInfo));
            social.share(platform, nameInfo);
        });
    });
    
    document.getElementById('feedbackButtons').style.display = 'flex';
}

// 工具函数
function showLoading() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';
}

function hideLoading() {
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'none';
}

function clearResults() {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = '';
}

function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

function showMessage(text) {
    const message = document.createElement('div');
    message.className = 'message';
    message.textContent = text;
    
    // 3秒后自动移除
    setTimeout(() => {
        message.remove();
    }, 3000);
    
    document.body.appendChild(message);
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showMessage('已复制到剪贴板');
    } catch (err) {
        showError('复制失败');
    }
}

// 验证名字建议格式
function isValidNameSuggestion(suggestion) {
    return suggestion
        && typeof suggestion.chineseName === 'string'
        && typeof suggestion.pinyin === 'string'
        && typeof suggestion.meaning === 'string'
        && suggestion.culturalNotes
        && typeof suggestion.culturalNotes.chinese === 'string'
        && typeof suggestion.culturalNotes.english === 'string';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    const englishNameInput = document.getElementById('englishName');
    const generateButton = document.getElementById('generateBtn');

    // 初始化语音合成
    await speech.init();

    // 初始化用户反馈
    feedback.init();

    // 渲染保存的名字
    savedNames.render();

    // 绑定生成按钮事件
    generateButton.addEventListener('click', async () => {
        const englishName = englishNameInput.value.trim();
        if (!englishName) {
            showError('请输入英文名');
            return;
        }

        try {
            await generateChineseNames(englishName);
        } catch (error) {
            console.error('生成名字时出错:', error);
        }
    });

    // 绑定输入框回车事件
    englishNameInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            generateButton.click();
        }
    });
});
