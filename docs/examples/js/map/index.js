let scene, renderer, camera, controls,cube;

init();
function init() {
    initScene();
    initRenderer();
    initCamera();
    initControls();
    // addObjects();
    render();
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    window.scene = scene;

    var gridHelper = new THREE.GridHelper(300);
    scene.add(gridHelper);
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true // 抗锯齿
    });
    // 设置dom容器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);    //高分屏失真问题
    renderer.setClearColor(0x131313);
    document.body.appendChild(renderer.domElement);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);

    camera.position.set(0, 0, 100);

    scene.add(camera);
}

function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

/* 封装ajax函数
 * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 * @param {string}opt.url 发送请求的url
 * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 * @param {object}opt.data 发送的参数，格式为对象类型
 * @param {function}opt.success ajax发送并接收成功调用的回调函数
 */
function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () { };
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    } var params = [];
    for (var key in opt.data) {
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    }
    else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    }
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            opt.success(xmlHttp.responseText);
        }
    };
}


//经纬度转墨卡托
function _getMercator(poi) {//[114.32894, 30.585748]
    var mercator = [];
    var earthRad = 6378137.0;
    // console.log("mercator-poi",poi);
    mercator[0] = poi[0] * Math.PI / 180 * earthRad;
    var a = poi[1] * Math.PI / 180;
    mercator[1] = earthRad / 2 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
    // console.log("mercator",mercator);
    return mercator; //[12727039.383734727, 3579066.6894065146]
}

//墨卡托转经纬度
function _getLngLat(poi) {
    var lnglat = [];
    lnglat[0] = poi[0] / 20037508.34 * 180;
    var mmy = poi[1] / 20037508.34 * 180;
    lnglat[1] = 180 / Math.PI * (2 * Math.atan(Math.exp(mmy * Math.PI / 180)) - Math.PI / 2);
    return lnglat;
}

/**
 * 
 * http://datav.aliyun.com/tools/atlas/#&lat=37.16031654673677&lng=103.4912109375&zoom=4
 */
ajax({
    url: "https://geo.datav.aliyun.com/areas/bound/100000_full.json",
    method: "GET",
    success: function (result) {
        var data = JSON.parse(result);
        console.log(data);
        // createMap(data);

        var planet = new THREE.Object3D();

        //Create a sphere to make visualization easier.
        var geometry = new THREE.SphereGeometry(10, 32, 32);
        var material = new THREE.MeshBasicMaterial({
            color: 0x333333,
            // wireframe: true,
            transparent: true
        });
        var sphere = new THREE.Mesh(geometry, material);
        planet.add(sphere);

        scene.add(planet);

        drawThreeGeo(data, 10, 'sphere', {
            color: 0x80FF80
        }, planet);
    }
})

function createMap(data) {
    data.features.forEach(function (feature) {
        const province = new THREE.Object3D();
        const coordinates = feature.geometry.coordinates;
        coordinates.forEach(function (multiPolygon) {
            multiPolygon.forEach(function (polygon) {
                const shape = new THREE.Shape()
                const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
                const linGeometry = new THREE.Geometry()
                for (let i = 0; i < polygon.length; i++) {
                    const [x, y] = _getMercator(polygon[i]);
                    if (i === 0) {
                        shape.moveTo(x, -y)
                    }
                    shape.lineTo(x, -y);
                    linGeometry.vertices.push(new THREE.Vector3(x, -y, 4.01))
                }
                const extrudeSettings = {
                    depth: 4,
                    bevelEnabled: false
                };
                const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
                const material = new THREE.MeshBasicMaterial({ color: '#d13a34', transparent: true, opacity: 0.6 })
                const mesh = new THREE.Mesh(geometry, material)
                const line = new THREE.Line(linGeometry, lineMaterial)
                province.add(mesh)
                province.add(line);
            })
        })
        province.properties = feature.properties;
        scene.add(province);
    })
}

function addObjects() {
    let geometry = new THREE.CubeGeometry(5, 5, 5);
    let material = new THREE.MeshNormalMaterial({
        color: 0x999999
    })
    cube = new THREE.Mesh(geometry, material);
    cube.rotateY(180);
    cube.rotateX(90);

    scene.add(cube);
}