import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../components/Navbar";
import CardProject from "../components/CardProject";
import SystemsShowcase from "../components/SystemsShowcase";
import Carousel from "../components/Carousel";
import { CharacterCard } from "../components/CharacterSkillsShowcase";
import { ClipGrid } from "../components/GallerySection";
import { VideoLightbox } from "../components/VideoShowcase";
import { assetPath } from "../utils/assetPath";
import { fetchProjects, fetchLevelDesigns } from "../services/dataService";
import { featuredCharacters } from "../services/characterSkills";
import { robloxSystems } from "../services/systems";
import {
    robloxProjects,
    robloxLevelDesigns,
    robloxVfxClips,
    robloxCharacters,
    robloxSkillCount,
} from "../services/roblox";

const FEATURED_GAMES = 6;

// The maps the Environment Art block leads with, in the order they appear:
// the first gets the wide slot, the next two stack beside it, the rest sit in
// a row underneath. Named rather than sliced so adding a map elsewhere in the
// gallery does not silently change what this page features.
const FEATURED_MAPS = [
    "cinematic-mountain",
    "cozy-cafe",
    "private-conference-island",
    "japanese-lake",
    "fishing-village-lobby",
];

/** Section heading in the same shape the landing-page showcases use. */
const SectionHead = ({ title, blurb, note }) => (
    <div className="text-center mb-10" data-aos="fade-up" data-aos-duration="1000">
        <h3 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9ad7ff] to-[#ffffff] mb-4">
            {title}
        </h3>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">{blurb}</p>
        {note && <p className="text-slate-500 text-xs mt-3 font-mono">{note}</p>}
    </div>
);

const SeeAll = ({ to, children }) => (
    <div className="flex justify-center mt-8" data-aos="fade-up">
        <Link
            to={to}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 group"
        >
            {children}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
);

const Stat = ({ value, label }) => (
    <div className="text-center">
        <div className="text-2xl md:text-4xl font-bold text-white">{value}</div>
        <div className="text-[11px] md:text-xs uppercase tracking-wider text-slate-500 mt-1">
            {label}
        </div>
    </div>
);

const designImages = (design) =>
    design.images.map((img) => assetPath(`${design.folder}/${img}`));

/**
 * Featured map: image only, no card around it. The title sits above the grid
 * and the blurb below, the way the landing page presents its latest level
 * design — the whole block is a link into that map's gallery.
 */
const FeaturedMap = ({ design, aspect, interval, delay }) => (
    <Link
        to={`/level-designs/${design.id}`}
        className="group relative block w-full h-full rounded-xl overflow-hidden border border-white/10 hover:border-[#00a2ff]/40 transition-colors duration-300 min-h-[80px]"
        style={aspect ? { aspectRatio: aspect } : undefined}
        data-aos="fade-up"
        data-aos-duration="1200"
        data-aos-delay={delay}
        aria-label={design.title}
    >
        <Carousel images={designImages(design)} interval={interval} alt={design.title} />
        <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-medium text-white bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {design.title}
        </span>
    </Link>
);

