import React, { useEffect, useState, useCallback } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { fetchProjects, fetchTools, fetchLevelDesigns } from "../services/dataService";
import { assetPath } from "../utils/assetPath";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import ThreeDShowcaseList from "../components/ThreeDShowcase";
import UiUxSection from "../components/UiUxSection";
import AOS from "aos";
import { motion, AnimatePresence } from "framer-motion";
import "aos/dist/aos.css";

const unrealImages = [
  "Swamp_sequence.0122.webp",
  "Swamp_sequence.0008.webp",
  "Swamp_sequence.0009.webp",
  "Swamp_sequence.0081.webp",
  "Swamp_sequence.0097.webp",
  "Swamp_sequence.0107.webp",
  "Swamp_sequence.0129.webp",
  "Swamp_sequence.0191.webp",
  "Swamp_sequence.0193.webp",
  "Swamp_sequence.0203.webp",
  "Swamp_sequence.0232.webp",
  "Swamp_sequence.0238.webp",
].map((name) => assetPath(`/assets/leveldesign/unreal/South East Asian River Village/${name}`));

const Carousel = ({ images, interval = 4000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={index}
          src={images[index]}
          alt={`Slide ${index}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
    </div>
  );
};
// import Certificate from "../components/Certificate";
import { Gamepad2, Award, Boxes, Tangent, ArrowRight } from "lucide-react";
import CardTools from "../components/CardTools";

// Engine filter options
const engineFilters = [
  { id: "all", label: "All" },
  { id: "unreal", label: "Unreal Engine" },
  { id: "unity", label: "Unity" },
  { id: "roblox", label: "Roblox" },
];

// Level Design Card for the list
const LevelDesignCard = ({ levelDesign }) => {
  const allImages = levelDesign.images.map(
    (img) => assetPath(`${levelDesign.folder}/${img}`)
  );
  const thumbnailImages = allImages.slice(0, 3);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group">
      {/* Main Image - Bigger - Static */}
      <div className="relative h-[220px] md:h-[280px] overflow-hidden">
        <img
          src={assetPath(levelDesign.thumbnail)}
          alt={levelDesign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {/* Thumbnails - Bigger - Rotating */}
      <div className="flex h-[70px] md:h-[90px]">
        {[0, 1, 2].map((i) => {
          // Distribute images across 3 slots
          const slotImages = allImages.filter((_, idx) => idx % 3 === i);
          return (
            <div key={i} className="flex-1 overflow-hidden relative border-r border-slate-900/50 last:border-r-0">
              {slotImages.length > 0 ? (
                <Carousel images={slotImages} interval={3000 + i * 1000} />
              ) : (
                <div className="w-full h-full bg-slate-800" />
              )}
            </div>
          );
        })}
      </div>
      {/* Info Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-semibold text-base md:text-lg group-hover:text-blue-400 transition-colors truncate flex-1">
            {levelDesign.title}
          </h4>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ml-2 ${levelDesign.engine === "unreal"
              ? "bg-purple-500/20 text-purple-300"
              : levelDesign.engine === "unity"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
              }`}
          >
            {levelDesign.engine === "unreal"
              ? "Unreal"
              : levelDesign.engine === "unity"
                ? "Unity"
                : "Roblox"}
          </span>
        </div>
        <Link
          to={`/level-designs/${levelDesign.id}`}
          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          See All Images
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

// Level Design List Section Component
const LevelDesignList = () => {
  const [levelDesigns, setLevelDesigns] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchLevelDesigns();
      setLevelDesigns(data);
    };
    loadData();
  }, []);

  const filteredDesigns =
    activeFilter === "all"
      ? levelDesigns
      : levelDesigns.filter((ld) => ld.engine === activeFilter);

  // Show only first 6 items
  const displayedDesigns = filteredDesigns.slice(0, 6);

  return (
    <div className="w-full flex flex-col items-center justify-center mb-10">
      <h3
        className="text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#cebdfc] to-[#ffffff] mb-6 text-center"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        Level Design Gallery
      </h3>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6" data-aos="fade-up">
        {engineFilters.map((engine) => (
          <button
            key={engine.id}
            onClick={() => setActiveFilter(engine.id)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-300 border ${activeFilter === engine.id
              ? "bg-blue-600 border-blue-500 text-white"
              : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
              }`}
          >
            {engine.label}
          </button>
        ))}
      </div>

      {/* Level Design Grid */}
      <div
        className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        {displayedDesigns.map((ld) => (
          <LevelDesignCard key={ld.id} levelDesign={ld} />
        ))}
      </div>

      {/* See All Button */}
      <Link
        to="/level-designs"
        className="mt-6 flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 group"
        data-aos="fade-up"
      >
        See All Level Designs
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};


// Separate ShowMore/ShowLess button component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore
            ? "group-hover:-translate-y-0.5"
            : "group-hover:translate-y-0.5"
          }
        `}
      >
        <polyline
          points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
        ></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  { icon: "unity.svg", language: "Unity" },
  { icon: "icons/UnrealEngine.png", language: "Unreal Engine" },
  { icon: "icons/Roblox.png", language: "Roblox" },
  { icon: "blender.svg", language: "Blender" },
  { icon: "icons/SubstancePainter.png", language: "Substance Painter" },
  { icon: "icons/SubstanceStager.png", language: "Substance Stager" },
  { icon: "icons/CharacterCreator.png", language: "Character Creator" },
  { icon: "icons/Iclone.png", language: "iClone" },
  { icon: "ai-icon.svg", language: "Illustrator" },
  { icon: "photoshop.svg", language: "Photoshop" },
  { icon: "git.svg", language: "Git" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [tools, setTools] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllTools, setShowAllTools] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    // Initialize AOS once
    AOS.init({
      once: false, // This will make animations occur only once
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [projectData, toolData] = await Promise.all([
        fetchProjects(),
        fetchTools(),
      ]);

      // Data sudah di-sort di file JSON, tapi sort lagi untuk memastikan
      projectData.sort((a, b) => (b.Order || 0) - (a.Order || 0));
      toolData.sort((a, b) => (b.Order || 0) - (a.Order || 0));

      setProjects(projectData);
      setTools(toolData);

      // Store in localStorage
      localStorage.setItem("projects", JSON.stringify(projectData));
      localStorage.setItem("tools", JSON.stringify(toolData));
      console.log("Data stored in localStorage");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === "projects") {
      setShowAllProjects((prev) => !prev);
    } else if (type === "tools") {
      setShowAllTools((prev) => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects
    ? projects
    : projects.slice(0, initialItems);
  const displayedTools = showAllTools ? tools : tools.slice(0, initialItems);

  return (
    <div
      className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#000714] overflow-hidden"
      id="Portfolio"
    >
      {/* Header section - unchanged */}
      <div
        className="text-center pb-10"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#1659f5] to-[#14ace3]">
          <span
            style={{
              color: "#1659f5",
              backgroundImage:
                "linear-gradient(45deg, #1659f5 10%, #14ace3 93%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through games, tools, and technical expertise. Each
          section represents a milestone in my continuous learning path.
        </p>
      </div>

      {/* Latest Level Design Section */}
      <div className="w-full flex flex-col items-center justify-center mb-10 text-left">
        <div className="w-full">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 text-left pl-1"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            Latest - South East Asian River Village
          </h3>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Video - Left Side (3/4 width) */}
          <div
            className="md:col-span-3 w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 relative"
            style={{ aspectRatio: "21/9" }}
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            <div className="absolute inset-0 w-full h-full scale-[1.35]">
              <ReactPlayer
                url="https://youtu.be/mIUstqdJnkU"
                width="100%"
                height="100%"
                playing={true}
                muted={true}
                controls={false}
                loop={true}
                config={{
                  youtube: {
                    playerVars: { showinfo: 0, controls: 0, modestbranding: 1, rel: 0, vq: 'hd1080' }
                  }
                }}
              />
            </div>
          </div>

          {/* 2 Images Right Side - Stacked Vertically (1/4 width) */}
          <div
            className="md:col-span-1 flex flex-col gap-4 h-full"
            data-aos="fade-up"
            data-aos-duration="1400"
          >
            <div className="flex-1 relative rounded-xl overflow-hidden border border-white/10 min-h-[80px]">
              <Carousel images={unrealImages.slice(0, 6)} interval={4000} />
            </div>
            <div className="flex-1 relative rounded-xl overflow-hidden border border-white/10 min-h-[80px]">
              <Carousel images={unrealImages.slice(6, 12)} interval={5000} />
            </div>
          </div>
        </div>
      </div>

      {/* Level Design List Section */}
      <LevelDesignList />

      {/* 3D Showcase List Section */}
      <ThreeDShowcaseList />

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-0"
        >
          {/* Tabs remain unchanged */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              // Existing styles remain unchanged
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(92, 184, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background:
                    "linear-gradient(135deg, rgba(92, 141, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(92, 154, 246, 0.2)",
                  "& .lucide": {
                    color: "#8bacfa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={
                <Gamepad2 className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Games"
              {...a11yProps(0)}
            />
            <Tab
              icon={
                <Tangent className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Add-ons & Tools"
              {...a11yProps(1)}
            />
            <Tab
              icon={
                <Boxes className="mb-2 w-5 h-5 transition-all duration-300" />
              }
              label="Skills"
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={
                      index % 3 === 0
                        ? "fade-up-right"
                        : index % 3 === 1
                          ? "fade-up"
                          : "fade-up-left"
                    }
                    data-aos-duration={
                      index % 3 === 0
                        ? "1000"
                        : index % 3 === 1
                          ? "1200"
                          : "1000"
                    }
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore("projects")}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedTools.map((tool, index) => (
                  <div
                    key={tool.id || index}
                    data-aos={
                      index % 3 === 0
                        ? "fade-up-right"
                        : index % 3 === 1
                          ? "fade-up"
                          : "fade-up-left"
                    }
                    data-aos-duration={
                      index % 3 === 0
                        ? "1000"
                        : index % 3 === 1
                          ? "1200"
                          : "1000"
                    }
                  >
                    <CardTools
                      Img={tool.Img}
                      Title={tool.Title}
                      Description={tool.Description}
                      Link={tool.Link}
                      id={tool.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {tools.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore("tools")}
                  isShowingMore={showAllTools}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={
                      index % 3 === 0
                        ? "fade-up-right"
                        : index % 3 === 1
                          ? "fade-up"
                          : "fade-up-left"
                    }
                    data-aos-duration={
                      index % 3 === 0
                        ? "1000"
                        : index % 3 === 1
                          ? "1200"
                          : "1000"
                    }
                  >
                    <TechStackIcon
                      TechStackIcon={stack.icon}
                      Language={stack.language}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
      <UiUxSection />
    </div>
  );
}
