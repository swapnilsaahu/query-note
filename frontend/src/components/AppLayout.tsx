import { Outlet } from "react-router";
import NavBar from "./NavBar.tsx"

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
    return (
        <div className="flex">
            <NavBar notes={list} />
            <Outlet />
        </div>
    )
}
export default AppLayout;
