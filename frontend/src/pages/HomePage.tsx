import HeroSection from "../components/HeroSection";
import HomeNavBar from "../components/HomeNavBar";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-lavender-grey-950 text-lavender-grey-100">
            <HomeNavBar />
            <HeroSection />
        </div>
    )
}

export default HomePage;
