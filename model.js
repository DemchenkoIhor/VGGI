function Model(name) {
    this.iVertexBuffer = gl.createBuffer();
    this.count = 0;

    this.BufferData = function(vertices) {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STREAM_DRAW);

        this.count = vertices.length/3;
    }

    this.Draw = function() {

        gl.bindBuffer(gl.ARRAY_BUFFER, this.iVertexBuffer);
        gl.vertexAttribPointer(shProgram.iAttribVertex, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shProgram.iAttribVertex);
   
        gl.drawArrays(gl.LINE_STRIP, 0, this.count);
    }

    this.CreateSurfaceData = function() {
        let vertexGrid = [];
        let a = parseFloat(document.getElementById('aParameter').value);       // Parameter 'a' for the torus
        let r = parseFloat(document.getElementById('innerRadius').value);     // Torus radius
        let uSegments = parseInt(document.getElementById('segmentsCount').value);  
        let vSegments = parseInt(document.getElementById('segmentsCount').value); 
        let theta = parseFloat(document.getElementById('teta').value) * Math.PI;     
    
        // Generate vertex grid based on u and v parameters
        for (let i = 0; i <= uSegments; i++) {
            let u = -Math.PI + (2 * Math.PI * i) / uSegments;
            let x_u = a * Math.pow(Math.cos(u), 3);
            let z_u = a * Math.pow(Math.sin(u), 3);
            
            let row = [];
            for (let j = 0; j <= vSegments; j++) {
                let v = (2 * Math.PI * j) / vSegments;
    
                let X = (r + x_u * Math.cos(theta) - z_u * Math.sin(theta)) * Math.cos(v);
                let Y = (r + x_u * Math.cos(theta) - z_u * Math.sin(theta)) * Math.sin(v);
                let Z = x_u * Math.sin(theta) + z_u * Math.cos(theta);
    
                row.push([X, Y, Z]);
            }
            vertexGrid.push(row);
        }
    
        // Convert the vertex grid into a list of line segments
        let vertexList = [];
        for (let i = 0; i < uSegments; i++) {
            for (let j = 0; j < vSegments; j++) {
                // Connect points in the u-direction
                let current = vertexGrid[i][j];
                let nextU = vertexGrid[i + 1][j];
                vertexList.push(...current, ...nextU);
    
                // Connect points in the v-direction
                let nextV = vertexGrid[i][j + 1];
                vertexList.push(...current, ...nextV);
            }
        }
    
        this.BufferData(vertexList);
    }
    

}