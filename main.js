let lastVisibleSection = 'physics';

function showSection(sectionId) {
    // Hide all main sections
    document.getElementById('physics').style.display = 'none';
    document.getElementById('chemistry').style.display = 'none';
    document.getElementById('mathematics').style.display = 'none';

    // Show the selected section
    const section = document.getElementById(sectionId);
    if(section) {
        section.style.display = 'block';
        lastVisibleSection = sectionId;
    }

    // Style active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeButton = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
    if(activeButton) {
        activeButton.classList.add('active');
    }
}

function loadExperiment(experimentName) {
    // Hide main view elements
    document.querySelector('header').style.display = 'none';
    document.querySelector('nav').style.display = 'none';
    document.querySelectorAll('.section').forEach(el => el.style.display = 'none');
    
    // Show experiment canvas
    document.getElementById('experimentCanvas').style.display = 'block';

    // Clear previous experiment content to prevent artifacts
    document.getElementById('experimentTitle').innerHTML = '';
    document.getElementById('controls').innerHTML = '';
    document.getElementById('canvas-container').innerHTML = '';
    document.getElementById('data-display').innerHTML = '';

    // A mapping of experiment names to their initialization functions
    const experiments = {
        // Physics
        'pendulum': initPendulum,
        'projectile': initProjectile,
        'collision': initCollision,
        'waves': initWaves,
        // Chemistry
        'molecules': initMolecules,
        'titration': initTitration,
        // Math
        'functions': initFunctions,
        'calculus': initCalculus,
        'vectors': initVectors,
        'trigonometry': initTrigonometry,
        'probability': initProbability,
        'geometry': initGeometry
    };

    const initFunction = experiments[experimentName];

    if (typeof initFunction === 'function') {
        initFunction();
    } else {
        // Fallback for experiments not yet implemented in this map
        document.getElementById('experimentTitle').innerHTML = `<h2>Experiment "${experimentName}" is under construction</h2>`;
        document.getElementById('canvas-container').innerHTML = '<p style="text-align:center; padding-top: 50px;">This simulation will be available soon!</p>';
    }
}

function closeExperiment() {
    // Hide experiment canvas
    document.getElementById('experimentCanvas').style.display = 'none';

    // Show main view elements
    document.querySelector('header').style.display = 'block';
    document.querySelector('nav').style.display = 'flex';
    
    // Show the last active section
    showSection(lastVisibleSection);
}

// Set initial state when the page loads
window.onload = () => {
    showSection('physics');
};
