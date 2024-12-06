import express from 'express';
import uniqid from 'uniqid';
import cors from 'cors';
import fs from 'fs';
import {GPTScript, RunEventType} from "@gptscript-ai/gptscript";

const g = new GPTScript();


const app =express();
app.use(cors());
 
app.get('/test',(req,res)=> {
    return res.json('ok');
})
app.get('/create-story', async (req,res) =>{
 const url = req.query.url;

 const dir = uniqid();
 const path = './stories/'+dir;
 fs.mkdirSync(path, {recursive: true});

 console.log({
    url,
 });
 const opts = {
    input: `--url ${url} --dir ${path}`,
    disableCache: true,
  };
  try{
    const run = await g.run('./story.gpt', opts);

    run.on(RunEventType.Event, ev => {
      if  (ev.type === RunEventType.CallFinish && ev.output) {
        console.log(ev.output);
      }
    });
    const result = await run.text();
    return res.json(dir);
  } catch(e) {
    console.error(e);
    return  res.json('error');
  }
});


app.listen(8080,()=>console.log('listening on port 8080'));