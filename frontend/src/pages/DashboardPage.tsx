import NavBar from "../components/NavBar";
import UploadComponent from "../components/UploadComponent";
import useUserStore from "../store/UserStore";

const DashBoardPage = () => {
    const accessToken = useUserStore(state => state.accessToken);
    return (
        <div className="flex h-screen">
            <h1>hello world</h1>
            <UploadComponent />
        </div >

    )
}
export default DashBoardPage;
