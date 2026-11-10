const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer(function (req, res) {
    // Decodificar la URL para manejar espacios en nombres de archivos
    let filePath = '.' + decodeURI(req.url);
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.mp4': 'video/mp4',
        '.glb': 'model/gltf-binary', // Muy importante para que cargue el modelo 3D
        '.gltf': 'model/gltf+json'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('Archivo no encontrado');
            } else {
                res.writeHead(500);
                res.end('Error del servidor: '+error.code+' ..\n');
            }
        } else {
            // Añadir cabeceras para permitir cargar el modelo 3D sin problemas
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 SERVIDOR INICIADO CORRECTAMENTE`);
    console.log(`==================================================`);
    console.log(`Tu página ya está lista. Abre tu navegador y visita:`);
    console.log(`http://localhost:${PORT}`);
    console.log(`==================================================\n`);
});
