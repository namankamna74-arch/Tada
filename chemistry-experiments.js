// 3D Molecular Visualization
function initMolecules() {
    const title = document.getElementById('experimentTitle');
    title.innerHTML = '<h2>3D Molecular Structure Viewer</h2>';
    
    const controls = document.getElementById('controls');
    controls.innerHTML = `
        <div class="control-group">
            <label>Select Molecule:</label>
            <select id="moleculeSelect" onchange="loadMolecule()">
                <option value="caffeine">Caffeine</option>
                <option value="aspirin">Aspirin</option>
                <option value="ethanol">Ethanol</option>
                <option value="benzene">Benzene</option>
                <option value="water">Water</option>
                <option value="glucose">Glucose</option>
            </select>
        </div>
        <div class="control-group">
            <label>Display Style:</label>
            <select id="styleSelect" onchange="updateStyle()">
                <option value="stick">Stick</option>
                <option value="sphere">Sphere</option>
                <option value="cartoon">Cartoon</option>
                <option value="line">Line</option>
            </select>
        </div>
    `;
    
    const container = document.getElementById('canvas-container');
    container.innerHTML = '<div id="moleculeViewer" style="width:100%; height:600px; position:relative;"></div>';
    
    let viewer = $3Dmol.createViewer("moleculeViewer", {
        backgroundColor: 'white'
    });
    
    const moleculeData = {
        caffeine: { cid: 2519, formula: 'C₈H₁₀N₄O₂' },
        aspirin: { cid: 2244, formula: 'C₉H₈O₄' },
        ethanol: { cid: 702, formula: 'C₂H₅OH' },
        benzene: { cid: 241, formula: 'C₆H₆' },
        water: { cid: 962, formula: 'H₂O' },
        glucose: { cid: 5793, formula: 'C₆H₁₂O₆' }
    };
    
    window.loadMolecule = function() {
        const selected = document.getElementById('moleculeSelect').value;
        const cid = moleculeData[selected].cid;
        
        viewer.clear();
        $.get(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/sdf`, function(data) {
            viewer.addModel(data, "sdf");
            updateStyle();
            viewer.zoomTo();
            viewer.render();
            updateDataDisplay(selected);
        });
    };
    
    window.updateStyle = function() {
        const style = document.getElementById('styleSelect').value;
        viewer.setStyle({}, {[style]: {colorscheme: 'Jmol'}});
        viewer.render();
    };
    
    function updateDataDisplay(moleculeName) {
        const dataDisplay = document.getElementById('data-display');
        dataDisplay.innerHTML = `
            <h3>Molecular Properties</h3>
            <p><strong>Name:</strong> ${moleculeName.charAt(0).toUpperCase() + moleculeName.slice(1)}</p>
            <p><strong>Formula:</strong> ${moleculeData[moleculeName].formula}</p>
            <p style="color: #666; font-style: italic; margin-top: 1rem;">Rotate: Left click + drag | Zoom: Scroll | Pan: Right click + drag</p>
        `;
    }
    
    // Load default molecule (caffeine)
    loadMolecule();
}

// Acid-Base Titration Simulation
function initTitration() {
    const title = document.getElementById('experimentTitle');
    title.innerHTML = '<h2>Acid-Base Titration Simulator</h2>';
    
    const controls = document.getElementById('controls');
    controls.innerHTML = `
        <div class="control-group">
            <label>Acid Concentration (M):</label>
            <input type="number" id="acidConc" value="0.1" step="0.01" min="0.01" onchange="resetTitration()">
        </div>
        <div class="control-group">
            <label>Base Concentration (M):</label>
            <input type="number" id="baseConc" value="0.1" step="0.01" min="0.01" onchange="resetTitration()">
        </div>
        <div class="control-group">
            <button onclick="runTitration()">Run Full Titration</button>
            <button onclick="resetTitration()">Reset</button>
        </div>
    `;
    
    const container = document.getElementById('canvas-container');
    container.innerHTML = `<div style="width: 800px; height: 500px;"><canvas id="pHCurve"></canvas></div>`;
    
    let chart;

    function calculateTitrationCurve() {
        const acidConc = parseFloat(document.getElementById('acidConc').value);
        const baseConc = parseFloat(document.getElementById('baseConc').value);
        const initialAcidVolume = 25.0; // mL
        const pKa = 4.76; // for acetic acid, assuming weak acid for interesting curve

        let data = [];
        for (let vol = 0; vol <= 50; vol += 0.1) {
            const initialMolesAcid = acidConc * (initialAcidVolume / 1000);
            const addedMolesBase = baseConc * (vol / 1000);
            const totalVolume = (initialAcidVolume + vol) / 1000;
            let pH;

            if (addedMolesBase < initialMolesAcid) {
                const H_conc = (initialMolesAcid - addedMolesBase) / totalVolume;
                pH = -Math.log10(H_conc);
            } else if (addedMolesBase === initialMolesAcid) {
                pH = 7.0; // Equivalence point for strong acid-strong base
            } else {
                const OH_conc = (addedMolesBase - initialMolesAcid) / totalVolume;
                pH = 14 + Math.log10(OH_conc);
            }
            data.push({x: vol, y: pH});
        }
        return data;
    }

    function drawPHCurve() {
        const data = calculateTitrationCurve();
        const ctx = document.getElementById('pHCurve').getContext('2d');

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'pH vs. Volume',
                    data: data,
                    borderColor: '#667eea',
                    backgroundColor: '#667eea',
                    showLine: true,
                    pointRadius: 0,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Volume of Base Added (mL)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'pH'
                        },
                        min: 0,
                        max: 14
                    }
                }
            }
        });
    }

    window.runTitration = drawPHCurve;
    window.resetTitration = drawPHCurve;
    
    drawPHCurve();
}
