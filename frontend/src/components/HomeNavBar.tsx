import { Link } from "react-router";

const HomeNavBar = () => {
    return (
        <div className="w-screen flex justify-between p-6 bg-lavender-grey-900">
            <div className="text-4xl m-2">
                <Link to="/">Query Note</Link>
            </div>
            <div className="text-2xl flex gap-6">
                <div className="border-2 border-lavender-grey-400 rounded-4xl text-lavender-grey-400 py-4 px-10">
                    <Link to="/login">Log In</Link>
                </div>
                <div className="text-lavender-grey-950 bg-lavender-grey-400 rounded-4xl py-4 px-10 hover:bg-lavender-grey-200">
                    <Link to="/register">Sign Up</Link>
                </div>
            </div>
        </div>
    )
}
export default HomeNavBar;
