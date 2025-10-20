// Canvas setup
const functionCanvas = document.getElementById('functionCanvas');
const contourCanvas = document.getElementById('contourCanvas');
const funcCtx = functionCanvas.getContext('2d');
const contourCtx = contourCanvas.getContext('2d');
const learningRateInput = document.getElementById('learningRate');
const lrValueDisplay = document.getElementById('lrValue');

// State variables
let currentX = 3;
let currentY = 3;
let iteration = 0;
let isRunning = false;
let animationId = null;
let history = [];
let currentFunction = 'quadratic';

// Function definitions
const functions = {
    quadratic: {
        f: (x, y) => (x - 2) ** 2 + (y - 2) ** 2,
        gradX: (x, y) => 2 * (x - 2),
        gradY: (x, y) => 2 * (y - 2),
        range: { min: -1, max: 5 },
        optimum: { x: 2, y: 2 },
        initial: { x: 3.2, y: 3.2 },
        learningRate: { min: 0.01, max: 0.5, step: 0.01, default: 0.1 }
    },
    rosenbrock: {
        f: (x, y) => (1 - x) ** 2 + 100 * (y - x ** 2) ** 2,
        gradX: (x, y) => -2 * (1 - x) - 400 * x * (y - x ** 2),
        gradY: (x, y) => 200 * (y - x ** 2),
        range: { min: -2, max: 2 },
        optimum: { x: 1, y: 1 },
        initial: { x: -1.2, y: 1 },
        learningRate: { min: 0.0001, max: 0.05, step: 0.0001, default: 0.001 }
    },
    beale: {
        f: (x, y) => (1.5 - x + x * y) ** 2 + (2.25 - x + x * y ** 2) ** 2 + (2.625 - x + x * y ** 3) ** 2,
        gradX: (x, y) => {
            const t1 = 1.5 - x + x * y;
            const t2 = 2.25 - x + x * y ** 2;
            const t3 = 2.625 - x + x * y ** 3;
            return 2 * t1 * (y - 1) + 2 * t2 * (y ** 2 - 1) + 2 * t3 * (y ** 3 - 1);
        },
        gradY: (x, y) => {
            const t1 = 1.5 - x + x * y;
            const t2 = 2.25 - x + x * y ** 2;
            const t3 = 2.625 - x + x * y ** 3;
            return 2 * t1 * x + 2 * t2 * 2 * x * y + 2 * t3 * 3 * x * y ** 2;
        },
        range: { min: -4, max: 4 },
        optimum: { x: 3, y: 0.5 },
        initial: { x: 1, y: 1 },
        learningRate: { min: 0.0001, max: 0.2, step: 0.0001, default: 0.002 }
    }
};

// UI Controls
learningRateInput.addEventListener('input', (e) => {
    lrValueDisplay.textContent = formatLearningRate(e.target.value);
});

document.getElementById('speed').addEventListener('input', (e) => {
    const speeds = ['Very Slow', 'Slow', 'Slow', 'Medium', 'Medium', 'Medium', 'Fast', 'Fast', 'Very Fast', 'Ultra Fast'];
    document.getElementById('speedValue').textContent = speeds[e.target.value - 1];
});

document.getElementById('functionType').addEventListener('change', (e) => {
    currentFunction = e.target.value;
    applyFunctionDefaults();
    resetVisualization();
});

// Coordinate transformation
function toCanvasX(x, range) {
    return ((x - range.min) / (range.max - range.min)) * functionCanvas.width;
}

function toCanvasY(y, range) {
    return functionCanvas.height - ((y - range.min) / (range.max - range.min)) * functionCanvas.height;
}

