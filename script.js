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
        // 检查浏览器是否支持语音合成
        if (!window.speechSynthesis) {
            console.warn('浏览器不支持语音合成');
            return;
        }

        if (this.voices.length > 0) return;
        
        // 等待voices加载
        try {
            if (speechSynthesis.getVoices().length === 0) {
                await new Promise(resolve => {
                    speechSynthesis.addEventListener('voiceschanged', resolve, { once: true });
                    // 添加超时处理
                    setTimeout(resolve, 1000); // 1秒后超时
                });
            }
            
            this.voices = speechSynthesis.getVoices().filter(voice => 
                voice.lang.startsWith('zh')
            );
            
            if (this.voices.length === 0) {
                console.warn('未找到中文语音');
            }
        } catch (error) {
            console.error('语音初始化失败:', error);
        }
    },
    speak(text) {
        if (!window.speechSynthesis || this.voices.length === 0) {
            console.warn('语音功能不可用');
            return;
        }

        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = this.voices[0];
            utterance.rate = 0.8;
            this.synth.speak(utterance);
        } catch (error) {
            console.error('语音播放失败:', error);
        }
    }
};

// 保存的名字管理
const savedNames = {
    items: JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_NAMES) || '[]'),
    
    toggle(button, nameData) {
        try {
            // 检查是否已经保存过
            const index = this.items.findIndex(item => 
                item.chineseName === nameData.chineseName && 
                item.pinyin === nameData.pinyin
            );
            
            if (index === -1) {
                // 添加到保存列表
                this.items.push({
                    ...nameData,
                    savedAt: Date.now()
                });
                button.classList.add('saved');
                showMessage('Name saved successfully!');
            } else {
                // 从保存列表中移除
                this.items.splice(index, 1);
                button.classList.remove('saved');
                showMessage('Name removed from saved list.');
            }
            
            this.save();
            this.render();
        } catch (error) {
            console.error('Error toggling save state:', error);
            showMessage('Failed to update saved names.');
        }
    },

    remove(chineseName, pinyin) {
        try {
            // 通过中文名和拼音找到要删除的项目索引
            const index = this.items.findIndex(item => 
                item.chineseName === chineseName && 
                item.pinyin === pinyin
            );
            
            if (index !== -1) {
                this.items.splice(index, 1);
                this.save();
                this.render();
                
                // 更新所有相关卡片的心形图标状态
                const saveButtons = document.querySelectorAll('.save-btn');
                saveButtons.forEach(button => {
                    const card = button.closest('.name-card');
                    if (card) {
                        const cardChineseName = card.querySelector('.chinese-name').textContent;
                        const cardPinyin = card.querySelector('.pinyin').textContent;
                        if (cardChineseName === chineseName && cardPinyin === pinyin) {
                            button.classList.remove('saved');
                        }
                    }
                });
                
                showMessage('Name removed from saved list.');
            }
        } catch (error) {
            console.error('Error removing name:', error);
            showMessage('Failed to remove name.');
        }
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
        
        container.innerHTML = this.items.map(item => `
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
                    <button onclick="savedNames.remove('${item.chineseName}', '${item.pinyin}')" title="Remove from saved">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },

    // 添加清除方法
    clearAll() {
        this.items = [];
        localStorage.removeItem(STORAGE_KEYS.SAVED_NAMES);
        this.render();
        showMessage('All saved names have been cleared.');
    }
};

// 用户反馈
const feedback = {
    submitFeedback(name, type) {
        // 保存反馈到本地存储
        const feedback = {
            name,
            type,
            timestamp: Date.now()
        };
        
        const feedbacks = JSON.parse(localStorage.getItem('nameFeedbacks') || '[]');
        feedbacks.push(feedback);
        localStorage.setItem('nameFeedbacks', JSON.stringify(feedbacks));
        
        // 显示反馈确认
        showMessage(`感谢您的${type === 'like' ? '好评' : '反馈'}！`);
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

// 修改社交分享功能
const socialShare = {
    getShareData() {
        // 使用一个实际存在的URL作为备用
        const url = window.location.hostname === 'localhost' 
            ? 'https://your-deployed-website.com' // 替换为你的实际网站地址
            : window.location.href;
        const title = 'Chinese Name Generator - Find Your Perfect Chinese Name';
        const text = `Check out this Chinese Name Generator: ${title}`;
        return { url, title, text };
    },

    twitter() {
        const { text, url } = this.getShareData();
        const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        this.openPopup(shareUrl, 'Twitter');
    },

    facebook() {
        const { url, title } = this.getShareData();
        // 使用 Feed Dialog 方式分享
        const shareUrl = `https://www.facebook.com/dialog/feed?` +
            `app_id=936490217542515` + // 使用一个通用的 app_id
            `&display=popup` +
            `&link=${encodeURIComponent(url)}` +
            `&quote=${encodeURIComponent(title)}` +
            `&redirect_uri=${encodeURIComponent(url)}`;
        
        this.openPopup(shareUrl, 'Facebook');
    },

    linkedin() {
        const { url } = this.getShareData();
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        this.openPopup(shareUrl, 'LinkedIn');
    },

    openPopup(url, title) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        try {
            window.open(
                url,
                `Share on ${title}`,
                `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0`
            );
        } catch (error) {
            console.error('Failed to open share window:', error);
            // 如果弹窗失败，尝试直接打开链接
            window.location.href = url;
        }
    },

    share(platform) {
        // 检查是否支持 Web Share API
        if (navigator.share && /mobile/i.test(navigator.userAgent)) {
            const { title, text, url } = this.getShareData();
            navigator.share({
                title,
                text,
                url
            }).catch(err => {
                console.error('Error sharing:', err);
                // 如果原生分享失败，回退到常规分享方法
                this[platform]();
            });
        } else {
            this[platform]();
        }
    }
};

