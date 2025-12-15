import useUserStore from "../store/UserStore";
import { Navigate, Outlet } from "react-router";
import AppLoader from "./AppLoader";

const ProtectedRoute = () => {
    const accessToken = useUserStore((state) => state.accessToken);
    const authLoading = useUserStore((state) => state.authLoading);
    if (authLoading) {
        return <AppLoader />
    }
    if (!accessToken) {
        return <Navigate to="/login" replace />
    }
    return <Outlet />;
}
export default ProtectedRoute;