// Draw 3D-style function surface
function drawFunctionSurface() {
    const func = functions[currentFunction];
    const range = func.range;
    const width = functionCanvas.width;
    const height = functionCanvas.height;
    
    funcCtx.clearRect(0, 0, width, height);
    
    // Draw function as a heat map
    const resolution = 100;
    const stepX = (range.max - range.min) / resolution;
    const stepY = (range.max - range.min) / resolution;
    
    let minZ = Infinity;
    let maxZ = -Infinity;
    
    // Find min and max for coloring
    for (let i = 0; i <= resolution; i++) {
        for (let j = 0; j <= resolution; j++) {
            const x = range.min + i * stepX;
            const y = range.min + j * stepY;
            const z = func.f(x, y);
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
        }
    }
    
    // Draw heatmap
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            const x = range.min + i * stepX;
            const y = range.min + j * stepY;
            const z = func.f(x, y);
            
            const normalized = (z - minZ) / (maxZ - minZ);
            const hue = 240 - normalized * 240; // Blue (240) to Red (0)
            
            funcCtx.fillStyle = `hsl(${hue}, 70%, ${50 + normalized * 30}%)`;
            
            const canvasX = toCanvasX(x, range);
            const canvasY = toCanvasY(y, range);
            const cellWidth = width / resolution;
            const cellHeight = height / resolution;
            
            funcCtx.fillRect(canvasX, canvasY - cellHeight, cellWidth + 1, cellHeight + 1);
        }
    }
    
    // Draw optimum
    const optX = toCanvasX(func.optimum.x, range);
    const optY = toCanvasY(func.optimum.y, range);
    
    funcCtx.fillStyle = 'white';
    funcCtx.strokeStyle = '#333';
    funcCtx.lineWidth = 2;
    funcCtx.beginPath();
    funcCtx.arc(optX, optY, 8, 0, Math.PI * 2);
    funcCtx.fill();
    funcCtx.stroke();
    
    // Draw axes
    funcCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    funcCtx.lineWidth = 1;
    funcCtx.setLineDash([5, 5]);
    
    // X axis
    const zeroY = toCanvasY(0, range);
    if (zeroY >= 0 && zeroY <= height) {
        funcCtx.beginPath();
        funcCtx.moveTo(0, zeroY);
        funcCtx.lineTo(width, zeroY);
        funcCtx.stroke();
    }
    
    // Y axis
    const zeroX = toCanvasX(0, range);
    if (zeroX >= 0 && zeroX <= width) {
        funcCtx.beginPath();
        funcCtx.moveTo(zeroX, 0);
        funcCtx.lineTo(zeroX, height);
        funcCtx.stroke();
    }
    
    funcCtx.setLineDash([]);
}

// Draw contour plot
function drawContourPlot() {
    const func = functions[currentFunction];
    const range = func.range;
    const width = contourCanvas.width;
    const height = contourCanvas.height;
    
    contourCtx.clearRect(0, 0, width, height);
    
    // Draw contour lines
    const resolution = 100;
    const stepX = (range.max - range.min) / resolution;
    const stepY = (range.max - range.min) / resolution;
    
    let minZ = Infinity;
    let maxZ = -Infinity;
    
    for (let i = 0; i <= resolution; i++) {
        for (let j = 0; j <= resolution; j++) {
            const x = range.min + i * stepX;
            const y = range.min + j * stepY;
            const z = func.f(x, y);
            minZ = Math.min(minZ, z);
            maxZ = Math.max(maxZ, z);
        }
    }
    
    // Draw filled contours
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            const x = range.min + i * stepX;
            const y = range.min + j * stepY;
            const z = func.f(x, y);
            
            const normalized = (z - minZ) / (maxZ - minZ);
            const hue = 240 - normalized * 240;
            
            contourCtx.fillStyle = `hsl(${hue}, 70%, ${50 + normalized * 30}%)`;
            
            const canvasX = toCanvasX(x, range);
            const canvasY = toCanvasY(y, range);
            const cellWidth = width / resolution;
            const cellHeight = height / resolution;
            
            contourCtx.fillRect(canvasX, canvasY - cellHeight, cellWidth + 1, cellHeight + 1);
        }
    }
    
    // Draw path
    if (history.length > 1) {
        contourCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        contourCtx.lineWidth = 2;
        contourCtx.beginPath();
        
        const startX = toCanvasX(history[0].x, range);
        const startY = toCanvasY(history[0].y, range);
        contourCtx.moveTo(startX, startY);
        
        for (let i = 1; i < history.length; i++) {
            const x = toCanvasX(history[i].x, range);
            const y = toCanvasY(history[i].y, range);
            contourCtx.lineTo(x, y);
        }
        contourCtx.stroke();
        
        // Draw points
        history.forEach((point, i) => {
            const x = toCanvasX(point.x, range);
            const y = toCanvasY(point.y, range);
            
            const alpha = 0.3 + (i / history.length) * 0.7;
            contourCtx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            contourCtx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            contourCtx.lineWidth = 2;
            contourCtx.beginPath();
            contourCtx.arc(x, y, 4, 0, Math.PI * 2);
            contourCtx.fill();
            contourCtx.stroke();
        });
    }
    
    // Draw current position
    const currentCanvasX = toCanvasX(currentX, range);
    const currentCanvasY = toCanvasY(currentY, range);
    
    contourCtx.fillStyle = '#48bb78';
    contourCtx.strokeStyle = 'white';
    contourCtx.lineWidth = 3;
    contourCtx.beginPath();
    contourCtx.arc(currentCanvasX, currentCanvasY, 8, 0, Math.PI * 2);
    contourCtx.fill();
    contourCtx.stroke();
    
    // Draw optimum
    const optX = toCanvasX(func.optimum.x, range);
    const optY = toCanvasY(func.optimum.y, range);
    
    contourCtx.fillStyle = 'white';
    contourCtx.strokeStyle = '#333';
    contourCtx.lineWidth = 2;
    contourCtx.beginPath();
    contourCtx.arc(optX, optY, 8, 0, Math.PI * 2);
    contourCtx.fill();
    contourCtx.stroke();
}

