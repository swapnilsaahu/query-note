import useUserStore from "../store/UserStore";
import { Navigate, Outlet } from "react-router";
import AppLoader from "./AppLoader";
import NavBar from "../components/NavBar";

const ProtectedRoute = () => {
    const accessToken = useUserStore((state) => state.accessToken);
    const authLoading = useUserStore((state) => state.authLoading);
    if (authLoading) {
        return <AppLoader />
    }
    if (!accessToken) {
        return <Navigate to="/login" replace />
    }
    return (
        <div className="flex h-screen">
            <aside className="fixed left-0 top-0 h-screen">
                <NavBar />
            </aside>
            <main className="ml-72 overflow-y-auto bg-lavender-grey-950 w-screen">
                <Outlet />
            </main>
        </div>
    )
}
export default ProtectedRoute;
