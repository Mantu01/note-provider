import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

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
 * OG image generator for group/bundle detail pages.
 * GET /og/group/[slug].png
 */
export function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  return new Promise<ImageResponse>((resolve) => {
    (async () => {
      const { slug } = await params;

      let name = "Developer Bundle";
      let description = "Curated collection of developer notes and topic bundles";
      let category = "General";
      let noteCount = 0;
      let priceLabel = "Paid";

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/groups/${slug}`,
          { cache: "force-cache" },
        );
        if (res.ok) {
          const data = await res.json();
          const group = data?.data?.group;
          if (group) {
            name = group.name;
            description = group.description?.slice(0, 140) || "Curated collection of developer notes and topic bundles";
            category = group.category?.name || "General";
            noteCount = group.noteCount || group.notes?.length || 0;
            priceLabel = group.price === 0 ? "Free" : group.priceLabel || "Paid";
          }
        }
      } catch {
        // Fallback to defaults
      }

      const safeName = name || "";
      const displayName =
        safeName.length > 45 ? safeName.slice(0, 42) + "..." : safeName;
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
              {/* Background decoration */}
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 350,
                  height: 350,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${SUCCESS}15 0%, transparent 70%)`,
                  filter: "blur(60px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${PRIMARY}15 0%, transparent 70%)`,
                  filter: "blur(60px)",
                }}
              />

              {/* Top bar */}
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
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `linear-gradient(135deg, ${SUCCESS}, ${ACCENT})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: 700,
                      color: BG,
                    }}
                  >
                    G
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
                    background: `${SUCCESS}20`,
                    border: `1px solid ${SUCCESS}60`,
                    color: SUCCESS,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {noteCount} Notes • {priceLabel}
                </div>
              </div>

              {/* Title */}
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
                {displayName}
              </h1>

              {/* Category */}
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

              {/* Description */}
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

              {/* Bottom bar */}
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
                <span style={{ color: MUTED, fontSize: 16 }}>📦 Complete Bundle</span>
                <span style={{ color: MUTED, fontSize: 16 }}>📄 PDF Format</span>
                <span style={{ color: MUTED, fontSize: 16 }}>⚡ 4-6hr Delivery</span>
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
