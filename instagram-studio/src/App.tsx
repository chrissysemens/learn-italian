import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { z } from 'zod';
import { Download, Copy, Check, ChevronLeft, ChevronRight, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import sample from './sample.json';

const schema = z.object({
  challengeNumber: z.number().int().min(1),
  level: z.enum(['A1','A2','B1','B2','C1','C2']),
  activity: z.string().min(1), headline: z.string().min(1), instruction: z.string().min(1),
  questions: z.array(z.object({prompt:z.string().min(1),answer:z.string().min(1),note:z.string().min(1)})).min(1).max(5),
  tipTitle: z.string().min(1), tipIntro: z.string().min(1),
  tipRows: z.array(z.object({form:z.string().min(1),meaning:z.string().min(1),example:z.string().min(1)})).min(1).max(5),
  caption: z.string()
});
type Post = z.infer<typeof schema>;
const original: Post = schema.parse(sample);
const num = (n:number) => `#${String(n).padStart(3,'0')}`;
const slideNames = ['challenge','answers','grammar-tip'];

function Brand({ light=false }: {light?:boolean}) {
  return <div className={'brand '+(light?'brand-light':'')}><span className="brand-symbol"><span className="brand-dot"/></span><span>percoso<span className="brand-period">.</span></span></div>;
}
function Slide({post, index}:{post:Post,index:number}) {
  return <div className={`slide slide-${index+1}`}>
    <div className="ambient ambient-a"/><div className="ambient ambient-b"/>
    <header className="slide-header"><Brand/><div className="level-chip"><span className="level-led"/>{post.level} LEVEL</div></header>
    <div className="slide-main">
      <div className="eyebrow"><span className="eyebrow-line"/> DAILY ITALIAN · {num(post.challengeNumber)}</div>
      {index===0 && <>
        <h1>{post.headline}</h1><p className="lead">{post.instruction}</p>
        <div className="exercise-card"><div className="card-label">YOUR CHALLENGE <span>✦</span></div>
          {post.questions.map((q,i)=><div className="exercise-line" key={i}><span className="number-pill">{String(i+1).padStart(2,'0')}</span><span>{q.prompt}</span></div>)}
        </div><div className="encourage"><span className="sparkle">✳</span> Take your time. You've got this.</div>
      </>}
      {index===1 && <>
        <h1>The answers<span className="title-accent">.</span></h1><p className="lead">How many did you get right?</p>
        <div className="answer-list">{post.questions.map((q,i)=><div className="answer-card" key={i}><div className="answer-top"><span className="number-pill">{String(i+1).padStart(2,'0')}</span><span className="answer-prompt">{q.prompt.replace('___', '_____')}</span><span className="tick">✓</span></div><div className="answer-value">{q.answer}</div><div className="answer-note">{q.note}</div></div>)}</div>
        <div className="encourage"><span className="sparkle">✳</span> Every attempt is progress.</div>
      </>}
      {index===2 && <>
        <h1>{post.tipTitle}</h1><p className="lead">{post.tipIntro}</p>
        <div className="tip-card"><div className="card-label">THE QUICK GUIDE <span>✦</span></div>{post.tipRows.map((r,i)=><div className="tip-line" key={i}><div className="tip-form">{r.form}</div><div className="tip-description"><strong>{r.meaning}</strong><span>{r.example}</span></div></div>)}</div>
        <div className="closing-note">Save this for your next Italian practice <span>♡</span></div>
      </>}
    </div>
    <footer className="slide-footer"><span>A LITTLE ITALIAN, EVERY DAY.</span><div className="pagination">{[0,1,2].map(i=><span key={i} className={i===index?'active':''}/>)}</div><span>{index+1} / 3</span></footer>
  </div>;
}

export default function App(){
  const [json,setJson]=useState(JSON.stringify(original,null,2));
  const [post,setPost]=useState<Post>(original);
  const [error,setError]=useState('');
  const [selected,setSelected]=useState(0);
  const [busy,setBusy]=useState(false);
  const [copied,setCopied]=useState(false);
  const slideRefs=useRef<(HTMLDivElement|null)[]>([]);
  const apply=()=>{try{const result=schema.safeParse(JSON.parse(json));if(!result.success){setError(result.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('\n'));return;}setPost(result.data);setError('');}catch(e){setError(e instanceof Error?e.message:'Invalid JSON');}};
  const reset=()=>{setJson(JSON.stringify(original,null,2));setPost(original);setError('');setSelected(0);};
  async function exportSlide(i:number){const node=slideRefs.current[i];if(!node)throw Error('Slide not found');await document.fonts.ready;const data=await toPng(node,{width:1080,height:1350,pixelRatio:1,cacheBust:true,backgroundColor:'#f5f0ff'});const a=document.createElement('a');a.download=`percoso-${num(post.challengeNumber).slice(1)}-${i+1}-${slideNames[i]}.png`;a.href=data;a.click();}
  async function exportAll(){setBusy(true);setError('');try{for(let i=0;i<3;i++){await exportSlide(i);await new Promise(r=>setTimeout(r,350));}}catch(e){setError(`Export failed: ${e instanceof Error?e.message:String(e)}. Try Chrome or Edge.`);}finally{setBusy(false);}}
  const copyCaption=async()=>{try{await navigator.clipboard.writeText(post.caption);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch{setError('Could not copy automatically. Select the caption text below.');}};
  return <div className="app-shell">
    <aside className="sidebar"><div className="sidebar-head"><Brand light/><div className="studio-label">POST STUDIO <span>V1.0</span></div></div>
      <div className="sidebar-content"><div className="side-section-title">CONTENT EDITOR <span>JSON</span></div><p className="side-help">Paste a reviewed exercise below, then click <strong>Update preview</strong>. Edit the example to get started.</p>
      <textarea spellCheck={false} aria-label="Exercise JSON" value={json} onChange={e=>setJson(e.target.value)}/>
      {error&&<div className="error" role="alert"><AlertCircle size={16}/><span>{error}</span></div>}
      <div className="editor-actions"><button className="primary" onClick={apply}><Sparkles size={16}/> Update preview</button><button className="secondary" title="Restore example" onClick={reset}><RotateCcw size={16}/></button></div>
      <div className="caption-panel"><div className="caption-heading">INSTAGRAM CAPTION <button onClick={copyCaption}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy'}</button></div><p>{post.caption}</p></div>
      </div><div className="sidebar-bottom">Built for the daily Percoso ritual. 💜</div>
    </aside>
    <main className="workspace"><div className="workspace-header"><div><div className="workspace-kicker">CONTENT WORKSPACE</div><h2>Instagram carousel <span>{num(post.challengeNumber)}</span></h2><p>Three slides. One unmistakable Percoso style.</p></div><button className="export" onClick={exportAll} disabled={busy}><Download size={18}/>{busy?'Exporting…':'Export all 3 PNGs'}</button></div>
      <div className="tabs">{['01  Challenge','02  Answers','03  Grammar tip'].map((t,i)=><button key={i} className={selected===i?'active':''} onClick={()=>setSelected(i)}>{t}</button>)}</div>
      <div className="preview-area"><div className="preview-controls"><button onClick={()=>setSelected((selected+2)%3)} aria-label="Previous slide"><ChevronLeft size={22}/></button><span>SLIDE {selected+1} OF 3</span><button onClick={()=>setSelected((selected+1)%3)} aria-label="Next slide"><ChevronRight size={22}/></button></div>
        <div className="preview-frame"><div className="slide-scale"><Slide post={post} index={selected}/></div></div>
        <div className="preview-note">Portrait 4:5 · 1080 × 1350 px · <strong>Exported images have no preview border.</strong></div>
      </div>
      <div className="offscreen-exports" aria-hidden="true">{[0,1,2].map(i=><div key={i} ref={el=>{slideRefs.current[i]=el;}}><Slide post={post} index={i}/></div>)}</div>
    </main>
  </div>;
}
