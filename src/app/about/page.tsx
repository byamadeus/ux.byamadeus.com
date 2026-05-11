import { Footer } from "@/components/Footer";
import { EditableText } from "@/components/EditableText";
import { AboutImageEditor } from "@/components/AboutImageEditor";
import { SectionRenderer } from "@/components/SectionRenderer";
import { getAboutContent } from "@/lib/content";
import { Download } from "lucide-react";

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseDuration(period: string): string {
  const [startStr, endStr] = period.split(/\s*[–-]\s*/);
  if (!startStr || !endStr) return "";

  const parseDate = (s: string) => {
    const t = s.trim();
    if (t.toLowerCase() === "present") return new Date();
    const [mon, yr] = t.split(" ");
    return new Date(parseInt(yr), MONTHS[mon] ?? 0);
  };

  const start = parseDate(startStr);
  const end = parseDate(endStr);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;

  if (months < 12) return `${months}mo`;
  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  return rem === 0 ? `${yrs}yr` : `${yrs}yr ${rem}mo`;
}

export default function About() {
  const about = getAboutContent();

  return (
    <main>
      <div className="flex flex-col items-center px-6 pt-32 pb-24 gap-40">

        {/* Bio */}
        <div className="w-full max-w-[800px] flex flex-col gap-16">
          <AboutImageEditor initialSrc={about.image} />

          <header className="flex flex-col gap-8">
            <EditableText
              file="about"
              contentPath="headline"
              tag="h1"
              className="text-3xl font-semibold leading-tight text-black/90 tracking-tight"
            >
              {about.headline}
            </EditableText>

            <div className="flex flex-col gap-4">
              {about.bio.map((para, i) => (
                <EditableText
                  key={i}
                  file="about"
                  contentPath={`bio.${i}`}
                  tag="p"
                  className="text-xl text-black/50 leading-relaxed"
                >
                  {para}
                </EditableText>
              ))}
            </div>
          </header>
        </div>

        {/* Philosophy */}
        <div className="w-full max-w-[1200px] flex flex-col gap-24">
          {about.philosophy.map((section, i) => (
            <SectionRenderer
              key={i}
              section={section}
              file="about"
              basePath={`philosophy.${i}`}
            />
          ))}
        </div>

        {/* Resume + Education */}
        <div className="w-full max-w-[800px] flex flex-col gap-16">

          {/* Resume */}
          <section id="resume" className="flex flex-col gap-8 scroll-mt-24">
            <div className="flex items-center justify-between">
              <EditableText
                file="about"
                contentPath="resume.heading"
                tag="h2"
                className="text-xs font-medium tracking-widest uppercase text-black/60"
              >
                {about.resume.heading}
              </EditableText>
              <a
                href="https://drive.google.com/file/d/1mHK-9lppdv9p9J9plYZrgudTJrlrxxDx/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-black hover:text-black/70 border border-black/15 hover:border-black/30 px-3 py-1.5 rounded-full transition-all"
              >
                <Download size={12} strokeWidth={2} />
                Download Resume
              </a>
            </div>

            <div className="flex flex-col divide-y divide-black/6">
              {about.resume.roles.map((role, i) => (
                <div key={i} className="flex flex-row items-start justify-between gap-8 py-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col items-baseline gap-2 flex-wrap">
                      <EditableText
                        file="about"
                        contentPath={`resume.roles.${i}.title`}
                        tag="p"
                        className="text-base font-semibold text-black/80"
                      >
                        {role.title}
                      </EditableText>
                      <EditableText
                        file="about"
                        contentPath={`resume.roles.${i}.company`}
                        tag="p"
                        className="text-base text-black/50"
                      >
                        {role.company}
                      </EditableText>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <EditableText
                      file="about"
                      contentPath={`resume.roles.${i}.period`}
                      tag="p"
                      className="text-xs font-medium text-black/60 tracking-wide"
                    >
                      {role.period}
                    </EditableText>
                    <p className="text-xs text-black/30 mt-0.5">{parseDuration(role.period)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="flex flex-col gap-8">
            <EditableText
              file="about"
              contentPath="education.heading"
              tag="h2"
              className="text-xs font-medium tracking-widest uppercase text-black/60"
            >
              {about.education.heading}
            </EditableText>

            <div className="flex flex-col divide-y divide-black/6">
              {about.education.items.map((item, i) => (
                <div key={i} className="flex flex-row items-start justify-between gap-8 py-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-col items-baseline gap-2 flex-wrap">
                      <EditableText
                        file="about"
                        contentPath={`education.items.${i}.title`}
                        tag="p"
                        className="text-base font-semibold text-black/80"
                      >
                        {item.title}
                      </EditableText>
                      <EditableText
                        file="about"
                        contentPath={`education.items.${i}.company`}
                        tag="p"
                        className="text-base text-black/50"
                      >
                        {item.company}
                      </EditableText>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <EditableText
                      file="about"
                      contentPath={`education.items.${i}.period`}
                      tag="p"
                      className="text-xs font-medium text-black/60 tracking-wide"
                    >
                      {item.period}
                    </EditableText>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
