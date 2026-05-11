import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Amadeus Cameron — Vision-driven product design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#f8f8f6",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "108px",
              fontWeight: 700,
              color: "#0a0a0a",
              lineHeight: 1,
              letterSpacing: "-3px",
              fontFamily: "sans-serif",
            }}
          >
            Amadeus
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "rgba(10,10,10,0.45)",
              fontWeight: 400,
              fontFamily: "sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            Vision-driven product design · ux.byamadeus.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
