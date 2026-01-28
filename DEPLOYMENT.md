# Deployment Guide

## Initial Setup

The project is now ready to be deployed to GitHub Pages. Here's what you need to do:

### 1. Update the Base Path

The `vite.config.ts` file currently has:
```typescript
base: '/SpriteTool/'
```

Make sure this matches your GitHub repository name. If your repo is named differently, update this value.

### 2. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Sprite Animation Tool MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/SpriteTool.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Navigate to **Pages** in the left sidebar
4. Under "Build and deployment":
   - Source: Select "GitHub Actions"
5. The workflow will automatically deploy on the next push to main

### 4. Access Your Site

After the workflow completes, your site will be available at:
```
https://YOUR_USERNAME.github.io/SpriteTool/
```

## Local Testing

### Development Server
```bash
npm run dev
```
Access at: http://localhost:5173/SpriteTool/

### Production Build (Local)
```bash
npm run build
npm run preview
```

## Future Deployment to Custom Domain

When you're ready to move to www.annasanderek.se subdomain:

1. Update `vite.config.ts` base path to `/` or your subdomain path
2. Configure your DNS settings to point to your server
3. Deploy the `dist` folder to your web server
4. Ensure proper server configuration for SPA routing

## Tech Stack Summary

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Storage**: Browser localStorage (client-side only)
- **Image Processing**:
  - Cropper.js (editing)
  - @imgly/background-removal (AI background removal)
- **Export**: JSZip + file-saver
- **Hosting**: GitHub Pages (static site)

## Current MVP Features

✅ Project creation and management
✅ Animation creation with configurable frame counts
✅ Basic image upload (drag & drop or click)
✅ Frame preview in grid
✅ Animation preview with FPS control
✅ localStorage persistence
✅ Clean, responsive UI

## Next Phase Features (Not Yet Implemented)

- [ ] Advanced image editor with Cropper.js integration
- [ ] Background removal functionality
- [ ] Automatic cropping and resizing to output dimensions
- [ ] Export to ZIP with all frames and metadata
- [ ] Advanced frame editing tools
- [ ] Undo/redo functionality
- [ ] Keyboard shortcuts

## Notes

- All data is stored in browser localStorage
- No backend required for MVP
- Background removal model (~20-40 MB) loads on first use
- Images are stored as base64 in localStorage (be mindful of 5-10MB limit)
