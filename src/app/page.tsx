import { Footer } from "@/components/Footer";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { ScrollLottie } from "@/components/ScrollLottie";
import BlitzText from "@/components/BlitzText";
import { ProjectDrawer } from "@/components/ProjectDrawer";
import { getHomeContent, getAllCaseStudies } from "@/lib/content";

export default function Home() {
  const home = getHomeContent();
  const studies = getAllCaseStudies();

  return (
    <main className="bg-white min-h-screen">

      {/* Hero */}
      <header className="flex flex-col items-center justify-center min-h-[95vh] px-6 text-center gap-6">
        <div className="w-full">
          <BlitzText text="Amadeus" />
        </div>
        <p className="text-xl text-black/80 max-w-2xl leading-relaxed">
          {home.hero.headline}
        </p>
        <p className="text-lg text-black/50 max-w-xl leading-relaxed">
          {home.hero.subline}
        </p>
        <ProjectDrawer />
      </header>

      {/* Case Studies — full-width vertical stack */}
      <section id="work" className="flex flex-col gap-0 px-6 pb-8 max-w-4xl mx-auto">
        {studies.map((study) => (
          <CaseStudyCard key={study.slug} study={study} />
        ))}
      </section>

      {/* Philosophy — scroll-scrubbed full-screen Lottie sections */}
      <section>
        <ScrollLottie
          src="/lottie/Absorb.json"
          scrollMultiplier={3}
          text={
            <span className="text-black/80">
              {home.philosophy.intro} <em>absorb.</em>
            </span>
          }
        />
        <ScrollLottie
          src="/lottie/Understand.json"
          scrollMultiplier={3}
          text={
            <span className="text-white/90">
              Then I <em>understand.</em>
            </span>
          }
        />
        <ScrollLottie
          src="/lottie/Collab.json"
          scrollMultiplier={3}
          text={
            <span className="text-white/90">
              Influencing designs and mindsets across a <em>team.</em>
            </span>
          }
        />
        <ScrollLottie
          src="/lottie/Share.json"
          scrollMultiplier={3}
          text={
            <span className="text-white/90">
              Then I <em>share.</em>
            </span>
          }
        />
      </section>

      {/* CTA */}
      {/* <section className="flex justify-center py-24 px-6">
        <a
          href={home.ctaHref}
          className="text-2xl text-black/60 hover:text-black transition-colors"
        >
          [{home.cta}]
        </a>
      </section> */}

      <Footer variant="green" />
    </main>
  );
}
