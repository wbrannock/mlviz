# Gradient Descent Visualization

An interactive visualization of gradient descent optimization algorithm, built with vanilla JavaScript and HTML5 Canvas.

View on Github Pages - [Live Demo](https://williambrannock.github.io/mlviz/)

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

## Tech Stack

- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- CSS3 for styling

## License
This is free software. 
