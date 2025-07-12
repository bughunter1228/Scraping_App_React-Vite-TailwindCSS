import React from "react";

import Header from "./Header";

const Layout = ({children}) =>{
    return(
        <div className="w-[100vw] h-[100vh] bg-[#ecfdfe]">
            <Header />
            <main>{children}</main>
        </div>
    )
}

export default Layout;