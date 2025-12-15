import { create } from "zustand";

interface userStore {
    email: string,
    accessToken: string | null,
    authLoading: boolean,
    addDetials: (email: string, accessToken: string) => void,
    updateToken: (accessToken: string | null) => void,
    updateAuthLoading: (loading: boolean) => void
}
const useUserStore = create<userStore>()((set) => ({
    email: "",
    accessToken: "",
    authLoading: true,
    addDetials: (email, accessToken) => set({ email: email, accessToken: accessToken }),
    updateToken: (accessToken) => set({ accessToken: accessToken }),
    updateAuthLoading: (loading) => set({ authLoading: loading })
}))

export default useUserStore;
