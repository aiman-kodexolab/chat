import React from "react";
import "./style.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <div className="content">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum cupiditate qui 
      eaque dolorum consequatur cumque iusto, modi quo, in, hic nulla odio illum blanditiis. 
      Impedit perspiciatis molestiae iure laboriosam dignissimos.Lorem ipsum dolor sit amet consectetur 
      adipisicing elit. Cum cupiditate qui eaque dolorum consequatur cumque iusto, modi quo, in, hic nulla 
      odio illum blanditiis. Impedit perspiciatis molestiae iure laboriosam 
      dignissimosLorem ipsum dolor sit amet consectetur adipisicing elit. Cum cupiditate qu
      i eaque dolorum consequatur cumque iusto, modi quo, in, hic nulla o
      dio illum blanditiis. Impedit perspiciatis molestiae iure laboriosam digniss
      imosLorem ipsum dolor sit amet consectetur adipisicing elit. Cum cupiditate qui
       eaque dolorum consequatur cumque iust
      o, modi quo, in, hic nulla odio illum blanditiis. Impedit perspiciatis molestiae iure 
      laboriosam dignissimosLorem ipsum dolor sit amet consectetur adipisicing elit. 
      Cum cupiditate qui eaque dolorum consequatur cumque ius
      to, modi quo, in, hic nulla odio illum blanditiis. Impedit perspiciatis molestiae iure laboriosam 
      dignissimosLorem ipsum dolor sit amet consectetur adipisicing elit. Cum cupiditate qui eaqu
      e dolorum consequatur cumque iusto, modi quo, in, 
      hic nulla odio illum blanditiis. Impedit perspiciatis molestiae iure laboriosam dignissimos
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum cupiditate qui eaque dolorum 
      consequatur cumque ius
      to, modi quo, in, hic nulla odio illum blanditiis. Impedit perspiciatis molestiae iure laboriosam
       dignissimos
       <div style={{height:'1500px'}}></div>
       </div>
      <div className="chat-container">{children}</div>
    </div>
  );
}
