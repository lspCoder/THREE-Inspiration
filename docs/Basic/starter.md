### THREEJS入门demo

#### 什么是THREEJS

​	  什么是WebGL。WebGL是在浏览器中实现三维效果的一套规范。使用WebGL原生的API来写3D程序是一件非常痛苦的事情，幸好，有很多同行花业余时间写了一些WebGL开源框架，其中three.js就是非常优秀的一个。

​     什么是threejs，很简单，你将它理解成three + js就可以了。three表示3D的意思，js表示javascript的意思。那么合起来，three.js就是使用javascript 来写3D程序的意思。

#### THREEJS的基本概念

##### 场景

​    场景（Scene）是我们创建三维场景的舞台

##### 相机

​     相机（Camera）是我们三维场景的观察者，简单来说就是我们的眼睛。再THREEJS中相机分为两种，一种是透视相机（PerspectiveCamera），一种是正交相机（OrthographicCamera）。简单来说透视相机看起来就是远大近小，符合我们真实世界，正交相机无论近看远看都是一样大小。应用场景一般是图纸或者三视图这种，需要与实物等比例大小。

##### 光

​     为了模拟真实的三维世界，我们还需要光（Light），有了光我们就能看到这个三维世界。

##### 渲染器

​      以上场景和相机都准备好后，我们需要把我们看到的样子绘制出来，这时候我们就需要渲染器（WebGLRenderer）进行渲染。当然THREEJS不只有webgl一种渲染器还有canvas（CanvasRenderer）的渲染器。

##### 图元

​     万物具备了，接下来我们总不能渲染一个空场景把。所以我们还需要三维世界的图元（Objects）。常见的基本图元有Mesh,Points,Line。我们可以想象一些三维世界的图形有哪些特征?首先应该具备大小，物体的长宽高，以及物体的颜色。这两个分别属于THREEJS里面的Geometery（顶点）和Material（材质）。这样才能完全展示一个物体。

#### THREEJS入门demo

按照上面的基础概念：

```javascript
function init() {
    initScene();
    initRenderer();
    initCamera();
    addObjects();
    render();
}
```

以下是全部代码:

<iframe height="265" style="width: 100%;" scrolling="no" title="THREEJS-starter" src="https://codepen.io/lspcoder/embed/mdJbEEr?height=265&theme-id=default&default-tab=js,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/lspcoder/pen/mdJbEEr'>THREEJS-starter</a> by lspCoder
  (<a href='https://codepen.io/lspcoder'>@lspcoder</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>