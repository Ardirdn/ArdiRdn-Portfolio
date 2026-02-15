import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchToolById } from "../services/dataService";
import AnimatedBackground from "./Background";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Gamepad2,
  ChevronRight,
  Package,
  Cpu,
  Code,
  TabletSmartphone,
  ScanSearch,
  Store,
  PackageOpen,
  LockIcon,
} from "lucide-react";
import Swal from "sweetalert2";
import ImageModal from "./ImageModal";
import ReactPlayer from "react-player";

const TECH_ICONS = {
  React: Package,
  Tailwind: Package,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];

  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="group flex items-start space-x-3 p-2.5 md:p-1.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
      <div className="relative mt-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-[#1659f5] to-[#14ace3] group-hover:scale-125 transition-transform duration-300" />
      </div>
      <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors">
        {feature}
      </span>
    </li>
  );
};

const ScreenshotGrid = ({ screenshots, OnClick }) => {
  return screenshots.length > 0 ? (
    <div
      className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300"
      style={{ marginTop: "0px" }}
    >
      <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3 group">
        <TabletSmartphone className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
        Screenshots
      </h3>
      {screenshots.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
          {screenshots.map((image, index) => (
            <div
              key={index}
              className="mb-4 break-inside=avoid overflow-hidden rounded-lg group"
            >
              <div className="relative" style={{ marginTop: "0px" }}>
                <img
                  src={image}
                  className="w-full object-cover transform blur-none transition-all duration-500 will-change-transform group-hover:blur-[2px] group-hover:scale-105"
                  onClick={() => {
                    OnClick(image);
                  }}
                />
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/100 transition-colors duration-300 rounded-lg pointer-events-none" />
                <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-[#030014BB] h-1/2 max-h-44 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute inset-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <ScanSearch className=" pointer-events-none text-white opacity-0 group-hover:opacity-100 transform transition-all duration-500 will-change-transform scale-50 m-auto w-10 h-10 group-hover:scale-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 opacity-50">No screenshots added.</p>
      )}
    </div>
  ) : null;
};

const ContentItem = ({ content }) => {
  const hasImages = content.Images && content.Images.length > 0;
  const hasVid = content.Vid !== null && content.Vid !== undefined;
  const hasSingleImg = !hasImages && !hasVid && content.Img;

  return (
    <div className="pt-0 mt-0" style={{ marginTop: "0px" }}>
      <div className="text-center prose prose-invert max-w-none">
        <p className="text-xl font-bold md:text-3xl bg-gradient-to-r from-[#87abff] to-[#5279bf] bg-clip-text text-transparent leading-relaxed">
          {content.Title ? content.Title : ""}
        </p>
      </div>

      {hasImages && content.Layout === "gallery" && content.Images.length >= 2 ? (
        <div
          className="my-4 mx-auto grid grid-cols-2 gap-2 overflow-hidden"
          style={{
            maxWidth: "550px",
            height: "320px",
            gridTemplateRows: `repeat(${content.Images.length - 1}, 1fr)`
          }}
        >
          <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-xl group" style={{ gridRow: `1 / span ${content.Images.length - 1}` }}>
            <img
              src={content.Images[0]}
              alt={`${content.Title || ''} 1`}
              className="w-full h-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-xl" />
          </div>
          {content.Images.slice(1).map((img, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden border border-white/10 shadow-xl group">
              <img
                src={img}
                alt={`${content.Title || ''} ${idx + 2}`}
                className="w-full h-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-xl" />
            </div>
          ))}
        </div>
      ) : hasImages ? (
        <div className="my-4 mx-auto grid gap-3" style={{ maxWidth: "600px", gridTemplateColumns: `repeat(${Math.min(content.Images.length, 3)}, 1fr)` }}>
          {content.Images.map((img, idx) => (
            <div key={idx} className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl group">
              <img
                src={img}
                alt={`${content.Title || ''} ${idx + 1}`}
                className="w-full h-full object-contain transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                style={{ maxHeight: "350px" }}
              />
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : hasSingleImg ? (
        <div className="relative mx-auto w-5/6 w-fit flex-grow rounded-2xl my-4 overflow-hidden border border-white/10 shadow-2xl group">
          <img
            src={content.Img}
            alt={content.Title}
            className="w-full max-h-96 object-contain transform transition-transform duration-700 will-change-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl " />
          <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-[#030014BB] h-1/2 max-h-44 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      ) : hasVid ? (
        <div className="rounded-lg overflow-hidden my-4 mx-auto w-[95%] h-fit">
          <ReactPlayer
            playing={true}
            width={"100%"}
            height={"100%"}
            loop={true}
            url={content.Vid}
          />
        </div>
      ) : null}
      {content.Text === null || content.Text === undefined ? null : (
        <div className="prose prose-invert max-w-none">
          <p className="indent-10 pb-5 text-justify text-base md:text-lg text-gray-300/90 leading-relaxed">
            {content.Text}
          </p>
        </div>
      )}
      {content.Texts === null || content.Texts === undefined
        ? null
        : content.Texts?.map((text, idx) => (
          <div key={idx} className="prose prose-invert max-w-none">
            <p className="indent-10 pb-5 text-justify text-base md:text-lg text-gray-300/90 leading-relaxed">
              {text}
            </p>
          </div>
        ))}
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === "Private") {
    Swal.fire({
      icon: "info",
      title: "Source Code Private",
      text: "Maaf, source code untuk proyek ini bersifat privat.",
      confirmButtonText: "Mengerti",
      confirmButtonColor: "#3085d6",
      background: "#030014",
      color: "#ffffff",
    });
    return false;
  }
  return true;
};

const ToolsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [modalOpened, setModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [queuedImageUrl, setQueuedImageUrl] = useState(null);
  const [queuedModalOpened, setQueuedModalOpen] = useState(null);

  const ShowImageModal = (url) => {
    setQueuedImageUrl(url);
  };

  useEffect(() => {
    if (queuedImageUrl) {
      setModalImageUrl(queuedImageUrl);
      setModalOpen(true);
      setQueuedImageUrl(null); // Clear the queued URL after processing
    }
  }, [queuedImageUrl]);
  useEffect(() => {
    console.log(queuedModalOpened);
    if (queuedModalOpened) {
      alert(
        queuedModalOpened ? "Modal Will Be Opened" : "Modal Will Be Closed"
      );
      setModalOpen(queuedModalOpened);
      setQueuedModalOpen(null);
    }
  }, [queuedModalOpened]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchToolData = async () => {
      const toolData = await fetchToolById(id);
      if (toolData) {
        const enhancedTool = {
          ...toolData,
          Contents: toolData.Contents || [],
          Features: toolData.Features || [],
          TechStack: toolData.TechStack || [],
          Screenshots: toolData.Screenshots || [],
          Github: toolData.GithubRepo,
          IsPrivate: toolData.IsPrivate || false,
          ToBeReleased: toolData.ToBeReleased || false,
        };
        setTool(enhancedTool);
      } else {
        console.log("No such document!");
      }
    };
    fetchToolData();
  }, [id]);

  if (!tool) {
    return (
      <div className="min-h-screen bg-[#000714] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-8 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">
            Loading Tool...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000714] px-[2%] sm:px-0 relative overflow-hidden">
      <AnimatedBackground />
      {/* Background animations remain unchanged */}
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        <div className="max-w-[100rem] mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
              <span>Add-ons</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-white/90 truncate">{tool.Title}</span>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 md:gap-16">
            <div className="space-y-6 col-span-2 md:space-y-10 animate-slideInLeft">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl pb-3 md:text-6xl font-bold bg-gradient-to-r from-[#87abff] to-[#5279bf] bg-clip-text text-transparent leading-tight">
                  {tool.Title}
                </h1>
                <div
                  className="relative h-1 w-32 md:w-24"
                  style={{ marginTop: "0px" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1659f5] to-[#14ace3] rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1659f5] to-[#14ace3] rounded-full blur-sm" />
                </div>
              </div>

              {tool.Vid === null || tool.Vid === undefined ? (
                <div className="relative rounded-2xl my-4 overflow-hidden border border-white/10 shadow-2xl group">
                  <img
                    src={tool.Img}
                    alt={tool.Title}
                    className="w-full  object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
                  <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-[#030014BB] h-1/2 max-h-44 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ) : (
                <div className="relative rounded-2xl my-4 mx-auto w-[95%]overflow-hidden border border-white/10 shadow-2xl group">
                  <div className="rounded-lg overflow-hidden  h-fit">
                    <ReactPlayer
                      playing={true}
                      width={"100%"}
                      height={"100%"}
                      loop={true}
                      url={tool.Vid}
                    />
                  </div>
                </div>
              )}

              <div
                className="prose prose-invert max-w-none"
                style={{ marginTop: "0px" }}
              >
                <p className="indent-10 py-5 text-base md:text-lg text-gray-300/90 leading-relaxed">
                  {tool.Description}
                </p>
              </div>

              {tool.Contents?.map((content, index) => (
                <ContentItem key={index} content={content} />
              ))}
              <ScreenshotGrid
                screenshots={tool.Screenshots}
                OnClick={ShowImageModal}
              />
            </div>

            <div className="space-y-6 md:space-y-10 animate-slideInRight">
              <div className="flex flex-wrap gap-3 md:gap-4">
                {/* Action buttons */}
                {tool.StorePage === undefined ? null : (
                  <a
                    href={tool.StorePage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-[#1659f522] to-[#14ace311] hover:from-[#1659f522] hover:to-[#14ace311] text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                  >
                    <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-[#1659f522] to-[#14ace344] transition-transform duration-300 group-hover:translate-y-[0%]" />
                    <Store className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">Store Page</span>
                  </a>
                )}
                {tool.Github !== undefined ? (
                  <a
                    href={tool.Github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-[#1659f522] to-[#14ace311] hover:from-[#1659f522] hover:to-[#14ace311] text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                    onClick={(e) =>
                      !handleGithubClick(tool.Github) && e.preventDefault()
                    }
                  >
                    <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-[#1659f522] to-[#14ace344] transition-transform duration-300 group-hover:translate-y-[0%]" />
                    <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                    <span className="relative font-medium">Source Code</span>
                  </a>
                ) : null}
              </div>

              {/* Fitur Utama */}
              <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                  <Gamepad2 className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                  About Tool
                </h3>
                {tool.Features.length > 0 ? (
                  <ul className="list-none space-y-2">
                    {tool.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </ul>
                ) : null}
              </div>
              {tool.ToBeReleased ? (
                <div className="bg-white/[0.02] mb-5 backdrop-blur-xl rounded-2xl p-2 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                  <h3 className="text-xl px-4 pt-4 font-semibold text-white/90 flex items-center gap-3">
                    <PackageOpen className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                    To Be Released
                  </h3>
                  <div className="text-sm px-4 pb-4 base text-gray-300 group-hover:text-white transition-colors">
                    This tool will be uploaded soon.
                  </div>
                </div>
              ) : null}
              {tool.IsPrivate ? (
                <div className="bg-white/[0.02] mb-5 backdrop-blur-xl rounded-2xl p-2 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                  <h3 className="text-xl px-4 pt-4 font-semibold text-white/90 flex items-center gap-3">
                    <LockIcon className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                    Company Asset
                  </h3>
                  <div className="text-sm px-4 pb-4 base text-gray-300 group-hover:text-white transition-colors">
                    This tool was developed to meet the specific needs of my
                    company, and with their permission, I am showcasing it here.
                    Please note that the source code is proprietary and not
                    available for public use.
                  </div>
                </div>
              ) : null}

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-white/90 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  <Code2 className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  Technologies Used
                </h3>
                {tool.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {tool.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-gray-400 opacity-50">
                    No technologies added.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <ImageModal
          Opened={modalOpened}
          ImgUrl={modalImageUrl}
          OnClose={() => setModalOpen(false)}
        />
      </div>

      <style jsx="true">{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ToolsDetails;
