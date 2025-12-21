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
        <div className="flex ">
            <NavBar />
            <Outlet />;
        </div>
    )
}
export default ProtectedRoute;