// Gradient descent step
function gradientDescentStep() {
    const learningRate = parseFloat(learningRateInput.value);
    const func = functions[currentFunction];
    
    const gradX = func.gradX(currentX, currentY);
    const gradY = func.gradY(currentX, currentY);

    const nextX = currentX - learningRate * gradX;
    const nextY = currentY - learningRate * gradY;

    if (!Number.isFinite(nextX) || !Number.isFinite(nextY) || Math.abs(nextX) > 1e6 || Math.abs(nextY) > 1e6) {
        isRunning = false;
        return;
    }
    
    currentX = nextX;
    currentY = nextY;
    
    history.push({ x: currentX, y: currentY });
    iteration++;
    
    updateStats();
    drawFunctionSurface();
    drawContourPlot();
}

// Update statistics
function updateStats() {
    const func = functions[currentFunction];
    const loss = func.f(currentX, currentY);
    
    document.getElementById('iteration').textContent = iteration;
    document.getElementById('loss').textContent = Number.isFinite(loss) ? loss.toFixed(3) : '∞';
    document.getElementById('position').textContent = `(${currentX.toFixed(2)}, ${currentY.toFixed(2)})`;
}

// Animation loop
function animate() {
    const speed = parseInt(document.getElementById('speed').value);
    const delay = 1000 / speed;
    
    if (isRunning) {
        gradientDescentStep();
        
        // Stop if converged
        const func = functions[currentFunction];
        const loss = func.f(currentX, currentY);
        if (loss < 0.001 || iteration > 1000) {
            isRunning = false;
            return;
        }
        
        animationId = setTimeout(animate, delay);
    }
}

// Control functions
function startGradientDescent() {
    if (!isRunning) {
        isRunning = true;
        animate();
    }
}

function stepGradientDescent() {
    isRunning = false;
    if (animationId) {
        clearTimeout(animationId);
    }
    gradientDescentStep();
}

function resetVisualization() {
    isRunning = false;
    if (animationId) {
        clearTimeout(animationId);
    }
    
    const func = functions[currentFunction];
    const range = func.range;
    
    if (func.initial) {
        currentX = func.initial.x;
        currentY = func.initial.y;
    } else {
        currentX = range.min + (range.max - range.min) * 0.8;
        currentY = range.min + (range.max - range.min) * 0.8;
    }
    iteration = 0;
    history = [{ x: currentX, y: currentY }];
    
    updateStats();
    drawFunctionSurface();
    drawContourPlot();
}

function formatLearningRate(value) {
    const num = Number(value);
    if (num >= 0.1) return num.toFixed(2).replace(/\.?0+$/, '');
    if (num >= 0.01) return num.toFixed(3).replace(/\.?0+$/, '');
    if (num >= 0.001) return num.toFixed(4).replace(/\.?0+$/, '');
    return num.toExponential(2);
}

function applyFunctionDefaults() {
    const func = functions[currentFunction];
    const defaults = func.learningRate || { min: 0.01, max: 0.5, step: 0.01, default: 0.1 };
    
    learningRateInput.min = defaults.min;
    learningRateInput.max = defaults.max;
    learningRateInput.step = defaults.step;
    learningRateInput.value = defaults.default;
    lrValueDisplay.textContent = formatLearningRate(defaults.default);
}

// Initialize
applyFunctionDefaults();
resetVisualization();
