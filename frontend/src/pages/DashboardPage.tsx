import NavBar from "../components/NavBar";
import useUserStore from "../store/UserStore";

const DashBoardPage = () => {
    const accessToken = useUserStore(state => state.accessToken);
    return (
        <div className="flex h-screen">
            <h1>hello world</h1>
        </div >

    )
}
export default DashBoardPage;
