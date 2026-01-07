import { useEffect, useRef } from "react"
import useUserStore from "../store/UserStore";
import api from "../lib/api";

const AppAuth = ({ children }: { children: React.ReactNode }) => {
    const updateToken = useUserStore((s) => s.updateToken);
    const updateAuthLoading = useUserStore((s) => s.updateAuthLoading);
    const hasRun = useRef(false);
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        let isMounted = true;
        const verifAuth = async () => {
            try {
                const url = '/api/v1/users/auth/refresh';
                const res = await api.post(url, {}, {
                    withCredentials: true
                })
                if (!isMounted) return;
                if (res.data?.accessToken) {
                    updateToken(res.data.accessToken);
                } else {
                    updateToken(null);
                }
            } catch (err) {
                console.error("error while auth check")
                updateToken(null);
            } finally {
                updateAuthLoading(false);
            }
        }
        verifAuth();
    }, [])
    return (
        <>
            {children}
        </>
    )
}
export default AppAuth;
