import useUserStore from "../store/UserStore";

const DashBoardPage = () => {
    const accessToken = useUserStore(state => state.accessToken);
    return (
        <div className="h-screen text-lavender-grey-200 flex justify-center">
            <div className="my-16">
                <h2 className="text-6xl">Welcome To Query Note</h2>
            </div>
        </div >

    )
}
export default DashBoardPage;
