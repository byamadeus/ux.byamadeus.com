import Image from "next/image";
import Link from "next/link";
import type { CaseStudy } from "@/lib/content";
import { ArrowRight } from "lucide-react";

interface CaseStudyCardProps {
  study: CaseStudy;
}

export function CaseStudyCard({ study }: CaseStudyCardProps) {
  const isPlaceholder = study.status === "placeholder";

  const card = (
    <div className={`flex flex-col mb-18 ${isPlaceholder ? "opacity-40 cursor-default" : "group cursor-pointer"}`}>
      {/* Gradient bg + centered logo */}
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <Image
          src={study.bg}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
          priority
        />
        {/* Centered logo overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Image
              src={study.thumbnail}
              alt={study.label}
              width={120}
              height={120}
              className="object-contain drop-shadow-lg"
              style={{ maxWidth: "240px", maxHeight: "160px", width: "auto", height: "auto" }}
            />
          </div>
        </div>

        {isPlaceholder && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-white/70 text-sm font-medium tracking-widest uppercase">
              Coming Soon
            </span>
          </div>
        )}
      </div>

      {/* Text below card */}
      <div className="flex flex-col gap-1 pt-4 px-1">
        <span className="text-sm text-black/40 font-semibold">
          {study.year}
           {/* • {study.role} */}
        </span>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-semibold text-black/90 leading-snug">
            {study.title}
          </h3>
          <ArrowRight size={16}/>
          {/* {!isPlaceholder && (
            <span className="text-2xl text-black/40 group-hover:text-black/80 transition-colors mt-0.5 shrink-0">
              →
            </span>
          )} */}
        </div>
        <p className="text-base text-black/50 leading-relaxed max-w-2xl">
          {study.description}
        </p>
      </div>
    </div>
  );

  if (isPlaceholder) return card;
  return <Link href={`/work/${study.slug}`}>{card}</Link>;
}
