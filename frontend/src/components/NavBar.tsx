import { NavLink, useNavigate } from "react-router";

type Note = {
    id: number,
    name: string
}
type Props = {
    notes: Note[]
}
const NavBar = ({ notes }: Props) => {
    const navigate = useNavigate();
    const clickedItem = (name: string) => {
        navigate(`/notes/${name}`);
    }
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
                    {notes.map(x => (
                        <li key={x.id} onClick={() => clickedItem(x.name)}>{x.name}</li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;
