import useUserStore from "../store/UserStore";
import { Navigate, Outlet } from "react-router";
import AppLoader from "./AppLoader";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { GiTireIronCross } from "react-icons/gi";

const ProtectedRoute = () => {
    const accessToken = useUserStore((state) => state.accessToken);
    const authLoading = useUserStore((state) => state.authLoading);
    const [showNav, setNav] = useState(false);
    if (authLoading) {
        return <AppLoader />
    }
    if (!accessToken) {
        return <Navigate to="/login" replace />
    }
    return (
        <div className={showNav ? "flex h-screen bg-lavender-grey-900" : "flex h-screen bg-lavender-grey-950"}>
            {showNav ? <aside className="fixed left-0 top-0 h-screen">
                <GiTireIronCross onClick={() => setNav(false)} className="text-white text-4xl" />
                <NavBar />
            </aside> : <CiMenuBurger className="text-4xl text-white" onClick={() => setNav(true)} />}
            <main className={showNav ? "ml-72 overflow-y-auto bg-lavender-grey-950 w-screen" : "overflow-y-auto bg-lavender-grey-950 w-screen"}>
                <Outlet />
            </main>
        </div>
    )
}
export default ProtectedRoute;
