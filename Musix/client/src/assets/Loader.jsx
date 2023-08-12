import React from 'react';

function Loader({title}) {
  return (
    <div style={{"display":"flex","alignItems":"center","justifyContent":"center","margin":"auto","flexDirection":"column"}}>
        <img src="https://i.pinimg.com/originals/40/72/af/4072af9f3687cbf53820fb4b37c79370.gif" alt="gif" style={{"height":"100px","width":"100px"}} />
        <h2 style={{"color":"#fff","fontSize":"18px","fontWeight":"400","fontFamily":"cursive","marginTop":"20px"}}>{title || "Loading"}</h2>
    </div>
  )
}
export default Loader;