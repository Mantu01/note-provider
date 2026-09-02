import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

const BG = "#0f172a";
const SURFACE = "#1e293b";
const PRIMARY = "#6366f1";
const ACCENT = "#22d3ee";
const TEXT = "#f8fafc";
const MUTED = "#94a3b8";

export const runtime = "edge";
export const contentType = "image/png";

export function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return new Promise<ImageResponse>((resolve) => {
    (async () => {
      const { slug } = await params;

      let title = "Developer Note";
      let description = "Developer notes for coding and interview prep";
      let category = "General";
      let priceLabel = "Free";
      let coverUrl = "";

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/notes/${slug}`,
          { cache: "force-cache" },
        );
        if (res.ok) {
          const data = await res.json();
          const note = data?.data?.note;
          if (note) {
            title = note.title;
            description = note.description?.slice(0, 140) || "Developer notes for coding and interview prep";
            category = note.category?.name || "General";
            priceLabel = note.pricingType === "free" ? "Free" : note.priceLabel || "Paid";
            coverUrl = note.coverImageUrl || "";
          }
        }
      } catch {}

      const safeTitle = title || "";
      const displayTitle =
        safeTitle.length > 50 ? safeTitle.slice(0, 47) + "..." : safeTitle;
      const safeDesc = description || "";
      const displayDesc =
        safeDesc.length > 160
          ? safeDesc.slice(0, 157) + "..."
          : safeDesc;

      resolve(
        new ImageResponse(
          (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                background: `linear-gradient(135deg, ${BG} 0%, #1a1a2e 100%)`,
                fontFamily: "Inter, sans-serif",
                padding: 50,
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 400,
                  height: 400,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${PRIMARY}20 0%, transparent 70%)`,
                  filter: "blur(60px)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 30,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: 700,
                      color: TEXT,
                    }}
                  >
                    N
                  </div>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: TEXT,
                    }}
                  >
                    Notes Provider
                  </span>
                </div>
                <div
                  style={{
                    padding: "6px 16px",
                    borderRadius: 8,
                    background: priceLabel === "Free" ? `${PRIMARY}20` : `${ACCENT}20`,
                    border: `1px solid ${priceLabel === "Free" ? PRIMARY : ACCENT}60`,
                    color: priceLabel === "Free" ? PRIMARY : ACCENT,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {priceLabel}
                </div>
              </div>

              <h1
                style={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: TEXT,
                  lineHeight: 1.2,
                  marginBottom: 16,
                  position: "relative",
                  zIndex: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {displayTitle}
              </h1>

              <div
                style={{
                  display: "inline-flex",
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: SURFACE,
                  border: "1px solid #334155",
                  color: MUTED,
                  fontSize: 16,
                  marginBottom: 20,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {category}
              </div>

              <p
                style={{
                  fontSize: 20,
                  color: MUTED,
                  lineHeight: 1.5,
                  marginBottom: 40,
                  position: "relative",
                  zIndex: 1,
                  flex: 1,
                }}
              >
                {displayDesc}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  paddingTop: 20,
                  borderTop: "1px solid #334155",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span style={{ color: MUTED, fontSize: 16 }}>📄 PDF Notes</span>
                <span style={{ color: MUTED, fontSize: 16 }}>⚡ 4-6hr Delivery</span>
                <span style={{ color: MUTED, fontSize: 16 }}>🚀 Built for developers</span>
              </div>
            </div>
          ),
          {
            width: 1200,
            height: 630,
          },
        ),
      );
    })();
  });
}
