# Chinese Name Generator for English Speakers

A web application that helps English speakers find meaningful Chinese names that match their English names while preserving cultural authenticity.

## Features

- Generate Chinese names based on English name input
- Provide cultural interpretation for each generated name
- Show character-by-character meaning
- Include English explanations of name meanings
- Allow users to save and export their favorite names

## Project Structure

- `index.html` - Main web interface
- `styles.css` - Styling for the web application
- `script.js` - Core application logic and name generation
- `data/` - Directory containing name data and cultural information

## How to Use

1. Open index.html in your web browser
2. Enter your English name
3. Click "Generate Names" to receive personalized Chinese name suggestions
4. View detailed cultural interpretations for each suggestion
5. Save or export your favorite names

## Technical Details

- Built with pure HTML5, CSS3, and JavaScript
- Responsive design for all devices
- Semantic HTML structure
- Optimized for fast loading and smooth user experience

# Chinese Name Generator 中文名生成器

一个帮助外国人生成有文化内涵的中文名字的网页应用。

## 在线体验

访问以下链接即可使用：
[Chinese Name Generator](https://chinese-name-generator-hdx8riyrb-jiabinchens-projects.vercel.app/)

## 功能特点

- 根据英文名生成富有文化内涵的中文名字
- 提供拼音标注，方便发音
- 解释名字含义
- 提供中英文的文化背景说明
- 响应式设计，支持各种设备
- 使用智谱AI的GLM-4模型，提供高质量的名字建议

## 使用方法

1. 访问[应用网站](https://chinese-name-generator-hdx8riyrb-jiabinchens-projects.vercel.app/)
2. 在输入框中输入英文名
3. 点击"Generate Names"按钮
4. 等待几秒钟，系统会生成3个中文名建议
5. 每个名字建议都包含：
   - 中文名字
   - 拼音
   - 含义解释
   - 文化背景说明（中英双语）

## 技术实现

- 前端：HTML5, CSS3, JavaScript
- API：智谱AI GLM-4 API
- 部署：Vercel

## 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/jiabinchengithub/chinese-name-generator.git
```

2. 进入项目目录：
```bash
cd chinese-name-generator
```

3. 使用任意HTTP服务器运行项目，例如使用Python：
```bash
python -m http.server 8000
```

4. 在浏览器中访问 `http://localhost:8000`

## 部署

本项目使用 Vercel 进行部署。如果你想部署自己的版本：

1. Fork 这个仓库
2. 在 [Vercel](https://vercel.com) 注册账号
3. 导入你的 Fork 仓库
4. Vercel 会自动部署并提供一个域名

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

## 许可证

MIT License
