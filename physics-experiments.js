// Simple Pendulum Simulation using Matter.js
function initPendulum() {
    const title = document.getElementById('experimentTitle');
    title.innerHTML = '<h2>Simple Pendulum Experiment</h2>';
    
    const controls = document.getElementById('controls');
    controls.innerHTML = `
        <div class="control-group">
            <label>Length (m):</label>
            <input type="range" id="lengthSlider" min="1" max="5" value="3" step="0.1">
            <span id="lengthValue">3</span>
        </div>
        <div class="control-group">
            <label>Initial Angle (°):</label>
            <input type="range" id="angleSlider" min="10" max="90" value="45" step="5">
            <span id="angleValue">45</span>
        </div>
        <div class="control-group">
            <button onclick="resetPendulum()">Reset</button>
            <button onclick="togglePendulum()">Start/Stop</button>
        </div>
    `;
    
    const container = document.getElementById('canvas-container');
    container.innerHTML = '<div id="pendulumCanvas" style="width:100%; height:600px;"></div>';
    
    // Matter.js setup
    const Engine = Matter.Engine,
          Render = Matter.Render,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Constraint = Matter.Constraint;
    
    const engine = Engine.create();
    const render = Render.create({
        element: document.getElementById('pendulumCanvas'),
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
            background: '#fafafa'
        }
    });
    
    let length = 300;
    let angle = 45;
    let bob, rope;
    let runner = Matter.Runner.create();
    
    function createPendulum() {
        if(bob) World.remove(engine.world, [bob, rope]);

        const pivotX = 400;
        const pivotY = 50;
        const bobX = pivotX + length * Math.sin(angle * Math.PI / 180);
        const bobY = pivotY + length * Math.cos(angle * Math.PI / 180);
        
        bob = Bodies.circle(bobX, bobY, 20, {
            density: 0.04,
            frictionAir: 0.005,
            render: { fillStyle: '#667eea' }
        });
        
        rope = Constraint.create({
            pointA: { x: pivotX, y: pivotY },
            bodyB: bob,
            stiffness: 1,
            length: length,
            render: { strokeStyle: '#764ba2', lineWidth: 3 }
        });
        
        World.add(engine.world, [bob, rope]);
    }
    
    createPendulum();
    
    Render.run(render);
    Matter.Runner.run(runner, engine);
    
    // Controls
    document.getElementById('lengthSlider').oninput = function() {
        length = this.value * 100;
        document.getElementById('lengthValue').textContent = this.value;
        resetPendulum();
    };
    
    document.getElementById('angleSlider').oninput = function() {
        angle = this.value;
        document.getElementById('angleValue').textContent = this.value;
        resetPendulum();
    };
    
    window.resetPendulum = function() {
        createPendulum();
    };
    
    window.togglePendulum = function() {
        runner.enabled = !runner.enabled;
    };
    
    // Display data
    const dataInterval = setInterval(() => {
        if (document.getElementById('experimentCanvas').style.display === 'none') {
            clearInterval(dataInterval);
            Matter.Runner.stop(runner);
            Render.stop(render);
            World.clear(engine.world);
            Engine.clear(engine);
            return;
        }
        if(!bob.position) return;
        const dataDisplay = document.getElementById('data-display');
        const velocity = Math.sqrt(bob.velocity.x**2 + bob.velocity.y**2).toFixed(2);
        const currentAngle = Math.atan2(bob.position.x - 400, bob.position.y - 50) * 180 / Math.PI;
        
        dataDisplay.innerHTML = `
            <h3>Real-time Data</h3>
            <p><strong>Position:</strong> (${bob.position.x.toFixed(1)}, ${bob.position.y.toFixed(1)})</p>
            <p><strong>Velocity:</strong> ${velocity} m/s</p>
            <p><strong>Current Angle:</strong> ${currentAngle.toFixed(1)}°</p>
            <p><strong>Theoretical Period:</strong> ${(2 * Math.PI * Math.sqrt(length/100/9.8)).toFixed(2)} s</p>
        `;
    }, 100);
}

