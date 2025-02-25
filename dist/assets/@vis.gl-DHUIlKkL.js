import{a as v,r as s}from"./react-DBUcqle2.js";import{r as D}from"./react-dom-X2Ryj6od.js";import{i as F}from"./fast-deep-equal-BRC8syP0.js";function T(e,n){if(typeof e!="object"||!e)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var o=t.call(e,n);if(typeof o!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}function R(e){var n=T(e,"string");return typeof n=="symbol"?n:String(n)}function I(){return I=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},I.apply(this,arguments)}function M(e,n){if(e==null)return{};var t={},o=Object.keys(e),r,a;for(a=0;a<o.length;a++)r=o[a],!(n.indexOf(r)>=0)&&(t[r]=e[r]);return t}const w={NOT_LOADED:"NOT_LOADED",LOADING:"LOADING",LOADED:"LOADED",FAILED:"FAILED",AUTH_FAILURE:"AUTH_FAILURE"},U="https://maps.googleapis.com/maps/api/js";class _{static async load(n,t){var o;const r=n.libraries?n.libraries.split(","):[],a=this.serializeParams(n);this.listeners.push(t),(o=window.google)!=null&&(o=o.maps)!=null&&o.importLibrary?(this.serializedApiParams||(this.loadingStatus=w.LOADED),this.notifyLoadingStatusListeners()):(this.serializedApiParams=a,this.initImportLibrary(n)),this.serializedApiParams&&this.serializedApiParams!==a&&console.warn("[google-maps-api-loader] The maps API has already been loaded with different parameters and will not be loaded again. Refresh the page for new values to have effect.");const c=["maps",...r];await Promise.all(c.map(i=>google.maps.importLibrary(i)))}static serializeParams(n){return[n.v,n.key,n.language,n.region,n.authReferrerPolicy,n.solutionChannel].join("/")}static initImportLibrary(n){if(window.google||(window.google={}),window.google.maps||(window.google.maps={}),window.google.maps.importLibrary){console.error("[google-maps-api-loader-internal]: initImportLibrary must only be called once");return}let t=null;const o=()=>t||(t=new Promise((r,a)=>{var c;const i=document.createElement("script"),u=new URLSearchParams;for(const[g,d]of Object.entries(n)){const f=g.replace(/[A-Z]/g,p=>"_"+p[0].toLowerCase());u.set(f,d)}u.set("loading","async"),u.set("callback","__googleMapsCallback__"),i.async=!0,i.src=U+"?"+u.toString(),i.nonce=((c=document.querySelector("script[nonce]"))==null?void 0:c.nonce)||"",i.onerror=()=>{this.loadingStatus=w.FAILED,this.notifyLoadingStatusListeners(),a(new Error("The Google Maps JavaScript API could not load."))},window.__googleMapsCallback__=()=>{this.loadingStatus=w.LOADED,this.notifyLoadingStatusListeners(),r()},window.gm_authFailure=()=>{this.loadingStatus=w.AUTH_FAILURE,this.notifyLoadingStatusListeners()},this.loadingStatus=w.LOADING,this.notifyLoadingStatusListeners(),document.head.append(i)}),t);google.maps.importLibrary=r=>o().then(()=>google.maps.importLibrary(r))}static notifyLoadingStatusListeners(){for(const n of this.listeners)n(this.loadingStatus)}}_.loadingStatus=w.NOT_LOADED;_.serializedApiParams=void 0;_.listeners=[];const H=["onLoad","apiKey","version","libraries"],j=["children"],S=v.createContext(null);function G(){const[e,n]=s.useState({});return{mapInstances:e,addMapInstance:(a,c="default")=>{n(i=>I({},i,{[c]:a}))},removeMapInstance:(a="default")=>{n(c=>M(c,[a].map(R)))},clearMapInstances:()=>{n({})}}}function B(e){const{onLoad:n,apiKey:t,version:o,libraries:r=[]}=e,a=M(e,H),[c,i]=s.useState(_.loadingStatus),[u,g]=s.useReducer((m,l)=>I({},m,{[l.name]:l.value}),{}),d=s.useMemo(()=>r==null?void 0:r.join(","),[r]),f=s.useMemo(()=>JSON.stringify(I({apiKey:t,version:o},a)),[t,o,a]),p=s.useCallback(async m=>{var l;if(u[m])return u[m];if(!((l=google)!=null&&(l=l.maps)!=null&&l.importLibrary))throw new Error("[api-provider-internal] importLibrary was called before google.maps.importLibrary was defined.");const h=await window.google.maps.importLibrary(m);return g({name:m,value:h}),h},[u]);return s.useEffect(()=>{(async()=>{try{const m=I({key:t},a);o&&(m.v=o),(d==null?void 0:d.length)>0&&(m.libraries=d),await _.load(m,l=>i(l));for(const l of["core","maps",...r])await p(l);n&&n()}catch(m){console.error("<ApiProvider> failed to load Google Maps API",m)}})()},[t,d,f]),{status:c,loadedLibraries:u,importLibrary:p}}const be=e=>{const{children:n}=e,t=M(e,j),{mapInstances:o,addMapInstance:r,removeMapInstance:a,clearMapInstances:c}=G(),{status:i,loadedLibraries:u,importLibrary:g}=B(t),d=s.useMemo(()=>({mapInstances:o,addMapInstance:r,removeMapInstance:a,clearMapInstances:c,status:i,loadedLibraries:u,importLibrary:g}),[o,r,a,c,i,u,g]);return v.createElement(S.Provider,{value:d},n)};function Z(e,n){for(const t of K){const o=n[t],r=x[t];s.useEffect(()=>{if(!e||!o)return;const a=google.maps.event.addListener(e,r,c=>{o($(r,e,c))});return()=>a.remove()},[e,r,o])}}function $(e,n,t){const o={type:e,map:n,detail:{},stoppable:!1,stop:()=>{}};if(J.includes(e)){const a=o,c=n.getCenter(),i=n.getZoom(),u=n.getHeading()||0,g=n.getTilt()||0,d=n.getBounds();return(!c||!d||!Number.isFinite(i))&&console.warn("[createEvent] at least one of the values from the map returned undefined. This is not expected to happen. Please report an issue at https://github.com/visgl/react-google-maps/issues/new"),a.detail={center:(c==null?void 0:c.toJSON())||{lat:0,lng:0},zoom:i||0,heading:u,tilt:g,bounds:(d==null?void 0:d.toJSON())||{north:90,east:180,south:-90,west:-180}},a}else if(V.includes(e)){var r;if(!t)throw new Error("[createEvent] mouse events must provide a srcEvent");const a=o;return a.domEvent=t.domEvent,a.stoppable=!0,a.stop=()=>t.stop(),a.detail={latLng:((r=t.latLng)==null?void 0:r.toJSON())||null,placeId:t.placeId},a}return o}const x={onBoundsChanged:"bounds_changed",onCenterChanged:"center_changed",onClick:"click",onContextmenu:"contextmenu",onDblclick:"dblclick",onDrag:"drag",onDragend:"dragend",onDragstart:"dragstart",onHeadingChanged:"heading_changed",onIdle:"idle",onIsFractionalZoomEnabledChanged:"isfractionalzoomenabled_changed",onMapCapabilitiesChanged:"mapcapabilities_changed",onMapTypeIdChanged:"maptypeid_changed",onMousemove:"mousemove",onMouseout:"mouseout",onMouseover:"mouseover",onProjectionChanged:"projection_changed",onRenderingTypeChanged:"renderingtype_changed",onTilesLoaded:"tilesloaded",onTiltChanged:"tilt_changed",onZoomChanged:"zoom_changed",onCameraChanged:"bounds_changed"},J=["bounds_changed","center_changed","heading_changed","projection_changed","tilt_changed","zoom_changed"],V=["click","contextmenu","dblclick","mousemove","mouseout","mouseover"],K=Object.keys(x);function W(e,n){const t=s.useRef(void 0);(!t.current||!F(n,t.current))&&(t.current=n),s.useEffect(e,t.current)}const q=new Set(["backgroundColor","clickableIcons","controlSize","disableDefaultUI","disableDoubleClickZoom","draggable","draggableCursor","draggingCursor","fullscreenControl","fullscreenControlOptions","gestureHandling","isFractionalZoomEnabled","keyboardShortcuts","mapTypeControl","mapTypeControlOptions","mapTypeId","maxZoom","minZoom","noClear","panControl","panControlOptions","restriction","rotateControl","rotateControlOptions","scaleControl","scaleControlOptions","scrollwheel","streetView","streetViewControl","streetViewControlOptions","styles","zoomControl","zoomControlOptions"]);function Y(e,n){const t={},o=Object.keys(n);for(const r of o)q.has(r)&&(t[r]=n[r]);W(()=>{e&&e.setOptions(t)},[t])}function P(){var e;return((e=s.useContext(S))==null?void 0:e.status)||w.NOT_LOADED}function Q(e,n){const{viewport:t,viewState:o}=n,r=!!t;return s.useLayoutEffect(()=>{if(!e||!o)return;const{latitude:a,longitude:c,bearing:i,pitch:u,zoom:g}=o;e.moveCamera({center:{lat:a,lng:c},heading:i,tilt:u,zoom:g+1})},[e,o]),r}function X(e){return!e||typeof e!="object"||!("lat"in e&&"lng"in e)?!1:Number.isFinite(e.lat)&&Number.isFinite(e.lng)}function z(e){return X(e)?e:e.toJSON()}function ee(e,n,t){const o=t.center?z(t.center):null;let r=null,a=null;o&&Number.isFinite(o.lat)&&Number.isFinite(o.lng)&&(r=o.lat,a=o.lng);const c=Number.isFinite(t.zoom)?t.zoom:null,i=Number.isFinite(t.heading)?t.heading:null,u=Number.isFinite(t.tilt)?t.tilt:null;s.useLayoutEffect(()=>{if(!e)return;const g={};let d=!1;r!==null&&a!==null&&(n.current.center.lat!==r||n.current.center.lng!==a)&&(g.center={lat:r,lng:a},d=!0),c!==null&&n.current.zoom!==c&&(g.zoom=c,d=!0),i!==null&&n.current.heading!==i&&(g.heading=i,d=!0),u!==null&&n.current.tilt!==u&&(g.tilt=u,d=!0),d&&e.moveCamera(g)})}const te=()=>{const e={position:"absolute",top:0,left:0,bottom:0,right:0,zIndex:999,display:"flex",flexFlow:"column nowrap",textAlign:"center",justifyContent:"center",fontSize:".8rem",color:"rgba(0,0,0,0.6)",background:"#dddddd",padding:"1rem 1.5rem"};return v.createElement("div",{style:e},v.createElement("h2",null,"Error: AuthFailure"),v.createElement("p",null,"A problem with your API key prevents the map from rendering correctly. Please make sure the value of the ",v.createElement("code",null,"APIProvider.apiKey")," prop is correct. Check the error-message in the console for further details."))};function ne(){const[e,n]=s.useState(null),t=s.useCallback(o=>n(o),[n]);return[e,t]}function N(){return P()===w.LOADED}function oe(){const[,e]=s.useReducer(n=>n+1,0);return e}function re(e,n){const t=e.getCenter(),o=e.getZoom(),r=e.getHeading()||0,a=e.getTilt()||0,c=e.getBounds();(!t||!c||!Number.isFinite(o))&&console.warn("[useTrackedCameraState] at least one of the values from the map returned undefined. This is not expected to happen. Please report an issue at https://github.com/visgl/react-google-maps/issues/new"),Object.assign(n.current,{center:(t==null?void 0:t.toJSON())||{lat:0,lng:0},zoom:o||0,heading:r,tilt:a})}function ae(e){const n=oe(),t=s.useRef({center:{lat:0,lng:0},heading:0,tilt:0,zoom:0});return s.useEffect(()=>{if(!e)return;const o=google.maps.event.addListener(e,"bounds_changed",()=>{re(e,t),n()});return()=>o.remove()},[e,n]),t}const ie=["id","defaultBounds","defaultCenter","defaultZoom","defaultHeading","defaultTilt"];function se(e,n){const t=N(),[o,r]=s.useState(null),[a,c]=ne(),i=ae(o),{id:u,defaultBounds:g,defaultCenter:d,defaultZoom:f,defaultHeading:p,defaultTilt:m}=e,l=M(e,ie);!l.center&&d&&(l.center=d),!l.zoom&&Number.isFinite(f)&&(l.zoom=f),!l.heading&&Number.isFinite(p)&&(l.heading=p),!l.tilt&&Number.isFinite(m)&&(l.tilt=m);for(const L of Object.keys(l))l[L]===void 0&&delete l[L];const h=s.useRef();return s.useEffect(()=>{if(!a||!t)return;const{addMapInstance:L,removeMapInstance:k}=n,C=e.mapId,y=new google.maps.Map(a,l);if(r(y),L(y,u),g&&y.fitBounds(g),h.current){const{mapId:b,cameraState:E}=h.current;b!==C&&y.setOptions(E)}return()=>{h.current={mapId:C,cameraState:i.current},google.maps.event.clearInstanceListeners(y),r(null),k(u)}},[a,t,u,e.mapId]),[o,c,i]}const O=v.createContext(null),le=e=>{const{children:n,id:t,className:o,style:r}=e,a=s.useContext(S),c=P();if(!a)throw new Error("<Map> can only be used inside an <ApiProvider> component.");const[i,u,g]=se(e,a);ee(i,g,e),Z(i,e),Y(i,e);const d=Q(i,e),f=!!e.controlled;s.useEffect(()=>{if(i)return d&&i.setOptions({disableDefaultUI:!0}),(d||f)&&i.setOptions({gestureHandling:"none",keyboardShortcuts:!1}),()=>{i.setOptions({gestureHandling:e.gestureHandling,keyboardShortcuts:e.keyboardShortcuts})}},[i,d,f,e.gestureHandling,e.keyboardShortcuts]);const p=e.center?z(e.center):null;let m=null,l=null;p&&Number.isFinite(p.lat)&&Number.isFinite(p.lng)&&(m=p.lat,l=p.lng);const h=s.useMemo(()=>{var C,y,b,E,A;return{center:{lat:(C=m)!=null?C:0,lng:(y=l)!=null?y:0},zoom:(b=e.zoom)!=null?b:0,heading:(E=e.heading)!=null?E:0,tilt:(A=e.tilt)!=null?A:0}},[m,l,e.zoom,e.heading,e.tilt]);s.useLayoutEffect(()=>{if(!i||!f)return;i.moveCamera(h);const C=i.addListener("bounds_changed",()=>{i.moveCamera(h)});return()=>C.remove()},[i,f,h]);const L=s.useMemo(()=>I({width:"100%",height:"100%",zIndex:d?-1:0},r),[r,d]),k=s.useMemo(()=>({map:i}),[i]);return c===w.AUTH_FAILURE?v.createElement("div",{style:I({position:"relative"},o?{}:L),className:o},v.createElement(te,null)):v.createElement("div",I({ref:u,"data-testid":"map",style:o?void 0:L,className:o},t?{id:t}:{}),i?v.createElement(O.Provider,{value:k},n):null)};le.deckGLViewProps=!0;function ce(e){const n=N(),t=s.useContext(S);return s.useEffect(()=>{!n||!t||t.importLibrary(e)},[n,t,e]),(t==null?void 0:t.loadedLibraries[e])||null}const ue=v.createContext(null);function de(e){var n;const[t,o]=s.useState(null),[r,a]=s.useState(null),c=(n=s.useContext(O))==null?void 0:n.map,i=ce("marker"),{children:u,className:g,onClick:d,onDrag:f,onDragStart:p,onDragEnd:m,collisionBehavior:l,draggable:h,position:L,title:k,zIndex:C}=e,y=s.Children.count(u);return s.useEffect(()=>{if(!c||!i)return;const b=new i.AdvancedMarkerElement;if(b.map=c,o(b),y>0){const E=document.createElement("div");g&&(E.className=g),b.content=E,a(E)}return()=>{b.map=null,o(null),a(null)}},[c,i,y]),s.useEffect(()=>{r&&(r.className=g??"")},[r,g]),s.useEffect(()=>{if(!t)return;const b=google.maps.event;d&&b.addListener(t,"click",d),f&&b.addListener(t,"drag",f),p&&b.addListener(t,"dragstart",p),m&&b.addListener(t,"dragend",m),(f||p||m)&&!h&&console.warn("You need to set the marker to draggable to listen to drag-events.");const E=t;return()=>{b.clearInstanceListeners(E)}},[t,h,d,p,f,m]),s.useEffect(()=>{t&&(L!==void 0&&(t.position=L),h!==void 0&&(t.gmpDraggable=h),l!==void 0&&(t.collisionBehavior=l),C!==void 0&&(t.zIndex=C),typeof k=="string"&&(t.title=k))},[t,L,h,l,C,k]),[t,r]}const Le=s.forwardRef((e,n)=>{const{children:t}=e,[o,r]=de(e),a=s.useMemo(()=>o?{marker:o}:null,[o]);return s.useImperativeHandle(n,()=>o,[o]),o?v.createElement(ue.Provider,{value:a},r!==null&&D.createPortal(t,r)):null}),fe=["children","anchor","shouldFocus","onCloseClick"],Ce=e=>{var n;const{children:t,anchor:o,shouldFocus:r,onCloseClick:a}=e,c=M(e,fe),i=(n=s.useContext(O))==null?void 0:n.map,u=s.useRef(null),[g,d]=s.useState(null);return s.useEffect(()=>{if(!i)return;const f=new google.maps.InfoWindow(c),p=document.createElement("div");return f.setContent(p),u.current=f,d(p),()=>{google.maps.event.clearInstanceListeners(f),f.close(),p.remove(),d(null)}},[i,t]),s.useEffect(()=>{var f;(f=u.current)==null||f.setOptions(c)},[c]),s.useEffect(()=>{if(!u.current)return;let f=null;return a&&(f=google.maps.event.addListener(u.current,"closeclick",a)),()=>{f&&f.remove()}},[a]),s.useEffect(()=>{if(!g||!u.current||o===null)return;const f={map:i};o&&(f.anchor=o),r!==void 0&&(f.shouldFocus=r),u.current.open(f)},[g,u,o,i,r]),v.createElement(v.Fragment,null,g!==null&&D.createPortal(t,g))},ge=["onClick","onDrag","onDragStart","onDragEnd","onMouseOver","onMouseOut"];function me(e){var n;const[t,o]=s.useState(null),r=(n=s.useContext(O))==null?void 0:n.map,{onClick:a,onDrag:c,onDragStart:i,onDragEnd:u,onMouseOver:g,onMouseOut:d}=e,f=M(e,ge),{position:p,draggable:m}=f;return s.useEffect(()=>{if(!r){r===void 0&&console.error("<Marker> has to be inside a Map component.");return}const l=new google.maps.Marker(f);return l.setMap(r),o(l),()=>{l.setMap(null),o(null)}},[r]),s.useEffect(()=>{if(!t)return;const l=t,h=google.maps.event;return a&&h.addListener(l,"click",a),c&&h.addListener(l,"drag",c),i&&h.addListener(l,"dragstart",i),u&&h.addListener(l,"dragend",u),g&&h.addListener(l,"mouseover",g),d&&h.addListener(l,"mouseout",d),t.setDraggable(!!m),()=>{h.clearInstanceListeners(l)}},[t,m,a,c,i,u,g,d]),s.useEffect(()=>{t&&f&&t.setOptions(f)},[t,f]),s.useEffect(()=>{m||!p||!t||t.setPosition(p)},[m,p,t]),t}s.forwardRef((e,n)=>{const t=me(e);return s.useImperativeHandle(n,()=>t,[t]),v.createElement(v.Fragment,null)});export{be as A,Ce as I,le as M,Le as a};
