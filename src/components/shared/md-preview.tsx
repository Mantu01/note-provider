"use client";

import { FC, useState, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
//@ts-expect-error: unknown
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//@ts-expect-error: unknown
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard, ClipboardCheck, Expand, Shrink, Code2 } from "lucide-react";
import "katex/dist/katex.min.css";

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
  enableMath?: boolean;
  enableRawHtml?: boolean;
  maxWidth?: string;
}

const MarkdownPreview: FC<MarkdownPreviewProps> = ({ 
  markdown, 
  className = "",
  enableMath = true,
  enableRawHtml = true,
  maxWidth = "full"
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  const toggleExpand = useCallback((key: string) => {
    setExpandedBlocks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  const remarkPlugins = useMemo(() => {
    const plugins= [remarkGfm];
    //@ts-expect-error: unknown
    if (enableMath) plugins.push(remarkMath);
    return plugins;
  }, [enableMath]);

  const rehypePlugins = useMemo(() => {
    const plugins = [];
    if (enableMath) plugins.push(rehypeKatex);
    if (enableRawHtml) plugins.push(rehypeRaw);
    return plugins;
  }, [enableMath, enableRawHtml]);

  return (
    <div className={`text-base leading-relaxed overflow-hidden ${maxWidth === 'full' ? 'w-full' : `max-w-${maxWidth}`} ${className}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-6 text-white break-words relative group">
              <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent group-hover:from-red-100 group-hover:to-white transition-all duration-300">
                {children}
              </span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-100 break-words relative group">
              <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative group-hover:text-red-100 transition-colors duration-300">
                {children}
              </span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-5 mb-3 text-gray-200 break-words hover:text-white transition-colors duration-300">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-medium mt-4 mb-2 text-gray-300 break-words hover:text-gray-100 transition-colors duration-300">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-medium mt-3 mb-2 text-gray-300 break-words hover:text-gray-200 transition-colors duration-300">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-medium mt-2 mb-1 text-gray-400 break-words hover:text-gray-300 transition-colors duration-300">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-gray-200 break-words whitespace-pre-wrap leading-7 hover:text-gray-100 transition-colors duration-200">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-red-500 pl-6 pr-4 py-4 italic text-gray-300 my-6 bg-gradient-to-r from-red-500/10 via-gray-900/50 to-transparent rounded-r-lg break-words backdrop-blur-sm shadow-lg shadow-red-500/5 hover:shadow-red-500/10 transition-all duration-300">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 hover:underline break-all transition-all duration-300 font-medium relative group"
            >
              <span className="relative z-10">{children}</span>
              <div className="absolute inset-0 bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-1 p-1"></div>
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const key = `${match ? match[1] : "text"}-${codeString.substring(0, 20).replace(/\s/g, '')}`;
            const isExpanded = expandedBlocks.has(key);
            const isLongCode = codeString.split('\n').length > 12 || codeString.length > 400;

            return match ? (
              <div className="relative my-6 rounded-xl overflow-hidden shadow-xl shadow-black/50 border border-gray-800/80 backdrop-blur-sm group hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-900/90"></div>
                <div className="relative">
                  <div className="flex items-center justify-between bg-gray-900/90 px-5 py-3 border-b border-gray-800/60 backdrop-blur-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/25">
                        <Code2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-300 capitalize tracking-wide">
                        {match[1]}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isLongCode && (
                        <button
                          onClick={() => toggleExpand(key)}
                          className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                          aria-label={isExpanded ? "Collapse code" : "Expand code"}
                        >
                          {isExpanded ? (
                            <Shrink className="w-4 h-4" />
                          ) : (
                            <Expand className="w-4 h-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(codeString, key)}
                        className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                        aria-label="Copy code"
                      >
                        {copied === key ? (
                          <ClipboardCheck className="text-green-400 w-4 h-4" />
                        ) : (
                          <Clipboard className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className={`${isLongCode && !isExpanded ? 'max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600' : ''}`}>
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                      className={`text-sm leading-relaxed ${!isExpanded ? 'overflow-x-auto scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700' : ''}`}
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
                  {isLongCode && !isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent flex items-end justify-center pb-3">
                      <button
                        onClick={() => toggleExpand(key)}
                        className="text-xs bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-500 hover:to-red-600 px-4 py-2 rounded-lg text-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 backdrop-blur-sm font-medium"
                      >
                        <Expand className="w-3 h-3" />
                        Show more
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <code className="bg-gray-800/60 hover:bg-gray-700/60 px-2 py-1 rounded-md text-red-300 text-sm break-words whitespace-pre-wrap font-mono border border-gray-700/50 transition-all duration-300 hover:border-red-500/30 shadow-sm hover:shadow-lg">
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-xl shadow-xl shadow-black/30 border border-gray-800/60 backdrop-blur-sm">
              <table className="min-w-full border-collapse bg-gray-900/50">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gradient-to-r from-gray-800/90 to-gray-900/90">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-gray-700/60 px-6 py-4 text-left font-semibold text-gray-200 break-words uppercase text-xs tracking-wider hover:text-white transition-colors duration-300">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-gray-800/40 px-6 py-4 text-gray-300 break-words hover:text-gray-200 hover:bg-gray-800/20 transition-all duration-300">
              {children}
            </td>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-3 my-5 text-gray-200 break-words pl-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-none counter-reset-item space-y-3 my-5 text-gray-200 break-words pl-0">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="break-words whitespace-normal leading-7 relative pl-8 group">
              <div className="absolute left-0 top-3 w-2 h-2 bg-gradient-to-br from-red-500 to-red-600 rounded-full group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-red-500/50"></div>
              <div className="group-hover:text-gray-100 transition-colors duration-300">
                {children}
              </div>
            </li>
          ),
          hr: () => (
            <div className="my-8 relative">
              <hr className="border-t border-gray-800/60" />
              <div className="absolute inset-0 flex justify-center">
                <div className="bg-gradient-to-r from-transparent via-red-500 to-transparent h-px w-32 top-0"></div>
              </div>
            </div>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white bg-gradient-to-r from-red-500/20 to-red-600/20 px-1 rounded hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-200 hover:text-red-200 transition-colors duration-300">
              {children}
            </em>
          ),
          del: ({ children }) => (
            <del className="line-through text-gray-500 hover:text-gray-400 transition-colors duration-300">
              {children}
            </del>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;