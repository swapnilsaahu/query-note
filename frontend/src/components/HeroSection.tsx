import { Link } from "react-router";

const HeroSection = () => {
    return (
        <div className="h-screen flex justify-center items-center -translate-y-15">
            <div className="text-center">
                <h1 className="text-8xl m-2 text-lavender-grey-200">All Your Queries.</h1>
                <h2 className="text-6xl m-2 text-lavender-grey-300">One Smart Place.</h2>
                <p className="text-lavender-grey-200">Clear notes, instant explanations, and structured answers — exactly when you need them.</p>
                <div className="text-2xl mt-8 text-lavender-grey-900 bg-lavender-grey-400 rounded-4xl px-8 py-4 inline-block hover:bg-lavender-grey-200">
                    <Link to="register">Get Started</Link>
                </div>
            </div>
        </div >
    )
}

export default HeroSection;
