const crypto = require('crypto');
const fs = require('fs');
const url = require('url');
const srcPath = `./rootHTML/`;
const http = require('http');
const path = require('path');
const mimeTyps = require('./MIME-TYPE/all.json');
var httpServer = http.createServer((req, res) => {
    let URLInfo = url.parse(req.url)
    let filePath = path.join(srcPath,'./index.html');
    switch (URLInfo?.pathname) {
        case '/': break;
        default: filePath = path.join(srcPath, URLInfo?.pathname?.replace(/[.]{2,}\/|^\//gm, '') ?? ''); break;
    }
    console.log(`request: [${URLInfo.pathname}] -> File: ${filePath}`);
    var body = '';
    var GET = new URLSearchParams(url.parse(req.url).query);
    req.on('data', function (data) {
        body += data;
        /* 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB */
        if (body.length > 1e7) {
            /* FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST */
            req.socket.destroy();
        }
    });
    req.addListener('end', function () {
        var POST = '';
        try { POST = JSON.parse(body); } catch (error) { POST = body; }
        try {
            if (!fs.existsSync(filePath)){res.writeHead(404).end(); return;}
            let tmpBuffer = fs.readFileSync(filePath);
            let mimeType = mimeTyps.find(v=>{return v.Name.toLowerCase()==path.extname(filePath).replace(/^\./gm,'').toLowerCase()})?.Template??'application/octet-stream';
            res.setHeader('Content-Type',mimeType);
            res.setHeader("Content-Length",tmpBuffer.length);
            console.log(`Send Data -> MIME TYPE : ${mimeType} [${tmpBuffer.length}]`);
            res.writeHead(200);
            res.end(tmpBuffer);            
        } catch (error) {
            res.writeHead(500).end(JSON.stringify(error.message));
        }
    });
});
httpServer.listen(80, '0.0.0.0', () => { console.log(`Start Listening => ${httpServer.address().address}:${httpServer.address().port}`) });