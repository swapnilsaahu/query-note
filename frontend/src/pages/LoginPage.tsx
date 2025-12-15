import axios from "axios";
import { useState } from "react";
import { Link } from "react-router";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);

    const loginHandle = async () => {
        try {
            const url = "http://localhost:3000/api/v1/users/login";
            const res = await axios.post(url, {
                email: email,
                password: password
            })
            if (!res.data) throw new Error

        } catch (err) {
            console.error("error while logging in");
        } finally {

        }
    }
    return (
        <div className="min-h-screen w-full px-4 py-6 flex justify-center items-center bg-gray-50 overflow-x-hidden">
            <div className="w-full max-w-md flex flex-col gap-4 text-black">
                <h2 className="text-4xl text-center">Query Note</h2>
                <h3 className="text-xl text-center">Login</h3>
                <p className="text-black text-center text-sm">
                    Enter credentials to login.
                </p>

                <input type="email" name="email" placeholder="Email" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="password" placeholder="Password" className="bg-gray-200 border border-gray-600 rounded-lg p-2 w-full" onChange={(e) => setPassword(e.target.value)} />

                <button className="text-white bg-black py-3 rounded-xl w-full" onClick={() => loginHandle()}>Login</button>

                <p className="text-gray-500 text-center text-sm">
                    Dont't have an account? <Link to="/register" className="underline cursor-pointer">register</Link>
                </p>
            </div>
        </div >

    )
}
export default LoginPage;
