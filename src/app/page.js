import Image from "next/image";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import About from "./components/about/About";
import Chat from "./components/QnA"
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import AchievementsSection from "./components/AchievementsSection";
import MyMendableSearchBar from "./components/MendableSearch";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col bg-[#121212]">
            <Navbar />
            <div className="container mt-24 mx-auto px-12 py-4">
                <HeroSection className="mb-8" />
                <AchievementsSection className="mb-8" />
                {/* <div className="bg-gray-900 h-400 p-4 rounded-md "> */}
                    {/* <Chat /> */}
                <MyMendableSearchBar />
                {/* </div> */}
                {/* <About className="mb-8" /> */}
                <ProjectsSection className="mb-8" />
                <EmailSection className="mb-8" />
            </div>
            <Footer />
        </main>
    );
}
