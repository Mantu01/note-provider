import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const width = 1200;
export const height = 630;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Notes Provider
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#f97316",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Coding Notes for Developers
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          Web Dev, DSA, DBMS, Backend & System Design
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
