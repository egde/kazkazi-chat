'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import ChartBlock from './ChartBlock';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  let chartIndex = 0;

  return (
    <div className="space-y-4 max-w-5xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }: React.ComponentProps<'code'>) {
            const match = /language-(\w+)/.exec(className || '');

            if (match) {
              const language = match?.[1] || '';
              const text = String(children).trim();

              if (language === 'chart') {
                const idx = chartIndex++;
                return <ChartBlock key={idx} code={text} />
              }
              return <CodeBlock language={language} code={text} />;
            }
            return <code className={`inline-code ${className}`} {...props}>{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
