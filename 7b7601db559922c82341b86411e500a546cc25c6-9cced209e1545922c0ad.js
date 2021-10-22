(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"+7vx":function(t,e,n){"use strict";n.d(e,"a",(function(){return p}));n("IZzc");var i=n("1OyB"),a=n("vuIU"),r=n("md7G"),o=n("foSv"),s=n("ReuC"),l=n("Ji7U"),c=n("K4gp"),u=n("BQ9P"),f=n("K7jV"),h=n("ykdB"),g=n("0i8A"),d=[0,0,0,255],v={radiusUnits:"meters",radiusScale:{type:"number",min:0,value:1},radiusMinPixels:{type:"number",min:0,value:0},radiusMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},lineWidthUnits:"meters",lineWidthScale:{type:"number",min:0,value:1},lineWidthMinPixels:{type:"number",min:0,value:0},lineWidthMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},stroked:!1,filled:!0,getPosition:{type:"accessor",value:function(t){return t.position}},getRadius:{type:"accessor",value:1},getFillColor:{type:"accessor",value:d},getLineColor:{type:"accessor",value:d},getLineWidth:{type:"accessor",value:1},strokeWidth:{deprecatedFor:"getLineWidth"},outline:{deprecatedFor:"stroked"},getColor:{deprecatedFor:["getFillColor","getLineColor"]}},p=function(t){function e(){return Object(i.a)(this,e),Object(r.a)(this,Object(o.a)(e).apply(this,arguments))}return Object(l.a)(e,t),Object(a.a)(e,[{key:"getShaders",value:function(t){return Object(s.a)(Object(o.a)(e.prototype),"getShaders",this).call(this,{vs:"#define SHADER_NAME scatterplot-layer-vertex-shader\n\nattribute vec3 positions;\n\nattribute vec3 instancePositions;\nattribute vec3 instancePositions64Low;\nattribute float instanceRadius;\nattribute float instanceLineWidths;\nattribute vec4 instanceFillColors;\nattribute vec4 instanceLineColors;\nattribute vec3 instancePickingColors;\n\nuniform float opacity;\nuniform float radiusScale;\nuniform float radiusMinPixels;\nuniform float radiusMaxPixels;\nuniform float lineWidthScale;\nuniform float lineWidthMinPixels;\nuniform float lineWidthMaxPixels;\nuniform float stroked;\nuniform bool filled;\n\nvarying vec4 vFillColor;\nvarying vec4 vLineColor;\nvarying vec2 unitPosition;\nvarying float innerUnitRadius;\nvarying float outerRadiusPixels;\n\nvoid main(void) {\n  geometry.worldPosition = instancePositions;\n  outerRadiusPixels = clamp(\n    project_size_to_pixel(radiusScale * instanceRadius),\n    radiusMinPixels, radiusMaxPixels\n  );\n  float lineWidthPixels = clamp(\n    project_size_to_pixel(lineWidthScale * instanceLineWidths),\n    lineWidthMinPixels, lineWidthMaxPixels\n  );\n  outerRadiusPixels += stroked * lineWidthPixels / 2.0;\n  unitPosition = positions.xy;\n  geometry.uv = unitPosition;\n  geometry.pickingColor = instancePickingColors;\n\n  innerUnitRadius = 1.0 - stroked * lineWidthPixels / outerRadiusPixels;\n  \n  vec3 offset = positions * project_pixel_size(outerRadiusPixels);\n  DECKGL_FILTER_SIZE(offset, geometry);\n  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset, geometry.position);\n  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);\n  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);\n  DECKGL_FILTER_COLOR(vFillColor, geometry);\n  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);\n  DECKGL_FILTER_COLOR(vLineColor, geometry);\n}\n",fs:"#define SHADER_NAME scatterplot-layer-fragment-shader\n\nprecision highp float;\n\nuniform bool filled;\nuniform float stroked;\n\nvarying vec4 vFillColor;\nvarying vec4 vLineColor;\nvarying vec2 unitPosition;\nvarying float innerUnitRadius;\nvarying float outerRadiusPixels;\n\nvoid main(void) {\n  geometry.uv = unitPosition;\n\n  float distToCenter = length(unitPosition) * outerRadiusPixels;\n  float inCircle = smoothedge(distToCenter, outerRadiusPixels);\n\n  if (inCircle == 0.0) {\n    discard;\n  }\n\n  if (stroked > 0.5) {\n    float isLine = smoothedge(innerUnitRadius * outerRadiusPixels, distToCenter);\n    if (filled) {\n      gl_FragColor = mix(vFillColor, vLineColor, isLine);\n    } else {\n      if (isLine == 0.0) {\n        discard;\n      }\n      gl_FragColor = vec4(vLineColor.rgb, vLineColor.a * isLine);\n    }\n  } else if (filled) {\n    gl_FragColor = vFillColor;\n  } else {\n    discard;\n  }\n\n  gl_FragColor.a *= inCircle;\n  DECKGL_FILTER_COLOR(gl_FragColor, geometry);\n}\n",modules:[c.a,u.a]})}},{key:"initializeState",value:function(){this.getAttributeManager().addInstanced({instancePositions:{size:3,type:5130,fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceRadius:{size:1,transition:!0,accessor:"getRadius",defaultValue:1},instanceFillColors:{size:this.props.colorFormat.length,transition:!0,normalized:!0,type:5121,accessor:"getFillColor",defaultValue:[0,0,0,255]},instanceLineColors:{size:this.props.colorFormat.length,transition:!0,normalized:!0,type:5121,accessor:"getLineColor",defaultValue:[0,0,0,255]},instanceLineWidths:{size:1,transition:!0,accessor:"getLineWidth",defaultValue:1}})}},{key:"updateState",value:function(t){var n=t.props,i=t.oldProps,a=t.changeFlags;if(Object(s.a)(Object(o.a)(e.prototype),"updateState",this).call(this,{props:n,oldProps:i,changeFlags:a}),a.extensionsChanged){var r=this.context.gl;this.state.model&&this.state.model.delete(),this.setState({model:this._getModel(r)}),this.getAttributeManager().invalidateAll()}}},{key:"draw",value:function(t){var e=t.uniforms,n=this.context.viewport,i=this.props,a=i.radiusUnits,r=i.radiusScale,o=i.radiusMinPixels,s=i.radiusMaxPixels,l=i.stroked,c=i.filled,u=i.lineWidthUnits,f=i.lineWidthScale,h=i.lineWidthMinPixels,g=i.lineWidthMaxPixels,d="pixels"===a?n.metersPerPixel:1,v="pixels"===u?n.metersPerPixel:1;this.state.model.setUniforms(e).setUniforms({stroked:l?1:0,filled:c,radiusScale:r*d,radiusMinPixels:o,radiusMaxPixels:s,lineWidthScale:f*v,lineWidthMinPixels:h,lineWidthMaxPixels:g}).draw()}},{key:"_getModel",value:function(t){return new h.a(t,Object.assign(this.getShaders(),{id:this.props.id,geometry:new g.a({drawMode:6,vertexCount:4,attributes:{positions:{size:3,value:new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0])}}}),isInstanced:!0}))}}]),e}(f.a);p.layerName="ScatterplotLayer",p.defaultProps=v},PNPl:function(t,e,n){"use strict";n.d(e,"a",(function(){return E}));var i=n("ODXe"),a=n("rePB"),r=n("1OyB"),o=n("vuIU"),s=n("md7G"),l=n("foSv"),c=n("ReuC"),u=n("Ji7U"),f=n("rpwb"),h=n("5lV4"),g=n("xBEo"),d=n("f5Sf"),v=n("rxlC"),p=n.n(v),y=n("Jh/b");function x(t,e){for(var n=0,i=0;i<t.length;i++){var a=t[i],r=null,o=e&&e[a];o&&(r=o.width),n+=r}return n}function m(t,e,n){for(var i=[],a=0,r=0,o=0;o<t.length;o++){var s=x(t[o],n);r+s>e&&(a<o&&i.push(t.substring(a,o)),a=o,r=0),r+=s}return a<t.length&&i.push(t.substring(a)),{rows:i,lastRowStartCharIndex:a,lastRowOffsetLeft:r}}function b(t,e,n,i){return"break-all"===e?m(t,n,i):function(t,e,n){for(var i=[],a=0,r=0,o=0,s=null,l=0;l<t.length;l++)if(" "===t[l]?(s=t[l],r=l+1):l+1<t.length&&" "===t[l+1]||l+1===t.length?(s=t.substring(r,l+1),r=l+1):s=null,s){var c=x(s,n);if(o+c>e){var u=r-s.length;if(a<u&&(i.push(t.substring(a,u)),a=u,o=0),c>e){var f=m(s,e,n);f.rows.length>1&&(i=i.concat(f.rows.slice(0,f.rows.length-1))),a+=f.lastRowStartCharIndex,c=f.lastRowOffsetLeft}}o+=c}return a<t.length&&i.push(t.substring(a)),{rows:i,lastRowStartCharIndex:a,lastRowOffsetLeft:o}}(t,n,i)}function _(t,e){for(var n=0,i=0,a=new Array(t.length),r=0;r<t.length;r++){var o=t[r],s=e[o];s?(i||(i=s.height),a[r]=n+s.width/2,n+=s.width):(y.a.warn("Missing character: ".concat(o))(),a[r]=n,n+=32)}return{leftOffsets:a,rowWidth:n,rowHeight:i}}var O=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:5;Object(r.a)(this,t),this.limit=e,this.clear()}return Object(o.a)(t,[{key:"clear",value:function(){this._cache={},this._order=[]}},{key:"get",value:function(t){var e=this._cache[t];return e&&(this._deleteOrder(t),this._appendOrder(t)),e}},{key:"set",value:function(t,e){this._cache[t]?(this.delete(t),this._cache[t]=e,this._appendOrder(t)):(Object.keys(this._cache).length===this.limit&&this.delete(this._order[0]),this._cache[t]=e,this._appendOrder(t))}},{key:"delete",value:function(t){this._cache[t]&&(this._deleteCache(t),this._deleteOrder(t))}},{key:"_deleteCache",value:function(t){delete this._cache[t]}},{key:"_deleteOrder",value:function(t){var e=this._order.findIndex((function(e){return e===t}));e>=0&&this._order.splice(e,1)}},{key:"_appendOrder",value:function(t){this._order.push(t)}}]),t}();var C=function(){for(var t=[],e=32;e<128;e++)t.push(String.fromCharCode(e));return t}(),P=new O(3),w=["fontFamily","fontWeight","characterSet","fontSize","sdf","buffer","cutoff","radius"];function S(t,e){var n=P.get(t);if(!n)return e;var i=[],a=n.mapping,r=Object.keys(a);r=new Set(r);var o=e;return o instanceof Array&&(o=new Set(o)),o.forEach((function(t){r.has(t)||i.push(t)})),i}function k(t,e){for(var n=0;n<t.length;n++)e.data[4*n+3]=t[n]}function M(t,e,n,i){t.font="".concat(i," ").concat(n,"px ").concat(e),t.fillStyle="#000",t.textBaseline="baseline",t.textAlign="left"}var z=function(){function t(e){Object(r.a)(this,t),this.gl=e,this.props={fontFamily:"Monaco, monospace",fontWeight:"normal",characterSet:C,fontSize:64,buffer:2,sdf:!1,cutoff:.25,radius:3},this._key=null,this._texture=new d.a(this.gl)}return Object(o.a)(t,[{key:"finalize",value:function(){this._texture.delete()}},{key:"setProps",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};w.forEach((function(n){n in e&&(t.props[n]=e[n])}));var n=this._key;this._key=this._getKey();var i=S(this._key,this.props.characterSet),a=P.get(this._key);if(a&&0===i.length)this._key!==n&&this._updateTexture(a);else{var r=this._generateFontAtlas(this._key,i,a);this._updateTexture(r),P.set(this._key,r)}}},{key:"_updateTexture",value:function(t){var e,n=t.data,i=t.width,r=t.height;this._texture.width===i&&this._texture.height===r||this._texture.resize({width:i,height:r}),this._texture.setImageData({data:n,width:i,height:r,parameters:(e={},Object(a.a)(e,10242,33071),Object(a.a)(e,10243,33071),e)}),this._texture.generateMipmap()}},{key:"_generateFontAtlas",value:function(t,e,n){var i=this.props,a=i.fontFamily,r=i.fontWeight,o=i.fontSize,s=i.buffer,l=i.sdf,c=i.radius,u=i.cutoff,f=n&&n.data;f||((f=document.createElement("canvas")).width=1024);var h=f.getContext("2d");M(h,a,o,r);var g=function(t){var e=t.characterSet,n=t.getFontWidth,i=t.fontHeight,a=t.buffer,r=t.maxCanvasWidth,o=t.mapping,s=void 0===o?{}:o,l=t.xOffset,c=void 0===l?0:l,u=t.yOffset,f=void 0===u?0:u,h=0,g=c,d=0,v=!0,p=!1,y=void 0;try{for(var x,m=e[Symbol.iterator]();!(v=(x=m.next()).done);v=!0){var b=x.value;if(!s[b]){var _=n(b,d++);g+_+2*a>r&&(g=0,h++),s[b]={x:g+a,y:f+h*(i+2*a)+a,width:_,height:i},g+=_+2*a}}}catch(P){p=!0,y=P}finally{try{v||null==m.return||m.return()}finally{if(p)throw y}}var O,C=i+2*a;return{mapping:s,xOffset:g,yOffset:f+h*C,canvasHeight:(O=f+(h+1)*C,Math.pow(2,Math.ceil(Math.log2(O))))}}(Object.assign({getFontWidth:function(t){return h.measureText(t).width},fontHeight:1.2*o,buffer:s,characterSet:e,maxCanvasWidth:1024},n&&{mapping:n.mapping,xOffset:n.xOffset,yOffset:n.yOffset})),d=g.mapping,v=g.canvasHeight,y=g.xOffset,x=g.yOffset;if(f.height!==v){var m=h.getImageData(0,0,f.width,f.height);f.height=v,h.putImageData(m,0,0)}if(M(h,a,o,r),l){var b=new p.a(o,s,c,u,a,r),_=h.getImageData(0,0,b.size,b.size),O=!0,C=!1,P=void 0;try{for(var w,S=e[Symbol.iterator]();!(O=(w=S.next()).done);O=!0){var z=w.value;k(b.draw(z),_),h.putImageData(_,d[z].x-s,d[z].y-s)}}catch(E){C=!0,P=E}finally{try{O||null==S.return||S.return()}finally{if(C)throw P}}}else{var I=!0,j=!1,A=void 0;try{for(var F,L=e[Symbol.iterator]();!(I=(F=L.next()).done);I=!0){var T=F.value;h.fillText(T,d[T].x,d[T].y+.9*o)}}catch(E){j=!0,A=E}finally{try{I||null==L.return||L.return()}finally{if(j)throw A}}}return{xOffset:y,yOffset:x,mapping:d,data:f,width:f.width,height:f.height}}},{key:"_getKey",value:function(){var t=this.props,e=t.gl,n=t.fontFamily,i=t.fontWeight,a=t.fontSize,r=t.buffer,o=t.sdf,s=t.radius,l=t.cutoff;return o?"".concat(e," ").concat(n," ").concat(i," ").concat(a," ").concat(r," ").concat(s," ").concat(l):"".concat(e," ").concat(n," ").concat(i," ").concat(a," ").concat(r)}},{key:"texture",get:function(){return this._texture}},{key:"mapping",get:function(){var t=P.get(this._key);return t&&t.mapping}},{key:"scale",get:function(){return 1.2}}]),t}();function I(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}var j={fontSize:64,buffer:2,sdf:!1,radius:3,cutoff:.25},A={start:1,middle:0,end:-1},F={top:1,center:0,bottom:-1},L=["fontSize","buffer","sdf","radius","cutoff"],T={billboard:!0,sizeScale:1,sizeUnits:"pixels",sizeMinPixels:0,sizeMaxPixels:Number.MAX_SAFE_INTEGER,backgroundColor:{type:"color",value:null,optional:!0},characterSet:C,fontFamily:"Monaco, monospace",fontWeight:"normal",lineHeight:1,fontSettings:{},wordBreak:"word-break",maxWidth:{type:"number",value:-1},getText:{type:"accessor",value:function(t){return t.text}},getPosition:{type:"accessor",value:function(t){return t.position}},getColor:{type:"accessor",value:[0,0,0,255]},getSize:{type:"accessor",value:32},getAngle:{type:"accessor",value:0},getTextAnchor:{type:"accessor",value:"middle"},getAlignmentBaseline:{type:"accessor",value:"center"},getPixelOffset:{type:"accessor",value:[0,0]}},E=function(t){function e(){return Object(r.a)(this,e),Object(s.a)(this,Object(l.a)(e).apply(this,arguments))}return Object(u.a)(e,t),Object(o.a)(e,[{key:"initializeState",value:function(){this.state={styleVersion:0,fontAtlasManager:new z(this.context.gl)}}},{key:"updateState",value:function(t){var e=t.props,n=t.oldProps,i=t.changeFlags,a=this._fontChanged(n,e);a&&this._updateFontAtlas(n,e);var r=a||e.lineHeight!==n.lineHeight||e.wordBreak!==n.wordBreak||e.maxWidth!==n.maxWidth;(i.dataChanged||i.updateTriggersChanged&&(i.updateTriggersChanged.all||i.updateTriggersChanged.getText))&&this._updateText(),r&&this.setState({styleVersion:this.state.styleVersion+1})}},{key:"finalizeState",value:function(){Object(c.a)(Object(l.a)(e.prototype),"finalizeState",this).call(this),this.state.fontAtlasManager.finalize()}},{key:"getPickingInfo",value:function(t){var e=t.info;return Object.assign(e,{object:e.index>=0?this.props.data[e.index]:null})}},{key:"_updateFontAtlas",value:function(t,e){var n=e.characterSet,i=e.fontSettings,a=e.fontFamily,r=e.fontWeight;this.state.fontAtlasManager.setProps(Object.assign({},j,i,{characterSet:n,fontFamily:a,fontWeight:r})),this.setNeedsRedraw(!0)}},{key:"_fontChanged",value:function(t,e){if(t.fontFamily!==e.fontFamily||t.characterSet!==e.characterSet||t.fontWeight!==e.fontWeight)return!0;if(t.fontSettings===e.fontSettings)return!1;var n=t.fontSettings||{},i=e.fontSettings||{};return L.some((function(t){return n[t]!==i[t]}))}},{key:"_updateText",value:function(){var t,e=this.props.data,n=e.attributes&&e.attributes.getText,i=this.props.getText,r=e.startIndices;if(n&&r){var o=function(t){var e=t.value,n=t.length,i=t.stride,a=t.offset,r=t.startIndices,o=e.BYTES_PER_ELEMENT,s=i?i/o:1,l=a?a/o:0,c=r[n]||Math.floor((e.length-l-o)/s)+1,u=new Array(n),f=e;if(s>1||l>0){f=new e.constructor(c);for(var h=0;h<c;h++)f[h]=e[h*s+l]}for(var g=0;g<n;g++){var d=r[g],v=r[g+1]||c;u[g]=String.fromCodePoint.apply(null,f.subarray(d,v))}return{texts:u,characterCount:c}}(function(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?I(Object(n),!0).forEach((function(e){Object(a.a)(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):I(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}({},ArrayBuffer.isView(n)?{value:n}:n,{length:e.length,startIndices:r})),s=o.texts;t=o.characterCount,i=function(t,e){var n=e.index;return s[n]}}else{var l=Object(f.a)(e),c=l.iterable,u=l.objectInfo;r=[0],t=0;var h=!0,g=!1,d=void 0;try{for(var v,p=c[Symbol.iterator]();!(h=(v=p.next()).done);h=!0){var y=v.value;u.index++,t+=(i(y,u)||"").length,r.push(t)}}catch(x){g=!0,d=x}finally{try{h||null==p.return||p.return()}finally{if(g)throw d}}}this.setState({getText:i,startIndices:r,numInstances:t})}},{key:"getIconOffsets",value:function(t,e){var n=this.state.fontAtlasManager.mapping,a=this.state.getText,r=this.props,o=r.wordBreak,s=r.maxWidth,l=r.lineHeight,c=r.getTextAnchor,u=r.getAlignmentBaseline,f=a(t,e)||"",h=function(t,e,n,i,a){for(var r=new Array(t.length),o=("break-word"===n||"break-all"===n)&&isFinite(i)&&i>0,s=[0,0],l=0,c=0,u=0;u<=t.length;u++){var f=t[u],h=void 0;if("\n"!==f&&void 0!==f||(h=t.slice(c,u)),h){var g=o?b(h,n,i,a).rows:[h],d=!0,v=!1,p=void 0;try{for(var y,x=g[Symbol.iterator]();!(d=(y=x.next()).done);d=!0){var m=_(y.value,a),O=m.rowWidth,C=m.rowHeight,P=m.leftOffsets,w=!0,S=!1,k=void 0;try{for(var M,z=P[Symbol.iterator]();!(w=(M=z.next()).done);w=!0){var I=M.value;r[c++]={x:I,y:l+C/2,rowWidth:O}}}catch(j){S=!0,k=j}finally{try{w||null==z.return||z.return()}finally{if(S)throw k}}l+=C*e,s[0]=o?i:Math.max(s[0],O)}}catch(j){v=!0,p=j}finally{try{d||null==x.return||x.return()}finally{if(v)throw p}}}"\n"===f&&(r[c++]={x:0,y:0,rowWidth:0})}return s[1]=l,{characters:r,size:s}}(f,l,o,s,n),g=h.characters,d=Object(i.a)(h.size,2),v=d[0],p=d[1],y=A["function"==typeof c?c(t,e):c],x=F["function"==typeof u?u(t,e):u],m=new Array(2*f.length),O=0,C=!0,P=!1,w=void 0;try{for(var S,k=g[Symbol.iterator]();!(C=(S=k.next()).done);C=!0){var M=S.value,z=M.rowWidth,I=M.x,j=M.y,L=(1-y)*(v-z)/2;m[O++]=(y-1)*v/2+L+I,m[O++]=(x-1)*p/2+j}}catch(T){P=!0,w=T}finally{try{C||null==k.return||k.return()}finally{if(P)throw w}}return m}},{key:"renderLayers",value:function(){var t=this.state,e=t.startIndices,n=t.numInstances,i=t.getText,a=t.fontAtlasManager,r=a.scale,o=a.texture,s=a.mapping,l=t.styleVersion,c=this.props,u=c.data,f=c._dataDiff,h=c.backgroundColor,d=c.getPosition,v=c.getColor,p=c.getSize,y=c.getAngle,x=c.getPixelOffset,m=c.billboard,b=c.sdf,_=c.sizeScale,O=c.sizeUnits,C=c.sizeMinPixels,P=c.sizeMaxPixels,w=c.transitions,S=c.updateTriggers,k=this.getIconOffsets.bind(this);return new(this.getSubLayerClass("characters",g.a))({sdf:b,iconAtlas:o,iconMapping:s,backgroundColor:h,getPosition:d,getColor:v,getSize:p,getAngle:y,getPixelOffset:x,billboard:m,sizeScale:_*r,sizeUnits:O,sizeMinPixels:C*r,sizeMaxPixels:P*r,transitions:w&&{getPosition:w.getPosition,getAngle:w.getAngle,getColor:w.getColor,getSize:w.getSize,getPixelOffset:S.getPixelOffset}},this.getSubLayerProps({id:"characters",updateTriggers:{getPosition:S.getPosition,getAngle:S.getAngle,getColor:S.getColor,getSize:S.getSize,getPixelOffset:S.getPixelOffset,getIconOffsets:{getText:S.getText,getTextAnchor:S.getTextAnchor,getAlignmentBaseline:S.getAlignmentBaseline,styleVersion:l}}}),{data:u,_dataDiff:f,startIndices:e,numInstances:n,getIconOffsets:k,getIcon:i})}}]),e}(h.a);E.layerName="TextLayer",E.defaultProps=T},kENN:function(t,e,n){"use strict";n.d(e,"a",(function(){return I}));n("IZzc");var i,a=n("1OyB"),r=n("vuIU"),o=n("md7G"),s=n("foSv"),l=n("ReuC"),c=n("Ji7U"),u=n("K4gp"),f=n("BQ9P"),h=n("K7jV"),g=n("ykdB"),d=n("0i8A"),v=(n("p532"),n("rePB")),p=n("MdWm"),y=n("p7wt"),x=n("f5Sf"),m=n("nJkv"),b=n("JBga"),_=n("rpwb"),O=n("Jh/b"),C=function(){},P=(i={},Object(v.a)(i,10241,9987),Object(v.a)(i,10240,9729),Object(v.a)(i,10242,33071),Object(v.a)(i,10243,33071),i);function w(t){return t&&(t.id||t.url)}function S(t,e,n){for(var i=0;i<e.length;i++){var a=e[i],r=a.icon,o=a.xOffset;t[w(r)]=Object.assign({},r,{x:o,y:n})}}var k=function(){function t(e,n){var i=n.onUpdate,r=void 0===i?C:i;Object(a.a)(this,t),this.gl=e,this.onUpdate=r,this._loadOptions=null,this._getIcon=null,this._texture=null,this._externalTexture=null,this._mapping={},this._pendingCount=0,this._autoPacking=!1,this._xOffset=0,this._yOffset=0,this._rowHeight=0,this._buffer=4,this._canvasWidth=1024,this._canvasHeight=0,this._canvas=null}return Object(r.a)(t,[{key:"finalize",value:function(){this._texture&&this._texture.delete()}},{key:"getTexture",value:function(){return this._texture||this._externalTexture}},{key:"getIconMapping",value:function(t){var e=this._autoPacking?w(t):t;return this._mapping[e]||{}}},{key:"setProps",value:function(t){var e=t.loadOptions,n=t.autoPacking,i=t.iconAtlas,a=t.iconMapping,r=t.data,o=t.getIcon;e&&(this._loadOptions=e),void 0!==n&&(this._autoPacking=n),o&&(this._getIcon=o),a&&(this._mapping=a),i&&this._updateIconAtlas(i),this._autoPacking&&(r||o)&&"undefined"!=typeof document&&(this._canvas=this._canvas||document.createElement("canvas"),this._updateAutoPacking(r))}},{key:"_updateIconAtlas",value:function(t){this._texture&&(this._texture.delete(),this._texture=null),t instanceof x.a?(t.setParameters(P),this._externalTexture=t,this.onUpdate()):t&&(this._texture=new x.a(this.gl,{data:t,parameters:P}),this.onUpdate())}},{key:"_updateAutoPacking",value:function(t){var e,n,i,a,r,o,s=Object.values(function(t,e,n){if(!t||!e)return null;n=n||{};var i={},a=Object(_.a)(t),r=a.iterable,o=a.objectInfo,s=!0,l=!1,c=void 0;try{for(var u,f=r[Symbol.iterator]();!(s=(u=f.next()).done);s=!0){var h=u.value;o.index++;var g=e(h,o),d=w(g);if(!g)throw new Error("Icon is missing.");if(!g.url)throw new Error("Icon url is missing.");i[d]||n[d]&&g.url===n[d].url||(i[d]=g)}}catch(v){l=!0,c=v}finally{try{s||null==f.return||f.return()}finally{if(l)throw c}}return i}(t,this._getIcon,this._mapping)||{});if(s.length>0){var l=function(t){for(var e,n=t.icons,i=t.buffer,a=t.mapping,r=void 0===a?{}:a,o=t.xOffset,s=void 0===o?0:o,l=t.yOffset,c=void 0===l?0:l,u=t.rowHeight,f=void 0===u?0:u,h=t.canvasWidth,g=[],d=0;d<n.length;d++){var v=n[d];if(!r[w(v)]){var p=v.height,y=v.width;s+y+i>h&&(S(r,g,c),s=0,c=f+c+i,f=0,g=[]),g.push({icon:v,xOffset:s}),s=s+y+i,f=Math.max(f,p)}}return g.length>0&&S(r,g,c),{mapping:r,rowHeight:f,xOffset:s,yOffset:c,canvasWidth:h,canvasHeight:(e=f+c+i,Math.pow(2,Math.ceil(Math.log2(e))))}}({icons:s,buffer:this._buffer,canvasWidth:this._canvasWidth,mapping:this._mapping,rowHeight:this._rowHeight,xOffset:this._xOffset,yOffset:this._yOffset}),c=l.mapping,u=l.xOffset,f=l.yOffset,h=l.rowHeight,g=l.canvasHeight;this._rowHeight=h,this._mapping=c,this._xOffset=u,this._yOffset=f,this._canvasHeight=g,this._texture||(this._texture=new x.a(this.gl,{width:this._canvasWidth,height:this._canvasHeight,parameters:P})),this._texture.height!==this._canvasHeight&&(this._texture=(this.gl,e=this._texture,n=this._canvasWidth,i=this._canvasHeight,a=e.width,r=e.height,o=Object(p.a)(e,{width:n,height:i}),Object(y.b)(e,o,{targetY:0,width:a,height:r}),e.delete(),o)),this.onUpdate(),this._loadIcons(s)}}},{key:"_loadIcons",value:function(t){var e=this,n=this._canvas.getContext("2d"),i=!0,a=!1,r=void 0;try{for(var o,s=function(){var t=o.value;e._pendingCount++,Object(b.a)(t.url,m.a,e._loadOptions).then((function(i){var a=w(t),r=e._mapping[a],o=r.x,s=r.y,l=r.width,c=r.height,u=function(t,e,n,i){return n===e.width&&i===e.height?e:(t.canvas.height=i,t.canvas.width=n,t.clearRect(0,0,t.canvas.width,t.canvas.height),t.drawImage(e,0,0,e.width,e.height,0,0,n,i),t.canvas)}(n,i,l,c);e._texture.setSubImageData({data:u,x:o,y:s,width:l,height:c}),e._texture.generateMipmap(),e.onUpdate()})).catch((function(t){O.a.error(t)()})).finally((function(){e._pendingCount--}))},l=t[Symbol.iterator]();!(i=(o=l.next()).done);i=!0)s()}catch(c){a=!0,r=c}finally{try{i||null==l.return||l.return()}finally{if(a)throw r}}}},{key:"isLoaded",get:function(){return 0===this._pendingCount}}]),t}(),M=[0,0,0,255],z={iconAtlas:{type:"object",value:null,async:!0},iconMapping:{type:"object",value:{},async:!0},sizeScale:{type:"number",value:1,min:0},billboard:!0,sizeUnits:"pixels",sizeMinPixels:{type:"number",min:0,value:0},sizeMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},alphaCutoff:{type:"number",value:.05,min:0,max:1},getPosition:{type:"accessor",value:function(t){return t.position}},getIcon:{type:"accessor",value:function(t){return t.icon}},getColor:{type:"accessor",value:M},getSize:{type:"accessor",value:1},getAngle:{type:"accessor",value:0},getPixelOffset:{type:"accessor",value:[0,0]}},I=function(t){function e(){return Object(a.a)(this,e),Object(o.a)(this,Object(s.a)(e).apply(this,arguments))}return Object(c.a)(e,t),Object(r.a)(e,[{key:"getShaders",value:function(){return Object(l.a)(Object(s.a)(e.prototype),"getShaders",this).call(this,{vs:"#define SHADER_NAME icon-layer-vertex-shader\n\nattribute vec2 positions;\n\nattribute vec3 instancePositions;\nattribute vec3 instancePositions64Low;\nattribute float instanceSizes;\nattribute float instanceAngles;\nattribute vec4 instanceColors;\nattribute vec3 instancePickingColors;\nattribute vec4 instanceIconFrames;\nattribute float instanceColorModes;\nattribute vec2 instanceOffsets;\nattribute vec2 instancePixelOffset;\n\nuniform float sizeScale;\nuniform vec2 iconsTextureDim;\nuniform float sizeMinPixels;\nuniform float sizeMaxPixels;\nuniform bool billboard;\n\nvarying float vColorMode;\nvarying vec4 vColor;\nvarying vec2 vTextureCoords;\nvarying vec2 uv;\n\nvec2 rotate_by_angle(vec2 vertex, float angle) {\n  float angle_radian = angle * PI / 180.0;\n  float cos_angle = cos(angle_radian);\n  float sin_angle = sin(angle_radian);\n  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);\n  return rotationMatrix * vertex;\n}\n\nvoid main(void) {\n  geometry.worldPosition = instancePositions;\n  geometry.uv = positions;\n  geometry.pickingColor = instancePickingColors;\n  uv = positions;\n\n  vec2 iconSize = instanceIconFrames.zw;\n  float sizePixels = clamp(\n    project_size_to_pixel(instanceSizes * sizeScale), \n    sizeMinPixels, sizeMaxPixels\n  );\n  float instanceScale = iconSize.y == 0.0 ? 0.0 : sizePixels / iconSize.y;\n  vec2 pixelOffset = positions / 2.0 * iconSize + instanceOffsets;\n  pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * instanceScale;\n  pixelOffset += instancePixelOffset;\n  pixelOffset.y *= -1.0;\n\n  if (billboard)  {\n    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);\n    vec3 offset = vec3(pixelOffset, 0.0);\n    DECKGL_FILTER_SIZE(offset, geometry);\n    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);\n\n  } else {\n    vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);\n    DECKGL_FILTER_SIZE(offset_common, geometry);\n    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position); \n  }\n  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);\n\n  vTextureCoords = mix(\n    instanceIconFrames.xy,\n    instanceIconFrames.xy + iconSize,\n    (positions.xy + 1.0) / 2.0\n  ) / iconsTextureDim;\n\n  vColor = instanceColors;\n  DECKGL_FILTER_COLOR(vColor, geometry);\n\n  vColorMode = instanceColorModes;\n}\n",fs:"#define SHADER_NAME icon-layer-fragment-shader\n\nprecision highp float;\n\nuniform float opacity;\nuniform sampler2D iconsTexture;\nuniform float alphaCutoff;\n\nvarying float vColorMode;\nvarying vec4 vColor;\nvarying vec2 vTextureCoords;\nvarying vec2 uv;\n\nvoid main(void) {\n  geometry.uv = uv;\n\n  vec4 texColor = texture2D(iconsTexture, vTextureCoords);\n  vec3 color = mix(texColor.rgb, vColor.rgb, vColorMode);\n  float a = texColor.a * opacity * vColor.a;\n\n  if (a < alphaCutoff) {\n    discard;\n  }\n\n  gl_FragColor = vec4(color, a);\n  DECKGL_FILTER_COLOR(gl_FragColor, geometry);\n}\n",modules:[u.a,f.a]})}},{key:"initializeState",value:function(){var t=this;this.state={iconManager:new k(this.context.gl,{onUpdate:function(){return t._onUpdate()}})},this.getAttributeManager().addInstanced({instancePositions:{size:3,type:5130,fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceSizes:{size:1,transition:!0,accessor:"getSize",defaultValue:1},instanceOffsets:{size:2,accessor:"getIcon",transform:this.getInstanceOffset},instanceIconFrames:{size:4,accessor:"getIcon",transform:this.getInstanceIconFrame},instanceColorModes:{size:1,type:5121,accessor:"getIcon",transform:this.getInstanceColorMode},instanceColors:{size:this.props.colorFormat.length,type:5121,normalized:!0,transition:!0,accessor:"getColor",defaultValue:M},instanceAngles:{size:1,transition:!0,accessor:"getAngle"},instancePixelOffset:{size:2,transition:!0,accessor:"getPixelOffset"}})}},{key:"updateState",value:function(t){var n=t.oldProps,i=t.props,a=t.changeFlags;Object(l.a)(Object(s.a)(e.prototype),"updateState",this).call(this,{props:i,oldProps:n,changeFlags:a});var r=this.getAttributeManager(),o=i.iconAtlas,c=i.iconMapping,u=i.data,f=i.getIcon,h=this.state.iconManager;h.setProps({loadOptions:i.loadOptions});var g=!1;if(o||this.internalState.isAsyncPropLoading("iconAtlas")?(n.iconAtlas!==i.iconAtlas&&h.setProps({iconAtlas:o,autoPacking:!1}),n.iconMapping!==i.iconMapping&&(h.setProps({iconMapping:c}),g=!0)):h.setProps({autoPacking:!0}),(a.dataChanged||a.updateTriggersChanged&&(a.updateTriggersChanged.all||a.updateTriggersChanged.getIcon))&&(h.setProps({data:u,getIcon:f}),g=!0),g&&(r.invalidate("instanceOffsets"),r.invalidate("instanceIconFrames"),r.invalidate("instanceColorModes")),a.extensionsChanged){var d=this.context.gl;this.state.model&&this.state.model.delete(),this.setState({model:this._getModel(d)}),r.invalidateAll()}}},{key:"finalizeState",value:function(){Object(l.a)(Object(s.a)(e.prototype),"finalizeState",this).call(this),this.state.iconManager.finalize()}},{key:"draw",value:function(t){var e=t.uniforms,n=this.props,i=n.sizeScale,a=n.sizeMinPixels,r=n.sizeMaxPixels,o=n.sizeUnits,s=n.billboard,l=n.alphaCutoff,c=this.state.iconManager,u=this.context.viewport,f=c.getTexture();f&&f.loaded&&this.state.model.setUniforms(Object.assign({},e,{iconsTexture:f,iconsTextureDim:[f.width,f.height],sizeScale:i*("pixels"===o?u.metersPerPixel:1),sizeMinPixels:a,sizeMaxPixels:r,billboard:s,alphaCutoff:l})).draw()}},{key:"_getModel",value:function(t){return new g.a(t,Object.assign({},this.getShaders(),{id:this.props.id,geometry:new d.a({drawMode:6,attributes:{positions:{size:2,value:new Float32Array([-1,-1,-1,1,1,1,1,-1])}}}),isInstanced:!0}))}},{key:"_onUpdate",value:function(){this.setNeedsRedraw()}},{key:"getInstanceOffset",value:function(t){var e=this.state.iconManager.getIconMapping(t);return[e.width/2-e.anchorX||0,e.height/2-e.anchorY||0]}},{key:"getInstanceColorMode",value:function(t){return this.state.iconManager.getIconMapping(t).mask?1:0}},{key:"getInstanceIconFrame",value:function(t){var e=this.state.iconManager.getIconMapping(t);return[e.x||0,e.y||0,e.width||0,e.height||0]}},{key:"isLoaded",get:function(){return Object(l.a)(Object(s.a)(e.prototype),"isLoaded",this)&&this.state.iconManager.isLoaded}}]),e}(h.a);I.layerName="IconLayer",I.defaultProps=z},rxlC:function(t,e,n){"use strict";n("IZzc"),t.exports=a,t.exports.default=a;var i=1e20;function a(t,e,n,i,a,r){this.fontSize=t||24,this.buffer=void 0===e?3:e,this.cutoff=i||.25,this.fontFamily=a||"sans-serif",this.fontWeight=r||"normal",this.radius=n||8;var o=this.size=this.fontSize+2*this.buffer,s=o+2*this.buffer;this.canvas=document.createElement("canvas"),this.canvas.width=this.canvas.height=o,this.ctx=this.canvas.getContext("2d"),this.ctx.font=this.fontWeight+" "+this.fontSize+"px "+this.fontFamily,this.ctx.textAlign="left",this.ctx.fillStyle="black",this.gridOuter=new Float64Array(s*s),this.gridInner=new Float64Array(s*s),this.f=new Float64Array(s),this.z=new Float64Array(s+1),this.v=new Uint16Array(s),this.useMetrics=void 0!==this.ctx.measureText("A").actualBoundingBoxLeft,this.middle=Math.round(o/2*(navigator.userAgent.indexOf("Gecko/")>=0?1.2:1))}function r(t,e,n,i,a,r){for(var s=0;s<e;s++)o(t,s,e,n,i,a,r);for(var l=0;l<n;l++)o(t,l*e,1,e,i,a,r)}function o(t,e,n,a,r,o,s){var l,c,u,f;for(o[0]=0,s[0]=-i,s[1]=i,l=0;l<a;l++)r[l]=t[e+l*n];for(l=1,c=0,u=0;l<a;l++){do{f=o[c],u=(r[l]-r[f]+l*l-f*f)/(l-f)/2}while(u<=s[c]&&--c>-1);o[++c]=l,s[c]=u,s[c+1]=i}for(l=0,c=0;l<a;l++){for(;s[c+1]<l;)c++;f=o[c],t[e+l*n]=r[f]+(l-f)*(l-f)}}a.prototype._draw=function(t,e){var n,a,o,s,l,c,u,f,h,g=this.ctx.measureText(t),d=g.width,v=2*this.buffer;e&&this.useMetrics?(l=Math.floor(g.actualBoundingBoxAscent),f=this.buffer+Math.ceil(g.actualBoundingBoxAscent),c=this.buffer,u=this.buffer,n=(a=Math.min(this.size,Math.ceil(g.actualBoundingBoxRight-g.actualBoundingBoxLeft)))+v,o=(s=Math.min(this.size-c,Math.ceil(g.actualBoundingBoxAscent+g.actualBoundingBoxDescent)))+v,this.ctx.textBaseline="alphabetic"):(n=a=this.size,o=s=this.size,l=19*this.fontSize/24,c=u=0,f=this.middle,this.ctx.textBaseline="middle"),a&&s&&(this.ctx.clearRect(u,c,a,s),this.ctx.fillText(t,this.buffer,f),h=this.ctx.getImageData(u,c,a,s));var p=new Uint8ClampedArray(n*o);return function(t,e,n,a,r,o,s){o.fill(i,0,e*n),s.fill(0,0,e*n);for(var l=(e-a)/2,c=0;c<r;c++)for(var u=0;u<a;u++){var f=(c+l)*e+u+l,h=t.data[4*(c*a+u)+3]/255;if(1===h)o[f]=0,s[f]=i;else if(0===h)o[f]=i,s[f]=0;else{var g=Math.max(0,.5-h),d=Math.max(0,h-.5);o[f]=g*g,s[f]=d*d}}}(h,n,o,a,s,this.gridOuter,this.gridInner),r(this.gridOuter,n,o,this.f,this.v,this.z),r(this.gridInner,n,o,this.f,this.v,this.z),function(t,e,n,i,a,r,o){for(var s=0;s<e*n;s++){var l=Math.sqrt(i[s])-Math.sqrt(a[s]);t[s]=Math.round(255-255*(l/r+o))}}(p,n,o,this.gridOuter,this.gridInner,this.radius,this.cutoff),{data:p,metrics:{width:a,height:s,sdfWidth:n,sdfHeight:o,top:l,left:0,advance:d}}},a.prototype.draw=function(t){return this._draw(t,!1).data},a.prototype.drawWithMetrics=function(t){return this._draw(t,!0)}},xBEo:function(t,e,n){"use strict";n.d(e,"a",(function(){return f}));var i=n("1OyB"),a=n("vuIU"),r=n("md7G"),o=n("foSv"),s=n("ReuC"),l=n("Ji7U"),c=n("kENN"),u=[],f=function(t){function e(){return Object(i.a)(this,e),Object(r.a)(this,Object(o.a)(e).apply(this,arguments))}return Object(l.a)(e,t),Object(a.a)(e,[{key:"getShaders",value:function(){return Object.assign({},Object(s.a)(Object(o.a)(e.prototype),"getShaders",this).call(this),{inject:{"vs:#decl":"\n  uniform float gamma;\n  varying float vGamma;\n","vs:#main-end":"\n  vGamma = gamma / (sizeScale * iconSize.y);\n"},fs:"#define SHADER_NAME multi-icon-layer-fragment-shader\n\nprecision highp float;\n\nuniform float opacity;\nuniform sampler2D iconsTexture;\nuniform float buffer;\nuniform bool sdf;\nuniform float alphaCutoff;\nuniform bool shouldDrawBackground;\nuniform vec3 backgroundColor;\n\nvarying vec4 vColor;\nvarying vec2 vTextureCoords;\nvarying float vGamma;\nvarying vec2 uv;\n\nvoid main(void) {\n  geometry.uv = uv;\n\n  if (!picking_uActive) {\n    float alpha = texture2D(iconsTexture, vTextureCoords).a;\n    if (sdf) {\n      alpha = smoothstep(buffer - vGamma, buffer + vGamma, alpha);\n    }\n    float a = alpha * vColor.a;\n    \n    if (a < alphaCutoff) {\n      if (shouldDrawBackground) {\n        gl_FragColor = vec4(backgroundColor, vColor.a);\n        return;\n      } else {\n        discard;\n      }\n    }\n\n    if (shouldDrawBackground) {\n      gl_FragColor = vec4(mix(backgroundColor, vColor.rgb, alpha), vColor.a * opacity);\n    } else {\n      gl_FragColor = vec4(vColor.rgb, a * opacity);\n    }\n  }\n\n  DECKGL_FILTER_COLOR(gl_FragColor, geometry);\n}\n"})}},{key:"initializeState",value:function(){var t=this;Object(s.a)(Object(o.a)(e.prototype),"initializeState",this).call(this),this.getAttributeManager().addInstanced({instanceOffsets:{size:2,accessor:"getIconOffsets"},instancePickingColors:{type:5121,size:3,accessor:function(e,n){var i=n.index,a=n.target;return t.encodePickingColor(i,a)}}})}},{key:"updateState",value:function(t){Object(s.a)(Object(o.a)(e.prototype),"updateState",this).call(this,t);var n=t.oldProps,i=t.props;if(i.backgroundColor!==n.backgroundColor){var a=Array.isArray(i.backgroundColor)?i.backgroundColor.map((function(t){return t/255})).slice(0,3):null;this.setState({backgroundColor:a})}}},{key:"draw",value:function(t){var n=t.uniforms,i=this.props.sdf,a=this.state.backgroundColor,r=Array.isArray(a);Object(s.a)(Object(o.a)(e.prototype),"draw",this).call(this,{uniforms:Object.assign({},n,{buffer:.75,gamma:.2,sdf:Boolean(i),backgroundColor:a||[0,0,0],shouldDrawBackground:r})})}},{key:"getInstanceOffset",value:function(t){var n=this;return t?Array.from(t).map((function(t){return Object(s.a)(Object(o.a)(e.prototype),"getInstanceOffset",n).call(n,t)})):u}},{key:"getInstanceColorMode",value:function(t){return 1}},{key:"getInstanceIconFrame",value:function(t){var n=this;return t?Array.from(t).map((function(t){return Object(s.a)(Object(o.a)(e.prototype),"getInstanceIconFrame",n).call(n,t)})):u}}]),e}(c.a);f.layerName="MultiIconLayer",f.defaultProps={backgroundColor:{type:"color",value:null,optional:!0},getIconOffsets:{type:"accessor",value:function(t){return t.offsets}}}}}]);