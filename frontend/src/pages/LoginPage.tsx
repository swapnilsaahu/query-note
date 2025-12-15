import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import useUserStore from "../store/UserStore";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const token = useUserStore(state => state.accessToken);
    const updateToken = useUserStore(state => state.updateToken);
    const [signInloading, setSignInLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();
    const accessToken = useUserStore(s => s.accessToken);
    if (accessToken) navigate("/dashboard");
    const loginHandle = async () => {
        try {
            setSignInLoading(true);
            const url = "/api/v1/users/login";
            const res = await axios.post(url, {
                email: email,
                password: password
            })
            if (res.data.success) {
                updateToken(res.data.accessToken);
            }

        } catch (err) {
            console.error("error while logging in");
        } finally {
            setSignInLoading(false);
        }
    }
    return (
        < div className="min-h-screen w-full px-4 py-6 flex justify-center items-center bg-gray-50 overflow-x-hidden" >
            <div className="w-full max-w-md flex flex-col gap-4 text-black">
                <h2 className="text-4xl text-center">Query Note</h2>
                <h3 className="text-xl text-center">Login</h3>
                <p className="text-black text-center text-sm">
                    Enter credentials to login.
                </p>

                <input type="email" name="email" placeholder="Email" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="password" placeholder="Password" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => setPassword(e.target.value)} />

                <button className="text-white bg-black py-3 rounded-xl w-full" onClick={() => loginHandle()}>{signInloading ? "Loading..." : "LogIn"}</button>

                <p className="text-gray-500 text-center text-sm">
                    Dont't have an account? <Link to="/register" className="underline cursor-pointer">register</Link>
                </p>
            </div>
        </div >

    )
}
export default LoginPage;
