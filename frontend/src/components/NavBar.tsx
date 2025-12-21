import { NavLink, useNavigate } from "react-router";
import useUserStore from "../store/UserStore";
import { useEffect } from "react";
import axios from "axios";

const NavBar = () => {

    const navigate = useNavigate();
    const updateNav = useUserStore(s => s.updateNav);
    const navDetails = useUserStore(s => s.navDetails);
    const clickedItem = (name: string) => {
        navigate(`/notes/${name}`);
    }
    const accessToken = useUserStore(state => state.accessToken)
    const fetchNavLinks = async () => {
        try {
            const url = `/api/v1/notes/getNavs`;
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true
            })
            if (res.data) {
                updateNav(res.data.structure);
            }
        } catch (error) {
            console.error("error")
        }
    }
    useEffect(() => {
        if (!accessToken) return

        fetchNavLinks();
    }, [accessToken])
    return (
        <nav className="h-screen bg-black text-white text-2xl w-xs p-2 fixed">
            <div className="flex flex-col m-2 gap-2">
                <div className="mb-8">
                    <h3 className="text-4xl mb-8">Query Note</h3>
                    <ul>
                        <li>
                            <NavLink to="/dashboard">Home</NavLink>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="mb-4">Notes</h3>
                    <div className="">
                        {navDetails?.map(x => (
                            <div className="hover:bg-gray-900 m-2 p-2 cursor-pointer" key={x.id} onClick={() => clickedItem(x.subject)}>{x.subject}</div>
                        ))}
                    </div>
                </div>

            </div>
        </nav>
    )
}

export default NavBar;
