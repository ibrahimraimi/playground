# 🎨 Digital Playground

A creative web application for building interactive digital letters and layouts with multimedia elements.

[![Svelte](https://img.shields.io/badge/Svelte-5.0.0-ff3e00?logo=svelte)](https://svelte.dev/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.22.0-ff3e00?logo=svelte)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🎯 Core Functionality
- **Interactive Digital Canvas**: Drag-and-drop interface for creating digital layouts
- **Multi-element Support**: Add sticky notes, photos, voice messages, Spotify tracks, and doodles
- **Real-time Editing**: Live editing with instant visual feedback
- **Responsive Design**: Works seamlessly across desktop and mobile devices

### 📝 Content Elements
- **Sticky Notes**: Text-based notes with customizable colors and rotation
- **Photo Upload**: Drag-and-drop image support with automatic resizing
- **Voice Messages**: Record and play audio messages with duration display
- **Spotify Integration**: Embed and play Spotify tracks directly on canvas
- **Drawing Tool**: Freehand doodling with customizable brush sizes and colors

### 📤 Export & Sharing
- **JSON Export**: Save and reload exact canvas layouts
- **Shareable Links**: Generate URLs that encode canvas data for easy sharing
- **Load Layouts**: Import previously saved JSON files
- **PNG/PDF Export**: Coming soon - export canvas as images

### 🎨 User Interface
- **Modern Design**: Clean, intuitive interface with smooth animations
- **Floating Hamburger Menu**: Fixed top-right menu with dropdown options
- **Keyboard Shortcuts**: 
  - `Ctrl+O`: Open file
  - `Ctrl+Shift+E`: Export layout
  - `Ctrl+Shift+S`: Generate shareable link
- **Toast Notifications**: Beautiful, non-blocking notifications
- **Customizable Background**: Change canvas background color with preset options

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ibrahimraimi/playground.git
   cd playground
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
pnpm build
pnpm preview
```

## 🛠️ Tech Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/) 2.22.0, [Svelte](https://svelte.dev/) 5.0.0
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.0.0, [tw-animate-css](https://github.com/ibrahimraimi/tw-animate-css) 1.3.6
- **Icons**: [Lucide Svelte](https://lucide.dev/) 0.537.0
- **Notifications**: [svelte-french-toast](https://github.com/zerodevx/svelte-french-toast) 1.2.0
- **Export Libraries**: [html2canvas](https://html2canvas.hertzen.com/) 1.4.1, [jsPDF](https://artskydj.github.io/jsPDF/docs/) 3.0.1
- **Development**: TypeScript 5.0.0, Vite 7.0.4, ESLint 9.18.0, Prettier 3.4.2

## 📖 Usage

### Creating Your First Layout

1. **Add Elements**: Use the toolbar to add sticky notes, photos, voice messages, or drawings
2. **Customize**: Click on elements to edit their content, colors, or position
3. **Arrange**: Drag elements around the canvas to create your desired layout
4. **Save**: Use the hamburger menu to export your layout as JSON
5. **Share**: Generate a shareable link to send to others

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+O` | Open saved layout file |
| `Ctrl+Shift+E` | Export current layout |
| `Ctrl+Shift+S` | Generate shareable link |

### Voice Recording

1. Click the microphone icon in the toolbar
2. Grant microphone permissions when prompted
3. Click the record button to start recording
4. Click stop when finished
5. Preview your recording before adding to canvas

### Drawing Tool

1. Select the drawing tool from the toolbar
2. Choose your brush size and color
3. Click and drag on the canvas to draw
4. Use the eraser to remove unwanted lines

## 🎯 Use Cases

- **Digital Greeting Cards**: Create personalized digital messages
- **Creative Presentations**: Build interactive visual presentations
- **Educational Content**: Develop engaging learning materials
- **Personal Projects**: Organize ideas and concepts visually
- **Collaborative Sharing**: Share creative layouts with others

## 🔧 Development

### Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── items/          # Canvas item components
│   │   ├── modals/         # Modal dialogs
│   │   └── ...            # Other components
│   ├── stores/            # Svelte stores
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── routes/                # SvelteKit routes
└── app.css               # Global styles
```

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm check        # Type check
pnpm format       # Format code with Prettier
pnpm lint         # Lint code with ESLint
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

## 🔒 Privacy & Security

- **Client-side Processing**: All data processing happens in the browser
- **No Server Storage**: User data is not stored on servers
- **Secure File Handling**: Safe file upload and download operations
- **Permission-based Features**: Microphone access only when needed

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support**: Responsive design for tablets and phones
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `build`
4. Deploy!

### Other Platforms

The app can be deployed to any static hosting platform:
- Vercel
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

## 🔮 Roadmap

- [ ] **Enhanced Export Options**: PNG and PDF export functionality
- [ ] **Collaborative Features**: Real-time multi-user editing
- [ ] **Template Library**: Pre-built layout templates
- [ ] **Advanced Drawing Tools**: More sophisticated drawing capabilities
- [ ] **Audio Effects**: Voice message enhancement features
- [ ] **Cloud Storage**: Optional cloud backup and sync

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Svelte](https://svelte.dev/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Vite](https://vitejs.dev/) for the fast build tool

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ibrahimraimi/playground/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ibrahimraimi/playground/discussions)
- **Email**: [Contact via GitHub](https://github.com/ibrahimraimi)

---

Made with ❤️ by [Ibrahim Raimi](https://github.com/ibrahimraimi)
