import Script from "next/script";

export function Nav() {
  return (
    <>
      <Script src="/portfolio-nav.js" strategy="afterInteractive" />
      <portfolio-nav />
    </>
  );
}
