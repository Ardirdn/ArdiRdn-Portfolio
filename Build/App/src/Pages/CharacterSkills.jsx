import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import CharacterRoster from "../components/CharacterRoster";
import { characters, characterSkillsIntro } from "../services/characterSkills";

/** The whole roster, behind the showcase's "See All". */
const CharacterSkills = () => {
    const totalSkills = characters.reduce((sum, c) => sum + c.skills.length, 0);

    useEffect(() => {
        AOS.init();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#000714] text-white">
            <Navbar />

            <div className="pt-32 px-[5%] md:px-[10%] pb-20 max-w-[1920px] mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur-sm border border-white/10"
                >
                    <ArrowLeft size={20} />
                    Back to Portfolio
                </Link>

                <div className="text-center mb-12" data-aos="fade-up">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ffb4b4] to-[#ffffff] mb-4">
                        {characterSkillsIntro.title}
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
                        {characterSkillsIntro.blurb}
                    </p>
                    <p className="text-slate-500 text-xs mt-3 font-mono">
                        {characters.length} characters · {totalSkills} abilities
                    </p>
                </div>

                {/* The roster's own page shows everything; no paging here. */}
                <CharacterRoster paginate={false} />
            </div>
        </div>
    );
};

export default CharacterSkills;
