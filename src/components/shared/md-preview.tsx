import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import { Code2 } from "lucide-react";
import type { Components } from "react-markdown";
import "katex/dist/katex.min.css";

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
  enableMath?: boolean;
  enableRawHtml?: boolean;
  maxWidth?: string;
}

const codeComponents: Components = {
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const codeString = String(children).replace(/\n$/, "");

    return match ? (
      <div className="relative my-6 rounded-xl overflow-hidden shadow-xl shadow-black/50 border border-gray-800/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-900/90" />
        <div className="relative">
          <div className="flex items-center justify-between bg-gray-900/90 px-5 py-3 border-b border-gray-800/60 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-orange to-brand-green rounded-lg flex items-center justify-center shadow-lg shadow-brand-orange/25">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-300 capitalize tracking-wide">
                {match[1]}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600">
            <SyntaxHighlighter
              // @ts-expect-error - oneDark theme type compatibility
              style={oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
              className="text-sm leading-relaxed"
              wrapLines={true}
              wrapLongLines={true}
              showLineNumbers={codeString.split('\n').length > 3}
              showInlineLineNumbers={false}
              lineNumberStyle={{
                minWidth: '3em',
                paddingRight: '1em',
                color: '#6B7280',
                borderRight: '1px solid #374151',
                marginRight: '1em'
              }}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    ) : (
      <code className="bg-gray-800/60 px-2 py-1 rounded-md text-brand-orange/90 text-sm break-words whitespace-pre-wrap font-mono border border-gray-700/50">
        {children}
      </code>
    );
  },
  h1: ({ children }) => (
    <h1 className="font-heading text-3xl font-bold mt-8 mb-6 text-foreground">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-heading text-2xl font-semibold mt-6 mb-4 text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading text-xl font-semibold mt-5 mb-3 text-foreground">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-heading text-lg font-medium mt-4 mb-2 text-muted-foreground">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-muted-foreground leading-7 whitespace-pre-wrap">
      {children}
    </p>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary/60 pl-6 pr-4 py-4 italic text-muted-foreground my-6 bg-muted/50 rounded-r-lg">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary/80 underline transition-colors font-medium"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-border bg-card">
      <table className="min-w-full border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/50">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="border-b border-border px-6 py-4 text-left font-semibold text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-border/50 px-6 py-4 text-muted-foreground">
      {children}
    </td>
  ),
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 my-4 pl-6 text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-2 my-4 pl-6 text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-7">{children}</li>
  ),
  hr: () => (
    <hr className="my-8 border-border" />
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-muted-foreground">{children}</em>
  ),
  del: ({ children }) => (
    <del className="line-through text-muted-foreground/50">{children}</del>
  ),
};

export function MarkdownPreview({
  markdown,
  className = "",
  enableMath = true,
  enableRawHtml = true,
  maxWidth = "full",
}: MarkdownPreviewProps) {
  const remarkPlugins = [remarkGfm, ...(enableMath ? [remarkMath] : [])];
  const rehypePlugins = [...(enableMath ? [rehypeKatex] : []), ...(enableRawHtml ? [rehypeRaw] : [])];

  return (
    <div className={`text-base leading-relaxed ${maxWidth === 'full' ? 'w-full' : `max-w-${maxWidth}`} ${className}`}>
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