# Elvisas Sprite Animation Tool

A professional web-based tool for converting hand-drawn artwork into sprite animations for game development (e.g., SpriteKit). Created for www.annasanderek.se.

## Features

- **Hierarchical Organization**: Project → Figures → Animations → Frames
- **Project Management**: Create and manage multiple sprite animation projects
- **Figure-based Workflow**: Organize multiple figures/characters within each project
- **Multiple Animations per Figure**: Add walking, jumping, idle animations and more
- **Side-by-Side Comparison**: View all animations for a figure simultaneously to ensure consistent style
- **Frame-based Animation**: Configurable frame counts for each animation
- **Image Processing**: Upload images via drag & drop or file selection
- **Persistent Navigation**: Always see your current context (Project › Figure › Animation)
- **Live Preview**: Real-time animation preview with adjustable FPS
- **localStorage Persistence**: All data saved automatically in browser

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
├── components/               # React components
│   ├── AnimationCreator.tsx  # Create figures and animations
│   ├── AnimationPreview.tsx  # Single animation preview
│   ├── FigureAnimationsView.tsx  # Side-by-side view of all animations
│   ├── FrameCell.tsx         # Individual frame upload/edit
│   ├── FrameGrid.tsx         # Grid of all frames
│   └── ProjectSelector.tsx   # Project management
├── store/                    # State management
│   └── projectStore.ts       # Zustand store (Project → Figure → Animation)
├── types/                    # TypeScript types
│   └── index.ts              # Type definitions
├── App.tsx                   # Main app with navigation
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## Usage

1. **Create a Project**: Start by creating a new project (e.g., "My Game Characters")
2. **Create a Figure**: Add a figure/character to your project (e.g., "Player Character", "Enemy")
3. **Create Animations**: Add animations for the figure (e.g., "walk_right", "jump", "idle")
4. **Upload Frames**: Drag and drop or click to upload images for each frame
5. **Side-by-Side View**: When not editing a specific animation, see all animations for a figure side-by-side
6. **Preview**: Watch individual animations in the preview window with adjustable FPS
7. **Switch Contexts**: Use the navigation bar to switch between projects, figures, and animations

## Data Hierarchy

```
Project (e.g., "My Game")
  └── Figure (e.g., "Player Character")
       ├── Animation (e.g., "walk_right")
       │    ├── Frame 1
       │    ├── Frame 2
       │    └── Frame 3
       └── Animation (e.g., "jump")
            ├── Frame 1
            └── Frame 2
```

## License

Private project for www.annasanderek.se
