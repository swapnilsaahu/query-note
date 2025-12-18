import NavBar from "../components/NavBar";
import useUserStore from "../store/UserStore";

const DashBoardPage = () => {
    return (
        <div className="flex">
            <div>
                <NavBar />
            </div>
            <div>
                home screen
            </div>
        </div>

    )
}
export default DashBoardPage;
