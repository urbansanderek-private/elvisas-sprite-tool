# Sprite Animation Tool

A professional web-based tool for converting hand-drawn artwork into sprite animations for game development (e.g., SpriteKit).

## Features

- **Project Management**: Create and manage multiple sprite animation projects
- **Frame-based Animation**: Add multiple animations per figure with configurable frame counts
- **Image Processing**: Upload, edit, crop, and process images for each frame
- **Background Removal**: Automatic background removal using AI (client-side)
- **Live Preview**: Real-time animation preview with adjustable FPS
- **Export**: Export animations as ZIP files with metadata

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **Cropper.js** - Image editing
- **@imgly/background-removal** - AI-powered background removal
- **JSZip** - Export functionality

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AnimationCreator.tsx
│   ├── AnimationPreview.tsx
│   ├── FrameCell.tsx
│   ├── FrameGrid.tsx
│   └── ProjectSelector.tsx
├── store/              # State management
│   └── projectStore.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Usage

1. **Create a Project**: Start by creating a new project or loading an existing one
2. **Create Animation**: Define animation name and frame count
3. **Upload Frames**: Drag and drop or click to upload images for each frame
4. **Process Images**: Use built-in tools to edit, crop, and remove backgrounds
5. **Preview**: Watch your animation in the preview window
6. **Export**: Download your animation as a ZIP file with all frames and metadata

## License

Private project for www.annasanderek.se
