'use strict';
const KEY = 'mayfourth-s3-v2-choice';
const fresh = () => ({chapter:0, answers:{}, hints:{}, cursors:{}, evaluationStep:0, opinion:'', paragraph:[], paragraphChecked:false, paragraphHint:false});
let state = fresh(), storageOK = true, legacy = null;
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved && saved.answers && saved.cursors) state = {...fresh(), ...saved};
  legacy = JSON.parse(localStorage.getItem('mayfourth-s3-v1'));
} catch (_) { storageOK = false; }
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chapters = [['山東問題','外交受挫，學生為何不滿？'],['運動經過','三罷如何促成讓步？'],['新文化運動','思想與行動如何相連？'],['是否成功？','按兩項目標評價，組成段落']];
const q = (id, prompt, options, answer, explanation, wrong, hint) => ({id,prompt,options,answer,explanation,wrong,hint});
const questions = {
  background:q('background','中國是戰勝國，為甚麼學生仍感到不滿？',[
    '和會把德國在山東的權益轉交日本，沒有接納中國收回權益的要求。',
    '中國在第一次世界大戰中戰敗，因而失去山東。',
    '德國戰敗後，山東權益已自動全部歸還中國。'
  ],0,'戰勝國身分帶來收回權益的期望，但和會安排落空。主權要求被忽視，是學生抗議的重要原因。',[
    '', '中國屬戰勝國。請比較「中國的期望」與「和會的安排」。','德國戰敗不等於權益自動交還；和會安排由日本承接。'
  ],'先看中國希望收回甚麼，再看和會把權益交給誰。'),
  groups:q('groups','學生被捕後，運動如何擴大？',[
    '工人罷工、商人罷市、學生罷課，社會各界加入。',
    '抗議始終只在北京的學校內進行。',
    '政府已釋放學生，所以各地不再參與。'
  ],0,'消息引起各地支持。6月上海等地的工商界加入，使運動超出最初的學生遊行。',[
    '', '材料顯示上海等地工商界亦參與，不只北京學生。','政府的讓步是運動施壓後的結果，不能把它放在社會支持之前。'
  ],'「罷工、罷市、罷課」分別涉及工廠、商店和學校。'),
  pressure:q('pressure','三罷為甚麼令政府承受更大壓力？',[
    '參與人數一增加，就會自動結束軍閥統治。',
    '生產與買賣受到影響，加上輿論支持，政府更難只靠拘捕學生平息事件。',
    '三罷之後出現讓步，單憑時間先後已足以解釋原因。'
  ],1,'罷工和罷市改變了日常經濟活動；參與範圍和輿論亦擴大。這些壓力有助促成釋放學生、罷免官員等讓步。',[
    '政府讓步沒有令軍閥統治立即結束。','', '先後發生只是線索，還要說明三罷改變了甚麼。'
  ],'想一想工廠停工、商店停業，會影響甚麼日常活動。'),
  culture:q('culture','新文化運動希望怎樣改善中國積弱的處境？',[
    '只撤換官員，不需要改變思想文化。',
    '1919年以後才開始創辦《新青年》。',
    '改革思想文化，提倡民主、科學及白話文，鼓勵獨立思考。'
  ],2,'陳獨秀、胡適、魯迅等透過《新青年》介紹新觀念、批評舊文化。「德先生」指民主，「賽先生」指科學。',[
    '撤換官員屬政治行動；新文化着重思想與文化改革。', '新文化及《新青年》的前身早於1919年五四運動。',''
  ],'留意「德先生」「賽先生」和文字改革的主張。'),
  relation:q('relation','新文化運動與五四運動有甚麼關係？',[
    '新文化提供獨立思考與新思想的條件；五四又擴大參與和討論，推動新文化。',
    '五四遊行後才有新文化，兩者只是一前一後。',
    '改用白話文，便能直接迫使日本交還權益。'
  ],0,'兩者互相推動，但重點不同：新文化偏重思想文化改革，五四愛國運動直接回應外交與政治問題。',[
    '', '新文化早於五四，不能倒置它們的先後與關係。', '白話文有助表達、閱讀及傳播，並不會自動改變外國的實際控制。'
  ],'先看新文化如何影響青年，再看五四如何擴大新思想的討論。'),
  criterion:q('criterion','評定五四運動是否成功，首先應該看甚麼？',[
    '只看遊行人數是否很多。',
    '看能否達到「外爭主權，內除國賊」的目標。',
    '只看學生是否勇敢或愛國。'
  ],1,'成功與否要對照目標。愛國熱情和參與人數能解釋行動，卻不能代替「目標達成多少」的評價。',[
    '參與多不代表要求全部實現。先找運動要達到的目標。','', '勇敢與愛國是態度，評價成效還需要比較目標與結果。'
  ],'先問「想做到甚麼」，再問「實際做到多少」。'),
  outerLimit:q('outerLimit','外爭主權：1919年尚未達成甚麼？',[
    '向列強表明中國不接受這項安排。',
    '拒絕在對德和約上簽字。',
    '即時收回德國原有的山東權益。'
  ],2,'拒簽沒有令日本即時交還權益，所以「立即收回」這個目標尚未達成。',[
    '拒簽已表達不接受的立場；本題問仍未做到的部分。','中國代表團確曾拒簽，這是已做到的事。',''
  ],'分辨「表達主權立場」與「實際收回權益」。'),
  outerAction:q('outerAction','雖未即時收回，代表團卻採取了甚麼行動？',[
    '拒絕在《凡爾賽和約》上簽字。',
    '簽署和約，接受山東權益轉交日本。',
    '以罷免曹、陸、章代替任何外交回應。'
  ],0,'1919年6月28日，中國代表團拒簽和約。這是對外的具體成果。',[
    '', '代表團最終拒簽；不要把和會的安排當成中國已接受的安排。','免職是對內的結果。本題問代表團的對外行動。'
  ],'想一想代表團在和約簽字時所作的決定。'),
  outerLink:q('outerLink','拒簽如何符合「外爭主權」？',[
    '拒簽當天就自動收回青島及鐵路。',
    '拒絕接受有損主權的安排，表明維護主權的立場。',
    '直接結束北洋軍閥的統治。'
  ],1,'拒簽不能立即取回權益，卻表達中國不接受有損主權的安排。因此在維護主權立場方面，部分符合目標。',[
    '拒簽不會自動改變日本的實際控制。','', '軍閥統治屬對內問題，也未因拒簽而結束。'
  ],'它首先改變的是外交態度與立場，還是實際控制？'),
  innerLimit:q('innerLimit','內除國賊：政府讓步後，甚麼仍未根本改變？',[
    '北洋政府仍由軍閥控制。',
    '曹、陸、章三名官員仍留在原職。',
    '政府完全沒有釋放被捕學生。'
  ],0,'免去個別官員不等於結束軍閥統治，對內政治問題沒有獲得根本解決。',[
    '', '曹、陸、章已被免職；本題問沒有根本改變的問題。','釋放學生是讓步之一，不是未達成的結果。'
  ],'分辨「撤換個別官員」與「改變整個統治」。'),
  innerAction:q('innerAction','雖未根本改變統治，政府卻做到甚麼？',[
    '結束全部军閥的統治。',
    '立即收回山東權益。',
    '免去曹汝霖、陸宗輿、章宗祥的職務。'
  ],2,'曹、陸、章被免職，是運動要求懲辦被指親日官員的具體成果。',[
    '軍閥仍掌權，不能把個別官員免職當成全部統治結束。','收回山東權益是對外目標，也沒有在1919年即時完成。',''
  ],'「國賊」在當時的口號，主要針對哪些被指親日的官員？'),
  innerLink:q('innerLink','免去曹、陸、章，如何符合「內除國賊」？',[
    '已把所有政治問題一併解決。',
    '使被指親日的官員離職，部分達成懲辦相關官員的要求。',
    '代表日本已交還山東權益。'
  ],1,'對相關官員作出處分，部分達成「內除國賊」；但個別免職不能證明軍閥統治及媚外政治問題已消除。',[
    '處分個別官員不等於整個政治問題已解決。','', '官員免職是對內行動，不能證明對外權益已取回。'
  ],'把「處分的是誰」與「學生要求懲辦誰」連起來。')
};
questions.innerAction.options[0] = '結束全部軍閥的統治。';
const lessonIds = [['background'],['groups','pressure'],['culture','relation']];
const outerIds = ['outerLimit','outerAction','outerLink'];
const innerIds = ['innerLimit','innerAction','innerLink'];
const correct = id => state.answers[id] === questions[id].answer;
const done = ids => ids.every(correct);
function persist() {
  try {localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;} catch (_) {storageOK=false;}
  $('#storage-status').textContent = storageOK ? '選擇與段落自動儲存在這個瀏覽器。' : '瀏覽器未能儲存；離開前請下載學習紀錄。';
}
function hero(n,title,desc) {
  return `<section class="hero"><p class="eyebrow">CHAPTER ${String(n).padStart(2,'0')} / 點選學歷史</p><h2>${title}</h2><p>${desc}</p><span class="year" aria-hidden="true">1919</span></section>`;
}
function chain(nodes) {
  return `<div class="chain">${nodes.map((n,i)=>`${i?'<span class="arrow" aria-hidden="true">→</span>':''}<div class="node">${n}</div>`).join('')}</div>`;
}
function question(id) {
  const x=questions[id],a=state.answers[id];
  return `<section class="question" data-question="${id}"><p class="prompt">${x.prompt}</p><div class="options">${x.options.map((text,i)=>`<button data-action="answer" data-key="${id}" data-value="${i}" aria-pressed="${a===i}" class="${a===i?(correct(id)?'selected correct':'selected'):''}"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${text}</span></button>`).join('')}</div>${a!==undefined?`<div class="feedback ${correct(id)?'':'warn'}" role="status"><strong>${correct(id)?'這樣連接有根據':'再想想，可以重新選擇'}</strong><p>${correct(id)?x.explanation:x.wrong[a]}</p></div>`:''}${!correct(id)?`<div class="actions"><button class="text-btn" data-action="hint" data-key="${id}">想看提示？</button></div>`:''}${state.hints[id]?`<div class="hint-box" role="status">提示：${x.hint}</div>`:''}</section>`;
}
function sequence(ids,key) {
  const index=Math.min(state.cursors[key]||0,ids.length-1),id=ids[index];
  return `<div class="step-status"><span>第 ${index+1} / ${ids.length} 個連接</span><span>${ids.filter(correct).length} 個已連接</span></div>${question(id)}<div class="actions">${index>0?`<button data-action="cursor" data-key="${key}" data-value="${index-1}">← 回看上一個</button>`:''}${correct(id)&&index<ids.length-1?`<button class="primary" data-action="cursor" data-key="${key}" data-value="${index+1}">繼續連接 →</button>`:''}</div>`;
}
function chapterNext(n) {
  const complete=done(lessonIds[n]),remaining=lessonIds[n].filter(id=>!correct(id)).length;
  return `${!complete?`<p class="small-note">先完成本章尚餘 ${remaining} 個選擇，再前往下一章；需要時可看提示或重新選擇。</p>`:''}<div class="next-row"><button data-action="chapter" data-value="${Math.max(0,n-1)}" ${n===0?'disabled':''}>← 上一章</button><button class="primary" data-action="chapter" data-value="${n+1}" ${complete?'':'disabled'}>下一章：${chapters[n+1][0]} →</button></div>`;
}
function background() {
  return hero(1,'戰勝國，<br>為何仍然失望？','你是1919年北京的學生。先比較中國的期望與和會的安排。')+
  `<div class="two-col"><article class="evidence"><span class="tag">中國的期望</span><h3>收回山東權益</h3><p>第一次世界大戰結束，中國以戰勝國身分參加巴黎和會，希望收回德國在山東的權益。</p></article><article class="evidence"><span class="tag">和會的安排</span><h3>轉交日本</h3><p>和會卻安排把這些權益轉交日本。中國的要求未獲接納。</p></article></div><p class="source">依主教材016第1張改寫。指德國原有租借地、鐵路等權益，不等於割讓整個山東省。角色為教學重構。</p><section class="activity">${question('background')}</section>${correct('background')?`<section class="learning-result"><h3>你剛建立的因果鏈</h3>${chain(['收回權益的期望落空','學生認為主權要求被忽視','1919年5月4日遊行抗議'])}</section>`:''}<details><summary>回看山東問題的背景</summary><div class="timeline"><div><b>1898</b>德國強租膠州灣</div><div><b>1914</b>日本佔領青島</div><div><b>1915–18</b>對日交涉與協議</div><div><b>1919</b>巴黎和會受挫</div></div><p>前面的佔領及外交協議，成為和會爭議的背景；1919年的安排則是五四爆發的直接導火線。</p></details>${chapterNext(0)}`;
}
function movement() {
  return hero(2,'抗議如何擴大，<br>令政府讓步？','先看誰參與，再找出三罷如何形成壓力。')+
  `<div class="event-strip"><article><b>5月4日 · 北京</b><p>學生遊行，提出「外爭主權，內除國賊」。部分學生火燒趙家樓、毆打章宗祥，被政府拘捕。</p></article><article><b>6月 · 上海等地</b><p>被捕與抗議的消息引起各地支持，工商界加入，出現罷工、罷市、罷課。</p></article></div><p class="source">依主教材016及中國文化研究院改寫。</p><section class="activity">${sequence(lessonIds[1],'movement')}</section>${done(lessonIds[1])?`<section class="learning-result"><h3>行動怎樣形成壓力？</h3>${chain(['消息傳播，社會各界聲援','三罷影響生產、買賣及日常活動','經濟與輿論壓力增加','政府釋放學生、罷免官員'])}<p class="small-note">工商界參與亦有代價：停工或停業可能令工人、商人失去收入。政府的具體讓步，是否等於所有目標達成？最後一章再判斷。</p></section>`:''}${chapterNext(1)}`;
}
const impacts = [
  ['白話文','較接近日常語言的表達','有助部分讀者閱讀及討論新思想；仍要有識字和接觸刊物的條件。'],
  ['女性地位','更多討論教育、權利與自主','推動部分女性生活及角色的改變，但不同地區與群體的改善不一。'],
  ['新思潮','部分知識分子轉向馬克思主義及共產主義','對後來政治發展產生重要影響；並非所有人都接受同一思想。']
];
function culture() {
  return hero(3,'思想改革，<br>如何與五四相連？','新文化在五四前已展開。兩者有不同重點，也會互相推動。')+
  `<article class="evidence"><h3>先改變思想與文化</h3><p>陳獨秀、胡適、魯迅等透過《新青年》，批評舊文化、介紹新觀念，期望「破舊立新」。</p><div class="concept-pair"><span><b>德先生</b>民主 Democracy</span><span><b>賽先生</b>科學 Science</span></div><p class="source">依主教材016.5第1張改寫；新文化早於1919年五四愛國運動。</p></article><section class="activity">${sequence(lessonIds[2],'culture')}</section>${done(lessonIds[2])?`<section class="learning-result"><h3>兩個方向的推動</h3>${chain(['新文化鼓勵獨立思考','部分青年質疑外交安排，參與五四'])}${chain(['五四擴大社會參與及討論','新觀念的傳播機會增加，推動新文化'])}</section>`:''}<section class="activity"><h3>點選回看：新文化的影響</h3><div class="impact-tabs">${impacts.map((x,i)=>`<button data-action="impact" data-value="${i}" aria-pressed="${(state.impact||0)===i}" class="${(state.impact||0)===i?'active':''}">${x[0]}</button>`).join('')}</div><div class="impact-body"><b>${impacts[state.impact||0][1]}</b><p>${impacts[state.impact||0][2]}</p></div><p class="source">主教材016.5；中國文化研究院〈思想文化面貌一新〉補充条件。</p></section>${chapterNext(2)}`.replace('補充条件','補充條件');
}
const evaluationLabels = ['評價標準','外爭主權','內除國賊','組成段落'];
function goalOverview() {
  return `<div class="goal-banner"><span>評價標準</span><strong>外爭主權，內除國賊</strong><p>成功與否，要看這兩項目標達成多少。</p></div>`;
}
function outerSentence() {
  return {
    limit:`在外爭主權方面，雖然中國未能在1919年${questions.outerLimit.options[state.answers.outerLimit]?.replace('。','')||'即時收回山東權益'}，`,
    gain:'卻透過拒簽和約，'+(questions.outerLink.options[state.answers.outerLink]?.replace('。','')||'拒絕接受有損主權的安排，表明維護主權的立場')+'，部分符合外爭主權的目標。'
  };
}
function innerSentence() {
  return {
    limit:'在內除國賊方面，雖然'+(questions.innerLimit.options[state.answers.innerLimit]?.replace('。','')||'北洋政府仍由軍閥控制')+'，未能根本改變統治，',
    gain:'卻免去曹汝霖、陸宗輿、章宗祥的職務，使被指親日的官員離職，部分達成懲辦相關官員的要求。'
  };
}
function generatedCards() {
  const outer=outerSentence(),inner=innerSentence();
  return {
    intro:'評定五四運動是否成功，應看它能否達到「外爭主權，內除國賊」的目標。',
    outerLimit:outer.limit, outerGain:outer.gain, innerLimit:inner.limit, innerGain:inner.gain,
    conclusion:state.opinion==='gain'?'因此，我認為五四運動取得部分成功，但未能完全達成兩項目標。':'因此，我認為五四運動未能完全成功，因為兩項目標仍有未達成的部分；不過，它也取得符合目標的成果。'
  };
}
function validParagraph() {
  const s=state.paragraph.join(',');
  return s==='intro,outerLimit,outerGain,innerLimit,innerGain,conclusion'||s==='intro,innerLimit,innerGain,outerLimit,outerGain,conclusion';
}
function readyForParagraph() {return correct('criterion')&&done(outerIds)&&done(innerIds);}
function paragraphActivity() {
  if(!readyForParagraph()) return `<div class="feedback warn"><strong>先完成兩條評價鏈</strong><p>需要先分辨兩項目標的成果與局限，才能用自己的選擇組成段落。</p><div class="actions"><button data-action="eval-step" data-value="${!correct('criterion')?0:!done(outerIds)?1:2}" class="primary">回到尚未完成的部分 →</button></div></div>`;
  const cards=generatedCards(),bank=['innerGain','outerLimit','conclusion','outerGain','intro','innerLimit'];
  return `<h3>你較認同哪一種評價？</h3><p class="small-note">兩種說法都要交代已有成果和未達成的目標。</p><div class="options"><button data-action="opinion" data-value="gain" aria-pressed="${state.opinion==='gain'}" class="${state.opinion==='gain'?'selected':''}">較重視已有成果：取得部分成功，但未完全達標。</button><button data-action="opinion" data-value="limit" aria-pressed="${state.opinion==='limit'}" class="${state.opinion==='limit'?'selected':''}">較重視未達成的目標：未能完全成功，但已有成果。</button></div>${state.opinion?`<section class="paragraph-task"><p class="section-label">把所選內容排成一段評價</p><p>按閱讀次序點選六張句子卡。先說評價標準，再把「雖然」與對應的「卻」接起來，最後作結論。排錯可用「上移／下移」調整，亦可移除重選。</p><p class="small-note" role="status">已排列 ${state.paragraph.length} / 6 句。</p><div class="sentence-bank">${bank.filter(id=>!state.paragraph.includes(id)).map(id=>`<button class="sentence-card" data-action="sentence" data-key="${id}">${cards[id]}</button>`).join('')}</div><ol class="sentence-order">${state.paragraph.map((id,i)=>`<li><span>${cards[id]}</span><div class="sentence-controls"><button data-action="move-sentence" data-value="${i}" data-key="up" aria-label="上移第${i+1}句" ${i===0?'disabled':''}>↑ 上移</button><button data-action="move-sentence" data-value="${i}" data-key="down" aria-label="下移第${i+1}句" ${i===state.paragraph.length-1?'disabled':''}>↓ 下移</button><button data-action="remove-sentence" data-value="${i}" aria-label="移除第${i+1}句">移除</button></div></li>`).join('')}</ol>${!state.paragraph.length?'<p class="empty">點選上方句子卡，放入你的段落。</p>':''}<div class="actions"><button data-action="paragraph-check" class="primary" ${state.paragraph.length!==6?'disabled':''}>檢查段落</button><button data-action="undo" ${!state.paragraph.length?'disabled':''}>撤回上一句</button><button data-action="paragraph-hint">排序提示</button></div>${state.paragraphHint?'<div class="hint-box">先列「評價標準」，再排列外爭、內除的兩組「雖然→卻」，最後放「因此」。兩組目標的先後可以互換。</div>':''}${state.paragraphChecked?`<div class="feedback ${validParagraph()?'':'warn'}" role="status"><strong>${validParagraph()?'段落連貫，兩項目標都有成果與局限':'有句子需要重新連接'}</strong><p>${validParagraph()?'你先提出目標，再以史例比較未達成與已達成的部分，最後給出判斷。':'請檢查：評價標準在開頭嗎？每句「雖然」後面接的是同一目標的「卻」嗎？結論在最後嗎？可用上移／下移調整，或移除句子再選。'}</p></div>`:''}${state.paragraphChecked&&validParagraph()?`<article class="finished-paragraph"><span class="tag">我的評價段落</span><p>${state.paragraph.map(id=>cards[id]).join('')}</p><div class="actions"><button data-action="notebook" class="primary">保存與下載學習紀錄 ↗</button></div></article>`:''}</section>`:''}`;
}
function evaluation() {
  const step=state.evaluationStep;
  let body='';
  if(step===0)body=`<section class="activity">${question('criterion')}</section>${correct('criterion')?`<div class="two-col goal-pair"><article><h3>外爭主權</h3><p>希望收回山東權益，維護國家主權。</p></article><article><h3>內除國賊</h3><p>要求懲辦被指親日的曹、陸、章，回應政府的媚外政治問題。</p></article></div><button data-action="eval-step" data-value="1" class="primary">先評定外爭主權 →</button>`:''}`;
  if(step===1)body=`<section class="activity"><span class="tag">目標：收回權益、維護主權</span><h3>外爭主權：雖未做到，卻做到……</h3>${sequence(outerIds,'outer')}</section>${done(outerIds)?`<section class="learning-result"><div class="limit-lane"><span>未達標的部分</span><p>未能在1919年即時收回山東權益。</p></div><p class="section-label">已達標的部分：行動如何符合目標？</p>${chain(['拒簽和約','拒絕接受有損主權的安排','維護主權立場：部分達標'])}<p class="generated-sentence">${outerSentence().limit+outerSentence().gain}</p><button data-action="eval-step" data-value="2" class="primary">再評定內除國賊 →</button></section>`:''}`;
  if(step===2)body=`<section class="activity"><span class="tag">目標：懲辦親日官員、回應媚外政治問題</span><h3>內除國賊：雖未做到，卻做到……</h3>${sequence(innerIds,'inner')}</section>${done(innerIds)?`<section class="learning-result"><div class="limit-lane"><span>未達標的部分</span><p>北洋政府仍由軍閥控制，未能根本改變統治。</p></div><p class="section-label">已達標的部分：行動如何符合目標？</p>${chain(['免去曹、陸、章','使被指親日的官員離職','懲辦相關官員：部分達標'])}<p class="generated-sentence">${innerSentence().limit+innerSentence().gain}</p><button data-action="eval-step" data-value="3" class="primary">用這些選擇組成段落 →</button></section>`:''}`;
  if(step===3)body=`<section class="activity">${paragraphActivity()}</section>`;
  return hero(4,'是否成功，<br>要回到目標。','分別評定「外爭主權」和「內除國賊」，再用選擇生成句子，排成評價段落。')+goalOverview()+`<nav class="eval-steps" aria-label="評價步驟">${evaluationLabels.map((name,i)=>`<button data-action="eval-step" data-value="${i}" class="${i===step?'active':''}" ${i===step?'aria-current="step"':''}>${i+1} ${name}</button>`).join('')}</nav>`+body+`<div class="next-row"><button data-action="chapter" data-value="2">← 回看新文化</button><button data-action="notebook">我的學習紀錄 ↗</button></div>`;
}
const renderers=[background,movement,culture,evaluation];
function completions(){return [done(lessonIds[0]),done(lessonIds[1]),done(lessonIds[2]),readyForParagraph()&&Boolean(state.opinion)&&state.paragraphChecked&&validParagraph()];}
function render(goTop=false) {
  const oldChapter=Number($('#stage').dataset.chapter??-1),y=window.scrollY,active=document.activeElement,data={...active?.dataset};
  const open=[...$('#stage').querySelectorAll('details[open]')].map(d=>d.querySelector('summary')?.textContent);
  const completed=completions();
  $('#chapters').innerHTML=chapters.map((c,i)=>`<button data-action="chapter" data-value="${i}" class="${state.chapter===i?'active':''}" ${state.chapter===i?'aria-current="step"':''}><span class="num">${String(i+1).padStart(2,'0')}</span><span>${c[0]}<small>${c[1]}</small></span>${completed[i]?'<span class="nav-check" aria-label="已完成">✓</span>':''}</button>`).join('');
  const count=completed.filter(Boolean).length;$('#progress-count').textContent=count+' / 4';$('#progress-bar').style.width=count*25+'%';
  $('#stage').innerHTML=renderers[state.chapter]();$('#stage').dataset.chapter=state.chapter;persist();
  if(goTop){$('#stage').focus({preventScroll:true});window.scrollTo(0,0);}else if(oldChapter===state.chapter){
    for(const d of $('#stage').querySelectorAll('details'))if(open.includes(d.querySelector('summary')?.textContent))d.open=true;
    const target=[...document.querySelectorAll('[data-action]')].find(el=>el.dataset.action===data.action&&el.dataset.key===data.key&&el.dataset.value===data.value);
    target?.focus({preventScroll:true});window.scrollTo(0,y);
  }
}
function sources(){return `<div class="source-list"><h3>主要教材</h3><p>《016 山東問題與五四運動（1919年）》及《016.5 五四運動與新文化運動》第1張完整概念圖；第2、3張為填充及答案。</p><h3>補充核對</h3><ul><li><a href="https://chiculture.org.hk/tc/china-five-thousand-years/3126" target="_blank" rel="noopener">中國文化研究院〈五四運動〉</a>：口號、參與者、經過及拒簽。</li><li><a href="https://chiculture.org.hk/tc/photo-story/1564" target="_blank" rel="noopener">〈思想文化面貌一新〉</a>：新文化的主張與影響。</li><li><a href="https://history.state.gov/historicaldocuments/frus1922v01/d792" target="_blank" rel="noopener">1922年山東條約（FRUS，文獻792）</a>及<a href="https://history.state.gov/historicaldocuments/frus1922v01/d794" target="_blank" rel="noopener">談判記錄（文獻794）</a>：1919年拒簽並不等於即時收回權益。</li></ul><h3>教師備註</h3><p>本版按中三學生需要，以選擇、因果連接及句子排序取代文字輸入。最後按「外爭主權、內除國賊」的達成程度評價；兩種結論重點均要求承認成果與局限。</p><p>「內除國賊」的直接要求是懲辦相關官員；軍閥仍掌權，用來說明整體政治問題未根本解決。學生應分辨局部成果與全面改善，不能以個別免職推定整個統治結束。</p><p>除口號外，資料均為教材改寫及教學摘要，非史料逐字原文；學生角色為教學重構。因果鏈中的成果／局限是比較關係，並不表示「未收回」造成「拒簽」。</p><p>排序容許外爭／內除两組互換，但每一組的「雖然」和「卻」須對應。活動完成表示選項和連接正確，未經學生課堂試用；教師可請學生口頭解釋一条連接核對理解。</p><p>儲存只在本機瀏覽器，沒有上傳答案；舊版作答不會被覆寫。</p></div>`.replace('內除两組','內除兩組').replace('一条連接','一條連接');}
function recordText(){
  const lines=['五四運動與新文化運動｜選擇學習紀錄',''];
  for(const id of Object.keys(questions)){const x=questions[id],a=state.answers[id];lines.push(x.prompt,'我的選擇：'+(a===undefined?'尚未選擇':x.options[a]),a===undefined?'待完成':correct(id)?'連接正確':'可重試','');}
  if(readyForParagraph()&&state.opinion){lines.push('我的評價重點：'+(state.opinion==='gain'?'部分成功，但未完全達標':'未完全成功，但已有成果'),'我的句子排序：');const c=generatedCards();lines.push(...state.paragraph.map(id=>c[id]),'排序狀態：'+(state.paragraphChecked&&validParagraph()?'兩項目標、成果及局限連接完整':'仍可調整'));}
  return lines.join('\n');
}
function notebook(){
  const cards=generatedCards();
  return `<p class="small-note">已選內容可以回看。最後的段落由你的選擇和句子排序組成。</p><div class="actions"><button data-action="export" class="primary">下載學習紀錄</button><button data-action="reset-first">重新開始本版</button></div>${Object.keys(questions).map(id=>`<section class="note-entry"><h3>${questions[id].prompt}</h3><p>${state.answers[id]===undefined?'尚未選擇':esc(questions[id].options[state.answers[id]])}</p><span class="${correct(id)?'saved':'empty'}">${state.answers[id]===undefined?'待完成':correct(id)?'連接正確':'可返回重試'}</span></section>`).join('')}<section class="note-entry"><h3>我的評價段落</h3><p>${readyForParagraph()&&state.opinion&&state.paragraph.length?state.paragraph.map(id=>cards[id]).join(''):'完成兩條評價鏈後，點選句子組成段落。'}</p></section>${legacy?.fields?`<details><summary>回看舊版文字作答（毋須補填）</summary>${Object.entries(legacy.fields).filter(([k])=>['background','role','mechanism','evaluation','culture','final','transfer'].includes(k)).map(([k,v])=>`<p>${esc(v)}</p>`).join('')||'<p>舊版沒有文字作答。</p>'}</details>`:''}`;
}
function openDrawer(type){$('#drawer-title').textContent=type==='notebook'?'我的學習紀錄':'教材與教師備註';$('#drawer-body').innerHTML=type==='notebook'?notebook():sources();if(!$('#drawer').open)$('#drawer').showModal();}
function download(){const blob=new Blob(['\uFEFF'+recordText()],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='五四運動-選擇學習紀錄.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
document.addEventListener('click',event=>{
  const b=event.target.closest('[data-action]');if(!b)return;
  const {action:a,key:k,value:v}=b.dataset;
  if(a==='chapter'){state.chapter=Number(v);render(true);}
  else if(a==='answer'){const changed=state.answers[k]!==Number(v);state.answers[k]=Number(v);if(changed&&['criterion',...outerIds,...innerIds].includes(k))state.paragraphChecked=false;render();}
  else if(a==='hint'){state.hints[k]=!state.hints[k];render();}
  else if(a==='cursor'){state.cursors[k]=Number(v);render();}
  else if(a==='impact'){state.impact=Number(v);render();}
  else if(a==='eval-step'){state.evaluationStep=Number(v);render(true);}
  else if(a==='opinion'){if(state.opinion!==v)state.paragraphChecked=false;state.opinion=v;render();}
  else if(a==='sentence'){if(!state.paragraph.includes(k))state.paragraph.push(k);state.paragraphChecked=false;render();}
  else if(a==='move-sentence'){const from=Number(v),to=from+(k==='up'?-1:1);if(from>=0&&from<state.paragraph.length&&to>=0&&to<state.paragraph.length){[state.paragraph[from],state.paragraph[to]]=[state.paragraph[to],state.paragraph[from]];state.paragraphChecked=false;render();document.querySelector(`[data-action="move-sentence"][data-value="${to}"][data-key="${k}"]`)?.focus({preventScroll:true});}}
  else if(a==='remove-sentence'){state.paragraph.splice(Number(v),1);state.paragraphChecked=false;render();}
  else if(a==='undo'){state.paragraph.pop();state.paragraphChecked=false;render();}
  else if(a==='paragraph-check'){state.paragraphChecked=true;render();}
  else if(a==='paragraph-hint'){state.paragraphHint=!state.paragraphHint;render();}
  else if(a==='notebook'||a==='sources')openDrawer(a);
  else if(a==='close')$('#drawer').close();
  else if(a==='export')download();
  else if(a==='reset-first')b.outerHTML='<div class="feedback warn"><p>將清除本版的選擇與排序，可先下載紀錄。舊版作答仍保留。</p><button data-action="reset-confirm">確認重新開始本版</button></div>';
  else if(a==='reset-confirm'){state=fresh();$('#drawer').close();render(true);}
});
$('.brand').addEventListener('click',event=>{event.preventDefault();state.chapter=0;render(true);});
render();