// Projectile Motion
function initProjectile() {
    const title = document.getElementById('experimentTitle');
    title.innerHTML = '<h2>Projectile Motion Simulation</h2>';
    
    const controls = document.getElementById('controls');
    controls.innerHTML = `
        <div class="control-group">
            <label>Initial Velocity (m/s):</label>
            <input type="range" id="velocitySlider" min="10" max="50" value="30" step="1">
            <span id="velocityValue">30</span>
        </div>
        <div class="control-group">
            <label>Launch Angle (°):</label>
            <input type="range" id="launchAngleSlider" min="0" max="90" value="45" step="5">
            <span id="launchAngleValue">45</span>
        </div>
        <div class="control-group">
            <button onclick="launchProjectile()">Launch</button>
            <button onclick="clearTrajectory()">Clear</button>
        </div>
    `;
    
    const container = document.getElementById('canvas-container');
    container.innerHTML = '<canvas id="projectileCanvas" width="1000" height="500"></canvas>';
    
    const canvas = document.getElementById('projectileCanvas');
    const ctx = canvas.getContext('2d');
    
    let projectiles = [];
    let animationFrameId;
    
    document.getElementById('velocitySlider').oninput = function() {
        document.getElementById('velocityValue').textContent = this.value;
    };
    
    document.getElementById('launchAngleSlider').oninput = function() {
        document.getElementById('launchAngleValue').textContent = this.value;
    };
    
    window.launchProjectile = function() {
        const v0 = parseFloat(document.getElementById('velocitySlider').value);
        const angle = parseFloat(document.getElementById('launchAngleSlider').value) * Math.PI / 180;
        
        projectiles.push({
            x: 50,
            y: canvas.height - 50,
            vx: v0 * Math.cos(angle),
            vy: -v0 * Math.sin(angle),
            path: [{x: 50, y: canvas.height - 50}],
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            done: false
        });
        
        if (!animationFrameId) {
            animate();
        }
    };
    
    window.clearTrajectory = function() {
        projectiles = [];
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGround();
    };
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGround();
        
        let allFinished = true;
        
        projectiles.forEach(p => {
            if (!p.done) {
                allFinished = false;
                p.vy += 9.8 * 0.05; // gravity
                p.x += p.vx;
                p.y += p.vy;
                p.path.push({x: p.x, y: p.y});

                if (p.y >= canvas.height - 50) {
                    p.y = canvas.height - 50;
                    p.done = true;
                }
            }

            // Draw path
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(p.path[0].x, p.path[0].y);
            p.path.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.stroke();

            // Draw projectile
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
            ctx.fill();
        });
        
        if (!allFinished) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            animationFrameId = null;
        }
    }
    
    function drawGround() {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
        
        // Grid
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        for (let i = 50; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height - 50);
            ctx.stroke();
        }
        for (let i = canvas.height - 100; i >= 0; i -= 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
    }
    
    drawGround();
}

