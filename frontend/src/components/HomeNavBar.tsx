import { Link } from "react-router";

const HomeNavBar = () => {
    return (
        <div className="w-screen flex justify-between p-6 bg-lavender-grey-900">
            <div className="text-2xl sm:text-4xl m-2">
                <Link to="/">Query Note</Link>
            </div>
            <div className="sm:text-2xl flex gap-2 sm:gap-6">
                <Link to="/login">
                    <div className="border-2 border-lavender-grey-400 rounded-4xl text-lavender-grey-400 py-4 px-4 sm:px-10">
                        Log In</div>
                </Link>
                <Link to="/register">
                    <div className="text-lavender-grey-950 bg-lavender-grey-400 rounded-4xl py-4 px-4 sm:px-10 hover:bg-lavender-grey-200" >Sign Up</div>
                </Link>

            </div>
        </div>
    )
}
export default HomeNavBar;
