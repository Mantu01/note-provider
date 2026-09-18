import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import type { Components } from "react-markdown";
import "katex/dist/katex.min.css";

const codeTheme = oneDark as { [key: string]: CSSProperties };
const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeKatex, rehypeRaw];

const codeComponents: Components = {
  code: ({ className, children }) => {
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");

    if (!match) {
      return (
        <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
          {children}
        </code>
      );
    }

    return (
      <div className="my-5 overflow-hidden rounded-xl border border-border">
        <SyntaxHighlighter
          style={codeTheme}
          language={match[1]}
          PreTag="div"
          wrapLongLines
          showLineNumbers={codeString.split("\n").length > 3}
          lineNumberStyle={{ minWidth: "2.5em", paddingRight: "1em", opacity: 0.45 }}
          customStyle={{ margin: 0, padding: "1rem", fontSize: "0.8125rem", background: "transparent" }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  },
  h1: ({ children }) => (
    <h1 className="mt-8 mb-6 font-heading text-2xl font-bold text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-6 mb-4 font-heading text-xl font-semibold text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-5 mb-3 font-heading text-lg font-semibold text-foreground">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-4 mb-2 font-heading text-base font-medium text-foreground">{children}</h4>
  ),
  p: ({ children }) => <p className="mb-4 leading-7 text-muted-foreground">{children}</p>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-r-lg border-l-2 border-primary/50 bg-muted/40 py-3 pr-4 pl-5 text-sm text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary underline underline-offset-4"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-border px-4 py-3 text-left font-semibold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border/50 px-4 py-3 text-muted-foreground">{children}</td>
  ),
  ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6 text-muted-foreground">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-muted-foreground">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  hr: () => <hr className="my-8 border-border" />,
  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="text-muted-foreground italic">{children}</em>,
  del: ({ children }) => <del className="text-muted-foreground/50 line-through">{children}</del>,
};

export function MarkdownPreview({
  markdown,
  className,
}: {
  markdown: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={codeComponents}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
