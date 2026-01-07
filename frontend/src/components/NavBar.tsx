import { Link, NavLink, useNavigate } from "react-router";
import useUserStore from "../store/UserStore";
import { useEffect } from "react";
import axios from "axios";
import { IoHomeOutline } from "react-icons/io5";
import { CiFolderOn } from "react-icons/ci";
import { MdOutlineManageSearch } from "react-icons/md";
import { BsPersonCircle } from "react-icons/bs";
import { IoCloudUploadOutline } from "react-icons/io5";

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
        <nav className="h-screen bg-lavender-grey-900 text-lavender-grey-200 text-2xl w-72 p-2 fixed ">
            <div className="flex flex-col m-2 gap-2">
                <div className="my-8 mx-2">
                    <h3 className="text-4xl mb-8 font-bold">Query Note</h3>
                    <ul className="">
                        <li className="flex gap-2 my-6 mx-2">
                            <IoHomeOutline className="mt-1" />
                            <div className="text-2xl hover:underline">
                                <NavLink to="/dashboard">Home</NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="flex gap-2 my-6 mx-2 hover:underline">
                                <MdOutlineManageSearch className="mt-1" />
                                <NavLink to="/search-bot">Search</NavLink>
                            </div>
                        </li>
                        <li>
                            <div className="flex gap-2 my-6 mx-2 hover:underline">
                                <IoCloudUploadOutline className="mt-1" />
                                <NavLink to="/uploadNote">Upload</NavLink>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="mx-2">
                    <h3 className="mb-4 font-bold">Notes</h3>
                    <div className="">
                        {navDetails?.map(x => (
                            <div className="hover:bg-lavender-grey-600 hover:rounded-2xl m-2 p-2 cursor-pointer" key={x.id} onClick={() => clickedItem(x.subject)}>
                                <div className="flex gap-2"><CiFolderOn className="my-1" />{x.subject}</div></div>
                        ))}
                    </div>
                </div>
                <div className="flex fixed bottom-0 my-6 mx-4 gap-2 text-3xl ">
                    <BsPersonCircle className="mt-1" />
                    <div>
                        <Link to="/profile" >Profile</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;
