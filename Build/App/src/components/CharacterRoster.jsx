import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { characters, roles } from "../services/characterSkills";

/** How many portraits show before "Show more" — two full rows on desktop. */
const PAGE = 12;

/** One portrait. In preview mode it is a plain tile with nothing to click. */
const Portrait = ({ character, index, interactive }) => {
    const body = (
        <>
            <div className="relative aspect-square overflow-hidden bg-black">
                <img
                    src={character.thumbnail}
                    alt={character.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-500 ${interactive ? "group-hover:scale-105" : ""
                        }`}
                />
                <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-slate-200 border border-white/10">
                    {character.skills.length}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-2.5">
                    <h4 className="text-white text-sm font-semibold leading-tight drop-shadow">
                        {character.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">{character.series}</span>
                </div>
            </div>

            <div className="px-2.5 py-2 flex items-center justify-between gap-1">
                <span className="text-[10px] uppercase tracking-wider text-rose-300/80">
                    {character.role}
                </span>
                {interactive && (
                    <ArrowRight
                        size={13}
                        className="text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                    />
                )}
            </div>
        </>
    );

    const shell =
        "flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl overflow-hidden border border-white/10";

    if (!interactive) {
        return (
            <div
                className={shell}
                aria-hidden="true"
                data-aos="fade-up"
                data-aos-delay={(index % 6) * 60}
            >
                {body}
            </div>
        );
    }

    return (
        <Link
            to={`/character-skills/${character.id}`}
            className={`group ${shell} hover:border-rose-400/40 hover:-translate-y-1 transition-all duration-300`}
            data-aos="fade-up"
            data-aos-delay={(index % 6) * 60}
        >
            {body}
        </Link>
    );
};

/**
 * The roster. Video-free on purpose — 37 portraits are a few hundred KB, where
 * 37 autoplaying clips would not be. The clips live one click away.
 *
 * `preview` renders a look-only strip for the landing page: no filters, no
 * paging, nothing clickable. `paginate={false}` shows everything at once, which
 * is what the roster's own page wants.
 */
const CharacterRoster = ({ preview = false, paginate = true, limit = PAGE }) => {
    const [role, setRole] = useState("all");
    const [visible, setVisible] = useState(PAGE);

    const matching = useMemo(
        () => (role === "all" ? characters : characters.filter((c) => c.role === role)),
        [role]
    );

    const shown = preview
        ? matching.slice(0, limit)
        : paginate
            ? matching.slice(0, visible)
            : matching;
    const remaining = paginate && !preview ? matching.length - shown.length : 0;

    const filters = [{ id: "all", label: `All ${characters.length}` }].concat(
        roles.map((r) => ({
            id: r,
            label: `${r} (${characters.filter((c) => c.role === r).length})`,
        }))
    );

    return (
        <>
            {!preview && (
                <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            type="button"
                            role="tab"
                            aria-selected={filter.id === role}
                            onClick={() => {
                                setRole(filter.id);
                                setVisible(PAGE);
                            }}
                            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-all duration-300 border ${filter.id === role
                                ? "bg-rose-600 border-rose-500 text-white"
                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {shown.map((character, index) => (
                    <Portrait
                        key={character.id}
                        character={character}
                        index={index}
                        interactive={!preview}
                    />
                ))}
            </div>

            {remaining > 0 && (
                <div className="flex justify-center mt-8">
                    <button
                        type="button"
                        onClick={() => setVisible((n) => n + PAGE)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 group"
                    >
                        Show {Math.min(remaining, PAGE)} more
                        <span className="text-slate-500 group-hover:text-slate-300">
                            ({remaining} left)
                        </span>
                    </button>
                </div>
            )}
        </>
    );
};

export default CharacterRoster;
