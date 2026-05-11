import fs from "fs";
import path from "path";

export interface CaseStudySection {
  type: "text" | "text-image" | "metrics" | "lottie-pair" | "image" | "video";
  heading?: string;
  body?: string;
  image?: string | null;
  imagePosition?: string;
  items?: Array<{
    label?: string;
    body?: string;
    lottieFile?: string;
    caption?: string;
    src?: string;
    muxId?: string;
  }>;
}

export interface CaseStudy {
  slug: string;
  title: string;
  label: string;
  year: string;
  status: "live" | "placeholder";
  description: string;
  thumbnail: string;
  bg: string;
  heroMuxId: string | null;
  tags: string[];
  intro: string;
  sections: CaseStudySection[];
}

export interface HomeContent {
  hero: { headline: string; subline: string };
  philosophy: {
    intro: string;
    steps: Array<{
      id: string;
      label: string;
      lottie: string;
      description: string;
    }>;
  };
  cta: string;
  ctaHref: string;
}

const contentRoot = path.join(process.cwd(), "content");

export function getHomeContent(): HomeContent {
  const raw = fs.readFileSync(path.join(contentRoot, "home.json"), "utf-8");
  return JSON.parse(raw);
}

export function getAllCaseStudies(): CaseStudy[] {
  const workDir = path.join(contentRoot, "work");
  const files = fs.readdirSync(workDir).filter((f) => f.endsWith(".json"));
  const order = ["tfz", "viasat", "echo", "p+"];
  const studies = files.map((f) => {
    const raw = fs.readFileSync(path.join(workDir, f), "utf-8");
    return JSON.parse(raw) as CaseStudy;
  });
  return studies
    .filter((s) => s.status === "live")
    .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
}

export interface AboutContent {
  headline: string;
  image: string | null;
  bio: string[];
  skills: {
    heading: string;
    items: string[];
  };
  resume: {
    heading: string;
    roles: Array<{
      title: string;
      company: string;
      period: string;
      description: string;
    }>;
  };
  philosophy: CaseStudySection[];
  education: {
    heading: string;
    items: Array<{
      title: string;
      company: string;
      period: string;
      description: string;
    }>;
  };
}

export function getAboutContent(): AboutContent {
  const raw = fs.readFileSync(path.join(contentRoot, "about.json"), "utf-8");
  return JSON.parse(raw);
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const filePath = path.join(contentRoot, "work", `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}
