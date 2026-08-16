import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

/**
 * Simple fallback OG logo/image page.
 * GET /og/logo.png
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 56,
            fontWeight: 800,
            color: "#f8fafc",
            marginBottom: 24,
          }}
        >
          N
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "#f8fafc",
            letterSpacing: "-0.02em",
          }}
        >
          Notes Provider
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginTop: 8,
          }}
        >
          Premium study notes, instantly.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

export const runtime = "edge";
export const contentType = "image/png";
