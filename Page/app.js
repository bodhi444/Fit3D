const arrScene = []; // array of scenes - {scene, canvas, name, idx }

const createScene = function(canvas, name, idx) {
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Initial camera position doesn't matter much as we will reposition it later
    const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener("resize", function() {
        engine.resize();
    });

    arrScene.push({"scene": scene, "name": name, "idx": idx, "canvas": canvas});

    return scene;
};

const positionCamera = function(camera, boundingBox) {
    const dimensions = boundingBox.maximumWorld.subtract(boundingBox.minimumWorld);

    // Calculate the area of each face
    const areaXY = dimensions.x * dimensions.y;
    const areaYZ = dimensions.y * dimensions.z;
    const areaZX = dimensions.z * dimensions.x;

    // Determine the largest face by area
    const maxArea = Math.max(areaXY, areaYZ, areaZX);

    let direction, upVector;
    if (maxArea === areaXY) {
        // Largest face is XY, so we look along the Z-axis
        direction = new BABYLON.Vector3(0, 0, 1);
        upVector = new BABYLON.Vector3(0, 1, 0); // Assuming Y is up
    } else if (maxArea === areaYZ) {
        // Largest face is YZ, so we look along the X-axis
        direction = new BABYLON.Vector3(1, 0, 0);
        upVector = new BABYLON.Vector3(0, 1, 0); // Assuming Y is up
    } else {
        // Largest face is ZX, so we look along the Y-axis (assuming Y is up)
        direction = new BABYLON.Vector3(0, 1, 0);
        upVector = new BABYLON.Vector3(0, 0, 1); // Z becomes up if we're looking along Y
    }

    // Calculate the center of the bounding box
    const center = boundingBox.centerWorld;

    // Offset camera position by the largest dimension to ensure it's not inside the bounding box
    const largestDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);
    const positionOffset = direction.scale(largestDimension * 1.5); // Adjust scale factor as needed

    // Set camera position and target
    camera.position = center.add(positionOffset);
    camera.setTarget(center);
    camera.upVector = upVector;
};


const loadModel = function(scene, fileName) {
    BABYLON.SceneLoader.ImportMesh("", "./", fileName, scene, function(newMeshes) {
        if (newMeshes.length > 0) {
            const mesh = newMeshes[0];
            const boundingBox = mesh.getBoundingInfo().boundingBox;
            positionCamera(scene.activeCamera, boundingBox);
        }
    });
};

const draw3DObjects = function() {
    loadModel(arrScene[0].scene, "base.obj");
    loadModel(arrScene[1].scene, "dressed.obj");
};

const init = function() {
    document.querySelectorAll('.canvas-container').forEach((container, idx) => {
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        createScene(canvas, container.id, idx);
    });
    draw3DObjects();
    loadGirths();

};

