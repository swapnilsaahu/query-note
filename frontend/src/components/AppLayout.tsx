import { Outlet } from "react-router";
import NavBar from "./NavBar.tsx"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useUserStore from "../store/UserStore.ts";

const list = [
    { id: 1, name: "cn" },
    { id: 2, name: "cn" },
    { id: 3, name: "cn" },
    { id: 4, name: "cn" },
    { id: 5, name: "cn" },
    { id: 6, name: "dbms" },
    { id: 7, name: "dbms" },
    { id: 8, name: "cn" },
]
const AppLayout = () => {
    const navDetails = useUserStore(state => state.navDetails);
    return (
        <div className="flex" >
            <NavBar navlist={navDetails} />
            <Outlet />
        </div >
    )
}
export default AppLayout;
