(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{"+7vx":function(e,i,t){"use strict";t.d(i,"a",(function(){return h}));t("IZzc");var n=t("1OyB"),a=t("vuIU"),o=t("md7G"),r=t("foSv"),s=t("ReuC"),l=t("Ji7U"),c=t("K4gp"),u=t("BQ9P"),d=t("K7jV"),g=t("ykdB"),m=t("0i8A"),p=[0,0,0,255],f={radiusUnits:"meters",radiusScale:{type:"number",min:0,value:1},radiusMinPixels:{type:"number",min:0,value:0},radiusMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},lineWidthUnits:"meters",lineWidthScale:{type:"number",min:0,value:1},lineWidthMinPixels:{type:"number",min:0,value:0},lineWidthMaxPixels:{type:"number",min:0,value:Number.MAX_SAFE_INTEGER},stroked:!1,filled:!0,getPosition:{type:"accessor",value:function(e){return e.position}},getRadius:{type:"accessor",value:1},getFillColor:{type:"accessor",value:p},getLineColor:{type:"accessor",value:p},getLineWidth:{type:"accessor",value:1},strokeWidth:{deprecatedFor:"getLineWidth"},outline:{deprecatedFor:"stroked"},getColor:{deprecatedFor:["getFillColor","getLineColor"]}},h=function(e){function i(){return Object(n.a)(this,i),Object(o.a)(this,Object(r.a)(i).apply(this,arguments))}return Object(l.a)(i,e),Object(a.a)(i,[{key:"getShaders",value:function(e){return Object(s.a)(Object(r.a)(i.prototype),"getShaders",this).call(this,{vs:"#define SHADER_NAME scatterplot-layer-vertex-shader\n\nattribute vec3 positions;\n\nattribute vec3 instancePositions;\nattribute vec3 instancePositions64Low;\nattribute float instanceRadius;\nattribute float instanceLineWidths;\nattribute vec4 instanceFillColors;\nattribute vec4 instanceLineColors;\nattribute vec3 instancePickingColors;\n\nuniform float opacity;\nuniform float radiusScale;\nuniform float radiusMinPixels;\nuniform float radiusMaxPixels;\nuniform float lineWidthScale;\nuniform float lineWidthMinPixels;\nuniform float lineWidthMaxPixels;\nuniform float stroked;\nuniform bool filled;\n\nvarying vec4 vFillColor;\nvarying vec4 vLineColor;\nvarying vec2 unitPosition;\nvarying float innerUnitRadius;\nvarying float outerRadiusPixels;\n\nvoid main(void) {\n  geometry.worldPosition = instancePositions;\n  outerRadiusPixels = clamp(\n    project_size_to_pixel(radiusScale * instanceRadius),\n    radiusMinPixels, radiusMaxPixels\n  );\n  float lineWidthPixels = clamp(\n    project_size_to_pixel(lineWidthScale * instanceLineWidths),\n    lineWidthMinPixels, lineWidthMaxPixels\n  );\n  outerRadiusPixels += stroked * lineWidthPixels / 2.0;\n  unitPosition = positions.xy;\n  geometry.uv = unitPosition;\n  geometry.pickingColor = instancePickingColors;\n\n  innerUnitRadius = 1.0 - stroked * lineWidthPixels / outerRadiusPixels;\n  \n  vec3 offset = positions * project_pixel_size(outerRadiusPixels);\n  DECKGL_FILTER_SIZE(offset, geometry);\n  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset, geometry.position);\n  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);\n  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);\n  DECKGL_FILTER_COLOR(vFillColor, geometry);\n  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);\n  DECKGL_FILTER_COLOR(vLineColor, geometry);\n}\n",fs:"#define SHADER_NAME scatterplot-layer-fragment-shader\n\nprecision highp float;\n\nuniform bool filled;\nuniform float stroked;\n\nvarying vec4 vFillColor;\nvarying vec4 vLineColor;\nvarying vec2 unitPosition;\nvarying float innerUnitRadius;\nvarying float outerRadiusPixels;\n\nvoid main(void) {\n  geometry.uv = unitPosition;\n\n  float distToCenter = length(unitPosition) * outerRadiusPixels;\n  float inCircle = smoothedge(distToCenter, outerRadiusPixels);\n\n  if (inCircle == 0.0) {\n    discard;\n  }\n\n  if (stroked > 0.5) {\n    float isLine = smoothedge(innerUnitRadius * outerRadiusPixels, distToCenter);\n    if (filled) {\n      gl_FragColor = mix(vFillColor, vLineColor, isLine);\n    } else {\n      if (isLine == 0.0) {\n        discard;\n      }\n      gl_FragColor = vec4(vLineColor.rgb, vLineColor.a * isLine);\n    }\n  } else if (filled) {\n    gl_FragColor = vFillColor;\n  } else {\n    discard;\n  }\n\n  gl_FragColor.a *= inCircle;\n  DECKGL_FILTER_COLOR(gl_FragColor, geometry);\n}\n",modules:[c.a,u.a]})}},{key:"initializeState",value:function(){this.getAttributeManager().addInstanced({instancePositions:{size:3,type:5130,fp64:this.use64bitPositions(),transition:!0,accessor:"getPosition"},instanceRadius:{size:1,transition:!0,accessor:"getRadius",defaultValue:1},instanceFillColors:{size:this.props.colorFormat.length,transition:!0,normalized:!0,type:5121,accessor:"getFillColor",defaultValue:[0,0,0,255]},instanceLineColors:{size:this.props.colorFormat.length,transition:!0,normalized:!0,type:5121,accessor:"getLineColor",defaultValue:[0,0,0,255]},instanceLineWidths:{size:1,transition:!0,accessor:"getLineWidth",defaultValue:1}})}},{key:"updateState",value:function(e){var t=e.props,n=e.oldProps,a=e.changeFlags;if(Object(s.a)(Object(r.a)(i.prototype),"updateState",this).call(this,{props:t,oldProps:n,changeFlags:a}),a.extensionsChanged){var o=this.context.gl;this.state.model&&this.state.model.delete(),this.setState({model:this._getModel(o)}),this.getAttributeManager().invalidateAll()}}},{key:"draw",value:function(e){var i=e.uniforms,t=this.context.viewport,n=this.props,a=n.radiusUnits,o=n.radiusScale,r=n.radiusMinPixels,s=n.radiusMaxPixels,l=n.stroked,c=n.filled,u=n.lineWidthUnits,d=n.lineWidthScale,g=n.lineWidthMinPixels,m=n.lineWidthMaxPixels,p="pixels"===a?t.metersPerPixel:1,f="pixels"===u?t.metersPerPixel:1;this.state.model.setUniforms(i).setUniforms({stroked:l?1:0,filled:c,radiusScale:o*p,radiusMinPixels:r,radiusMaxPixels:s,lineWidthScale:d*f,lineWidthMinPixels:g,lineWidthMaxPixels:m}).draw()}},{key:"_getModel",value:function(e){return new g.a(e,Object.assign(this.getShaders(),{id:this.props.id,geometry:new m.a({drawMode:6,vertexCount:4,attributes:{positions:{size:3,value:new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0])}}}),isInstanced:!0}))}}]),i}(d.a);h.layerName="ScatterplotLayer",h.defaultProps=f},P59B:function(e,i,t){"use strict";t.r(i),t.d(i,"default",(function(){return x}));var n=t("q1tI"),a=t.n(n),o=t("yYqN"),r=t("Ai+L"),s=t("etlt"),l=t("kqDl"),c=t("kAh0"),u=t("Qj7A"),d=t("DCxL"),g={latitude:46.24,longitude:-122.18,zoom:11.5,bearing:140,pitch:60},m={rScaler:6553.6,gScaler:25.6,bScaler:.1,offset:-1e4},p=new c.a({cameraKeyframe:{timings:[0,6e3,7e3,8e3,14e3],keyframes:[{latitude:46.24,longitude:-122.18,zoom:11.5,bearing:140,pitch:60},{latitude:46.24,longitude:-122.18,zoom:11.5,bearing:0,pitch:60},{latitude:36.1101,longitude:-112.1906,zoom:12.5,pitch:20,bearing:15},{latitude:36.1101,longitude:-112.1906,zoom:12.5,pitch:20,bearing:15},{latitude:36.1101,longitude:-112.1906,zoom:12.5,pitch:60,bearing:180}],easings:[d.a.easeInOut,u.a,d.a.easeInOut,d.a.easeInOut]},layerKeyframes:[{id:"terrain",features:["r","g","b"],keyframes:[{r:255,g:255,b:255},{r:255,g:0,b:0},{r:255,g:255,b:0},{r:0,g:255,b:0},{r:0,g:255,b:255},{r:0,g:0,b:255},{r:255,g:0,b:255},{r:255,g:255,b:255}],timings:[0,2e3,4e3,6e3,8e3,1e4,12e3,14e3],easings:d.a.linear}]}),f=640,h=480,v={webm:{quality:.8},png:{archive:"zip"},jpeg:{archive:"zip",quality:.8},gif:{sampleInterval:1e3,width:f,height:h}},b={start:0,end:15e3,framerate:30},y=function(e){var i=e.children;return a.a.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"100%",position:"relative",backgroundColor:"#11183c"}},i)};function x(){var e=Object(n.useRef)(null),i=Object(n.useMemo)((function(){return e.current&&e.current.deck}),[e.current]),t=Object(n.useState)(!1),c=t[0],u=t[1],d=Object(n.useState)(!1),x=d[0],P=d[1],C=Object(s.b)();Object(n.useEffect)((function(){p.setGetLayers((function(e){var i=e.layerKeyframes.terrain.getFrame();return[new r.a({id:"terrain",minZoom:0,maxZoom:23,strategy:"no-overlap",elevationDecoder:m,elevationData:"https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hyaXNqb2J5IiwiYSI6ImNrbHU2bTl1NzAzb2Iyb255MjR3ZXkxbWEifQ.5tUEq0dh7MX_miZumlcbIQ",texture:x?null:"https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoiY2hyaXNqb2J5IiwiYSI6ImNrbHU2bTl1NzAzb2Iyb255MjR3ZXkxbWEifQ.5tUEq0dh7MX_miZumlcbIQ",wireframe:!1,color:[i.r,i.g,i.b]})]}))}),[x]);var L=Object(s.a)(p,g),_=L.adapter,F=L.layers,k=L.cameraFrame,R=L.setCameraFrame;return a.a.createElement(y,null,a.a.createElement("div",{style:{position:"relative"}},a.a.createElement(o.a,Object.assign({ref:e,style:{position:"unset"},viewState:k,onViewStateChange:function(e){var i=e.viewState;R(i)},controller:!1,width:f,height:h,layers:F},_.getProps({deck:i,onNextFrame:C})))),a.a.createElement(l.a,{adapter:_,busy:c,setBusy:u,formatConfigs:v,timecode:b},a.a.createElement("div",{style:{width:"100%"}},a.a.createElement("label",{style:{fontFamily:"sans-serif",width:"40%",marginRight:"10%"}},"Rainbow Texture"),a.a.createElement("input",{type:"checkbox",checked:x,onChange:function(){return P(!x)}}))))}}}]);