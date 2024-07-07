(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function r(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function o(e){if(e.ep)return;e.ep=!0;const i=r(e);fetch(e.href,i)}})();const l=1920;let c=0,h=!1,d=document.getElementById("video"),a=document.getElementById("canvas"),y=document.getElementById("start-button"),w=document.getElementById("photos-list"),u=document.getElementById("onionskins"),m=document.getElementById("countdown"),f=document.getElementById("seconds-input");window.innerWidth<window.innerHeight&&(document.body.style="font-size:0.75em",document.getElementById("countdown-input-container").style="width:100%; text-align:center;",y.style="padding:0.5em 0.25em;",document.getElementById("app").style="flex-direction:column;",w.style="flex-direction:row; overflow:scroll hidden; height:unset; width:100vw; height:25vh; padding-left:3em; margin:0; box-sizing:border-box;");y.onclick=n=>{E(),n.preventDefault()};navigator.mediaDevices.getUserMedia({video:!0,audio:!1}).then(n=>{d.srcObject=n,d.play()}).catch(n=>{console.error("Error: "+n)});d.oncanplay=n=>{h||(c=d.videoHeight/(d.videoWidth/l),isNaN(c)&&(c=l/(4/3)),d.setAttribute("width",l),d.setAttribute("height",c),a.setAttribute("width",l),a.setAttribute("height",c),h=!0)};const b=n=>new Promise(t=>setTimeout(t,n));async function E(){if(f.value!="0")for(let t=f.value;t>=0;t--)m.innerText=t+"",await b(1e3);const n=a.getContext("2d");if(c){a.width=l,a.height=c,n.drawImage(d,0,0,l,c);const t=a.toDataURL("image/png");let r=document.createElement("div");window.innerWidth<window.innerHeight?r.style="display:block; height:100%;":r.style="display:block; width:100%;";let o=document.createElement("img");r.appendChild(o),o.setAttribute("src",t),o.setAttribute("class","prospectivePhoto"),window.innerWidth<window.innerHeight&&(o.style="height:50%; width:inherit;");let e=document.createElement("input");e.setAttribute("type","checkbox"),e.id="cb-"+t,e.style="position:relative;",e.onclick=s=>{s.currentTarget.checked?p(o):g(o)},r.appendChild(e),o.onclick=s=>{e.checked=!e.checked,e.checked?p(o):g(o)};let i=document.createElement("label");i.style="font-size:0.9em;",i.innerText="Tick to use the above photo as an onionskin",i.setAttribute("for",e.id),r.appendChild(i),w.appendChild(r)}else clearphoto();m.innerText=""}function p(n){let t=document.createElement("img");t.id=n.src,t.src=n.src,u.appendChild(t),v()}function v(){let n=1/(u.childElementCount+1);for(const t of u.children)t.style="height:100%;position:absolute;transform:translate(-50%,0%);opacity:"+n}function g(n){document.getElementById(n.src).remove(),v()}window.addEventListener("beforeunload",function(n){var t=`Are you sure you want to leave?
Make sure you've right clicked and saved any images you want to keep before leaving.`;return(n||window.event).returnValue=t,t});