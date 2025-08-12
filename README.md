# 🎭 Meme Generator

A modern, responsive meme generator built with Next.js and TypeScript. Create custom memes using popular templates with easy text editing and sharing features.

## Features

- 🖼️ Popular meme templates (Drake, Distracted Boyfriend, Two Buttons, etc.)
- ✏️ Intuitive text editor with customizable fonts, colors, and alignment
- 🎨 Real-time canvas-based meme preview
- 📱 Fully responsive design
- 💾 Download memes as PNG files
- 📋 Copy to clipboard functionality
- 🐦 Social media sharing (Twitter)

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd memegen
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **HTML5 Canvas** - For meme generation and text rendering

## Project Structure

```
src/
├── components/          # React components
│   ├── MemeTemplateSelector.tsx
│   ├── TextEditor.tsx
│   ├── MemeCanvas.tsx
│   └── DownloadShare.tsx
├── types/              # TypeScript type definitions
│   └── meme.ts
├── data/              # Meme template data
│   └── memeTemplates.ts
└── app/               # Next.js app directory
    ├── page.tsx       # Main page component
    ├── layout.tsx     # Root layout
    └── globals.css    # Global styles
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

The project includes a `vercel.json` configuration file for optimal deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.