// 生成中文名字
async function generateChineseNames(englishName) {
    console.log('开始生成名字，输入:', englishName);
    try {
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const batchMode = document.getElementById('batchMode').checked;
        console.log('选项:', { gender, batchMode });

        // 修改生成数量的逻辑
        const count = batchMode ? 9 : 3;

        // 构建API请求数据
        const requestData = {
            model: "glm-4",
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: `请为英文名"${englishName}"生成${count}个${gender}性的中文名字。要求：

1. 尽量选用与 "${englishName}" 发音相近的汉字
2. 这${count}个名字必须各不相同
3. 名字要朗朗上口，易于记忆
4. 名字要有独特的文化内涵
5. 避免使用过于常见或过于生僻的字
6. 每个名字都要符合中国传统文化审美
7. 每个名字都要提供详细的文化含义解释
8. 这些名字之间不要重复`
                }
            ]
        };

        // 发送API请求
        const response = await fetch(API_CONFIG.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        console.log('API响应:', data);

        // 解析API返回的名字建议
        const suggestions = parseSuggestions(data);
        
        // 显示结果
        const resultsContainer = document.getElementById('results');
        if (!resultsContainer) {
            console.error('未找到结果容器元素');
            return;
        }

        resultsContainer.innerHTML = ''; // 清空现有结果

        // 添加网格布局类
        resultsContainer.className = 'results-container' + (batchMode ? ' grid-large' : ' grid-small');

        suggestions.forEach(nameData => {
            const nameCard = createNameCard(nameData);
            resultsContainer.appendChild(nameCard);
        });

        console.log('名字展示完成');

    } catch (error) {
        console.error('生成名字时出错:', error);
        throw error;
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

// 显示生成的名字结果
async function displayResults(names) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // 清空现有结果

    names.forEach(name => {
        const nameCard = document.createElement('div');
        nameCard.className = 'name-card';
        
        nameCard.innerHTML = `
            <div class="name-content">
                <h3 class="chinese-name">${name.chineseName}</h3>
                <p class="pinyin">${name.pinyin}</p>
                <div class="meaning">
                    <p>${name.meaning}</p>
                    <p class="detailed-meaning">${name.detailedMeaning || ''}</p>
                    <p class="english-meaning">${name.englishMeaning || ''}</p>
                </div>
            </div>
            <div class="card-footer">
                <div class="feedback-buttons">
                    <button class="feedback-btn like" data-type="like">
                        <i class="fas fa-thumbs-up"></i> 喜欢
                    </button>
                    <button class="feedback-btn dislike" data-type="dislike">
                        <i class="fas fa-thumbs-down"></i> 不喜欢
                    </button>
                </div>
            </div>
        `;

        // 添加反馈按钮事件监听
        const feedbackButtons = nameCard.querySelectorAll('.feedback-btn');
        feedbackButtons.forEach(button => {
            button.addEventListener('click', function() {
                const feedbackType = this.dataset.type;
                submitFeedback(name, feedbackType);
                
                // 添加视觉反馈
                this.classList.add('active');
                setTimeout(() => {
                    this.classList.remove('active');
                }, 200);
            });
        });

        resultsContainer.appendChild(nameCard);
    });
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
    console.log('页面加载完成，开始初始化');
    
    const englishNameInput = document.getElementById('englishName');
    const generateButton = document.getElementById('generateBtn');

    if (!englishNameInput || !generateButton) {
        console.error('未找到必要的DOM元素');
        return;
    }

    // 初始化语音合成
    try {
        await speech.init();
        console.log('语音合成初始化完成');
    } catch (error) {
        console.error('语音合成初始化失败:', error);
        // 继续执行，不影响主要功能
    }

    // 绑定生成按钮事件
    generateButton.addEventListener('click', async () => {
        console.log('生成按钮被点击');
        const englishName = englishNameInput.value.trim();
        if (!englishName) {
            showError('请输入英文名');
            return;
        }

        try {
            showLoading();
            clearResults();
            await generateChineseNames(englishName);
        } catch (error) {
            console.error('生成名字时出错:', error);
            showError('生成名字时出错，请重试');
        } finally {
            hideLoading();
        }
    });

    // 绑定输入框回车事件
    englishNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateButton.click();
        }
    });

    // 初始化保存的名字显示
    savedNames.render();

    // 初始化社交分享按钮
    const twitterBtn = document.querySelector('a[title="Share on Twitter"]');
    const facebookBtn = document.querySelector('a[title="Share on Facebook"]');
    const linkedinBtn = document.querySelector('a[title="Share on LinkedIn"]');

    if (twitterBtn) {
        twitterBtn.onclick = (e) => {
            e.preventDefault();
            socialShare.share('twitter');
        };
    }

    if (facebookBtn) {
        facebookBtn.onclick = (e) => {
            e.preventDefault();
            socialShare.share('facebook');
        };
    }

    if (linkedinBtn) {
        linkedinBtn.onclick = (e) => {
            e.preventDefault();
            socialShare.share('linkedin');
        };
    }

    console.log('初始化完成');
});