// Collision Simulation
function initCollision() {
    const title = document.getElementById('experimentTitle');
    title.innerHTML = '<h2>Collision Simulation - Elastic & Inelastic</h2>';
    
    const controls = document.getElementById('controls');
    controls.innerHTML = `
        <div class="control-group">
            <label>Collision Type:</label>
            <select id="collisionType" onchange="resetCollision()">
                <option value="1">Perfectly Elastic (e=1)</option>
                <option value="0.5">Partially Elastic (e=0.5)</option>
                <option value="0">Perfectly Inelastic (e=0)</option>
            </select>
        </div>
        <div class="control-group">
            <button onclick="resetCollision()">Reset</button>
            <button onclick="startCollision()">Start</button>
        </div>
    `;
    
    const container = document.getElementById('canvas-container');
    container.innerHTML = '<div id="collisionCanvas" style="width:100%; height:600px;"></div>';
    
    const Engine = Matter.Engine,
          Render = Matter.Render,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Runner = Matter.Runner;
    
    const engine = Engine.create();
    engine.world.gravity.y = 0; // No gravity
    
    const render = Render.create({
        element: document.getElementById('collisionCanvas'),
        engine: engine,
        options: {
            width: 1000,
            height: 600,
            wireframes: false,
            background: '#fafafa'
        }
    });
    
    let ball1, ball2;
    const runner = Runner.create();
    
    function createBalls() {
        World.clear(engine.world);
        const restitution = parseFloat(document.getElementById('collisionType').value);

        ball1 = Bodies.circle(200, 300, 40, {
            restitution: restitution,
            friction: 0,
            frictionAir: 0,
            density: 0.04,
            render: { fillStyle: '#667eea' }
        });
        
        ball2 = Bodies.circle(800, 300, 40, {
            restitution: restitution,
            friction: 0,
            frictionAir: 0,
            density: 0.04,
            render: { fillStyle: '#764ba2' }
        });
        
        Matter.Body.setVelocity(ball1, { x: 10, y: 0 });
        Matter.Body.setVelocity(ball2, { x: -5, y: 0 });
        
        World.add(engine.world, [ball1, ball2]);
    }
    
    createBalls();
    Render.run(render);
    
    window.resetCollision = function() {
        Runner.stop(runner);
        createBalls();
    };
    
    window.startCollision = function() {
        Runner.run(runner, engine);
    };

    const dataInterval = setInterval(() => {
        if (document.getElementById('experimentCanvas').style.display === 'none') {
            clearInterval(dataInterval);
            Runner.stop(runner);
            Render.stop(render);
            World.clear(engine.world);
            Engine.clear(engine);
            return;
        }
    }, 100);
}

// 3D Wave Interference
function initWaves() {
    const title = document.getElementById('experimentTitle');
    title.innerHTML = '<h2>3D Wave Interference Pattern</h2>';
    
    const controls = document.getElementById('controls');
    controls.innerHTML = `
        <div class="control-group">
            <label>Frequency:</label>
            <input type="range" id="frequencySlider" min="1" max="5" value="2" step="0.1">
            <span id="frequencyValue">2</span>
        </div>
        <div class="control-group">
            <label>Amplitude:</label>
            <input type="range" id="amplitudeSlider" min="0.1" max="2" value="1" step="0.1">
            <span id="amplitudeValue">1</span>
        </div>
    `;
    
    const container = document.getElementById('canvas-container');
    container.innerHTML = '<div id="waveCanvas" style="width: 1000px; height: 600px;"></div>';
    
    // Three.js 3D Wave Visualization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1000/600, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(1000, 600);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('waveCanvas').appendChild(renderer.domElement);
    
    const geometry = new THREE.PlaneGeometry(20, 20, 100, 100);
    const material = new THREE.MeshPhongMaterial({
        color: 0x667eea,
        side: THREE.DoubleSide,
        wireframe: false
    });
    
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2.5;
    scene.add(plane);
    
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));
    
    camera.position.set(0, 15, 15);
    camera.lookAt(0, 0, 0);
    
    let frequency = 2;
    let amplitude = 1;
    let time = 0;
    let animationFrameId;
    
    document.getElementById('frequencySlider').oninput = function() {
        frequency = this.value;
        document.getElementById('frequencyValue').textContent = this.value;
    };
    
    document.getElementById('amplitudeSlider').oninput = function() {
        amplitude = this.value;
        document.getElementById('amplitudeValue').textContent = this.value;
    };
    
    function animate() {
        if (document.getElementById('experimentCanvas').style.display === 'none') {
            cancelAnimationFrame(animationFrameId);
            return;
        }
        animationFrameId = requestAnimationFrame(animate);
        
        time += 0.05;
        const positions = plane.geometry.attributes.position;
        const source1 = {x: -5, y: -5};
        const source2 = {x: 5, y: 5};
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const d1 = Math.sqrt((x - source1.x)**2 + (y - source1.y)**2);
            const d2 = Math.sqrt((x - source2.x)**2 + (y - source2.y)**2);
            const z = amplitude * (Math.sin(d1 * frequency - time) + Math.sin(d2 * frequency - time));
            positions.setZ(i, z);
        }
        
        positions.needsUpdate = true;
        plane.geometry.computeVertexNormals();
        
        renderer.render(scene, camera);
    }
    
    animate();
}
