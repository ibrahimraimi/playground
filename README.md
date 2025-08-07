# Digital Letter Creator 🎨

A playful web application for creating digital letters with various interactive elements. Built with SvelteKit, TypeScript, and Tailwind CSS.

## Features ✨

- **📝 Sticky Notes**: Add colorful sticky notes with customizable colors and editable text
- **📷 Photo Upload**: Upload and add photos with captions
- **🎤 Voice Messages**: Record and add voice messages with playback
- **🎵 Spotify Integration**: Embed Spotify tracks, albums, and playlists
- **✏️ Drawing Tool**: Draw doodles and sketches with color and line width controls
- **🖱️ Drag & Drop**: Intuitive drag and drop interface for all elements
- **🔄 Free Positioning**: Rotate and position items freely on the canvas
- **🎨 Color Palette**: Choose from multiple colors for sticky notes

## Tech Stack 🛠️

- **Frontend**: SvelteKit 5.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide Svelte
- **Audio**: Web Audio API
- **Drawing**: HTML5 Canvas API
- **UI Components**: shadcn/ui

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd giftbox
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage 📖

### Adding Elements

1. **Sticky Notes**: Click the note icon in the toolbar, choose a color, and type your message
2. **Photos**: Click the camera icon to upload photos or take new ones
3. **Voice Messages**: Click the microphone icon to record voice messages
4. **Spotify Tracks**: Click the disc icon and paste a Spotify URL
5. **Doodles**: Click the pencil icon to open the drawing canvas

### Interacting with Elements

- **Drag**: Click and drag any element to move it around the canvas
- **Select**: Click on an element to select it (shows control buttons)
- **Rotate**: Use the rotate button on selected elements
- **Delete**: Use the delete button on selected elements
- **Edit**: Double-click sticky notes to edit their content

### Canvas Features

- **Background**: Dot-patterned canvas for a paper-like feel
- **Layering**: Elements automatically layer based on selection order
- **Free Positioning**: Place elements anywhere on the canvas
- **Rotation**: Rotate elements in 15-degree increments

## Project Structure 📁

```
src/
├── lib/
│   ├── components/
│   │   ├── items/           # Individual item components
│   │   │   ├── StickyNote.svelte
│   │   │   ├── PhotoItem.svelte
│   │   │   ├── VoiceMessage.svelte
│   │   │   ├── SpotifyTrack.svelte
│   │   │   └── DoodleItem.svelte
│   │   ├── modals/          # Modal components
│   │   │   ├── AddPhotoModal.svelte
│   │   │   ├── AddStickyNoteModal.svelte
│   │   │   ├── RecordVoiceModal.svelte
│   │   │   ├── AddSpotifyModal.svelte
│   │   │   └── DrawDoodleModal.svelte
│   │   ├── DigitalCanvas.svelte
│   │   ├── Toolbar.svelte
│   │   └── ColorPalette.svelte
│   ├── stores/
│   │   └── canvasStore.ts   # State management
│   └── types.ts             # TypeScript type definitions
├── routes/
│   └── +page.svelte         # Main page
└── app.css                  # Global styles
```

## API Integration 🎵

### Spotify Integration

The app supports embedding Spotify content by converting regular Spotify URLs to embed URLs:

- **Tracks**: `https://open.spotify.com/track/[id]`
- **Albums**: `https://open.spotify.com/album/[id]`
- **Playlists**: `https://open.spotify.com/playlist/[id]`

### Audio Recording

Uses the Web Audio API and MediaRecorder API for voice message recording and playback
