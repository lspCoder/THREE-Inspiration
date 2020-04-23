let scene, renderer, camera, hemiLight, dirLight, controls;
var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

let debug = false;
var gui = new dat.GUI();


function init() {
    initScene();
    initRenderer();
    initCamera();
    initLights();
    addControls();
    addObjects();
    render();
    onWindowResize();

    if (debug) {
        var gridHelper = new THREE.GridHelper(320, 32)
        scene.add(gridHelper);
        window.scene = scene;
    }
}

init();

function initScene() {
    scene = new THREE.Scene();
    scene.position.y = -80;

    if (debug) {
        var axesHelper = new THREE.AxesHelper(500);
        scene.add(axesHelper);
    }
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true // 抗锯齿
    });
    // 设置dom容器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);    //高分屏失真问题
    renderer.setClearColor(0x096DD9);
    // 打开渲染器阴影
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    // near,far的值会影响深度闪烁问题,可根据效果微调
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 2, 10000);

    camera.up.set(0, 1, 0); //默认Y轴向上
    camera.rotateY(Math.PI / 4);
    camera.position.set(-470, 240, 233);
    camera.lookAt(scene.position);
    scene.add(camera);
    camera.updateProjectionMatrix();

    if (debug) {
        var cameraHelper = new THREE.CameraHelper(camera);
        scene.add(cameraHelper);

        var cameraGui = gui.addFolder("camera position");
        cameraGui.add(camera.position, 'x');
        cameraGui.add(camera.position, 'y');
        cameraGui.add(camera.position, 'z');
        cameraGui.open();
    }
}

function initLights() {
    // 环境光
    scene.add(new THREE.AmbientLight(0x666666, .5));

    // 定向光
    dirLight = new THREE.DirectionalLight(0xffffff, .5);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-20, 30, -10);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    // 开启灯光投射阴影
    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    dirLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    var d = 300;

    // 设置阴影相机大小,即阴影照射范围
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 3000;
    // 阴影贴图偏差,默认0,适当调整可减少阴影中的残影
    dirLight.shadow.bias = -0.0001;

    if (debug) {
        var dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 5);
        scene.add(dirLightHelper);

        var shadowCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
        scene.add(shadowCameraHelper);

        const onChange = () => {
            dirLightHelper.update();
            shadowCameraHelper.update();
            dirLight.target.updateMatrixWorld();
        };

        onChange();

        var dirLightGui = gui.addFolder("DirectionalLight position");
        dirLightGui.add(dirLight.position, 'x').onChange(onChange);
        dirLightGui.add(dirLight.position, 'y').onChange(onChange);
        dirLightGui.add(dirLight.position, 'z').onChange(onChange);
        dirLightGui.open();

        var dirTargetGui = gui.addFolder("DirectionalLight target position");
        dirTargetGui.add(dirLight.target.position, 'x').onChange(onChange);
        dirTargetGui.add(dirLight.target.position, 'y').onChange(onChange);
        dirTargetGui.add(dirLight.target.position, 'z').onChange(onChange);
        dirTargetGui.open();

        var dirIntensityGui = gui.addFolder("DirectionalLight intensity position");
        dirIntensityGui.add(dirLight, 'intensity').onChange(onChange);
        dirIntensityGui.open();
    }
}

function render() {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(render);
}

function addControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.maxPolarAngle = 0.9 * Math.PI / 2;
    controls.target.set(0, 5, 0);
    controls.update();
}

// 自适应
function onWindowResize() {
    window.addEventListener('resize', function () {
        width = window.innerWidth;
        height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    })
}


function addObjects() {
    addGround();
    addGrassland();
    addTrees();
    addChairs();
    addHome();
}

// 添加地面
function addGround() {
    var geometry = new THREE.BoxGeometry(200, 250, 3);
    var material = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(173,146,167)"), side: THREE.DoubleSide, emissive: "#5a5a5a" });
    var plane = new THREE.Mesh(geometry, material);
    // 打开接受阴影
    plane.receiveShadow = true;
    plane.rotation.x = Math.PI * -.5;
    scene.add(plane);
}

// 添加草地
function addGrassland() {
    var geometry = new THREE.BoxGeometry(150, 200, 3);
    var material = new THREE.MeshLambertMaterial({ color: new THREE.Color("rgb(225,229,93)"), side: THREE.DoubleSide, emissive: "#389e0d" });
    var plane = new THREE.Mesh(geometry, material);
    // 打开接受阴影
    plane.receiveShadow = true;
    plane.rotation.x = Math.PI * -.5;
    plane.position.y = 1;
    scene.add(plane);
}

// 添加树木
function addTrees() {
    var positions = [
        [50, 80],
        [50, -80],
        [-50, 80],
        [-50, -80],
    ]

    for (let index = 0; index < positions.length; index++) {
        const p = positions[index];
        var tree = new Tree();
        tree.position.set(p[0], 5, p[1]);
        scene.add(tree);
    }
}

// 添加椅子
function addChairs() {
    var positions = [
        [-50, 45],
        [-50, -45],
    ]
    for (let index = 0; index < positions.length; index++) {
        const p = positions[index];
        var chair = new Chair();
        chair.position.set(p[0], 10, p[1]);
        chair.rotateY(THREE.Math.degToRad(90));
        scene.add(chair);
    }
}

// 添加房屋
function addHome() {
    var home = new Home();
    home.position.set(15, 2, 0);
    scene.add(home);
}
