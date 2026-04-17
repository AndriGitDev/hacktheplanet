// Three.js cinematic 3D scenes for the hack sequence.
// Globe geometry adapted from whois-there/src/components/Globe/WireframeGlobe.tsx
// Continent outlines decoded inline from /data/land-110m.json (TopoJSON).

import * as THREE from 'three';

const GLOBE_RADIUS = 2;

function latLngToVec3(lat, lng, radius = GLOBE_RADIUS) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lng + 180) * Math.PI / 180;
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

function decodeTopoLand(topo) {
    const [sx, sy] = topo.transform.scale;
    const [tx, ty] = topo.transform.translate;
    const arcs = topo.arcs.map(arc => {
        let x = 0, y = 0;
        return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
    });
    const getArc = i => i < 0 ? arcs[~i].slice().reverse() : arcs[i];
    const ringCoords = ring => {
        const out = [];
        for (const i of ring) {
            const a = getArc(i);
            if (out.length) out.pop();
            out.push(...a);
        }
        return out;
    };
    const polylines = [];
    const land = topo.objects.land;
    const geoms = land.type === 'GeometryCollection' ? land.geometries : [land];
    for (const g of geoms) {
        if (g.type === 'Polygon') for (const r of g.arcs) polylines.push(ringCoords(r));
        else if (g.type === 'MultiPolygon') for (const p of g.arcs) for (const r of p) polylines.push(ringCoords(r));
    }
    return polylines;
}

let cachedLand = null;
async function loadLand() {
    if (cachedLand !== null) return cachedLand;
    try {
        const res = await fetch('/data/land-110m.json');
        const topo = await res.json();
        cachedLand = decodeTopoLand(topo);
    } catch (e) {
        cachedLand = [];
    }
    return cachedLand;
}

function makeGlobe(hex, landPolylines) {
    const color = new THREE.Color(hex);
    const group = new THREE.Group();

    // Solid occluder so back-side lines don't bleed through
    group.add(new THREE.Mesh(
        new THREE.SphereGeometry(GLOBE_RADIUS * 0.97, 48, 48),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    ));

    // Faint wireframe shell
    group.add(new THREE.Mesh(
        new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32),
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.09 })
    ));

    // Lat/lng grid as line segments
    const gridPts = [];
    for (let lat = -80; lat <= 80; lat += 10) {
        for (let lng = -180; lng < 180; lng += 4) {
            gridPts.push(latLngToVec3(lat, lng), latLngToVec3(lat, lng + 4));
        }
    }
    for (let lng = -180; lng < 180; lng += 10) {
        for (let lat = -88; lat < 88; lat += 4) {
            gridPts.push(latLngToVec3(lat, lng), latLngToVec3(lat + 4, lng));
        }
    }
    group.add(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(gridPts),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.1 })
    ));

    // Continent outlines
    if (landPolylines && landPolylines.length) {
        const coastMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.55 });
        for (const pl of landPolylines) {
            const pts = pl.map(([lng, lat]) => latLngToVec3(lat, lng, GLOBE_RADIUS + 0.01));
            group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), coastMat));
        }
    }

    return group;
}

function arcPoints(lat1, lng1, lat2, lng2, segs = 64, altBoost = 0.5) {
    const a = latLngToVec3(lat1, lng1);
    const b = latLngToVec3(lat2, lng2);
    const pts = [];
    for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const p = new THREE.Vector3().lerpVectors(a, b, t);
        const alt = 1 + altBoost * Math.sin(t * Math.PI);
        p.normalize().multiplyScalar(GLOBE_RADIUS * alt);
        pts.push(p);
    }
    return pts;
}

function disposeGroup(root) {
    root.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
            else obj.material.dispose();
        }
    });
}

/* ----------------- Scene factories ----------------- */

