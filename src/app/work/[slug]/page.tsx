import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { MuxVideo } from "@/components/MuxVideo";
import { EditableText } from "@/components/EditableText";
import { CaseStudyEditor } from "@/components/CaseStudyEditor";
import { getCaseStudy, getAllCaseStudies } from "@/lib/content";
import Image from "next/image";
import { BackButton } from "@/components/BackButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const studies = getAllCaseStudies();
  return studies
    .filter((s) => s.status === "live")
    .map((s) => ({ slug: s.slug }));
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study || study.status === "placeholder") notFound();

  return (
    <main>
      <BackButton href="/#work" />

      {/* Hero media — full-width, above the fold, clears the nav */}
      <div className="w-full pt-2 pl-2 pr-2">
        {study.heroMuxId ? (
          <MuxVideo playbackId={study.heroMuxId} />
        ) : (
          <div className="relative w-full aspect-video bg-black/4">
            <Image
              src={study.bg}
              alt={study.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col items-center px-6 pt-16 pb-24">
        <div className="w-full max-w-[1200px] flex flex-col gap-16">

          {/* Hero text */}
          <header className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium tracking-widest uppercase text-black/30">
                {study.year}
              </span>
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-black/12 text-black/40"
                >
                  {tag}
                </span>
              ))}
            </div>

            <EditableText
              file={`work/${slug}`}
              contentPath="title"
              tag="h1"
              className="text-3xl font-semibold leading-tight text-black/90 tracking-tight"
            >
              {study.title}
            </EditableText>

            <EditableText
              file={`work/${slug}`}
              contentPath="intro"
              tag="p"
              className="text-xl text-black/50 leading-relaxed"
            >
              {study.intro}
            </EditableText>
          </header>

          {/* Sections */}
          <CaseStudyEditor slug={slug} initialSections={study.sections} />

        </div>
      </div>

      <Footer />
    </main>
  );
}
