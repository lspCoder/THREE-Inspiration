function Home() {
    THREE.Group.apply(this, arguments);
    this.name = "Home";

    // 墙面的颜色
    this.wallColor = "#93886e";
    // 装饰的颜色
    this.decorateColor = "#cec4bd";

    this.decorateMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(this.decorateColor), side: THREE.DoubleSide, emissive: "#a8a09a" });
    this.wallMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(this.wallColor), side: THREE.DoubleSide, emissive: "#78705b" });


    this.createCross();
    this.createLoft();
    this.createRoof()
    this.createBody();
    this.createDoor();
    this.createWindow();
    this.createLogo();

    // 设置阴影
    this.setShadow(true);
}

Home.prototype = new THREE.Group();
Home.prototype.constructor = Home;

// 房屋主体
Home.prototype.createBody = function () {
    var body = new THREE.Group();
    var bodyFootGeomtery = new THREE.BoxGeometry(120, 5 ,100);

    // 房屋地基
    var bodyFootMesh = new THREE.Mesh(bodyFootGeomtery, this.decorateMaterial);
    // 房屋主体
    var bodyMainMesh = bodyFootMesh.clone();
    bodyMainMesh.material = this.wallMaterial;
    bodyMainMesh.position.y = 40;
    bodyMainMesh.scale.x = .9;
    bodyMainMesh.scale.y = 15;
    bodyMainMesh.scale.z = .9;
    body.add(bodyFootMesh);
    body.add(bodyMainMesh);


    this.add(body);
}

// 屋顶
Home.prototype.createRoof = function () {
    var roof = new THREE.Group();
    var mainGeometry = new THREE.CylinderGeometry(52.07, 52.07, 108, 3);

    // 屋顶主体
    var roofMainMesh = new THREE.Mesh(mainGeometry, this.wallMaterial);
    roofMainMesh.rotateZ(-Math.PI / 2);
    roofMainMesh.rotateY(Math.PI / 6);
    roofMainMesh.position.y = 103.38;

    // 屋顶斜边Back
    var roofBackSideGroup = new THREE.Group();
    // 屋顶白边
    var roofSideGeometry = new THREE.BoxGeometry(12, 5, 95);
    // 屋顶后边左白边
    var roofLeftSideMesh = new THREE.Mesh(roofSideGeometry, this.decorateMaterial);
    roofLeftSideMesh.position.x = 56;
    roofLeftSideMesh.position.y = 116.74;
    roofLeftSideMesh.position.z = 24.52;
    roofLeftSideMesh.rotateX(Math.PI / 3);

    // 屋顶后边右白边
    var roofRightSideMesh = roofLeftSideMesh.clone();
    roofRightSideMesh.rotateX(Math.PI / 3);
    roofRightSideMesh.position.z = -24;

    roofBackSideGroup.add(roofRightSideMesh);
    roofBackSideGroup.add(roofLeftSideMesh);
    roofBackSideGroup.position.y = 1.14;

    var roofFrontSideGroup = roofBackSideGroup.clone();
    roofFrontSideGroup.position.x = -112;

    // 屋顶侧面右下白边
    var roofBottomRSideGeometry = new THREE.BoxGeometry(124, 3, 8);
    var roofBottomRSideMesh = new THREE.Mesh(roofBottomRSideGeometry, this.decorateMaterial);
    roofBottomRSideMesh.position.y = 76.64;
    roofBottomRSideMesh.position.z = 48.64;

    // 侧面左下白边
    var roofBottomLSideMesh = roofBottomRSideMesh.clone();
    roofBottomLSideMesh.position.z = -48.22;

    roof.add(roofFrontSideGroup);
    roof.add(roofBackSideGroup);
    roof.add(roofBottomRSideMesh);
    roof.add(roofBottomLSideMesh);
    roof.add(roofMainMesh);
    this.add(roof);
}

// 屋顶上的小阁楼
Home.prototype.createLoft = function () {
    var loftGroup = new THREE.Group();
    var loftTopGeometry = new THREE.CylinderBufferGeometry(2, 20, 40, 4);
    var loftTopMesh = new THREE.Mesh(loftTopGeometry, this.decorateMaterial);
    loftTopMesh.rotateY(Math.PI / 4);
    loftTopMesh.position.y = 40;

    var loftMiddleGeometry = new THREE.BoxGeometry(33, 5, 33);
    var loftMiddleMesh = new THREE.Mesh(loftMiddleGeometry, this.decorateMaterial);
    loftMiddleMesh.position.y = 20;

    var loftBottomGeometry = new THREE.BoxGeometry(30, 40, 30);
    var loftBottomMesh = new THREE.Mesh(loftBottomGeometry, this.wallMaterial);

    loftGroup.add(loftTopMesh);
    loftGroup.add(loftMiddleMesh);
    loftGroup.add(loftBottomMesh);
    loftGroup.position.x = -48;
    loftGroup.position.y = 150;
    this.add(loftGroup);
}

