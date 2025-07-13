import React from "react";

import Header from "./Header";
import Footer from "./Footer";

const Layout = ({children}) =>{
    return(
        <div className="w-[100vw] bg-[#ecfdfe] h-[100vh]">
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default Layout;