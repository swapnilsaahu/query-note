import useUserStore from "../store/UserStore";

const DashBoardPage = () => {
    const accessToken = useUserStore(state => state.accessToken);
    return (
        <div className="flex">
            <div>
                home screen
                {accessToken}
            </div>
        </div >

    )
}
export default DashBoardPage;