function createNameCard(nameData) {
    const nameCard = document.createElement('div');
    nameCard.className = 'name-card';
    
    // 检查该名字是否已保存
    const isSaved = savedNames.items.some(item => 
        item.chineseName === nameData.chineseName && 
        item.pinyin === nameData.pinyin
    );
    
    nameCard.innerHTML = `
        <div class="name-content">
            <h3 class="chinese-name">${nameData.chineseName}</h3>
            <p class="pinyin">${nameData.pinyin}</p>
            <p class="meaning">${nameData.meaning}</p>
            <div class="cultural-notes">
                <p class="cn-note">${nameData.culturalNotes.chinese}</p>
                <p class="en-note">${nameData.culturalNotes.english}</p>
            </div>
        </div>
        <div class="card-footer">
            <div class="card-actions">
                <button onclick="speech.speak('${nameData.chineseName}')" class="action-btn">
                    <i class="fas fa-volume-up"></i>
                </button>
                <button onclick="copyToClipboard('${nameData.chineseName}')" class="action-btn">
                    <i class="fas fa-copy"></i>
                </button>
                <button onclick="savedNames.toggle(this, ${JSON.stringify(nameData).replace(/"/g, '&quot;')})" 
                        class="action-btn save-btn ${isSaved ? 'saved' : ''}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="feedback-buttons">
                <button class="feedback-btn like" onclick="submitFeedback('${nameData.chineseName}', 'like')">
                    <i class="fas fa-thumbs-up"></i>
                </button>
                <button class="feedback-btn dislike" onclick="submitFeedback('${nameData.chineseName}', 'dislike')">
                    <i class="fas fa-thumbs-down"></i>
                </button>
            </div>
        </div>
    `;

    return nameCard;
}

function submitFeedback(name, type) {
    feedback.submitFeedback(name, type);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showConfirmModal(message, onConfirm) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="confirm-modal-content">
            <div class="confirm-modal-title">${message}</div>
            <div class="confirm-modal-buttons">
                <button class="confirm-modal-button confirm-button">确认</button>
                <button class="confirm-modal-button cancel-button">取消</button>
            </div>
        </div>
    `;

    const confirmButton = modal.querySelector('.confirm-button');
    const cancelButton = modal.querySelector('.cancel-button');

    confirmButton.onclick = () => {
        onConfirm();
        modal.remove();
    };

    cancelButton.onclick = () => {
        modal.remove();
    };

    document.body.appendChild(modal);
}