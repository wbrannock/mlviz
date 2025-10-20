# Gradient Descent Visualization

An interactive visualization of gradient descent optimization algorithm, built with vanilla JavaScript and HTML5 Canvas.

## Features

- **Multiple Test Functions**: 
  - Simple Quadratic (bowl-shaped)
  - Rosenbrock Function (banana-shaped valley)
  - Beale Function (complex landscape)

- **Interactive Controls**:
  - Adjustable learning rate
  - Variable animation speed
  - Step-by-step mode or continuous animation

- **Dual Visualization**:
  - 3D-style heat map showing function landscape
  - 2D contour plot with path tracking

## Local Testing

Simply open `index.html` in your web browser. No build process or dependencies required!

## GitHub Pages Deployment

### Option 1: Deploy from Repository Root

1. Create a new GitHub repository
2. Push these files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Gradient descent visualization"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   git push -u origin main
   ```

3. Go to your repository Settings → Pages
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click "Save"

Your site will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

### Option 2: Deploy from docs folder

1. Move files to a `docs` folder
2. In GitHub Pages settings, select "main" branch and "/docs" folder

## How It Works

The visualization implements gradient descent optimization:

```
x_new = x_old - learning_rate * ∂f/∂x
y_new = y_old - learning_rate * ∂f/∂y
```

Where:
- The gradients (∂f/∂x, ∂f/∂y) point in the direction of steepest ascent
- We move in the opposite direction to minimize the function
- The learning rate controls step size

## Future Enhancements

Ideas for expansion:
- Momentum and Adam optimizers
- Stochastic gradient descent with batches
- Neural network training visualization
- Comparison of different optimizers side-by-side
- Custom function input
- 3D WebGL rendering

## Tech Stack

- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- CSS3 for styling
- Zero dependencies!

## License

MIT License - feel free to use and modify!
