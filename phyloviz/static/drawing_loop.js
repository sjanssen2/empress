"use strict";

function loop() {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  shaderProgram.mvpMat = mat4.create();
  mat4.multiply(shaderProgram.mvpMat, shaderProgram.projMat, shaderProgram.viewMat);
  mat4.multiply(shaderProgram.mvpMat, shaderProgram.mvpMat, shaderProgram.worldMat);

  // gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniformMatrix4fv(shaderProgram.mvpUniform, false, shaderProgram.mvpMat);

  gl.bindBuffer(gl.ARRAY_BUFFER, shaderProgram.treeVertBuffer);
  gl.vertexAttribPointer(
    shaderProgram.positionAttribLocation, // Attribute location
    2, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  gl.vertexAttribPointer(
    shaderProgram.colorAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );


  gl.drawArrays(gl.LINES, 0, drawingData.edgeCoords.length / 5 );

  gl.bindBuffer(gl.ARRAY_BUFFER, shaderProgram.nodeVertBuffer);
  gl.vertexAttribPointer(
    shaderProgram.positionAttribLocation, // Attribute location
    2, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    0 // Offset from the beginning of a single vertex to this attribute
  );
  gl.vertexAttribPointer(
    shaderProgram.colorAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
  );

  gl.drawArrays(gl.POINTS, 0, drawingData.nodeCoords.length / 5 );
}

/*
 * Draws the tree
 */
function draw() {
  shaderProgram.viewMat  = mat4.create();
  const identityMat = mat4.create();
  let treeNormVec = vec3.create();

  vec3.set(treeNormVec, 1.0 / drawingData.largeDim * 3, 1.0 / drawingData.largeDim * 3, 1.0 / drawingData.largeDim * 3);
  mat4.fromScaling(shaderProgram.worldMat, treeNormVec);
  mat4.lookAt(shaderProgram.viewMat, [0,0,-5], [0,0,0],[0,1,0]);

  let rotateMat = mat4.create();
  const angle = Math.PI;
  mat4.rotate(rotateMat, identityMat, angle, [0,0,1]);
  mat4.mul(shaderProgram.worldMat, shaderProgram.worldMat, rotateMat);

  requestAnimationFrame(loop);
}

function setProjMat() {
  shaderProgram.projMat = mat4.create();
  mat4.perspective(shaderProgram.projMat, glMatrix.toRadian(45),
                   gl.canvas.width / gl.canvas.height,
                   0.1,10);
}