const Roblox = () => {
    const [projects, setProjects] = useState([]);
    const [levelDesigns, setLevelDesigns] = useState([]);
    const [clip, setClip] = useState(null);

    useEffect(() => {
        AOS.init({ once: false });
        window.scrollTo(0, 0);
        let alive = true;
        Promise.all([fetchProjects(), fetchLevelDesigns()]).then(([p, l]) => {
            if (!alive) return;
            setProjects(robloxProjects(p));
            setLevelDesigns(robloxLevelDesigns(l));
        });
        return () => {
            alive = false;
        };
    }, []);

    // Keep FEATURED_MAPS order, drop any id that is not in the data.
    const featuredMaps = FEATURED_MAPS
        .map((id) => levelDesigns.find((d) => d.id === id))
        .filter(Boolean);

    return (
        <div className="min-h-screen bg-[#000714] text-white">
            <Navbar />

            <div className="pt-32 px-[5%] md:px-[10%] pb-20 max-w-[1920px] mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg backdrop-blur-sm border border-white/10"
                >
                    <ArrowLeft size={20} />
                    Back to Portfolio
                </Link>

                {/* Hero */}
                <div className="text-center mb-16" data-aos="fade-up">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00a2ff] to-[#ffffff] mb-5">
                        Roblox Development
                    </h1>
                    <p className="text-slate-400 max-w-3xl mx-auto text-sm md:text-lg">
                        Everything built on Roblox in one place — shipped experiences,
                        a full combat roster with its ability set, environment art, and
                        the reward and UI flows that sit around them.
                    </p>

                    <div
                        className="flex flex-wrap justify-center gap-8 md:gap-14 mt-10 py-6 border-y border-white/10"
                        data-aos="fade-up"
                        data-aos-delay="150"
                    >
                        <Stat value={projects.length || "—"} label="Experiences" />
                        <Stat value={robloxCharacters.length} label="Characters" />
                        <Stat value={robloxSkillCount} label="Abilities" />
                        <Stat value={levelDesigns.length || "—"} label="Maps" />
                        <Stat value={robloxVfxClips.length} label="UI / VFX Flows" />
                        <Stat value={robloxSystems.length} label="Systems" />
                    </div>
                </div>

                
                
                
                {/* Environment art */}
                <section className="mb-20" id="roblox-maps">
                    <SectionHead
                        title="Environment Art"
                        blurb="Stylised low-poly environments built in Studio, from a cinematic mountain range to interior spaces."
                        note={`${levelDesigns.length} maps`}
                    />
                    {featuredMaps.length > 0 && (
                        <>
                            <h4
                                className="text-xl md:text-2xl font-semibold text-white mb-4 pl-1"
                                data-aos="fade-up"
                            >
                                {featuredMaps[0].title}
                            </h4>
                            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-3">
                                    <FeaturedMap
                                        design={featuredMaps[0]}
                                        aspect="21/9"
                                        interval={4000}
                                    />
                                </div>
                                <div className="md:col-span-1 flex flex-col gap-4 h-full">
                                    {featuredMaps.slice(1, 3).map((design, i) => (
                                        <div key={design.id} className="flex-1 min-h-[120px]">
                                            <FeaturedMap
                                                design={design}
                                                interval={5000 + i * 1000}
                                                delay={200 + i * 200}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {featuredMaps.length > 3 && (
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {featuredMaps.slice(3).map((design, i) => (
                                        <FeaturedMap
                                            key={design.id}
                                            design={design}
                                            aspect="16/9"
                                            interval={6000 + i * 1000}
                                            delay={i * 150}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    <SeeAll to="/level-designs?engine=roblox">See All Level Designs</SeeAll>
                </section>
                {/* Systems & mechanics */}
                <section className="mb-20" id="roblox-systems">
                    <SectionHead
                        title="Systems &amp; Mechanics"
                        blurb="Gameplay systems built end to end in Studio — weapons, vehicles, NPC behaviour, economy UI and the physics mechanics around them."
                        note={`${robloxSystems.length} systems`}
                    />
                    <SystemsShowcase only={robloxSystems} showHeader={false} />
                </section>
{/* Character skills — featured, then the whole roster underneath */}
                <section className="mb-20" id="roblox-characters">
                    <SectionHead
                        title="Character Skills"
                        blurb="The battlegrounds roster, captured in Roblox Studio. Each character has a basic combo, four skills and an ultimate, recorded solo and against a target."
                        note={`${robloxCharacters.length} characters · ${robloxSkillCount} abilities`}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {featuredCharacters.map((character, index) => (
                            <CharacterCard
                                key={character.id}
                                character={character}
                                index={index}
                                onExpand={setClip}
                            />
                        ))}
                    </div>
                    <SeeAll to="/character-skills">
                        See All {robloxCharacters.length} Characters
                    </SeeAll>
                </section>
                {/* Experiences — featured, rest behind See All */}
                <section className="mb-20" id="roblox-games">
                    <SectionHead
                        title="Published Experiences"
                        blurb="Live on Roblox — open any one for the full breakdown of the role, the systems and the art."
                        note={`${projects.length} experiences`}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.slice(0, FEATURED_GAMES).map((project, index) => (
                            <div
                                key={project.id}
                                data-aos="fade-up"
                                data-aos-delay={(index % 3) * 100}
                            >
                                <CardProject
                                    Img={project.Img}
                                    Title={project.Title}
                                    Description={project.Description}
                                    Link={project.StorePage}
                                    id={project.id}
                                />
                            </div>
                        ))}
                    </div>
                    {projects.length > FEATURED_GAMES && (
                        <SeeAll to="/roblox/games">
                            See All {projects.length} Experiences
                        </SeeAll>
                    )}
                </section>
                
                {/* Reward & UI flows */}
                <section className="mb-20" id="roblox-vfx">
                    <SectionHead
                        title="Reward &amp; UI Flows"
                        blurb="Gift box, case opening and RNG roll sequences — the moments a player reads as payoff, timed for anticipation and reveal."
                        note={`${robloxVfxClips.length} flows`}
                    />
                    <ClipGrid clips={robloxVfxClips} />
                </section>

                <div className="flex justify-center" data-aos="fade-up">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 group"
                    >
                        See the rest of the portfolio
                        <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>
            </div>

            <VideoLightbox clip={clip} onClose={() => setClip(null)} />
        </div>
    );
};

export default Roblox;
