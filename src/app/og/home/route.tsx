import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// Shared palette
const BG = "#0f172a";
const SURFACE = "#1e293b";
const PRIMARY = "#6366f1";
const ACCENT = "#22d3ee";
const TEXT = "#f8fafc";
const MUTED = "#94a3b8";
const SUCCESS = "#22c55e";

export const runtime = "edge";
export const contentType = "image/png";

/**
 * OG image generator for the homepage.
 * GET /og/home.png
 */
export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Notes Provider";
  const tagline = searchParams.get("tagline") || "Premium study notes, instantly.";

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
          background: `linear-gradient(135deg, ${BG} 0%, #1a1a2e 50%, ${BG} 100%)`,
          fontFamily: "Inter, sans-serif",
          padding: 60,
          textAlign: "center",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${PRIMARY}30 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ACCENT}20 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
              color: TEXT,
            }}
          >
            N
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: TEXT,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 28,
            color: MUTED,
            lineHeight: 1.4,
            marginBottom: 48,
            maxWidth: 700,
          }}
        >
          {tagline}
        </p>

        {/* Feature chips */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            { icon: "📄", label: "PDF Notes" },
            { icon: "📦", label: "Note Bundles" },
            { icon: "⚡", label: "4-6hr Delivery" },
            { icon: "🆓", label: "Free Notes" },
          ].map((chip) => (
            <div
              key={chip.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                borderRadius: 12,
                background: SURFACE,
                border: `1px solid ${PRIMARY}40`,
                color: TEXT,
                fontSize: 18,
                fontWeight: 500,
              }}
            >
              <span style={{ fontSize: 22 }}>{chip.icon}</span>
              {chip.label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
