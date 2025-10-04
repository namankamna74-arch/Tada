// math-experiments.js

function createPlaceholderExperiment(title, description) {
    document.getElementById('experimentTitle').innerHTML = `<h2>${title}</h2>`;
    document.getElementById('controls').innerHTML = '<p>Controls for this experiment will be available soon.</p>';
    document.getElementById('canvas-container').innerHTML = `<p style="text-align:center; padding: 50px; color: #555; font-size: 1.2rem;">${description}</p>`;
    document.getElementById('data-display').innerHTML = '';
}

function initFunctions() {
    createPlaceholderExperiment(
        'Function Grapher',
        'An interactive plotter for various mathematical functions is under construction.'
    );
}

function initCalculus() {
    createPlaceholderExperiment(
        'Derivative Visualizer',
        'A visualization for derivatives and tangents is under construction.'
    );
}

function initVectors() {
    createPlaceholderExperiment(
        '3D Vector Operations',
        'A 3D environment for vector addition, dot product, and cross product is under construction.'
    );
}

function initTrigonometry() {
    createPlaceholderExperiment(
        'Trigonometric Functions',
        'An interactive unit circle and wave form visualization is under construction.'
    );
}

function initProbability() {
    createPlaceholderExperiment(
        'Probability Simulator',
        'A simulation for binomial and normal distributions is under construction.'
    );
}

function initGeometry() {
    createPlaceholderExperiment(
        '3D Geometry',
        'A viewer for 3D geometric shapes and transformations is under construction.'
    );
}
