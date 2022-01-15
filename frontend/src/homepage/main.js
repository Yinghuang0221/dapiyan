import React from "react";
import APPMidpart from "./midpart";

const APPMain = ({handlesignin}) => {
    return(

        <div className="main">
            <APPMidpart handlesignin={handlesignin} />
        </div>
    )
}


export default APPMain