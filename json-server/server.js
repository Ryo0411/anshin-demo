// const fs = require('fs');
// const jsonServer = require('json-server');
// const https = require('https');

// const server = jsonServer.create();
// const router = jsonServer.router('db.json'); // あなたのJSONファイルへのパス
// const middlewares = jsonServer.defaults();

// const options = {
//     key: fs.readFileSync('key.pem'),
//     cert: fs.readFileSync('cert.pem')
// };

// server.use(middlewares);
// server.use(router);

// https.createServer(options, server).listen(3001, () => {
//     console.log('JSON Server is running on https://localhost:3001');
// });
// json-serverの場合、server.jsにCORS設定を追加
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // データベースファイル
const middlewares = jsonServer.defaults();

// CORSを許可する
const cors = require('cors');
server.use(cors());

server.use(middlewares);
server.use(router);
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`JSON Server is running on http://localhost:${port}`);
});
