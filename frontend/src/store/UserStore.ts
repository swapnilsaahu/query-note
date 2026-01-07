import { create } from "zustand";

export type NavStructure = {
    id: number,
    subject: string,
    favourtie: boolean,
    user_id: string
}
interface userStore {
    email: string,
    username: string,
    accessToken: string | null,
    authLoading: boolean,
    navDetails: NavStructure[] | null,
    addDetials: (email: string, accessToken: string, username: string) => void,
    updateToken: (accessToken: string | null) => void,
    updateAuthLoading: (loading: boolean) => void,
    updateNav: (newList: NavStructure[]) => void
}
const useUserStore = create<userStore>()((set) => ({
    email: "",
    username: "",
    accessToken: "",
    authLoading: true,
    navDetails: [],
    addDetials: (email, accessToken, username) => set({ email: email, accessToken: accessToken, username: username }),
    updateToken: (accessToken) => set({ accessToken: accessToken }),
    updateAuthLoading: (loading) => set({ authLoading: loading }),
    updateNav: (newList) => set({
        navDetails: newList
    })
}))

export default useUserStore;