function initScene(land) {
    const group = new THREE.Group();
    const globe = makeGlobe(0x00ff41, land);
    group.add(globe);
    const nodes = [];
    let nextNodeAt = 0.4;

    return {
        group,
        enter(cam) { cam.position.set(0, 1.2, 6.5); cam.lookAt(0, 0, 0); },
        update(dt, t) {
            globe.rotation.y += dt * 0.18;
            if (t > nextNodeAt && nodes.length < 16) {
                nextNodeAt = t + 0.25 + Math.random() * 0.3;
                const lat = -65 + Math.random() * 130;
                const lng = -180 + Math.random() * 360;
                const pos = latLngToVec3(lat, lng, GLOBE_RADIUS + 0.02);
                const dot = new THREE.Mesh(
                    new THREE.SphereGeometry(0.045, 10, 10),
                    new THREE.MeshBasicMaterial({ color: 0x00ff41 })
                );
                dot.position.copy(pos);
                globe.add(dot);
                nodes.push({ mesh: dot, lat, lng, born: t });
                if (nodes.length > 1) {
                    const prev = nodes[nodes.length - 2];
                    const pts = arcPoints(prev.lat, prev.lng, lat, lng, 48, 0.55);
                    globe.add(new THREE.Line(
                        new THREE.BufferGeometry().setFromPoints(pts),
                        new THREE.LineBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.7 })
                    ));
                }
            }
            for (const n of nodes) {
                const s = 1 + 0.4 * Math.sin((t - n.born) * 4);
                n.mesh.scale.setScalar(s);
            }
        }
    };
}

function scanScene() {
    const group = new THREE.Group();
    const cubes = [];
    const W = 10, D = 14;
    for (let x = -W; x <= W; x++) {
        for (let z = -D; z <= D; z++) {
            const h = 0.25 + Math.random() * 1.4;
            const mat = new THREE.MeshBasicMaterial({ color: 0x0a2a38, transparent: true, opacity: 0.85 });
            const cube = new THREE.Mesh(new THREE.BoxGeometry(0.55, h, 0.55), mat);
            cube.position.set(x * 0.75, h / 2, z * 0.75);
            const wire = new THREE.LineSegments(
                new THREE.EdgesGeometry(cube.geometry),
                new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.25 })
            );
            cube.add(wire);
            cube.userData = { baseColor: mat.color.clone(), wire: wire.material, scanned: 0 };
            group.add(cube);
            cubes.push(cube);
        }
    }
    const scanPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 14),
        new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.18, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
    );
    scanPlane.rotation.x = Math.PI / 2;
    group.add(scanPlane);

    let scanZ = -D * 0.75 - 2;
    let vulnCube = null;

    return {
        group,
        enter(cam) { cam.position.set(-6, 4, 9); cam.lookAt(0, 0, 0); },
        update(dt, t) {
            scanZ += dt * 4;
            const maxZ = D * 0.75 + 2;
            if (scanZ > maxZ) scanZ = -maxZ;
            scanPlane.position.z = scanZ;
            for (const cube of cubes) {
                if (cube === vulnCube) continue;
                const d = Math.abs(cube.position.z - scanZ);
                if (d < 0.5 && cube.userData.scanned <= 0) {
                    cube.userData.scanned = 0.6;
                    cube.material.color.setHex(0x00e5ff);
                    cube.userData.wire.color.setHex(0x7fffff);
                }
                if (cube.userData.scanned > 0) {
                    cube.userData.scanned -= dt;
                    if (cube.userData.scanned <= 0) {
                        cube.material.color.copy(cube.userData.baseColor);
                        cube.userData.wire.color.setHex(0x00e5ff);
                    }
                }
            }
            group.rotation.y = Math.sin(t * 0.12) * 0.18;
        },
        event(name) {
            if (name === 'vuln') {
                vulnCube = cubes[Math.floor(Math.random() * cubes.length)];
                vulnCube.material.color.setHex(0xff0040);
                vulnCube.userData.wire.color.setHex(0xff4070);
                vulnCube.scale.set(1.4, 1.8, 1.4);
            }
        }
    };
}