// 创建房顶的十字架
Home.prototype.createCross = function () {
    var cross = new THREE.Group();
    var boxHGeometry = new THREE.BoxGeometry(3, 3, 20);
    var boxVGeometry = new THREE.BoxGeometry(3, 25, 3);

    var boxHMesh = new THREE.Mesh(boxHGeometry, this.decorateMaterial);
    boxHMesh.position.y = 5;
    var boxVMesh = new THREE.Mesh(boxVGeometry, this.decorateMaterial);

    cross.add(boxHMesh);
    cross.add(boxVMesh);
    cross.position.x = -48;
    cross.position.y = 220;
    this.add(cross);
}

// 房屋的窗户，单独封装便于克隆创建
Home.prototype.createWindow = function () {
    // 窗户位置大小和旋转角度信息, [x, y, z, scale, angle]
    var positions = [
        [-55, 70, -25, .5, 0],    // 前左窗户
        [-55, 70, 25, .5, 0],    // 前右窗户
        [-34, 40, 47, .6, Math.PI / 2],    // 房屋右侧窗户
        [-1, 40, 47, .6, Math.PI / 2],    // 房屋右侧窗户
        [32, 40, 47, .6, Math.PI / 2],    // 房屋右侧窗户
        [-34, 40, -47, .6, Math.PI / 2],    // 房屋左侧窗户
        [-1, 40, -47, .6, Math.PI / 2],    // 房屋左侧窗户
        [32, 40, -47, .6, Math.PI / 2],    // 房屋左侧窗户
        [-64, 148, 0, .5, 0],    // 小阁楼前侧窗户
        [-47, 148, -16, .5, Math.PI / 2],    // 小阁楼左侧窗户
        [-47, 148, 16, .5, Math.PI / 2],    // 小阁楼右侧窗户
    ]
    for (let index = 0; index < positions.length; index++) {
        const p = positions[index];
        var windowMesh = this.createWindowShape();
        windowMesh.position.set(p[0], p[1], p[2]);
        windowMesh.scale.set(p[3], p[3], p[3]);
        windowMesh.rotateY(p[4]);
        this.add(windowMesh);
    }
}

// 房屋的门
Home.prototype.createDoor = function () {
    var doorHeight = 40;
    var doorGroup = this.createDoorShape(doorHeight);
    doorGroup.position.x = -57;
    doorGroup.position.y = 20;

    // 门内图案
    var shape = new THREE.Shape();
    shape.moveTo(13, -20);
    shape.lineTo(13, 20);
    shape.arc(-13, 0, 13, 0, Math.PI, false);
    shape.moveTo(-13, 20);
    shape.lineTo(-13, -20);
    shape.lineTo(13, -20);

    var geometry = new THREE.ShapeGeometry(shape);
    // var doorMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    var doorMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(this.decorateColor), side: THREE.DoubleSide, emissive: "#a8a09a" })
    this.createDoorTexture();
    doorMaterial.map = this.doorTexture;
    // 设置纹理坐标???
    // https://stackoverflow.com/questions/33803280/three-js-how-do-i-scaling-and-offset-my-image-textures
    // https://github.com/mrdoob/three.js/issues/1847
    doorMaterial.map.repeat.x = 0.04;
    doorMaterial.map.repeat.y = 0.02;
    doorMaterial.map.offset.x = 0.50;
    doorMaterial.map.offset.y = 0.30;
    var mesh = new THREE.Mesh(geometry, doorMaterial);
    window.doorMesh = mesh;
    mesh.rotateY(Math.PI / 2);
    doorGroup.add(mesh);

    this.add(doorGroup);
}

Home.prototype.createDoorTexture = function () {
    var canvas = document.createElement("canvas");
    // 不需要加到dom中,调试用
    // canvas.style.position = "absolute";
    // canvas.style.top = "0";
    // canvas.style.left = "0";
    // document.body.appendChild(canvas);

    canvas.width = 256;
    canvas.height = 512;
    var context = canvas.getContext('2d');
    context.translate(canvas.width / 2, canvas.height / 2);

    context.fillStyle = this.decorateColor;
    context.arc(0, -canvas.width / 2, canvas.width / 2, 0, Math.PI, true);
    context.fill();
    
    context.beginPath();
    context.fillRect(-canvas.width / 2, -canvas.width / 2, canvas.width, canvas.height - canvas.width / 2);

    context.lineWidth = 5;
    context.strokeStyle = "rgb(90,90,90)";

    context.beginPath();
    context.moveTo(-context.lineWidth / 2, -canvas.height / 2);
    context.lineTo(-context.lineWidth / 2, canvas.height / 2);
    context.stroke();
    context.closePath();

    context.beginPath();
    // 左下方框
    context.moveTo(14, 192);
    context.rect(14, 192, 100, 50);
    // 右下方框
    context.moveTo(-114, 192);
    context.rect(-114, 192, 100, 50);
    // 左上方框
    context.moveTo(-14, -canvas.width / 2);
    context.arc(-64, -canvas.width / 2, 50, 0, Math.PI, true);
    context.lineTo(-114, 175);
    context.lineTo(-14, 175);
    context.lineTo(-14, -canvas.width / 2);
    // 左下方框
    context.moveTo(114 - context.lineWidth / 2, canvas.width / 2);
    context.arc(64 - context.lineWidth / 2, -canvas.width / 2, 50, 0, Math.PI, true);
    context.lineTo(14 - context.lineWidth / 2, 175);
    context.lineTo(114 - context.lineWidth / 2, 175);
    context.lineTo(114 - context.lineWidth / 2, -125);

    context.stroke();
    context.closePath();

    this.doorTexture = new THREE.CanvasTexture(canvas);
}

