(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const na="170",Il=0,La=1,Ul=2,ia=1,Vo=2,cn=3,Rn=0,Re=1,hn=2,Tn=0,li=1,Da=2,Ia=3,Ua=4,Nl=5,zn=100,Fl=101,Ol=102,Bl=103,zl=104,kl=200,Gl=201,Hl=202,Vl=203,gr=204,_r=205,Wl=206,Xl=207,ql=208,Yl=209,Kl=210,Zl=211,$l=212,Jl=213,jl=214,vr=0,xr=1,yr=2,ui=3,Mr=4,Sr=5,wr=6,Er=7,Wo=0,Ql=1,tc=2,bn=0,ec=1,nc=2,ic=3,Xo=4,sc=5,rc=6,ac=7,qo=300,di=301,fi=302,Tr=303,br=304,Rs=306,oe=1e3,Gn=1001,Ar=1002,qe=1003,oc=1004,Yi=1005,Qe=1006,Ns=1007,Hn=1008,pn=1009,Yo=1010,Ko=1011,Bi=1012,sa=1013,Vn=1014,un=1015,Gi=1016,ra=1017,aa=1018,pi=1020,Zo=35902,$o=1021,Jo=1022,Xe=1023,jo=1024,Qo=1025,ci=1026,mi=1027,tl=1028,oa=1029,el=1030,la=1031,ca=1033,_s=33776,vs=33777,xs=33778,ys=33779,Rr=35840,Cr=35841,Pr=35842,Lr=35843,Dr=36196,Ir=37492,Ur=37496,Nr=37808,Fr=37809,Or=37810,Br=37811,zr=37812,kr=37813,Gr=37814,Hr=37815,Vr=37816,Wr=37817,Xr=37818,qr=37819,Yr=37820,Kr=37821,Ms=36492,Zr=36494,$r=36495,nl=36283,Jr=36284,jr=36285,Qr=36286,lc=3200,cc=3201,il=0,hc=1,En="",Be="srgb",_i="srgb-linear",Cs="linear",Jt="srgb",qn=7680,Na=519,uc=512,dc=513,fc=514,sl=515,pc=516,mc=517,gc=518,_c=519,Fa=35044,Oa="300 es",dn=2e3,ws=2001;class vi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}}const xe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ba=1234567;const Ii=Math.PI/180,zi=180/Math.PI;function xi(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(xe[s&255]+xe[s>>8&255]+xe[s>>16&255]+xe[s>>24&255]+"-"+xe[t&255]+xe[t>>8&255]+"-"+xe[t>>16&15|64]+xe[t>>24&255]+"-"+xe[e&63|128]+xe[e>>8&255]+"-"+xe[e>>16&255]+xe[e>>24&255]+xe[n&255]+xe[n>>8&255]+xe[n>>16&255]+xe[n>>24&255]).toLowerCase()}function ge(s,t,e){return Math.max(t,Math.min(e,s))}function ha(s,t){return(s%t+t)%t}function vc(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function xc(s,t,e){return s!==t?(e-s)/(t-s):0}function Ui(s,t,e){return(1-e)*s+e*t}function yc(s,t,e,n){return Ui(s,t,1-Math.exp(-e*n))}function Mc(s,t=1){return t-Math.abs(ha(s,t*2)-t)}function Sc(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function wc(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Ec(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Tc(s,t){return s+Math.random()*(t-s)}function bc(s){return s*(.5-Math.random())}function Ac(s){s!==void 0&&(Ba=s);let t=Ba+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Rc(s){return s*Ii}function Cc(s){return s*zi}function Pc(s){return(s&s-1)===0&&s!==0}function Lc(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Dc(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Ic(s,t,e,n,i){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),f=a((t-n)/2),p=r((n-t)/2),g=a((n-t)/2);switch(i){case"XYX":s.set(o*h,l*u,l*f,o*c);break;case"YZY":s.set(l*f,o*h,l*u,o*c);break;case"ZXZ":s.set(l*u,l*f,o*h,o*c);break;case"XZX":s.set(o*h,l*g,l*p,o*c);break;case"YXY":s.set(l*p,o*h,l*g,o*c);break;case"ZYZ":s.set(l*g,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function ai(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Se(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const he={DEG2RAD:Ii,RAD2DEG:zi,generateUUID:xi,clamp:ge,euclideanModulo:ha,mapLinear:vc,inverseLerp:xc,lerp:Ui,damp:yc,pingpong:Mc,smoothstep:Sc,smootherstep:wc,randInt:Ec,randFloat:Tc,randFloatSpread:bc,seededRandom:Ac,degToRad:Rc,radToDeg:Cc,isPowerOfTwo:Pc,ceilPowerOfTwo:Lc,floorPowerOfTwo:Dc,setQuaternionFromProperEuler:Ic,normalize:Se,denormalize:ai};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ge(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ft{constructor(t,e,n,i,r,a,o,l,c){Ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c)}set(t,e,n,i,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],p=n[5],g=n[8],_=i[0],m=i[3],d=i[6],x=i[1],S=i[4],v=i[7],D=i[2],b=i[5],R=i[8];return r[0]=a*_+o*x+l*D,r[3]=a*m+o*S+l*b,r[6]=a*d+o*v+l*R,r[1]=c*_+h*x+u*D,r[4]=c*m+h*S+u*b,r[7]=c*d+h*v+u*R,r[2]=f*_+p*x+g*D,r[5]=f*m+p*S+g*b,r[8]=f*d+p*v+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,f=o*l-h*r,p=c*r-a*l,g=e*u+n*f+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(i*c-h*n)*_,t[2]=(o*n-i*a)*_,t[3]=f*_,t[4]=(h*e-i*l)*_,t[5]=(i*r-o*e)*_,t[6]=p*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Fs.makeScale(t,e)),this}rotate(t){return this.premultiply(Fs.makeRotation(-t)),this}translate(t,e){return this.premultiply(Fs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Fs=new Ft;function rl(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Es(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Uc(){const s=Es("canvas");return s.style.display="block",s}const za={};function Pi(s){s in za||(za[s]=!0,console.warn(s))}function Nc(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Fc(s){const t=s.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Oc(s){const t=s.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const qt={enabled:!0,workingColorSpace:_i,spaces:{},convert:function(s,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===Jt&&(s.r=fn(s.r),s.g=fn(s.g),s.b=fn(s.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(s.applyMatrix3(this.spaces[t].toXYZ),s.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===Jt&&(s.r=hi(s.r),s.g=hi(s.g),s.b=hi(s.b))),s},fromWorkingColorSpace:function(s,t){return this.convert(s,this.workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===En?Cs:this.spaces[s].transfer},getLuminanceCoefficients:function(s,t=this.workingColorSpace){return s.fromArray(this.spaces[t].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,t,e){return s.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function fn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function hi(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const ka=[.64,.33,.3,.6,.15,.06],Ga=[.2126,.7152,.0722],Ha=[.3127,.329],Va=new Ft().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Wa=new Ft().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);qt.define({[_i]:{primaries:ka,whitePoint:Ha,transfer:Cs,toXYZ:Va,fromXYZ:Wa,luminanceCoefficients:Ga,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:ka,whitePoint:Ha,transfer:Jt,toXYZ:Va,fromXYZ:Wa,luminanceCoefficients:Ga,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}});let Yn;class Bc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Yn===void 0&&(Yn=Es("canvas")),Yn.width=t.width,Yn.height=t.height;const n=Yn.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Yn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Es("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=fn(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(fn(e[n]/255)*255):e[n]=fn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let zc=0;class al{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zc++}),this.uuid=xi(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Os(i[a].image)):r.push(Os(i[a]))}else r=Os(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function Os(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Bc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let kc=0;class Te extends vi{constructor(t=Te.DEFAULT_IMAGE,e=Te.DEFAULT_MAPPING,n=Gn,i=Gn,r=Qe,a=Hn,o=Xe,l=pn,c=Te.DEFAULT_ANISOTROPY,h=En){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:kc++}),this.uuid=xi(),this.name="",this.source=new al(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==qo)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case oe:t.x=t.x-Math.floor(t.x);break;case Gn:t.x=t.x<0?0:1;break;case Ar:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case oe:t.y=t.y-Math.floor(t.y);break;case Gn:t.y=t.y<0?0:1;break;case Ar:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Te.DEFAULT_IMAGE=null;Te.DEFAULT_MAPPING=qo;Te.DEFAULT_ANISOTROPY=1;class Qt{constructor(t=0,e=0,n=0,i=1){Qt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],u=l[8],f=l[1],p=l[5],g=l[9],_=l[2],m=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(c+1)/2,v=(p+1)/2,D=(d+1)/2,b=(h+f)/4,R=(u+_)/4,C=(g+m)/4;return S>v&&S>D?S<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(S),i=b/n,r=R/n):v>D?v<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(v),n=b/i,r=C/i):D<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(D),n=R/r,i=C/r),this.set(n,i,r,e),this}let x=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(m-g)/x,this.y=(u-_)/x,this.z=(f-h)/x,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Gc extends vi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Qt(0,0,t,e),this.scissorTest=!1,this.viewport=new Qt(0,0,t,e);const i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Te(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new al(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wn extends Gc{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ol extends Te{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=qe,this.minFilter=qe,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Hc extends Te{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=qe,this.minFilter=qe,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Hi{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const f=r[a+0],p=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=f,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==f||c!==p||h!==g){let m=1-o;const d=l*f+c*p+h*g+u*_,x=d>=0?1:-1,S=1-d*d;if(S>Number.EPSILON){const D=Math.sqrt(S),b=Math.atan2(D,d*x);m=Math.sin(m*b)/D,o=Math.sin(o*b)/D}const v=o*x;if(l=l*m+f*v,c=c*m+p*v,h=h*m+g*v,u=u*m+_*v,m===1-o){const D=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=D,c*=D,h*=D,u*=D}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],f=r[a+1],p=r[a+2],g=r[a+3];return t[e]=o*g+h*u+l*p-c*f,t[e+1]=l*g+h*f+c*u-o*p,t[e+2]=c*g+h*p+o*f-l*u,t[e+3]=h*g-o*u-l*f-c*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),f=l(n/2),p=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"YXZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"ZXY":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"ZYX":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"YZX":this._x=f*h*u+c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u-f*p*g;break;case"XZY":this._x=f*h*u-c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],f=n+o+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-i)*p}else if(n>o&&n>u){const p=2*Math.sqrt(1+n-o-u);this._w=(h-l)/p,this._x=.25*p,this._y=(i+a)/p,this._z=(r+c)/p}else if(o>u){const p=2*Math.sqrt(1+o-n-u);this._w=(r-c)/p,this._x=(i+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-n-o);this._w=(a-i)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ge(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+i*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*n+e*this._x,this._y=p*i+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,f=Math.sin(e*h)/c;return this._w=a*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class T{constructor(t=0,e=0,n=0){T.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Xa.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Xa.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),h=2*(o*e-r*i),u=2*(r*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Bs.copy(this).projectOnVector(t),this.sub(Bs)}reflect(t){return this.sub(Bs.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ge(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Bs=new T,Xa=new Hi;class mn{constructor(t=new T(1/0,1/0,1/0),e=new T(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ge.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ge.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Ge.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ge):Ge.fromBufferAttribute(r,a),Ge.applyMatrix4(t.matrixWorld),this.expandByPoint(Ge);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ki.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ki.copy(n.boundingBox)),Ki.applyMatrix4(t.matrixWorld),this.union(Ki)}const i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ge),Ge.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ei),Zi.subVectors(this.max,Ei),Kn.subVectors(t.a,Ei),Zn.subVectors(t.b,Ei),$n.subVectors(t.c,Ei),vn.subVectors(Zn,Kn),xn.subVectors($n,Zn),Ln.subVectors(Kn,$n);let e=[0,-vn.z,vn.y,0,-xn.z,xn.y,0,-Ln.z,Ln.y,vn.z,0,-vn.x,xn.z,0,-xn.x,Ln.z,0,-Ln.x,-vn.y,vn.x,0,-xn.y,xn.x,0,-Ln.y,Ln.x,0];return!zs(e,Kn,Zn,$n,Zi)||(e=[1,0,0,0,1,0,0,0,1],!zs(e,Kn,Zn,$n,Zi))?!1:($i.crossVectors(vn,xn),e=[$i.x,$i.y,$i.z],zs(e,Kn,Zn,$n,Zi))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ge).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ge).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(sn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),sn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),sn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),sn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),sn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),sn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),sn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),sn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(sn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const sn=[new T,new T,new T,new T,new T,new T,new T,new T],Ge=new T,Ki=new mn,Kn=new T,Zn=new T,$n=new T,vn=new T,xn=new T,Ln=new T,Ei=new T,Zi=new T,$i=new T,Dn=new T;function zs(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Dn.fromArray(s,r);const o=i.x*Math.abs(Dn.x)+i.y*Math.abs(Dn.y)+i.z*Math.abs(Dn.z),l=t.dot(Dn),c=e.dot(Dn),h=n.dot(Dn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Vc=new mn,Ti=new T,ks=new T;class Ps{constructor(t=new T,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Vc.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ti.subVectors(t,this.center);const e=Ti.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ti,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ks.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ti.copy(t.center).add(ks)),this.expandByPoint(Ti.copy(t.center).sub(ks))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const rn=new T,Gs=new T,Ji=new T,yn=new T,Hs=new T,ji=new T,Vs=new T;class ua{constructor(t=new T,e=new T(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,rn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=rn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(rn.copy(this.origin).addScaledVector(this.direction,e),rn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Gs.copy(t).add(e).multiplyScalar(.5),Ji.copy(e).sub(t).normalize(),yn.copy(this.origin).sub(Gs);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ji),o=yn.dot(this.direction),l=-yn.dot(Ji),c=yn.lengthSq(),h=Math.abs(1-a*a);let u,f,p,g;if(h>0)if(u=a*l-o,f=a*o-l,g=r*h,u>=0)if(f>=-g)if(f<=g){const _=1/h;u*=_,f*=_,p=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-r,-l),r),p=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),p=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Gs).addScaledVector(Ji,f),p}intersectSphere(t,e){rn.subVectors(t.center,this.origin);const n=rn.dot(this.direction),i=rn.dot(rn)-n*n,r=t.radius*t.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(t.min.x-f.x)*c,i=(t.max.x-f.x)*c):(n=(t.max.x-f.x)*c,i=(t.min.x-f.x)*c),h>=0?(r=(t.min.y-f.y)*h,a=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,a=(t.min.y-f.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(t.min.z-f.z)*u,l=(t.max.z-f.z)*u):(o=(t.max.z-f.z)*u,l=(t.min.z-f.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,rn)!==null}intersectTriangle(t,e,n,i,r){Hs.subVectors(e,t),ji.subVectors(n,t),Vs.crossVectors(Hs,ji);let a=this.direction.dot(Vs),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;yn.subVectors(this.origin,t);const l=o*this.direction.dot(ji.crossVectors(yn,ji));if(l<0)return null;const c=o*this.direction.dot(Hs.cross(yn));if(c<0||l+c>a)return null;const h=-o*yn.dot(Vs);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ne{constructor(t,e,n,i,r,a,o,l,c,h,u,f,p,g,_,m){ne.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c,h,u,f,p,g,_,m)}set(t,e,n,i,r,a,o,l,c,h,u,f,p,g,_,m){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=i,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=_,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ne().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/Jn.setFromMatrixColumn(t,0).length(),r=1/Jn.setFromMatrixColumn(t,1).length(),a=1/Jn.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const f=a*h,p=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=p+g*c,e[5]=f-_*c,e[9]=-o*l,e[2]=_-f*c,e[6]=g+p*c,e[10]=a*l}else if(t.order==="YXZ"){const f=l*h,p=l*u,g=c*h,_=c*u;e[0]=f+_*o,e[4]=g*o-p,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=p*o-g,e[6]=_+f*o,e[10]=a*l}else if(t.order==="ZXY"){const f=l*h,p=l*u,g=c*h,_=c*u;e[0]=f-_*o,e[4]=-a*u,e[8]=g+p*o,e[1]=p+g*o,e[5]=a*h,e[9]=_-f*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const f=a*h,p=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=g*c-p,e[8]=f*c+_,e[1]=l*u,e[5]=_*c+f,e[9]=p*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const f=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=_-f*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=p*u+g,e[10]=f-_*u}else if(t.order==="XZY"){const f=a*l,p=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=f*u+_,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=o*h,e[10]=_*u+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Wc,t,Xc)}lookAt(t,e,n){const i=this.elements;return Le.subVectors(t,e),Le.lengthSq()===0&&(Le.z=1),Le.normalize(),Mn.crossVectors(n,Le),Mn.lengthSq()===0&&(Math.abs(n.z)===1?Le.x+=1e-4:Le.z+=1e-4,Le.normalize(),Mn.crossVectors(n,Le)),Mn.normalize(),Qi.crossVectors(Le,Mn),i[0]=Mn.x,i[4]=Qi.x,i[8]=Le.x,i[1]=Mn.y,i[5]=Qi.y,i[9]=Le.y,i[2]=Mn.z,i[6]=Qi.z,i[10]=Le.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],p=n[13],g=n[2],_=n[6],m=n[10],d=n[14],x=n[3],S=n[7],v=n[11],D=n[15],b=i[0],R=i[4],C=i[8],E=i[12],M=i[1],L=i[5],B=i[9],z=i[13],q=i[2],K=i[6],X=i[10],j=i[14],V=i[3],it=i[7],ot=i[11],gt=i[15];return r[0]=a*b+o*M+l*q+c*V,r[4]=a*R+o*L+l*K+c*it,r[8]=a*C+o*B+l*X+c*ot,r[12]=a*E+o*z+l*j+c*gt,r[1]=h*b+u*M+f*q+p*V,r[5]=h*R+u*L+f*K+p*it,r[9]=h*C+u*B+f*X+p*ot,r[13]=h*E+u*z+f*j+p*gt,r[2]=g*b+_*M+m*q+d*V,r[6]=g*R+_*L+m*K+d*it,r[10]=g*C+_*B+m*X+d*ot,r[14]=g*E+_*z+m*j+d*gt,r[3]=x*b+S*M+v*q+D*V,r[7]=x*R+S*L+v*K+D*it,r[11]=x*C+S*B+v*X+D*ot,r[15]=x*E+S*z+v*j+D*gt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],f=t[10],p=t[14],g=t[3],_=t[7],m=t[11],d=t[15];return g*(+r*l*u-i*c*u-r*o*f+n*c*f+i*o*p-n*l*p)+_*(+e*l*p-e*c*f+r*a*f-i*a*p+i*c*h-r*l*h)+m*(+e*c*u-e*o*p-r*a*u+n*a*p+r*o*h-n*c*h)+d*(-i*o*h-e*l*u+e*o*f+i*a*u-n*a*f+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],f=t[10],p=t[11],g=t[12],_=t[13],m=t[14],d=t[15],x=u*m*c-_*f*c+_*l*p-o*m*p-u*l*d+o*f*d,S=g*f*c-h*m*c-g*l*p+a*m*p+h*l*d-a*f*d,v=h*_*c-g*u*c+g*o*p-a*_*p-h*o*d+a*u*d,D=g*u*l-h*_*l-g*o*f+a*_*f+h*o*m-a*u*m,b=e*x+n*S+i*v+r*D;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/b;return t[0]=x*R,t[1]=(_*f*r-u*m*r-_*i*p+n*m*p+u*i*d-n*f*d)*R,t[2]=(o*m*r-_*l*r+_*i*c-n*m*c-o*i*d+n*l*d)*R,t[3]=(u*l*r-o*f*r-u*i*c+n*f*c+o*i*p-n*l*p)*R,t[4]=S*R,t[5]=(h*m*r-g*f*r+g*i*p-e*m*p-h*i*d+e*f*d)*R,t[6]=(g*l*r-a*m*r-g*i*c+e*m*c+a*i*d-e*l*d)*R,t[7]=(a*f*r-h*l*r+h*i*c-e*f*c-a*i*p+e*l*p)*R,t[8]=v*R,t[9]=(g*u*r-h*_*r-g*n*p+e*_*p+h*n*d-e*u*d)*R,t[10]=(a*_*r-g*o*r+g*n*c-e*_*c-a*n*d+e*o*d)*R,t[11]=(h*o*r-a*u*r-h*n*c+e*u*c+a*n*p-e*o*p)*R,t[12]=D*R,t[13]=(h*_*i-g*u*i+g*n*f-e*_*f-h*n*m+e*u*m)*R,t[14]=(g*o*i-a*_*i-g*n*l+e*_*l+a*n*m-e*o*m)*R,t[15]=(a*u*i-h*o*i+h*n*l-e*u*l-a*n*f+e*o*f)*R,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,f=r*c,p=r*h,g=r*u,_=a*h,m=a*u,d=o*u,x=l*c,S=l*h,v=l*u,D=n.x,b=n.y,R=n.z;return i[0]=(1-(_+d))*D,i[1]=(p+v)*D,i[2]=(g-S)*D,i[3]=0,i[4]=(p-v)*b,i[5]=(1-(f+d))*b,i[6]=(m+x)*b,i[7]=0,i[8]=(g+S)*R,i[9]=(m-x)*R,i[10]=(1-(f+_))*R,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=Jn.set(i[0],i[1],i[2]).length();const a=Jn.set(i[4],i[5],i[6]).length(),o=Jn.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],He.copy(this);const c=1/r,h=1/a,u=1/o;return He.elements[0]*=c,He.elements[1]*=c,He.elements[2]*=c,He.elements[4]*=h,He.elements[5]*=h,He.elements[6]*=h,He.elements[8]*=u,He.elements[9]*=u,He.elements[10]*=u,e.setFromRotationMatrix(He),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,i,r,a,o=dn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i);let p,g;if(o===dn)p=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===ws)p=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=dn){const l=this.elements,c=1/(e-t),h=1/(n-i),u=1/(a-r),f=(e+t)*c,p=(n+i)*h;let g,_;if(o===dn)g=(a+r)*u,_=-2*u;else if(o===ws)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Jn=new T,He=new ne,Wc=new T(0,0,0),Xc=new T(1,1,1),Mn=new T,Qi=new T,Le=new T,qa=new ne,Ya=new Hi;class Ue{constructor(t=0,e=0,n=0,i=Ue.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],p=i[10];switch(e){case"XYZ":this._y=Math.asin(ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ge(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ge(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ge(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ge(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return qa.makeRotationFromQuaternion(t),this.setFromRotationMatrix(qa,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ya.setFromEuler(this),this.setFromQuaternion(Ya,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ue.DEFAULT_ORDER="XYZ";class da{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let qc=0;const Ka=new T,jn=new Hi,an=new ne,ts=new T,bi=new T,Yc=new T,Kc=new Hi,Za=new T(1,0,0),$a=new T(0,1,0),Ja=new T(0,0,1),ja={type:"added"},Zc={type:"removed"},Qn={type:"childadded",child:null},Ws={type:"childremoved",child:null};class _e extends vi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qc++}),this.uuid=xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_e.DEFAULT_UP.clone();const t=new T,e=new Ue,n=new Hi,i=new T(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ne},normalMatrix:{value:new Ft}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=_e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new da,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return jn.setFromAxisAngle(t,e),this.quaternion.multiply(jn),this}rotateOnWorldAxis(t,e){return jn.setFromAxisAngle(t,e),this.quaternion.premultiply(jn),this}rotateX(t){return this.rotateOnAxis(Za,t)}rotateY(t){return this.rotateOnAxis($a,t)}rotateZ(t){return this.rotateOnAxis(Ja,t)}translateOnAxis(t,e){return Ka.copy(t).applyQuaternion(this.quaternion),this.position.add(Ka.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Za,t)}translateY(t){return this.translateOnAxis($a,t)}translateZ(t){return this.translateOnAxis(Ja,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(an.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ts.copy(t):ts.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),bi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?an.lookAt(bi,ts,this.up):an.lookAt(ts,bi,this.up),this.quaternion.setFromRotationMatrix(an),i&&(an.extractRotation(i.matrixWorld),jn.setFromRotationMatrix(an),this.quaternion.premultiply(jn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ja),Qn.child=t,this.dispatchEvent(Qn),Qn.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Zc),Ws.child=t,this.dispatchEvent(Ws),Ws.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),an.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),an.multiply(t.parent.matrixWorld)),t.applyMatrix4(an),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ja),Qn.child=t,this.dispatchEvent(Qn),Qn.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bi,t,Yc),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(bi,Kc,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),f=a(t.skeletons),p=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}_e.DEFAULT_UP=new T(0,1,0);_e.DEFAULT_MATRIX_AUTO_UPDATE=!0;_e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ve=new T,on=new T,Xs=new T,ln=new T,ti=new T,ei=new T,Qa=new T,qs=new T,Ys=new T,Ks=new T,Zs=new Qt,$s=new Qt,Js=new Qt;class We{constructor(t=new T,e=new T,n=new T){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Ve.subVectors(t,e),i.cross(Ve);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Ve.subVectors(i,e),on.subVectors(n,e),Xs.subVectors(t,e);const a=Ve.dot(Ve),o=Ve.dot(on),l=Ve.dot(Xs),c=on.dot(on),h=on.dot(Xs),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,p=(c*l-o*h)*f,g=(a*h-o*l)*f;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ln)===null?!1:ln.x>=0&&ln.y>=0&&ln.x+ln.y<=1}static getInterpolation(t,e,n,i,r,a,o,l){return this.getBarycoord(t,e,n,i,ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ln.x),l.addScaledVector(a,ln.y),l.addScaledVector(o,ln.z),l)}static getInterpolatedAttribute(t,e,n,i,r,a){return Zs.setScalar(0),$s.setScalar(0),Js.setScalar(0),Zs.fromBufferAttribute(t,e),$s.fromBufferAttribute(t,n),Js.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(Zs,r.x),a.addScaledVector($s,r.y),a.addScaledVector(Js,r.z),a}static isFrontFacing(t,e,n,i){return Ve.subVectors(n,e),on.subVectors(t,e),Ve.cross(on).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ve.subVectors(this.c,this.b),on.subVectors(this.a,this.b),Ve.cross(on).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return We.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return We.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return We.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return We.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return We.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let a,o;ti.subVectors(i,n),ei.subVectors(r,n),qs.subVectors(t,n);const l=ti.dot(qs),c=ei.dot(qs);if(l<=0&&c<=0)return e.copy(n);Ys.subVectors(t,i);const h=ti.dot(Ys),u=ei.dot(Ys);if(h>=0&&u<=h)return e.copy(i);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(ti,a);Ks.subVectors(t,r);const p=ti.dot(Ks),g=ei.dot(Ks);if(g>=0&&p<=g)return e.copy(r);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(ei,o);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Qa.subVectors(r,i),o=(u-h)/(u-h+(p-g)),e.copy(i).addScaledVector(Qa,o);const d=1/(m+_+f);return a=_*d,o=f*d,e.copy(n).addScaledVector(ti,a).addScaledVector(ei,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const ll={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Sn={h:0,s:0,l:0},es={h:0,s:0,l:0};function js(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class zt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,qt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,qt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=qt.workingColorSpace){if(t=ha(t,1),e=ge(e,0,1),n=ge(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=js(a,r,t+1/3),this.g=js(a,r,t),this.b=js(a,r,t-1/3)}return qt.toWorkingColorSpace(this,i),this}setStyle(t,e=Be){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const n=ll[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=fn(t.r),this.g=fn(t.g),this.b=fn(t.b),this}copyLinearToSRGB(t){return this.r=hi(t.r),this.g=hi(t.g),this.b=hi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return qt.fromWorkingColorSpace(ye.copy(this),t),Math.round(ge(ye.r*255,0,255))*65536+Math.round(ge(ye.g*255,0,255))*256+Math.round(ge(ye.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=qt.workingColorSpace){qt.fromWorkingColorSpace(ye.copy(this),e);const n=ye.r,i=ye.g,r=ye.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=qt.workingColorSpace){return qt.fromWorkingColorSpace(ye.copy(this),e),t.r=ye.r,t.g=ye.g,t.b=ye.b,t}getStyle(t=Be){qt.fromWorkingColorSpace(ye.copy(this),t);const e=ye.r,n=ye.g,i=ye.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Sn),this.setHSL(Sn.h+t,Sn.s+e,Sn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Sn),t.getHSL(es);const n=Ui(Sn.h,es.h,e),i=Ui(Sn.s,es.s,e),r=Ui(Sn.l,es.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ye=new zt;zt.NAMES=ll;let $c=0;class yi extends vi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$c++}),this.uuid=xi(),this.name="",this.blending=li,this.side=Rn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=gr,this.blendDst=_r,this.blendEquation=zn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new zt(0,0,0),this.blendAlpha=0,this.depthFunc=ui,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Na,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=qn,this.stencilZFail=qn,this.stencilZPass=qn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==li&&(n.blending=this.blending),this.side!==Rn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==gr&&(n.blendSrc=this.blendSrc),this.blendDst!==_r&&(n.blendDst=this.blendDst),this.blendEquation!==zn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ui&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Na&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==qn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==qn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==qn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class An extends yi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ue,this.combine=Wo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const de=new T,ns=new ft;class Ye{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Fa,this.updateRanges=[],this.gpuType=un,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ns.fromBufferAttribute(this,e),ns.applyMatrix3(t),this.setXY(e,ns.x,ns.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.applyMatrix3(t),this.setXYZ(e,de.x,de.y,de.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.applyMatrix4(t),this.setXYZ(e,de.x,de.y,de.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.applyNormalMatrix(t),this.setXYZ(e,de.x,de.y,de.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.transformDirection(t),this.setXYZ(e,de.x,de.y,de.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ai(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Se(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ai(e,this.array)),e}setX(t,e){return this.normalized&&(e=Se(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ai(e,this.array)),e}setY(t,e){return this.normalized&&(e=Se(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ai(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Se(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ai(e,this.array)),e}setW(t,e){return this.normalized&&(e=Se(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Se(e,this.array),n=Se(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Se(e,this.array),n=Se(n,this.array),i=Se(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Se(e,this.array),n=Se(n,this.array),i=Se(i,this.array),r=Se(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Fa&&(t.usage=this.usage),t}}class cl extends Ye{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class hl extends Ye{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ie extends Ye{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Jc=0;const Oe=new ne,Qs=new _e,ni=new T,De=new mn,Ai=new mn,me=new T;class be extends vi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Jc++}),this.uuid=xi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(rl(t)?hl:cl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ft().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Oe.makeRotationFromQuaternion(t),this.applyMatrix4(Oe),this}rotateX(t){return Oe.makeRotationX(t),this.applyMatrix4(Oe),this}rotateY(t){return Oe.makeRotationY(t),this.applyMatrix4(Oe),this}rotateZ(t){return Oe.makeRotationZ(t),this.applyMatrix4(Oe),this}translate(t,e,n){return Oe.makeTranslation(t,e,n),this.applyMatrix4(Oe),this}scale(t,e,n){return Oe.makeScale(t,e,n),this.applyMatrix4(Oe),this}lookAt(t){return Qs.lookAt(t),Qs.updateMatrix(),this.applyMatrix4(Qs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ni).negate(),this.translate(ni.x,ni.y,ni.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ie(n,3))}else{for(let n=0,i=e.count;n<i;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new T(-1/0,-1/0,-1/0),new T(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];De.setFromBufferAttribute(r),this.morphTargetsRelative?(me.addVectors(this.boundingBox.min,De.min),this.boundingBox.expandByPoint(me),me.addVectors(this.boundingBox.max,De.max),this.boundingBox.expandByPoint(me)):(this.boundingBox.expandByPoint(De.min),this.boundingBox.expandByPoint(De.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ps);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new T,1/0);return}if(t){const n=this.boundingSphere.center;if(De.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];Ai.setFromBufferAttribute(o),this.morphTargetsRelative?(me.addVectors(De.min,Ai.min),De.expandByPoint(me),me.addVectors(De.max,Ai.max),De.expandByPoint(me)):(De.expandByPoint(Ai.min),De.expandByPoint(Ai.max))}De.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)me.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(me));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)me.fromBufferAttribute(o,c),l&&(ni.fromBufferAttribute(t,c),me.add(ni)),i=Math.max(i,n.distanceToSquared(me))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ye(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<n.count;C++)o[C]=new T,l[C]=new T;const c=new T,h=new T,u=new T,f=new ft,p=new ft,g=new ft,_=new T,m=new T;function d(C,E,M){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,E),u.fromBufferAttribute(n,M),f.fromBufferAttribute(r,C),p.fromBufferAttribute(r,E),g.fromBufferAttribute(r,M),h.sub(c),u.sub(c),p.sub(f),g.sub(f);const L=1/(p.x*g.y-g.x*p.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(L),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(L),o[C].add(_),o[E].add(_),o[M].add(_),l[C].add(m),l[E].add(m),l[M].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let C=0,E=x.length;C<E;++C){const M=x[C],L=M.start,B=M.count;for(let z=L,q=L+B;z<q;z+=3)d(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const S=new T,v=new T,D=new T,b=new T;function R(C){D.fromBufferAttribute(i,C),b.copy(D);const E=o[C];S.copy(E),S.sub(D.multiplyScalar(D.dot(E))).normalize(),v.crossVectors(b,E);const L=v.dot(l[C])<0?-1:1;a.setXYZW(C,S.x,S.y,S.z,L)}for(let C=0,E=x.length;C<E;++C){const M=x[C],L=M.start,B=M.count;for(let z=L,q=L+B;z<q;z+=3)R(t.getX(z+0)),R(t.getX(z+1)),R(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ye(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const i=new T,r=new T,a=new T,o=new T,l=new T,c=new T,h=new T,u=new T;if(t)for(let f=0,p=t.count;f<p;f+=3){const g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=e.count;f<p;f+=3)i.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),a.fromBufferAttribute(e,f+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)me.fromBufferAttribute(t,e),me.normalize(),t.setXYZ(e,me.x,me.y,me.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*h;for(let d=0;d<h;d++)f[g++]=c[p++]}return new Ye(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new be,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],p=t(f,n);l.push(p)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const p=c[u];h.push(p.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const to=new ne,In=new ua,is=new Ps,eo=new T,ss=new T,rs=new T,as=new T,tr=new T,os=new T,no=new T,ls=new T;class P extends _e{constructor(t=new be,e=new An){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(r&&o){os.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(tr.fromBufferAttribute(u,t),a?os.addScaledVector(tr,h):os.addScaledVector(tr.sub(e),h))}e.add(os)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),is.copy(n.boundingSphere),is.applyMatrix4(r),In.copy(t.ray).recast(t.near),!(is.containsPoint(In.origin)===!1&&(In.intersectSphere(is,eo)===null||In.origin.distanceToSquared(eo)>(t.far-t.near)**2))&&(to.copy(r).invert(),In.copy(t.ray).applyMatrix4(to),!(n.boundingBox!==null&&In.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,In)))}_computeIntersections(t,e,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=a[m.materialIndex],x=Math.max(m.start,p.start),S=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let v=x,D=S;v<D;v+=3){const b=o.getX(v),R=o.getX(v+1),C=o.getX(v+2);i=cs(this,d,t,n,c,h,u,b,R,C),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const x=o.getX(m),S=o.getX(m+1),v=o.getX(m+2);i=cs(this,a,t,n,c,h,u,x,S,v),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const m=f[g],d=a[m.materialIndex],x=Math.max(m.start,p.start),S=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let v=x,D=S;v<D;v+=3){const b=v,R=v+1,C=v+2;i=cs(this,d,t,n,c,h,u,b,R,C),i&&(i.faceIndex=Math.floor(v/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,d=_;m<d;m+=3){const x=m,S=m+1,v=m+2;i=cs(this,a,t,n,c,h,u,x,S,v),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function jc(s,t,e,n,i,r,a,o){let l;if(t.side===Re?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,t.side===Rn,o),l===null)return null;ls.copy(o),ls.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(ls);return c<e.near||c>e.far?null:{distance:c,point:ls.clone(),object:s}}function cs(s,t,e,n,i,r,a,o,l,c){s.getVertexPosition(o,ss),s.getVertexPosition(l,rs),s.getVertexPosition(c,as);const h=jc(s,t,e,n,ss,rs,as,no);if(h){const u=new T;We.getBarycoord(no,ss,rs,as,u),i&&(h.uv=We.getInterpolatedAttribute(i,o,l,c,u,new ft)),r&&(h.uv1=We.getInterpolatedAttribute(r,o,l,c,u,new ft)),a&&(h.normal=We.getInterpolatedAttribute(a,o,l,c,u,new T),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new T,materialIndex:0};We.getNormal(ss,rs,as,f.normal),h.face=f,h.barycoord=u}return h}class H extends be{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new ie(c,3)),this.setAttribute("normal",new ie(h,3)),this.setAttribute("uv",new ie(u,2));function g(_,m,d,x,S,v,D,b,R,C,E){const M=v/R,L=D/C,B=v/2,z=D/2,q=b/2,K=R+1,X=C+1;let j=0,V=0;const it=new T;for(let ot=0;ot<X;ot++){const gt=ot*L-z;for(let It=0;It<K;It++){const kt=It*M-B;it[_]=kt*x,it[m]=gt*S,it[d]=q,c.push(it.x,it.y,it.z),it[_]=0,it[m]=0,it[d]=b>0?1:-1,h.push(it.x,it.y,it.z),u.push(It/R),u.push(1-ot/C),j+=1}}for(let ot=0;ot<C;ot++)for(let gt=0;gt<R;gt++){const It=f+gt+K*ot,kt=f+gt+K*(ot+1),Y=f+(gt+1)+K*(ot+1),tt=f+(gt+1)+K*ot;l.push(It,kt,tt),l.push(kt,Y,tt),V+=6}o.addGroup(p,V,E),p+=V,f+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new H(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function gi(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function we(s){const t={};for(let e=0;e<s.length;e++){const n=gi(s[e]);for(const i in n)t[i]=n[i]}return t}function Qc(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function ul(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:qt.workingColorSpace}const th={clone:gi,merge:we};var eh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,nh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Cn extends yi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=eh,this.fragmentShader=nh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=gi(t.uniforms),this.uniformsGroups=Qc(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class dl extends _e{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=dn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const wn=new T,io=new ft,so=new ft;class Ie extends dl{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=zi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ii*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return zi*2*Math.atan(Math.tan(Ii*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){wn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(wn.x,wn.y).multiplyScalar(-t/wn.z),wn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(wn.x,wn.y).multiplyScalar(-t/wn.z)}getViewSize(t,e){return this.getViewBounds(t,io,so),e.subVectors(so,io)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ii*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ii=-90,si=1;class ih extends _e{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ie(ii,si,t,e);i.layers=this.layers,this.add(i);const r=new Ie(ii,si,t,e);r.layers=this.layers,this.add(r);const a=new Ie(ii,si,t,e);a.layers=this.layers,this.add(a);const o=new Ie(ii,si,t,e);o.layers=this.layers,this.add(o);const l=new Ie(ii,si,t,e);l.layers=this.layers,this.add(l);const c=new Ie(ii,si,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===dn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ws)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),f=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,f,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class fl extends Te{constructor(t,e,n,i,r,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:di,super(t,e,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class sh extends Wn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new fl(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Qe}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new H(5,5,5),r=new Cn({name:"CubemapFromEquirect",uniforms:gi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Re,blending:Tn});r.uniforms.tEquirect.value=e;const a=new P(i,r),o=e.minFilter;return e.minFilter===Hn&&(e.minFilter=Qe),new ih(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}}const er=new T,rh=new T,ah=new Ft;class On{constructor(t=new T(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=er.subVectors(n,e).cross(rh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(er),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ah.getNormalMatrix(t),i=this.coplanarPoint(er).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Un=new Ps,hs=new T;class fa{constructor(t=new On,e=new On,n=new On,i=new On,r=new On,a=new On){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=dn){const n=this.planes,i=t.elements,r=i[0],a=i[1],o=i[2],l=i[3],c=i[4],h=i[5],u=i[6],f=i[7],p=i[8],g=i[9],_=i[10],m=i[11],d=i[12],x=i[13],S=i[14],v=i[15];if(n[0].setComponents(l-r,f-c,m-p,v-d).normalize(),n[1].setComponents(l+r,f+c,m+p,v+d).normalize(),n[2].setComponents(l+a,f+h,m+g,v+x).normalize(),n[3].setComponents(l-a,f-h,m-g,v-x).normalize(),n[4].setComponents(l-o,f-u,m-_,v-S).normalize(),e===dn)n[5].setComponents(l+o,f+u,m+_,v+S).normalize();else if(e===ws)n[5].setComponents(o,u,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Un.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Un.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Un)}intersectsSprite(t){return Un.center.set(0,0,0),Un.radius=.7071067811865476,Un.applyMatrix4(t.matrixWorld),this.intersectsSphere(Un)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(hs.x=i.normal.x>0?t.max.x:t.min.x,hs.y=i.normal.y>0?t.max.y:t.min.y,hs.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(hs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function pl(){let s=null,t=!1,e=null,n=null;function i(r,a){e(r,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function oh(s){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=s.createBuffer();s.bindBuffer(l,f),s.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=s.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=s.HALF_FLOAT:p=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=s.SHORT;else if(c instanceof Uint32Array)p=s.UNSIGNED_INT;else if(c instanceof Int32Array)p=s.INT;else if(c instanceof Int8Array)p=s.BYTE;else if(c instanceof Uint8Array)p=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((p,g)=>p.start-g.start);let f=0;for(let p=1;p<u.length;p++){const g=u[f],_=u[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,u[f]=_)}u.length=f+1;for(let p=0,g=u.length;p<g;p++){const _=u[p];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}class Vi extends be{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=t/o,f=e/l,p=[],g=[],_=[],m=[];for(let d=0;d<h;d++){const x=d*f-a;for(let S=0;S<c;S++){const v=S*u-r;g.push(v,-x,0),_.push(0,0,1),m.push(S/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<o;x++){const S=x+c*d,v=x+c*(d+1),D=x+1+c*(d+1),b=x+1+c*d;p.push(S,v,b),p.push(v,D,b)}this.setIndex(p),this.setAttribute("position",new ie(g,3)),this.setAttribute("normal",new ie(_,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vi(t.width,t.height,t.widthSegments,t.heightSegments)}}var lh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ch=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,hh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,fh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ph=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,mh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gh=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,_h=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,vh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Mh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Sh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,wh=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Eh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Th=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,bh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ah=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Rh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ch=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ph=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Lh=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Dh=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ih=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Uh=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nh=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Fh=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Oh=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bh="gl_FragColor = linearToOutputTexel( gl_FragColor );",zh=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,kh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Gh=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Hh=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Vh=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wh=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Xh=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,qh=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yh=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kh=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zh=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,$h=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jh=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jh=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qh=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,tu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,eu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,iu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,su=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ru=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,au=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ou=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lu=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,cu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hu=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,uu=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,du=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fu=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,_u=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,yu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Mu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Su=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wu=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Eu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,bu=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Au=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ru=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cu=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Pu=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Lu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Du=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Iu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Uu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Nu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fu=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ou=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bu=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ku=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hu=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Vu=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Wu=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Xu=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,qu=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Yu=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ku=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Zu=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$u=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ju=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ju=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qu=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,td=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ed=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,nd=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,id=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,sd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ad=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const od=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ld=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hd=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ud=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,pd=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,md=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,gd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,_d=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xd=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,yd=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Md=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Sd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wd=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ed=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Td=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,bd=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ad=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Rd=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Cd=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Pd=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ld=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Dd=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Id=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ud=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nd=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Fd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Od=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bd=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,zd=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kd=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Bt={alphahash_fragment:lh,alphahash_pars_fragment:ch,alphamap_fragment:hh,alphamap_pars_fragment:uh,alphatest_fragment:dh,alphatest_pars_fragment:fh,aomap_fragment:ph,aomap_pars_fragment:mh,batching_pars_vertex:gh,batching_vertex:_h,begin_vertex:vh,beginnormal_vertex:xh,bsdfs:yh,iridescence_fragment:Mh,bumpmap_pars_fragment:Sh,clipping_planes_fragment:wh,clipping_planes_pars_fragment:Eh,clipping_planes_pars_vertex:Th,clipping_planes_vertex:bh,color_fragment:Ah,color_pars_fragment:Rh,color_pars_vertex:Ch,color_vertex:Ph,common:Lh,cube_uv_reflection_fragment:Dh,defaultnormal_vertex:Ih,displacementmap_pars_vertex:Uh,displacementmap_vertex:Nh,emissivemap_fragment:Fh,emissivemap_pars_fragment:Oh,colorspace_fragment:Bh,colorspace_pars_fragment:zh,envmap_fragment:kh,envmap_common_pars_fragment:Gh,envmap_pars_fragment:Hh,envmap_pars_vertex:Vh,envmap_physical_pars_fragment:tu,envmap_vertex:Wh,fog_vertex:Xh,fog_pars_vertex:qh,fog_fragment:Yh,fog_pars_fragment:Kh,gradientmap_pars_fragment:Zh,lightmap_pars_fragment:$h,lights_lambert_fragment:Jh,lights_lambert_pars_fragment:jh,lights_pars_begin:Qh,lights_toon_fragment:eu,lights_toon_pars_fragment:nu,lights_phong_fragment:iu,lights_phong_pars_fragment:su,lights_physical_fragment:ru,lights_physical_pars_fragment:au,lights_fragment_begin:ou,lights_fragment_maps:lu,lights_fragment_end:cu,logdepthbuf_fragment:hu,logdepthbuf_pars_fragment:uu,logdepthbuf_pars_vertex:du,logdepthbuf_vertex:fu,map_fragment:pu,map_pars_fragment:mu,map_particle_fragment:gu,map_particle_pars_fragment:_u,metalnessmap_fragment:vu,metalnessmap_pars_fragment:xu,morphinstance_vertex:yu,morphcolor_vertex:Mu,morphnormal_vertex:Su,morphtarget_pars_vertex:wu,morphtarget_vertex:Eu,normal_fragment_begin:Tu,normal_fragment_maps:bu,normal_pars_fragment:Au,normal_pars_vertex:Ru,normal_vertex:Cu,normalmap_pars_fragment:Pu,clearcoat_normal_fragment_begin:Lu,clearcoat_normal_fragment_maps:Du,clearcoat_pars_fragment:Iu,iridescence_pars_fragment:Uu,opaque_fragment:Nu,packing:Fu,premultiplied_alpha_fragment:Ou,project_vertex:Bu,dithering_fragment:zu,dithering_pars_fragment:ku,roughnessmap_fragment:Gu,roughnessmap_pars_fragment:Hu,shadowmap_pars_fragment:Vu,shadowmap_pars_vertex:Wu,shadowmap_vertex:Xu,shadowmask_pars_fragment:qu,skinbase_vertex:Yu,skinning_pars_vertex:Ku,skinning_vertex:Zu,skinnormal_vertex:$u,specularmap_fragment:Ju,specularmap_pars_fragment:ju,tonemapping_fragment:Qu,tonemapping_pars_fragment:td,transmission_fragment:ed,transmission_pars_fragment:nd,uv_pars_fragment:id,uv_pars_vertex:sd,uv_vertex:rd,worldpos_vertex:ad,background_vert:od,background_frag:ld,backgroundCube_vert:cd,backgroundCube_frag:hd,cube_vert:ud,cube_frag:dd,depth_vert:fd,depth_frag:pd,distanceRGBA_vert:md,distanceRGBA_frag:gd,equirect_vert:_d,equirect_frag:vd,linedashed_vert:xd,linedashed_frag:yd,meshbasic_vert:Md,meshbasic_frag:Sd,meshlambert_vert:wd,meshlambert_frag:Ed,meshmatcap_vert:Td,meshmatcap_frag:bd,meshnormal_vert:Ad,meshnormal_frag:Rd,meshphong_vert:Cd,meshphong_frag:Pd,meshphysical_vert:Ld,meshphysical_frag:Dd,meshtoon_vert:Id,meshtoon_frag:Ud,points_vert:Nd,points_frag:Fd,shadow_vert:Od,shadow_frag:Bd,sprite_vert:zd,sprite_frag:kd},rt={common:{diffuse:{value:new zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ft},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ft}},envmap:{envMap:{value:null},envMapRotation:{value:new Ft},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ft},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0},uvTransform:{value:new Ft}},sprite:{diffuse:{value:new zt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ft},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0}}},je={basic:{uniforms:we([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.fog]),vertexShader:Bt.meshbasic_vert,fragmentShader:Bt.meshbasic_frag},lambert:{uniforms:we([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new zt(0)}}]),vertexShader:Bt.meshlambert_vert,fragmentShader:Bt.meshlambert_frag},phong:{uniforms:we([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new zt(0)},specular:{value:new zt(1118481)},shininess:{value:30}}]),vertexShader:Bt.meshphong_vert,fragmentShader:Bt.meshphong_frag},standard:{uniforms:we([rt.common,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.roughnessmap,rt.metalnessmap,rt.fog,rt.lights,{emissive:{value:new zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag},toon:{uniforms:we([rt.common,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.gradientmap,rt.fog,rt.lights,{emissive:{value:new zt(0)}}]),vertexShader:Bt.meshtoon_vert,fragmentShader:Bt.meshtoon_frag},matcap:{uniforms:we([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,{matcap:{value:null}}]),vertexShader:Bt.meshmatcap_vert,fragmentShader:Bt.meshmatcap_frag},points:{uniforms:we([rt.points,rt.fog]),vertexShader:Bt.points_vert,fragmentShader:Bt.points_frag},dashed:{uniforms:we([rt.common,rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Bt.linedashed_vert,fragmentShader:Bt.linedashed_frag},depth:{uniforms:we([rt.common,rt.displacementmap]),vertexShader:Bt.depth_vert,fragmentShader:Bt.depth_frag},normal:{uniforms:we([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,{opacity:{value:1}}]),vertexShader:Bt.meshnormal_vert,fragmentShader:Bt.meshnormal_frag},sprite:{uniforms:we([rt.sprite,rt.fog]),vertexShader:Bt.sprite_vert,fragmentShader:Bt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Bt.background_vert,fragmentShader:Bt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ft}},vertexShader:Bt.backgroundCube_vert,fragmentShader:Bt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Bt.cube_vert,fragmentShader:Bt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Bt.equirect_vert,fragmentShader:Bt.equirect_frag},distanceRGBA:{uniforms:we([rt.common,rt.displacementmap,{referencePosition:{value:new T},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Bt.distanceRGBA_vert,fragmentShader:Bt.distanceRGBA_frag},shadow:{uniforms:we([rt.lights,rt.fog,{color:{value:new zt(0)},opacity:{value:1}}]),vertexShader:Bt.shadow_vert,fragmentShader:Bt.shadow_frag}};je.physical={uniforms:we([je.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ft},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ft},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ft},sheen:{value:0},sheenColor:{value:new zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ft},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ft},attenuationDistance:{value:0},attenuationColor:{value:new zt(0)},specularColor:{value:new zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ft},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ft}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag};const us={r:0,b:0,g:0},Nn=new Ue,Gd=new ne;function Hd(s,t,e,n,i,r,a){const o=new zt(0);let l=r===!0?0:1,c,h,u=null,f=0,p=null;function g(x){let S=x.isScene===!0?x.background:null;return S&&S.isTexture&&(S=(x.backgroundBlurriness>0?e:t).get(S)),S}function _(x){let S=!1;const v=g(x);v===null?d(o,l):v&&v.isColor&&(d(v,1),S=!0);const D=s.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(x,S){const v=g(S);v&&(v.isCubeTexture||v.mapping===Rs)?(h===void 0&&(h=new P(new H(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:gi(je.backgroundCube.uniforms),vertexShader:je.backgroundCube.vertexShader,fragmentShader:je.backgroundCube.fragmentShader,side:Re,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Nn.copy(S.backgroundRotation),Nn.x*=-1,Nn.y*=-1,Nn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Nn.y*=-1,Nn.z*=-1),h.material.uniforms.envMap.value=v,h.material.uniforms.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Gd.makeRotationFromEuler(Nn)),h.material.toneMapped=qt.getTransfer(v.colorSpace)!==Jt,(u!==v||f!==v.version||p!==s.toneMapping)&&(h.material.needsUpdate=!0,u=v,f=v.version,p=s.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):v&&v.isTexture&&(c===void 0&&(c=new P(new Vi(2,2),new Cn({name:"BackgroundMaterial",uniforms:gi(je.background.uniforms),vertexShader:je.background.vertexShader,fragmentShader:je.background.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=v,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=qt.getTransfer(v.colorSpace)!==Jt,v.matrixAutoUpdate===!0&&v.updateMatrix(),c.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||p!==s.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,p=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function d(x,S){x.getRGB(us,ul(s)),n.buffers.color.setClear(us.r,us.g,us.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(x,S=1){o.set(x),l=S,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,d(o,l)},render:_,addToRenderList:m}}function Vd(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=f(null);let r=i,a=!1;function o(M,L,B,z,q){let K=!1;const X=u(z,B,L);r!==X&&(r=X,c(r.object)),K=p(M,z,B,q),K&&g(M,z,B,q),q!==null&&t.update(q,s.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,v(M,L,B,z),q!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function l(){return s.createVertexArray()}function c(M){return s.bindVertexArray(M)}function h(M){return s.deleteVertexArray(M)}function u(M,L,B){const z=B.wireframe===!0;let q=n[M.id];q===void 0&&(q={},n[M.id]=q);let K=q[L.id];K===void 0&&(K={},q[L.id]=K);let X=K[z];return X===void 0&&(X=f(l()),K[z]=X),X}function f(M){const L=[],B=[],z=[];for(let q=0;q<e;q++)L[q]=0,B[q]=0,z[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:B,attributeDivisors:z,object:M,attributes:{},index:null}}function p(M,L,B,z){const q=r.attributes,K=L.attributes;let X=0;const j=B.getAttributes();for(const V in j)if(j[V].location>=0){const ot=q[V];let gt=K[V];if(gt===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(gt=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(gt=M.instanceColor)),ot===void 0||ot.attribute!==gt||gt&&ot.data!==gt.data)return!0;X++}return r.attributesNum!==X||r.index!==z}function g(M,L,B,z){const q={},K=L.attributes;let X=0;const j=B.getAttributes();for(const V in j)if(j[V].location>=0){let ot=K[V];ot===void 0&&(V==="instanceMatrix"&&M.instanceMatrix&&(ot=M.instanceMatrix),V==="instanceColor"&&M.instanceColor&&(ot=M.instanceColor));const gt={};gt.attribute=ot,ot&&ot.data&&(gt.data=ot.data),q[V]=gt,X++}r.attributes=q,r.attributesNum=X,r.index=z}function _(){const M=r.newAttributes;for(let L=0,B=M.length;L<B;L++)M[L]=0}function m(M){d(M,0)}function d(M,L){const B=r.newAttributes,z=r.enabledAttributes,q=r.attributeDivisors;B[M]=1,z[M]===0&&(s.enableVertexAttribArray(M),z[M]=1),q[M]!==L&&(s.vertexAttribDivisor(M,L),q[M]=L)}function x(){const M=r.newAttributes,L=r.enabledAttributes;for(let B=0,z=L.length;B<z;B++)L[B]!==M[B]&&(s.disableVertexAttribArray(B),L[B]=0)}function S(M,L,B,z,q,K,X){X===!0?s.vertexAttribIPointer(M,L,B,q,K):s.vertexAttribPointer(M,L,B,z,q,K)}function v(M,L,B,z){_();const q=z.attributes,K=B.getAttributes(),X=L.defaultAttributeValues;for(const j in K){const V=K[j];if(V.location>=0){let it=q[j];if(it===void 0&&(j==="instanceMatrix"&&M.instanceMatrix&&(it=M.instanceMatrix),j==="instanceColor"&&M.instanceColor&&(it=M.instanceColor)),it!==void 0){const ot=it.normalized,gt=it.itemSize,It=t.get(it);if(It===void 0)continue;const kt=It.buffer,Y=It.type,tt=It.bytesPerElement,_t=Y===s.INT||Y===s.UNSIGNED_INT||it.gpuType===sa;if(it.isInterleavedBufferAttribute){const st=it.data,wt=st.stride,Rt=it.offset;if(st.isInstancedInterleavedBuffer){for(let Pt=0;Pt<V.locationSize;Pt++)d(V.location+Pt,st.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let Pt=0;Pt<V.locationSize;Pt++)m(V.location+Pt);s.bindBuffer(s.ARRAY_BUFFER,kt);for(let Pt=0;Pt<V.locationSize;Pt++)S(V.location+Pt,gt/V.locationSize,Y,ot,wt*tt,(Rt+gt/V.locationSize*Pt)*tt,_t)}else{if(it.isInstancedBufferAttribute){for(let st=0;st<V.locationSize;st++)d(V.location+st,it.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=it.meshPerAttribute*it.count)}else for(let st=0;st<V.locationSize;st++)m(V.location+st);s.bindBuffer(s.ARRAY_BUFFER,kt);for(let st=0;st<V.locationSize;st++)S(V.location+st,gt/V.locationSize,Y,ot,gt*tt,gt/V.locationSize*st*tt,_t)}}else if(X!==void 0){const ot=X[j];if(ot!==void 0)switch(ot.length){case 2:s.vertexAttrib2fv(V.location,ot);break;case 3:s.vertexAttrib3fv(V.location,ot);break;case 4:s.vertexAttrib4fv(V.location,ot);break;default:s.vertexAttrib1fv(V.location,ot)}}}}x()}function D(){C();for(const M in n){const L=n[M];for(const B in L){const z=L[B];for(const q in z)h(z[q].object),delete z[q];delete L[B]}delete n[M]}}function b(M){if(n[M.id]===void 0)return;const L=n[M.id];for(const B in L){const z=L[B];for(const q in z)h(z[q].object),delete z[q];delete L[B]}delete n[M.id]}function R(M){for(const L in n){const B=n[L];if(B[M.id]===void 0)continue;const z=B[M.id];for(const q in z)h(z[q].object),delete z[q];delete B[M.id]}}function C(){E(),a=!0,r!==i&&(r=i,c(r.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:C,resetDefaultState:E,dispose:D,releaseStatesOfGeometry:b,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function Wd(s,t,e){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,n,1)}function l(c,h,u,f){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)a(c[g],h[g],f[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,f,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*f[_];e.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Xd(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==Xe&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const C=R===Gi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==pn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==un&&!C)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,f=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),p=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),d=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,b=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:x,maxVaryings:S,maxFragmentUniforms:v,vertexTextures:D,maxSamples:b}}function qd(s){const t=this;let e=null,n=0,i=!1,r=!1;const a=new On,o=new Ft,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||i;return i=f,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){e=h(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,d=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const x=r?0:n,S=x*4;let v=d.clippingState||null;l.value=v,v=h(g,f,S,p);for(let D=0;D!==S;++D)v[D]=e[D];d.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,f,p,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const d=p+_*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<d)&&(m=new Float32Array(d));for(let S=0,v=p;S!==_;++S,v+=4)a.copy(u[S]).applyMatrix4(x,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Yd(s){let t=new WeakMap;function e(a,o){return o===Tr?a.mapping=di:o===br&&(a.mapping=fi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Tr||o===br)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new sh(l.height);return c.fromEquirectangularTexture(s,a),t.set(a,c),a.addEventListener("dispose",i),e(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class ml extends dl{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const oi=4,ro=[.125,.215,.35,.446,.526,.582],kn=20,nr=new ml,ao=new zt;let ir=null,sr=0,rr=0,ar=!1;const Bn=(1+Math.sqrt(5))/2,ri=1/Bn,oo=[new T(-Bn,ri,0),new T(Bn,ri,0),new T(-ri,0,Bn),new T(ri,0,Bn),new T(0,Bn,-ri),new T(0,Bn,ri),new T(-1,1,-1),new T(1,1,-1),new T(-1,1,1),new T(1,1,1)];class lo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){ir=this._renderer.getRenderTarget(),sr=this._renderer.getActiveCubeFace(),rr=this._renderer.getActiveMipmapLevel(),ar=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=uo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ho(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ir,sr,rr),this._renderer.xr.enabled=ar,t.scissorTest=!1,ds(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===di||t.mapping===fi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ir=this._renderer.getRenderTarget(),sr=this._renderer.getActiveCubeFace(),rr=this._renderer.getActiveMipmapLevel(),ar=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Qe,minFilter:Qe,generateMipmaps:!1,type:Gi,format:Xe,colorSpace:_i,depthBuffer:!1},i=co(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=co(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Kd(r)),this._blurMaterial=Zd(r,t,e)}return i}_compileMaterial(t){const e=new P(this._lodPlanes[0],t);this._renderer.compile(e,nr)}_sceneToCubeUV(t,e,n,i){const o=new Ie(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(ao),h.toneMapping=bn,h.autoClear=!1;const p=new An({name:"PMREM.Background",side:Re,depthWrite:!1,depthTest:!1}),g=new P(new H,p);let _=!1;const m=t.background;m?m.isColor&&(p.color.copy(m),t.background=null,_=!0):(p.color.copy(ao),_=!0);for(let d=0;d<6;d++){const x=d%3;x===0?(o.up.set(0,l[d],0),o.lookAt(c[d],0,0)):x===1?(o.up.set(0,0,l[d]),o.lookAt(0,c[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,c[d]));const S=this._cubeSize;ds(i,x*S,d>2?S:0,S,S),h.setRenderTarget(i),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===di||t.mapping===fi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=uo()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ho());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new P(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;ds(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,nr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=oo[(i-r-1)%oo.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",r),this._halfBlur(a,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new P(this._lodPlanes[i],c),f=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*kn-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):kn;m>kn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${kn}`);const d=[];let x=0;for(let R=0;R<kn;++R){const C=R/_,E=Math.exp(-C*C/2);d.push(E),R===0?x+=E:R<m&&(x+=2*E)}for(let R=0;R<d.length;R++)d[R]=d[R]/x;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:S}=this;f.dTheta.value=g,f.mipInt.value=S-n;const v=this._sizeLods[i],D=3*v*(i>S-oi?i-S+oi:0),b=4*(this._cubeSize-v);ds(e,D,b,3*v,2*v),l.setRenderTarget(e),l.render(u,nr)}}function Kd(s){const t=[],e=[],n=[];let i=s;const r=s-oi+1+ro.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);e.push(o);let l=1/o;a>s-oi?l=ro[a-s+oi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,m=2,d=1,x=new Float32Array(_*g*p),S=new Float32Array(m*g*p),v=new Float32Array(d*g*p);for(let b=0;b<p;b++){const R=b%3*2/3-1,C=b>2?0:-1,E=[R,C,0,R+2/3,C,0,R+2/3,C+1,0,R,C,0,R+2/3,C+1,0,R,C+1,0];x.set(E,_*g*b),S.set(f,m*g*b);const M=[b,b,b,b,b,b];v.set(M,d*g*b)}const D=new be;D.setAttribute("position",new Ye(x,_)),D.setAttribute("uv",new Ye(S,m)),D.setAttribute("faceIndex",new Ye(v,d)),t.push(D),i>oi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function co(s,t,e){const n=new Wn(s,t,e);return n.texture.mapping=Rs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ds(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Zd(s,t,e){const n=new Float32Array(kn),i=new T(0,1,0);return new Cn({name:"SphericalGaussianBlur",defines:{n:kn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function ho(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function uo(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:pa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function pa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function $d(s){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Tr||l===br,h=l===di||l===fi;if(c||h){let u=t.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return e===null&&(e=new lo(s)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const p=o.image;return c&&p&&p.height>0||h&&p&&i(p)?(e===null&&(e=new lo(s)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Jd(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Pi("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function jd(s,t,e,n){const i={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&t.remove(f.index);for(const g in f.attributes)t.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let m=0,d=_.length;m<d;m++)t.remove(_[m])}f.removeEventListener("dispose",a),delete i[f.id];const p=r.get(f);p&&(t.remove(p),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function o(u,f){return i[f.id]===!0||(f.addEventListener("dispose",a),i[f.id]=!0,e.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)t.update(f[g],s.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const _=p[g];for(let m=0,d=_.length;m<d;m++)t.update(_[m],s.ARRAY_BUFFER)}}function c(u){const f=[],p=u.index,g=u.attributes.position;let _=0;if(p!==null){const x=p.array;_=p.version;for(let S=0,v=x.length;S<v;S+=3){const D=x[S+0],b=x[S+1],R=x[S+2];f.push(D,b,b,R,R,D)}}else if(g!==void 0){const x=g.array;_=g.version;for(let S=0,v=x.length/3-1;S<v;S+=3){const D=S+0,b=S+1,R=S+2;f.push(D,b,b,R,R,D)}}else return;const m=new(rl(f)?hl:cl)(f,1);m.version=_;const d=r.get(u);d&&t.remove(d),r.set(u,m)}function h(u){const f=r.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function Qd(s,t,e){let n;function i(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,p){s.drawElements(n,p,r,f*a),e.update(p,n,1)}function c(f,p,g){g!==0&&(s.drawElementsInstanced(n,p,r,f*a,g),e.update(p,n,g))}function h(f,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,f,0,g);let m=0;for(let d=0;d<g;d++)m+=p[d];e.update(m,n,1)}function u(f,p,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/a,p[d],_[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,f,0,_,0,g);let d=0;for(let x=0;x<g;x++)d+=p[x]*_[x];e.update(d,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function tf(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function ef(s,t,e){const n=new WeakMap,i=new Qt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=n.get(o);if(f===void 0||f.count!==u){let M=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",M)};var p=M;f!==void 0&&f.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let D=o.attributes.position.count*v,b=1;D>t.maxTextureSize&&(b=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const R=new Float32Array(D*b*4*u),C=new ol(R,D,b,u);C.type=un,C.needsUpdate=!0;const E=v*4;for(let L=0;L<u;L++){const B=d[L],z=x[L],q=S[L],K=D*b*4*L;for(let X=0;X<B.count;X++){const j=X*E;g===!0&&(i.fromBufferAttribute(B,X),R[K+j+0]=i.x,R[K+j+1]=i.y,R[K+j+2]=i.z,R[K+j+3]=0),_===!0&&(i.fromBufferAttribute(z,X),R[K+j+4]=i.x,R[K+j+5]=i.y,R[K+j+6]=i.z,R[K+j+7]=0),m===!0&&(i.fromBufferAttribute(q,X),R[K+j+8]=i.x,R[K+j+9]=i.y,R[K+j+10]=i.z,R[K+j+11]=q.itemSize===4?i.w:1)}}f={count:u,texture:C,size:new ft(D,b)},n.set(o,f),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",_),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",f.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",f.size)}return{update:r}}function nf(s,t,e,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return u}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}class gl extends Te{constructor(t,e,n,i,r,a,o,l,c,h=ci){if(h!==ci&&h!==mi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ci&&(n=Vn),n===void 0&&h===mi&&(n=pi),super(null,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:qe,this.minFilter=l!==void 0?l:qe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const _l=new Te,fo=new gl(1,1),vl=new ol,xl=new Hc,yl=new fl,po=[],mo=[],go=new Float32Array(16),_o=new Float32Array(9),vo=new Float32Array(4);function Mi(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=po[i];if(r===void 0&&(r=new Float32Array(i),po[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function fe(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function pe(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Ls(s,t){let e=mo[t];e===void 0&&(e=new Int32Array(t),mo[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function sf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function rf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fe(e,t))return;s.uniform2fv(this.addr,t),pe(e,t)}}function af(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(fe(e,t))return;s.uniform3fv(this.addr,t),pe(e,t)}}function of(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fe(e,t))return;s.uniform4fv(this.addr,t),pe(e,t)}}function lf(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(fe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),pe(e,t)}else{if(fe(e,n))return;vo.set(n),s.uniformMatrix2fv(this.addr,!1,vo),pe(e,n)}}function cf(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(fe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),pe(e,t)}else{if(fe(e,n))return;_o.set(n),s.uniformMatrix3fv(this.addr,!1,_o),pe(e,n)}}function hf(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(fe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),pe(e,t)}else{if(fe(e,n))return;go.set(n),s.uniformMatrix4fv(this.addr,!1,go),pe(e,n)}}function uf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function df(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fe(e,t))return;s.uniform2iv(this.addr,t),pe(e,t)}}function ff(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(fe(e,t))return;s.uniform3iv(this.addr,t),pe(e,t)}}function pf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fe(e,t))return;s.uniform4iv(this.addr,t),pe(e,t)}}function mf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function gf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(fe(e,t))return;s.uniform2uiv(this.addr,t),pe(e,t)}}function _f(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(fe(e,t))return;s.uniform3uiv(this.addr,t),pe(e,t)}}function vf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(fe(e,t))return;s.uniform4uiv(this.addr,t),pe(e,t)}}function xf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(fo.compareFunction=sl,r=fo):r=_l,e.setTexture2D(t||r,i)}function yf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||xl,i)}function Mf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||yl,i)}function Sf(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||vl,i)}function wf(s){switch(s){case 5126:return sf;case 35664:return rf;case 35665:return af;case 35666:return of;case 35674:return lf;case 35675:return cf;case 35676:return hf;case 5124:case 35670:return uf;case 35667:case 35671:return df;case 35668:case 35672:return ff;case 35669:case 35673:return pf;case 5125:return mf;case 36294:return gf;case 36295:return _f;case 36296:return vf;case 35678:case 36198:case 36298:case 36306:case 35682:return xf;case 35679:case 36299:case 36307:return yf;case 35680:case 36300:case 36308:case 36293:return Mf;case 36289:case 36303:case 36311:case 36292:return Sf}}function Ef(s,t){s.uniform1fv(this.addr,t)}function Tf(s,t){const e=Mi(t,this.size,2);s.uniform2fv(this.addr,e)}function bf(s,t){const e=Mi(t,this.size,3);s.uniform3fv(this.addr,e)}function Af(s,t){const e=Mi(t,this.size,4);s.uniform4fv(this.addr,e)}function Rf(s,t){const e=Mi(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Cf(s,t){const e=Mi(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Pf(s,t){const e=Mi(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Lf(s,t){s.uniform1iv(this.addr,t)}function Df(s,t){s.uniform2iv(this.addr,t)}function If(s,t){s.uniform3iv(this.addr,t)}function Uf(s,t){s.uniform4iv(this.addr,t)}function Nf(s,t){s.uniform1uiv(this.addr,t)}function Ff(s,t){s.uniform2uiv(this.addr,t)}function Of(s,t){s.uniform3uiv(this.addr,t)}function Bf(s,t){s.uniform4uiv(this.addr,t)}function zf(s,t,e){const n=this.cache,i=t.length,r=Ls(e,i);fe(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||_l,r[a])}function kf(s,t,e){const n=this.cache,i=t.length,r=Ls(e,i);fe(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||xl,r[a])}function Gf(s,t,e){const n=this.cache,i=t.length,r=Ls(e,i);fe(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||yl,r[a])}function Hf(s,t,e){const n=this.cache,i=t.length,r=Ls(e,i);fe(n,r)||(s.uniform1iv(this.addr,r),pe(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||vl,r[a])}function Vf(s){switch(s){case 5126:return Ef;case 35664:return Tf;case 35665:return bf;case 35666:return Af;case 35674:return Rf;case 35675:return Cf;case 35676:return Pf;case 5124:case 35670:return Lf;case 35667:case 35671:return Df;case 35668:case 35672:return If;case 35669:case 35673:return Uf;case 5125:return Nf;case 36294:return Ff;case 36295:return Of;case 36296:return Bf;case 35678:case 36198:case 36298:case 36306:case 35682:return zf;case 35679:case 36299:case 36307:return kf;case 35680:case 36300:case 36308:case 36293:return Gf;case 36289:case 36303:case 36311:case 36292:return Hf}}class Wf{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=wf(e.type)}}class Xf{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Vf(e.type)}}class qf{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(t,e[o.id],n)}}}const or=/(\w+)(\])?(\[|\.)?/g;function xo(s,t){s.seq.push(t),s.map[t.id]=t}function Yf(s,t,e){const n=s.name,i=n.length;for(or.lastIndex=0;;){const r=or.exec(n),a=or.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){xo(e,c===void 0?new Wf(o,s,t):new Xf(o,s,t));break}else{let u=e.map[o];u===void 0&&(u=new qf(o),xo(e,u)),e=u}}}class Ss{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),a=t.getUniformLocation(e,r.name);Yf(r,a,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function yo(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const Kf=37297;let Zf=0;function $f(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Mo=new Ft;function Jf(s){qt._getMatrix(Mo,qt.workingColorSpace,s);const t=`mat3( ${Mo.elements.map(e=>e.toFixed(4))} )`;switch(qt.getTransfer(s)){case Cs:return[t,"LinearTransferOETF"];case Jt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function So(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+$f(s.getShaderSource(t),a)}else return i}function jf(s,t){const e=Jf(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Qf(s,t){let e;switch(t){case ec:e="Linear";break;case nc:e="Reinhard";break;case ic:e="Cineon";break;case Xo:e="ACESFilmic";break;case rc:e="AgX";break;case ac:e="Neutral";break;case sc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const fs=new T;function tp(){qt.getLuminanceCoefficients(fs);const s=fs.x.toFixed(4),t=fs.y.toFixed(4),e=fs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ep(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Li).join(`
`)}function np(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function ip(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function Li(s){return s!==""}function wo(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Eo(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const sp=/^[ \t]*#include +<([\w\d./]+)>/gm;function ta(s){return s.replace(sp,ap)}const rp=new Map;function ap(s,t){let e=Bt[t];if(e===void 0){const n=rp.get(t);if(n!==void 0)e=Bt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ta(e)}const op=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function To(s){return s.replace(op,lp)}function lp(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function bo(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function cp(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===ia?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Vo?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===cn&&(t="SHADOWMAP_TYPE_VSM"),t}function hp(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case di:case fi:t="ENVMAP_TYPE_CUBE";break;case Rs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function up(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case fi:t="ENVMAP_MODE_REFRACTION";break}return t}function dp(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Wo:t="ENVMAP_BLENDING_MULTIPLY";break;case Ql:t="ENVMAP_BLENDING_MIX";break;case tc:t="ENVMAP_BLENDING_ADD";break}return t}function fp(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function pp(s,t,e,n){const i=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=cp(e),c=hp(e),h=up(e),u=dp(e),f=fp(e),p=ep(e),g=np(r),_=i.createProgram();let m,d,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Li).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Li).join(`
`),d.length>0&&(d+=`
`)):(m=[bo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Li).join(`
`),d=[bo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==bn?"#define TONE_MAPPING":"",e.toneMapping!==bn?Bt.tonemapping_pars_fragment:"",e.toneMapping!==bn?Qf("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Bt.colorspace_pars_fragment,jf("linearToOutputTexel",e.outputColorSpace),tp(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Li).join(`
`)),a=ta(a),a=wo(a,e),a=Eo(a,e),o=ta(o),o=wo(o,e),o=Eo(o,e),a=To(a),o=To(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",e.glslVersion===Oa?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Oa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const S=x+m+a,v=x+d+o,D=yo(i,i.VERTEX_SHADER,S),b=yo(i,i.FRAGMENT_SHADER,v);i.attachShader(_,D),i.attachShader(_,b),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function R(L){if(s.debug.checkShaderErrors){const B=i.getProgramInfoLog(_).trim(),z=i.getShaderInfoLog(D).trim(),q=i.getShaderInfoLog(b).trim();let K=!0,X=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(K=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,D,b);else{const j=So(i,D,"vertex"),V=So(i,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+B+`
`+j+`
`+V)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(z===""||q==="")&&(X=!1);X&&(L.diagnostics={runnable:K,programLog:B,vertexShader:{log:z,prefix:m},fragmentShader:{log:q,prefix:d}})}i.deleteShader(D),i.deleteShader(b),C=new Ss(i,_),E=ip(i,_)}let C;this.getUniforms=function(){return C===void 0&&R(this),C};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let M=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=i.getProgramParameter(_,Kf)),M},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Zf++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=D,this.fragmentShader=b,this}let mp=0;class gp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new _p(t),e.set(t,n)),n}}class _p{constructor(t){this.id=mp++,this.code=t,this.usedTimes=0}}function vp(s,t,e,n,i,r,a){const o=new da,l=new gp,c=new Set,h=[],u=i.logarithmicDepthBuffer,f=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return c.add(E),E===0?"uv":`uv${E}`}function m(E,M,L,B,z){const q=B.fog,K=z.geometry,X=E.isMeshStandardMaterial?B.environment:null,j=(E.isMeshStandardMaterial?e:t).get(E.envMap||X),V=j&&j.mapping===Rs?j.image.height:null,it=g[E.type];E.precision!==null&&(p=i.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const ot=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,gt=ot!==void 0?ot.length:0;let It=0;K.morphAttributes.position!==void 0&&(It=1),K.morphAttributes.normal!==void 0&&(It=2),K.morphAttributes.color!==void 0&&(It=3);let kt,Y,tt,_t;if(it){const $t=je[it];kt=$t.vertexShader,Y=$t.fragmentShader}else kt=E.vertexShader,Y=E.fragmentShader,l.update(E),tt=l.getVertexShaderID(E),_t=l.getFragmentShaderID(E);const st=s.getRenderTarget(),wt=s.state.buffers.depth.getReversed(),Rt=z.isInstancedMesh===!0,Pt=z.isBatchedMesh===!0,le=!!E.map,Wt=!!E.matcap,ue=!!j,F=!!E.aoMap,Ne=!!E.lightMap,Gt=!!E.bumpMap,Ht=!!E.normalMap,bt=!!E.displacementMap,se=!!E.emissiveMap,Tt=!!E.metalnessMap,A=!!E.roughnessMap,y=E.anisotropy>0,O=E.clearcoat>0,$=E.dispersion>0,Q=E.iridescence>0,Z=E.sheen>0,Mt=E.transmission>0,lt=y&&!!E.anisotropyMap,dt=O&&!!E.clearcoatMap,Xt=O&&!!E.clearcoatNormalMap,et=O&&!!E.clearcoatRoughnessMap,pt=Q&&!!E.iridescenceMap,At=Q&&!!E.iridescenceThicknessMap,Lt=Z&&!!E.sheenColorMap,mt=Z&&!!E.sheenRoughnessMap,Vt=!!E.specularMap,Ot=!!E.specularColorMap,te=!!E.specularIntensityMap,I=Mt&&!!E.transmissionMap,at=Mt&&!!E.thicknessMap,W=!!E.gradientMap,J=!!E.alphaMap,ut=E.alphaTest>0,ct=!!E.alphaHash,Ut=!!E.extensions;let ce=bn;E.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(ce=s.toneMapping);const ve={shaderID:it,shaderType:E.type,shaderName:E.name,vertexShader:kt,fragmentShader:Y,defines:E.defines,customVertexShaderID:tt,customFragmentShaderID:_t,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:Pt,batchingColor:Pt&&z._colorsTexture!==null,instancing:Rt,instancingColor:Rt&&z.instanceColor!==null,instancingMorph:Rt&&z.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:st===null?s.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:_i,alphaToCoverage:!!E.alphaToCoverage,map:le,matcap:Wt,envMap:ue,envMapMode:ue&&j.mapping,envMapCubeUVHeight:V,aoMap:F,lightMap:Ne,bumpMap:Gt,normalMap:Ht,displacementMap:f&&bt,emissiveMap:se,normalMapObjectSpace:Ht&&E.normalMapType===hc,normalMapTangentSpace:Ht&&E.normalMapType===il,metalnessMap:Tt,roughnessMap:A,anisotropy:y,anisotropyMap:lt,clearcoat:O,clearcoatMap:dt,clearcoatNormalMap:Xt,clearcoatRoughnessMap:et,dispersion:$,iridescence:Q,iridescenceMap:pt,iridescenceThicknessMap:At,sheen:Z,sheenColorMap:Lt,sheenRoughnessMap:mt,specularMap:Vt,specularColorMap:Ot,specularIntensityMap:te,transmission:Mt,transmissionMap:I,thicknessMap:at,gradientMap:W,opaque:E.transparent===!1&&E.blending===li&&E.alphaToCoverage===!1,alphaMap:J,alphaTest:ut,alphaHash:ct,combine:E.combine,mapUv:le&&_(E.map.channel),aoMapUv:F&&_(E.aoMap.channel),lightMapUv:Ne&&_(E.lightMap.channel),bumpMapUv:Gt&&_(E.bumpMap.channel),normalMapUv:Ht&&_(E.normalMap.channel),displacementMapUv:bt&&_(E.displacementMap.channel),emissiveMapUv:se&&_(E.emissiveMap.channel),metalnessMapUv:Tt&&_(E.metalnessMap.channel),roughnessMapUv:A&&_(E.roughnessMap.channel),anisotropyMapUv:lt&&_(E.anisotropyMap.channel),clearcoatMapUv:dt&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:Xt&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:et&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:pt&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:At&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:Lt&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:mt&&_(E.sheenRoughnessMap.channel),specularMapUv:Vt&&_(E.specularMap.channel),specularColorMapUv:Ot&&_(E.specularColorMap.channel),specularIntensityMapUv:te&&_(E.specularIntensityMap.channel),transmissionMapUv:I&&_(E.transmissionMap.channel),thicknessMapUv:at&&_(E.thicknessMap.channel),alphaMapUv:J&&_(E.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(Ht||y),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!K.attributes.uv&&(le||J),fog:!!q,useFog:E.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:wt,skinning:z.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:gt,morphTextureStride:It,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:ce,decodeVideoTexture:le&&E.map.isVideoTexture===!0&&qt.getTransfer(E.map.colorSpace)===Jt,decodeVideoTextureEmissive:se&&E.emissiveMap.isVideoTexture===!0&&qt.getTransfer(E.emissiveMap.colorSpace)===Jt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===hn,flipSided:E.side===Re,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Ut&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ut&&E.extensions.multiDraw===!0||Pt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return ve.vertexUv1s=c.has(1),ve.vertexUv2s=c.has(2),ve.vertexUv3s=c.has(3),c.clear(),ve}function d(E){const M=[];if(E.shaderID?M.push(E.shaderID):(M.push(E.customVertexShaderID),M.push(E.customFragmentShaderID)),E.defines!==void 0)for(const L in E.defines)M.push(L),M.push(E.defines[L]);return E.isRawShaderMaterial===!1&&(x(M,E),S(M,E),M.push(s.outputColorSpace)),M.push(E.customProgramCacheKey),M.join()}function x(E,M){E.push(M.precision),E.push(M.outputColorSpace),E.push(M.envMapMode),E.push(M.envMapCubeUVHeight),E.push(M.mapUv),E.push(M.alphaMapUv),E.push(M.lightMapUv),E.push(M.aoMapUv),E.push(M.bumpMapUv),E.push(M.normalMapUv),E.push(M.displacementMapUv),E.push(M.emissiveMapUv),E.push(M.metalnessMapUv),E.push(M.roughnessMapUv),E.push(M.anisotropyMapUv),E.push(M.clearcoatMapUv),E.push(M.clearcoatNormalMapUv),E.push(M.clearcoatRoughnessMapUv),E.push(M.iridescenceMapUv),E.push(M.iridescenceThicknessMapUv),E.push(M.sheenColorMapUv),E.push(M.sheenRoughnessMapUv),E.push(M.specularMapUv),E.push(M.specularColorMapUv),E.push(M.specularIntensityMapUv),E.push(M.transmissionMapUv),E.push(M.thicknessMapUv),E.push(M.combine),E.push(M.fogExp2),E.push(M.sizeAttenuation),E.push(M.morphTargetsCount),E.push(M.morphAttributeCount),E.push(M.numDirLights),E.push(M.numPointLights),E.push(M.numSpotLights),E.push(M.numSpotLightMaps),E.push(M.numHemiLights),E.push(M.numRectAreaLights),E.push(M.numDirLightShadows),E.push(M.numPointLightShadows),E.push(M.numSpotLightShadows),E.push(M.numSpotLightShadowsWithMaps),E.push(M.numLightProbes),E.push(M.shadowMapType),E.push(M.toneMapping),E.push(M.numClippingPlanes),E.push(M.numClipIntersection),E.push(M.depthPacking)}function S(E,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),E.push(o.mask)}function v(E){const M=g[E.type];let L;if(M){const B=je[M];L=th.clone(B.uniforms)}else L=E.uniforms;return L}function D(E,M){let L;for(let B=0,z=h.length;B<z;B++){const q=h[B];if(q.cacheKey===M){L=q,++L.usedTimes;break}}return L===void 0&&(L=new pp(s,M,E,r),h.push(L)),L}function b(E){if(--E.usedTimes===0){const M=h.indexOf(E);h[M]=h[h.length-1],h.pop(),E.destroy()}}function R(E){l.remove(E)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:v,acquireProgram:D,releaseProgram:b,releaseShaderCache:R,programs:h,dispose:C}}function xp(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function yp(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Ao(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Ro(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u,f,p,g,_,m){let d=s[t];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},s[t]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=_,d.group=m),t++,d}function o(u,f,p,g,_,m){const d=a(u,f,p,g,_,m);p.transmission>0?n.push(d):p.transparent===!0?i.push(d):e.push(d)}function l(u,f,p,g,_,m){const d=a(u,f,p,g,_,m);p.transmission>0?n.unshift(d):p.transparent===!0?i.unshift(d):e.unshift(d)}function c(u,f){e.length>1&&e.sort(u||yp),n.length>1&&n.sort(f||Ao),i.length>1&&i.sort(f||Ao)}function h(){for(let u=t,f=s.length;u<f;u++){const p=s[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:h,sort:c}}function Mp(){let s=new WeakMap;function t(n,i){const r=s.get(n);let a;return r===void 0?(a=new Ro,s.set(n,[a])):i>=r.length?(a=new Ro,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function Sp(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new T,color:new zt};break;case"SpotLight":e={position:new T,direction:new T,color:new zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new T,color:new zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new T,skyColor:new zt,groundColor:new zt};break;case"RectAreaLight":e={color:new zt,position:new T,halfWidth:new T,halfHeight:new T};break}return s[t.id]=e,e}}}function wp(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Ep=0;function Tp(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function bp(s){const t=new Sp,e=wp(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new T);const i=new T,r=new ne,a=new ne;function o(c){let h=0,u=0,f=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let p=0,g=0,_=0,m=0,d=0,x=0,S=0,v=0,D=0,b=0,R=0;c.sort(Tp);for(let E=0,M=c.length;E<M;E++){const L=c[E],B=L.color,z=L.intensity,q=L.distance,K=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=B.r*z,u+=B.g*z,f+=B.b*z;else if(L.isLightProbe){for(let X=0;X<9;X++)n.probe[X].addScaledVector(L.sh.coefficients[X],z);R++}else if(L.isDirectionalLight){const X=t.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const j=L.shadow,V=e.get(L);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=K,n.directionalShadowMatrix[p]=L.shadow.matrix,x++}n.directional[p]=X,p++}else if(L.isSpotLight){const X=t.get(L);X.position.setFromMatrixPosition(L.matrixWorld),X.color.copy(B).multiplyScalar(z),X.distance=q,X.coneCos=Math.cos(L.angle),X.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),X.decay=L.decay,n.spot[_]=X;const j=L.shadow;if(L.map&&(n.spotLightMap[D]=L.map,D++,j.updateMatrices(L),L.castShadow&&b++),n.spotLightMatrix[_]=j.matrix,L.castShadow){const V=e.get(L);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,n.spotShadow[_]=V,n.spotShadowMap[_]=K,v++}_++}else if(L.isRectAreaLight){const X=t.get(L);X.color.copy(B).multiplyScalar(z),X.halfWidth.set(L.width*.5,0,0),X.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=X,m++}else if(L.isPointLight){const X=t.get(L);if(X.color.copy(L.color).multiplyScalar(L.intensity),X.distance=L.distance,X.decay=L.decay,L.castShadow){const j=L.shadow,V=e.get(L);V.shadowIntensity=j.intensity,V.shadowBias=j.bias,V.shadowNormalBias=j.normalBias,V.shadowRadius=j.radius,V.shadowMapSize=j.mapSize,V.shadowCameraNear=j.camera.near,V.shadowCameraFar=j.camera.far,n.pointShadow[g]=V,n.pointShadowMap[g]=K,n.pointShadowMatrix[g]=L.shadow.matrix,S++}n.point[g]=X,g++}else if(L.isHemisphereLight){const X=t.get(L);X.skyColor.copy(L.color).multiplyScalar(z),X.groundColor.copy(L.groundColor).multiplyScalar(z),n.hemi[d]=X,d++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=rt.LTC_FLOAT_1,n.rectAreaLTC2=rt.LTC_FLOAT_2):(n.rectAreaLTC1=rt.LTC_HALF_1,n.rectAreaLTC2=rt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=f;const C=n.hash;(C.directionalLength!==p||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==d||C.numDirectionalShadows!==x||C.numPointShadows!==S||C.numSpotShadows!==v||C.numSpotMaps!==D||C.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=d,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=v+D-b,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=R,C.directionalLength=p,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=d,C.numDirectionalShadows=x,C.numPointShadows=S,C.numSpotShadows=v,C.numSpotMaps=D,C.numLightProbes=R,n.version=Ep++)}function l(c,h){let u=0,f=0,p=0,g=0,_=0;const m=h.matrixWorldInverse;for(let d=0,x=c.length;d<x;d++){const S=c[d];if(S.isDirectionalLight){const v=n.directional[u];v.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),u++}else if(S.isSpotLight){const v=n.spot[p];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),v.direction.sub(i),v.direction.transformDirection(m),p++}else if(S.isRectAreaLight){const v=n.rectArea[g];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),a.identity(),r.copy(S.matrixWorld),r.premultiply(m),a.extractRotation(r),v.halfWidth.set(S.width*.5,0,0),v.halfHeight.set(0,S.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(S.isPointLight){const v=n.point[f];v.position.setFromMatrixPosition(S.matrixWorld),v.position.applyMatrix4(m),f++}else if(S.isHemisphereLight){const v=n.hemi[_];v.direction.setFromMatrixPosition(S.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function Co(s){const t=new bp(s),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Ap(s){let t=new WeakMap;function e(i,r=0){const a=t.get(i);let o;return a===void 0?(o=new Co(s),t.set(i,[o])):r>=a.length?(o=new Co(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class Rp extends yi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=lc,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Cp extends yi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Pp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Lp=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Dp(s,t,e){let n=new fa;const i=new ft,r=new ft,a=new Qt,o=new Rp({depthPacking:cc}),l=new Cp,c={},h=e.maxTextureSize,u={[Rn]:Re,[Re]:Rn,[hn]:hn},f=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:Pp,fragmentShader:Lp}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new be;g.setAttribute("position",new Ye(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new P(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ia;let d=this.type;this.render=function(b,R,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const E=s.getRenderTarget(),M=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),B=s.state;B.setBlending(Tn),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const z=d!==cn&&this.type===cn,q=d===cn&&this.type!==cn;for(let K=0,X=b.length;K<X;K++){const j=b[K],V=j.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;i.copy(V.mapSize);const it=V.getFrameExtents();if(i.multiply(it),r.copy(V.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/it.x),i.x=r.x*it.x,V.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/it.y),i.y=r.y*it.y,V.mapSize.y=r.y)),V.map===null||z===!0||q===!0){const gt=this.type!==cn?{minFilter:qe,magFilter:qe}:{};V.map!==null&&V.map.dispose(),V.map=new Wn(i.x,i.y,gt),V.map.texture.name=j.name+".shadowMap",V.camera.updateProjectionMatrix()}s.setRenderTarget(V.map),s.clear();const ot=V.getViewportCount();for(let gt=0;gt<ot;gt++){const It=V.getViewport(gt);a.set(r.x*It.x,r.y*It.y,r.x*It.z,r.y*It.w),B.viewport(a),V.updateMatrices(j,gt),n=V.getFrustum(),v(R,C,V.camera,j,this.type)}V.isPointLightShadow!==!0&&this.type===cn&&x(V,C),V.needsUpdate=!1}d=this.type,m.needsUpdate=!1,s.setRenderTarget(E,M,L)};function x(b,R){const C=t.update(_);f.defines.VSM_SAMPLES!==b.blurSamples&&(f.defines.VSM_SAMPLES=b.blurSamples,p.defines.VSM_SAMPLES=b.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Wn(i.x,i.y)),f.uniforms.shadow_pass.value=b.map.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(R,null,C,f,_,null),p.uniforms.shadow_pass.value=b.mapPass.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(R,null,C,p,_,null)}function S(b,R,C,E){let M=null;const L=C.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(L!==void 0)M=L;else if(M=C.isPointLight===!0?l:o,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const B=M.uuid,z=R.uuid;let q=c[B];q===void 0&&(q={},c[B]=q);let K=q[z];K===void 0&&(K=M.clone(),q[z]=K,R.addEventListener("dispose",D)),M=K}if(M.visible=R.visible,M.wireframe=R.wireframe,E===cn?M.side=R.shadowSide!==null?R.shadowSide:R.side:M.side=R.shadowSide!==null?R.shadowSide:u[R.side],M.alphaMap=R.alphaMap,M.alphaTest=R.alphaTest,M.map=R.map,M.clipShadows=R.clipShadows,M.clippingPlanes=R.clippingPlanes,M.clipIntersection=R.clipIntersection,M.displacementMap=R.displacementMap,M.displacementScale=R.displacementScale,M.displacementBias=R.displacementBias,M.wireframeLinewidth=R.wireframeLinewidth,M.linewidth=R.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const B=s.properties.get(M);B.light=C}return M}function v(b,R,C,E,M){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&M===cn)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,b.matrixWorld);const z=t.update(b),q=b.material;if(Array.isArray(q)){const K=z.groups;for(let X=0,j=K.length;X<j;X++){const V=K[X],it=q[V.materialIndex];if(it&&it.visible){const ot=S(b,it,E,M);b.onBeforeShadow(s,b,R,C,z,ot,V),s.renderBufferDirect(C,null,z,ot,b,V),b.onAfterShadow(s,b,R,C,z,ot,V)}}}else if(q.visible){const K=S(b,q,E,M);b.onBeforeShadow(s,b,R,C,z,K,null),s.renderBufferDirect(C,null,z,K,b,null),b.onAfterShadow(s,b,R,C,z,K,null)}}const B=b.children;for(let z=0,q=B.length;z<q;z++)v(B[z],R,C,E,M)}function D(b){b.target.removeEventListener("dispose",D);for(const C in c){const E=c[C],M=b.target.uuid;M in E&&(E[M].dispose(),delete E[M])}}}const Ip={[vr]:xr,[yr]:wr,[Mr]:Er,[ui]:Sr,[xr]:vr,[wr]:yr,[Er]:Mr,[Sr]:ui};function Up(s,t){function e(){let I=!1;const at=new Qt;let W=null;const J=new Qt(0,0,0,0);return{setMask:function(ut){W!==ut&&!I&&(s.colorMask(ut,ut,ut,ut),W=ut)},setLocked:function(ut){I=ut},setClear:function(ut,ct,Ut,ce,ve){ve===!0&&(ut*=ce,ct*=ce,Ut*=ce),at.set(ut,ct,Ut,ce),J.equals(at)===!1&&(s.clearColor(ut,ct,Ut,ce),J.copy(at))},reset:function(){I=!1,W=null,J.set(-1,0,0,0)}}}function n(){let I=!1,at=!1,W=null,J=null,ut=null;return{setReversed:function(ct){if(at!==ct){const Ut=t.get("EXT_clip_control");at?Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.ZERO_TO_ONE_EXT):Ut.clipControlEXT(Ut.LOWER_LEFT_EXT,Ut.NEGATIVE_ONE_TO_ONE_EXT);const ce=ut;ut=null,this.setClear(ce)}at=ct},getReversed:function(){return at},setTest:function(ct){ct?st(s.DEPTH_TEST):wt(s.DEPTH_TEST)},setMask:function(ct){W!==ct&&!I&&(s.depthMask(ct),W=ct)},setFunc:function(ct){if(at&&(ct=Ip[ct]),J!==ct){switch(ct){case vr:s.depthFunc(s.NEVER);break;case xr:s.depthFunc(s.ALWAYS);break;case yr:s.depthFunc(s.LESS);break;case ui:s.depthFunc(s.LEQUAL);break;case Mr:s.depthFunc(s.EQUAL);break;case Sr:s.depthFunc(s.GEQUAL);break;case wr:s.depthFunc(s.GREATER);break;case Er:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}J=ct}},setLocked:function(ct){I=ct},setClear:function(ct){ut!==ct&&(at&&(ct=1-ct),s.clearDepth(ct),ut=ct)},reset:function(){I=!1,W=null,J=null,ut=null,at=!1}}}function i(){let I=!1,at=null,W=null,J=null,ut=null,ct=null,Ut=null,ce=null,ve=null;return{setTest:function($t){I||($t?st(s.STENCIL_TEST):wt(s.STENCIL_TEST))},setMask:function($t){at!==$t&&!I&&(s.stencilMask($t),at=$t)},setFunc:function($t,ze,en){(W!==$t||J!==ze||ut!==en)&&(s.stencilFunc($t,ze,en),W=$t,J=ze,ut=en)},setOp:function($t,ze,en){(ct!==$t||Ut!==ze||ce!==en)&&(s.stencilOp($t,ze,en),ct=$t,Ut=ze,ce=en)},setLocked:function($t){I=$t},setClear:function($t){ve!==$t&&(s.clearStencil($t),ve=$t)},reset:function(){I=!1,at=null,W=null,J=null,ut=null,ct=null,Ut=null,ce=null,ve=null}}}const r=new e,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,x=null,S=null,v=null,D=null,b=null,R=new zt(0,0,0),C=0,E=!1,M=null,L=null,B=null,z=null,q=null;const K=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,j=0;const V=s.getParameter(s.VERSION);V.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(V)[1]),X=j>=1):V.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),X=j>=2);let it=null,ot={};const gt=s.getParameter(s.SCISSOR_BOX),It=s.getParameter(s.VIEWPORT),kt=new Qt().fromArray(gt),Y=new Qt().fromArray(It);function tt(I,at,W,J){const ut=new Uint8Array(4),ct=s.createTexture();s.bindTexture(I,ct),s.texParameteri(I,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(I,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ut=0;Ut<W;Ut++)I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY?s.texImage3D(at,0,s.RGBA,1,1,J,0,s.RGBA,s.UNSIGNED_BYTE,ut):s.texImage2D(at+Ut,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ut);return ct}const _t={};_t[s.TEXTURE_2D]=tt(s.TEXTURE_2D,s.TEXTURE_2D,1),_t[s.TEXTURE_CUBE_MAP]=tt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),_t[s.TEXTURE_2D_ARRAY]=tt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),_t[s.TEXTURE_3D]=tt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),st(s.DEPTH_TEST),a.setFunc(ui),Gt(!1),Ht(La),st(s.CULL_FACE),F(Tn);function st(I){h[I]!==!0&&(s.enable(I),h[I]=!0)}function wt(I){h[I]!==!1&&(s.disable(I),h[I]=!1)}function Rt(I,at){return u[I]!==at?(s.bindFramebuffer(I,at),u[I]=at,I===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=at),I===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=at),!0):!1}function Pt(I,at){let W=p,J=!1;if(I){W=f.get(at),W===void 0&&(W=[],f.set(at,W));const ut=I.textures;if(W.length!==ut.length||W[0]!==s.COLOR_ATTACHMENT0){for(let ct=0,Ut=ut.length;ct<Ut;ct++)W[ct]=s.COLOR_ATTACHMENT0+ct;W.length=ut.length,J=!0}}else W[0]!==s.BACK&&(W[0]=s.BACK,J=!0);J&&s.drawBuffers(W)}function le(I){return g!==I?(s.useProgram(I),g=I,!0):!1}const Wt={[zn]:s.FUNC_ADD,[Fl]:s.FUNC_SUBTRACT,[Ol]:s.FUNC_REVERSE_SUBTRACT};Wt[Bl]=s.MIN,Wt[zl]=s.MAX;const ue={[kl]:s.ZERO,[Gl]:s.ONE,[Hl]:s.SRC_COLOR,[gr]:s.SRC_ALPHA,[Kl]:s.SRC_ALPHA_SATURATE,[ql]:s.DST_COLOR,[Wl]:s.DST_ALPHA,[Vl]:s.ONE_MINUS_SRC_COLOR,[_r]:s.ONE_MINUS_SRC_ALPHA,[Yl]:s.ONE_MINUS_DST_COLOR,[Xl]:s.ONE_MINUS_DST_ALPHA,[Zl]:s.CONSTANT_COLOR,[$l]:s.ONE_MINUS_CONSTANT_COLOR,[Jl]:s.CONSTANT_ALPHA,[jl]:s.ONE_MINUS_CONSTANT_ALPHA};function F(I,at,W,J,ut,ct,Ut,ce,ve,$t){if(I===Tn){_===!0&&(wt(s.BLEND),_=!1);return}if(_===!1&&(st(s.BLEND),_=!0),I!==Nl){if(I!==m||$t!==E){if((d!==zn||v!==zn)&&(s.blendEquation(s.FUNC_ADD),d=zn,v=zn),$t)switch(I){case li:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Da:s.blendFunc(s.ONE,s.ONE);break;case Ia:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ua:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case li:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Da:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Ia:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ua:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}x=null,S=null,D=null,b=null,R.set(0,0,0),C=0,m=I,E=$t}return}ut=ut||at,ct=ct||W,Ut=Ut||J,(at!==d||ut!==v)&&(s.blendEquationSeparate(Wt[at],Wt[ut]),d=at,v=ut),(W!==x||J!==S||ct!==D||Ut!==b)&&(s.blendFuncSeparate(ue[W],ue[J],ue[ct],ue[Ut]),x=W,S=J,D=ct,b=Ut),(ce.equals(R)===!1||ve!==C)&&(s.blendColor(ce.r,ce.g,ce.b,ve),R.copy(ce),C=ve),m=I,E=!1}function Ne(I,at){I.side===hn?wt(s.CULL_FACE):st(s.CULL_FACE);let W=I.side===Re;at&&(W=!W),Gt(W),I.blending===li&&I.transparent===!1?F(Tn):F(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const J=I.stencilWrite;o.setTest(J),J&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),se(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?st(s.SAMPLE_ALPHA_TO_COVERAGE):wt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Gt(I){M!==I&&(I?s.frontFace(s.CW):s.frontFace(s.CCW),M=I)}function Ht(I){I!==Il?(st(s.CULL_FACE),I!==L&&(I===La?s.cullFace(s.BACK):I===Ul?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):wt(s.CULL_FACE),L=I}function bt(I){I!==B&&(X&&s.lineWidth(I),B=I)}function se(I,at,W){I?(st(s.POLYGON_OFFSET_FILL),(z!==at||q!==W)&&(s.polygonOffset(at,W),z=at,q=W)):wt(s.POLYGON_OFFSET_FILL)}function Tt(I){I?st(s.SCISSOR_TEST):wt(s.SCISSOR_TEST)}function A(I){I===void 0&&(I=s.TEXTURE0+K-1),it!==I&&(s.activeTexture(I),it=I)}function y(I,at,W){W===void 0&&(it===null?W=s.TEXTURE0+K-1:W=it);let J=ot[W];J===void 0&&(J={type:void 0,texture:void 0},ot[W]=J),(J.type!==I||J.texture!==at)&&(it!==W&&(s.activeTexture(W),it=W),s.bindTexture(I,at||_t[I]),J.type=I,J.texture=at)}function O(){const I=ot[it];I!==void 0&&I.type!==void 0&&(s.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function $(){try{s.compressedTexImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Q(){try{s.compressedTexImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Z(){try{s.texSubImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Mt(){try{s.texSubImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function lt(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function dt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Xt(){try{s.texStorage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function et(){try{s.texStorage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function pt(){try{s.texImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function At(){try{s.texImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Lt(I){kt.equals(I)===!1&&(s.scissor(I.x,I.y,I.z,I.w),kt.copy(I))}function mt(I){Y.equals(I)===!1&&(s.viewport(I.x,I.y,I.z,I.w),Y.copy(I))}function Vt(I,at){let W=c.get(at);W===void 0&&(W=new WeakMap,c.set(at,W));let J=W.get(I);J===void 0&&(J=s.getUniformBlockIndex(at,I.name),W.set(I,J))}function Ot(I,at){const J=c.get(at).get(I);l.get(at)!==J&&(s.uniformBlockBinding(at,J,I.__bindingPointIndex),l.set(at,J))}function te(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},it=null,ot={},u={},f=new WeakMap,p=[],g=null,_=!1,m=null,d=null,x=null,S=null,v=null,D=null,b=null,R=new zt(0,0,0),C=0,E=!1,M=null,L=null,B=null,z=null,q=null,kt.set(0,0,s.canvas.width,s.canvas.height),Y.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:st,disable:wt,bindFramebuffer:Rt,drawBuffers:Pt,useProgram:le,setBlending:F,setMaterial:Ne,setFlipSided:Gt,setCullFace:Ht,setLineWidth:bt,setPolygonOffset:se,setScissorTest:Tt,activeTexture:A,bindTexture:y,unbindTexture:O,compressedTexImage2D:$,compressedTexImage3D:Q,texImage2D:pt,texImage3D:At,updateUBOMapping:Vt,uniformBlockBinding:Ot,texStorage2D:Xt,texStorage3D:et,texSubImage2D:Z,texSubImage3D:Mt,compressedTexSubImage2D:lt,compressedTexSubImage3D:dt,scissor:Lt,viewport:mt,reset:te}}function Po(s,t,e,n){const i=Np(n);switch(e){case $o:return s*t;case jo:return s*t;case Qo:return s*t*2;case tl:return s*t/i.components*i.byteLength;case oa:return s*t/i.components*i.byteLength;case el:return s*t*2/i.components*i.byteLength;case la:return s*t*2/i.components*i.byteLength;case Jo:return s*t*3/i.components*i.byteLength;case Xe:return s*t*4/i.components*i.byteLength;case ca:return s*t*4/i.components*i.byteLength;case _s:case vs:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case xs:case ys:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Cr:case Lr:return Math.max(s,16)*Math.max(t,8)/4;case Rr:case Pr:return Math.max(s,8)*Math.max(t,8)/2;case Dr:case Ir:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Ur:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Nr:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Fr:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Or:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Br:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case zr:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case kr:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Gr:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Hr:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Vr:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Wr:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Xr:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case qr:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Yr:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Kr:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Ms:case Zr:case $r:return Math.ceil(s/4)*Math.ceil(t/4)*16;case nl:case Jr:return Math.ceil(s/4)*Math.ceil(t/4)*8;case jr:case Qr:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Np(s){switch(s){case pn:case Yo:return{byteLength:1,components:1};case Bi:case Ko:case Gi:return{byteLength:2,components:1};case ra:case aa:return{byteLength:2,components:4};case Vn:case sa:case un:return{byteLength:4,components:1};case Zo:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function Fp(s,t,e,n,i,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ft,h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,y){return p?new OffscreenCanvas(A,y):Es("canvas")}function _(A,y,O){let $=1;const Q=Tt(A);if((Q.width>O||Q.height>O)&&($=O/Math.max(Q.width,Q.height)),$<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const Z=Math.floor($*Q.width),Mt=Math.floor($*Q.height);u===void 0&&(u=g(Z,Mt));const lt=y?g(Z,Mt):u;return lt.width=Z,lt.height=Mt,lt.getContext("2d").drawImage(A,0,0,Z,Mt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+Z+"x"+Mt+")."),lt}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),A;return A}function m(A){return A.generateMipmaps}function d(A){s.generateMipmap(A)}function x(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function S(A,y,O,$,Q=!1){if(A!==null){if(s[A]!==void 0)return s[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Z=y;if(y===s.RED&&(O===s.FLOAT&&(Z=s.R32F),O===s.HALF_FLOAT&&(Z=s.R16F),O===s.UNSIGNED_BYTE&&(Z=s.R8)),y===s.RED_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.R8UI),O===s.UNSIGNED_SHORT&&(Z=s.R16UI),O===s.UNSIGNED_INT&&(Z=s.R32UI),O===s.BYTE&&(Z=s.R8I),O===s.SHORT&&(Z=s.R16I),O===s.INT&&(Z=s.R32I)),y===s.RG&&(O===s.FLOAT&&(Z=s.RG32F),O===s.HALF_FLOAT&&(Z=s.RG16F),O===s.UNSIGNED_BYTE&&(Z=s.RG8)),y===s.RG_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RG8UI),O===s.UNSIGNED_SHORT&&(Z=s.RG16UI),O===s.UNSIGNED_INT&&(Z=s.RG32UI),O===s.BYTE&&(Z=s.RG8I),O===s.SHORT&&(Z=s.RG16I),O===s.INT&&(Z=s.RG32I)),y===s.RGB_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RGB8UI),O===s.UNSIGNED_SHORT&&(Z=s.RGB16UI),O===s.UNSIGNED_INT&&(Z=s.RGB32UI),O===s.BYTE&&(Z=s.RGB8I),O===s.SHORT&&(Z=s.RGB16I),O===s.INT&&(Z=s.RGB32I)),y===s.RGBA_INTEGER&&(O===s.UNSIGNED_BYTE&&(Z=s.RGBA8UI),O===s.UNSIGNED_SHORT&&(Z=s.RGBA16UI),O===s.UNSIGNED_INT&&(Z=s.RGBA32UI),O===s.BYTE&&(Z=s.RGBA8I),O===s.SHORT&&(Z=s.RGBA16I),O===s.INT&&(Z=s.RGBA32I)),y===s.RGB&&O===s.UNSIGNED_INT_5_9_9_9_REV&&(Z=s.RGB9_E5),y===s.RGBA){const Mt=Q?Cs:qt.getTransfer($);O===s.FLOAT&&(Z=s.RGBA32F),O===s.HALF_FLOAT&&(Z=s.RGBA16F),O===s.UNSIGNED_BYTE&&(Z=Mt===Jt?s.SRGB8_ALPHA8:s.RGBA8),O===s.UNSIGNED_SHORT_4_4_4_4&&(Z=s.RGBA4),O===s.UNSIGNED_SHORT_5_5_5_1&&(Z=s.RGB5_A1)}return(Z===s.R16F||Z===s.R32F||Z===s.RG16F||Z===s.RG32F||Z===s.RGBA16F||Z===s.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function v(A,y){let O;return A?y===null||y===Vn||y===pi?O=s.DEPTH24_STENCIL8:y===un?O=s.DEPTH32F_STENCIL8:y===Bi&&(O=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Vn||y===pi?O=s.DEPTH_COMPONENT24:y===un?O=s.DEPTH_COMPONENT32F:y===Bi&&(O=s.DEPTH_COMPONENT16),O}function D(A,y){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==qe&&A.minFilter!==Qe?Math.log2(Math.max(y.width,y.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?y.mipmaps.length:1}function b(A){const y=A.target;y.removeEventListener("dispose",b),C(y),y.isVideoTexture&&h.delete(y)}function R(A){const y=A.target;y.removeEventListener("dispose",R),M(y)}function C(A){const y=n.get(A);if(y.__webglInit===void 0)return;const O=A.source,$=f.get(O);if($){const Q=$[y.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&E(A),Object.keys($).length===0&&f.delete(O)}n.remove(A)}function E(A){const y=n.get(A);s.deleteTexture(y.__webglTexture);const O=A.source,$=f.get(O);delete $[y.__cacheKey],a.memory.textures--}function M(A){const y=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(y.__webglFramebuffer[$]))for(let Q=0;Q<y.__webglFramebuffer[$].length;Q++)s.deleteFramebuffer(y.__webglFramebuffer[$][Q]);else s.deleteFramebuffer(y.__webglFramebuffer[$]);y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer[$])}else{if(Array.isArray(y.__webglFramebuffer))for(let $=0;$<y.__webglFramebuffer.length;$++)s.deleteFramebuffer(y.__webglFramebuffer[$]);else s.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&s.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let $=0;$<y.__webglColorRenderbuffer.length;$++)y.__webglColorRenderbuffer[$]&&s.deleteRenderbuffer(y.__webglColorRenderbuffer[$]);y.__webglDepthRenderbuffer&&s.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const O=A.textures;for(let $=0,Q=O.length;$<Q;$++){const Z=n.get(O[$]);Z.__webglTexture&&(s.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(O[$])}n.remove(A)}let L=0;function B(){L=0}function z(){const A=L;return A>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),L+=1,A}function q(A){const y=[];return y.push(A.wrapS),y.push(A.wrapT),y.push(A.wrapR||0),y.push(A.magFilter),y.push(A.minFilter),y.push(A.anisotropy),y.push(A.internalFormat),y.push(A.format),y.push(A.type),y.push(A.generateMipmaps),y.push(A.premultiplyAlpha),y.push(A.flipY),y.push(A.unpackAlignment),y.push(A.colorSpace),y.join()}function K(A,y){const O=n.get(A);if(A.isVideoTexture&&bt(A),A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){const $=A.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(O,A,y);return}}e.bindTexture(s.TEXTURE_2D,O.__webglTexture,s.TEXTURE0+y)}function X(A,y){const O=n.get(A);if(A.version>0&&O.__version!==A.version){Y(O,A,y);return}e.bindTexture(s.TEXTURE_2D_ARRAY,O.__webglTexture,s.TEXTURE0+y)}function j(A,y){const O=n.get(A);if(A.version>0&&O.__version!==A.version){Y(O,A,y);return}e.bindTexture(s.TEXTURE_3D,O.__webglTexture,s.TEXTURE0+y)}function V(A,y){const O=n.get(A);if(A.version>0&&O.__version!==A.version){tt(O,A,y);return}e.bindTexture(s.TEXTURE_CUBE_MAP,O.__webglTexture,s.TEXTURE0+y)}const it={[oe]:s.REPEAT,[Gn]:s.CLAMP_TO_EDGE,[Ar]:s.MIRRORED_REPEAT},ot={[qe]:s.NEAREST,[oc]:s.NEAREST_MIPMAP_NEAREST,[Yi]:s.NEAREST_MIPMAP_LINEAR,[Qe]:s.LINEAR,[Ns]:s.LINEAR_MIPMAP_NEAREST,[Hn]:s.LINEAR_MIPMAP_LINEAR},gt={[uc]:s.NEVER,[_c]:s.ALWAYS,[dc]:s.LESS,[sl]:s.LEQUAL,[fc]:s.EQUAL,[gc]:s.GEQUAL,[pc]:s.GREATER,[mc]:s.NOTEQUAL};function It(A,y){if(y.type===un&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===Qe||y.magFilter===Ns||y.magFilter===Yi||y.magFilter===Hn||y.minFilter===Qe||y.minFilter===Ns||y.minFilter===Yi||y.minFilter===Hn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,it[y.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,it[y.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,it[y.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,ot[y.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,ot[y.minFilter]),y.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,gt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===qe||y.minFilter!==Yi&&y.minFilter!==Hn||y.type===un&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");s.texParameterf(A,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function kt(A,y){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,y.addEventListener("dispose",b));const $=y.source;let Q=f.get($);Q===void 0&&(Q={},f.set($,Q));const Z=q(y);if(Z!==A.__cacheKey){Q[Z]===void 0&&(Q[Z]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,O=!0),Q[Z].usedTimes++;const Mt=Q[A.__cacheKey];Mt!==void 0&&(Q[A.__cacheKey].usedTimes--,Mt.usedTimes===0&&E(y)),A.__cacheKey=Z,A.__webglTexture=Q[Z].texture}return O}function Y(A,y,O){let $=s.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&($=s.TEXTURE_2D_ARRAY),y.isData3DTexture&&($=s.TEXTURE_3D);const Q=kt(A,y),Z=y.source;e.bindTexture($,A.__webglTexture,s.TEXTURE0+O);const Mt=n.get(Z);if(Z.version!==Mt.__version||Q===!0){e.activeTexture(s.TEXTURE0+O);const lt=qt.getPrimaries(qt.workingColorSpace),dt=y.colorSpace===En?null:qt.getPrimaries(y.colorSpace),Xt=y.colorSpace===En||lt===dt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);let et=_(y.image,!1,i.maxTextureSize);et=se(y,et);const pt=r.convert(y.format,y.colorSpace),At=r.convert(y.type);let Lt=S(y.internalFormat,pt,At,y.colorSpace,y.isVideoTexture);It($,y);let mt;const Vt=y.mipmaps,Ot=y.isVideoTexture!==!0,te=Mt.__version===void 0||Q===!0,I=Z.dataReady,at=D(y,et);if(y.isDepthTexture)Lt=v(y.format===mi,y.type),te&&(Ot?e.texStorage2D(s.TEXTURE_2D,1,Lt,et.width,et.height):e.texImage2D(s.TEXTURE_2D,0,Lt,et.width,et.height,0,pt,At,null));else if(y.isDataTexture)if(Vt.length>0){Ot&&te&&e.texStorage2D(s.TEXTURE_2D,at,Lt,Vt[0].width,Vt[0].height);for(let W=0,J=Vt.length;W<J;W++)mt=Vt[W],Ot?I&&e.texSubImage2D(s.TEXTURE_2D,W,0,0,mt.width,mt.height,pt,At,mt.data):e.texImage2D(s.TEXTURE_2D,W,Lt,mt.width,mt.height,0,pt,At,mt.data);y.generateMipmaps=!1}else Ot?(te&&e.texStorage2D(s.TEXTURE_2D,at,Lt,et.width,et.height),I&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,et.width,et.height,pt,At,et.data)):e.texImage2D(s.TEXTURE_2D,0,Lt,et.width,et.height,0,pt,At,et.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Ot&&te&&e.texStorage3D(s.TEXTURE_2D_ARRAY,at,Lt,Vt[0].width,Vt[0].height,et.depth);for(let W=0,J=Vt.length;W<J;W++)if(mt=Vt[W],y.format!==Xe)if(pt!==null)if(Ot){if(I)if(y.layerUpdates.size>0){const ut=Po(mt.width,mt.height,y.format,y.type);for(const ct of y.layerUpdates){const Ut=mt.data.subarray(ct*ut/mt.data.BYTES_PER_ELEMENT,(ct+1)*ut/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,W,0,0,ct,mt.width,mt.height,1,pt,Ut)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,W,0,0,0,mt.width,mt.height,et.depth,pt,mt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,W,Lt,mt.width,mt.height,et.depth,0,mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ot?I&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,W,0,0,0,mt.width,mt.height,et.depth,pt,At,mt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,W,Lt,mt.width,mt.height,et.depth,0,pt,At,mt.data)}else{Ot&&te&&e.texStorage2D(s.TEXTURE_2D,at,Lt,Vt[0].width,Vt[0].height);for(let W=0,J=Vt.length;W<J;W++)mt=Vt[W],y.format!==Xe?pt!==null?Ot?I&&e.compressedTexSubImage2D(s.TEXTURE_2D,W,0,0,mt.width,mt.height,pt,mt.data):e.compressedTexImage2D(s.TEXTURE_2D,W,Lt,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ot?I&&e.texSubImage2D(s.TEXTURE_2D,W,0,0,mt.width,mt.height,pt,At,mt.data):e.texImage2D(s.TEXTURE_2D,W,Lt,mt.width,mt.height,0,pt,At,mt.data)}else if(y.isDataArrayTexture)if(Ot){if(te&&e.texStorage3D(s.TEXTURE_2D_ARRAY,at,Lt,et.width,et.height,et.depth),I)if(y.layerUpdates.size>0){const W=Po(et.width,et.height,y.format,y.type);for(const J of y.layerUpdates){const ut=et.data.subarray(J*W/et.data.BYTES_PER_ELEMENT,(J+1)*W/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,J,et.width,et.height,1,pt,At,ut)}y.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,pt,At,et.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Lt,et.width,et.height,et.depth,0,pt,At,et.data);else if(y.isData3DTexture)Ot?(te&&e.texStorage3D(s.TEXTURE_3D,at,Lt,et.width,et.height,et.depth),I&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,pt,At,et.data)):e.texImage3D(s.TEXTURE_3D,0,Lt,et.width,et.height,et.depth,0,pt,At,et.data);else if(y.isFramebufferTexture){if(te)if(Ot)e.texStorage2D(s.TEXTURE_2D,at,Lt,et.width,et.height);else{let W=et.width,J=et.height;for(let ut=0;ut<at;ut++)e.texImage2D(s.TEXTURE_2D,ut,Lt,W,J,0,pt,At,null),W>>=1,J>>=1}}else if(Vt.length>0){if(Ot&&te){const W=Tt(Vt[0]);e.texStorage2D(s.TEXTURE_2D,at,Lt,W.width,W.height)}for(let W=0,J=Vt.length;W<J;W++)mt=Vt[W],Ot?I&&e.texSubImage2D(s.TEXTURE_2D,W,0,0,pt,At,mt):e.texImage2D(s.TEXTURE_2D,W,Lt,pt,At,mt);y.generateMipmaps=!1}else if(Ot){if(te){const W=Tt(et);e.texStorage2D(s.TEXTURE_2D,at,Lt,W.width,W.height)}I&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,pt,At,et)}else e.texImage2D(s.TEXTURE_2D,0,Lt,pt,At,et);m(y)&&d($),Mt.__version=Z.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function tt(A,y,O){if(y.image.length!==6)return;const $=kt(A,y),Q=y.source;e.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+O);const Z=n.get(Q);if(Q.version!==Z.__version||$===!0){e.activeTexture(s.TEXTURE0+O);const Mt=qt.getPrimaries(qt.workingColorSpace),lt=y.colorSpace===En?null:qt.getPrimaries(y.colorSpace),dt=y.colorSpace===En||Mt===lt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const Xt=y.isCompressedTexture||y.image[0].isCompressedTexture,et=y.image[0]&&y.image[0].isDataTexture,pt=[];for(let J=0;J<6;J++)!Xt&&!et?pt[J]=_(y.image[J],!0,i.maxCubemapSize):pt[J]=et?y.image[J].image:y.image[J],pt[J]=se(y,pt[J]);const At=pt[0],Lt=r.convert(y.format,y.colorSpace),mt=r.convert(y.type),Vt=S(y.internalFormat,Lt,mt,y.colorSpace),Ot=y.isVideoTexture!==!0,te=Z.__version===void 0||$===!0,I=Q.dataReady;let at=D(y,At);It(s.TEXTURE_CUBE_MAP,y);let W;if(Xt){Ot&&te&&e.texStorage2D(s.TEXTURE_CUBE_MAP,at,Vt,At.width,At.height);for(let J=0;J<6;J++){W=pt[J].mipmaps;for(let ut=0;ut<W.length;ut++){const ct=W[ut];y.format!==Xe?Lt!==null?Ot?I&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,ut,0,0,ct.width,ct.height,Lt,ct.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,ut,Vt,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?I&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,ut,0,0,ct.width,ct.height,Lt,mt,ct.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,ut,Vt,ct.width,ct.height,0,Lt,mt,ct.data)}}}else{if(W=y.mipmaps,Ot&&te){W.length>0&&at++;const J=Tt(pt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,at,Vt,J.width,J.height)}for(let J=0;J<6;J++)if(et){Ot?I&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,pt[J].width,pt[J].height,Lt,mt,pt[J].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Vt,pt[J].width,pt[J].height,0,Lt,mt,pt[J].data);for(let ut=0;ut<W.length;ut++){const Ut=W[ut].image[J].image;Ot?I&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,ut+1,0,0,Ut.width,Ut.height,Lt,mt,Ut.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,ut+1,Vt,Ut.width,Ut.height,0,Lt,mt,Ut.data)}}else{Ot?I&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Lt,mt,pt[J]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Vt,Lt,mt,pt[J]);for(let ut=0;ut<W.length;ut++){const ct=W[ut];Ot?I&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,ut+1,0,0,Lt,mt,ct.image[J]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+J,ut+1,Vt,Lt,mt,ct.image[J])}}}m(y)&&d(s.TEXTURE_CUBE_MAP),Z.__version=Q.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function _t(A,y,O,$,Q,Z){const Mt=r.convert(O.format,O.colorSpace),lt=r.convert(O.type),dt=S(O.internalFormat,Mt,lt,O.colorSpace),Xt=n.get(y),et=n.get(O);if(et.__renderTarget=y,!Xt.__hasExternalTextures){const pt=Math.max(1,y.width>>Z),At=Math.max(1,y.height>>Z);Q===s.TEXTURE_3D||Q===s.TEXTURE_2D_ARRAY?e.texImage3D(Q,Z,dt,pt,At,y.depth,0,Mt,lt,null):e.texImage2D(Q,Z,dt,pt,At,0,Mt,lt,null)}e.bindFramebuffer(s.FRAMEBUFFER,A),Ht(y)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,$,Q,et.__webglTexture,0,Gt(y)):(Q===s.TEXTURE_2D||Q>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,$,Q,et.__webglTexture,Z),e.bindFramebuffer(s.FRAMEBUFFER,null)}function st(A,y,O){if(s.bindRenderbuffer(s.RENDERBUFFER,A),y.depthBuffer){const $=y.depthTexture,Q=$&&$.isDepthTexture?$.type:null,Z=v(y.stencilBuffer,Q),Mt=y.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,lt=Gt(y);Ht(y)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,lt,Z,y.width,y.height):O?s.renderbufferStorageMultisample(s.RENDERBUFFER,lt,Z,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,Z,y.width,y.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Mt,s.RENDERBUFFER,A)}else{const $=y.textures;for(let Q=0;Q<$.length;Q++){const Z=$[Q],Mt=r.convert(Z.format,Z.colorSpace),lt=r.convert(Z.type),dt=S(Z.internalFormat,Mt,lt,Z.colorSpace),Xt=Gt(y);O&&Ht(y)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Xt,dt,y.width,y.height):Ht(y)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Xt,dt,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,dt,y.width,y.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function wt(A,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,A),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(y.depthTexture);$.__renderTarget=y,(!$.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),K(y.depthTexture,0);const Q=$.__webglTexture,Z=Gt(y);if(y.depthTexture.format===ci)Ht(y)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Q,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,Q,0);else if(y.depthTexture.format===mi)Ht(y)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Q,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Rt(A){const y=n.get(A),O=A.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==A.depthTexture){const $=A.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),$){const Q=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,$.removeEventListener("dispose",Q)};$.addEventListener("dispose",Q),y.__depthDisposeCallback=Q}y.__boundDepthTexture=$}if(A.depthTexture&&!y.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");wt(y.__webglFramebuffer,A)}else if(O){y.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[$]),y.__webglDepthbuffer[$]===void 0)y.__webglDepthbuffer[$]=s.createRenderbuffer(),st(y.__webglDepthbuffer[$],A,!1);else{const Q=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Z=y.__webglDepthbuffer[$];s.bindRenderbuffer(s.RENDERBUFFER,Z),s.framebufferRenderbuffer(s.FRAMEBUFFER,Q,s.RENDERBUFFER,Z)}}else if(e.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=s.createRenderbuffer(),st(y.__webglDepthbuffer,A,!1);else{const $=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Q=y.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Q),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,Q)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Pt(A,y,O){const $=n.get(A);y!==void 0&&_t($.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),O!==void 0&&Rt(A)}function le(A){const y=A.texture,O=n.get(A),$=n.get(y);A.addEventListener("dispose",R);const Q=A.textures,Z=A.isWebGLCubeRenderTarget===!0,Mt=Q.length>1;if(Mt||($.__webglTexture===void 0&&($.__webglTexture=s.createTexture()),$.__version=y.version,a.memory.textures++),Z){O.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer[lt]=[];for(let dt=0;dt<y.mipmaps.length;dt++)O.__webglFramebuffer[lt][dt]=s.createFramebuffer()}else O.__webglFramebuffer[lt]=s.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){O.__webglFramebuffer=[];for(let lt=0;lt<y.mipmaps.length;lt++)O.__webglFramebuffer[lt]=s.createFramebuffer()}else O.__webglFramebuffer=s.createFramebuffer();if(Mt)for(let lt=0,dt=Q.length;lt<dt;lt++){const Xt=n.get(Q[lt]);Xt.__webglTexture===void 0&&(Xt.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&Ht(A)===!1){O.__webglMultisampledFramebuffer=s.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let lt=0;lt<Q.length;lt++){const dt=Q[lt];O.__webglColorRenderbuffer[lt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,O.__webglColorRenderbuffer[lt]);const Xt=r.convert(dt.format,dt.colorSpace),et=r.convert(dt.type),pt=S(dt.internalFormat,Xt,et,dt.colorSpace,A.isXRRenderTarget===!0),At=Gt(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,At,pt,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.RENDERBUFFER,O.__webglColorRenderbuffer[lt])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=s.createRenderbuffer(),st(O.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Z){e.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),It(s.TEXTURE_CUBE_MAP,y);for(let lt=0;lt<6;lt++)if(y.mipmaps&&y.mipmaps.length>0)for(let dt=0;dt<y.mipmaps.length;dt++)_t(O.__webglFramebuffer[lt][dt],A,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+lt,dt);else _t(O.__webglFramebuffer[lt],A,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);m(y)&&d(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Mt){for(let lt=0,dt=Q.length;lt<dt;lt++){const Xt=Q[lt],et=n.get(Xt);e.bindTexture(s.TEXTURE_2D,et.__webglTexture),It(s.TEXTURE_2D,Xt),_t(O.__webglFramebuffer,A,Xt,s.COLOR_ATTACHMENT0+lt,s.TEXTURE_2D,0),m(Xt)&&d(s.TEXTURE_2D)}e.unbindTexture()}else{let lt=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(lt=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(lt,$.__webglTexture),It(lt,y),y.mipmaps&&y.mipmaps.length>0)for(let dt=0;dt<y.mipmaps.length;dt++)_t(O.__webglFramebuffer[dt],A,y,s.COLOR_ATTACHMENT0,lt,dt);else _t(O.__webglFramebuffer,A,y,s.COLOR_ATTACHMENT0,lt,0);m(y)&&d(lt),e.unbindTexture()}A.depthBuffer&&Rt(A)}function Wt(A){const y=A.textures;for(let O=0,$=y.length;O<$;O++){const Q=y[O];if(m(Q)){const Z=x(A),Mt=n.get(Q).__webglTexture;e.bindTexture(Z,Mt),d(Z),e.unbindTexture()}}}const ue=[],F=[];function Ne(A){if(A.samples>0){if(Ht(A)===!1){const y=A.textures,O=A.width,$=A.height;let Q=s.COLOR_BUFFER_BIT;const Z=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Mt=n.get(A),lt=y.length>1;if(lt)for(let dt=0;dt<y.length;dt++)e.bindFramebuffer(s.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,Mt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Mt.__webglFramebuffer);for(let dt=0;dt<y.length;dt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Q|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Q|=s.STENCIL_BUFFER_BIT)),lt){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Mt.__webglColorRenderbuffer[dt]);const Xt=n.get(y[dt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Xt,0)}s.blitFramebuffer(0,0,O,$,0,0,O,$,Q,s.NEAREST),l===!0&&(ue.length=0,F.length=0,ue.push(s.COLOR_ATTACHMENT0+dt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(ue.push(Z),F.push(Z),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,F)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ue))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),lt)for(let dt=0;dt<y.length;dt++){e.bindFramebuffer(s.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.RENDERBUFFER,Mt.__webglColorRenderbuffer[dt]);const Xt=n.get(y[dt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,Mt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.TEXTURE_2D,Xt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const y=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[y])}}}function Gt(A){return Math.min(i.maxSamples,A.samples)}function Ht(A){const y=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function bt(A){const y=a.render.frame;h.get(A)!==y&&(h.set(A,y),A.update())}function se(A,y){const O=A.colorSpace,$=A.format,Q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||O!==_i&&O!==En&&(qt.getTransfer(O)===Jt?($!==Xe||Q!==pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),y}function Tt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=B,this.setTexture2D=K,this.setTexture2DArray=X,this.setTexture3D=j,this.setTextureCube=V,this.rebindTextures=Pt,this.setupRenderTarget=le,this.updateRenderTargetMipmap=Wt,this.updateMultisampleRenderTarget=Ne,this.setupDepthRenderbuffer=Rt,this.setupFrameBufferTexture=_t,this.useMultisampledRTT=Ht}function Op(s,t){function e(n,i=En){let r;const a=qt.getTransfer(i);if(n===pn)return s.UNSIGNED_BYTE;if(n===ra)return s.UNSIGNED_SHORT_4_4_4_4;if(n===aa)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Zo)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Yo)return s.BYTE;if(n===Ko)return s.SHORT;if(n===Bi)return s.UNSIGNED_SHORT;if(n===sa)return s.INT;if(n===Vn)return s.UNSIGNED_INT;if(n===un)return s.FLOAT;if(n===Gi)return s.HALF_FLOAT;if(n===$o)return s.ALPHA;if(n===Jo)return s.RGB;if(n===Xe)return s.RGBA;if(n===jo)return s.LUMINANCE;if(n===Qo)return s.LUMINANCE_ALPHA;if(n===ci)return s.DEPTH_COMPONENT;if(n===mi)return s.DEPTH_STENCIL;if(n===tl)return s.RED;if(n===oa)return s.RED_INTEGER;if(n===el)return s.RG;if(n===la)return s.RG_INTEGER;if(n===ca)return s.RGBA_INTEGER;if(n===_s||n===vs||n===xs||n===ys)if(a===Jt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===_s)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===vs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===xs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ys)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===_s)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===vs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===xs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ys)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Rr||n===Cr||n===Pr||n===Lr)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Rr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Cr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Pr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Lr)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Dr||n===Ir||n===Ur)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Dr||n===Ir)return a===Jt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ur)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Nr||n===Fr||n===Or||n===Br||n===zr||n===kr||n===Gr||n===Hr||n===Vr||n===Wr||n===Xr||n===qr||n===Yr||n===Kr)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Nr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Fr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Or)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Br)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===zr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===kr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Gr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Hr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Vr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Wr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Xr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===qr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Yr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Kr)return a===Jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ms||n===Zr||n===$r)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ms)return a===Jt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Zr)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===$r)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===nl||n===Jr||n===jr||n===Qr)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ms)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Jr)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===jr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Qr)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===pi?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}class Bp extends Ie{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class jt extends _e{constructor(){super(),this.isGroup=!0,this.type="Group"}}const zp={type:"move"};class lr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new jt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new jt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new T,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new T),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new jt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new T,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new T),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),d=this._getHandJoint(c,_);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(zp)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new jt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const kp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Gp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Hp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const i=new Te,r=t.properties.get(i);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Cn({vertexShader:kp,fragmentShader:Gp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new P(new Vi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Vp extends vi{constructor(t,e){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,p=null,g=null;const _=new Hp,m=e.getContextAttributes();let d=null,x=null;const S=[],v=[],D=new ft;let b=null;const R=new Ie;R.viewport=new Qt;const C=new Ie;C.viewport=new Qt;const E=[R,C],M=new Bp;let L=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let tt=S[Y];return tt===void 0&&(tt=new lr,S[Y]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(Y){let tt=S[Y];return tt===void 0&&(tt=new lr,S[Y]=tt),tt.getGripSpace()},this.getHand=function(Y){let tt=S[Y];return tt===void 0&&(tt=new lr,S[Y]=tt),tt.getHandSpace()};function z(Y){const tt=v.indexOf(Y.inputSource);if(tt===-1)return;const _t=S[tt];_t!==void 0&&(_t.update(Y.inputSource,Y.frame,c||a),_t.dispatchEvent({type:Y.type,data:Y.inputSource}))}function q(){i.removeEventListener("select",z),i.removeEventListener("selectstart",z),i.removeEventListener("selectend",z),i.removeEventListener("squeeze",z),i.removeEventListener("squeezestart",z),i.removeEventListener("squeezeend",z),i.removeEventListener("end",q),i.removeEventListener("inputsourceschange",K);for(let Y=0;Y<S.length;Y++){const tt=v[Y];tt!==null&&(v[Y]=null,S[Y].disconnect(tt))}L=null,B=null,_.reset(),t.setRenderTarget(d),p=null,f=null,u=null,i=null,x=null,kt.stop(),n.isPresenting=!1,t.setPixelRatio(b),t.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(d=t.getRenderTarget(),i.addEventListener("select",z),i.addEventListener("selectstart",z),i.addEventListener("selectend",z),i.addEventListener("squeeze",z),i.addEventListener("squeezestart",z),i.addEventListener("squeezeend",z),i.addEventListener("end",q),i.addEventListener("inputsourceschange",K),m.xrCompatible!==!0&&await e.makeXRCompatible(),b=t.getPixelRatio(),t.getSize(D),i.renderState.layers===void 0){const tt={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(i,e,tt),i.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new Wn(p.framebufferWidth,p.framebufferHeight,{format:Xe,type:pn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let tt=null,_t=null,st=null;m.depth&&(st=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,tt=m.stencil?mi:ci,_t=m.stencil?pi:Vn);const wt={colorFormat:e.RGBA8,depthFormat:st,scaleFactor:r};u=new XRWebGLBinding(i,e),f=u.createProjectionLayer(wt),i.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),x=new Wn(f.textureWidth,f.textureHeight,{format:Xe,type:pn,depthTexture:new gl(f.textureWidth,f.textureHeight,_t,void 0,void 0,void 0,void 0,void 0,void 0,tt),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),kt.setContext(i),kt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K(Y){for(let tt=0;tt<Y.removed.length;tt++){const _t=Y.removed[tt],st=v.indexOf(_t);st>=0&&(v[st]=null,S[st].disconnect(_t))}for(let tt=0;tt<Y.added.length;tt++){const _t=Y.added[tt];let st=v.indexOf(_t);if(st===-1){for(let Rt=0;Rt<S.length;Rt++)if(Rt>=v.length){v.push(_t),st=Rt;break}else if(v[Rt]===null){v[Rt]=_t,st=Rt;break}if(st===-1)break}const wt=S[st];wt&&wt.connect(_t)}}const X=new T,j=new T;function V(Y,tt,_t){X.setFromMatrixPosition(tt.matrixWorld),j.setFromMatrixPosition(_t.matrixWorld);const st=X.distanceTo(j),wt=tt.projectionMatrix.elements,Rt=_t.projectionMatrix.elements,Pt=wt[14]/(wt[10]-1),le=wt[14]/(wt[10]+1),Wt=(wt[9]+1)/wt[5],ue=(wt[9]-1)/wt[5],F=(wt[8]-1)/wt[0],Ne=(Rt[8]+1)/Rt[0],Gt=Pt*F,Ht=Pt*Ne,bt=st/(-F+Ne),se=bt*-F;if(tt.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(se),Y.translateZ(bt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),wt[10]===-1)Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const Tt=Pt+bt,A=le+bt,y=Gt-se,O=Ht+(st-se),$=Wt*le/A*Tt,Q=ue*le/A*Tt;Y.projectionMatrix.makePerspective(y,O,$,Q,Tt,A),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function it(Y,tt){tt===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(tt.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let tt=Y.near,_t=Y.far;_.texture!==null&&(_.depthNear>0&&(tt=_.depthNear),_.depthFar>0&&(_t=_.depthFar)),M.near=C.near=R.near=tt,M.far=C.far=R.far=_t,(L!==M.near||B!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),L=M.near,B=M.far),R.layers.mask=Y.layers.mask|2,C.layers.mask=Y.layers.mask|4,M.layers.mask=R.layers.mask|C.layers.mask;const st=Y.parent,wt=M.cameras;it(M,st);for(let Rt=0;Rt<wt.length;Rt++)it(wt[Rt],st);wt.length===2?V(M,R,C):M.projectionMatrix.copy(R.projectionMatrix),ot(Y,M,st)};function ot(Y,tt,_t){_t===null?Y.matrix.copy(tt.matrixWorld):(Y.matrix.copy(_t.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(tt.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(tt.projectionMatrix),Y.projectionMatrixInverse.copy(tt.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=zi*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(Y){l=Y,f!==null&&(f.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let gt=null;function It(Y,tt){if(h=tt.getViewerPose(c||a),g=tt,h!==null){const _t=h.views;p!==null&&(t.setRenderTargetFramebuffer(x,p.framebuffer),t.setRenderTarget(x));let st=!1;_t.length!==M.cameras.length&&(M.cameras.length=0,st=!0);for(let Rt=0;Rt<_t.length;Rt++){const Pt=_t[Rt];let le=null;if(p!==null)le=p.getViewport(Pt);else{const ue=u.getViewSubImage(f,Pt);le=ue.viewport,Rt===0&&(t.setRenderTargetTextures(x,ue.colorTexture,f.ignoreDepthValues?void 0:ue.depthStencilTexture),t.setRenderTarget(x))}let Wt=E[Rt];Wt===void 0&&(Wt=new Ie,Wt.layers.enable(Rt),Wt.viewport=new Qt,E[Rt]=Wt),Wt.matrix.fromArray(Pt.transform.matrix),Wt.matrix.decompose(Wt.position,Wt.quaternion,Wt.scale),Wt.projectionMatrix.fromArray(Pt.projectionMatrix),Wt.projectionMatrixInverse.copy(Wt.projectionMatrix).invert(),Wt.viewport.set(le.x,le.y,le.width,le.height),Rt===0&&(M.matrix.copy(Wt.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),st===!0&&M.cameras.push(Wt)}const wt=i.enabledFeatures;if(wt&&wt.includes("depth-sensing")){const Rt=u.getDepthInformation(_t[0]);Rt&&Rt.isValid&&Rt.texture&&_.init(t,Rt,i.renderState)}}for(let _t=0;_t<S.length;_t++){const st=v[_t],wt=S[_t];st!==null&&wt!==void 0&&wt.update(st,tt,c||a)}gt&&gt(Y,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),g=null}const kt=new pl;kt.setAnimationLoop(It),this.setAnimationLoop=function(Y){gt=Y},this.dispose=function(){}}}const Fn=new Ue,Wp=new ne;function Xp(s,t){function e(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,ul(s)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function i(m,d,x,S,v){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),u(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,v)):d.isMeshMatcapMaterial?(r(m,d),g(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),_(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,x,S):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,e(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Re&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,e(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Re&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,e(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,e(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const x=t.get(d),S=x.envMap,v=x.envMapRotation;S&&(m.envMap.value=S,Fn.copy(v),Fn.x*=-1,Fn.y*=-1,Fn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Fn.y*=-1,Fn.z*=-1),m.envMapRotation.value.setFromMatrix4(Wp.makeRotationFromEuler(Fn)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,x,S){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*x,m.scale.value=S*.5,d.map&&(m.map.value=d.map,e(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,e(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,e(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,x){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Re&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function _(m,d){const x=t.get(d).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function qp(s,t,e,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,S){const v=S.program;n.uniformBlockBinding(x,v)}function c(x,S){let v=i[x.id];v===void 0&&(g(x),v=h(x),i[x.id]=v,x.addEventListener("dispose",m));const D=S.program;n.updateUBOMapping(x,D);const b=t.render.frame;r[x.id]!==b&&(f(x),r[x.id]=b)}function h(x){const S=u();x.__bindingPointIndex=S;const v=s.createBuffer(),D=x.__size,b=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,v),s.bufferData(s.UNIFORM_BUFFER,D,b),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,S,v),v}function u(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const S=i[x.id],v=x.uniforms,D=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,S);for(let b=0,R=v.length;b<R;b++){const C=Array.isArray(v[b])?v[b]:[v[b]];for(let E=0,M=C.length;E<M;E++){const L=C[E];if(p(L,b,E,D)===!0){const B=L.__offset,z=Array.isArray(L.value)?L.value:[L.value];let q=0;for(let K=0;K<z.length;K++){const X=z[K],j=_(X);typeof X=="number"||typeof X=="boolean"?(L.__data[0]=X,s.bufferSubData(s.UNIFORM_BUFFER,B+q,L.__data)):X.isMatrix3?(L.__data[0]=X.elements[0],L.__data[1]=X.elements[1],L.__data[2]=X.elements[2],L.__data[3]=0,L.__data[4]=X.elements[3],L.__data[5]=X.elements[4],L.__data[6]=X.elements[5],L.__data[7]=0,L.__data[8]=X.elements[6],L.__data[9]=X.elements[7],L.__data[10]=X.elements[8],L.__data[11]=0):(X.toArray(L.__data,q),q+=j.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,B,L.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function p(x,S,v,D){const b=x.value,R=S+"_"+v;if(D[R]===void 0)return typeof b=="number"||typeof b=="boolean"?D[R]=b:D[R]=b.clone(),!0;{const C=D[R];if(typeof b=="number"||typeof b=="boolean"){if(C!==b)return D[R]=b,!0}else if(C.equals(b)===!1)return C.copy(b),!0}return!1}function g(x){const S=x.uniforms;let v=0;const D=16;for(let R=0,C=S.length;R<C;R++){const E=Array.isArray(S[R])?S[R]:[S[R]];for(let M=0,L=E.length;M<L;M++){const B=E[M],z=Array.isArray(B.value)?B.value:[B.value];for(let q=0,K=z.length;q<K;q++){const X=z[q],j=_(X),V=v%D,it=V%j.boundary,ot=V+it;v+=it,ot!==0&&D-ot<j.storage&&(v+=D-ot),B.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=v,v+=j.storage}}}const b=v%D;return b>0&&(v+=D-b),x.__size=v,x.__cache={},this}function _(x){const S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),S}function m(x){const S=x.target;S.removeEventListener("dispose",m);const v=a.indexOf(S.__bindingPointIndex);a.splice(v,1),s.deleteBuffer(i[S.id]),delete i[S.id],delete r[S.id]}function d(){for(const x in i)s.deleteBuffer(i[x]);a=[],i={},r={}}return{bind:l,update:c,dispose:d}}class Yp{constructor(t={}){const{canvas:e=Uc(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,d=null;const x=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Be,this.toneMapping=bn,this.toneMappingExposure=1;const v=this;let D=!1,b=0,R=0,C=null,E=-1,M=null;const L=new Qt,B=new Qt;let z=null;const q=new zt(0);let K=0,X=e.width,j=e.height,V=1,it=null,ot=null;const gt=new Qt(0,0,X,j),It=new Qt(0,0,X,j);let kt=!1;const Y=new fa;let tt=!1,_t=!1;const st=new ne,wt=new ne,Rt=new T,Pt=new Qt,le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Wt=!1;function ue(){return C===null?V:1}let F=n;function Ne(w,U){return e.getContext(w,U)}try{const w={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${na}`),e.addEventListener("webglcontextlost",J,!1),e.addEventListener("webglcontextrestored",ut,!1),e.addEventListener("webglcontextcreationerror",ct,!1),F===null){const U="webgl2";if(F=Ne(U,w),F===null)throw Ne(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Gt,Ht,bt,se,Tt,A,y,O,$,Q,Z,Mt,lt,dt,Xt,et,pt,At,Lt,mt,Vt,Ot,te,I;function at(){Gt=new Jd(F),Gt.init(),Ot=new Op(F,Gt),Ht=new Xd(F,Gt,t,Ot),bt=new Up(F,Gt),Ht.reverseDepthBuffer&&f&&bt.buffers.depth.setReversed(!0),se=new tf(F),Tt=new xp,A=new Fp(F,Gt,bt,Tt,Ht,Ot,se),y=new Yd(v),O=new $d(v),$=new oh(F),te=new Vd(F,$),Q=new jd(F,$,se,te),Z=new nf(F,Q,$,se),Lt=new ef(F,Ht,A),et=new qd(Tt),Mt=new vp(v,y,O,Gt,Ht,te,et),lt=new Xp(v,Tt),dt=new Mp,Xt=new Ap(Gt),At=new Hd(v,y,O,bt,Z,p,l),pt=new Dp(v,Z,Ht),I=new qp(F,se,Ht,bt),mt=new Wd(F,Gt,se),Vt=new Qd(F,Gt,se),se.programs=Mt.programs,v.capabilities=Ht,v.extensions=Gt,v.properties=Tt,v.renderLists=dt,v.shadowMap=pt,v.state=bt,v.info=se}at();const W=new Vp(v,F);this.xr=W,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const w=Gt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Gt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(w){w!==void 0&&(V=w,this.setSize(X,j,!1))},this.getSize=function(w){return w.set(X,j)},this.setSize=function(w,U,k=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=w,j=U,e.width=Math.floor(w*V),e.height=Math.floor(U*V),k===!0&&(e.style.width=w+"px",e.style.height=U+"px"),this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(X*V,j*V).floor()},this.setDrawingBufferSize=function(w,U,k){X=w,j=U,V=k,e.width=Math.floor(w*k),e.height=Math.floor(U*k),this.setViewport(0,0,w,U)},this.getCurrentViewport=function(w){return w.copy(L)},this.getViewport=function(w){return w.copy(gt)},this.setViewport=function(w,U,k,G){w.isVector4?gt.set(w.x,w.y,w.z,w.w):gt.set(w,U,k,G),bt.viewport(L.copy(gt).multiplyScalar(V).round())},this.getScissor=function(w){return w.copy(It)},this.setScissor=function(w,U,k,G){w.isVector4?It.set(w.x,w.y,w.z,w.w):It.set(w,U,k,G),bt.scissor(B.copy(It).multiplyScalar(V).round())},this.getScissorTest=function(){return kt},this.setScissorTest=function(w){bt.setScissorTest(kt=w)},this.setOpaqueSort=function(w){it=w},this.setTransparentSort=function(w){ot=w},this.getClearColor=function(w){return w.copy(At.getClearColor())},this.setClearColor=function(){At.setClearColor.apply(At,arguments)},this.getClearAlpha=function(){return At.getClearAlpha()},this.setClearAlpha=function(){At.setClearAlpha.apply(At,arguments)},this.clear=function(w=!0,U=!0,k=!0){let G=0;if(w){let N=!1;if(C!==null){const nt=C.texture.format;N=nt===ca||nt===la||nt===oa}if(N){const nt=C.texture.type,ht=nt===pn||nt===Vn||nt===Bi||nt===pi||nt===ra||nt===aa,vt=At.getClearColor(),xt=At.getClearAlpha(),Dt=vt.r,Nt=vt.g,yt=vt.b;ht?(g[0]=Dt,g[1]=Nt,g[2]=yt,g[3]=xt,F.clearBufferuiv(F.COLOR,0,g)):(_[0]=Dt,_[1]=Nt,_[2]=yt,_[3]=xt,F.clearBufferiv(F.COLOR,0,_))}else G|=F.COLOR_BUFFER_BIT}U&&(G|=F.DEPTH_BUFFER_BIT),k&&(G|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",J,!1),e.removeEventListener("webglcontextrestored",ut,!1),e.removeEventListener("webglcontextcreationerror",ct,!1),dt.dispose(),Xt.dispose(),Tt.dispose(),y.dispose(),O.dispose(),Z.dispose(),te.dispose(),I.dispose(),Mt.dispose(),W.dispose(),W.removeEventListener("sessionstart",wa),W.removeEventListener("sessionend",Ea),Pn.stop()};function J(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function ut(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const w=se.autoReset,U=pt.enabled,k=pt.autoUpdate,G=pt.needsUpdate,N=pt.type;at(),se.autoReset=w,pt.enabled=U,pt.autoUpdate=k,pt.needsUpdate=G,pt.type=N}function ct(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Ut(w){const U=w.target;U.removeEventListener("dispose",Ut),ce(U)}function ce(w){ve(w),Tt.remove(w)}function ve(w){const U=Tt.get(w).programs;U!==void 0&&(U.forEach(function(k){Mt.releaseProgram(k)}),w.isShaderMaterial&&Mt.releaseShaderCache(w))}this.renderBufferDirect=function(w,U,k,G,N,nt){U===null&&(U=le);const ht=N.isMesh&&N.matrixWorld.determinant()<0,vt=Pl(w,U,k,G,N);bt.setMaterial(G,ht);let xt=k.index,Dt=1;if(G.wireframe===!0){if(xt=Q.getWireframeAttribute(k),xt===void 0)return;Dt=2}const Nt=k.drawRange,yt=k.attributes.position;let Yt=Nt.start*Dt,ee=(Nt.start+Nt.count)*Dt;nt!==null&&(Yt=Math.max(Yt,nt.start*Dt),ee=Math.min(ee,(nt.start+nt.count)*Dt)),xt!==null?(Yt=Math.max(Yt,0),ee=Math.min(ee,xt.count)):yt!=null&&(Yt=Math.max(Yt,0),ee=Math.min(ee,yt.count));const re=ee-Yt;if(re<0||re===1/0)return;te.setup(N,G,vt,k,xt);let Ae,Kt=mt;if(xt!==null&&(Ae=$.get(xt),Kt=Vt,Kt.setIndex(Ae)),N.isMesh)G.wireframe===!0?(bt.setLineWidth(G.wireframeLinewidth*ue()),Kt.setMode(F.LINES)):Kt.setMode(F.TRIANGLES);else if(N.isLine){let St=G.linewidth;St===void 0&&(St=1),bt.setLineWidth(St*ue()),N.isLineSegments?Kt.setMode(F.LINES):N.isLineLoop?Kt.setMode(F.LINE_LOOP):Kt.setMode(F.LINE_STRIP)}else N.isPoints?Kt.setMode(F.POINTS):N.isSprite&&Kt.setMode(F.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Kt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Gt.get("WEBGL_multi_draw"))Kt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const St=N._multiDrawStarts,nn=N._multiDrawCounts,Zt=N._multiDrawCount,ke=xt?$.get(xt).bytesPerElement:1,Xn=Tt.get(G).currentProgram.getUniforms();for(let Pe=0;Pe<Zt;Pe++)Xn.setValue(F,"_gl_DrawID",Pe),Kt.render(St[Pe]/ke,nn[Pe])}else if(N.isInstancedMesh)Kt.renderInstances(Yt,re,N.count);else if(k.isInstancedBufferGeometry){const St=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,nn=Math.min(k.instanceCount,St);Kt.renderInstances(Yt,re,nn)}else Kt.render(Yt,re)};function $t(w,U,k){w.transparent===!0&&w.side===hn&&w.forceSinglePass===!1?(w.side=Re,w.needsUpdate=!0,qi(w,U,k),w.side=Rn,w.needsUpdate=!0,qi(w,U,k),w.side=hn):qi(w,U,k)}this.compile=function(w,U,k=null){k===null&&(k=w),d=Xt.get(k),d.init(U),S.push(d),k.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(d.pushLight(N),N.castShadow&&d.pushShadow(N))}),w!==k&&w.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(d.pushLight(N),N.castShadow&&d.pushShadow(N))}),d.setupLights();const G=new Set;return w.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const nt=N.material;if(nt)if(Array.isArray(nt))for(let ht=0;ht<nt.length;ht++){const vt=nt[ht];$t(vt,k,N),G.add(vt)}else $t(nt,k,N),G.add(nt)}),S.pop(),d=null,G},this.compileAsync=function(w,U,k=null){const G=this.compile(w,U,k);return new Promise(N=>{function nt(){if(G.forEach(function(ht){Tt.get(ht).currentProgram.isReady()&&G.delete(ht)}),G.size===0){N(w);return}setTimeout(nt,10)}Gt.get("KHR_parallel_shader_compile")!==null?nt():setTimeout(nt,10)})};let ze=null;function en(w){ze&&ze(w)}function wa(){Pn.stop()}function Ea(){Pn.start()}const Pn=new pl;Pn.setAnimationLoop(en),typeof self<"u"&&Pn.setContext(self),this.setAnimationLoop=function(w){ze=w,W.setAnimationLoop(w),w===null?Pn.stop():Pn.start()},W.addEventListener("sessionstart",wa),W.addEventListener("sessionend",Ea),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(U),U=W.getCamera()),w.isScene===!0&&w.onBeforeRender(v,w,U,C),d=Xt.get(w,S.length),d.init(U),S.push(d),wt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Y.setFromProjectionMatrix(wt),_t=this.localClippingEnabled,tt=et.init(this.clippingPlanes,_t),m=dt.get(w,x.length),m.init(),x.push(m),W.enabled===!0&&W.isPresenting===!0){const nt=v.xr.getDepthSensingMesh();nt!==null&&Us(nt,U,-1/0,v.sortObjects)}Us(w,U,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(it,ot),Wt=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,Wt&&At.addToRenderList(m,w),this.info.render.frame++,tt===!0&&et.beginShadows();const k=d.state.shadowsArray;pt.render(k,w,U),tt===!0&&et.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=m.opaque,N=m.transmissive;if(d.setupLights(),U.isArrayCamera){const nt=U.cameras;if(N.length>0)for(let ht=0,vt=nt.length;ht<vt;ht++){const xt=nt[ht];ba(G,N,w,xt)}Wt&&At.render(w);for(let ht=0,vt=nt.length;ht<vt;ht++){const xt=nt[ht];Ta(m,w,xt,xt.viewport)}}else N.length>0&&ba(G,N,w,U),Wt&&At.render(w),Ta(m,w,U);C!==null&&(A.updateMultisampleRenderTarget(C),A.updateRenderTargetMipmap(C)),w.isScene===!0&&w.onAfterRender(v,w,U),te.resetDefaultState(),E=-1,M=null,S.pop(),S.length>0?(d=S[S.length-1],tt===!0&&et.setGlobalState(v.clippingPlanes,d.state.camera)):d=null,x.pop(),x.length>0?m=x[x.length-1]:m=null};function Us(w,U,k,G){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)k=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(U);else if(w.isLight)d.pushLight(w),w.castShadow&&d.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Y.intersectsSprite(w)){G&&Pt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(wt);const ht=Z.update(w),vt=w.material;vt.visible&&m.push(w,ht,vt,k,Pt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Y.intersectsObject(w))){const ht=Z.update(w),vt=w.material;if(G&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Pt.copy(w.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),Pt.copy(ht.boundingSphere.center)),Pt.applyMatrix4(w.matrixWorld).applyMatrix4(wt)),Array.isArray(vt)){const xt=ht.groups;for(let Dt=0,Nt=xt.length;Dt<Nt;Dt++){const yt=xt[Dt],Yt=vt[yt.materialIndex];Yt&&Yt.visible&&m.push(w,ht,Yt,k,Pt.z,yt)}}else vt.visible&&m.push(w,ht,vt,k,Pt.z,null)}}const nt=w.children;for(let ht=0,vt=nt.length;ht<vt;ht++)Us(nt[ht],U,k,G)}function Ta(w,U,k,G){const N=w.opaque,nt=w.transmissive,ht=w.transparent;d.setupLightsView(k),tt===!0&&et.setGlobalState(v.clippingPlanes,k),G&&bt.viewport(L.copy(G)),N.length>0&&Xi(N,U,k),nt.length>0&&Xi(nt,U,k),ht.length>0&&Xi(ht,U,k),bt.buffers.depth.setTest(!0),bt.buffers.depth.setMask(!0),bt.buffers.color.setMask(!0),bt.setPolygonOffset(!1)}function ba(w,U,k,G){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[G.id]===void 0&&(d.state.transmissionRenderTarget[G.id]=new Wn(1,1,{generateMipmaps:!0,type:Gt.has("EXT_color_buffer_half_float")||Gt.has("EXT_color_buffer_float")?Gi:pn,minFilter:Hn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qt.workingColorSpace}));const nt=d.state.transmissionRenderTarget[G.id],ht=G.viewport||L;nt.setSize(ht.z,ht.w);const vt=v.getRenderTarget();v.setRenderTarget(nt),v.getClearColor(q),K=v.getClearAlpha(),K<1&&v.setClearColor(16777215,.5),v.clear(),Wt&&At.render(k);const xt=v.toneMapping;v.toneMapping=bn;const Dt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),d.setupLightsView(G),tt===!0&&et.setGlobalState(v.clippingPlanes,G),Xi(w,k,G),A.updateMultisampleRenderTarget(nt),A.updateRenderTargetMipmap(nt),Gt.has("WEBGL_multisampled_render_to_texture")===!1){let Nt=!1;for(let yt=0,Yt=U.length;yt<Yt;yt++){const ee=U[yt],re=ee.object,Ae=ee.geometry,Kt=ee.material,St=ee.group;if(Kt.side===hn&&re.layers.test(G.layers)){const nn=Kt.side;Kt.side=Re,Kt.needsUpdate=!0,Aa(re,k,G,Ae,Kt,St),Kt.side=nn,Kt.needsUpdate=!0,Nt=!0}}Nt===!0&&(A.updateMultisampleRenderTarget(nt),A.updateRenderTargetMipmap(nt))}v.setRenderTarget(vt),v.setClearColor(q,K),Dt!==void 0&&(G.viewport=Dt),v.toneMapping=xt}function Xi(w,U,k){const G=U.isScene===!0?U.overrideMaterial:null;for(let N=0,nt=w.length;N<nt;N++){const ht=w[N],vt=ht.object,xt=ht.geometry,Dt=G===null?ht.material:G,Nt=ht.group;vt.layers.test(k.layers)&&Aa(vt,U,k,xt,Dt,Nt)}}function Aa(w,U,k,G,N,nt){w.onBeforeRender(v,U,k,G,N,nt),w.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),N.onBeforeRender(v,U,k,G,w,nt),N.transparent===!0&&N.side===hn&&N.forceSinglePass===!1?(N.side=Re,N.needsUpdate=!0,v.renderBufferDirect(k,U,G,N,w,nt),N.side=Rn,N.needsUpdate=!0,v.renderBufferDirect(k,U,G,N,w,nt),N.side=hn):v.renderBufferDirect(k,U,G,N,w,nt),w.onAfterRender(v,U,k,G,N,nt)}function qi(w,U,k){U.isScene!==!0&&(U=le);const G=Tt.get(w),N=d.state.lights,nt=d.state.shadowsArray,ht=N.state.version,vt=Mt.getParameters(w,N.state,nt,U,k),xt=Mt.getProgramCacheKey(vt);let Dt=G.programs;G.environment=w.isMeshStandardMaterial?U.environment:null,G.fog=U.fog,G.envMap=(w.isMeshStandardMaterial?O:y).get(w.envMap||G.environment),G.envMapRotation=G.environment!==null&&w.envMap===null?U.environmentRotation:w.envMapRotation,Dt===void 0&&(w.addEventListener("dispose",Ut),Dt=new Map,G.programs=Dt);let Nt=Dt.get(xt);if(Nt!==void 0){if(G.currentProgram===Nt&&G.lightsStateVersion===ht)return Ca(w,vt),Nt}else vt.uniforms=Mt.getUniforms(w),w.onBeforeCompile(vt,v),Nt=Mt.acquireProgram(vt,xt),Dt.set(xt,Nt),G.uniforms=vt.uniforms;const yt=G.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(yt.clippingPlanes=et.uniform),Ca(w,vt),G.needsLights=Dl(w),G.lightsStateVersion=ht,G.needsLights&&(yt.ambientLightColor.value=N.state.ambient,yt.lightProbe.value=N.state.probe,yt.directionalLights.value=N.state.directional,yt.directionalLightShadows.value=N.state.directionalShadow,yt.spotLights.value=N.state.spot,yt.spotLightShadows.value=N.state.spotShadow,yt.rectAreaLights.value=N.state.rectArea,yt.ltc_1.value=N.state.rectAreaLTC1,yt.ltc_2.value=N.state.rectAreaLTC2,yt.pointLights.value=N.state.point,yt.pointLightShadows.value=N.state.pointShadow,yt.hemisphereLights.value=N.state.hemi,yt.directionalShadowMap.value=N.state.directionalShadowMap,yt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,yt.spotShadowMap.value=N.state.spotShadowMap,yt.spotLightMatrix.value=N.state.spotLightMatrix,yt.spotLightMap.value=N.state.spotLightMap,yt.pointShadowMap.value=N.state.pointShadowMap,yt.pointShadowMatrix.value=N.state.pointShadowMatrix),G.currentProgram=Nt,G.uniformsList=null,Nt}function Ra(w){if(w.uniformsList===null){const U=w.currentProgram.getUniforms();w.uniformsList=Ss.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function Ca(w,U){const k=Tt.get(w);k.outputColorSpace=U.outputColorSpace,k.batching=U.batching,k.batchingColor=U.batchingColor,k.instancing=U.instancing,k.instancingColor=U.instancingColor,k.instancingMorph=U.instancingMorph,k.skinning=U.skinning,k.morphTargets=U.morphTargets,k.morphNormals=U.morphNormals,k.morphColors=U.morphColors,k.morphTargetsCount=U.morphTargetsCount,k.numClippingPlanes=U.numClippingPlanes,k.numIntersection=U.numClipIntersection,k.vertexAlphas=U.vertexAlphas,k.vertexTangents=U.vertexTangents,k.toneMapping=U.toneMapping}function Pl(w,U,k,G,N){U.isScene!==!0&&(U=le),A.resetTextureUnits();const nt=U.fog,ht=G.isMeshStandardMaterial?U.environment:null,vt=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:_i,xt=(G.isMeshStandardMaterial?O:y).get(G.envMap||ht),Dt=G.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Nt=!!k.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),yt=!!k.morphAttributes.position,Yt=!!k.morphAttributes.normal,ee=!!k.morphAttributes.color;let re=bn;G.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(re=v.toneMapping);const Ae=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Kt=Ae!==void 0?Ae.length:0,St=Tt.get(G),nn=d.state.lights;if(tt===!0&&(_t===!0||w!==M)){const Fe=w===M&&G.id===E;et.setState(G,w,Fe)}let Zt=!1;G.version===St.__version?(St.needsLights&&St.lightsStateVersion!==nn.state.version||St.outputColorSpace!==vt||N.isBatchedMesh&&St.batching===!1||!N.isBatchedMesh&&St.batching===!0||N.isBatchedMesh&&St.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&St.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&St.instancing===!1||!N.isInstancedMesh&&St.instancing===!0||N.isSkinnedMesh&&St.skinning===!1||!N.isSkinnedMesh&&St.skinning===!0||N.isInstancedMesh&&St.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&St.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&St.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&St.instancingMorph===!1&&N.morphTexture!==null||St.envMap!==xt||G.fog===!0&&St.fog!==nt||St.numClippingPlanes!==void 0&&(St.numClippingPlanes!==et.numPlanes||St.numIntersection!==et.numIntersection)||St.vertexAlphas!==Dt||St.vertexTangents!==Nt||St.morphTargets!==yt||St.morphNormals!==Yt||St.morphColors!==ee||St.toneMapping!==re||St.morphTargetsCount!==Kt)&&(Zt=!0):(Zt=!0,St.__version=G.version);let ke=St.currentProgram;Zt===!0&&(ke=qi(G,U,N));let Xn=!1,Pe=!1,Si=!1;const ae=ke.getUniforms(),Ke=St.uniforms;if(bt.useProgram(ke.program)&&(Xn=!0,Pe=!0,Si=!0),G.id!==E&&(E=G.id,Pe=!0),Xn||M!==w){bt.buffers.depth.getReversed()?(st.copy(w.projectionMatrix),Fc(st),Oc(st),ae.setValue(F,"projectionMatrix",st)):ae.setValue(F,"projectionMatrix",w.projectionMatrix),ae.setValue(F,"viewMatrix",w.matrixWorldInverse);const gn=ae.map.cameraPosition;gn!==void 0&&gn.setValue(F,Rt.setFromMatrixPosition(w.matrixWorld)),Ht.logarithmicDepthBuffer&&ae.setValue(F,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ae.setValue(F,"isOrthographic",w.isOrthographicCamera===!0),M!==w&&(M=w,Pe=!0,Si=!0)}if(N.isSkinnedMesh){ae.setOptional(F,N,"bindMatrix"),ae.setOptional(F,N,"bindMatrixInverse");const Fe=N.skeleton;Fe&&(Fe.boneTexture===null&&Fe.computeBoneTexture(),ae.setValue(F,"boneTexture",Fe.boneTexture,A))}N.isBatchedMesh&&(ae.setOptional(F,N,"batchingTexture"),ae.setValue(F,"batchingTexture",N._matricesTexture,A),ae.setOptional(F,N,"batchingIdTexture"),ae.setValue(F,"batchingIdTexture",N._indirectTexture,A),ae.setOptional(F,N,"batchingColorTexture"),N._colorsTexture!==null&&ae.setValue(F,"batchingColorTexture",N._colorsTexture,A));const wi=k.morphAttributes;if((wi.position!==void 0||wi.normal!==void 0||wi.color!==void 0)&&Lt.update(N,k,ke),(Pe||St.receiveShadow!==N.receiveShadow)&&(St.receiveShadow=N.receiveShadow,ae.setValue(F,"receiveShadow",N.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Ke.envMap.value=xt,Ke.flipEnvMap.value=xt.isCubeTexture&&xt.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&U.environment!==null&&(Ke.envMapIntensity.value=U.environmentIntensity),Pe&&(ae.setValue(F,"toneMappingExposure",v.toneMappingExposure),St.needsLights&&Ll(Ke,Si),nt&&G.fog===!0&&lt.refreshFogUniforms(Ke,nt),lt.refreshMaterialUniforms(Ke,G,V,j,d.state.transmissionRenderTarget[w.id]),Ss.upload(F,Ra(St),Ke,A)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Ss.upload(F,Ra(St),Ke,A),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ae.setValue(F,"center",N.center),ae.setValue(F,"modelViewMatrix",N.modelViewMatrix),ae.setValue(F,"normalMatrix",N.normalMatrix),ae.setValue(F,"modelMatrix",N.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Fe=G.uniformsGroups;for(let gn=0,_n=Fe.length;gn<_n;gn++){const Pa=Fe[gn];I.update(Pa,ke),I.bind(Pa,ke)}}return ke}function Ll(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function Dl(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return b},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(w,U,k){Tt.get(w.texture).__webglTexture=U,Tt.get(w.depthTexture).__webglTexture=k;const G=Tt.get(w);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=k===void 0,G.__autoAllocateDepthBuffer||Gt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,U){const k=Tt.get(w);k.__webglFramebuffer=U,k.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(w,U=0,k=0){C=w,b=U,R=k;let G=!0,N=null,nt=!1,ht=!1;if(w){const xt=Tt.get(w);if(xt.__useDefaultFramebuffer!==void 0)bt.bindFramebuffer(F.FRAMEBUFFER,null),G=!1;else if(xt.__webglFramebuffer===void 0)A.setupRenderTarget(w);else if(xt.__hasExternalTextures)A.rebindTextures(w,Tt.get(w.texture).__webglTexture,Tt.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const yt=w.depthTexture;if(xt.__boundDepthTexture!==yt){if(yt!==null&&Tt.has(yt)&&(w.width!==yt.image.width||w.height!==yt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(w)}}const Dt=w.texture;(Dt.isData3DTexture||Dt.isDataArrayTexture||Dt.isCompressedArrayTexture)&&(ht=!0);const Nt=Tt.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Nt[U])?N=Nt[U][k]:N=Nt[U],nt=!0):w.samples>0&&A.useMultisampledRTT(w)===!1?N=Tt.get(w).__webglMultisampledFramebuffer:Array.isArray(Nt)?N=Nt[k]:N=Nt,L.copy(w.viewport),B.copy(w.scissor),z=w.scissorTest}else L.copy(gt).multiplyScalar(V).floor(),B.copy(It).multiplyScalar(V).floor(),z=kt;if(bt.bindFramebuffer(F.FRAMEBUFFER,N)&&G&&bt.drawBuffers(w,N),bt.viewport(L),bt.scissor(B),bt.setScissorTest(z),nt){const xt=Tt.get(w.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+U,xt.__webglTexture,k)}else if(ht){const xt=Tt.get(w.texture),Dt=U||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,xt.__webglTexture,k||0,Dt)}E=-1},this.readRenderTargetPixels=function(w,U,k,G,N,nt,ht){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let vt=Tt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ht!==void 0&&(vt=vt[ht]),vt){bt.bindFramebuffer(F.FRAMEBUFFER,vt);try{const xt=w.texture,Dt=xt.format,Nt=xt.type;if(!Ht.textureFormatReadable(Dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ht.textureTypeReadable(Nt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=w.width-G&&k>=0&&k<=w.height-N&&F.readPixels(U,k,G,N,Ot.convert(Dt),Ot.convert(Nt),nt)}finally{const xt=C!==null?Tt.get(C).__webglFramebuffer:null;bt.bindFramebuffer(F.FRAMEBUFFER,xt)}}},this.readRenderTargetPixelsAsync=async function(w,U,k,G,N,nt,ht){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let vt=Tt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ht!==void 0&&(vt=vt[ht]),vt){const xt=w.texture,Dt=xt.format,Nt=xt.type;if(!Ht.textureFormatReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ht.textureTypeReadable(Nt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=w.width-G&&k>=0&&k<=w.height-N){bt.bindFramebuffer(F.FRAMEBUFFER,vt);const yt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,yt),F.bufferData(F.PIXEL_PACK_BUFFER,nt.byteLength,F.STREAM_READ),F.readPixels(U,k,G,N,Ot.convert(Dt),Ot.convert(Nt),0);const Yt=C!==null?Tt.get(C).__webglFramebuffer:null;bt.bindFramebuffer(F.FRAMEBUFFER,Yt);const ee=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Nc(F,ee,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,yt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,nt),F.deleteBuffer(yt),F.deleteSync(ee),nt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,U=null,k=0){w.isTexture!==!0&&(Pi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,w=arguments[1]);const G=Math.pow(2,-k),N=Math.floor(w.image.width*G),nt=Math.floor(w.image.height*G),ht=U!==null?U.x:0,vt=U!==null?U.y:0;A.setTexture2D(w,0),F.copyTexSubImage2D(F.TEXTURE_2D,k,0,0,ht,vt,N,nt),bt.unbindTexture()},this.copyTextureToTexture=function(w,U,k=null,G=null,N=0){w.isTexture!==!0&&(Pi("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,w=arguments[1],U=arguments[2],N=arguments[3]||0,k=null);let nt,ht,vt,xt,Dt,Nt,yt,Yt,ee;const re=w.isCompressedTexture?w.mipmaps[N]:w.image;k!==null?(nt=k.max.x-k.min.x,ht=k.max.y-k.min.y,vt=k.isBox3?k.max.z-k.min.z:1,xt=k.min.x,Dt=k.min.y,Nt=k.isBox3?k.min.z:0):(nt=re.width,ht=re.height,vt=re.depth||1,xt=0,Dt=0,Nt=0),G!==null?(yt=G.x,Yt=G.y,ee=G.z):(yt=0,Yt=0,ee=0);const Ae=Ot.convert(U.format),Kt=Ot.convert(U.type);let St;U.isData3DTexture?(A.setTexture3D(U,0),St=F.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(A.setTexture2DArray(U,0),St=F.TEXTURE_2D_ARRAY):(A.setTexture2D(U,0),St=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,U.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,U.unpackAlignment);const nn=F.getParameter(F.UNPACK_ROW_LENGTH),Zt=F.getParameter(F.UNPACK_IMAGE_HEIGHT),ke=F.getParameter(F.UNPACK_SKIP_PIXELS),Xn=F.getParameter(F.UNPACK_SKIP_ROWS),Pe=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,re.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,re.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,xt),F.pixelStorei(F.UNPACK_SKIP_ROWS,Dt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Nt);const Si=w.isDataArrayTexture||w.isData3DTexture,ae=U.isDataArrayTexture||U.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){const Ke=Tt.get(w),wi=Tt.get(U),Fe=Tt.get(Ke.__renderTarget),gn=Tt.get(wi.__renderTarget);bt.bindFramebuffer(F.READ_FRAMEBUFFER,Fe.__webglFramebuffer),bt.bindFramebuffer(F.DRAW_FRAMEBUFFER,gn.__webglFramebuffer);for(let _n=0;_n<vt;_n++)Si&&F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Tt.get(w).__webglTexture,N,Nt+_n),w.isDepthTexture?(ae&&F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Tt.get(U).__webglTexture,N,ee+_n),F.blitFramebuffer(xt,Dt,nt,ht,yt,Yt,nt,ht,F.DEPTH_BUFFER_BIT,F.NEAREST)):ae?F.copyTexSubImage3D(St,N,yt,Yt,ee+_n,xt,Dt,nt,ht):F.copyTexSubImage2D(St,N,yt,Yt,ee+_n,xt,Dt,nt,ht);bt.bindFramebuffer(F.READ_FRAMEBUFFER,null),bt.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else ae?w.isDataTexture||w.isData3DTexture?F.texSubImage3D(St,N,yt,Yt,ee,nt,ht,vt,Ae,Kt,re.data):U.isCompressedArrayTexture?F.compressedTexSubImage3D(St,N,yt,Yt,ee,nt,ht,vt,Ae,re.data):F.texSubImage3D(St,N,yt,Yt,ee,nt,ht,vt,Ae,Kt,re):w.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,N,yt,Yt,nt,ht,Ae,Kt,re.data):w.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,N,yt,Yt,re.width,re.height,Ae,re.data):F.texSubImage2D(F.TEXTURE_2D,N,yt,Yt,nt,ht,Ae,Kt,re);F.pixelStorei(F.UNPACK_ROW_LENGTH,nn),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Zt),F.pixelStorei(F.UNPACK_SKIP_PIXELS,ke),F.pixelStorei(F.UNPACK_SKIP_ROWS,Xn),F.pixelStorei(F.UNPACK_SKIP_IMAGES,Pe),N===0&&U.generateMipmaps&&F.generateMipmap(St),bt.unbindTexture()},this.copyTextureToTexture3D=function(w,U,k=null,G=null,N=0){return w.isTexture!==!0&&(Pi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),k=arguments[0]||null,G=arguments[1]||null,w=arguments[2],U=arguments[3],N=arguments[4]||0),Pi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,U,k,G,N)},this.initRenderTarget=function(w){Tt.get(w).__webglFramebuffer===void 0&&A.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?A.setTextureCube(w,0):w.isData3DTexture?A.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?A.setTexture2DArray(w,0):A.setTexture2D(w,0),bt.unbindTexture()},this.resetState=function(){b=0,R=0,C=null,bt.reset(),te.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=qt._getUnpackColorSpace()}}class ma{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new zt(t),this.density=e}clone(){return new ma(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Kp extends _e{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ue,this.environmentIntensity=1,this.environmentRotation=new Ue,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Ml extends yi{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ts=new T,bs=new T,Lo=new ne,Ri=new ua,ps=new Ps,cr=new T,Do=new T;class Zp extends _e{constructor(t=new be,e=new Ml){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)Ts.fromBufferAttribute(e,i-1),bs.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=Ts.distanceTo(bs);t.setAttribute("lineDistance",new ie(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ps.copy(n.boundingSphere),ps.applyMatrix4(i),ps.radius+=r,t.ray.intersectsSphere(ps)===!1)return;Lo.copy(i).invert(),Ri.copy(t.ray).applyMatrix4(Lo);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const d=h.getX(_),x=h.getX(_+1),S=ms(this,t,Ri,l,d,x);S&&e.push(S)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(p),d=ms(this,t,Ri,l,_,m);d&&e.push(d)}}else{const p=Math.max(0,a.start),g=Math.min(f.count,a.start+a.count);for(let _=p,m=g-1;_<m;_+=c){const d=ms(this,t,Ri,l,_,_+1);d&&e.push(d)}if(this.isLineLoop){const _=ms(this,t,Ri,l,g-1,p);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ms(s,t,e,n,i,r){const a=s.geometry.attributes.position;if(Ts.fromBufferAttribute(a,i),bs.fromBufferAttribute(a,r),e.distanceSqToSegment(Ts,bs,cr,Do)>n)return;cr.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(cr);if(!(l<t.near||l>t.far))return{distance:l,point:Do.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}class Ce extends Te{constructor(t,e,n,i,r,a,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class tn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let i=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],f=n[i+1]-h,p=(a-h)/f;return(i+p)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=e||(a.isVector2?new ft:new T);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new T,i=[],r=[],a=[],o=new T,l=new ne;for(let p=0;p<=t;p++){const g=p/t;i[p]=this.getTangentAt(g,new T)}r[0]=new T,a[0]=new T;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),f=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),f<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(i[p-1],i[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ge(i[p-1].dot(i[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}a[p].crossVectors(i[p],r[p])}if(e===!0){let p=Math.acos(ge(r[0].dot(r[t]),-1,1));p/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],p*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ga extends tn{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ft){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*h-p*u+this.aX,c=f*u+p*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class $p extends ga{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function _a(){let s=0,t=0,e=0,n=0;function i(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let f=(a-r)/c-(o-r)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+u)+(l-o)/u;f*=h,p*=h,i(a,o,f,p)},calc:function(r){const a=r*r,o=a*r;return s+t*r+e*a+n*o}}}const gs=new T,hr=new _a,ur=new _a,dr=new _a;class Jp extends tn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new T){const n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(gs.subVectors(i[0],i[1]).add(i[0]),c=gs);const u=i[o%r],f=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(gs.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=gs),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(f),p),m=Math.pow(f.distanceToSquared(h),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),hr.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,g,_,m),ur.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,g,_,m),dr.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(hr.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),ur.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),dr.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return n.set(hr.calc(l),ur.calc(l),dr.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new T().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Io(s,t,e,n,i){const r=(n-t)*.5,a=(i-e)*.5,o=s*s,l=s*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*s+e}function jp(s,t){const e=1-s;return e*e*t}function Qp(s,t){return 2*(1-s)*s*t}function tm(s,t){return s*s*t}function Ni(s,t,e,n){return jp(s,t)+Qp(s,e)+tm(s,n)}function em(s,t){const e=1-s;return e*e*e*t}function nm(s,t){const e=1-s;return 3*e*e*s*t}function im(s,t){return 3*(1-s)*s*s*t}function sm(s,t){return s*s*s*t}function Fi(s,t,e,n,i){return em(s,t)+nm(s,e)+im(s,n)+sm(s,i)}class Sl extends tn{constructor(t=new ft,e=new ft,n=new ft,i=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new ft){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Fi(t,i.x,r.x,a.x,o.x),Fi(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class rm extends tn{constructor(t=new T,e=new T,n=new T,i=new T){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new T){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Fi(t,i.x,r.x,a.x,o.x),Fi(t,i.y,r.y,a.y,o.y),Fi(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class wl extends tn{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class am extends tn{constructor(t=new T,e=new T){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new T){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new T){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class El extends tn{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Ni(t,i.x,r.x,a.x),Ni(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class om extends tn{constructor(t=new T,e=new T,n=new T){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new T){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Ni(t,i.x,r.x,a.x),Ni(t,i.y,r.y,a.y),Ni(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Tl extends tn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Io(o,l.x,c.x,h.x,u.x),Io(o,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new ft().fromArray(i))}return this}}var Uo=Object.freeze({__proto__:null,ArcCurve:$p,CatmullRomCurve3:Jp,CubicBezierCurve:Sl,CubicBezierCurve3:rm,EllipseCurve:ga,LineCurve:wl,LineCurve3:am,QuadraticBezierCurve:El,QuadraticBezierCurve3:om,SplineCurve:Tl});class lm extends tn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Uo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new Uo[i.type]().fromJSON(i))}return this}}class cm extends lm{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new wl(this.currentPoint.clone(),new ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const r=new El(this.currentPoint.clone(),new ft(t,e),new ft(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,a){const o=new Sl(this.currentPoint.clone(),new ft(t,e),new ft(n,i),new ft(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Tl(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,i,r,a),this}absarc(t,e,n,i,r,a){return this.absellipse(t,e,n,n,i,r,a),this}ellipse(t,e,n,i,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,r,a,o,l),this}absellipse(t,e,n,i,r,a,o,l){const c=new ga(t,e,n,i,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class va extends be{constructor(t=[new ft(0,-.5),new ft(.5,0),new ft(0,.5)],e=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:i},e=Math.floor(e),i=ge(i,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,u=new T,f=new ft,p=new T,g=new T,_=new T;let m=0,d=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:m=t[x+1].x-t[x].x,d=t[x+1].y-t[x].y,p.x=d*1,p.y=-m,p.z=d*0,_.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:m=t[x+1].x-t[x].x,d=t[x+1].y-t[x].y,p.x=d*1,p.y=-m,p.z=d*0,g.copy(p),p.x+=_.x,p.y+=_.y,p.z+=_.z,p.normalize(),l.push(p.x,p.y,p.z),_.copy(g)}for(let x=0;x<=e;x++){const S=n+x*h*i,v=Math.sin(S),D=Math.cos(S);for(let b=0;b<=t.length-1;b++){u.x=t[b].x*v,u.y=t[b].y,u.z=t[b].x*D,a.push(u.x,u.y,u.z),f.x=x/e,f.y=b/(t.length-1),o.push(f.x,f.y);const R=l[3*b+0]*v,C=l[3*b+1],E=l[3*b+0]*D;c.push(R,C,E)}}for(let x=0;x<e;x++)for(let S=0;S<t.length-1;S++){const v=S+x*t.length,D=v,b=v+t.length,R=v+t.length+1,C=v+1;r.push(D,b,C),r.push(R,C,b)}this.setIndex(r),this.setAttribute("position",new ie(a,3)),this.setAttribute("uv",new ie(o,2)),this.setAttribute("normal",new ie(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new va(t.points,t.segments,t.phiStart,t.phiLength)}}class Ds extends va{constructor(t=1,e=1,n=4,i=8){const r=new cm;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:i}}static fromJSON(t){return new Ds(t.radius,t.length,t.capSegments,t.radialSegments)}}class As extends be{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new T,h=new ft;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=e;u++,f+=3){const p=n+u/e*i;c.x=t*Math.cos(p),c.y=t*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[f]/t+1)/2,h.y=(a[f+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ie(a,3)),this.setAttribute("normal",new ie(o,3)),this.setAttribute("uv",new ie(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new As(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Et extends be{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],f=[],p=[];let g=0;const _=[],m=n/2;let d=0;x(),a===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new ie(u,3)),this.setAttribute("normal",new ie(f,3)),this.setAttribute("uv",new ie(p,2));function x(){const v=new T,D=new T;let b=0;const R=(e-t)/n;for(let C=0;C<=r;C++){const E=[],M=C/r,L=M*(e-t)+t;for(let B=0;B<=i;B++){const z=B/i,q=z*l+o,K=Math.sin(q),X=Math.cos(q);D.x=L*K,D.y=-M*n+m,D.z=L*X,u.push(D.x,D.y,D.z),v.set(K,R,X).normalize(),f.push(v.x,v.y,v.z),p.push(z,1-M),E.push(g++)}_.push(E)}for(let C=0;C<i;C++)for(let E=0;E<r;E++){const M=_[E][C],L=_[E+1][C],B=_[E+1][C+1],z=_[E][C+1];(t>0||E!==0)&&(h.push(M,L,z),b+=3),(e>0||E!==r-1)&&(h.push(L,B,z),b+=3)}c.addGroup(d,b,0),d+=b}function S(v){const D=g,b=new ft,R=new T;let C=0;const E=v===!0?t:e,M=v===!0?1:-1;for(let B=1;B<=i;B++)u.push(0,m*M,0),f.push(0,M,0),p.push(.5,.5),g++;const L=g;for(let B=0;B<=i;B++){const q=B/i*l+o,K=Math.cos(q),X=Math.sin(q);R.x=E*X,R.y=m*M,R.z=E*K,u.push(R.x,R.y,R.z),f.push(0,M,0),b.x=K*.5+.5,b.y=X*.5*M+.5,p.push(b.x,b.y),g++}for(let B=0;B<i;B++){const z=D+B,q=L+B;v===!0?h.push(q,q+1,z):h.push(q+1,q,z),C+=3}c.addGroup(d,C,v===!0?1:2),d+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Et(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ki extends Et{constructor(t=1,e=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new ki(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class xa extends be{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new ie(r,3)),this.setAttribute("normal",new ie(r.slice(),3)),this.setAttribute("uv",new ie(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const S=new T,v=new T,D=new T;for(let b=0;b<e.length;b+=3)p(e[b+0],S),p(e[b+1],v),p(e[b+2],D),l(S,v,D,x)}function l(x,S,v,D){const b=D+1,R=[];for(let C=0;C<=b;C++){R[C]=[];const E=x.clone().lerp(v,C/b),M=S.clone().lerp(v,C/b),L=b-C;for(let B=0;B<=L;B++)B===0&&C===b?R[C][B]=E:R[C][B]=E.clone().lerp(M,B/L)}for(let C=0;C<b;C++)for(let E=0;E<2*(b-C)-1;E++){const M=Math.floor(E/2);E%2===0?(f(R[C][M+1]),f(R[C+1][M]),f(R[C][M])):(f(R[C][M+1]),f(R[C+1][M+1]),f(R[C+1][M]))}}function c(x){const S=new T;for(let v=0;v<r.length;v+=3)S.x=r[v+0],S.y=r[v+1],S.z=r[v+2],S.normalize().multiplyScalar(x),r[v+0]=S.x,r[v+1]=S.y,r[v+2]=S.z}function h(){const x=new T;for(let S=0;S<r.length;S+=3){x.x=r[S+0],x.y=r[S+1],x.z=r[S+2];const v=m(x)/2/Math.PI+.5,D=d(x)/Math.PI+.5;a.push(v,1-D)}g(),u()}function u(){for(let x=0;x<a.length;x+=6){const S=a[x+0],v=a[x+2],D=a[x+4],b=Math.max(S,v,D),R=Math.min(S,v,D);b>.9&&R<.1&&(S<.2&&(a[x+0]+=1),v<.2&&(a[x+2]+=1),D<.2&&(a[x+4]+=1))}}function f(x){r.push(x.x,x.y,x.z)}function p(x,S){const v=x*3;S.x=t[v+0],S.y=t[v+1],S.z=t[v+2]}function g(){const x=new T,S=new T,v=new T,D=new T,b=new ft,R=new ft,C=new ft;for(let E=0,M=0;E<r.length;E+=9,M+=6){x.set(r[E+0],r[E+1],r[E+2]),S.set(r[E+3],r[E+4],r[E+5]),v.set(r[E+6],r[E+7],r[E+8]),b.set(a[M+0],a[M+1]),R.set(a[M+2],a[M+3]),C.set(a[M+4],a[M+5]),D.copy(x).add(S).add(v).divideScalar(3);const L=m(D);_(b,M+0,x,L),_(R,M+2,S,L),_(C,M+4,v,L)}}function _(x,S,v,D){D<0&&x.x===1&&(a[S]=x.x-1),v.x===0&&v.z===0&&(a[S]=D/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xa(t.vertices,t.indices,t.radius,t.details)}}class Wi extends xa{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Wi(t.radius,t.detail)}}class Ee extends be{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new T,f=new T,p=[],g=[],_=[],m=[];for(let d=0;d<=n;d++){const x=[],S=d/n;let v=0;d===0&&a===0?v=.5/e:d===n&&l===Math.PI&&(v=-.5/e);for(let D=0;D<=e;D++){const b=D/e;u.x=-t*Math.cos(i+b*r)*Math.sin(a+S*o),u.y=t*Math.cos(a+S*o),u.z=t*Math.sin(i+b*r)*Math.sin(a+S*o),g.push(u.x,u.y,u.z),f.copy(u).normalize(),_.push(f.x,f.y,f.z),m.push(b+v,1-S),x.push(c++)}h.push(x)}for(let d=0;d<n;d++)for(let x=0;x<e;x++){const S=h[d][x+1],v=h[d][x],D=h[d+1][x],b=h[d+1][x+1];(d!==0||a>0)&&p.push(S,v,b),(d!==n-1||l<Math.PI)&&p.push(v,D,b)}this.setIndex(p),this.setAttribute("position",new ie(g,3)),this.setAttribute("normal",new ie(_,3)),this.setAttribute("uv",new ie(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ee(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ya extends be{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],l=[],c=[],h=new T,u=new T,f=new T;for(let p=0;p<=n;p++)for(let g=0;g<=i;g++){const _=g/i*r,m=p/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(g/i),c.push(p/n)}for(let p=1;p<=n;p++)for(let g=1;g<=i;g++){const _=(i+1)*p+g-1,m=(i+1)*(p-1)+g-1,d=(i+1)*(p-1)+g,x=(i+1)*p+g;a.push(_,m,x),a.push(m,d,x)}this.setIndex(a),this.setAttribute("position",new ie(o,3)),this.setAttribute("normal",new ie(l,3)),this.setAttribute("uv",new ie(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ya(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ct extends yi{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=il,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ue,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Is extends _e{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class hm extends Is{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.groundColor=new zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const fr=new ne,No=new T,Fo=new T;class bl{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.map=null,this.mapPass=null,this.matrix=new ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fa,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new Qt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;No.setFromMatrixPosition(t.matrixWorld),e.position.copy(No),Fo.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Fo),e.updateMatrixWorld(),fr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(fr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Oo=new ne,Ci=new T,pr=new T;class um extends bl{constructor(){super(new Ie(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ft(4,2),this._viewportCount=6,this._viewports=[new Qt(2,1,1,1),new Qt(0,1,1,1),new Qt(3,1,1,1),new Qt(1,1,1,1),new Qt(3,0,1,1),new Qt(1,0,1,1)],this._cubeDirections=[new T(1,0,0),new T(-1,0,0),new T(0,0,1),new T(0,0,-1),new T(0,1,0),new T(0,-1,0)],this._cubeUps=[new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,1,0),new T(0,0,1),new T(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ci.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ci),pr.copy(n.position),pr.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(pr),n.updateMatrixWorld(),i.makeTranslation(-Ci.x,-Ci.y,-Ci.z),Oo.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Oo)}}class Al extends Is{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new um}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class dm extends bl{constructor(){super(new ml(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class fm extends Is{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_e.DEFAULT_UP),this.updateMatrix(),this.target=new _e,this.shadow=new dm}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class pm extends Is{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class mm{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Bo(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Bo();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Bo(){return performance.now()}const zo=new ne;class Di{constructor(t,e,n=0,i=1/0){this.ray=new ua(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new da,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return zo.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(zo),this}intersectObject(t,e=!0,n=[]){return ea(t,this,n,e),n.sort(ko),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)ea(t[i],this,n,e);return n.sort(ko),n}}function ko(s,t){return s.distance-t.distance}function ea(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)ea(r[a],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:na}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=na);function Ma(s,t,e,n,i=28){const r=s.getImageData(0,0,t,e),a=r.data;for(let o=0;o<n;o++){const l=Math.random()*t|0,h=((Math.random()*e|0)*t+l)*4,u=(Math.random()-.5)*i|0;a[h]=Math.max(0,Math.min(255,a[h]+u)),a[h+1]=Math.max(0,Math.min(255,a[h+1]+u)),a[h+2]=Math.max(0,Math.min(255,a[h+2]+u))}s.putImageData(r,0,0)}function gm(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d");t.fillStyle="#c8b693",t.fillRect(0,0,512,512),t.strokeStyle="rgba(100, 85, 65, 0.25)",t.lineWidth=3;const e=8,n=512/e;for(let r=0;r<e;r++){const a=r*n;t.beginPath(),t.moveTo(0,a),t.lineTo(512,a),t.stroke();const o=4,l=512/o,c=r%2*(l/2);for(let h=0;h<=o+1;h++){const u=h*l-c;t.beginPath(),t.moveTo(u,a),t.lineTo(u,a+n),t.stroke()}}Ma(t,512,512,6e3,24);const i=new Ce(s);return i.wrapS=oe,i.wrapT=oe,i}function _m(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d");t.fillStyle="#d8b172",t.fillRect(0,0,512,512),t.strokeStyle="rgba(95, 75, 45, 0.2)",t.lineWidth=4;const e=64;for(let i=0;i<=512;i+=e)t.beginPath(),t.moveTo(i,0),t.lineTo(512,i),t.stroke();for(let i=0;i<=512;i+=e)t.beginPath(),t.moveTo(0,i),t.lineTo(512,i),t.stroke();Ma(t,512,512,8e3,28);const n=new Ce(s);return n.wrapS=oe,n.wrapT=oe,n.repeat.set(12,12),n}function vm(){const s=document.createElement("canvas");s.width=256,s.height=256;const t=s.getContext("2d");t.fillStyle="#7c5432",t.fillRect(0,0,256,256),t.strokeStyle="#4e331c",t.lineWidth=4;for(let n=32;n<256;n+=32)t.beginPath(),t.moveTo(0,n),t.lineTo(256,n),t.stroke();return t.fillStyle="#5c3d22",t.fillRect(0,0,256,16),t.fillRect(0,240,256,16),t.fillRect(0,0,16,256),t.fillRect(240,0,16,256),t.strokeStyle="#5c3d22",t.lineWidth=14,t.beginPath(),t.moveTo(16,16),t.lineTo(240,240),t.stroke(),t.fillStyle="#2b2622",t.fillRect(0,0,32,32),t.fillRect(224,0,32,32),t.fillRect(0,224,32,32),t.fillRect(224,224,32,32),new Ce(s)}function xm(){const s=document.createElement("canvas");s.width=256,s.height=256;const t=s.getContext("2d");t.fillStyle="#ded5be",t.fillRect(0,0,256,256),t.strokeStyle="#b8ad91",t.lineWidth=3;for(let n=32;n<256;n+=32)t.beginPath(),t.moveTo(0,n),t.lineTo(256,n),t.stroke();return t.fillStyle="#c7bca1",t.fillRect(0,0,256,16),t.fillRect(0,240,256,16),t.fillRect(0,0,16,256),t.fillRect(240,0,16,256),t.strokeStyle="#c7bca1",t.lineWidth=14,t.beginPath(),t.moveTo(16,16),t.lineTo(240,240),t.stroke(),t.fillStyle="#786e58",t.fillRect(0,0,30,30),t.fillRect(226,0,30,30),t.fillRect(0,226,30,30),t.fillRect(226,226,30,30),new Ce(s)}function ym(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d");t.fillStyle="#265487",t.fillRect(0,0,512,512),t.strokeStyle="rgba(235, 245, 255, 0.85)",t.lineWidth=4;const e=64;for(let i=-512;i<=1024;i+=e)t.beginPath(),t.moveTo(i,0),t.lineTo(i+512,512),t.stroke(),t.beginPath(),t.moveTo(i,0),t.lineTo(i-512,512),t.stroke();t.fillStyle="#f0c75e";for(let i=0;i<=512;i+=e)for(let r=0;r<=512;r+=e)t.beginPath(),t.arc(i,r,5,0,Math.PI*2),t.fill();const n=new Ce(s);return n.wrapS=oe,n.wrapT=oe,n.repeat.set(4,3),n}function Mm(){const s=document.createElement("canvas");s.width=256,s.height=256;const t=s.getContext("2d");t.fillStyle="#3a78ab",t.fillRect(0,0,256,256),t.strokeStyle="#2b5f88",t.lineWidth=6,t.beginPath(),t.moveTo(0,32),t.lineTo(256,32),t.moveTo(0,224),t.lineTo(256,224),t.stroke(),Ma(t,256,256,3e3,22);const e=new Ce(s);return e.wrapS=oe,e.wrapT=oe,e}class Sm{constructor(t){this.scene=t,this.colliders=[],this.colliderMeshes=[],this.occluderMeshes=[],this.upperLevelY=1.6,this.playerSpawn=new T(0,this.upperLevelY,19.5),this.botSpawn=new T(0,this.upperLevelY,-19.5),this.sandstoneTex=gm(),this.groundTex=_m(),this.crateTex=vm(),this.sandCrateTex=xm(),this.domeTex=ym(),this.blueTrimTex=Mm(),this.materials={ground:new Ct({map:this.groundTex,roughness:.9,metalness:.05}),wall:new Ct({map:this.sandstoneTex,roughness:.85,metalness:.02}),crate:new Ct({map:this.crateTex,roughness:.7,metalness:.1}),sandCrate:new Ct({map:this.sandCrateTex,roughness:.75,metalness:.05}),blueTrim:new Ct({map:this.blueTrimTex,roughness:.65,metalness:.1}),domeMat:new Ct({map:this.domeTex,roughness:.35,metalness:.25}),goldFinial:new Ct({color:14725955,roughness:.2,metalness:.85}),archTrim:new Ct({color:14074526,roughness:.75}),metalDoors:new Ct({color:5331037,metalness:.75,roughness:.45}),carBody:new Ct({color:5669516,roughness:.35,metalness:.4}),carGlass:new Ct({color:1582122,roughness:.1,metalness:.9}),carTire:new Ct({color:1579032,roughness:.85}),carChrome:new Ct({color:14213350,roughness:.2,metalness:.95})},this.buildLighting(),this.buildArena()}buildLighting(){const t=new pm(13945784,.65);this.scene.add(t),this.sunLight=new fm(16773590,1.4),this.sunLight.position.set(25,45,20),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.width=1024,this.sunLight.shadow.mapSize.height=1024,this.sunLight.shadow.camera.near=.5,this.sunLight.shadow.camera.far=100;const e=34;this.sunLight.shadow.camera.left=-e,this.sunLight.shadow.camera.right=e,this.sunLight.shadow.camera.top=e,this.sunLight.shadow.camera.bottom=-e,this.sunLight.shadow.bias=-4e-4,this.scene.add(this.sunLight);const n=new hm(9482456,9072461,.4);this.scene.add(n)}applyGraphicsQuality(t){this.sunLight&&(t==="low"?this.sunLight.castShadow=!1:t==="medium"?(this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.set(512,512),this.sunLight.shadow.map&&(this.sunLight.shadow.map.dispose(),this.sunLight.shadow.map=null)):(this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.set(1024,1024),this.sunLight.shadow.map&&(this.sunLight.shadow.map.dispose(),this.sunLight.shadow.map=null)))}addSolidBox(t,e,n,i,r,a,o,l=!1,c=!0,h=!0){const u=new H(i,r,a),f=new P(u,o);if(f.position.set(t,e,n),f.castShadow=c,f.receiveShadow=!0,f.matrixAutoUpdate=!1,f.updateMatrix(),this.scene.add(f),!l){const p=new mn;p.setFromObject(f),this.colliders.push(p),this.colliderMeshes.push(f),h&&this.occluderMeshes.push(f)}return f}buildArena(){const e=new Vi(56,56),n=new P(e,this.materials.ground);n.rotation.x=-Math.PI/2,n.position.y=0,n.receiveShadow=!0,n.matrixAutoUpdate=!1,n.updateMatrix(),this.scene.add(n),this.colliderMeshes.push(n);const i=this.upperLevelY;this.addSolidBox(0,i/2,16,23,i,17,this.materials.ground),this.addSolidBox(0,i/2,-16,23,i,17,this.materials.ground),this.addSolidBox(-6.45,i/2,0,4.5,i,15,this.materials.ground),this.addSolidBox(6.45,i/2,0,4.5,i,15,this.materials.ground),this.buildPitStairs(6.5,1,8),this.buildPitStairs(-6.5,-1,8);const r=2.45,a=.5;this.addSolidBox(-4.2,r/2,0,a,r,11,this.materials.wall),this.addSolidBox(-4.2,r+.06,0,a+.15,.12,11.2,this.materials.archTrim),this.addSolidBox(4.2,r/2,0,a,r,11,this.materials.wall),this.addSolidBox(4.2,r+.06,0,a+.15,.12,11.2,this.materials.archTrim),this.addSolidBox(-4.2,1.35,-5.5,.75,2.7,.75,this.materials.archTrim),this.addSolidBox(4.2,1.35,-5.5,.75,2.7,.75,this.materials.archTrim),this.addSolidBox(-4.2,1.35,5.5,.75,2.7,.75,this.materials.archTrim),this.addSolidBox(4.2,1.35,5.5,.75,2.7,.75,this.materials.archTrim),this.buildSedanCar(0,0,0,-.58),this.spawnCrateStack(-2.9,0,-3.5,1,2),this.spawnCrateStack(2.9,0,3.5,1,2);const o=8.1,l=2;this.addSolidBox(0,o/2,-24-l/2,12,o,l,this.materials.wall),this.addSolidBox(0,o+.25,-24-l/2,12.4,.5,l+.4,this.materials.blueTrim,!1,!1,!1),this.addSolidBox(0,o/2,24+l/2,12,o,l,this.materials.wall),this.addSolidBox(0,o+.25,24+l/2,12.4,.5,l+.4,this.materials.blueTrim,!1,!1,!1),this.buildCornerChamfer(-6,-24,-11.2,-18,o),this.buildCornerChamfer(6,-24,11.2,-18,o),this.buildCornerChamfer(-6,24,-11.2,18,o),this.buildCornerChamfer(6,24,11.2,18,o),this.addSolidBox(-11.2-l/2,o/2,15,l,o,6,this.materials.wall),this.addSolidBox(-11.2-l/2,o+.25,15,l+.4,.5,6.4,this.materials.blueTrim,!1,!1,!1),this.addSolidBox(11.2+l/2,o/2,15,l,o,6,this.materials.wall),this.addSolidBox(11.2+l/2,o+.25,15,l+.4,.5,6.4,this.materials.blueTrim,!1,!1,!1),this.addSolidBox(-11.2-l/2,o/2,-15,l,o,6,this.materials.wall),this.addSolidBox(-11.2-l/2,o+.25,-15,l+.4,.5,6.4,this.materials.blueTrim,!1,!1,!1),this.addSolidBox(11.2+l/2,o/2,-15,l,o,6,this.materials.wall),this.addSolidBox(11.2+l/2,o+.25,-15,l+.4,.5,6.4,this.materials.blueTrim,!1,!1,!1),this.buildCornerChamfer(-11.2,-12,-8.5,-7.5,o),this.buildCornerChamfer(11.2,-12,8.5,-7.5,o),this.buildCornerChamfer(-11.2,12,-8.5,7.5,o),this.buildCornerChamfer(11.2,12,8.5,7.5,o),this.addSolidBox(-8.5-l/2,o/2,0,l,o,15,this.materials.wall),this.addSolidBox(-8.5-l/2,o+.25,0,l+.4,.5,15.4,this.materials.blueTrim,!1,!1,!1),this.addSolidBox(8.5+l/2,o/2,0,l,o,15,this.materials.wall),this.addSolidBox(8.5+l/2,o+.25,0,l+.4,.5,15.4,this.materials.blueTrim,!1,!1,!1),this.addSolidBox(0,i+2.2,23.8,8.4,4.4,.4,this.materials.metalDoors),this.addSolidBox(0,i+4.6,23.8,9.2,.5,.6,this.materials.archTrim,!1,!1,!1),this.addSolidBox(0,i+2.2,-23.8,8.4,4.4,.4,this.materials.metalDoors),this.addSolidBox(0,i+4.6,-23.8,9.2,.5,.6,this.materials.archTrim,!1,!1,!1),this.buildMinaretDome(-9.2,o,-7.5),this.buildMinaretDome(-9.2,o,7.5),this.buildMinaretDome(9.2,o,-7.5),this.buildMinaretDome(9.2,o,7.5),this.buildWallAlcove(-8.5,-7.5,i),this.buildWallAlcove(-8.5,7.5,i),this.buildWallAlcove(8.5,-7.5,i),this.buildWallAlcove(8.5,7.5,i),this.buildSpawnDefensiveBastion(0,14,i),this.buildSpawnDefensiveBastion(0,-14,i),this.spawnCrateStack(-8.2,i,19.5,1,2),this.spawnCrateStack(7.2,i,19.5,1,2),this.spawnCrateStack(-8.2,i,-19.5,1,2),this.spawnCrateStack(7.2,i,-19.5,1,2),this.buildFlankTCover(-6.475,0,i),this.buildFlankTCover(6.475,0,i)}buildCornerChamfer(t,e,n,i,r){for(let o=0;o<4;o++){const l=(o+.5)/4,c=t+(n-t)*l,h=e+(i-e)*l;this.addSolidBox(c,r/2,h,2.8,r,2.8,this.materials.wall,!1,!0,!0),this.addSolidBox(c,r+.25,h,3,.5,3,this.materials.blueTrim,!1,!1,!1)}}buildWallAlcove(t,e,n){const i=t<0,r=this.materials.archTrim,a=i?t+.3:t-.3;this.addSolidBox(a,n+3,e-2.2,.5,6,.6,r,!1,!1,!1),this.addSolidBox(a,n+3,e+2.2,.5,6,.6,r,!1,!1,!1),this.addSolidBox(a,n+5.8,e,.5,.6,4.4,r,!1,!1,!1)}buildMinaretDome(t,e,n){const i=new jt;i.position.set(t,e,n);const r=new Et(2.3,2.4,.9,16),a=new P(r,this.materials.wall);a.position.y=.45,a.castShadow=!0,i.add(a);const o=new Et(2.45,2.3,.35,16),l=new P(o,this.materials.blueTrim);l.position.y=1,i.add(l);const c=new Ee(2.1,24,16,0,Math.PI*2,0,Math.PI*.58),h=new P(c,this.materials.domeMat);h.position.y=1.1,h.scale.set(1,1.25,1),h.castShadow=!0,i.add(h);const u=new Et(.06,.22,1.8,12),f=new P(u,this.materials.goldFinial);f.position.y=3.9,i.add(f);const p=new P(new Ee(.24,12,12),this.materials.goldFinial);p.position.y=3.3;const g=new P(new Ee(.16,12,12),this.materials.goldFinial);g.position.y=4.3;const _=new P(new ki(.14,.6,8),this.materials.goldFinial);_.position.y=4.9,i.add(p,g,_),i.traverse(m=>{m.isMesh&&(m.matrixAutoUpdate=!1,m.updateMatrix())}),i.matrixAutoUpdate=!1,i.updateMatrix(),this.scene.add(i),this.colliderMeshes.push(a,h),this.occluderMeshes.push(a)}buildSpawnDefensiveBastion(t,e,n){const r=n+.8;this.addSolidBox(t-1.6,r,e,1.6,1.6,1.6,this.materials.sandCrate),this.addSolidBox(t,r,e,1.6,1.6,1.6,this.materials.sandCrate),this.addSolidBox(t+1.6,r,e,1.6,1.6,1.6,this.materials.sandCrate);const a=n+1.6*1.5;this.addSolidBox(t-1.6,a,e,1.6,1.6,1.6,this.materials.sandCrate),this.addSolidBox(t,a,e,1.6,1.6,1.6,this.materials.sandCrate),this.addSolidBox(t+1.6,a,e,1.6,1.6,1.6,this.materials.sandCrate)}buildPitStairs(t,e,n=8){const r=[1.3,.98,.65,.35,.12];for(let a=0;a<r.length;a++){const o=r[a],l=t+e*(.8-a*.4);this.addSolidBox(0,o/2,l,n,o,.4,this.materials.archTrim,!1,!1,!1)}}buildSedanCar(t,e,n,i){const r=new jt;r.position.set(t,e,n),r.rotation.y=i;const a=new H(2,.58,4.4),o=new P(a,this.materials.carBody);o.position.y=.54,o.castShadow=!0,o.receiveShadow=!0,r.add(o);const l=new H(1.68,.62,2.3),c=new P(l,this.materials.carBody);c.position.set(0,1.14,-.2),c.castShadow=!0,c.receiveShadow=!0,r.add(c);const h=new H(1.56,.52,.08),u=new P(h,this.materials.carGlass);u.position.set(0,1.05,.98),u.rotation.x=.45,r.add(u);const f=new H(1.56,.48,.08),p=new P(f,this.materials.carGlass);p.position.set(0,1.05,-1.38),p.rotation.x=-.45,r.add(p);const g=new H(1.72,.36,1.8),_=new P(g,this.materials.carGlass);_.position.set(0,1.15,-.2),r.add(_);const m=new P(new H(2.06,.22,.24),this.materials.carChrome);m.position.set(0,.36,2.22),r.add(m);const d=new P(new H(2.06,.22,.24),this.materials.carChrome);d.position.set(0,.36,-2.22),r.add(d);const x=new Ct({color:16774863,roughness:.2,metalness:.8}),S=new P(new H(.32,.16,.08),x);S.position.set(-.68,.56,2.22);const v=S.clone();v.position.set(.68,.56,2.22),r.add(S,v);const D=new Et(.38,.38,.28,16);D.rotateZ(Math.PI/2),[[-1.02,.38,1.3],[1.02,.38,1.3],[-1.02,.38,-1.3],[1.02,.38,-1.3]].forEach(([C,E,M])=>{const L=new P(D,this.materials.carTire);L.position.set(C,E,M),L.castShadow=!0,r.add(L);const B=new P(new Et(.18,.18,.3,8),this.materials.carChrome);B.position.set(C,E,M),B.rotation.z=Math.PI/2,r.add(B)}),r.traverse(C=>{C.isMesh&&(C.matrixAutoUpdate=!1,C.updateMatrix())}),r.matrixAutoUpdate=!1,r.updateMatrix(),this.scene.add(r),this.colliderMeshes.push(o,c),this.occluderMeshes.push(o,c);const R=new mn;R.setFromObject(r),R.min.x+=.15,R.max.x-=.15,R.min.z+=.15,R.max.z-=.15,this.colliders.push(R)}buildFlankTCover(t,e,n){this.addSolidBox(t,n+.95,e,1.35,1.9,1.4,this.materials.sandCrate),this.addSolidBox(t,n+.68,e+1.1,.95,1.35,.8,this.materials.sandCrate),this.addSolidBox(t,n+.68,e-1.1,.95,1.35,.8,this.materials.sandCrate)}spawnCrateStack(t,e,n,i=1,r=1){for(let o=0;o<r;o++)for(let l=0;l<i;l++){const c=t+l*1.6,h=e+(o+.5)*1.6,u=n;this.addSolidBox(c,h,u,1.6,1.6,1.6,this.materials.crate)}}spawnSandCrateStack(t,e,n,i=1,r=1){for(let o=0;o<r;o++)for(let l=0;l<i;l++){const c=t+l*1.6,h=e+(o+.5)*1.6,u=n;this.addSolidBox(c,h,u,1.6,1.6,1.6,this.materials.sandCrate)}}getCollisions(t){const e=[];for(let n=0;n<this.colliders.length;n++)t.intersectsBox(this.colliders[n])&&e.push(this.colliders[n]);return e}}const Go="counter_siege_settings_v1",Ze={sensitivity:1,aimSmoothing:45,scopedSensitivity:.8,invertY:!1,graphicsQuality:"medium",showFps:!0};class wm{constructor(){this.settings={...Ze},this.listeners=[],this.load()}load(){try{if(typeof localStorage<"u"){const t=localStorage.getItem(Go);if(t){const e=JSON.parse(t),i=["low","medium","high"].includes(e.graphicsQuality)?e.graphicsQuality:Ze.graphicsQuality;this.settings={sensitivity:this.clamp(typeof e.sensitivity=="number"?e.sensitivity:Ze.sensitivity,.1,4),aimSmoothing:this.clamp(typeof e.aimSmoothing=="number"?e.aimSmoothing:Ze.aimSmoothing,0,100),scopedSensitivity:this.clamp(typeof e.scopedSensitivity=="number"?e.scopedSensitivity:Ze.scopedSensitivity,.2,2),invertY:!!e.invertY,graphicsQuality:i,showFps:e.showFps!==void 0?!!e.showFps:Ze.showFps}}}}catch(t){console.warn("Failed to load tactical settings from localStorage:",t),this.settings={...Ze}}}save(){try{typeof localStorage<"u"&&localStorage.setItem(Go,JSON.stringify(this.settings))}catch(t){console.warn("Failed to save tactical settings to localStorage:",t)}this.notify()}get(){return{...this.settings}}set(t){let e=!1;if(t.sensitivity!==void 0){const n=this.clamp(Number(t.sensitivity)||Ze.sensitivity,.1,4);this.settings.sensitivity=Math.round(n*100)/100,e=!0}if(t.aimSmoothing!==void 0){const n=this.clamp(Math.round(Number(t.aimSmoothing)||0),0,100);this.settings.aimSmoothing=n,e=!0}if(t.scopedSensitivity!==void 0){const n=this.clamp(Number(t.scopedSensitivity)||Ze.scopedSensitivity,.2,2);this.settings.scopedSensitivity=Math.round(n*100)/100,e=!0}t.invertY!==void 0&&(this.settings.invertY=!!t.invertY,e=!0),t.graphicsQuality!==void 0&&["low","medium","high"].includes(t.graphicsQuality)&&(this.settings.graphicsQuality=t.graphicsQuality,e=!0),t.showFps!==void 0&&(this.settings.showFps=!!t.showFps,e=!0),e&&this.save()}reset(){return this.settings={...Ze},this.save(),this.get()}onChange(t){typeof t=="function"&&(this.listeners.push(t),t(this.get()))}notify(){const t=this.get();for(const e of this.listeners)try{e(t)}catch(n){console.error("Error in settings listener:",n)}}clamp(t,e,n){return Math.max(e,Math.min(n,t))}}const Me=new wm;class Em{constructor(t,e,n){this.camera=t,this.domElement=e,this.gameMap=n,this.health=100,this.armor=100,this.isDead=!1,this.maxSpeed=7.2,this.crouchSpeedMultiplier=.45,this.acceleration=65,this.airAcceleration=12,this.friction=14,this.jumpForce=6.4,this.gravity=21,this.radius=.38,this.standHeight=1.8,this.crouchHeight=1.1,this.standEyeHeight=1.62,this.crouchEyeHeight=.95,this.currentHeight=this.standHeight,this.currentEyeHeight=this.standEyeHeight,this.currentSpawnPos=new T().copy(this.gameMap.playerSpawn),this.currentSpawnYaw=0,this.position=new T().copy(this.currentSpawnPos),this.velocity=new T(0,0,0),this.isGrounded=!1,this.isCrouching=!1,this.targetLean=0,this.currentLean=0,this.maxLeanOffset=.44,this.maxLeanRoll=he.degToRad(12),this.baseSensitivity=.0022,this.sensitivityMultiplier=1,this.mouseSensitivity=this.baseSensitivity*this.sensitivityMultiplier,this.aimSmoothing=45,this.scopedSensitivityMultiplier=.8,this.invertY=!1,this.isScoped=!1,this.defaultFov=78,this.cameraFov=78,this.yaw=0,this.pitch=0,this.targetYaw=0,this.targetPitch=0,Me.onChange(i=>this.applySettings(i)),this.root=new jt,this.eyeGroup=new jt,this.leanGroup=new jt,this.pitchGroup=new jt,this.root.add(this.eyeGroup),this.eyeGroup.add(this.leanGroup),this.leanGroup.add(this.pitchGroup),this.pitchGroup.add(this.camera),this.gameMap.scene.add(this.root),this.root.position.copy(this.position),this.eyeGroup.position.y=this.currentEyeHeight,this.keys={forward:!1,backward:!1,left:!1,right:!1,jump:!1,crouch:!1,leanLeft:!1,leanRight:!1},this.isPointerLocked=!1,this.stepDistance=0,this.stepInterval=1.9,this.onFootstep=null,this.onDamage=null,this.boundingBox=new mn,this.setupPointerLock(),this.setupKeyboard()}setupPointerLock(){this.canLock=!1,this.domElement.addEventListener("click",()=>{if(this.canLock&&!this.isPointerLocked&&!this.isDead)try{const t=this.domElement.requestPointerLock();t&&typeof t.catch=="function"&&t.catch(()=>{})}catch{}}),document.addEventListener("pointerlockchange",()=>{this.isPointerLocked=document.pointerLockElement===this.domElement}),window.addEventListener("mousemove",t=>{if(!this.isPointerLocked||this.isDead)return;const e=this.getEffectiveSensitivity(),n=this.invertY?-1:1;this.targetYaw-=t.movementX*e,this.targetPitch-=t.movementY*e*n;const i=Math.PI/2-.01;this.targetPitch=Math.max(-i,Math.min(i,this.targetPitch)),this.aimSmoothing<=0&&(this.yaw=this.targetYaw,this.pitch=this.targetPitch)})}getEffectiveSensitivity(){let t=this.baseSensitivity*(this.sensitivityMultiplier||1);if(this.isScoped){const e=Math.max(.15,(this.cameraFov||24)/(this.defaultFov||78));t*=e*(this.scopedSensitivityMultiplier||.8)}return t}setupKeyboard(){window.addEventListener("keydown",t=>{t.repeat||this.handleKey(t.code,!0)}),window.addEventListener("keyup",t=>{this.handleKey(t.code,!1)})}handleKey(t,e){if(!this.isDead){if(e){if(t==="ControlLeft"||t==="ControlRight"||t==="KeyC"){this.isCrouching=!this.isCrouching,this.keys.crouch=this.isCrouching;return}if(t==="KeyQ"){this.targetLean=this.targetLean===-1?0:-1,this.keys.leanLeft=this.targetLean===-1,this.keys.leanRight=!1;return}if(t==="KeyE"){this.targetLean=this.targetLean===1?0:1,this.keys.leanRight=this.targetLean===1,this.keys.leanLeft=!1;return}}else if(t==="ControlLeft"||t==="ControlRight"||t==="KeyC"||t==="KeyQ"||t==="KeyE")return;switch(t){case"KeyW":this.keys.forward=e;break;case"KeyS":this.keys.backward=e;break;case"KeyA":this.keys.left=e;break;case"KeyD":this.keys.right=e;break;case"Space":this.keys.jump=e;break}}}update(t){if(this.isDead){this.currentEyeHeight=he.lerp(this.currentEyeHeight,.35,6*t),this.eyeGroup.position.y=this.currentEyeHeight,this.pitchGroup.rotation.z=he.lerp(this.pitchGroup.rotation.z,.38,5*t),this.updateCameraTransform();return}t=Math.min(t,.05),this.updateAim(t),this.updateCrouch(t),this.updateLean(t),this.updateMovement(t),this.updateCameraTransform()}updateAim(t){if(this.aimSmoothing<=0){this.yaw=this.targetYaw,this.pitch=this.targetPitch;return}const e=he.lerp(130,22,this.aimSmoothing/100),n=1-Math.exp(-e*t);this.yaw=he.lerp(this.yaw,this.targetYaw,n),this.pitch=he.lerp(this.pitch,this.targetPitch,n),Math.abs(this.targetYaw-this.yaw)<1e-5&&(this.yaw=this.targetYaw),Math.abs(this.targetPitch-this.pitch)<1e-5&&(this.pitch=this.targetPitch)}updateCrouch(t){const e=this.isCrouching?this.crouchHeight:this.standHeight,n=this.isCrouching?this.crouchEyeHeight:this.standEyeHeight;this.currentHeight=he.lerp(this.currentHeight,e,14*t),this.currentEyeHeight=he.lerp(this.currentEyeHeight,n,14*t),this.eyeGroup.position.y=this.currentEyeHeight}updateLean(t){this.currentLean=he.lerp(this.currentLean,this.targetLean,12*t),this.leanGroup.position.x=this.currentLean*this.maxLeanOffset,this.leanGroup.rotation.z=-this.currentLean*this.maxLeanRoll}updateMovement(t){const e=new T(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),n=new T(Math.cos(this.yaw),0,-Math.sin(this.yaw)),i=new T;this.keys.forward&&i.add(e),this.keys.backward&&i.sub(e),this.keys.right&&i.add(n),this.keys.left&&i.sub(n);const r=i.lengthSq()>.001;r&&i.normalize();const a=this.isCrouching?this.maxSpeed*this.crouchSpeedMultiplier:this.maxSpeed;if(this.isGrounded){const o=new T(this.velocity.x,0,this.velocity.z),l=o.length();if(l>.001){const c=l*this.friction*t,h=Math.max(0,l-c);o.multiplyScalar(h/l),this.velocity.x=o.x,this.velocity.z=o.z}if(r){const c=o.dot(i),h=a-c;if(h>0){const u=Math.min(this.acceleration*t*a,h);this.velocity.x+=i.x*u,this.velocity.z+=i.z*u}}this.keys.jump&&(this.velocity.y=this.jumpForce,this.isGrounded=!1)}else{if(r){const l=new T(this.velocity.x,0,this.velocity.z).dot(i),c=a-l;if(c>0){const h=Math.min(this.airAcceleration*t*a,c);this.velocity.x+=i.x*h,this.velocity.z+=i.z*h}}this.velocity.y-=this.gravity*t}if(this.resolveCollisions(t),this.isGrounded&&r){const o=Math.hypot(this.velocity.x,this.velocity.z);this.stepDistance+=o*t;const l=this.isCrouching?this.stepInterval*1.3:this.stepInterval;this.stepDistance>=l&&(this.stepDistance=0,this.onFootstep&&this.onFootstep())}}resolveCollisions(t){const e=this.radius,n=.4,i=this.currentHeight,r=this.velocity.x*t;if(Math.abs(r)>1e-5){let p=this.position.x+r;const g=this.position.z-e*.85,_=this.position.z+e*.85,m=this.position.y,d=m+i;for(let x=0;x<this.gameMap.colliders.length;x++){const S=this.gameMap.colliders[x];S.max.y<=m+n||S.min.y>=d-.05||S.max.z<=g||S.min.z>=_||(r>0?this.position.x+e<=S.min.x+.1&&p+e>S.min.x&&(p=S.min.x-e,this.velocity.x=0):r<0&&this.position.x-e>=S.max.x-.1&&p-e<S.max.x&&(p=S.max.x+e,this.velocity.x=0))}this.position.x=p}const a=this.velocity.z*t;if(Math.abs(a)>1e-5){let p=this.position.z+a;const g=this.position.x-e*.85,_=this.position.x+e*.85,m=this.position.y,d=m+i;for(let x=0;x<this.gameMap.colliders.length;x++){const S=this.gameMap.colliders[x];S.max.y<=m+n||S.min.y>=d-.05||S.max.x<=g||S.min.x>=_||(a>0?this.position.z+e<=S.min.z+.1&&p+e>S.min.z&&(p=S.min.z-e,this.velocity.z=0):a<0&&this.position.z-e>=S.max.z-.1&&p-e<S.max.z&&(p=S.max.z+e,this.velocity.z=0))}this.position.z=p}let o=0;const l=this.position.x-e*.75,c=this.position.x+e*.75,h=this.position.z-e*.75,u=this.position.z+e*.75;for(let p=0;p<this.gameMap.colliders.length;p++){const g=this.gameMap.colliders[p];g.max.x>l&&g.min.x<c&&g.max.z>h&&g.min.z<u&&g.max.y<=this.position.y+n+.1&&g.max.y>o&&(o=g.max.y)}if(this.position.y+=this.velocity.y*t,this.position.y<=o?(this.position.y=o,this.velocity.y=0,this.isGrounded=!0):this.isGrounded&&this.position.y-o<=n?(this.position.y=o,this.velocity.y=0):this.isGrounded=!1,this.velocity.y>0){const p=this.position.y+i;for(let g=0;g<this.gameMap.colliders.length;g++){const _=this.gameMap.colliders[g];if(_.max.x>l&&_.min.x<c&&_.max.z>h&&_.min.z<u&&p>=_.min.y&&this.position.y<_.min.y){this.position.y=_.min.y-i,this.velocity.y=0;break}}}const f=25.5;this.position.x=Math.max(-f,Math.min(f,this.position.x)),this.position.z=Math.max(-f,Math.min(f,this.position.z)),this.position.y<-2&&this.respawn()}updateAABB(){this.boundingBox.min.set(this.position.x-this.radius,this.position.y,this.position.z-this.radius),this.boundingBox.max.set(this.position.x+this.radius,this.position.y+this.currentHeight,this.position.z+this.radius)}updateCameraTransform(){this.root.position.copy(this.position),this.root.rotation.y=this.yaw,this.pitchGroup.rotation.x=this.pitch}getShootOriginAndDirection(){const t=new T;this.camera.getWorldPosition(t);const e=new T;return this.camera.getWorldDirection(e),{origin:t,direction:e}}takeDamage(t,e=null){if(this.isDead)return;let n=0,i=0;const r=this.armor>0;this.armor>0&&(this.armor>=t?(n=t,this.armor-=t,t=0):(n=this.armor,t-=this.armor,this.armor=0)),t>0&&(i=t,this.health=Math.max(0,this.health-t));const a=r&&this.armor<=0;this.health<=0&&(this.health=0,this.isDead=!0),this.onDamage&&this.onDamage(this.health,this.armor,e,{shieldDamage:n,healthDamage:i,shieldBroken:a})}respawn(t=null,e=null){t&&this.currentSpawnPos.copy(t),e!=null&&(this.currentSpawnYaw=e),this.position.copy(this.currentSpawnPos),this.velocity.set(0,0,0),this.health=100,this.armor=100,this.isDead=!1,this.yaw=this.currentSpawnYaw,this.targetYaw=this.currentSpawnYaw,this.pitch=0,this.targetPitch=0,this.targetLean=0,this.currentLean=0,this.isCrouching=!1,this.currentHeight=this.standHeight,this.currentEyeHeight=this.standEyeHeight,this.eyeGroup.position.y=this.standEyeHeight,this.pitchGroup.rotation.z=0,this.leanGroup.rotation.z=0,this.leanGroup.position.x=0,this.keys.forward=!1,this.keys.backward=!1,this.keys.left=!1,this.keys.right=!1,this.keys.jump=!1,this.keys.crouch=!1,this.keys.leanLeft=!1,this.keys.leanRight=!1,this.updateCameraTransform()}setScoped(t,e=78){this.isScoped=t,this.cameraFov=e}applySettings(t){t&&(typeof t.sensitivity=="number"&&(this.sensitivityMultiplier=t.sensitivity,this.mouseSensitivity=this.baseSensitivity*this.sensitivityMultiplier),typeof t.aimSmoothing=="number"&&(this.aimSmoothing=t.aimSmoothing),typeof t.scopedSensitivity=="number"&&(this.scopedSensitivityMultiplier=t.scopedSensitivity),typeof t.invertY=="boolean"&&(this.invertY=t.invertY))}}class Tm{constructor(){this.ctx=null,this.masterGain=null,this.isMuted=!1,this.initContext()}initContext(){const t=window.AudioContext||window.webkitAudioContext;if(!t)return;this.ctx=new t,this.masterGain=this.ctx.createGain(),this.masterGain.gain.setValueAtTime(.65,this.ctx.currentTime),this.masterGain.connect(this.ctx.destination);const e=()=>{this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume(),window.removeEventListener("click",e),window.removeEventListener("keydown",e)};window.addEventListener("click",e),window.addEventListener("keydown",e)}ensureContext(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}createNoiseBuffer(t=.5){if(!this.ctx)return null;const e=this.ctx.sampleRate*t,n=this.ctx.createBuffer(1,e,this.ctx.sampleRate),i=n.getChannelData(0);for(let r=0;r<e;r++)i[r]=Math.random()*2-1;return n}playGunshot(t){if(!this.ctx)return;this.ensureContext();const e=this.ctx.currentTime;switch(t){case"ak47":this.synthRifleShot(e);break;case"awp":this.synthSniperShot(e);break;case"shotgun":this.synthShotgunBlast(e);break;case"pistol":this.synthPistolShot(e);break;case"deagle":this.synthDeagleShot(e);break;case"revolver":this.synthRevolverShot(e);break;case"knife":this.playKnifeSlash();break;default:this.synthPistolShot(e)}}synthRifleShot(t){const e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sawtooth",e.frequency.setValueAtTime(140,t),e.frequency.exponentialRampToValueAtTime(32,t+.14),n.gain.setValueAtTime(.8,t),n.gain.exponentialRampToValueAtTime(.001,t+.16),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.16);const i=this.ctx.createBufferSource();i.buffer=this.createNoiseBuffer(.25);const r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.setValueAtTime(1400,t),r.frequency.exponentialRampToValueAtTime(400,t+.22),r.Q.setValueAtTime(1.8,t);const a=this.ctx.createGain();a.gain.setValueAtTime(1,t),a.gain.exponentialRampToValueAtTime(.001,t+.22),i.connect(r),r.connect(a),a.connect(this.masterGain),i.start(t),i.stop(t+.22)}synthSniperShot(t){const e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="triangle",e.frequency.setValueAtTime(180,t),e.frequency.exponentialRampToValueAtTime(20,t+.45),n.gain.setValueAtTime(1,t),n.gain.exponentialRampToValueAtTime(.001,t+.5),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.5);const i=this.ctx.createBufferSource();i.buffer=this.createNoiseBuffer(.65);const r=this.ctx.createBiquadFilter();r.type="lowpass",r.frequency.setValueAtTime(2200,t),r.frequency.exponentialRampToValueAtTime(150,t+.6);const a=this.ctx.createGain();a.gain.setValueAtTime(1.2,t),a.gain.exponentialRampToValueAtTime(.001,t+.65),i.connect(r),r.connect(a),a.connect(this.masterGain),i.start(t),i.stop(t+.65)}synthShotgunBlast(t){const e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(110,t),e.frequency.exponentialRampToValueAtTime(30,t+.25),n.gain.setValueAtTime(.9,t),n.gain.exponentialRampToValueAtTime(.001,t+.28),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.28);const i=this.ctx.createBufferSource();i.buffer=this.createNoiseBuffer(.35);const r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.setValueAtTime(900,t),r.frequency.exponentialRampToValueAtTime(200,t+.3);const a=this.ctx.createGain();a.gain.setValueAtTime(1.1,t),a.gain.exponentialRampToValueAtTime(.001,t+.32),i.connect(r),r.connect(a),a.connect(this.masterGain),i.start(t),i.stop(t+.32),setTimeout(()=>{this.playMechanicalClick()},380)}synthPistolShot(t){const e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="triangle",e.frequency.setValueAtTime(160,t),e.frequency.exponentialRampToValueAtTime(50,t+.08),n.gain.setValueAtTime(.5,t),n.gain.exponentialRampToValueAtTime(.001,t+.09),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.09);const i=this.ctx.createBufferSource();i.buffer=this.createNoiseBuffer(.15);const r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.setValueAtTime(2200,t),r.frequency.exponentialRampToValueAtTime(600,t+.12);const a=this.ctx.createGain();a.gain.setValueAtTime(.7,t),a.gain.exponentialRampToValueAtTime(.001,t+.12),i.connect(r),r.connect(a),a.connect(this.masterGain),i.start(t),i.stop(t+.12)}synthDeagleShot(t){const e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sawtooth",e.frequency.setValueAtTime(170,t),e.frequency.exponentialRampToValueAtTime(35,t+.16),n.gain.setValueAtTime(.85,t),n.gain.exponentialRampToValueAtTime(.001,t+.18),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.18);const i=this.ctx.createBufferSource();i.buffer=this.createNoiseBuffer(.3);const r=this.ctx.createBiquadFilter();r.type="lowpass",r.frequency.setValueAtTime(1600,t),r.frequency.exponentialRampToValueAtTime(300,t+.22);const a=this.ctx.createGain();a.gain.setValueAtTime(.95,t),a.gain.exponentialRampToValueAtTime(.001,t+.25),i.connect(r),r.connect(a),a.connect(this.masterGain),i.start(t),i.stop(t+.25)}synthRevolverShot(t){const e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="square",e.frequency.setValueAtTime(190,t),e.frequency.exponentialRampToValueAtTime(45,t+.14),n.gain.setValueAtTime(.75,t),n.gain.exponentialRampToValueAtTime(.001,t+.15),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.15);const i=this.ctx.createBufferSource();i.buffer=this.createNoiseBuffer(.24);const r=this.ctx.createBiquadFilter();r.type="highpass",r.frequency.setValueAtTime(1e3,t),r.frequency.exponentialRampToValueAtTime(400,t+.2);const a=this.ctx.createGain();a.gain.setValueAtTime(.85,t),a.gain.exponentialRampToValueAtTime(.001,t+.2),i.connect(r),r.connect(a),a.connect(this.masterGain),i.start(t),i.stop(t+.2)}playMechanicalClick(){if(!this.ctx)return;this.ensureContext();const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(2400,t),e.frequency.exponentialRampToValueAtTime(800,t+.04),n.gain.setValueAtTime(.35,t),n.gain.exponentialRampToValueAtTime(.001,t+.05),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.05)}playDryFire(){if(!this.ctx)return;this.ensureContext();const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="triangle",e.frequency.setValueAtTime(1800,t),e.frequency.exponentialRampToValueAtTime(900,t+.03),n.gain.setValueAtTime(.3,t),n.gain.exponentialRampToValueAtTime(.001,t+.035),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.035)}playReload(){this.playMechanicalClick(),setTimeout(()=>this.playMechanicalClick(),350),setTimeout(()=>this.playMechanicalClick(),850)}playFootstep(){if(!this.ctx)return;this.ensureContext();const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(80+Math.random()*20,t),e.frequency.exponentialRampToValueAtTime(30,t+.08),n.gain.setValueAtTime(.25,t),n.gain.exponentialRampToValueAtTime(.001,t+.09),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.09);const i=this.ctx.createBufferSource();i.buffer=this.createNoiseBuffer(.08);const r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.setValueAtTime(600+Math.random()*200,t);const a=this.ctx.createGain();a.gain.setValueAtTime(.12,t),a.gain.exponentialRampToValueAtTime(.001,t+.07),i.connect(r),r.connect(a),a.connect(this.masterGain),i.start(t),i.stop(t+.08)}playHitmarker(t=!1){if(!this.ctx)return;this.ensureContext();const e=this.ctx.currentTime,n=this.ctx.createOscillator(),i=this.ctx.createGain();n.type="sine",t?(n.frequency.setValueAtTime(2600,e),n.frequency.exponentialRampToValueAtTime(3600,e+.07),i.gain.setValueAtTime(.45,e),i.gain.exponentialRampToValueAtTime(.001,e+.12)):(n.frequency.setValueAtTime(1600,e),n.frequency.exponentialRampToValueAtTime(1100,e+.05),i.gain.setValueAtTime(.35,e),i.gain.exponentialRampToValueAtTime(.001,e+.07)),n.connect(i),i.connect(this.masterGain),n.start(e),n.stop(e+(t?.12:.07))}playShieldHit(){if(!this.ctx)return;this.ensureContext();const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sawtooth",e.frequency.setValueAtTime(850,t),e.frequency.exponentialRampToValueAtTime(300,t+.08),n.gain.setValueAtTime(.28,t),n.gain.exponentialRampToValueAtTime(.001,t+.09),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.09)}playShieldBreak(){if(!this.ctx)return;this.ensureContext();const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="square",e.frequency.setValueAtTime(1400,t),e.frequency.exponentialRampToValueAtTime(160,t+.18),n.gain.setValueAtTime(.4,t),n.gain.exponentialRampToValueAtTime(.001,t+.2),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.2)}playKnifeSlash(){if(!this.ctx)return;this.ensureContext();const t=this.ctx.currentTime,e=this.ctx.createBufferSource();e.buffer=this.createNoiseBuffer(.14);const n=this.ctx.createBiquadFilter();n.type="bandpass",n.frequency.setValueAtTime(1400,t),n.frequency.exponentialRampToValueAtTime(500,t+.12),n.Q.setValueAtTime(3,t);const i=this.ctx.createGain();i.gain.setValueAtTime(.45,t),i.gain.exponentialRampToValueAtTime(.001,t+.13),e.connect(n),n.connect(i),i.connect(this.masterGain),e.start(t),e.stop(t+.14)}playKnifeHit(t=!1){if(!this.ctx)return;this.ensureContext();const e=this.ctx.currentTime,n=this.ctx.createOscillator(),i=this.ctx.createGain();n.type="sawtooth",n.frequency.setValueAtTime(t?2600:1800,e),n.frequency.exponentialRampToValueAtTime(300,e+.08),i.gain.setValueAtTime(.5,e),i.gain.exponentialRampToValueAtTime(.001,e+.09),n.connect(i),i.connect(this.masterGain),n.start(e),n.stop(e+.09);const r=this.ctx.createOscillator(),a=this.ctx.createGain();r.type="triangle",r.frequency.setValueAtTime(160,e),r.frequency.exponentialRampToValueAtTime(45,e+.1),a.gain.setValueAtTime(.6,e),a.gain.exponentialRampToValueAtTime(.001,e+.11),r.connect(a),a.connect(this.masterGain),r.start(e),r.stop(e+.11)}playBulletWhiz(){if(!this.ctx)return;this.ensureContext();const t=this.ctx.currentTime,e=this.ctx.createOscillator(),n=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(2600+Math.random()*800,t),e.frequency.exponentialRampToValueAtTime(500,t+.055),n.gain.setValueAtTime(.2,t),n.gain.exponentialRampToValueAtTime(.001,t+.06),e.connect(n),n.connect(this.masterGain),e.start(t),e.stop(t+.06)}}function Sa(s,t,e,n,i=20){const r=s.getImageData(0,0,t,e),a=r.data;for(let o=0;o<n;o++){const l=Math.random()*t|0,h=((Math.random()*e|0)*t+l)*4,u=(Math.random()-.5)*i|0;a[h]=Math.max(0,Math.min(255,a[h]+u)),a[h+1]=Math.max(0,Math.min(255,a[h+1]+u)),a[h+2]=Math.max(0,Math.min(255,a[h+2]+u))}s.putImageData(r,0,0)}function bm(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d");t.fillStyle="#22252a",t.fillRect(0,0,512,512),t.lineWidth=1;for(let n=0;n<400;n++){const i=Math.random()*512,r=40+Math.random()*200,a=Math.random()*(512-r),o=Math.random()>.5;t.strokeStyle=o?"rgba(255, 255, 255, 0.035)":"rgba(0, 0, 0, 0.07)",t.beginPath(),t.moveTo(a,i),t.lineTo(a+r,i),t.stroke()}Sa(t,512,512,4e3,16);const e=new Ce(s);return e.wrapS=oe,e.wrapT=oe,e.anisotropy=4,e}function Am(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d");t.fillStyle="#141518",t.fillRect(0,0,512,512),Sa(t,512,512,5e3,18);const e=new Ce(s);return e.wrapS=oe,e.wrapT=oe,e.anisotropy=4,e}function Rm(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d");t.fillStyle="#191a1d",t.fillRect(0,0,512,512);const e=8;for(let i=0;i<512;i+=e)for(let r=0;r<512;r+=e){const a=(r/e+i/e)%2===0;t.fillStyle=a?"rgba(255, 255, 255, 0.05)":"rgba(0, 0, 0, 0.09)",t.beginPath(),t.moveTo(r+e/2,i+1),t.lineTo(r+e-1,i+e/2),t.lineTo(r+e/2,i+e-1),t.lineTo(r+1,i+e/2),t.closePath(),t.fill()}Sa(t,512,512,4e3,[.015,.045]);const n=new Ce(s);return n.wrapS=oe,n.wrapT=oe,n.repeat.set(2,2),n.anisotropy=4,n}function Cm(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d");t.fillStyle="#783816",t.fillRect(0,0,512,512);for(let i=0;i<48;i++){const r=i/48*512,a=6+Math.random()*12,o=Math.random();t.fillStyle=o>.6?"rgba(64, 24, 7, 0.35)":o>.3?"rgba(154, 78, 30, 0.28)":"rgba(40, 14, 4, 0.42)",t.beginPath(),t.moveTo(0,r);for(let l=0;l<=512;l+=32){const c=Math.sin(l/512*Math.PI*3+i*.8)*7;t.lineTo(l,r+c)}for(let l=512;l>=0;l-=32){const c=Math.sin(l/512*Math.PI*3+i*.8)*7;t.lineTo(l,r+c+a)}t.closePath(),t.fill()}t.lineWidth=1;for(let i=0;i<350;i++){const r=Math.random()*512,a=Math.random()*300,o=80+Math.random()*200;t.strokeStyle=Math.random()>.5?"rgba(42, 16, 5, 0.2)":"rgba(180, 95, 42, 0.18)",t.beginPath(),t.moveTo(a,r),t.lineTo(a+o,r+(Math.random()-.5)*4),t.stroke()}const e=t.createLinearGradient(0,0,0,512);e.addColorStop(0,"rgba(255, 255, 255, 0.08)"),e.addColorStop(.5,"rgba(0, 0, 0, 0.04)"),e.addColorStop(1,"rgba(255, 255, 255, 0.06)"),t.fillStyle=e,t.fillRect(0,0,512,512);const n=new Ce(s);return n.wrapS=oe,n.wrapT=oe,n.anisotropy=4,n}function Pm(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d");t.fillStyle="#3a2215",t.fillRect(0,0,512,512);for(let i=0;i<30;i++){const r=i/30*512;t.strokeStyle="rgba(28, 15, 8, 0.35)",t.lineWidth=3+Math.random()*5,t.beginPath(),t.moveTo(0,r);for(let a=0;a<=512;a+=40)t.lineTo(a,r+Math.sin(a*.02+i)*6);t.stroke()}t.strokeStyle="rgba(20, 10, 5, 0.35)",t.lineWidth=1;const e=12;for(let i=-512;i<1024;i+=e)t.beginPath(),t.moveTo(i,0),t.lineTo(i+512,512),t.stroke(),t.beginPath(),t.moveTo(i,512),t.lineTo(i+512,0),t.stroke();const n=new Ce(s);return n.wrapS=oe,n.wrapT=oe,n.anisotropy=4,n}function Lm(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d");t.fillStyle="#354432",t.fillRect(0,0,512,512);for(let n=0;n<8e3;n++){const i=Math.random()*512,r=Math.random()*512,a=Math.random()>.5;t.fillStyle=a?"rgba(68, 86, 64, 0.15)":"rgba(32, 42, 30, 0.2)",t.fillRect(i,r,2,2)}t.strokeStyle="rgba(20, 26, 18, 0.4)",t.lineWidth=3,t.beginPath(),t.moveTo(0,256),t.lineTo(512,256),t.stroke();const e=new Ce(s);return e.wrapS=oe,e.wrapT=oe,e.anisotropy=4,e}function Dm(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d");t.fillStyle="#c4cacf",t.fillRect(0,0,512,512),t.lineWidth=1;for(let n=0;n<900;n++){const i=Math.random()*512,r=60+Math.random()*250,a=Math.random()*(512-r),o=Math.random()>.5;t.strokeStyle=o?"rgba(255, 255, 255, 0.12)":"rgba(0, 0, 0, 0.08)",t.beginPath(),t.moveTo(a,i),t.lineTo(a+r,i),t.stroke()}const e=new Ce(s);return e.wrapS=oe,e.wrapT=oe,e.anisotropy=4,e}function Im(){const s=document.createElement("canvas");s.width=512,s.height=512;const t=s.getContext("2d"),e=t.createRadialGradient(256,256,40,256,256,256);return e.addColorStop(0,"#0c1a26"),e.addColorStop(.7,"#112233"),e.addColorStop(.92,"#1c1836"),e.addColorStop(1,"#0a0d12"),t.fillStyle=e,t.fillRect(0,0,512,512),t.strokeStyle="#05070a",t.lineWidth=5,t.beginPath(),t.moveTo(0,256),t.lineTo(160,256),t.stroke(),t.beginPath(),t.moveTo(352,256),t.lineTo(512,256),t.stroke(),t.beginPath(),t.moveTo(256,0),t.lineTo(256,160),t.stroke(),t.beginPath(),t.moveTo(256,352),t.lineTo(256,512),t.stroke(),t.lineWidth=1.5,t.beginPath(),t.moveTo(160,256),t.lineTo(352,256),t.stroke(),t.beginPath(),t.moveTo(256,160),t.lineTo(256,352),t.stroke(),t.fillStyle="#05070a",[-64,-48,-32,-16,16,32,48,64].forEach(r=>{t.beginPath(),t.arc(256+r,256,2.5,0,Math.PI*2),t.fill(),t.beginPath(),t.arc(256,256+r,2.5,0,Math.PI*2),t.fill()}),t.strokeStyle="rgba(5, 7, 10, 0.35)",t.lineWidth=1,t.beginPath(),t.arc(256,256,96,0,Math.PI*2),t.stroke(),t.beginPath(),t.arc(256,256,180,0,Math.PI*2),t.stroke(),t.fillStyle="#ff2211",t.beginPath(),t.arc(256,256,3,0,Math.PI*2),t.fill(),new Ce(s)}let mr=null;function Rl(){return mr||(mr={steel:bm(),darkSteel:Am(),polymer:Rm(),russianWood:Cm(),walnut:Pm(),awpGreen:Lm(),chrome:Dm(),scopeReticle:Im()}),mr}function Um(){const s=Rl();return{steel:new Ct({map:s.steel,bumpMap:s.steel,bumpScale:8e-4,roughness:.35,metalness:.85}),darkSteel:new Ct({map:s.darkSteel,roughness:.45,metalness:.75}),brushedChrome:new Ct({map:s.chrome,bumpMap:s.chrome,bumpScale:4e-4,roughness:.16,metalness:.95}),polymer:new Ct({map:s.polymer,bumpMap:s.polymer,bumpScale:.0012,roughness:.72,metalness:.12}),russianWood:new Ct({map:s.russianWood,bumpMap:s.russianWood,bumpScale:.001,roughness:.38,metalness:.04}),walnut:new Ct({map:s.walnut,roughness:.45,metalness:.05}),awpGreen:new Ct({map:s.awpGreen,roughness:.52,metalness:.22}),scopeGlass:new Ct({map:s.scopeReticle,roughness:.05,metalness:.88,transparent:!0,opacity:.94}),tritiumGreen:new Ct({color:3800852,emissive:2402829,emissiveIntensity:.85,roughness:.2,metalness:.1}),sightRed:new Ct({color:16726804,emissive:14492160,emissiveIntensity:.8,roughness:.2,metalness:.1}),sightWhite:new Ct({color:16777215,roughness:.25,metalness:.1}),brass:new Ct({color:13938487,roughness:.22,metalness:.88}),rubberPad:new Ct({color:1447705,roughness:.85,metalness:.05}),steelRelief:new Ct({map:s.steel,roughness:.35,metalness:.85,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),darkSteelRelief:new Ct({map:s.darkSteel,roughness:.45,metalness:.75,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),chromeRelief:new Ct({map:s.chrome,roughness:.16,metalness:.95,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),gunMetal:new Ct({map:s.steel,roughness:.35,metalness:.85}),gunDark:new Ct({map:s.darkSteel,roughness:.45,metalness:.75}),gunWood:new Ct({map:s.russianWood,roughness:.38,metalness:.04}),gunGreen:new Ct({map:s.awpGreen,roughness:.52,metalness:.22}),chrome:new Ct({map:s.chrome,roughness:.16,metalness:.95}),gold:new Ct({color:12557104,metalness:.85,roughness:.25})}}function Cl(){const s=Rl(),t=new Ct({map:s.steel,roughness:.35,metalness:.85}),e=new Ct({map:s.darkSteel,roughness:.45,metalness:.75}),n=new Ct({map:s.russianWood,roughness:.38,metalness:.04}),i=new jt,r=new P(new H(.052,.074,.28),t);r.position.set(0,0,0);const a=new P(new Et(.012,.012,.28,12),e);a.rotation.x=Math.PI/2,a.position.set(0,.015,-.28);const o=new P(new Et(.016,.016,.04,10),t);o.rotation.x=Math.PI/2,o.position.set(0,.015,-.43);const l=new P(new H(.05,.054,.16),n);l.position.set(0,.005,-.19);const c=new P(new H(.046,.088,.22),n);c.position.set(0,-.015,.24),c.rotation.x=-.1;const h=new P(new H(.036,.12,.048),n);h.position.set(0,-.085,.09),h.rotation.x=.38;const u=new P(new H(.034,.15,.07),t);return u.position.set(0,-.095,-.045),u.rotation.x=-.28,i.add(r,a,o,l,c,h,u),i}class Nm{constructor(t,e,n,i,r){this.camera=t,this.scene=e,this.player=n,this.sound=i,this.map=r,this.viewmodelHolder=new jt,this.camera.add(this.viewmodelHolder),this.restPos=new T(.24,-.22,-.45),this.restRot=new Ue(0,0,0),this.currentPos=new T().copy(this.restPos),this.currentRot=new Ue().copy(this.restRot),this.recoilOffset=new T,this.recoilRot=new Ue,this.viewmodelHolder.position.copy(this.restPos),this.viewmodelHolder.rotation.copy(this.restRot),this.viewmodelHolder.visible=!1,this.bobTime=0,this.swayX=0,this.swayY=0,this.materials=Um(),this.raycaster=new Di,this.sparkPoolSize=16,this.sparkIndex=0,this.sparkGeo=new Ee(.045,4,4),this.sparkMat=new An({color:16770688}),this.sparkPool=[];for(let a=0;a<this.sparkPoolSize;a++){const o=new P(this.sparkGeo,this.sparkMat);o.visible=!1,this.scene.add(o),this.sparkPool.push({mesh:o,timer:0})}this.muzzleFlash=this.createMuzzleFlash(),this.viewmodelHolder.add(this.muzzleFlash),this.flashTimer=0,this.allWeapons={ak47:{id:"ak47",name:"AK-47",slot:0,damage:34,headshotMult:4,legMult:.68,fireRate:.1,auto:!0,magSize:30,mag:30,reserve:90,maxReserve:90,reloadTime:2.2,spread:.012,moveSpreadMult:3.2,recoilPitch:.038,recoilKickZ:.05,muzzleOffset:new T(0,.012,-.56),muzzleScale:1,createMesh:()=>this.buildAK47()},awp:{id:"awp",name:"AWP",slot:0,damage:220,legDamage:95,headshotMult:2.5,fireRate:1.4,auto:!1,magSize:5,mag:5,reserve:30,maxReserve:30,reloadTime:3.2,spread:.001,moveSpreadMult:12,recoilPitch:.09,recoilKickZ:.12,hasScope:!0,muzzleOffset:new T(0,.026,-.76),muzzleScale:1.4,createMesh:()=>this.buildAWP()},shotgun:{id:"shotgun",name:"SHOTGUN",slot:0,damage:18,pellets:8,headshotMult:2.5,legMult:.68,fireRate:.85,auto:!1,magSize:7,mag:7,reserve:28,maxReserve:28,reloadTime:2.6,spread:.055,moveSpreadMult:1.5,recoilPitch:.07,recoilKickZ:.09,muzzleOffset:new T(0,.032,-.58),muzzleScale:1.3,createMesh:()=>this.buildShotgun()},pistol:{id:"pistol",name:"PISTOL",slot:1,damage:26,headshotMult:3.5,legMult:.68,fireRate:.16,auto:!1,magSize:15,mag:15,reserve:60,maxReserve:60,reloadTime:1.6,spread:.009,moveSpreadMult:2,recoilPitch:.024,recoilKickZ:.035,muzzleOffset:new T(.02,.046,-.22),muzzleScale:.75,createMesh:()=>this.buildPistol()},deagle:{id:"deagle",name:"DESERT EAGLE",slot:1,damage:54,headshotMult:3.8,legMult:.68,fireRate:.32,auto:!1,magSize:7,mag:7,reserve:35,maxReserve:35,reloadTime:1.9,spread:.014,moveSpreadMult:3.5,recoilPitch:.055,recoilKickZ:.07,muzzleOffset:new T(.015,.05,-.26),muzzleScale:1.25,createMesh:()=>this.buildDeagle()},revolver:{id:"revolver",name:"REVOLVER",slot:1,damage:64,headshotMult:3.6,legMult:.68,fireRate:.4,auto:!1,magSize:6,mag:6,reserve:24,maxReserve:24,reloadTime:2.4,spread:.011,moveSpreadMult:2.8,recoilPitch:.065,recoilKickZ:.08,muzzleOffset:new T(.015,.042,-.28),muzzleScale:1.1,createMesh:()=>this.buildRevolver()},knife:{id:"knife",name:"TACTICAL KNIFE",slot:2,isMelee:!0,damage:55,headshotMult:2,fireRate:.42,auto:!1,magSize:1,mag:1,reserve:1,maxReserve:1,reloadTime:.1,spread:0,moveSpreadMult:1,recoilPitch:0,recoilKickZ:0,muzzleOffset:null,muzzleScale:.5,createMesh:()=>this.buildKnife()}},this.selectedPrimaryId="ak47",this.selectedSecondaryId="pistol",this.equipped=[this.allWeapons.ak47,this.allWeapons.pistol,this.allWeapons.knife],this.weapons=this.equipped,this.currentSlot=0,this.currentWeapon=this.equipped[this.currentSlot],this.viewmodelMeshes={},this.fireTimer=0,this.isReloading=!1,this.reloadProgress=0,this.isMouseDown=!1,this.isScoped=!1,this.equipAnimProgress=1,this.targets=[],this.initViewmodels(),this.selectWeapon(0),this.setupInputs()}initViewmodels(){Object.values(this.allWeapons).forEach(t=>{const e=t.createMesh();e.visible=!1,this.viewmodelHolder.add(e),this.viewmodelMeshes[t.id]=e})}buildAK47(){const t=new jt,e=this.materials;t.rotation.set(.02,-.02,-.015);const n=new H(.046,.064,.26),i=new P(n,e.steel);i.position.set(0,0,.02),t.add(i);const r=new H(.048,.018,.04),a=new P(r,e.steelRelief);a.position.set(0,-.008,-.035),t.add(a);const o=new Et(.0225,.0225,.23,16,1,!1,0,Math.PI),l=new P(o,e.steel);l.rotation.x=Math.PI/2,l.position.set(0,.032,.015),t.add(l),[-.05,.015,.075].forEach(wt=>{const Rt=new Et(.0235,.0235,.009,16,1,!1,0,Math.PI),Pt=new P(Rt,e.steelRelief);Pt.rotation.x=Math.PI/2,Pt.position.set(0,.032,.015+wt),t.add(Pt)});const c=new P(new H(.016,.014,.018),e.darkSteelRelief);c.position.set(0,.034,.134),t.add(c);const h=new P(new H(.003,.024,.072),e.darkSteelRelief);h.position.set(.0235,.018,-.02),t.add(h);const u=new P(new H(.016,.018,.06),e.steel);u.position.set(.016,.018,-.02),t.add(u);const f=new P(new Et(.0045,.0045,.032,8),e.steel);f.rotation.z=Math.PI/2,f.position.set(.034,.022,-.01);const p=new P(new Ee(.006,8,8),e.steel);p.position.set(.052,.022,-.005),t.add(f,p);const g=new P(new H(.003,.011,.082),e.steelRelief);g.position.set(.0245,.006,.045),g.rotation.x=-.12,t.add(g);const _=new P(new H(.042,.032,.046),e.steel);_.position.set(0,.024,-.132);const m=new P(new H(.015,.006,.042),e.darkSteelRelief);m.position.set(0,.043,-.132),m.rotation.x=-.08;const d=new P(new H(.022,.008,.008),e.steelRelief);d.position.set(0,.045,-.122),t.add(_,m,d);const x=new P(new H(.048,.052,.165),e.russianWood);x.position.set(0,.002,-.235);const S=new P(new H(.054,.036,.12),e.russianWood);S.position.set(0,.002,-.235),t.add(x,S);const v=new P(new H(.05,.054,.012),e.steel);v.position.set(0,.002,-.15);const D=new P(new H(.05,.054,.012),e.steel);D.position.set(0,.002,-.32),t.add(v,D);const b=new P(new H(.038,.028,.14),e.russianWood);b.position.set(0,.04,-.235),t.add(b);const R=new P(new Et(.011,.011,.16,12),e.steel);R.rotation.x=Math.PI/2,R.position.set(0,.036,-.235);const C=new P(new H(.028,.042,.035),e.steel);C.position.set(0,.026,-.345),t.add(R,C);const E=new P(new Et(.012,.012,.22,16),e.darkSteel);E.rotation.x=Math.PI/2,E.position.set(0,.012,-.44),t.add(E);const M=new P(new Et(.003,.003,.24,8),e.steel);M.rotation.x=Math.PI/2,M.position.set(0,-.018,-.32),t.add(M);const L=new P(new H(.024,.046,.022),e.steel);L.position.set(0,.034,-.485);const B=new P(new Et(.003,.003,.014,8),e.steel);B.position.set(0,.05,-.485);const z=new P(new Ee(.0032,8,8),e.tritiumGreen);z.position.set(0,.057,-.485);const q=new P(new H(.004,.022,.018),e.steelRelief);q.position.set(-.01,.05,-.485);const K=new P(new H(.004,.022,.018),e.steelRelief);K.position.set(.01,.05,-.485),t.add(L,B,z,q,K);const X=new P(new Et(.015,.015,.045,14),e.steel);X.rotation.x=Math.PI/2,X.position.set(0,.012,-.525);const j=new P(new H(.018,.022,.012),e.steel);j.position.set(0,.014,-.542),j.rotation.x=.4,t.add(X,j);const V=new P(new H(.034,.068,.065),e.steel);V.position.set(0,-.062,-.032),V.rotation.x=-.16;const it=new P(new H(.034,.068,.065),e.steel);it.position.set(0,-.12,-.052),it.rotation.x=-.32;const ot=new P(new H(.034,.052,.065),e.steel);ot.position.set(0,-.168,-.082),ot.rotation.x=-.48;const gt=new P(new H(.038,.01,.072),e.darkSteel);gt.position.set(0,-.19,-.098),gt.rotation.x=-.48,t.add(V,it,ot,gt),[-.08,-.11,-.14].forEach((wt,Rt)=>{const Pt=new P(new H(.036,.006,.048),e.steelRelief);Pt.position.set(0,wt,-.04-Rt*.02),Pt.rotation.x=-.22-Rt*.12,t.add(Pt)});const It=new P(new H(.034,.125,.048),e.russianWood);It.position.set(0,-.088,.11),It.rotation.x=.42;const kt=new P(new H(.036,.01,.05),e.steel);kt.position.set(0,-.144,.136),kt.rotation.x=.42,t.add(It,kt);const Y=new P(new H(.042,.086,.22),e.russianWood);Y.position.set(0,-.012,.25),Y.rotation.x=-.08;const tt=new P(new H(.044,.09,.014),e.steel);tt.position.set(0,-.021,.36),tt.rotation.x=-.08,t.add(Y,tt);const _t=new P(new H(.014,.036,.052),e.darkSteel);_t.position.set(0,-.048,.035);const st=new P(new H(.006,.024,.012),e.steel);return st.position.set(0,-.044,.042),st.rotation.x=-.3,t.add(_t,st),t}buildAWP(){const t=new jt,e=this.materials;t.rotation.set(.015,-.015,-.01);const n=new P(new H(.056,.076,.28),e.awpGreen);n.position.set(0,-.006,.02),t.add(n);const i=new P(new H(.05,.062,.26),e.awpGreen);i.position.set(0,-.012,-.24),t.add(i),[-.18,-.24,-.3].forEach(It=>{const kt=new P(new H(.052,.012,.032),e.darkSteelRelief);kt.position.set(0,-.008,It),t.add(kt)});const r=new P(new H(.044,.042,.18),e.awpGreen);r.position.set(0,.022,.26),r.rotation.x=-.04;const a=new P(new H(.046,.026,.12),e.polymer);a.position.set(0,.046,.25);const o=new P(new H(.036,.03,.18),e.awpGreen);o.position.set(0,-.062,.26);const l=new P(new H(.046,.112,.006),e.sightWhite);l.position.set(0,-.015,.353);const c=new P(new H(.048,.115,.032),e.rubberPad);c.position.set(0,-.015,.372),t.add(r,a,o,l,c);const h=new P(new Et(.024,.024,.26,16),e.darkSteel);h.rotation.x=Math.PI/2,h.position.set(0,.026,.01),t.add(h);const u=new P(new H(.024,.01,.22),e.darkSteelRelief);u.position.set(0,.052,-.02),t.add(u);const f=new P(new Et(.016,.016,.2,12),e.brushedChrome);f.rotation.x=Math.PI/2,f.position.set(0,.026,.02),t.add(f);const p=new P(new Et(.0055,.0055,.052,8),e.brushedChrome);p.position.set(.042,.034,.065),p.rotation.z=-.55,p.rotation.y=.2;const g=new P(new Ee(.012,12,12),e.polymer);g.position.set(.064,.02,.075),t.add(p,g);const _=new P(new Et(.017,.014,.44,16),e.darkSteel);_.rotation.x=Math.PI/2,_.position.set(0,.026,-.45),t.add(_);const m=new P(new H(.03,.03,.36),e.darkSteelRelief);m.position.set(0,.026,-.45),m.rotation.z=Math.PI/4,t.add(m);const d=new P(new H(.038,.038,.088),e.steel);d.position.set(0,.026,-.715);const x=new P(new H(.04,.024,.048),e.darkSteelRelief);x.position.set(0,.026,-.715),t.add(d,x);const S=new P(new Et(.018,.018,.3,16),e.darkSteel);S.rotation.x=Math.PI/2,S.position.set(0,.084,-.04);const v=new P(new Et(.028,.019,.08,16),e.darkSteel);v.rotation.x=Math.PI/2,v.position.set(0,.084,-.22);const D=new P(new Et(.0285,.0285,.024,16),e.darkSteel);D.rotation.x=Math.PI/2,D.position.set(0,.084,-.26);const b=new P(new As(.026,16),e.scopeGlass);b.position.set(0,.084,-.25);const R=new P(new Et(.023,.019,.06,16),e.darkSteel);R.rotation.x=Math.PI/2,R.position.set(0,.084,.13);const C=new P(new Et(.0245,.0245,.018,16),e.rubberPad);C.rotation.x=Math.PI/2,C.position.set(0,.084,.165);const E=new P(new As(.021,16),e.scopeGlass);E.position.set(0,.084,.155),E.rotation.y=Math.PI;const M=new P(new Et(.011,.011,.016,12),e.steel);M.position.set(0,.106,-.04);const L=new P(new Et(.011,.011,.016,12),e.steel);L.rotation.z=Math.PI/2,L.position.set(.024,.084,-.04);const B=new P(new Et(.01,.01,.014,12),e.steel);B.rotation.z=Math.PI/2,B.position.set(-.023,.084,-.04);const z=new P(new H(.034,.042,.026),e.darkSteel);z.position.set(0,.064,.04);const q=new P(new H(.034,.042,.026),e.darkSteel);q.position.set(0,.064,-.12),t.add(S,v,D,b,R,C,E,M,L,B,z,q);const K=new P(new H(.034,.095,.086),e.darkSteel);K.position.set(0,-.072,-.02),K.rotation.x=-.06;const X=new P(new H(.036,.01,.09),e.steel);X.position.set(0,-.12,-.023),X.rotation.x=-.06,t.add(K,X);const j=new P(new H(.026,.022,.032),e.darkSteel);j.position.set(0,-.046,-.32);const V=new P(new Et(.0055,.0055,.17,8),e.steel);V.rotation.x=Math.PI/2,V.position.set(-.028,-.028,-.24);const it=new P(new Et(.0055,.0055,.17,8),e.steel);it.rotation.x=Math.PI/2,it.position.set(.028,-.028,-.24),t.add(j,V,it);const ot=new P(new H(.016,.038,.062),e.darkSteel);ot.position.set(0,-.052,.03);const gt=new P(new H(.005,.024,.01),e.steel);return gt.position.set(0,-.048,.035),gt.rotation.x=-.25,t.add(ot,gt),t}buildShotgun(){const t=new jt,e=this.materials;t.rotation.set(.015,-.02,-.015);const n=new P(new H(.052,.082,.28),e.darkSteel);n.position.set(0,.005,.02),t.add(n);const i=new P(new H(.002,.03,.092),e.darkSteelRelief);i.position.set(.0265,.016,-.015);const r=new P(new H(.02,.022,.085),e.brushedChrome);r.position.set(.018,.016,-.015),t.add(i,r);const a=new P(new Et(.009,.009,.028,12),e.brass);a.rotation.x=Math.PI/2,a.position.set(0,-.035,-.01),t.add(a);const o=new P(new Et(.017,.017,.46,16),e.darkSteel);o.rotation.x=Math.PI/2,o.position.set(0,.032,-.33),t.add(o);const l=new P(new H(.01,.008,.44),e.steelRelief);l.position.set(0,.051,-.33),t.add(l);const c=new P(new Et(.015,.015,.44,16),e.steel);c.rotation.x=Math.PI/2,c.position.set(0,-.012,-.31);const h=new P(new Et(.016,.016,.024,14),e.steel);h.rotation.x=Math.PI/2,h.position.set(0,-.012,-.535),t.add(c,h);const u=new P(new H(.04,.065,.018),e.steel);u.position.set(0,.01,-.47),t.add(u);const f=new P(new Et(.026,.026,.17,16),e.polymer);f.rotation.x=Math.PI/2,f.position.set(0,-.012,-.27),t.add(f),[-.06,-.035,-.01,.015,.04,.065].forEach(b=>{const R=new P(new Et(.0275,.0275,.008,16),e.polymer);R.rotation.x=Math.PI/2,R.position.set(0,-.012,-.27+b),t.add(R)});const p=new P(new H(.004,.006,.14),e.steel);p.position.set(-.022,.008,-.12);const g=new P(new H(.004,.006,.14),e.steel);g.position.set(.022,.008,-.12),t.add(p,g);const _=new P(new H(.012,.018,.024),e.darkSteel);_.position.set(0,.058,-.54);const m=new P(new Et(.003,.003,.018,8),e.tritiumGreen);m.rotation.x=Math.PI/2,m.position.set(0,.064,-.54);const d=new P(new ya(.008,.002,6,12),e.darkSteel);d.rotation.x=Math.PI/2,d.position.set(0,.052,.1),t.add(_,m,d);const x=new P(new H(.046,.088,.25),e.polymer);x.position.set(0,-.032,.265),x.rotation.x=-.12;const S=new P(new H(.048,.105,.032),e.rubberPad);S.position.set(0,-.042,.395),S.rotation.x=-.12,t.add(x,S);const v=new P(new H(.016,.036,.055),e.darkSteel);v.position.set(0,-.048,.035);const D=new P(new H(.006,.024,.012),e.steel);return D.position.set(0,-.044,.042),D.rotation.x=-.28,t.add(v,D),t}buildPistol(){const t=new jt,e=this.materials;t.position.set(.02,.02,-.02),t.rotation.set(.02,-.025,-.015);const n=new P(new H(.036,.038,.21),e.steel);n.position.set(0,.026,-.02),t.add(n);const i=new P(new H(.032,.034,.014),e.steelRelief);i.position.set(0,.026,-.127),t.add(i),[-.04,-.05,-.06,-.07,-.08].forEach(D=>{const b=new P(new H(.037,.024,.003),e.darkSteelRelief);b.position.set(0,.026,.085+D),t.add(b)}),[-.07,-.08,-.09].forEach(D=>{const b=new P(new H(.037,.02,.003),e.darkSteelRelief);b.position.set(0,.026,D),t.add(b)});const r=new P(new H(.002,.02,.055),e.darkSteelRelief);r.position.set(.0185,.034,-.01);const a=new P(new H(.016,.016,.048),e.darkSteel);a.position.set(.012,.032,-.01),t.add(r,a);const o=new P(new Et(.006,.006,.02,12),e.darkSteel);o.rotation.x=Math.PI/2,o.position.set(0,.026,-.126),t.add(o);const l=new P(new H(.008,.012,.014),e.darkSteel);l.position.set(0,.05,-.115);const c=new P(new Ee(.0025,8,8),e.sightWhite);c.position.set(0,.052,-.11);const h=new P(new H(.024,.014,.012),e.darkSteel);h.position.set(0,.05,.075);const u=new P(new Ee(.0022,8,8),e.sightWhite);u.position.set(-.008,.052,.075);const f=new P(new Ee(.0022,8,8),e.sightWhite);f.position.set(.008,.052,.075),t.add(l,c,h,u,f);const p=new P(new H(.034,.032,.19),e.polymer);p.position.set(0,-.008,-.015);const g=new P(new H(.022,.006,.06),e.polymer);g.position.set(0,-.026,-.075);const _=new P(new H(.003,.008,.024),e.steelRelief);_.position.set(-.0185,.01,.01),t.add(p,g,_);const m=new P(new H(.032,.125,.052),e.polymer);m.position.set(0,-.076,.052),m.rotation.x=.32,[-.045,-.075,-.105].forEach(D=>{const b=new P(new H(.034,.008,.012),e.polymer);b.position.set(0,D,.035-D*.28),b.rotation.x=.32,t.add(b)});const d=new P(new H(.034,.012,.056),e.darkSteel);d.position.set(0,-.138,.072),d.rotation.x=.32,t.add(m,d);const x=new P(new H(.014,.038,.052),e.polymer);x.position.set(0,-.042,-.005);const S=new P(new H(.005,.022,.01),e.steel);S.position.set(0,-.036,.005),S.rotation.x=-.25;const v=new P(new H(.003,.018,.006),e.darkSteelRelief);return v.position.set(0,-.036,.008),v.rotation.x=-.25,t.add(x,S,v),t}buildDeagle(){const t=new jt,e=this.materials;t.position.set(.015,.015,-.03),t.rotation.set(.018,-.025,-.015);const n=new P(new H(.048,.056,.26),e.brushedChrome);n.position.set(0,.034,-.08),t.add(n);const i=new P(new H(.026,.008,.18),e.chromeRelief);i.position.set(0,.065,-.08),t.add(i);const r=new P(new Et(.014,.014,.045,16),e.darkSteel);r.rotation.x=Math.PI/2,r.position.set(0,.034,-.21),t.add(r);const a=new P(new H(.002,.018,.14),e.chromeRelief);a.position.set(-.0245,.038,-.09);const o=new P(new H(.002,.018,.14),e.chromeRelief);o.position.set(.0245,.038,-.09),t.add(a,o);const l=new P(new Et(.01,.01,.16,12),e.steel);l.rotation.x=Math.PI/2,l.position.set(0,.004,-.1),t.add(l);const c=new P(new H(.024,.024,.075),e.steel);c.position.set(0,.032,.01),t.add(c);const h=new P(new H(.044,.042,.2),e.brushedChrome);h.position.set(0,-.01,-.02);const u=new P(new H(.032,.018,.045),e.brushedChrome);u.position.set(0,.014,.085),u.rotation.x=.25;const f=new P(new H(.012,.026,.022),e.darkSteel);f.position.set(0,.042,.082),f.rotation.x=.5;const p=new P(new H(.003,.012,.024),e.darkSteelRelief);p.position.set(-.0245,.042,.045);const g=new P(new H(.003,.012,.024),e.darkSteelRelief);g.position.set(.0245,.042,.045),t.add(h,u,f,p,g);const _=new P(new H(.042,.145,.065),e.polymer);_.position.set(0,-.088,.055),_.rotation.x=.28,[-.055,-.088,-.12].forEach(b=>{const R=new P(new H(.044,.01,.014),e.polymer);R.position.set(0,b,.038-b*.26),R.rotation.x=.28,t.add(R)});const m=new P(new Et(.008,.008,.002,12),e.chromeRelief);m.rotation.z=Math.PI/2,m.position.set(.022,-.085,.055),t.add(m);const d=new P(new H(.044,.012,.07),e.steel);d.position.set(0,-.158,.075),d.rotation.x=.28,t.add(_,d);const x=new P(new H(.009,.016,.018),e.darkSteel);x.position.set(0,.068,-.19);const S=new P(new H(.026,.018,.016),e.darkSteel);S.position.set(0,.068,.042),t.add(x,S);const v=new P(new H(.016,.044,.065),e.brushedChrome);v.position.set(0,-.048,-.005);const D=new P(new H(.007,.026,.012),e.steel);return D.position.set(0,-.042,.008),D.rotation.x=-.22,t.add(v,D),t}buildRevolver(){const t=new jt,e=this.materials;t.position.set(.015,.015,-.03),t.rotation.set(.02,-.025,-.015);const n=new P(new H(.032,.056,.22),e.steel);n.position.set(0,.026,-.14),t.add(n);const i=new P(new H(.012,.008,.22),e.steelRelief);i.position.set(0,.058,-.14),[-.08,-.14,-.2].forEach(b=>{const R=new P(new H(.014,.009,.022),e.darkSteelRelief);R.position.set(0,.058,b),t.add(R)}),t.add(i);const r=new P(new Et(.01,.01,.16,12),e.steel);r.rotation.x=Math.PI/2,r.position.set(0,.004,-.14);const a=new P(new Et(.008,.008,.02,12),e.darkSteel);a.rotation.x=Math.PI/2,a.position.set(0,.026,-.25),t.add(r,a);const o=new P(new H(.008,.016,.024),e.darkSteel);o.position.set(0,.068,-.235);const l=new P(new H(.009,.008,.018),e.sightRed);l.position.set(0,.072,-.235),t.add(o,l);const c=new P(new Et(.03,.03,.076,18),e.brushedChrome);c.rotation.x=Math.PI/2,c.position.set(0,.016,.005),t.add(c);for(let b=0;b<6;b++){const R=b/6*Math.PI*2,C=.029,E=new P(new Et(.006,.006,.065,8),e.chromeRelief);E.rotation.x=Math.PI/2,E.position.set(Math.cos(R)*C,.016+Math.sin(R)*C,.005),t.add(E)}const h=new P(new Et(.0055,.0055,.088,8),e.steel);h.rotation.x=Math.PI/2,h.position.set(0,.016,.005),t.add(h);const u=new P(new H(.036,.076,.16),e.steel);u.position.set(0,.008,.045);const f=new P(new H(.034,.014,.11),e.steel);f.position.set(0,.052,.005);const p=new P(new H(.022,.014,.016),e.darkSteel);p.position.set(0,.054,.115);const g=new P(new H(.012,.028,.022),e.darkSteel);g.position.set(0,.048,.072),g.rotation.x=.4;const _=new P(new H(.003,.012,.018),e.steelRelief);_.position.set(-.0195,.022,.055),t.add(u,f,p,g,_);const m=new P(new H(.034,.138,.06),e.walnut);m.position.set(0,-.082,.09),m.rotation.x=.55;const d=new P(new Et(.006,.006,.002,8),e.brass);d.rotation.z=Math.PI/2,d.position.set(-.018,-.078,.09);const x=new P(new Et(.006,.006,.002,8),e.brass);x.rotation.z=Math.PI/2,x.position.set(.018,-.078,.09);const S=new P(new H(.036,.01,.062),e.steel);S.position.set(0,-.146,.128),S.rotation.x=.55,t.add(m,d,x,S);const v=new P(new H(.014,.042,.058),e.steel);v.position.set(0,-.044,.035);const D=new P(new H(.006,.024,.012),e.steel);return D.position.set(0,-.038,.042),D.rotation.x=-.32,t.add(v,D),t}buildKnife(){const t=new jt,e=this.materials,n=new P(new H(.03,.044,.16),e.polymer);n.position.set(0,0,.08),t.add(n),[.03,.08,.13].forEach(u=>{const f=new P(new Et(.0045,.0045,.032,8),e.steelRelief);f.rotation.z=Math.PI/2,f.position.set(0,.002,u),t.add(f)});const i=new P(new H(.034,.048,.022),e.steel);i.position.set(0,0,.165);const r=new P(new ki(.008,.014,4),e.steel);r.rotation.x=Math.PI/2,r.position.set(0,0,.18),t.add(i,r);const a=new P(new H(.034,.078,.014),e.steel);a.position.set(0,0,-.007),t.add(a);const o=new P(new H(.008,.046,.22),e.darkSteel);o.position.set(0,.004,-.12),t.add(o);const l=new P(new H(.0035,.014,.22),e.brushedChrome);l.position.set(0,-.022,-.12),t.add(l);for(let u=0;u<5;u++){const f=new P(new H(.01,.006,.01),e.steelRelief);f.position.set(0,.029,-.04-u*.024),t.add(f)}const c=new P(new ki(.022,.08,4),e.brushedChrome);c.rotation.x=-Math.PI/2,c.rotation.y=Math.PI/4,c.position.set(0,.002,-.265),t.add(c);const h=new P(new H(.009,.005,.13),e.steelRelief);return h.position.set(0,.006,-.11),t.add(h),t.position.set(.04,-.02,-.08),t.rotation.set(.18,-.25,.12),t}createMuzzleFlash(){const t=new jt;t.visible=!1;const e=new Wi(.065,0),n=new An({color:16773256,transparent:!0,opacity:.95}),i=new P(e,n);t.add(i);const r=new H(.14,.015,.015),a=new An({color:16763972,transparent:!0,opacity:.85}),o=new P(r,a),l=o.clone();l.rotation.z=Math.PI/2,t.add(o,l);const c=new Al(16756804,3,5);return t.add(c),t}setupInputs(){window.addEventListener("mousedown",t=>{!this.player.isPointerLocked||this.player.isDead||(t.button===0?(this.isMouseDown=!0,this.tryShoot()):t.button===2&&(t.preventDefault(),this.toggleScope()))}),window.addEventListener("mouseup",t=>{t.button===0&&(this.isMouseDown=!1)}),window.addEventListener("contextmenu",t=>t.preventDefault()),window.addEventListener("keydown",t=>{if(this.player.isDead)return;t.code==="KeyR"&&this.reload();const e=parseInt(t.key,10);!isNaN(e)&&e>=1&&e<=3&&this.selectWeapon(e-1)}),window.addEventListener("wheel",t=>{if(!this.player.isPointerLocked||this.player.isDead)return;const e=Math.sign(t.deltaY);let n=this.currentSlot+e;n<0&&(n=this.equipped.length-1),n>=this.equipped.length&&(n=0),this.selectWeapon(n)}),window.addEventListener("mousemove",t=>{if(!this.player.isPointerLocked)return;const e=(this.player.sensitivityMultiplier||1)*(this.isScoped?.35:1),n=35e-5*Math.min(1.4,Math.max(.6,e));this.swayX-=t.movementX*n,this.swayY-=t.movementY*n,this.swayX=Math.max(-.06,Math.min(.06,this.swayX)),this.swayY=Math.max(-.04,Math.min(.04,this.swayY))})}setLoadout(t="ak47",e="pistol"){!this.allWeapons[t]||!this.allWeapons[e]||(this.selectedPrimaryId=t,this.selectedSecondaryId=e,this.equipped=[this.allWeapons[t],this.allWeapons[e],this.allWeapons.knife],this.weapons=this.equipped,this.selectWeapon(this.currentSlot<3?this.currentSlot:0))}selectWeapon(t){if(t<0||t>=this.equipped.length)return;const e=this.equipped[t],n=this.viewmodelMeshes[e.id];t===this.currentSlot&&n&&n.visible||(this.isScoped&&this.toggleScope(!1),this.currentSlot=t,this.currentWeapon=e,this.isReloading=!1,this.equipAnimProgress=0,Object.keys(this.viewmodelMeshes).forEach(i=>{this.viewmodelMeshes[i].visible=i===e.id}),this.sound.playMechanicalClick(),this.updateHUD())}toggleScope(t=null){if(!this.currentWeapon.hasScope)return;this.isScoped=t!==null?t:!this.isScoped;const e=document.getElementById("scope-overlay");e&&(e.style.display=this.isScoped?"block":"none"),this.viewmodelMeshes[this.currentWeapon.id]&&(this.viewmodelMeshes[this.currentWeapon.id].visible=!this.isScoped),this.camera.fov=this.isScoped?24:78,this.camera.updateProjectionMatrix(),this.player&&this.player.setScoped&&this.player.setScoped(this.isScoped,this.camera.fov)}tryShoot(){if(!(this.fireTimer>0||this.isReloading||this.player.isDead)){if(this.currentWeapon.isMelee){this.slashKnife();return}if(this.currentWeapon.mag<=0){this.sound.playDryFire(),this.reload();return}this.shoot()}}slashKnife(){const t=this.currentWeapon;this.fireTimer=t.fireRate,this.sound.playKnifeSlash(),this.recoilOffset.z-=.14,this.recoilOffset.x-=.08,this.recoilOffset.y+=.03,this.recoilRot.z+=.45,this.recoilRot.x-=.25,this.recoilRot.y+=.2,this.onFire&&this.onFire("knife");const{origin:e,direction:n}=this.player.getShootOriginAndDirection();this.raycaster.set(e,n),this.raycaster.near=.1,this.raycaster.far=2.6;const i=this.raycaster;let r=null,a=1/0,o=!1;for(const h of this.targets){if(h.isDead)continue;const u=h.getHitMeshes?h.getHitMeshes():[h.mesh],f=i.intersectObjects(u,!0);if(f.length>0&&f[0].distance<a){a=f[0].distance,r=h;const g=f[0].point.y-h.position.y;o=!!(f[0].object&&f[0].object.userData&&f[0].object.userData.isHead)||g>=1.15}}const l=i.intersectObjects(this.map.colliderMeshes,!1),c=l.length>0?l[0].distance:1/0;if(r&&a<c){let h=Math.round(o?t.damage*t.headshotMult:t.damage);r.takeDamage(h,this.player.position,o),this.onTargetHit&&this.onTargetHit(r,h,o),this.sound.playKnifeHit(o),this.triggerHitmarker(o),this.spawnImpactSparks(e.clone().add(n.clone().multiplyScalar(a)))}else l.length>0&&c<=2.2&&(this.sound.playMechanicalClick(),this.spawnImpactSparks(l[0].point));this.updateHUD()}shoot(){const t=this.currentWeapon;t.mag--,this.fireTimer=t.fireRate,this.sound.playGunshot(t.id),this.flashTimer=.05,this.muzzleFlash.visible=!0;const e=t.muzzleOffset||new T(0,.03,-.6);this.muzzleFlash.position.copy(e);const n=t.muzzleScale||1;this.muzzleFlash.scale.setScalar(n),this.recoilOffset.z+=t.recoilKickZ,this.recoilRot.x+=t.recoilPitch,this.recoilRot.y+=(Math.random()-.5)*(t.recoilPitch*.4),this.onFire&&this.onFire(t.id);const i=t.pellets||1;for(let r=0;r<i;r++)this.fireBulletRay(t);this.updateHUD()}fireBulletRay(t){const e=Math.hypot(this.player.velocity.x,this.player.velocity.z)>.5;let n=t.spread;e&&(n*=t.moveSpreadMult),this.player.isCrouching&&(n*=.65),this.isScoped&&(n=5e-4);const{origin:i,direction:r}=this.player.getShootOriginAndDirection();r.x+=(Math.random()-.5)*n,r.y+=(Math.random()-.5)*n,r.z+=(Math.random()-.5)*n,r.normalize(),this.raycaster.set(i,r),this.raycaster.near=.1,this.raycaster.far=300;const a=this.raycaster;let o=null,l=1/0,c=!1,h=!1;for(const p of this.targets){if(p.isDead)continue;const g=p.getHitMeshes?p.getHitMeshes():[p.mesh],_=a.intersectObjects(g,!0);if(_.length>0&&_[0].distance<l){l=_[0].distance,o=p;const d=_[0].point.y-p.position.y;c=!!(_[0].object&&_[0].object.userData&&_[0].object.userData.isHead)||d>=1.15,h=!c&&d<.62}}const u=a.intersectObjects(this.map.colliderMeshes,!1),f=u.length>0?u[0].distance:1/0;if(o&&l<f){let p=t.damage;c?p*=t.headshotMult:h&&(t.legDamage!==void 0?p=t.legDamage:p*=t.legMult||.68),p=Math.round(p),o.takeDamage(p,this.player.position,c),this.onTargetHit&&this.onTargetHit(o,p,c),this.sound.playHitmarker(c),this.triggerHitmarker(c),this.spawnImpactSparks(i.clone().add(r.clone().multiplyScalar(l)))}else u.length>0&&this.spawnImpactSparks(u[0].point)}triggerHitmarker(t){const e=document.getElementById("hitmarker");e&&(e.className="active"+(t?" headshot":""),clearTimeout(this.hitmarkerTimeout),this.hitmarkerTimeout=setTimeout(()=>{e.className=""},120))}spawnImpactSparks(t){if(!this.sparkPool||this.sparkPool.length===0)return;const e=this.sparkPool[this.sparkIndex];this.sparkIndex=(this.sparkIndex+1)%this.sparkPoolSize,e.mesh.position.copy(t),e.mesh.visible=!0,e.timer=.08}reload(){const t=this.currentWeapon;if(t.isMelee||this.isReloading||t.mag>=t.magSize||t.reserve<=0)return;this.isReloading=!0,this.reloadProgress=0,this.isScoped&&this.toggleScope(!1),this.sound.playReload();const e=document.getElementById("reload-track");e&&e.classList.add("reloading")}finishReload(){const t=this.currentWeapon,e=t.magSize-t.mag,n=Math.min(e,t.reserve);t.mag+=n,t.reserve-=n,this.isReloading=!1,this.reloadProgress=0;const i=document.getElementById("reload-track");i&&i.classList.remove("reloading"),this.updateHUD()}resetAllAmmo(){Object.values(this.allWeapons).forEach(n=>{n.isMelee||(n.mag=n.magSize,n.reserve=n.maxReserve!==void 0?n.maxReserve:n.reserve||90)}),this.isReloading=!1,this.reloadProgress=0,this.isMouseDown=!1,this.fireTimer=0;const t=document.getElementById("reload-track");t&&t.classList.remove("reloading");const e=document.getElementById("reload-progress");e&&(e.style.width="0%"),this.isScoped?this.toggleScope(!1):this.player&&this.player.setScoped&&this.player.setScoped(!1,78),this.updateHUD()}update(t){if(t=Math.min(t,.05),this.currentWeapon.auto&&this.isMouseDown&&this.tryShoot(),this.fireTimer>0&&(this.fireTimer-=t),this.sparkPool)for(let o=0;o<this.sparkPoolSize;o++){const l=this.sparkPool[o];l.timer>0&&(l.timer-=t,l.timer<=0&&(l.mesh.visible=!1))}if(this.flashTimer>0&&(this.flashTimer-=t,this.flashTimer<=0&&(this.muzzleFlash.visible=!1)),this.isReloading){this.reloadProgress+=t/this.currentWeapon.reloadTime;const o=document.getElementById("reload-progress");o&&(o.style.width=`${Math.min(100,this.reloadProgress*100)}%`),this.reloadProgress>=1&&this.finishReload()}this.equipAnimProgress<1&&(this.equipAnimProgress=Math.min(1,this.equipAnimProgress+t*4.5));const e=Math.hypot(this.player.velocity.x,this.player.velocity.z);this.player.isGrounded&&e>.1?this.bobTime+=t*(this.player.isCrouching?8:14):this.bobTime+=t*1.5;const n=Math.sin(this.bobTime)*(e>.5?.012:.002),i=Math.abs(Math.cos(this.bobTime))*(e>.5?.014:.003);this.recoilOffset.lerp(new T(0,0,0),12*t),this.recoilRot.x=he.lerp(this.recoilRot.x,0,14*t),this.recoilRot.y=he.lerp(this.recoilRot.y,0,14*t),this.swayX=he.lerp(this.swayX,0,8*t),this.swayY=he.lerp(this.swayY,0,8*t);const r=this.isReloading?Math.sin(this.reloadProgress*Math.PI)*.15:0,a=(1-this.equipAnimProgress)*.25;this.currentPos.x=this.restPos.x+n+this.swayX+this.recoilOffset.x,this.currentPos.y=this.restPos.y+i+this.swayY+this.recoilOffset.y-r-a,this.currentPos.z=this.restPos.z+this.recoilOffset.z,this.viewmodelHolder.position.copy(this.currentPos),this.viewmodelHolder.rotation.x=this.restRot.x+this.recoilRot.x+this.swayY,this.viewmodelHolder.rotation.y=this.restRot.y+this.recoilRot.y+this.swayX,this.updateCrosshairSpread(e)}updateCrosshairSpread(t){const e=document.getElementById("ch-top"),n=document.getElementById("ch-bottom"),i=document.getElementById("ch-left"),r=document.getElementById("ch-right");if(!e)return;const a=8+t*2.2+this.recoilOffset.z*160;e.style.transform=`translateY(-${a}px)`,n.style.transform=`translateY(${a}px)`,i.style.transform=`translateX(-${a}px)`,r.style.transform=`translateX(${a}px)`}updateHUD(){const t=document.getElementById("hud-ammo"),e=document.getElementById("hud-reserve"),n=document.getElementById("hud-weapon");this.currentWeapon.isMelee?(t&&(t.textContent="—"),e&&(e.textContent="—")):(t&&(t.textContent=this.currentWeapon.mag),e&&(e.textContent=this.currentWeapon.reserve)),n&&(n.textContent=this.currentWeapon.name),document.querySelectorAll(".rack-slot").forEach(r=>{const a=parseInt(r.getAttribute("data-slot"),10);r.classList.toggle("active",a===this.currentSlot)})}}class Ho{constructor(t,e,n,i){this.scene=t,this.map=e,this.player=n,this.sound=i,this.health=100,this.armor=100,this.isDead=!1,this.state="PATROL",this.position=new T().copy(this.map.botSpawn),this.velocity=new T,this.yaw=Math.PI,this.pitch=0,this.walkSpeed=4.4,this.sprintSpeed=5.2,this.strafeSpeed=3.6,this.aimSpeed=5.2,this.targetLean=0,this.currentLean=0,this.maxLeanOffset=.42,this.maxLeanRoll=he.degToRad(14),this.leanTimer=0,this.leanDecisionTimer=0,this.isCrouching=!1,this.crouchTimer=0,this.hasLineOfSight=!1,this.reactionTimer=0,this.reactionDelay=.24,this.lostSightTimer=0,this.lastSeenPos=null,this.lastSeenVelocity=new T,this.investigatePos=null,this.fireCooldown=0,this.burstCount=0,this.burstMax=3,this.burstCadence=.11,this.strafeDir=1,this.strafeTimer=0,this.retreatTimer=0,this.coverCheckTimer=0;const r=this.map.upperLevelY||1.6;this.routes={westFlank:[new T(-6.475,r,-11),new T(-7.2,r,-3),new T(-7.2,r,3),new T(-6.475,r,11),new T(0,r,19.5)],eastFlank:[new T(6.475,r,-11),new T(7.2,r,-3),new T(7.2,r,3),new T(6.475,r,11),new T(0,r,19.5)],centerPit:[new T(0,r,-7.5),new T(-1.8,0,-2.5),new T(1.8,0,2.5),new T(0,r,7.5),new T(0,r,19.5)]},this.activeRoute=this.routes.westFlank,this.currentWaypointIndex=0,this.pauseAtWaypointTimer=0,this.radius=.38,this.height=1.7,this.boundingBox=new mn,this.hitMeshes=[],this.headMesh=null,this.flashTimer=0,this.root=this.buildBeanModel(),this.scene.add(this.root),this.raycaster=new Di,this.losTimer=0,this.tracerPoolSize=6,this.tracerIndex=0,this.tracerPool=[];const a=new Ml({color:16770688,transparent:!0,opacity:.85});for(let o=0;o<this.tracerPoolSize;o++){const l=new be,c=new Float32Array(6);l.setAttribute("position",new Ye(c,3));const h=new Zp(l,a);h.visible=!1,this.scene.add(h),this.tracerPool.push({line:h,timer:0})}this.sparkPoolSize=8,this.sparkIndex=0,this.sparkGeo=new Ee(.04,4,4),this.sparkMat=new An({color:16770688}),this.sparkPool=[];for(let o=0;o<this.sparkPoolSize;o++){const l=new P(this.sparkGeo,this.sparkMat);l.visible=!1,this.scene.add(l),this.sparkPool.push({mesh:l,timer:0})}this.onDeath=null,this.updateAABB()}buildBeanModel(){const t=new jt,e=new Ct({color:14232363,roughness:.45,metalness:.15}),n=new Ct({color:1315862,roughness:.2,metalness:.8});new Ct({color:2040614,metalness:.85,roughness:.35}),this.crouchGroup=new jt,t.add(this.crouchGroup);const i=new Ds(.32,.65,8,16);this.beanMesh=new P(i,e),this.beanMesh.position.y=.65,this.beanMesh.castShadow=!0,this.beanMesh.receiveShadow=!0,this.crouchGroup.add(this.beanMesh),this.hitMeshes.push(this.beanMesh),this.leanGroup=new jt,this.crouchGroup.add(this.leanGroup);const r=new jt;r.position.set(0,1.34,0);const a=new Ee(.24,16,16),o=new P(a,e);o.userData.isHead=!0,o.castShadow=!0,r.add(o),this.hitMeshes.push(o);const l=new H(.22,.08,.12),c=new P(l,n);c.position.set(0,.02,.16),c.userData.isHead=!0,r.add(c),this.hitMeshes.push(c),this.leanGroup.add(r),this.headMesh=r;const h=Cl();return this.muzzleFlash=this.createMuzzleFlash(),this.muzzleFlash.position.set(0,.02,-.5),h.add(this.muzzleFlash),h.position.set(.28,.78,.28),h.rotation.x=-.1,this.leanGroup.add(h),this.botGun=h,t.position.copy(this.position),t}createMuzzleFlash(){const t=new jt;t.visible=!1;const e=new Wi(.07,0),n=new An({color:16769126});t.add(new P(e,n));const i=new Al(16755251,2,3.5);return t.add(i),t}getHitMeshes(){return this.hitMeshes}onPlayerGunfire(t){if(!(this.isDead||!t)&&(this.investigatePos=t.clone(),this.state!=="COMBAT")){this.state="INVESTIGATE";const e=this.investigatePos.clone().sub(this.position);e.y=0,this.yaw=Math.atan2(-e.x,-e.z)}}onPlayerFootstep(t,e){if(this.isDead||e||!t)return;this.position.distanceTo(t)<17&&(this.investigatePos=t.clone(),this.state==="PATROL"&&(this.state="INVESTIGATE"))}update(t){if(!this.isDead){switch(t=Math.min(t,.05),this.evaluateTacticalLeaning(t),this.updateLeaningTransform(t),this.losTimer-=t,this.losTimer<=0&&(this.losTimer=.05,this.checkLineOfSight()),this.hasLineOfSight&&!this.player.isDead?(this.state!=="COMBAT"&&this.state!=="RETREAT"&&(this.state="COMBAT",this.reactionTimer=this.reactionDelay),this.lastSeenPos=this.player.position.clone(),this.lastSeenVelocity.copy(this.player.velocity),this.lostSightTimer=0):this.state==="COMBAT"&&(this.lostSightTimer+=t,this.lostSightTimer>3&&(this.state="INVESTIGATE",this.lastSeenPos&&(this.investigatePos=this.lastSeenPos.clone()))),this.state){case"PATROL":this.updatePatrol(t);break;case"INVESTIGATE":this.updateInvestigate(t);break;case"COMBAT":this.updateCombat(t);break;case"RETREAT":this.updateRetreat(t);break}if(this.botGun&&this.player&&!this.player.isDead){const e=this.getMuzzlePosition(),n=this.player.position.y+(this.player.currentEyeHeight||1.62)*.7-e.y,i=Math.hypot(this.player.position.x-e.x,this.player.position.z-e.z),r=-Math.atan2(n,Math.max(i,1));this.botGun.rotation.x=he.lerp(this.botGun.rotation.x,r,8*t)}if(this.fireCooldown>0&&(this.fireCooldown-=t),this.reactionTimer>0&&(this.reactionTimer-=t),this.flashTimer>0&&(this.flashTimer-=t,this.flashTimer<=0&&this.muzzleFlash&&(this.muzzleFlash.visible=!1)),this.tracerPool)for(let e=0;e<this.tracerPoolSize;e++){const n=this.tracerPool[e];n.timer>0&&(n.timer-=t,n.timer<=0&&(n.line.visible=!1))}if(this.sparkPool)for(let e=0;e<this.sparkPoolSize;e++){const n=this.sparkPool[e];n.timer>0&&(n.timer-=t,n.timer<=0&&(n.mesh.visible=!1))}this.resolveMovement(t),this.updateAABB(),this.root.position.copy(this.position),this.root.rotation.y=this.yaw}}getCenterEyePosition(){const t=this.isCrouching?.95:1.35;return this.position.clone().add(new T(0,t,0))}getLeanedEyePosition(t){const e=this.isCrouching?.95:1.35,n=this.position.clone().add(new T(0,e,0)),i=new T(Math.cos(this.yaw),0,-Math.sin(this.yaw));return n.add(i.multiplyScalar(t*this.maxLeanOffset)),n}getEyePosition(){const t=this.isCrouching?.95:1.35,e=this.position.clone().add(new T(0,t,0)),n=new T(Math.cos(this.yaw),0,-Math.sin(this.yaw));return e.add(n.multiplyScalar(this.currentLean*this.maxLeanOffset)),e}getMuzzlePosition(){const t=this.isCrouching?.72:1.05,e=this.position.clone().add(new T(0,t,0)),n=new T(-Math.sin(this.yaw),0,-Math.cos(this.yaw)),i=new T(Math.cos(this.yaw),0,-Math.sin(this.yaw));return e.add(n.multiplyScalar(.45)),e.add(i.multiplyScalar(.25+this.currentLean*this.maxLeanOffset)),e}checkLineOfSight(){if(this.player.isDead){this.hasLineOfSight=!1;return}const t=this.getEyePosition(),e=this.player.position.clone().add(new T(0,this.player.currentEyeHeight||1.62,0)),n=this.player.position.clone().add(new T(0,(this.player.currentEyeHeight||1.62)*.65,0)),i=t.distanceTo(e);if(i>65){this.hasLineOfSight=!1;return}const r=this.map.occluderMeshes&&this.map.occluderMeshes.length>0?this.map.occluderMeshes:this.map.colliderMeshes,a=e.clone().sub(t).normalize();this.raycaster.set(t,a),this.raycaster.near=.15,this.raycaster.far=i;const o=this.raycaster.intersectObjects(r,!1);if(o.length===0||o[0].distance>=i-.25){this.hasLineOfSight=!0;return}const l=t.distanceTo(n),c=n.clone().sub(t).normalize();this.raycaster.set(t,c),this.raycaster.near=.15,this.raycaster.far=l;const h=this.raycaster.intersectObjects(r,!1);this.hasLineOfSight=h.length===0||h[0].distance>=l-.25}evaluateTacticalLeaning(t){if(this.leanDecisionTimer-=t,this.leanDecisionTimer>0)return;if(this.leanDecisionTimer=.1,this.player.isDead){this.targetLean=0;return}const e=this.getCenterEyePosition(),n=this.player.position.clone().add(new T(0,this.player.currentEyeHeight||1.62,0)),i=this.player.position.clone().add(new T(0,(this.player.currentEyeHeight||1.62)*.65,0)),r=e.distanceTo(n);if(r>55){this.targetLean=0;return}const a=n.clone().sub(e).normalize();if(this.state==="PATROL"&&new T(-Math.sin(this.yaw),0,-Math.cos(this.yaw)).dot(a)<.2){this.targetLean=0;return}const o=this.map.occluderMeshes&&this.map.occluderMeshes.length>0?this.map.occluderMeshes:this.map.colliderMeshes;this.raycaster.set(e,a),this.raycaster.near=.15,this.raycaster.far=r;const l=this.raycaster.intersectObjects(o,!1);if(!(l.length>0&&l[0].distance<r-.25&&l[0].distance<5.5)){this.targetLean=0;return}const u=m=>{const d=m.distanceTo(n),x=n.clone().sub(m).normalize();this.raycaster.set(m,x),this.raycaster.near=.15,this.raycaster.far=d;const S=this.raycaster.intersectObjects(o,!1);if(S.length===0||S[0].distance>=d-.25)return!0;const v=m.distanceTo(i),D=i.clone().sub(m).normalize();this.raycaster.set(m,D),this.raycaster.near=.15,this.raycaster.far=v;const b=this.raycaster.intersectObjects(o,!1);return b.length===0||b[0].distance>=v-.25},f=this.getLeanedEyePosition(-1),p=this.getLeanedEyePosition(1),g=u(f),_=u(p);g&&!_?this.targetLean=-1:_&&!g?this.targetLean=1:g&&_?this.targetLean!==-1&&this.targetLean!==1&&(this.targetLean=1):this.targetLean=0}updateLeaningTransform(t){if(this.currentLean=he.lerp(this.currentLean,this.targetLean,10*t),this.leanGroup&&(this.leanGroup.position.x=this.currentLean*this.maxLeanOffset,this.leanGroup.rotation.z=-this.currentLean*this.maxLeanRoll),this.beanMesh&&(this.beanMesh.rotation.z=-this.currentLean*.08,this.beanMesh.position.x=this.currentLean*.12),this.crouchGroup){const e=this.isCrouching?-.36:0;this.crouchGroup.position.y=he.lerp(this.crouchGroup.position.y,e,10*t)}}updatePatrol(t){if(this.isCrouching=!1,this.pauseAtWaypointTimer>0){this.pauseAtWaypointTimer-=t,this.velocity.set(0,0,0);return}const n=this.activeRoute[this.currentWaypointIndex].clone().sub(this.position);if(n.y=0,n.length()<1.4){if(this.currentWaypointIndex++,this.currentWaypointIndex>=this.activeRoute.length){const r=Object.keys(this.routes),a=r[Math.floor(Math.random()*r.length)];this.activeRoute=this.routes[a],this.currentWaypointIndex=0}Math.random()<.4&&(this.pauseAtWaypointTimer=1.2+Math.random()*.8)}else{n.normalize();const r=Math.atan2(-n.x,-n.z);this.yaw=he.lerp(this.yaw,r,4.5*t),this.velocity.x=n.x*this.walkSpeed,this.velocity.z=n.z*this.walkSpeed}}updateInvestigate(t){this.isCrouching=!1;const e=this.investigatePos||this.lastSeenPos;if(!e){this.state="PATROL";return}const n=e.clone().sub(this.position);if(n.y=0,n.length()<1.8)this.investigatePos=null,this.lastSeenPos=null,this.state="PATROL";else{n.normalize();const r=Math.atan2(-n.x,-n.z);this.yaw=he.lerp(this.yaw,r,6*t),this.velocity.x=n.x*this.sprintSpeed,this.velocity.z=n.z*this.sprintSpeed}}updateCombat(t){const e=this.player.position.clone().sub(this.position),n=e.length();e.y=0,e.normalize();const i=Math.atan2(-e.x,-e.z);if(this.yaw=he.lerp(this.yaw,i,this.aimSpeed*t),this.health<35&&n>8){this.state="RETREAT",this.retreatTimer=2.4;return}this.strafeTimer-=t,this.strafeTimer<=0&&(this.strafeDir*=-1,this.strafeTimer=.7+Math.random()*.8,this.isCrouching=Math.random()<.35);const r=new T(Math.cos(this.yaw),0,-Math.sin(this.yaw)),a=new T(-Math.sin(this.yaw),0,-Math.cos(this.yaw));let o=0;if(n>22?o=.7:n<6&&(o=-.8),this.targetLean!==0)this.velocity.x=0,this.velocity.z=0;else{const l=this.isCrouching?this.strafeSpeed*.5:this.strafeSpeed;this.velocity.x=r.x*(l*this.strafeDir)+a.x*(this.walkSpeed*o),this.velocity.z=r.z*(l*this.strafeDir)+a.z*(this.walkSpeed*o)}this.fireCooldown<=0&&this.reactionTimer<=0&&Math.abs(this.yaw-i)<.45&&this.hasLineOfSight&&this.fireBurst()}updateRetreat(t){if(this.retreatTimer-=t,this.isCrouching=!1,this.retreatTimer<=0||!this.lastSeenPos){this.state="COMBAT";return}const e=this.position.clone().sub(this.lastSeenPos);e.y=0,e.normalize();const n=Math.atan2(-e.x,-e.z);this.yaw=he.lerp(this.yaw,n,5*t),this.velocity.x=e.x*this.sprintSpeed,this.velocity.z=e.z*this.sprintSpeed}fireBurst(){this.sound.playGunshot("ak47"),this.muzzleFlash&&(this.muzzleFlash.visible=!0,this.flashTimer=.05);const t=this.getMuzzlePosition(),e=this.player.position.clone().add(new T(0,this.player.currentEyeHeight||1.62,0)),n=new T(Math.cos(this.player.yaw||0),0,-Math.sin(this.player.yaw||0)).multiplyScalar((this.player.currentLean||0)*(this.player.maxLeanOffset||.44));e.add(n);const i=this.player.position.clone().add(new T(0,(this.player.currentEyeHeight||1.62)*.65,0)),r=t.distanceTo(e),a=e.clone().sub(t).normalize(),l=new Di(t,a,.1,r).intersectObjects(this.map.colliderMeshes,!1),c=l.length===0||l[0].distance>=r-.25,h=t.distanceTo(i),u=i.clone().sub(t).normalize(),p=new Di(t,u,.1,h).intersectObjects(this.map.colliderMeshes,!1),g=p.length===0||p[0].distance>=h-.25,_=Math.random()<.75;let m;if(_&&(c||g)){let R=!1;c&&!g?R=!0:c&&g&&(R=Math.random()<.22),R?m=e.clone().add(new T((Math.random()-.5)*.16,(Math.random()-.5)*.16,(Math.random()-.5)*.16)):m=i.clone().add(new T((Math.random()-.5)*.2,(Math.random()-.5)*.2,(Math.random()-.5)*.2))}else{const R=c?e:i,C=R.clone().sub(t).normalize(),E=new T(-C.z,0,C.x).normalize(),M=Math.random()<.5?1:-1,L=.55+Math.random()*.3;m=R.clone().add(E.multiplyScalar(M*L)),m.y+=(Math.random()-.5)*.35}const d=m.clone().sub(t).normalize(),S=new Di(t,d,.1,100).intersectObjects(this.map.colliderMeshes,!1),v=S.length>0?S[0].distance:1/0,D=this.checkBulletHitPlayer(t,d,this.player);let b=t.clone().add(d.clone().multiplyScalar(Math.min(v,40)));if(D.hit&&D.distance<v){b=D.hitPoint;const R=D.isHeadshot?52:16+Math.floor(Math.random()*8);this.player.takeDamage(R,this.position)}else{S.length>0&&(b=S[0].point,this.spawnImpactSparks(S[0].point));const C=e.clone().sub(t).dot(d);C>0&&t.clone().add(d.clone().multiplyScalar(C)).distanceTo(e)<1.6&&this.sound&&this.sound.playBulletWhiz&&this.sound.playBulletWhiz()}this.spawnTracer(t,b),this.burstCount++,this.burstCount>=this.burstMax?(this.burstCount=0,this.fireCooldown=.5+Math.random()*.3):this.fireCooldown=this.burstCadence}checkBulletHitPlayer(t,e,n){if(n.isDead)return{hit:!1};const i=new T(Math.cos(n.yaw||0),0,-Math.sin(n.yaw||0)).multiplyScalar((n.currentLean||0)*(n.maxLeanOffset||.44)),r=n.position.clone().add(new T(0,n.currentEyeHeight||1.62,0)).add(i),a=.25,l=r.clone().sub(t).dot(e);if(l>0){const v=t.clone().add(e.clone().multiplyScalar(l));if(v.distanceTo(r)<=a)return{hit:!0,isHeadshot:!0,hitPoint:v,distance:l}}const c=n.position.clone();c.y+=.15;const h=n.position.clone();h.y+=Math.max(.4,(n.currentHeight||1.8)-.2);const u=n.radius||.38,f=h.clone().sub(c),p=f.length(),g=f.clone().normalize(),_=t.clone().sub(c),m=e.dot(e)-Math.pow(e.dot(g),2),d=2*(e.dot(_)-e.dot(g)*_.dot(g)),x=_.dot(_)-Math.pow(_.dot(g),2)-u*u,S=d*d-4*m*x;if(S>=0){const v=(-d-Math.sqrt(S))/(2*m);if(v>0){const D=t.clone().add(e.clone().multiplyScalar(v)),b=D.clone().sub(c).dot(g);if(b>=0&&b<=p)return{hit:!0,isHeadshot:!1,hitPoint:D,distance:v}}}return{hit:!1}}spawnTracer(t,e){if(!this.tracerPool||this.tracerPool.length===0)return;const n=this.tracerPool[this.tracerIndex];this.tracerIndex=(this.tracerIndex+1)%this.tracerPoolSize;const i=n.line.geometry.attributes.position.array;i[0]=t.x,i[1]=t.y,i[2]=t.z,i[3]=e.x,i[4]=e.y,i[5]=e.z,n.line.geometry.attributes.position.needsUpdate=!0,n.line.visible=!0,n.timer=.05}spawnImpactSparks(t){if(!this.sparkPool||this.sparkPool.length===0)return;const e=this.sparkPool[this.sparkIndex];this.sparkIndex=(this.sparkIndex+1)%this.sparkPoolSize,e.mesh.position.copy(t),e.mesh.visible=!0,e.timer=.07}resolveMovement(t){const e=this.radius,n=.4,i=this.height,r=this.velocity.x*t;if(Math.abs(r)>1e-5){let f=this.position.x+r;const p=this.position.z-e*.85,g=this.position.z+e*.85,_=this.position.y,m=_+i;for(let d=0;d<this.map.colliders.length;d++){const x=this.map.colliders[d];x.max.y<=_+n||x.min.y>=m-.05||x.max.z<=p||x.min.z>=g||(r>0?this.position.x+e<=x.min.x+.1&&f+e>x.min.x&&(f=x.min.x-e,this.strafeDir*=-1):r<0&&this.position.x-e>=x.max.x-.1&&f-e<x.max.x&&(f=x.max.x+e,this.strafeDir*=-1))}this.position.x=f}const a=this.velocity.z*t;if(Math.abs(a)>1e-5){let f=this.position.z+a;const p=this.position.x-e*.85,g=this.position.x+e*.85,_=this.position.y,m=_+i;for(let d=0;d<this.map.colliders.length;d++){const x=this.map.colliders[d];x.max.y<=_+n||x.min.y>=m-.05||x.max.x<=p||x.min.x>=g||(a>0?this.position.z+e<=x.min.z+.1&&f+e>x.min.z&&(f=x.min.z-e,this.strafeDir*=-1):a<0&&this.position.z-e>=x.max.z-.1&&f-e<x.max.z&&(f=x.max.z+e,this.strafeDir*=-1))}this.position.z=f}let o=0;const l=this.position.x-e*.75,c=this.position.x+e*.75,h=this.position.z-e*.75,u=this.position.z+e*.75;for(let f=0;f<this.map.colliders.length;f++){const p=this.map.colliders[f];p.max.x>l&&p.min.x<c&&p.max.z>h&&p.min.z<u&&p.max.y<=this.position.y+n+.1&&p.max.y>o&&(o=p.max.y)}this.position.y=o,this.position.x=Math.max(-25,Math.min(25,this.position.x)),this.position.z=Math.max(-25,Math.min(25,this.position.z))}updateAABB(){this.boundingBox.min.set(this.position.x-this.radius,this.position.y,this.position.z-this.radius),this.boundingBox.max.set(this.position.x+this.radius,this.position.y+this.height,this.position.z+this.radius)}takeDamage(t,e=null,n=!1){if(!this.isDead){if(this.armor>0&&(this.armor>=t?(this.armor-=t,t=0):(t-=this.armor,this.armor=0)),t>0&&(this.health=Math.max(0,this.health-t)),e){this.lastSeenPos=e.clone(),this.state="COMBAT";const i=e.clone().sub(this.position);i.y=0,this.yaw=Math.atan2(-i.x,-i.z)}this.root.position.y+=.08,setTimeout(()=>{this.isDead||(this.root.position.y=this.position.y)},60),this.health<=0&&this.die(n)}}die(t=!1){this.isDead=!0,this.velocity.set(0,0,0),this.root.rotation.z=Math.PI/2,this.root.position.y=this.position.y+.3,this.onDeath&&this.onDeath(t)}respawn(){this.position.copy(this.map.botSpawn),this.velocity.set(0,0,0),this.health=100,this.armor=100,this.isDead=!1,this.state="PATROL",this.lastSeenPos=null,this.investigatePos=null,this.hasLineOfSight=!1,this.targetLean=0,this.currentLean=0,this.isCrouching=!1,this.yaw=Math.PI,this.root.rotation.set(0,this.yaw,0),this.root.position.copy(this.position),this.updateAABB()}}const $e={ak47:`<svg viewBox="0 0 76 22" fill="currentColor" class="kill-weapon-svg" aria-label="AK-47">
    <path d="M2 13 L12 10.5 L20 10.5 L21 12 L19 17.5 L16 17.5 L14 14 L5 15 Z"/>
    <path d="M20 10.5 L40 10.5 L40 14.5 L21 14.5 Z"/>
    <path d="M22 14.5 L20.5 20.5 L23.5 21 L25.5 14.5 Z"/>
    <path d="M26 15 C26 17 28.5 17 29 15 Z"/>
    <path d="M30 14.5 C31.5 17.5 34 20 37.5 21 L39.5 20 C36.5 17.5 34.5 15.5 34 14.5 Z"/>
    <path d="M40 9.8 L56 9.8 L56 13.8 L40 13.8 Z"/>
    <path d="M56 11.2 L71 11.2 L71 12.6 L56 12.6 Z"/>
    <path d="M68 7.5 L70 7.5 L70 11.2 L68 11.2 Z"/>
    <path d="M71 10.5 L73 10.5 L73 13 L71 13 Z"/>
  </svg>`,awp:`<svg viewBox="0 0 76 22" fill="currentColor" class="kill-weapon-svg" aria-label="AWP">
    <path d="M2 12.5 L6 10 L19 10 L22 12 L22 15 L17 17 L11 17 L8 14.5 L2 14 Z"/>
    <path d="M24 4.5 L45 4.5 L47 3.5 L48 3.5 L48 7 L47 7 L45 6 L24 6 L22 7 L21 7 L21 3.5 L22 3.5 Z"/>
    <rect x="27" y="6" width="3" height="4"/>
    <rect x="39" y="6" width="3" height="4"/>
    <path d="M22 10 L44 10 L44 14.5 L22 14.5 Z"/>
    <path d="M31 14.5 L31 18 L36 18 L36 14.5 Z"/>
    <path d="M44 10.5 L56 10.5 L56 14 L44 14 Z"/>
    <path d="M56 11.3 L70 11.3 L70 12.7 L56 12.7 Z"/>
    <path d="M70 9.8 L75 9.8 L75 14.2 L70 14.2 Z"/>
  </svg>`,shotgun:`<svg viewBox="0 0 76 22" fill="currentColor" class="kill-weapon-svg" aria-label="Shotgun">
    <path d="M2 13.5 L12 11 L22 11 L22 14.5 L18 18 L14 18 L11 15 L4 15.5 Z"/>
    <path d="M22 10 L38 10 L38 15 L22 15 Z"/>
    <path d="M23 15 C23 17.5 26.5 17.5 27 15 Z"/>
    <path d="M38 10.5 L72 10.5 L72 12.3 L38 12.3 Z"/>
    <path d="M38 12.5 L67 12.5 L67 14.2 L38 14.2 Z"/>
    <rect x="44" y="12.2" width="12" height="4" rx="1"/>
    <rect x="70" y="9.5" width="2" height="1.2"/>
  </svg>`,pistol:`<svg viewBox="0 0 54 22" fill="currentColor" class="kill-weapon-svg" aria-label="Pistol">
    <path d="M8 7 L46 7 L46 12 L8 12 Z"/>
    <rect x="9" y="5.2" width="2.5" height="2"/>
    <rect x="43" y="5.5" width="2" height="1.8"/>
    <path d="M8 12 L6 13.5 L11 20 L18 20.5 L20 12 Z"/>
    <path d="M20 12 L20 16.5 C20 17 24 17 25 14 L25 12 Z"/>
    <path d="M22 13 Q21 14.5 23 15" stroke="currentColor" stroke-width="1.2" fill="none"/>
  </svg>`,deagle:`<svg viewBox="0 0 60 22" fill="currentColor" class="kill-weapon-svg" aria-label="Desert Eagle">
    <path d="M8 6 L26 6 L28 7.5 L52 7.5 L52 13 L8 13 Z"/>
    <rect x="9" y="4" width="3" height="2.2"/>
    <rect x="49" y="5.5" width="2.5" height="2.2"/>
    <path d="M6 7.5 L8 7.5 L8 10 L5 10 Z"/>
    <path d="M8 13 L7 15 L11 21 L19 21.5 L21 13 Z"/>
    <path d="M21 13 L21 17 C21 18.2 27 18.2 28 14.5 L28 13 Z"/>
    <path d="M30 13 L52 13 L47 15 L30 15 Z"/>
  </svg>`,revolver:`<svg viewBox="0 0 60 22" fill="currentColor" class="kill-weapon-svg" aria-label="Revolver">
    <rect x="23" y="8" width="10" height="7.5" rx="1.5"/>
    <path d="M33 8 L54 8 L54 13.5 L33 13.5 Z"/>
    <rect x="51" y="6" width="2.5" height="2.2"/>
    <path d="M17 9 L23 9 L23 15 L18 15 Z"/>
    <path d="M15 7 L18 7 L18 9 L15 9 Z"/>
    <path d="M18 15 C16 16.5 13 18 13 21 C14 21.8 18 21.8 20 20 C21 18.5 21.5 16.5 21.5 15 Z"/>
    <path d="M23 15 C23 18.5 28.5 18.5 29 15 Z"/>
  </svg>`,knife:`<svg viewBox="0 0 60 20" fill="currentColor" class="kill-weapon-svg" aria-label="Tactical Knife">
    <path d="M4 10 C4 8.5 7 8 10 8 L24 8 L24 14 L10 14 C7 14 4 12.5 4 10 Z"/>
    <rect x="24" y="6" width="3" height="10" rx="0.5"/>
    <path d="M27 8.5 L46 8.5 C49 9.5 53 11 56 12 C51 13.5 45 14.5 38 14.5 L27 14 Z"/>
  </svg>`};function Fm(s){if(!s)return $e.ak47;const t=String(s).toLowerCase().replace(/[^a-z0-9]/g,"");return t.includes("awp")||t.includes("sniper")?$e.awp:t.includes("ak")||t.includes("rifle")?$e.ak47:t.includes("shotgun")||t.includes("pump")?$e.shotgun:t.includes("deagle")||t.includes("deserteagle")||t.includes("eagle")?$e.deagle:t.includes("revolver")?$e.revolver:t.includes("knife")||t.includes("melee")||t.includes("blade")?$e.knife:t.includes("pistol")?$e.pistol:$e[t]?$e[t]:`<span class="kill-weapon-text">${s}</span>`}class Om{constructor(){this.scorePlayerEl=document.getElementById("score-player"),this.scoreEnemyEl=document.getElementById("score-enemy"),this.timerEl=document.getElementById("match-timer"),this.modeTagEl=document.getElementById("mode-tag"),this.killfeedEl=document.getElementById("killfeed"),this.chTop=document.getElementById("ch-top"),this.chBottom=document.getElementById("ch-bottom"),this.chLeft=document.getElementById("ch-left"),this.chRight=document.getElementById("ch-right"),this.healthEl=document.getElementById("hud-health"),this.healthBarEl=document.getElementById("health-bar"),this.armorEl=document.getElementById("hud-armor"),this.armorBarEl=document.getElementById("armor-bar"),this.velocityEl=document.getElementById("hud-velocity"),this.velocityWrapEl=document.getElementById("hud-velocity-wrap"),this.stanceEl=document.getElementById("hud-stance"),this.leanL=document.getElementById("lean-l"),this.leanC=document.getElementById("lean-c"),this.leanR=document.getElementById("lean-r"),this.ammoCurEl=document.getElementById("hud-ammo"),this.ammoResEl=document.getElementById("hud-reserve"),this.weaponNameEl=document.getElementById("hud-weapon"),this.reloadTrack=document.getElementById("reload-track"),this.reloadProgress=document.getElementById("reload-progress"),this.hudLayer=document.getElementById("hud-layer"),this.mainMenu=document.getElementById("main-menu"),this.pauseMenu=document.getElementById("pause-menu"),this.gameOverModal=document.getElementById("game-over-modal"),this.gameOverTitle=document.getElementById("game-over-title"),this.gameOverSub=document.getElementById("game-over-subtitle"),this.rematchBox=document.getElementById("game-over-rematch-box"),this.rematchText=document.getElementById("game-over-rematch-text"),this.btnPlayAgain=document.getElementById("btn-play-again"),this.weaponSelectModal=document.getElementById("weapon-select-modal"),this.btnLockLoadout=document.getElementById("btn-lock-loadout"),this.wsStatusText=document.getElementById("ws-status-text"),this.wsStatusDot=document.getElementById("ws-status-dot"),this.primaryCards=document.querySelectorAll('.ws-weapon-card[data-slot="primary"]'),this.secondaryCards=document.querySelectorAll('.ws-weapon-card[data-slot="secondary"]'),this.selectedPrimary="ak47",this.selectedSecondary="pistol",this.onLockInCallback=null,this.optionsModal=document.getElementById("options-modal"),this.btnOptions=document.getElementById("btn-options"),this.btnPauseOptions=document.getElementById("btn-pause-options"),this.btnOptionsClose=document.getElementById("btn-options-close"),this.btnOptionsReset=document.getElementById("btn-options-reset"),this.sliderSensitivity=document.getElementById("slider-sensitivity"),this.numSensitivity=document.getElementById("num-sensitivity"),this.valSensitivity=document.getElementById("val-sensitivity"),this.sliderSmoothing=document.getElementById("slider-smoothing"),this.numSmoothing=document.getElementById("num-smoothing"),this.valSmoothing=document.getElementById("val-smoothing"),this.sliderScopedSens=document.getElementById("slider-scoped-sens"),this.numScopedSens=document.getElementById("num-scoped-sens"),this.valScopedSens=document.getElementById("val-scoped-sens"),this.checkInvertY=document.getElementById("check-invert-y"),this.optionsReturnTo="main",this.fpsCounterEl=document.getElementById("fps-counter"),this.fpsValEl=document.getElementById("fps-val"),this.fpsMsEl=document.getElementById("fps-ms"),this.fpsDotEl=document.getElementById("fps-dot"),this.presetButtons=document.querySelectorAll(".btn-preset"),this.valGraphics=document.getElementById("val-graphics"),this.checkShowFps=document.getElementById("check-show-fps"),this._lastTimerStr="",this._lastSpeedStr="",this._lastStance="",this._lastLeanState=null,this._lastFps=-1,this._lastFpsState="",this.playerScore=0,this.enemyScore=0,this.setupWeaponSelectListeners(),this.setupOptionsListeners()}showHUD(t){if(this.hudLayer&&(this.hudLayer.style.display=t?"block":"none"),this.fpsCounterEl){const e=Me.get().showFps;this.fpsCounterEl.style.display=t&&e?"flex":"none"}}showMainMenu(t){this.mainMenu&&(this.mainMenu.style.display=t?"flex":"none")}showPauseMenu(t){this.pauseMenu&&(this.pauseMenu.style.display=t?"flex":"none")}showOptionsModal(t,e="main"){if(this.optionsModal)if(t)this.optionsReturnTo=e,e==="main"?this.showMainMenu(!1):e==="pause"&&this.showPauseMenu(!1),this.optionsModal.style.display="flex",this.syncOptionsUI(Me.get());else{const n=this.optionsModal.style.display==="flex";this.optionsModal.style.display="none",n&&(this.optionsReturnTo==="pause"?this.showPauseMenu(!0):this.optionsReturnTo==="main"&&this.showMainMenu(!0))}}hideOptionsModal(){this.optionsModal&&(this.optionsModal.style.display="none")}isOptionsOpen(){return!!(this.optionsModal&&this.optionsModal.style.display==="flex")}isPauseMenuOpen(){return!!(this.pauseMenu&&this.pauseMenu.style.display==="flex")}setupOptionsListeners(){this.optionsModal&&(this.btnOptions&&this.btnOptions.addEventListener("click",()=>{this.showOptionsModal(!0,"main")}),this.btnPauseOptions&&this.btnPauseOptions.addEventListener("click",()=>{this.showOptionsModal(!0,"pause")}),this.btnOptionsClose&&this.btnOptionsClose.addEventListener("click",()=>{this.showOptionsModal(!1)}),this.btnOptionsReset&&this.btnOptionsReset.addEventListener("click",()=>{const t=Me.reset();this.syncOptionsUI(t)}),this.sliderSensitivity&&this.numSensitivity&&(this.sliderSensitivity.addEventListener("input",t=>{const e=parseFloat(t.target.value);this.numSensitivity.value=e.toFixed(2),this.valSensitivity&&(this.valSensitivity.textContent=e.toFixed(2)),Me.set({sensitivity:e})}),this.numSensitivity.addEventListener("change",t=>{const e=Math.max(.1,Math.min(4,parseFloat(t.target.value)||1));this.numSensitivity.value=e.toFixed(2),this.sliderSensitivity.value=e,this.valSensitivity&&(this.valSensitivity.textContent=e.toFixed(2)),Me.set({sensitivity:e})})),this.sliderSmoothing&&this.numSmoothing&&(this.sliderSmoothing.addEventListener("input",t=>{const e=parseInt(t.target.value,10);this.numSmoothing.value=e,this.valSmoothing&&(this.valSmoothing.textContent=`${e}%`),Me.set({aimSmoothing:e})}),this.numSmoothing.addEventListener("change",t=>{const e=Math.max(0,Math.min(100,parseInt(t.target.value,10)||0));this.numSmoothing.value=e,this.sliderSmoothing.value=e,this.valSmoothing&&(this.valSmoothing.textContent=`${e}%`),Me.set({aimSmoothing:e})})),this.sliderScopedSens&&this.numScopedSens&&(this.sliderScopedSens.addEventListener("input",t=>{const e=parseFloat(t.target.value);this.numScopedSens.value=e.toFixed(2),this.valScopedSens&&(this.valScopedSens.textContent=e.toFixed(2)),Me.set({scopedSensitivity:e})}),this.numScopedSens.addEventListener("change",t=>{const e=Math.max(.2,Math.min(2,parseFloat(t.target.value)||.8));this.numScopedSens.value=e.toFixed(2),this.sliderScopedSens.value=e,this.valScopedSens&&(this.valScopedSens.textContent=e.toFixed(2)),Me.set({scopedSensitivity:e})})),this.checkInvertY&&this.checkInvertY.addEventListener("change",t=>{Me.set({invertY:t.target.checked})}),this.presetButtons&&this.presetButtons.forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-quality");Me.set({graphicsQuality:e})})}),this.checkShowFps&&this.checkShowFps.addEventListener("change",t=>{Me.set({showFps:t.target.checked})}),Me.onChange(t=>{this.syncOptionsUI(t)}))}syncOptionsUI(t){if(t){if(this.sliderSensitivity&&this.numSensitivity){const e=Number(t.sensitivity)||1;this.sliderSensitivity.value=e,this.numSensitivity.value=e.toFixed(2),this.valSensitivity&&(this.valSensitivity.textContent=e.toFixed(2))}if(this.sliderSmoothing&&this.numSmoothing){const e=Number(t.aimSmoothing)||0;this.sliderSmoothing.value=e,this.numSmoothing.value=e,this.valSmoothing&&(this.valSmoothing.textContent=`${e}%`)}if(this.sliderScopedSens&&this.numScopedSens){const e=Number(t.scopedSensitivity)||.8;this.sliderScopedSens.value=e,this.numScopedSens.value=e.toFixed(2),this.valScopedSens&&(this.valScopedSens.textContent=e.toFixed(2))}if(this.checkInvertY&&(this.checkInvertY.checked=!!t.invertY),this.presetButtons&&this.presetButtons.length>0){const e=t.graphicsQuality||"medium";if(this.presetButtons.forEach(n=>{const i=n.getAttribute("data-quality");n.classList.toggle("active",i===e)}),this.valGraphics){const n={low:"Low (Max FPS)",medium:"Medium",high:"High"};this.valGraphics.textContent=n[e]||"Medium"}}if(this.checkShowFps&&(this.checkShowFps.checked=!!t.showFps),this.fpsCounterEl){const e=this.hudLayer&&this.hudLayer.style.display!=="none";this.fpsCounterEl.style.display=e&&t.showFps?"flex":"none"}}}updateFPS(t,e){if(!this.fpsCounterEl)return;const n=Math.round(t);if(n!==this._lastFps){this._lastFps=n,this.fpsValEl&&(this.fpsValEl.textContent=n);const i=n>=55?"fps-good":n>=30?"fps-warn":"fps-bad";i!==this._lastFpsState&&(this._lastFpsState=i,this.fpsCounterEl.classList.remove("fps-good","fps-warn","fps-bad"),this.fpsCounterEl.classList.add(i))}this.fpsMsEl&&(this.fpsMsEl.textContent=`${e.toFixed(1)} ms`)}setModeTag(t){this.modeTagEl&&(this.modeTagEl.textContent=t)}updateScores(t,e){this.playerScore=t,this.enemyScore=e,this.scorePlayerEl&&(this.scorePlayerEl.textContent=t),this.scoreEnemyEl&&(this.scoreEnemyEl.textContent=e)}updateTimer(t){if(!this.timerEl)return;const e=Math.floor(t/60),n=Math.floor(t%60),i=`${e.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`;i!==this._lastTimerStr&&(this._lastTimerStr=i,this.timerEl.textContent=i)}updateVitals(t,e){const n=Math.max(0,Math.round(t)),i=Math.max(0,Math.round(e));this.healthEl&&(this.healthEl.textContent=n),this.healthBarEl&&(this.healthBarEl.style.width=`${n}%`,this.healthBarEl.style.background=n<30?"var(--hud-red)":"var(--hud-green)"),this.armorEl&&(this.armorEl.textContent=i),this.armorBarEl&&(this.armorBarEl.style.width=`${i}%`)}updateVelocity(t){if(!this.velocityEl)return;const e=Math.hypot(t.x,t.z),n=e<.05?0:e,i=n.toFixed(1);i!==this._lastSpeedStr&&(this._lastSpeedStr=i,this.velocityEl.textContent=i,this.velocityEl.classList.toggle("accurate",n<=.5))}updateTacticalStatus(t,e){const n=t?"CROUCH":"STAND";this.stanceEl&&n!==this._lastStance&&(this._lastStance=n,this.stanceEl.textContent=n);const i=e<-.3?-1:e>.3?1:0;i!==this._lastLeanState&&(this._lastLeanState=i,this.leanL&&this.leanL.classList.toggle("active",i===-1),this.leanR&&this.leanR.classList.toggle("active",i===1),this.leanC&&this.leanC.classList.toggle("active",i===0))}updateAmmo(t,e,n){this.ammoCurEl&&(this.ammoCurEl.textContent=t),this.ammoResEl&&(this.ammoResEl.textContent=e),this.weaponNameEl&&(this.weaponNameEl.textContent=n)}updateActiveSlot(t){document.querySelectorAll(".rack-slot").forEach(n=>{const i=parseInt(n.getAttribute("data-slot"),10);n.classList.toggle("active",i===t)})}setReloading(t,e=0){this.reloadTrack&&(t?(this.reloadTrack.classList.add("reloading"),this.reloadProgress&&(this.reloadProgress.style.width=`${Math.min(100,e*100)}%`)):(this.reloadTrack.classList.remove("reloading"),this.reloadProgress&&(this.reloadProgress.style.width="0%")))}updateCrosshairSpread(t){this.chTop&&(this.chTop.style.transform=`translateY(-${t}px)`,this.chBottom.style.transform=`translateY(${t}px)`,this.chLeft.style.transform=`translateX(-${t}px)`,this.chRight.style.transform=`translateX(${t}px)`)}getParticipantColorClass(t,e){if(e)return"kill-name-player";const n=String(t||"").toUpperCase();return n==="PLAYER"||n==="YOU"||n==="HOST"?"kill-name-player":n.includes("BOT")||n.includes("CRIMSON")||n.includes("ENEMY")||n==="CLIENT"?"kill-name-enemy":"kill-name-neutral"}addKillFeedEntry(t,e,n,i=!1,r={}){if(!this.killfeedEl)return;let a=!1,o=!1,l=!1,c=!1,h=!1;typeof i=="boolean"?(a=i,o=!!r.isJumpShot,l=!!r.isNoScope,c=r.isLocalKiller!==void 0?!!r.isLocalKiller:t==="PLAYER"||t==="HOST",h=r.isLocalVictim!==void 0?!!r.isLocalVictim:n==="PLAYER"||n==="HOST"):typeof i=="object"&&i!==null&&(a=!!i.isHeadshot,o=!!i.isJumpShot,l=!!i.isNoScope,c=i.isLocalKiller!==void 0?!!i.isLocalKiller:t==="PLAYER"||t==="HOST",h=i.isLocalVictim!==void 0?!!i.isLocalVictim:n==="PLAYER"||n==="HOST");const u=document.createElement("div");u.className=`kill-msg${c?" local-killer":""}${h?" local-victim":""}`;const f=Fm(e),p=this.getParticipantColorClass(t,c),g=this.getParticipantColorClass(n,h),_=o?`<span class="kill-badge kill-jumpshot" title="Airborne Jump Shot">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="13" cy="3.5" r="2"/>
            <path d="M11 6 C9.5 6 8.5 7 8 8.5 L9.8 9.2 C10.1 8.3 10.6 7.8 11.5 7.8 C12.2 7.8 12.8 8.2 13.2 8.8 L14.5 11 L12 13 L12.5 16 L14.2 15.2 L13.8 13.8 L16.5 11.5 C17.2 10.8 17.2 9.7 16.5 9 L15 7.5 C14 6.5 12.5 6 11 6 Z"/>
            <path d="M7.5 10 L5 11.5 L5.8 13 L8 11.8 Z"/>
            <path d="M3 15 C5 16 7.5 16 10 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>
            <path d="M4.5 18 C6.5 18.8 8.5 18.8 11 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>
          </svg>
        </span>`:"",m=l?`<span class="kill-badge kill-noscope" title="No-Scope Kill">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="10" cy="10" r="7" stroke="#e2e8f0"/>
            <line x1="10" y1="3" x2="10" y2="7" stroke="#e2e8f0" stroke-linecap="round"/>
            <line x1="10" y1="13" x2="10" y2="17" stroke="#e2e8f0" stroke-linecap="round"/>
            <line x1="3" y1="10" x2="7" y2="10" stroke="#e2e8f0" stroke-linecap="round"/>
            <line x1="13" y1="10" x2="17" y2="10" stroke="#e2e8f0" stroke-linecap="round"/>
            <line x1="4" y1="4" x2="16" y2="16" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </span>`:"",d=a?`<span class="kill-badge kill-headshot" title="Headshot">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="10" cy="10" r="7.5"/>
            <line x1="10" y1="1" x2="10" y2="4.5"/>
            <line x1="10" y1="15.5" x2="10" y2="19"/>
            <line x1="1" y1="10" x2="4.5" y2="10"/>
            <line x1="15.5" y1="10" x2="19" y2="10"/>
            <circle cx="10" cy="10" r="2.5" fill="#ef4444"/>
          </svg>
        </span>`:"";for(u.innerHTML=`
      <span class="kill-killer ${p}">${t}</span>
      ${_}
      ${m}
      <span class="kill-weapon-container">${f}</span>
      ${d}
      <span class="kill-victim ${g}">${n}</span>
    `,this.killfeedEl.appendChild(u);this.killfeedEl.children.length>5;)this.killfeedEl.removeChild(this.killfeedEl.firstChild);setTimeout(()=>{u.style.transition="opacity 0.35s ease-out, transform 0.35s ease-out",u.style.opacity="0",u.style.transform="translateX(24px)",setTimeout(()=>{u.parentNode&&u.parentNode.removeChild(u)},350)},4200)}showGameOver(t,e,n,i=!1){if(!this.gameOverModal)return;this.gameOverModal.style.display="flex";const r=this.gameOverModal.querySelector(".game-over-card");r&&(r.style.borderColor=t?"rgba(16, 185, 129, 0.4)":"rgba(244, 63, 94, 0.45)",r.style.boxShadow=t?"0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.2)":"0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(244, 63, 94, 0.25)"),this.gameOverTitle&&(this.gameOverTitle.textContent=e,this.gameOverTitle.className=`game-over-title ${t?"win":"loss"}`),this.gameOverSub&&(this.gameOverSub.textContent=n),i?(this.setRematchBox(!1),this.setPlayAgainButtonText("Confirm to start round (0/2)",!1)):(this.setRematchBox(!1),this.setPlayAgainButtonText("Play Next Round",!1))}setRematchBox(t,e=""){this.rematchBox&&(this.rematchBox.style.display=t?"block":"none",this.rematchText&&e&&(this.rematchText.textContent=e))}setPlayAgainButtonText(t,e=!1){this.btnPlayAgain&&(this.btnPlayAgain.textContent=t,this.btnPlayAgain.disabled=e,this.btnPlayAgain.style.opacity=e?"0.6":"1",this.btnPlayAgain.style.cursor=e?"not-allowed":"pointer")}hideGameOver(){this.gameOverModal&&(this.gameOverModal.style.display="none")}setupWeaponSelectListeners(){this.primaryCards&&this.primaryCards.forEach(t=>{t.addEventListener("click",()=>{this.btnLockLoadout&&this.btnLockLoadout.disabled||(this.primaryCards.forEach(e=>e.classList.remove("selected")),t.classList.add("selected"),this.selectedPrimary=t.getAttribute("data-weapon-id")||"ak47")})}),this.secondaryCards&&this.secondaryCards.forEach(t=>{t.addEventListener("click",()=>{this.btnLockLoadout&&this.btnLockLoadout.disabled||(this.secondaryCards.forEach(e=>e.classList.remove("selected")),t.classList.add("selected"),this.selectedSecondary=t.getAttribute("data-weapon-id")||"pistol")})}),this.btnLockLoadout&&this.btnLockLoadout.addEventListener("click",()=>{this.onLockInCallback&&this.onLockInCallback(this.selectedPrimary,this.selectedSecondary)})}showWeaponSelect(t,e=!1){this.weaponSelectModal&&(this.weaponSelectModal.style.display=t?"flex":"none",t&&(this.setLockInButtonState(!1,"DEPLOY"),e?this.setLoadoutStatus("SELECT LOADOUT","normal"):this.setLoadoutStatus("READY","normal")))}setLoadoutStatus(t,e="normal"){this.wsStatusText&&(this.wsStatusText.textContent=t),this.wsStatusDot&&(e==="ready"?(this.wsStatusDot.style.background="var(--hud-green)",this.wsStatusDot.style.boxShadow="0 0 8px var(--hud-green)"):e==="waiting"?(this.wsStatusDot.style.background="var(--accent-orange)",this.wsStatusDot.style.boxShadow="0 0 8px var(--accent-orange)"):(this.wsStatusDot.style.background="var(--accent-sand)",this.wsStatusDot.style.boxShadow="0 0 6px var(--accent-sand)"))}setLockInButtonState(t,e="DEPLOY"){this.btnLockLoadout&&(this.btnLockLoadout.disabled=t,this.btnLockLoadout.textContent=e,this.btnLockLoadout.style.opacity=t?"0.6":"1",this.btnLockLoadout.style.cursor=t?"not-allowed":"pointer")}onLoadoutLockIn(t){this.onLockInCallback=t}updateRackLoadout(t,e){const n=document.querySelector(`.ws-weapon-card[data-weapon-id="${t}"]`),i=document.getElementById("rack-icon-0"),r=document.getElementById("rack-name-0");if(n&&i&&r){const c=n.querySelector(".ws-icon-wrap"),h=n.querySelector(".ws-weapon-name");c&&(i.innerHTML=c.innerHTML),h&&(r.textContent=h.textContent)}const a=document.querySelector(`.ws-weapon-card[data-weapon-id="${e}"]`),o=document.getElementById("rack-icon-1"),l=document.getElementById("rack-name-1");if(a&&o&&l){const c=a.querySelector(".ws-icon-wrap"),h=a.querySelector(".ws-weapon-name");c&&(o.innerHTML=c.innerHTML),h&&(l.textContent=h.textContent)}}}const Je="counter-siege",Bm=1;function zm(){try{return document.referrer?new URL(document.referrer).origin:window.location.origin}catch{return window.location.origin}}class km{constructor(){this.parentOrigin=zm(),this.game=null,window.addEventListener("message",t=>this.handleMessage(t)),window.addEventListener(`${Je}:bridge-message`,t=>{this.handleMessageData(t.detail)})}setGame(t){this.game=t,this.post(`${Je}:ready`,{protocol:Bm,capabilities:["solo","room","action","sync","pause","leave"]})}post(t,e={}){window.parent!==window&&window.parent.postMessage({type:t,...e},this.parentOrigin)}sendPacket(t){t.type==="state"?this.post(`${Je}:state`,{state:t}):this.post(`${Je}:input`,{input:t})}sendPause(t){this.post(`${Je}:pause`,{paused:t})}sendLeave(){this.post(`${Je}:leave`)}handleMessage(t){var e;t.source!==window.parent||t.origin!==this.parentOrigin||typeof((e=t.data)==null?void 0:e.type)=="string"&&t.data.type.startsWith(`${Je}:`)||this.handleMessageData(t.data)}handleMessageData(t){var e,n,i,r,a,o,l,c,h,u,f;if(!(!t||typeof t.type!="string")){if(t.type.startsWith(`${Je}:`))switch(t.type.slice(Je.length+1)){case"solo":(e=this.game)==null||e.startSolo();return;case"enable":(n=this.game)==null||n.network.startExternalMatch(t.slot===0?"host":"guest");return;case"remote-input":t.input&&typeof t.input.type=="string"&&((i=this.game)==null||i.network.handlePacket(t.input));return;case"state":t.state&&typeof t.state.type=="string"&&((r=this.game)==null||r.network.handlePacket(t.state));return;case"pause":(a=this.game)==null||a.setPaused(!0);return;case"resume":(o=this.game)==null||o.setPaused(!1);return;default:return}if(t.namespace===Je)switch(t.type){case"start":t.mode==="solo"?(l=this.game)==null||l.startSolo():t.mode==="room"&&((c=this.game)==null||c.network.startExternalMatch(t.role));break;case"action":case"sync":t.packet&&typeof t.packet.type=="string"&&((h=this.game)==null||h.network.handlePacket(t.packet));break;case"pause":typeof t.paused=="boolean"&&((u=this.game)==null||u.setPaused(t.paused));break;case"leave":(f=this.game)==null||f.returnToMenu(!1);break}}}}const Oi=new km;class Gm{constructor(t,e=!1){this.scene=t,this.isHost=e,this.health=100,this.armor=100,this.isDead=!1,this.position=new T,this.targetPos=new T,this.yaw=0,this.targetYaw=0,this.pitch=0,this.lean=0,this.isCrouching=!1,this.hitMeshes=[],this.headMesh=null,this.root=this.buildMannequin(),this.scene.add(this.root),this.muzzleFlash=this.createMuzzleFlash(),this.root.add(this.muzzleFlash),this.flashTimer=0}buildMannequin(){const t=new jt,e=this.isHost?11871268:2376309,n=this.isHost?8525848:1649485,i=new Ct({color:e,roughness:.5,metalness:.25});new Ct({color:n,roughness:.4,metalness:.5});const r=new Ct({color:2038554,roughness:.7,metalness:.1});new Ct({color:14201202,metalness:.9,roughness:.15}),new Ct({color:1381912,metalness:.8,roughness:.4});const a=new Ds(.32,.65,8,16),o=new P(a,i);o.position.y=.65,o.castShadow=!0,o.receiveShadow=!0,t.add(o),this.hitMeshes.push(o);const l=new jt;l.position.set(0,1.34,0);const c=new Ee(.24,16,16),h=new P(c,i);h.userData.isHead=!0,h.castShadow=!0,l.add(h),this.hitMeshes.push(h);const u=new H(.22,.08,.12),f=new P(u,r);f.position.set(0,.02,.16),f.userData.isHead=!0,l.add(f),this.hitMeshes.push(f),t.add(l),this.headMesh=l;const p=Cl();return p.position.set(.28,.78,.28),p.rotation.x=-.1,t.add(p),t}createMuzzleFlash(){const t=new jt;t.visible=!1,t.position.set(.22,1.05,.8);const e=new Wi(.07,0),n=new An({color:16769126});return t.add(new P(e,n)),t}getHitMeshes(){return this.hitMeshes}playFireEffect(){this.muzzleFlash.visible=!0,this.flashTimer=.05}update(t){this.position.lerp(this.targetPos,14*t),this.yaw=he.lerp(this.yaw,this.targetYaw,14*t),this.root.position.copy(this.position),this.root.rotation.y=this.yaw,this.headMesh&&(this.headMesh.position.x=this.lean*.35,this.headMesh.rotation.z=-this.lean*.2),this.flashTimer>0&&(this.flashTimer-=t,this.flashTimer<=0&&(this.muzzleFlash.visible=!1))}takeDamage(t,e,n){this.isDead||(this.armor>0&&(this.armor>=t?(this.armor-=t,t=0):(t-=this.armor,this.armor=0)),t>0&&(this.health=Math.max(0,this.health-t)),this.health<=0&&this.die())}die(){this.isDead=!0,this.root.rotation.z=Math.PI/2.2,this.root.position.y=.35}respawn(t,e=0){this.isDead=!1,this.health=100,this.armor=100,this.position.copy(t),this.targetPos.copy(t),this.yaw=e,this.targetYaw=e,this.root.rotation.set(0,e,0),this.root.position.copy(t)}destroy(){this.root&&this.root.parent?this.root.parent.remove(this.root):this.root&&this.scene.remove(this.root)}}class Hm{constructor(t){this.game=t,this.isHost=!1,this.isConnected=!1,this.isExternal=!1,this.remotePlayer=null,this.syncInterval=null}startExternalMatch(t){t!=="host"&&t!=="guest"||(this.disconnect(!1),this.isExternal=!0,this.isConnected=!0,this.isHost=t==="host",this.startP2PMatch())}startP2PMatch(){this.game.playerScore=0,this.game.enemyScore=0,this.game.ui.updateScores(0,0),this.game.bot&&(this.game.scene.remove(this.game.bot.root),this.game.bot=null),this.remotePlayer||(this.remotePlayer=new Gm(this.game.scene,this.isHost)),this.game.weapons.targets=[this.remotePlayer],this.game.ui.setModeTag(this.isHost?"ROOM HOST":"ROOM GUEST"),this.game.ui.showMainMenu(!1),this.game.ui.showHUD(!0),this.game.openLoadoutSelect(!0),this.startSyncLoop()}startSyncLoop(){this.syncInterval&&clearInterval(this.syncInterval),this.syncInterval=setInterval(()=>{!this.isConnected||!this.isExternal||this.game.player.isDead||this.sendPacket({type:"state",pos:[this.game.player.position.x,this.game.player.position.y,this.game.player.position.z],yaw:this.game.player.yaw,pitch:this.game.player.pitch,lean:this.game.player.currentLean,crouch:this.game.player.isCrouching,slot:this.game.weapons.currentSlot,health:this.game.player.health,armor:this.game.player.armor})},33)}sendPacket(t){!this.isConnected||!this.isExternal||Oi.sendPacket(t)}handlePacket(t){if(!(!t||!t.type))switch(t.type){case"loadout_ready":this.game.handlePeerLoadoutReady(t);break;case"state":this.remotePlayer&&(this.remotePlayer.targetPos.set(t.pos[0],t.pos[1],t.pos[2]),this.remotePlayer.targetYaw=t.yaw,this.remotePlayer.pitch=t.pitch,this.remotePlayer.lean=t.lean,this.remotePlayer.isCrouching=t.crouch);break;case"fire":this.remotePlayer&&(this.remotePlayer.playFireEffect(),this.game.sound.playGunshot(t.weaponId));break;case"hit":this.game.player.takeDamage(t.damage,this.remotePlayer?this.remotePlayer.position:null);break;case"p2p_elimination":{const e=t.shooterIsHost===this.isHost;this.game.handleP2POutcome(e,t.isHeadshot,t.weapon,{isJumpShot:!!t.isJumpShot,isNoScope:!!t.isNoScope});break}case"rematch_confirm":this.game.handlePeerRematchConfirm();break;case"rematch_exit":this.clearExternalMatch(),this.game.handlePeerRematchExit();break;case"reset_round":this.game.ui.hideGameOver(),this.game.openLoadoutSelect(!0);break}}disconnect(t=!0){this.sendPacket({type:"rematch_exit"}),t&&this.isConnected&&this.isExternal&&Oi.sendLeave(),this.game&&this.game.ui&&this.game.ui.showWeaponSelect(!1),this.syncInterval&&(clearInterval(this.syncInterval),this.syncInterval=null),this.remotePlayer&&Array.isArray(data.pos)&&data.pos.length===3&&data.pos.every(Number.isFinite)&&[data.yaw,data.pitch,data.lean].every(Number.isFinite)&&(this.remotePlayer.destroy(),this.remotePlayer=null),this.isConnected=!1,this.isExternal=!1,this.isHost=!1}clearExternalMatch(){this.syncInterval&&(clearInterval(this.syncInterval),this.syncInterval=null),this.remotePlayer&&(this.remotePlayer.destroy(),this.remotePlayer=null),this.isConnected=!1,this.isExternal=!1}update(t){this.remotePlayer&&this.remotePlayer.update(t)}}class Vm{constructor(){this.canvas=document.getElementById("game-canvas"),this.initRenderer(),this.initScene(),this.ui=new Om,this.sound=new Tm,this.map=new Sm(this.scene),this.player=new Em(this.camera,this.canvas,this.map),this.weapons=new Nm(this.camera,this.scene,this.player,this.sound,this.map),this.bot=new Ho(this.scene,this.map,this.player,this.sound),this.weapons.targets=[this.bot],this.network=new Hm(this),this.playerScore=0,this.enemyScore=0,this.matchTime=105,this.isRunning=!1,this.roundOver=!1,this.myRematchConfirmed=!1,this.peerRematchConfirmed=!1,this.selectedPrimary="ak47",this.selectedSecondary="pistol",this.localLoadoutReady=!1,this.peerLoadoutReady=!1,this.fpsFrames=0,this.lastFpsUpdate=performance.now(),this.currentFps=60,this.currentFrameMs=16.6,this.setupGameEvents(),this.setupUIBindings(),this.setupResizeListener(),Me.onChange(t=>this.applySettings(t)),this.ui.showMainMenu(!0),this.ui.showHUD(!1),this.ui.showWeaponSelect(!1),this.ui.showPauseMenu(!1),this.ui.hideOptionsModal(),this.ui.hideGameOver(),this.weapons.viewmodelHolder.visible=!1,this.player.canLock=!1,Oi.setGame(this),this.clock=new mm,this.animate=this.animate.bind(this),requestAnimationFrame(this.animate)}initRenderer(){this.renderer=new Yp({canvas:this.canvas,antialias:!0,powerPreference:"high-performance",stencil:!1,depth:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.toneMapping=Xo,this.renderer.toneMappingExposure=1.05}applySettings(t){if(!this.renderer)return;const e=t.graphicsQuality||"medium";let n=1;e==="low"?(n=Math.min(window.devicePixelRatio,1),this.renderer.shadowMap.enabled=!1):e==="medium"?(n=Math.min(window.devicePixelRatio,1),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ia):(n=Math.min(window.devicePixelRatio,1.5),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Vo),this.renderer.setPixelRatio(n),this.map&&this.map.applyGraphicsQuality&&this.map.applyGraphicsQuality(e)}initScene(){this.scene=new Kp,this.scene.background=new zt(10994398),this.scene.fog=new ma(13746597,.012),this.camera=new Ie(78,window.innerWidth/window.innerHeight,.05,500)}setupGameEvents(){this.player.onFootstep=()=>{this.sound.playFootstep(),this.bot&&!this.bot.isDead&&this.bot.onPlayerFootstep(this.player.position,this.player.isCrouching)},this.weapons.onFire=e=>{this.network.isConnected&&this.network.sendPacket({type:"fire",weaponId:e}),this.bot&&!this.bot.isDead&&this.bot.onPlayerGunfire(this.player.position)},this.weapons.onTargetHit=(e,n,i)=>{if(this.network.isConnected&&e===this.network.remotePlayer&&(this.network.sendPacket({type:"hit",damage:n,isHeadshot:i}),e.isDead)){const r=!this.player.isGrounded,a=!!(this.weapons.isScoped||this.player&&this.player.isScoped),o=this.weapons.currentWeapon.id,l=o==="awp"&&!a;this.network.sendPacket({type:"p2p_elimination",shooterIsHost:this.network.isHost,weapon:o,isHeadshot:i,isJumpShot:r,isNoScope:l}),this.handleP2POutcome(!0,i,o,{isJumpShot:r,isNoScope:l})}};const t=document.getElementById("damage-flash");this.player.onDamage=(e,n,i,r={})=>{r.shieldBroken?this.sound.playShieldBreak():r.shieldDamage>0&&(!r.healthDamage||r.healthDamage===0)&&this.sound.playShieldHit(),r.healthDamage>0?t.style.background="radial-gradient(circle at center, transparent 40%, rgba(255, 40, 40, 0.65) 100%)":t.style.background="radial-gradient(circle at center, transparent 45%, rgba(77, 179, 255, 0.55) 100%)",t.style.opacity="0.7",setTimeout(()=>{t.style.opacity="0"},180),this.ui.updateVitals(e,n),(e<=0||this.player.isDead)&&!this.roundOver&&(this.network.isConnected?(this.network.sendPacket({type:"p2p_elimination",shooterIsHost:!this.network.isHost,weapon:"ak47",isHeadshot:!1}),this.handleP2POutcome(!1,!1,"ak47")):(this.roundOver=!0,this.weapons.resetAllAmmo(),this.enemyScore++,this.ui.updateScores(this.playerScore,this.enemyScore),this.ui.addKillFeedEntry("CRIMSON BOT","ak47","PLAYER",{isHeadshot:!1,isJumpShot:!1,isLocalKiller:!1,isLocalVictim:!0}),setTimeout(()=>{this.ui.showGameOver(!1,"Round Lost","You were eliminated by the opponent.",!1),document.exitPointerLock&&document.exitPointerLock()},800)))},this.setupBotDeathCallback()}setupBotDeathCallback(){this.bot&&(this.bot.onDeath=t=>{if(this.roundOver)return;this.roundOver=!0;const e=!this.player.isGrounded,n=!!(this.weapons.isScoped||this.player&&this.player.isScoped),i=this.weapons.currentWeapon.id,r=i==="awp"&&!n;this.weapons.resetAllAmmo(),this.playerScore++,this.ui.updateScores(this.playerScore,this.enemyScore),this.ui.addKillFeedEntry("PLAYER",i,"CRIMSON BOT",{isHeadshot:t,isJumpShot:e,isNoScope:r,isLocalKiller:!0,isLocalVictim:!1}),setTimeout(()=>{const a=t?"Precision Headshot Elimination (+300 PTS)":"Opponent eliminated.";this.ui.showGameOver(!0,"Round Won",a,!1),document.exitPointerLock&&document.exitPointerLock()},900)})}setupUIBindings(){const t=document.getElementById("btn-play-bot"),e=document.getElementById("btn-resume"),n=document.getElementById("btn-restart"),i=document.getElementById("btn-leave-menu"),r=document.getElementById("btn-play-again"),a=document.getElementById("btn-gameover-exit");this.ui.onLoadoutLockIn((l,c)=>{this.handleLoadoutLockIn(l,c)}),t.addEventListener("click",()=>this.startSolo()),document.addEventListener("pointerlockchange",()=>{const l=document.pointerLockElement===this.canvas;!l&&this.isRunning&&!this.roundOver?(this.ui.isOptionsOpen()||this.ui.showPauseMenu(!0),this.player&&(this.player.canLock=!1),Oi.sendPause(!0)):l&&(this.ui.showPauseMenu(!1),this.ui.showMainMenu(!1),this.ui.hideOptionsModal(),this.player&&(this.player.canLock=!0),Oi.sendPause(!1))}),window.addEventListener("keydown",l=>{if(l.key==="Escape"||l.code==="Escape"){if(this.ui.isOptionsOpen()){l.preventDefault(),this.ui.showOptionsModal(!1);return}this.isRunning&&!this.roundOver&&this.ui.isPauseMenuOpen()&&(l.preventDefault(),e.click())}}),e.addEventListener("click",()=>{this.ui.showPauseMenu(!1),this.ui.hideOptionsModal(),this.player&&(this.player.canLock=!0);try{const l=this.canvas.requestPointerLock();l&&typeof l.catch=="function"&&l.catch(()=>{})}catch{}}),n.addEventListener("click",()=>{this.ui.showPauseMenu(!1),this.ui.hideOptionsModal();const l=!!(this.network&&this.network.isConnected);l&&this.network.sendPacket({type:"reset_round"}),this.openLoadoutSelect(l)}),i.addEventListener("click",()=>this.returnToMenu(!0)),r.addEventListener("click",()=>{this.network&&this.network.isConnected?this.handleP2PRematchClick():(this.ui.hideGameOver(),this.ui.hideOptionsModal(),this.openLoadoutSelect(!1))}),a.addEventListener("click",()=>this.returnToMenu(!0)),window.addEventListener("keydown",l=>{l.target&&(l.target.tagName==="INPUT"||l.target.tagName==="TEXTAREA")||(l.key==="k"||l.key==="K"||l.code==="KeyK")&&this.triggerTestKillFeed()});const o=document.getElementById("mode-tag");o&&(o.style.cursor="pointer",o.title="Click to preview killfeed",o.addEventListener("click",()=>{this.triggerTestKillFeed()})),window.testKillFeed=()=>this.triggerTestKillFeed()}startSolo(){this.sound.ensureContext(),this.network.disconnect(!1),this.playerScore=0,this.enemyScore=0,this.ui.updateScores(0,0),this.ui.showMainMenu(!1),this.ui.showHUD(!0),this.ui.setModeTag("BOT DUEL"),this.bot?this.scene.children.includes(this.bot.root)||this.scene.add(this.bot.root):(this.bot=new Ho(this.scene,this.map,this.player,this.sound),this.setupBotDeathCallback()),this.weapons.targets=[this.bot],this.openLoadoutSelect(!1)}setPaused(t){if(!(!this.isRunning||this.roundOver)){if(t){this.ui.showPauseMenu(!0),this.player.canLock=!1,document.exitPointerLock&&document.exitPointerLock();return}if(this.ui.showPauseMenu(!1),this.player.canLock=!0,document.pointerLockElement!==this.canvas)try{const e=this.canvas.requestPointerLock();e&&typeof e.catch=="function"&&e.catch(()=>{})}catch{}}}returnToMenu(t=!0){this.ui.showPauseMenu(!1),this.ui.hideOptionsModal(),this.ui.hideGameOver(),this.ui.showWeaponSelect(!1),this.ui.showHUD(!1),this.ui.showMainMenu(!0),this.isRunning=!1,this.roundOver=!1,this.player.canLock=!1,this.weapons.viewmodelHolder.visible=!1,document.exitPointerLock&&document.exitPointerLock(),this.network.disconnect(t)}triggerTestKillFeed(){this.ui&&(this.ui.addKillFeedEntry("PLAYER","ak47","CRIMSON BOT",{isHeadshot:!0,isJumpShot:!1,isLocalKiller:!0}),setTimeout(()=>{this.ui.addKillFeedEntry("PLAYER","awp","CRIMSON BOT",{isHeadshot:!0,isJumpShot:!0,isNoScope:!0,isLocalKiller:!0})},200),setTimeout(()=>{this.ui.addKillFeedEntry("CRIMSON BOT","deagle","PLAYER",{isHeadshot:!0,isJumpShot:!1,isLocalVictim:!0})},400),setTimeout(()=>{this.ui.addKillFeedEntry("PLAYER","knife","CRIMSON BOT",{isHeadshot:!1,isJumpShot:!0,isLocalKiller:!0})},600),setTimeout(()=>{this.ui.addKillFeedEntry("PLAYER","shotgun","CRIMSON BOT",{isHeadshot:!0,isJumpShot:!1,isLocalKiller:!0})},800))}handleP2POutcome(t,e=!1,n="ak47",i={}){if(this.roundOver)return;this.roundOver=!0,this.weapons.resetAllAmmo();const r=this.network.isHost?"HOST":"CLIENT",a=this.network.isHost?"CLIENT":"HOST",o=t?r:a,l=t?a:r;t?this.playerScore++:this.enemyScore++,this.ui.updateScores(this.playerScore,this.enemyScore),this.ui.addKillFeedEntry(o,n,l,{isHeadshot:e,isJumpShot:!!i.isJumpShot,isNoScope:!!i.isNoScope,isLocalKiller:t,isLocalVictim:!t});const c=t?"Round Won":"Round Lost",h=t?e?"Precision Headshot Elimination (+300 PTS)":"Opponent eliminated.":"You were eliminated by the opponent.";setTimeout(()=>{this.ui.showGameOver(t,c,h,!0),document.exitPointerLock&&document.exitPointerLock()},700)}handleP2PRematchClick(){this.myRematchConfirmed||(this.myRematchConfirmed=!0,this.network.sendPacket({type:"rematch_confirm"}),this.peerRematchConfirmed?(this.ui.setPlayAgainButtonText("Confirm to start round (2/2)",!0),setTimeout(()=>{this.resetRematchState(),this.ui.hideGameOver(),this.openLoadoutSelect(!0)},500)):this.ui.setPlayAgainButtonText("Confirm to start round (1/2)",!0))}handlePeerRematchConfirm(){this.peerRematchConfirmed=!0,this.myRematchConfirmed?(this.ui.setPlayAgainButtonText("Confirm to start round (2/2)",!0),setTimeout(()=>{this.resetRematchState(),this.ui.hideGameOver(),this.openLoadoutSelect(!0)},500)):this.ui.setPlayAgainButtonText("Confirm to start round (1/2)",!1)}handlePeerRematchExit(){this.peerRematchConfirmed=!1,this.ui.showWeaponSelect(!1),this.isRunning&&!this.roundOver&&(this.roundOver=!0,this.weapons.resetAllAmmo(),this.ui.showGameOver(!0,"Round Won","Opponent left the match.",!0),document.exitPointerLock&&document.exitPointerLock()),this.ui.setRematchBox(!0,"Opponent left the match."),this.ui.setPlayAgainButtonText("Opponent Left",!0)}resetRematchState(){this.myRematchConfirmed=!1,this.peerRematchConfirmed=!1}openLoadoutSelect(t=!1){this.isRunning=!1,this.roundOver=!1,this.localLoadoutReady=!1,this.peerLoadoutReady=!1,this.player.canLock=!1,this.weapons.viewmodelHolder.visible=!1,document.exitPointerLock&&document.exitPointerLock(),this.ui.showMainMenu(!1),this.ui.showPauseMenu(!1),this.ui.hideOptionsModal(),this.ui.showWeaponSelect(!0,t)}handleLoadoutLockIn(t,e){this.selectedPrimary=t,this.selectedSecondary=e,this.weapons.setLoadout(t,e),this.ui.updateRackLoadout(t,e),!!(this.network&&this.network.isConnected)?(this.localLoadoutReady=!0,this.network.sendPacket({type:"loadout_ready",primary:t,secondary:e}),this.peerLoadoutReady?(this.ui.setLoadoutStatus("BOTH PLAYERS READY (2/2) — DEPLOYING...","ready"),this.ui.setLockInButtonState(!0,"Both Ready (2/2)"),setTimeout(()=>{this.ui.showWeaponSelect(!1),this.startRound()},400)):(this.ui.setLoadoutStatus("WAITING FOR OPPONENT... (1/2 READY)","waiting"),this.ui.setLockInButtonState(!0,"Waiting for opponent (1/2)"))):(this.ui.showWeaponSelect(!1),this.startRound())}handlePeerLoadoutReady(t){this.peerLoadoutReady=!0,this.localLoadoutReady?(this.ui.setLoadoutStatus("BOTH PLAYERS READY (2/2) — DEPLOYING...","ready"),this.ui.setLockInButtonState(!0,"Both Ready (2/2)"),setTimeout(()=>{this.ui.showWeaponSelect(!1),this.startRound()},400)):this.ui.setLoadoutStatus("OPPONENT READY (1/2) — LOCK IN YOUR LOADOUT","waiting")}startRound(){this.roundOver=!1,this.isRunning=!0,this.matchTime=105,this.resetRematchState(),this.ui.showMainMenu(!1),this.ui.showPauseMenu(!1),this.ui.hideOptionsModal(),this.ui.showWeaponSelect(!1),this.ui.hideGameOver(),this.ui.showHUD(!0);const t=!!(this.network&&this.network.isConnected),e=!!(this.network&&this.network.isHost);let n=this.map.playerSpawn,i=0,r=this.map.botSpawn,a=Math.PI;t&&(e?(n=this.map.playerSpawn,i=0,r=this.map.botSpawn,a=Math.PI):(n=this.map.botSpawn,i=Math.PI,r=this.map.playerSpawn,a=0)),this.player.respawn(n,i),this.bot&&this.bot.respawn(),this.network&&this.network.remotePlayer&&this.network.remotePlayer.respawn(r,a),this.weapons.resetAllAmmo(),this.weapons.selectWeapon(0),this.weapons.viewmodelHolder.visible=!0,this.player.canLock=!0,this.ui.updateRackLoadout(this.selectedPrimary,this.selectedSecondary),this.ui.updateVitals(100,100),this.weapons.updateHUD();try{const o=this.canvas.requestPointerLock();o&&typeof o.catch=="function"&&o.catch(()=>{})}catch{}}setupResizeListener(){window.addEventListener("resize",()=>{const t=window.innerWidth,e=window.innerHeight;this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e);const r=(Me.get().graphicsQuality||"medium")==="high"?1.5:1;this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,r))})}animate(){requestAnimationFrame(this.animate);const t=this.clock.getDelta();this.fpsFrames++;const e=performance.now(),n=e-this.lastFpsUpdate;if(n>=250&&(this.currentFps=this.fpsFrames*1e3/n,this.currentFrameMs=n/Math.max(1,this.fpsFrames),this.ui.updateFPS(this.currentFps,this.currentFrameMs),this.fpsFrames=0,this.lastFpsUpdate=e),this.isRunning&&(this.player.update(t),this.bot&&!this.roundOver&&this.bot.update(t),this.network.update(t),this.player.isDead||this.weapons.update(t),!this.roundOver&&(this.matchTime=Math.max(0,this.matchTime-t),this.ui.updateTimer(this.matchTime),this.ui.updateVelocity(this.player.velocity),this.ui.updateTacticalStatus(this.player.isCrouching,this.player.targetLean),this.matchTime<=0))){this.roundOver=!0,this.weapons.resetAllAmmo();const i=!!(this.network&&this.network.isConnected),r=i?"MATCH DRAW":"ROUND DRAW";this.ui.showGameOver(!1,r,"Time expired without elimination.",i),document.exitPointerLock&&document.exitPointerLock()}this.renderer.render(this.scene,this.camera)}}window.addEventListener("DOMContentLoaded",()=>{window.game=new Vm});
