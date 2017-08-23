var canvas;
var gl;
var shaderProgram;
var triangleVertexPostionBuffer;
var sqareVertexPositionBuffer;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function start(){
  canvas = document.getElementById("glcanvas");
  gl=initGL(canvas);
  if(gl){
    console.log("webgl enabled");
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    initShaders();
    //initBuffers();
    //setInterval(drawScene, 15);
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }else{
    console.log("webgl not enabled");
  }
}

function initGL(canvas){
  gl = null;
  try{
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl2")  || canvas.getContext("experimental-webgl") || canvas.getContext("webgl2");
  }catch(e){}

  if(!gl){
    alert("Unable to initialize WebGL, Your browser may not support it.");
  }

  return gl;
}

function getShader(gl, id){
  var shaderScript = document.getElementById(id);

  if(!shaderScript){
    return null;
  }

  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while(currentChild){
    if(currentChild.nodeType == 3){
      shaderSource += currentChild.nextSibling;
    }
  }

  console.log("shader contents is: " + shaderSource);

  var shader;
  if(shaderScript.type == "x-shader/x-fragment"){
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }else if(shaderScript.type = "x-shader/x-vertex"){
    shader = gl.createShader(gl.VERTEX_SHADER);
  }else{
    return null;
  }

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function initShaders(){
  var fragmentShader = getShader(gl, "shader-fs");
  var vertextShader = getShader(gl, "shader-vs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertextShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
    alert("unable to initialize the shader program.");
    return null;
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");

  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function setMatrixUniforms(){
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function initBuffers(){
  triangleVertexPostionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPostionBuffer);
  var vertices = [
    0.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  triangleVertexPostionBuffer.itemSize = 3;
  triangleVertexPostionBuffer.numElements = 3;

  sqareVertexPositionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, sqareVertexPositionBuffer);
  vertices = [
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  sqareVertexPositionBuffer.itemSize = 3;
  sqareVertexPositionBuffer.numElements = 4;
}

function drawScene(){
  gl.viewPort(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
  mat4.identity(mvMatrix);

  mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPostionBuffer);
  gl.vertexAttributPointer(shaderProgram, vertexPositionAttribute,
       triangleVertexPostionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArray(gl.TRIANGLES, 0, triangleVertexPostionBuffer.numElements);

  mat4.translate(mvMatrix, [3.0, 0.0, -7.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, sqareVertexPositionBuffer);
  gl.vertexAttributPointer(shaderProgram, vertexPositionAttribute,
       sqareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  gl.drawArray(gl.TRIANGLES, 0, sqareVertexPositionBuffer.numElements);

}
