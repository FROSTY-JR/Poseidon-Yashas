import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../dist/',import.meta.url));
const port=Number(process.env.PORT||4174);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.glb':'model/gltf-binary','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let filename=path.resolve(root,'.'+pathname);
  const relative=path.relative(root,filename);
  if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403);res.end('Forbidden');return;}
  if((await stat(filename)).isDirectory())filename=path.join(filename,'index.html');
  const content=await readFile(filename);
  res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream','Content-Length':content.length,'Cache-Control':'no-cache'});
  res.end(req.method==='HEAD'?undefined:content);
 }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is in use. Set PORT to another number and try again.`:error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Poseidon preview: http://127.0.0.1:${port}`));
