import { useState } from "react";
import NavBar from "../components/NavBar";
import useUserStore from "../store/UserStore";

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
const DashBoardPage = () => {
    const accessToken = useUserStore(state => state.accessToken);
    return (

        <div className="flex">
            <div>
                home screen
                {accessToken}
            </div>
        </div >

    )
}
export default DashBoardPage;
