import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Modal, Backdrop, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Maximize2, Volume2 } from "lucide-react";

const reducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Muted, looping preview that only plays while it is on screen — keeps a page
 * full of clips cheap. The poster carries the frame until video data arrives,
 * and clicking opens the clip with sound and full controls.
 */
export const VideoFrame = ({
    src,
    poster,
    label,
    duration,
    fit = "cover",
    onExpand,
    className = "",
}) => {
    const videoRef = useRef(null);
    const { ref: inViewRef, inView } = useInView({ threshold: 0.2 });

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        // Set muted on the element itself; browsers only allow autoplay when muted.
        video.muted = true;
        if (inView && !reducedMotion()) {
            // Rejects when the browser still blocks autoplay — the poster stays up.
            video.play().catch(() => { });
        } else {
            video.pause();
        }
    }, [inView]);

    return (
        <div
            ref={inViewRef}
            className={`relative overflow-hidden bg-black group ${className}`}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                muted
                loop
                playsInline
                preload="none"
                className={`w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
            />

            {/* Bottom scrim carries the label without covering the action */}
            {(label || duration) && (
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none">
                    <div className="flex items-end justify-between gap-3">
                        {label && (
                            <span className="text-white text-sm md:text-base font-medium drop-shadow">
                                {label}
                            </span>
                        )}
                        {duration && (
                            <span className="text-[11px] font-mono text-slate-300 bg-black/50 px-1.5 py-0.5 rounded">
                                {duration}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {onExpand && (
                <button
                    type="button"
                    onClick={onExpand}
                    aria-label={`Play ${label || "clip"} with sound`}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300"
                >
                    <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white text-sm font-medium">
                        <Volume2 size={16} />
                        Play with sound
                        <Maximize2 size={14} className="opacity-70" />
                    </span>
                </button>
            )}
        </div>
    );
};

/** Full-size player with native controls and audio. */
export const VideoLightbox = ({ clip, onClose }) => (
    <Modal
        open={Boolean(clip)}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
            timeout: 300,
            sx: { backgroundColor: "rgba(0,0,0,0.92)", backdropFilter: "blur(6px)" },
        }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
    >
        <div className="relative w-full max-w-6xl outline-none">
            <IconButton
                onClick={onClose}
                aria-label="Close player"
                sx={{
                    position: "absolute",
                    right: 8,
                    top: -52,
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.6)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
                }}
            >
                <CloseIcon />
            </IconButton>

            {clip && (
                <>
                    <video
                        src={clip.src}
                        poster={clip.poster}
                        controls
                        autoPlay
                        loop
                        playsInline
                        className="w-full max-h-[78vh] rounded-xl bg-black"
                    />
                    <div className="mt-4 px-1">
                        <h4 className="text-white text-lg font-semibold">{clip.label}</h4>
                        {clip.caption && (
                            <p className="text-slate-400 text-sm mt-1">{clip.caption}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    </Modal>
);
