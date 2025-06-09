# Project Plan Generator

Transform any idea into a comprehensive project plan in under 60 seconds. No sign-up required.

## 🚀 Features

- **AI-Powered**: Uses OpenAI GPT-4 to generate structured project plans
- **Instant Generation**: Get comprehensive plans in seconds
- **Shareable URLs**: Unique URLs that encode the entire plan (no database needed)
- **Download as Markdown**: Export your plans as `.md` files
- **No Sign-up Required**: Start using immediately
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4 API
- **Markdown**: Remark with GitHub Flavored Markdown support
- **Compression**: Pako for gzip compression of shareable URLs
- **Styling**: Tailwind CSS with Typography plugin

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vibe-code-prject-plan-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Get your API key from: https://platform.openai.com/api-keys

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How It Works

1. **Input**: Users describe their project idea (20-1000 characters)
2. **AI Processing**: OpenAI GPT-4 transforms the idea into a structured plan
3. **Display**: The plan is rendered with proper markdown formatting
4. **Share**: Plans are encoded into URLs using gzip compression + Base64
5. **Export**: Users can download plans as `.md` files

## 🎯 Generated Plan Structure

Each generated plan includes:
- **Project Overview** - Brief description and goals
- **Scope** - What's included and what's not
- **Key Features** - Main features to implement
- **Technical Requirements** - Technology stack and infrastructure
- **Milestones** - Major phases with timeline estimates
- **Risk Assessment** - Potential challenges and mitigation strategies
- **Next Steps** - Immediate actions to take

## 🔗 Deployment

The app is designed to be deployed on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Cloudflare Pages**

All you need is to set the `OPENAI_API_KEY` environment variable in your deployment platform.

## 📚 Project Structure

```
src/
├── components/
│   ├── MarkdownViewer.tsx     # Renders markdown content
│   └── ProjectPlanGenerator.tsx # Main generator component
├── pages/
│   ├── api/
│   │   └── generate-plan.ts   # OpenAI API endpoint
│   └── index.tsx              # Homepage
├── utils/
│   ├── encoding.ts            # URL encoding/decoding utilities
│   └── markdown.ts            # Markdown processing utilities
└── styles/
    └── globals.css            # Global styles
```

## 🎨 Customization

- **Styling**: Modify `tailwind.config.js` and component styles
- **AI Prompt**: Update the prompt in `src/pages/api/generate-plan.ts`
- **Plan Structure**: Customize the generated plan format in the API route
- **UI Components**: Modify components in `src/components/`

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js and OpenAI 