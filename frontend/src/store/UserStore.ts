import { create } from "zustand";

interface userStore {
    email: string,
    accessToken: string,
    isAuthenticated: boolean,
    addDetials: (email: string, accessToken: string) => void,
    updateToken: (accessToken: string) => void,
}
const useUserStore = create<userStore>()((set) => ({
    email: "",
    accessToken: "",
    isAuthenticated: false,
    addDetials: (email, accessToken) => set({ email: email, accessToken: accessToken }),
    updateToken: (accessToken) => set({ accessToken: accessToken }),
}))

export default useUserStore;
