# Elvisas figurer

## Objective
We are building a tool for a artist that are not comfortable working with digital tools. She is doing drawings that the tool shall help convert into PNG images we can use for sprite (e.g. SpriteKit). 

## The task
Create a complete single page webapp (Vite + React + TypeScript) that can be run from github pages as MVP. Later we will move the site to our own webserver if or when we need more than client side functionality (you will be the guide for this). The UI of the page should be clean, intutive and look professional. The site will be a subdomain to www.annasanderek.se (the artis website).

## Your role
You are our modern frontend-developer expert with deep understanding of React, Vite and canvas based image processing. You will proactivly propose technical and UI solutions that in best possible way will simplify the workflow for the artist. If you see technical requirements that is not feasable or you have a better approach then make such recommendations. 

## Features:
- The user shall be able to create a project and open previous projects
- In a project the user shall be able to add a figure and then add multiple movements for the figure, e.g. idle, move left, move right, jump etc. Within each movement the user shall be able to add and remove frames (one movement might only need 2 frames, or even be static, another might need 5-6 or more to be smooth)
- The user enters a name for the animation (e.g. "walk_right") and the number of frames (e.g. 8).
- When the number of frames is set, a grid is created with exactly that many empty "frame cells" (e.g. 200×200 px cells in a responsive grid).
- For each cell, the user can:
  - Drag & drop a PNG/JPG image
  - Or click to select a file from their computer
- Once an image is uploaded to a cell, it appears inside a canvas-based editor within that cell, supporting:
  - Zoom (via mouse wheel / pinch)
  - Pan (drag the image)
  - Rotate (button or slider for 90° steps or free rotation)
  - Fine adjustment of position and scale before final cropping
- Each cell has a "Remove Background" button that uses @imgly/background-removal to automatically remove the background (client-side, show loading state while the model loads the first time).
- After editing/background removal, the image is automatically cropped to a square (centered crop) and downscaled to 128×128 pixels (or a user-selected size via input field, e.g. 64, 128, 256).
- At the bottom of the page there is a large preview canvas that shows the animation in a loop:
  - Plays the frames in sequence with adjustable FPS (default 12 fps)
  - Loops infinitely
  - Displays current frame number and total duration
- Button "Export as ZIP" that creates a zip file containing:
  - All frames as transparent PNGs
  - Named as animationName_01.png, _02.png, etc.
  - Plus a JSON file with metadata (number of frames, fps, original sizes, etc.)

## Technical requirements:
- Use Vite + React 18 + TypeScript
- Use Tailwind CSS for styling (responsive, dark mode optional)
- File upload / drag & drop: use FilePond (npm install filepond etc.)
- Per-frame image editor: use Cropper.js (simple zoom/rotate/crop) OR Fabric.js if you think it fits better for rotate & pan
- Background removal: use @imgly/background-removal (npm install @imgly/background-removal)
  - Show clear loading text the first time the model loads (~20–40 MB)
- Animation preview: pure HTML5 Canvas + requestAnimationFrame
- Export: use JSZip + file-saver
- State management: useState/useReducer or Zustand
- Include error handling (wrong file type, image too large, etc.)
- Create a clean, modern UI with grid layout, hover effects, tooltips

## Code style 
- wite the code clean, well-commented, and as modular as possible
- when adding a library briefly explain your choice

