import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useUserStore from "../store/UserStore";

const RegisterPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const [signUpLoading, setSignUpLoading] = useState<boolean>(false);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const addDetails = useUserStore(state => state.addDetials)
    const token = useUserStore(state => state.accessToken);
    const signUpHandle = async () => {
        try {
            setSignUpLoading(true);
            const url = "http://localhost:3000/api/v1/users/register"
            const res = await axios.post(url, {
                email: email,
                password: password,
                username: username
            })
            if (res.data.success) {
                setLoginLoading(true);
                const loginUrl = "http://localhost:3000/api/v1/users/login";
                const resLogin = await axios.post(loginUrl, {
                    email: email,
                    password: password
                })
                if (resLogin.data.success) {
                    const accessToken = resLogin.data.accessToken
                    addDetails(email, accessToken);
                }
            }

        } catch (error) {
            console.error("error while signing up", error);
        } finally {
            setSignUpLoading(false);
            setLoginLoading(false);
        }
    }
    useEffect(() => {
        if (token && token !== "") {
            navigate('/dashboard');
        }
    }, [token])

    return (
        loginLoading ? <div>logging in</div> :
            <div className="min-h-screen w-full px-4 py-6 flex justify-center items-center bg-gray-50 overflow-x-hidden">
                <div className="w-full max-w-md flex flex-col gap-4 text-black">
                    <h2 className="text-4xl text-center">Query Note</h2>
                    <h3 className="text-xl text-center">Create an account</h3>
                    <p className="text-black text-center text-sm">
                        Let's get started. Fill in the details below to create your account.
                    </p>

                    <input type="email" name="email" placeholder="Email" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" name="username" placeholder="Username" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" name="password" placeholder="Password" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => setPassword(e.target.value)} />

                    <button className="text-white bg-black py-3 rounded-xl w-full" onClick={() => signUpHandle()}>
                        {signUpLoading ? "loading" : "signUp"}
                    </button>
                    <p className="text-gray-500 text-center text-sm">
                        Already have an account? <Link to="/login" className="underline cursor-pointer">Sign in</Link>
                    </p>
                </div>
            </div >
    );
};

export default RegisterPage;

