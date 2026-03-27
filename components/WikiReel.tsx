"use client";

import { WikiArticle } from "@/types/wiki";
import Image from "next/image";

interface Props {
  article: WikiArticle;
  isActive: boolean;
}

export default function WikiReel({ article, isActive }: Props) {
  const hasThumbnail = !!article.thumbnail;

  return (
    <div
      className={`relative h-screen w-full flex-shrink-0 flex flex-col justify-end overflow-hidden transition-opacity duration-500 ${
        isActive ? "opacity-100" : "opacity-40"
      }`}
    >
      {/* Background */}
      {hasThumbnail ? (
        <>
          <Image
            src={article.thumbnail!.source}
            alt={article.title}
            fill
            className="object-cover"
            priority={isActive}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      )}

      {/* Content */}
      <div className="relative z-10 p-6 pb-16 max-w-2xl mx-auto w-full">
        <div className="mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Wikipedia
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
          {article.title}
        </h1>

        <p className="text-white/80 text-sm leading-relaxed line-clamp-6 drop-shadow">
          {article.extract}
        </p>

        <a
          href={article.pageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 transition-colors"
        >
          Read full article
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
