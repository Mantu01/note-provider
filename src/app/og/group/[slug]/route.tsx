import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const width = 1200;
export const height = 630;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const title = decodeURIComponent(slug.replace(/-/g, " "));

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
            fontSize: 28,
            fontWeight: 600,
            color: "#f97316",
            marginBottom: 24,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Bundle
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: "90%",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginTop: 24,
          }}
        >
          Notes Provider
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
