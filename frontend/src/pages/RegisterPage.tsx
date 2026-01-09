import api from "../lib/api";
import { useState } from "react";
import { Link } from "react-router";
import useUserStore from "../store/UserStore";
import { BeatLoader } from "react-spinners";

const RegisterPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState("");
    const [signUpLoading, setSignUpLoading] = useState<boolean>(false);
    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [showError, setError] = useState(false);
    const addDetails = useUserStore(state => state.addDetials)
    const signUpHandle = async () => {
        try {
            setSignUpLoading(true);
            const url = "/api/v1/users/register"
            const res = await api.post(url, {
                email: email,
                password: password,
                username: username
            })
            if (res.data.success) {
                setLoginLoading(true);
                const loginUrl = "/api/v1/users/login";
                const resLogin = await api.post(loginUrl, {
                    email: email,
                    password: password
                })
                if (resLogin.data.success) {
                    const accessToken = resLogin.data.accessToken
                    addDetails(email, accessToken);
                }
            }

        } catch (error) {
            setError(true);
            console.error("error while signing up", error);
        } finally {
            setSignUpLoading(false);
            setLoginLoading(false);
        }
    }
    // useEffect(() => {
    //     if (token && token !== "") {
    //         navigate('/dashboard');
    //     }
    // }, [token])

    return (
        loginLoading ? <div>logging in</div> :
            <div className="min-h-screen w-full px-4 py-6 flex justify-center items-center overflow-x-hidden bg-lavender-grey-900 text-lavender-grey-100">
                <div className="w-full max-w-md flex flex-col gap-4">
                    <h2 className="text-4xl text-center">Query Note</h2>
                    <h3 className="text-xl text-center">Create an account</h3>
                    <p className="text-lavender-grey-300 text-center text-sm">
                        Let's get started. Fill in the details below to create your account.
                    </p>

                    <input type="email" name="email" placeholder="Email" className="bg-gray-200 border border-lavender-grey-600 rounded-lg p-2 w-full text-lavender-grey-900" onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" name="username" placeholder="Username" className="bg-gray-200 border border-lavender-grey-600 rounded-lg p-2 w-full text-lavender-grey-900" onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" name="password" placeholder="Password" className="bg-gray-200 border border-lavender-grey-600 rounded-lg p-2 w-full text-lavender-grey-900" onChange={(e) => setPassword(e.target.value)} />

                    <button className="text-lavender-grey-100 bg-lavender-grey-950 py-3 rounded-xl w-full hover:bg-lavender-grey-700" onClick={() => signUpHandle()}>
                        {signUpLoading ? <BeatLoader /> : "Sign up"}
                    </button>
                    <p className="text-gray-500 text-center text-sm">
                        Already have an account? <Link to="/login" className="underline cursor-pointer">Sign in</Link>
                    </p>
                    {showError ?
                        <div className="flex bg-red-600 text-lavender-grey-100 p-4 justify-center rounded-xl">
                            <p>Error while sign up</p>
                        </div>
                        : <div></div>
                    }
                </div>
            </div >
    );
};

export default RegisterPage;

