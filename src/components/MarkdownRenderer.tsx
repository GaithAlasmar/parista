"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { useState, ReactNode, isValidElement, cloneElement, useMemo } from "react";

// Custom component map — light stone/brass theme
const components: Components = {
  // H2 → section divider with brass colour
  h2: ({ children }) => (
    <h2 className="mt-8 mb-3 text-xl font-bold" style={{ color: "var(--accent)" }}>
      {children}
    </h2>
  ),
  // H3 → step heading in dark granite
  h3: ({ children }) => (
    <h3 className="mt-5 mb-2 text-base font-semibold" style={{ color: "var(--text)" }}>
      {children}
    </h3>
  ),
  // Paragraph — granite body text
  p: ({ children }) => (
    <p className="mb-4 text-base leading-7" style={{ color: "var(--text-muted)" }}>
      {children}
    </p>
  ),
  // Blockquote → tip callout with brass left border on stone bg
  blockquote: ({ children }) => (
    <blockquote
      className="my-4 rounded-xl border-l-4 px-4 py-3"
      style={{
        borderColor: "var(--accent)",
        backgroundColor: "rgba(184,148,58,0.07)",
        color: "var(--text-muted)",
      }}
    >
      {children}
    </blockquote>
  ),
  // Unordered list
  ul: ({ children }) => (
    <ul className="mb-4 space-y-1.5 pl-5" style={{ color: "var(--text-muted)" }}>
      {children}
    </ul>
  ),
  // Ordered list
  ol: ({ children }) => (
    <ol className="mb-4 space-y-1.5 pl-5 list-decimal" style={{ color: "var(--text-muted)" }}>
      {children}
    </ol>
  ),
  li: ({ children, node, ...props }) => {
    // This will be overridden by the CheckableListItem wrapper
    return <li className="text-base leading-7">{children}</li>;
  },
  // Strong / bold — dark granite emphasis
  strong: ({ children }) => (
    <strong className="font-semibold" style={{ color: "var(--text)" }}>
      {children}
    </strong>
  ),
  // Horizontal rule — brass-tinted line
  hr: () => (
    <div className="my-6 brass-line" />
  ),
  // Table — glass card container
  table: ({ children }) => (
    <div
      className="my-4 overflow-x-auto rounded-xl border"
      style={{ borderColor: "var(--border-stone)", backgroundColor: "rgba(255,255,255,0.55)" }}
    >
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead style={{ backgroundColor: "rgba(184,148,58,0.08)" }}>{children}</thead>
  ),
  th: ({ children }) => (
    <th
      className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider"
      style={{ color: "var(--accent)", borderBottom: "1px solid var(--border-stone)" }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      className="px-4 py-2.5 text-sm"
      style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border-stone)" }}
    >
      {children}
    </td>
  ),
  // Inline code — brass tint on stone
  code: ({ children }) => (
    <code
      className="rounded px-1.5 py-0.5 font-mono text-sm"
      style={{ backgroundColor: "rgba(184,148,58,0.10)", color: "var(--brass-800, #8A6C22)" }}
    >
      {children}
    </code>
  ),
};

interface Props {
  content: string;
  multiplier?: number;
}

function CheckableListItem({ children, multiplier }: { children: ReactNode; multiplier: number }) {
  const [checked, setChecked] = useState(false);

  // Helper to scale numeric values in text
  const processChildren = (node: ReactNode): ReactNode => {
    if (typeof node === "string") {
      return node.replace(
        /\b(\d+(?:\.\d+)?)(?=\s*(?:ml|g|pumps|scoops|shots|grams|oz|shot|مل|غرام|ضخات|جرام|جرامات|ملي|ملم)\b)/gi,
        (match, val) => {
          // Check if it's actually part of a word or just standalone
          return String(Number(val) * multiplier);
        }
      );
    }
    if (Array.isArray(node)) {
      return node.map((child, i) => <span key={i}>{processChildren(child)}</span>);
    }
    if (isValidElement(node)) {
      // @ts-ignore
      if (node.props && node.props.children) {
        // @ts-ignore
        return cloneElement(node, {
          ...node.props,
          // @ts-ignore
          children: processChildren(node.props.children),
        });
      }
    }
    return node;
  };

  return (
    <li
      className={`text-base leading-7 transition-all ${
        checked ? "opacity-50 line-through" : ""
      }`}
    >
      <div className="flex gap-3 items-start mt-1 cursor-pointer" onClick={() => setChecked(!checked)}>
        <div
          className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
          style={{
            borderColor: checked ? "var(--accent)" : "var(--border-stone)",
            backgroundColor: checked ? "var(--accent)" : "transparent",
          }}
        >
          {checked && (
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="flex-1">{processChildren(children)}</div>
      </div>
    </li>
  );
}

export default function MarkdownRenderer({ content, multiplier = 1 }: Props) {
  const customComponents = useMemo(
    () => ({
      ...components,
      li: ({ children }: any) => (
        <CheckableListItem multiplier={multiplier}>{children}</CheckableListItem>
      ),
    }),
    [multiplier]
  );

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
      {content}
    </ReactMarkdown>
  );
}
