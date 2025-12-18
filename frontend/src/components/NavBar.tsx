import { NavLink } from "react-router";

const NavBar = () => {
    return (
        <nav className="h-screen bg-black text-white text-2xl w-xs">
            <div>
                <h3>Query Note</h3>
                <ul>
                    <li>
                        <NavLink to="/dashboard">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard">Home</NavLink>
                    </li>
                </ul>
            </div>
            <div>
                <h3>Notes</h3>
                <ul>
                    <li>
                        <NavLink to="">Note1</NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;