// 房屋门上的标志
Home.prototype.createLogo = function () {
    var group = new THREE.Group();
    group.name = "logo";
    // 标志圆环
    var geometry = new THREE.TorusBufferGeometry(11, 3, 5, 50);
    var torus = new THREE.Mesh(geometry, this.decorateMaterial);
    torus.position.x = -60;
    torus.position.y = 105;
    torus.rotateY(Math.PI / 2);
    group.add(torus);

    // 标志内图案
    this.createLogoTexture();
    var geometry = new THREE.CircleBufferGeometry(9, 32);
    var logoMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
    logoMaterial.map = this.logoTexture;
    var circle = new THREE.Mesh(geometry, logoMaterial);
    circle.rotateY(Math.PI / 2);
    circle.position.x = -60;
    circle.position.y = 105;
    group.add(circle);
    this.add(group);
}

// 创建门上的logo纹理
Home.prototype.createLogoTexture = function () {
    var canvas = document.createElement("canvas");
    // 不需要加到dom中,调试用
    // canvas.style.position = "absolute";
    // canvas.style.top = "0";
    // canvas.style.left = "0";
    // document.body.appendChild(canvas);

    canvas.width = 256;
    canvas.height = 256;
    var context = canvas.getContext('2d');
    context.translate(canvas.width / 2, canvas.height / 2);
    context.fillStyle = '#FFFFFF';
    context.arc(0, 0, canvas.width / 2, 0, Math.PI * 2);
    context.fill();
    // 圆心
    context.beginPath();
    context.fillStyle = this.wallColor;
    context.arc(0, 0, 20, 0, Math.PI * 2);
    context.fill();
    context.closePath();

    for (let index = 0; index < 8; index++) {
        context.rotate(Math.PI / 4);
        // 外部半圆
        context.beginPath();
        context.moveTo(0, -92);
        context.arc(0, -92, 30, 0, Math.PI, true);
        context.fill();

        // 三角形图案
        context.beginPath();
        context.moveTo(0, -20);
        context.lineTo(-30, -93);
        context.lineTo(30, -93);
        context.fill();

        // 小圆圈
        context.beginPath();
        context.moveTo(45, -105);
        context.arc(45, -105, 5, 0, Math.PI * 2, true);
        context.fill();
    }

    this.logoTexture = new THREE.CanvasTexture(canvas);
}

// 创建门和窗的基础模型，上半圆下边矩形
Home.prototype.createDoorShape = function (height) {
    var result = new THREE.Group();
    var cylinderGeometry = new THREE.TorusGeometry(15, 3, 20, 150, Math.PI); 
    var topMesh = new THREE.Mesh(cylinderGeometry, this.decorateMaterial);

    topMesh.rotateY(Math.PI / 2);
    topMesh.position.y = height / 2;
    result.add(topMesh);
    
    var leftBorderGeometry = new THREE.CylinderGeometry(3, 3, height, 30);
    var leftBoderMesh = new THREE.Mesh(leftBorderGeometry, this.decorateMaterial);
    leftBoderMesh.position.z = -15;
    result.add(leftBoderMesh);

    var rightBorderMesh = leftBoderMesh.clone();
    rightBorderMesh.position.z = 15;
    result.add(rightBorderMesh);

    return result;
}

// 同门模型一样，窗模型加入了底部横梁
Home.prototype.createWindowShape = function () {
    var windowGroup = this.createDoorShape(20);

    var bottomBorderGeometry = new THREE.BoxGeometry(10, 5, 40);
    var bottomBorderMesh = new THREE.Mesh(bottomBorderGeometry, this.decorateMaterial);
    bottomBorderMesh.position.y = -10;
    windowGroup.add(bottomBorderMesh);

    return windowGroup;
}

// 递归循环设置所有孩子的投射阴影
Home.prototype.setShadow = function (isOpenShadow) {
    function loop(parent) {
        for (var i = 0; i < parent.children.length; i++) {
            var object = parent.children[i];
            object.castShadow = isOpenShadow;
            object.receiveShadow = isOpenShadow;
            if (object.children.length) {
                loop(object);
            }
        }
    }
    loop(this);
}
