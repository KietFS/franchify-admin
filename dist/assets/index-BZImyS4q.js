import{b as l,j as e}from"./index-Bpu-ZP8V.js";import{u as p,a as j}from"./index-BwNXfVh5.js";const C=t=>{const{name:n,className:o,required:r,label:u=null,subLabel:a="",hasEvent:s=!1,onClickEvent:m,autoComplete:y="off",onChangeValue:x,isBorder:w=!0,...h}=t,{setFieldValue:g}=p(),[d,i]=j(t.name);l.useEffect(()=>{x&&x(d.value||"")},[d.value]);const f=!!i.touched&&!!i.error,b=c=>{g(n,c)};return e.jsxs("div",{className:`w-full rounded-sm ${f?"text-gray-500":"text-neutral-300"}`,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex",children:[e.jsx("p",{className:"mb-1 mr-1 text-sm font-bold text-gray-600",children:u}),r&&e.jsx("p",{className:"font-bold text-red-500",children:"*"})]}),s&&e.jsx("div",{className:"cursor-default text-base text-gray-500 duration-300 hover:text-gray-500",onClick:()=>{m&&m()},children:"Change"})]}),e.jsx("div",{className:"border-box flex w-full items-center rounded-lg border border-gray-300 bg-white py-1 focus-within:bg-gray-50",children:e.jsx("textarea",{placeholder:"abcdefg@gmail.com",...h,...d,multiline:!0,onChange:c=>b(c.target.value),className:"right-0 h-[100px] w-full rounded-lg border-transparent bg-white px-2 py-1 text-sm text-gray-700 outline-none outline-white ring-0 ring-transparent focus:border-transparent focus:bg-white focus:outline-transparent focus:ring-0"})}),f&&e.jsx("p",{className:"mt-1 text-xs font-semibold text-red-500",children:i.error})]})},U=t=>{const n=l.useRef(),o=l.useRef();return l.useEffect(()=>{var r;n.current=window.cloudinary,o.current=(r=n.current)==null?void 0:r.createUploadWidget({cloudName:"dfnuzzpe3",uploadPreset:"ml_default"},function(u,a){var s;a.event=="success"&&t.setThumbnailUploaded((s=a==null?void 0:a.info)==null?void 0:s.secure_url)})},[]),e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-md mr-1 font-bold text-gray-700",children:"Upload ảnh"}),e.jsx("button",{className:"mt-2 flex flex-wrap rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600",onClick:()=>{var r;return(r=o.current)==null?void 0:r.open()},children:t.thumbnailUploaded?t.thumbnailUploaded:"Đăng thumbnail"}),t.thumbnailUploaded&&e.jsx("img",{src:t.thumbnailUploaded,alt:"thumbnail",className:"h-20 w-20 rounded-lg object-cover"})]})};export{C as R,U};