function exploitScene() {
    const group = new THREE.Group();
    const rings = [];
    const N = 40;
    for (let i = 0; i < N; i++) {
        const r = 2 + Math.sin(i * 0.4) * 0.25;
        const torus = new THREE.Mesh(
            new THREE.TorusGeometry(r, 0.035, 8, 48),
            new THREE.MeshBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending })
        );
        torus.position.z = -i * 2.8;
        torus.rotation.z = i * 0.12;
        group.add(torus);
        rings.push(torus);
    }
    const payload = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.5),
        new THREE.MeshBasicMaterial({ color: 0x00ff41, wireframe: true })
    );
    const payloadGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending })
    );
    group.add(payload);
    group.add(payloadGlow);

    const starPts = [];
    for (let i = 0; i < 400; i++) {
        starPts.push(new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 20, -Math.random() * 100));
    }
    const stars = new THREE.Points(
        new THREE.BufferGeometry().setFromPoints(starPts),
        new THREE.PointsMaterial({ color: 0x00ff41, size: 0.06, transparent: true, opacity: 0.8 })
    );
    group.add(stars);

    return {
        group,
        enter(cam) { cam.position.set(0, 0, 4); cam.lookAt(0, 0, -10); },
        update(dt, t) {
            for (const r of rings) {
                r.position.z += dt * 8;
                if (r.position.z > 4) r.position.z -= N * 2.8;
                r.rotation.z += dt * 0.6;
            }
            const sp = stars.geometry.attributes.position.array;
            for (let i = 2; i < sp.length; i += 3) {
                sp[i] += dt * 20;
                if (sp[i] > 4) sp[i] -= 100;
            }
            stars.geometry.attributes.position.needsUpdate = true;
            payload.rotation.x += dt * 2.2;
            payload.rotation.y += dt * 3.1;
            const pz = Math.sin(t * 1.5) * 1.5 - 2;
            payload.position.z = pz;
            payloadGlow.position.z = pz;
            payloadGlow.scale.setScalar(1 + 0.2 * Math.sin(t * 6));
        },
        event(name) {
            if (name === 'overflow') {
                for (const r of rings) r.material.color.setHex(0xff4040);
                payload.material.color.setHex(0xff4040);
                payloadGlow.material.color.setHex(0xff4040);
            }
        }
    };
}

function firewallScene() {
    const group = new THREE.Group();
    const walls = [];
    for (let i = 0; i < 3; i++) {
        const w = new THREE.Group();
        const bars = [];
        for (let x = -7; x <= 7; x++) {
            for (let y = -4; y <= 4; y++) {
                const bar = new THREE.Mesh(
                    new THREE.BoxGeometry(0.45, 0.45, 0.12),
                    new THREE.MeshBasicMaterial({ color: 0xffb000, transparent: true, opacity: 0.7 })
                );
                bar.position.set(x * 0.55, y * 0.55, (Math.random() - 0.5) * 0.05);
                bar.userData.home = bar.position.clone();
                bar.userData.vx = (Math.random() - 0.5) * 6;
                bar.userData.vy = 1 + Math.random() * 4;
                bar.userData.vz = 2 + Math.random() * 6;
                bar.userData.rx = (Math.random() - 0.5) * 5;
                bar.userData.ry = (Math.random() - 0.5) * 5;
                w.add(bar);
                bars.push(bar);
            }
        }
        w.position.z = -i * 7 - 5;
        w.userData = { broken: false, bars };
        group.add(w);
        walls.push(w);
    }
    let bypassed = 0;

    return {
        group,
        enter(cam) { cam.position.set(0, 0, 9); cam.lookAt(0, 0, -10); },
        update(dt, t) {
            for (const w of walls) {
                if (w.userData.broken) {
                    for (const bar of w.userData.bars) {
                        bar.position.x += bar.userData.vx * dt;
                        bar.position.y += bar.userData.vy * dt;
                        bar.position.z += bar.userData.vz * dt;
                        bar.userData.vy -= 5 * dt;
                        bar.rotation.x += bar.userData.rx * dt;
                        bar.rotation.y += bar.userData.ry * dt;
                        bar.material.opacity = Math.max(0, bar.material.opacity - dt * 0.4);
                    }
                } else {
                    for (const bar of w.userData.bars) {
                        const h = bar.userData.home;
                        bar.position.z = h.z + Math.sin(t * 3 + h.x + h.y) * 0.08;
                        bar.material.opacity = 0.55 + 0.25 * Math.sin(t * 2 + h.x * 0.5);
                    }
                }
            }
        },
        event(name) {
            if (name === 'bypass' && bypassed < walls.length) {
                walls[bypassed].userData.broken = true;
                bypassed++;
            }
        }
    };
}