async function getGrithPoints(pointsJson, girthName) {
    try {
        const response = await fetch("./" + pointsJson); // Adjust the path as needed
        const data = await response.json();

        const girth = data.body.result.metrics.girths.find(item => item.label === girthName);
        if (girth && girth.pointcollection) {
            return girth.pointcollection[0];
        } else {
            console.log(`Girth with name '${girthName}' not found.`);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

async function render3DPoints(scene, points, color, bconfigCamera, scalingFactor = 1) {
    const pointsVector3 = points.map(p => new BABYLON.Vector3(p.x, p.y, p.z));
    // Apply scaling factor to each point
    const scaledPoints = points.map(p => new BABYLON.Vector3(p.x * scalingFactor, p.y * scalingFactor, p.z * scalingFactor));

    // Create lines from the points
    const lines = BABYLON.MeshBuilder.CreateLines("lines", {
        points: scaledPoints,
        updatable: true
    }, scene);

    // Set the color of the lines
    lines.color = new BABYLON.Color3(color.r, color.g, color.b);
    lines.alwaysSelectAsActiveMesh = true;
    lines.material.depthWrite = false;
    // lines.material.depthFunction = BABYLON.Engine.ALWAYS;

    // Calculate the bounding box of the points
    const boundingInfo = lines.getBoundingInfo();
    const boundingBox = boundingInfo.boundingBox;

    // Adjust the camera to fit the points
    if( bconfigCamera )
        fitCameraToBoundingBox(scene.activeCamera, boundingBox);
}

function fitCameraToBoundingBox(camera, boundingBox) {
    const center = boundingBox.centerWorld;
    const extent = boundingBox.maximumWorld.subtract(boundingBox.minimumWorld);
    const maxDimension = Math.max(extent.x, extent.y, extent.z);
    const direction = camera.position.subtract(camera.getTarget()).normalize();
    const radius = maxDimension * 2; // Scale as needed to ensure the points are within view

    // Set the camera's target to the center of the bounding box
    camera.setTarget(center);

    // Position the camera such that the points are comfortably within view
    camera.position = center.subtract(direction.scale(radius));
    camera.radius = radius; // For ArcRotateCamera to control the zoom level based on the points' spread
}


async function loadGirths() {
    const girths = [
        ["girth-chest", "Chest Contoured","UA_women_scaled1.json", "UA_women_with_dress_r.json", {r: 0, g: 1, b: 0},  {r: 0, g: 0, b: 1}],
        ["girth-bust", "Bust Contoured", "UA_women_scaled1.json", "UA_women_with_dress_r.json", {r: 0, g: 1, b: 0},  {r: 0, g: 0, b: 1}],
        ["girth-waist", "Waist Contoured","UA_women_scaled1.json", "UA_women_with_dress_r.json", {r: 0, g: 1, b: 0},  {r: 0, g: 0, b: 1}],
        ["girth-hip", "Hip Contoured", "UA_women_scaled1.json", "UA_women_with_dress_r.json", {r: 0, g: 1, b: 0},  {r: 0, g: 0, b: 1}],
        ["girth-butt", "Butt Contoured","UA_women_scaled1.json", "UA_women_with_dress_r.json", {r: 0, g: 1, b: 0},  {r: 0, g: 0, b: 1}],
// Add other girths as needed...
    ];
    const basescene =  arrScene[0].scene;
    const dressedscene = arrScene[1].scene;
    girths.forEach(async (girth) => {
        const sceneContainer = arrScene.find(sc => sc.name === girth[0]);
        if (sceneContainer) {
            const points1 = await getGrithPoints(girth[2], girth[1]);
            const points2 = await getGrithPoints(girth[3], girth[1]);
            await render3DPoints(sceneContainer.scene, points1, girth[4], true);
            await render3DPoints(basescene, points1, girth[4], false, 0.1);
            await render3DPoints(sceneContainer.scene, points2, girth[5], true);
            await render3DPoints(dressedscene, points2, girth[5], false, 0.1);
            renderIntersectionPoints(sceneContainer.scene, points1,  {r: 1, g: 1, b: 0}, 1);
            renderIntersectionPoints(sceneContainer.scene, points2,  {r: 0, g: 1, b: 1}, 1);
            renderIntersectionPoints(basescene, points1,  {r: 1, g: 1, b: 0}, 0.1);
            renderIntersectionPoints(dressedscene, points2,  {r: 0, g: 1, b: 1}, 0.1);
        }
    });

    
}

/**
 * Finds intersection points of a line with a specified plane (X=0 or Z=0).
 * @param {Array} points - An array of points forming the line.
 * @param {String} axis - The axis along which the plane is defined ('X' or 'Z').
 * @param {Number} planeValue - The value on the specified axis where the plane is located (usually 0 for X=0 or Z=0 planes).
 * @returns {Array} An array of intersection points.
 */
function findIntersections(points, axis, planeValue) {
    let intersections = [];

    for (let i = 0; i < points.length - 1; i++) {
        const start = points[i];
        const end = points[i + 1];

        // Check for intersection with the specified plane.
        if (axis === 'X') {
            // Check if the line crosses the X=planeValue plane.
            if ((start.x <= planeValue && end.x >= planeValue) || (start.x >= planeValue && end.x <= planeValue)) {
                const t = (planeValue - start.x) / (end.x - start.x);
                const y = start.y + t * (end.y - start.y);
                const z = start.z + t * (end.z - start.z);
                intersections.push({ x: planeValue, y, z });
            }
        } else if (axis === 'Z') {
            // Check if the line crosses the Z=planeValue plane.
            if ((start.z <= planeValue && end.z >= planeValue) || (start.z >= planeValue && end.z <= planeValue)) {
                const t = (planeValue - start.z) / (end.z - start.z);
                const x = start.x + t * (end.x - start.x);
                const y = start.y + t * (end.y - start.y);
                intersections.push({ x, y, z: planeValue });
            }
        }
    }

    return intersections;
}

function renderIntersectionPoints(scene, points, color, scalingFactor) {
    // Step 1: Calculate Intersection Points
    const z0Intersections = findIntersections(points, 'Z', 0);
    const x0Intersections = findIntersections(points, 'X', 0);
    // find max x 
    const pointx = z0Intersections[0];
    // intersection points on plane represented by max x/2 <= Princess plane
    const xmidIntersections = findIntersections(points, 'X', pointx.x/2  );
    const x_midIntersections = findIntersections(points, 'X', pointx.x/2 * -1 );

    // Step 2: Render Intersection Points
    z0Intersections.forEach(point => renderPoint(scene, point, color, scalingFactor));
    x0Intersections.forEach(point => renderPoint(scene, point, color, scalingFactor));
    xmidIntersections.forEach(point => renderPoint(scene, point, color, scalingFactor));
    x_midIntersections.forEach(point => renderPoint(scene, point, color, scalingFactor));


}

function renderPoint(scene, point, color, scalingFactor) {
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {diameter: 10*scalingFactor}, scene);
    sphere.position = new BABYLON.Vector3(point.x * scalingFactor, point.y * scalingFactor, point.z * scalingFactor);
    sphere.material = new BABYLON.StandardMaterial("material", scene);
    sphere.material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
}


function findIntersectionPoints(points) {
    let intersectionsY = []; // Intersections with Y=0 plane
    let intersectionsZ = []; // Intersections with Z=0 plane

    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        // Intersection with Y=0
        if ((p1.y > 0 && p2.y < 0) || (p1.y < 0 && p2.y > 0)) {
            const fraction = Math.abs(p1.y) / (Math.abs(p1.y) + Math.abs(p2.y));
            intersectionsY.push({
                x: p1.x + (p2.x - p1.x) * fraction,
                y: 0,
                z: p1.z + (p2.z - p1.z) * fraction
            });
        }

        // Intersection with Z=0
        if ((p1.z > 0 && p2.z < 0) || (p1.z < 0 && p2.z > 0)) {
            const fraction = Math.abs(p1.z) / (Math.abs(p1.z) + Math.abs(p2.z));
            intersectionsZ.push({
                x: p1.x + (p2.x - p1.x) * fraction,
                y: p1.y + (p2.y - p1.y) * fraction,
                z: 0
            });
        }
    }

    return { intersectionsY, intersectionsZ };
}

function calculateMinimumDistance(point1, pointsSet2) {
    let minDistance = Infinity; // Start with a very large number

    pointsSet2.forEach(point2 => {
        // distance = sqrt( x^2 + x^2 + y^2 )
        const distance = Math.sqrt(
            Math.pow(point1.x - point2.x, 2) +
            Math.pow(point1.y - point2.y, 2) +
            Math.pow(point1.z - point2.z, 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
        }
    });

    return minDistance;
}

init();
