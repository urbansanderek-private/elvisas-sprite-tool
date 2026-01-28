# Elvisas Sprite Animation Tool - Features Guide

## 🎯 Overview

This tool helps artists convert hand-drawn artwork into sprite animations for game development. The interface is designed to be clean, intuitive, and professional.

## 🗂️ Data Structure

```
📁 Project (e.g., "My Platformer Game")
  │
  ├─ 🧑 Figure (e.g., "Player Character")
  │   ├─ 🎬 Animation "walk_right" (8 frames)
  │   ├─ 🎬 Animation "walk_left" (8 frames)
  │   ├─ 🎬 Animation "jump" (4 frames)
  │   └─ 🎬 Animation "idle" (2 frames)
  │
  └─ 🧑 Figure (e.g., "Enemy")
      ├─ 🎬 Animation "patrol" (6 frames)
      └─ 🎬 Animation "attack" (5 frames)
```

## 🎨 Key Features

### 1. Persistent Navigation Bar
Located at the top of the page, always showing your current context:

**Format**: `Project Name › Figure Name › Animation Name`

**Colors**:
- **Blue** = Project level
- **Purple** = Figure level
- **Green** = Animation level

**Interactive**: Click any level to see a dropdown menu and switch contexts

### 2. Project Management
- Create unlimited projects
- Each project stored separately in browser localStorage
- View all saved projects with metadata (figure count, last modified date)
- Delete projects when no longer needed
- Switch between projects instantly

### 3. Figure Organization
- Each project can have multiple figures/characters
- Create figures with descriptive names (e.g., "Player", "Enemy", "Boss")
- Each figure can have its own set of animations
- Visual organization keeps related animations together

### 4. Animation Creation
- Flexible frame counts (1-60 frames per animation)
- Default 12 FPS (adjustable 1-60)
- Standard output sizes: 64x64, 128x128, 256x256, 512x512
- Descriptive names (e.g., "walk_right", "jump", "idle")

### 5. Frame Upload & Management
- **Drag & Drop**: Drag images directly onto frame cells
- **Click to Select**: Click any cell to choose a file
- **Supported Formats**: PNG, JPG, JPEG
- **Visual Feedback**: Frames show numbered positions
- **Easy Replacement**: Hover over frames to replace or remove
- **Persistent Storage**: All frames saved automatically

### 6. Side-by-Side Animation View ⭐ NEW
When a figure is selected but no specific animation is being edited:
- See ALL animations for that figure at once
- Each animation shows:
  - Live preview (looping)
  - Animation name
  - Frame count and FPS
  - Completion progress bar
  - Percentage complete
- Click any animation to edit it
- Perfect for ensuring consistent style across animations

### 7. Individual Animation Workspace
When editing a specific animation:
- **Frame Grid**: Upload and manage all frames
- **Live Preview**: 256x256 canvas with looping playback
- **Playback Controls**: Play/pause button
- **FPS Adjustment**: Change playback speed on the fly
- **Frame Counter**: See current frame and total
- **Output Size Selector**: Choose final export dimensions

### 8. Smart Context Awareness
The interface adapts based on your current selection:
- **No project**: Show project selector
- **Project selected, no figure**: Prompt to create figures
- **Figure selected, no animation**: Show side-by-side view of all animations
- **Animation selected**: Show full editing workspace

## 🔄 Typical Workflow

1. **Start a Project**
   - Click "Manage Projects"
   - Enter project name (e.g., "RPG Characters")
   - Click "Create New Project"

2. **Create Your First Figure**
   - Enter figure name (e.g., "Player Character")
   - Click "Create Figure"

3. **Add Animations**
   - Enter animation name (e.g., "walk_right")
   - Set frame count (e.g., 8 frames)
   - Click "Create Animation"

4. **Upload Frame Images**
   - Drag images onto numbered frame cells
   - Or click cells to select files
   - Images appear immediately

5. **Preview Your Work**
   - Watch animation loop in preview canvas
   - Adjust FPS if needed
   - Check frame transitions

6. **Create More Animations**
   - Click breadcrumb to go back to figure level
   - Add more animations (walk_left, jump, idle, etc.)
   - View all animations side-by-side

7. **Add More Figures**
   - Create new figures for other characters
   - Each figure has its own set of animations
   - Switch between figures using navigation

## 💾 Data Persistence

- **Automatic Saving**: Every change is saved immediately
- **Browser Storage**: Uses localStorage (no server needed)
- **Persistent**: Data survives page refresh
- **Project-Based**: Each project is independent
- **Storage Key**: `elvisas-sprite-projects`

## 🎯 Design Philosophy

**Clean & Intuitive**
- No clutter, clear visual hierarchy
- Responsive grid layouts
- Hover effects for discoverability
- Tooltips for guidance

**Professional Look**
- Modern color scheme (blues, purples, greens)
- Smooth transitions and animations
- Consistent spacing and typography
- Shadow and depth for important elements

**Artist-Friendly**
- Drag & drop for natural workflow
- Visual feedback at every step
- Progress indicators
- Non-destructive editing (easy to replace/remove)

## 🚀 Coming in Phase 2

Features not yet implemented but planned:
- Image editing tools (crop, rotate, zoom, pan)
- AI-powered background removal
- Automatic resizing to output dimensions
- Export to ZIP with metadata
- Undo/redo functionality
- Keyboard shortcuts

## 📱 Responsive Design

The interface works on:
- Desktop computers (optimal)
- Laptops
- Tablets (with touch support)
- Mobile phones (basic functionality)

Grid layouts adjust automatically to screen size.

## 🎓 Tips for Best Results

1. **Consistent Naming**: Use clear names like "walk_right", "walk_left" not just "anim1"
2. **Frame Counts**: Start with fewer frames (4-8) for smoother workflow
3. **Image Quality**: Upload high-quality source images
4. **Organization**: Group related animations under the same figure
5. **Side-by-Side**: Use the overview to spot style inconsistencies
6. **Regular Saving**: Changes save automatically, but browser clear may delete data

## 🔧 Technical Info

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Storage**: localStorage API
- **Deployment**: GitHub Pages