function exfilScene() {
    const group = new THREE.Group();
    const blinkers = [];
    for (let side = 0; side < 2; side++) {
        for (let i = 0; i < 14; i++) {
            const rack = new THREE.Group();
            const body = new THREE.Mesh(
                new THREE.BoxGeometry(1.4, 3.2, 0.9),
                new THREE.MeshBasicMaterial({ color: 0x060e14 })
            );
            rack.add(body);
            const wire = new THREE.LineSegments(
                new THREE.EdgesGeometry(body.geometry),
                new THREE.LineBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.35 })
            );
            body.add(wire);
            for (let l = 0; l < 10; l++) {
                const c = Math.random() < 0.2 ? 0xff0040 : Math.random() < 0.5 ? 0xffb000 : 0x00ff41;
                const light = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.08, 0.08),
                    new THREE.MeshBasicMaterial({ color: c, transparent: true })
                );
                light.position.set(-0.5 + Math.random() * 1, -1.2 + l * 0.28, 0.46);
                light.userData = { rate: 1.5 + Math.random() * 4, offset: Math.random() * 10 };
                body.add(light);
                blinkers.push(light);
            }
            rack.position.set(side === 0 ? -2.8 : 2.8, 0, -i * 2.4 - 2);
            group.add(rack);
        }
    }
    // floor grid
    const floor = new THREE.GridHelper(40, 40, 0x004422, 0x002211);
    floor.position.y = -1.6;
    group.add(floor);

    const files = [];
    return {
        group,
        enter(cam) { cam.position.set(0, 0.4, 4); cam.lookAt(0, 0, -10); },
        update(dt, t) {
            for (const b of blinkers) {
                b.material.opacity = 0.3 + 0.7 * Math.abs(Math.sin(t * b.userData.rate + b.userData.offset));
            }
            for (let i = files.length - 1; i >= 0; i--) {
                const f = files[i];
                f.position.z += dt * 7;
                f.rotation.x += dt * 2.4;
                f.rotation.y += dt * 1.8;
                if (f.position.z > 6) {
                    group.remove(f);
                    disposeGroup(f);
                    files.splice(i, 1);
                }
            }
        },
        event(name) {
            if (name === 'file') {
                const cube = new THREE.Mesh(
                    new THREE.BoxGeometry(0.45, 0.45, 0.45),
                    new THREE.MeshBasicMaterial({ color: 0x00ff41, wireframe: true })
                );
                const glow = new THREE.Mesh(
                    new THREE.BoxGeometry(0.7, 0.7, 0.7),
                    new THREE.MeshBasicMaterial({ color: 0x00ff41, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending })
                );
                cube.add(glow);
                cube.position.set((Math.random() - 0.5) * 2.5, -0.2 + Math.random() * 0.8, -30);
                group.add(cube);
                files.push(cube);
            }
        }
    };
}

function detectedScene(land) {
    const group = new THREE.Group();
    const globe = makeGlobe(0xff0040, land);
    group.add(globe);
    const traces = [];
    const tLat = 38 + Math.random() * 10, tLng = -100 + Math.random() * 20;
    for (let i = 0; i < 7; i++) {
        const lat = -55 + Math.random() * 110;
        const lng = -180 + Math.random() * 360;
        const pts = arcPoints(lat, lng, tLat, tLng, 64, 0.65);
        const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([pts[0]]),
            new THREE.LineBasicMaterial({ color: 0xff0040, transparent: true, opacity: 0.95 })
        );
        globe.add(line);
        traces.push({ line, pts, progress: 0, original: pts.map(p => p.clone()) });
    }
    const targetDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xff0040 })
    );
    targetDot.position.copy(latLngToVec3(tLat, tLng, GLOBE_RADIUS + 0.02));
    globe.add(targetDot);

    let phase = 'tracing';

    return {
        group,
        enter(cam) { cam.position.set(0, 0.5, 5.5); cam.lookAt(0, 0, 0); },
        update(dt, t) {
            globe.rotation.y += dt * 0.08;
            targetDot.scale.setScalar(1 + 0.6 * Math.sin(t * 8));
            for (const tr of traces) {
                if (phase === 'tracing') {
                    tr.progress = Math.min(1, tr.progress + dt * 0.35);
                    const count = Math.max(2, Math.floor(tr.pts.length * tr.progress));
                    tr.line.geometry.dispose();
                    tr.line.geometry = new THREE.BufferGeometry().setFromPoints(tr.pts.slice(0, count));
                } else if (phase === 'scatter') {
                    const arr = tr.line.geometry.attributes.position.array;
                    for (let i = 0; i < arr.length; i += 3) {
                        arr[i] += (Math.random() - 0.5) * 0.25;
                        arr[i + 1] += (Math.random() - 0.5) * 0.25;
                        arr[i + 2] += (Math.random() - 0.5) * 0.25;
                    }
                    tr.line.geometry.attributes.position.needsUpdate = true;
                    tr.line.material.opacity = Math.max(0, tr.line.material.opacity - dt * 0.5);
                }
            }
        },
        event(name) {
            if (name === 'scatter') phase = 'scatter';
        }
    };
}

