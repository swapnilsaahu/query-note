import useUserStore from "../store/UserStore";

const DashBoardPage = () => {
    const accessToken = useUserStore(state => state.accessToken)
    console.log(accessToken);
    return (
        <div>
            this is DashBoardPage
            <div>{accessToken}</div>
        </div>

    )
}
export default DashBoardPage;
