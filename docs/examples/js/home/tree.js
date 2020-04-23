function Tree() {

    THREE.Group.apply(this, arguments);

    this.name = "Tree";

    this.createLeaf();
    this.createTrunk();
}

Tree.prototype = new THREE.Group();
Tree.prototype.constructor = Tree;

// 创建树叶(球体)
Tree.prototype.createLeaf = function () {
    var geometry = new THREE.SphereGeometry(10, 32, 32);
    var material = new THREE.MeshPhongMaterial({ color: new THREE.Color("rgb(148,166,87)"), side: THREE.DoubleSide, emissive: "#737f4a", shininess: 50 });
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.y = 25;
    // 打开投射阴影
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    this.add(sphere);
}

// 创建树干(圆柱体)
Tree.prototype.createTrunk = function () {
    var geometry = new THREE.CylinderBufferGeometry(3, 3, 22, 32);
    var material = new THREE.MeshPhongMaterial({ color: new THREE.Color("rgb(92,46,3)"), side: THREE.DoubleSide, emissive: "#94561c", shininess: 50 });
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.y = 7;
    // 打开投射阴影
    cylinder.castShadow = true;
    cylinder.receiveShadow = true;
    this.add(cylinder);
}