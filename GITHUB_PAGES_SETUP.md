# GitHub Pages Setup Guide

## The Error You're Seeing

The error "Get Pages site failed" means GitHub Pages hasn't been enabled in your repository settings yet. The workflow is correct, but it needs Pages to be configured first.

## Step-by-Step Setup

### 1. Enable GitHub Pages

1. Go to your repository: https://github.com/urbansanderek-private/elvisas-sprite-tool
2. Click on **Settings** (top right of the repository page)
3. In the left sidebar, scroll down and click on **Pages**
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions" from the dropdown
   - (NOT "Deploy from a branch" - make sure it says "GitHub Actions")
5. Click **Save** if needed

That's it! No need to select a branch when using GitHub Actions.

### 2. Push Your Changes

After enabling Pages, push your code:

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push origin main
```

### 3. Watch the Deployment

1. Go to the **Actions** tab in your repository
2. You should see a workflow run "Deploy to GitHub Pages"
3. Wait for it to complete (usually 1-2 minutes)
4. Once complete, your site will be live!

### 4. Access Your Site

Your site will be available at:
```
https://urbansanderek-private.github.io/elvisas-sprite-tool/
```

## Troubleshooting

### If you still get the "Get Pages site failed" error:

1. **Check that Pages is enabled**: Go to Settings → Pages and verify "GitHub Actions" is selected
2. **Check repository permissions**: Make sure the workflow has permission to deploy
   - Go to Settings → Actions → General
   - Scroll to "Workflow permissions"
   - Select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"
   - Click **Save**

### If the build fails:

1. Check the Actions tab for the error message
2. Common issues:
   - Node version mismatch (workflow uses Node 20)
   - Missing dependencies (workflow runs `npm ci`)
   - Build errors (workflow runs `npm run build`)

### If the page shows 404:

1. Verify the base path in `vite.config.ts` matches your repo name: `/elvisas-sprite-tool/`
2. Make sure the `.nojekyll` file exists in the `public` folder
3. Wait a few minutes - sometimes GitHub Pages takes time to propagate

## Testing Locally Before Deploying

Always test the production build locally first:

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

Visit http://localhost:4173/elvisas-sprite-tool/ to test

## Current Configuration

✅ Base path configured: `/elvisas-sprite-tool/`
✅ Workflow file created: `.github/workflows/deploy.yml`
✅ `.nojekyll` file added
✅ Build process verified

## What Happens During Deployment

1. Workflow triggers on push to `main` branch
2. Checks out code
3. Sets up Node.js 20
4. Installs dependencies with `npm ci`
5. Builds the project with `npm run build`
6. Uploads the `dist` folder as an artifact
7. Deploys the artifact to GitHub Pages

The entire process typically takes 1-2 minutes.