function cleanupScene() {
    const group = new THREE.Group();
    const N = 2500;
    const positions = new Float32Array(N * 3);
    const velocities = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
        const r = 2 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        velocities[i * 3] = (Math.random() - 0.5) * 0.6;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0x00ff41, size: 0.05, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending });
    const points = new THREE.Points(geom, mat);
    group.add(points);

    return {
        group,
        enter(cam) { cam.position.set(0, 0, 9); cam.lookAt(0, 0, 0); },
        update(dt, t) {
            const arr = points.geometry.attributes.position.array;
            for (let i = 0; i < arr.length; i += 3) {
                arr[i] += velocities[i] * dt;
                arr[i + 1] += velocities[i + 1] * dt;
                arr[i + 2] += velocities[i + 2] * dt;
            }
            points.geometry.attributes.position.needsUpdate = true;
            mat.opacity = Math.max(0, mat.opacity - dt * 0.15);
            group.rotation.y += dt * 0.12;
        }
    };
}

/* ----------------- Main entry ----------------- */

export async function createHack3D(container) {
    const land = await loadLand();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02050a, 0.035);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020308, 1);

    const canvas = renderer.domElement;
    Object.assign(canvas.style, {
        position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '0',
        display: 'block',
    });
    container.appendChild(canvas);

    function resize() {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    resize();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    const factories = {
        INIT:      () => initScene(land),
        SCAN:      () => scanScene(),
        EXPLOIT:   () => exploitScene(),
        FIREWALL:  () => firewallScene(),
        EXFILTRATE:() => exfilScene(),
        DETECTED:  () => detectedScene(land),
        CLEANUP:   () => cleanupScene(),
    };

    let active = null;
    let shakeAmount = 0;
    let running = true;
    const clock = new THREE.Clock();

    function animate() {
        if (!running) return;
        const dt = Math.min(0.05, clock.getDelta());
        const t = clock.getElapsedTime();
        if (active?.scene?.update) active.scene.update(dt, t);
        if (shakeAmount > 0.001) {
            camera.position.x += (Math.random() - 0.5) * shakeAmount;
            camera.position.y += (Math.random() - 0.5) * shakeAmount;
            shakeAmount *= 0.9;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    function setScene(name) {
        const upper = (name || '').toUpperCase();
        if (active) {
            scene.remove(active.scene.group);
            disposeGroup(active.scene.group);
        }
        const factory = factories[upper];
        if (!factory) { active = null; return; }
        const s = factory();
        scene.add(s.group);
        if (s.enter) s.enter(camera);
        active = { name: upper, scene: s };
    }

    function event(name, data) {
        active?.scene?.event?.(name, data);
    }

    function shake(amount = 0.25) {
        shakeAmount = Math.max(shakeAmount, amount);
    }

    function dispose() {
        running = false;
        window.removeEventListener('resize', onResize);
        if (active) {
            scene.remove(active.scene.group);
            disposeGroup(active.scene.group);
        }
        renderer.dispose();
        canvas.remove();
    }

    return { setScene, event, shake, dispose };
}
