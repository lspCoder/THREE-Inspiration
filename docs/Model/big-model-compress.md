### 大模型文件压缩优化

#### 常见三维模型的格式

- OBJ：OBJ文件是Alias|Wavefront公司为它的一套基于工作站的3D建模和动画软件"AdvancedVisualizer"开发的一种标准3D模型文件格式，**很适合用于3D软件模型之间的互导**，也可以通过Maya读写。比如Smart3D里面生成的模型需要修饰，可以输出OBJ格式，之后就可以导入到3dsMax进行处理；或者在3dsMax中建了一个模型，想把它调到Maya里面渲染或动画，导出OBJ文件就是一种很好的选择。

  OBJ文件一般包括三个子文件，分别是.obj、.mtl、.jpg，除了模型文件，还需要.jpg纹理文件。但是不支持动画导出，只是静态模型文件。

- FBX：弥补OBJ的不足，支持导出骨骼动画。

- GLTF：即图形语言交换格式，它是一种3D内容的格式标准，由**Khronos Group**管理（Khronos Group还管理着OpenGL系列、OpenCL等重要的行业标准）；对OpenGL ES、WebGL非常友好；并且这个格式的目标是要做成3D领域的JPEG。

  ![img](https://pic4.zhimg.com/80/v2-60c6b090591985b8bbdb6502daa7d10f_720w.jpg)

#### 模型压缩

由上图可以看出gltf分为两部分一个描述场景，相机和mesh的一些信息，真实数据放在bin文件以二进制保存的，因为是二进制数据，因此gltf模型比较小。

对于大的gltf文件我们还可以进一步压缩，可以使用谷歌的draco压缩算法，能大幅压缩模型文件的大小。这里我们使用gltf-pipeline来压缩gltf，这个工具可以使用draco算法大幅压缩文件大小。首先我们先安装gltf-pipeline:

```bash
npm install -g gltf-pipeline
```

该工具支持gltf,glb和draco gltf互转。

```bash
# Converting a glTF to Draco glTF
gltf-pipeline -i model.gltf -o modelDraco.gltf -d -s
```

更多gltf-pipeline请参考https://github.com/CesiumGS/gltf-pipeline/blob/master/README.md

#### 加载模型

我们需要额外引入GLTFLoader和DRACOLoader并且需要引入draco编码解码器

```markdown
* `draco_decoder.js` — Emscripten-compiled decoder, compatible with any modern browser.
* `draco_decoder.wasm` — WebAssembly decoder, compatible with newer browsers and devices.
* `draco_wasm_wrapper.js` — JavaScript wrapper for the WASM decoder.
```

核心代码如下：

```javascript
let loader = new THREE.GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
THREE.DRACOLoader.setDecoderPath("./libs/draco/");
loader.setDRACOLoader(new THREE.DRACOLoader());

// Optional: Pre-fetch Draco WASM/JS module, to save time while parsing.
THREE.DRACOLoader.getDecoderModule();

loader.load(url, callback)
```
以下是代码示例:

[demo](../examples/model-draco.html ':include :type=iframe width=100% height=400px')
