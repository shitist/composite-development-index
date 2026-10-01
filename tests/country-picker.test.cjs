const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
class Element {
  constructor(parent=null) {this.parent=parent;this.listeners={};this.dataset={};this.hidden=false;this.offsetTop=0;this.scrollTop=0;this.value='USA';}
  addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);}
  emit(name,props={}){const event={target:this,preventDefault(){},...props};for(let el=this;el;el=el.parent)for(const fn of el.listeners[name]||[])fn(event);}
  contains(other){for(let el=other;el;el=el.parent)if(el===this)return true;return false;}
  setAttribute(){}
  select(){this.selected=true;}
  focus(){this.emit('focus');}
  blur(){}
}
function harness(source) {
  const doc=new Element();
  const main=new Element(doc), picker=new Element(main), input=new Element(picker), toggle=new Element(picker), menu=new Element(picker), list=new Element(menu), empty=new Element(menu);
  const options=['USA','MAR','CHN'].map(code=>{const el=new Element(list);el.dataset={countryCode:code,search:code.toLowerCase()};return el;});
  menu.hidden=true;
  const map={'#country-picker':picker,'#country-picker-input':input,'#country-picker-toggle':toggle,'#country-picker-menu':menu,'#country-picker-empty':empty};
  doc.querySelector=id=>map[id];doc.activeElement=input;
  picker.querySelector=()=>list;picker.querySelectorAll=()=>options;
  const state={selectedCode:'USA'};
  const context={document:doc,window:{},mountCountryMotion(){},views:new Map([['country',main]]),country:{code:'USA'},countrySearchLabel:c=>c.code,countryByCode:code=>({code}),state,renderAll(){menu.hidden=true;}};
  const bindings=source.slice(source.indexOf('  const picker = document.querySelector("#country-picker");'),source.indexOf('\n}\n\nfunction renderCompare'));
  const dismissal=source.slice(source.indexOf('function setupCountryPickerDismissal()'),source.indexOf('\nfunction setupInstall()'));
  vm.runInNewContext(bindings+'\n'+dismissal+'\nsetupCountryPickerDismissal();',context);
  return {doc,main,picker,input,toggle,menu,list,options,state};
}
function replay(source) {
  const h=harness(source); h.input.emit('focus');
  // Replay the user's logged order: down on MAR, focusout to main,
  // then release/click. A hidden list loses the hit target to main.
  h.options[1].emit('pointerdown');h.options[1].emit('touchstart');
  h.options[1].emit('pointerup');h.options[1].emit('touchend');h.options[1].emit('mousedown');
  h.doc.activeElement=h.main;
  h.input.emit('blur',{relatedTarget:h.main});h.input.emit('focusout',{relatedTarget:h.main});
  const hiddenBeforeClick=h.menu.hidden;
  const target=hiddenBeforeClick?h.main:h.options[1];target.emit('mouseup');target.emit('click');
  return {hiddenBeforeClick,selected:h.state.selectedCode};
}
const fixed=fs.readFileSync(require('node:path').join(__dirname,'../js/app.js'),'utf8');
assert.deepEqual(replay(fixed),{hiddenBeforeClick:false,selected:'MAR'});
const h=harness(fixed);h.input.emit('focus');assert(h.input.selected);
h.options[1].emit('touchstart');h.list.emit('scroll');h.options[1].emit('touchend');assert.equal(h.menu.hidden,false);assert.equal(h.state.selectedCode,'USA');
h.input.emit('focusout',{relatedTarget:h.main});assert.equal(h.menu.hidden,false);
h.main.emit('click');assert.equal(h.menu.hidden,true);
h.input.emit('focus');h.doc.activeElement=h.main;h.doc.emit('keyup',{key:'Tab'});assert.equal(h.menu.hidden,true);
h.input.emit('focus');h.input.emit('keydown',{key:'Escape'});assert.equal(h.menu.hidden,true);
h.input.emit('focus');h.input.value='mar';h.input.emit('input');assert(h.options[0].hidden);assert(!h.options[1].hidden);h.input.emit('keydown',{key:'Enter'});assert.equal(h.state.selectedCode,'MAR');
console.log('PASS: iOS event sequence keeps options visible and selects MAR');
console.log('PASS: auto-select, scrolling, outside click, Tab, Escape, search and Enter');
