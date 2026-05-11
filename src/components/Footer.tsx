interface FooterProps {
  variant?: "green" | "dark";
}

export function Footer({ variant = "dark" }: FooterProps) {
  const bg = variant === "green" ? "#49D468" : "rgb(10, 0, 34)";

  return (
    <div className="flex w-full">
      <footer
        className="mt-auto flex flex-col items-center w-full pt-24 px-6 py-8 backdrop-blur-sm pb-16"
        style={{ background: bg }}
      >
        <div className="w-full flex flex-col items-left text-2xl max-w-[800px] leading-relaxed text-white/80 gap-8">
          <p>It is so nice to <em>finally</em> meet you.</p>
          <div className="flex flex-row items-left gap-4">
            <a href="https://www.are.na/amadeus-cameron/index"><img className="w-[24px] h-[24px]" src="/assets/icon-are.svg" alt="Are.na logo" /></a>
            <a href="https://substack.com/@byamadeus"><img className="w-[24px] h-[24px]" src="/assets/icon-sub.svg" alt="Substack logo" /></a>
            <a href="https://open.spotify.com/user/thenextamadeus"><img className="w-[24px] h-[24px]" src="/assets/icon-spo.svg" alt="Spotify logo" /></a>
            <a href="https://github.com/byamadeus"><img className="w-[24px] h-[24px]" src="/assets/icon-git.svg" alt="Github logo" /></a>
            <a href="https://www.linkedin.com/in/amadeuscameron/"><img className="w-[24px] h-[24px]" src="/assets/icon-li.svg" alt="Linkedin logo" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
