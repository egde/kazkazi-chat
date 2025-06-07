'use client';

import React, { JSX } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import ChartBlock from './ChartBlock';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const chartBlocks: { index: number; chart: JSX.Element }[] = [];
  let chartIndex = 0;

  return (
    <div className="space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline,  className, children, ...props }: React.ComponentProps<'code'> & { inline?: boolean }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match?.[1] || '';
            const text = String(children).trim();

            if (!inline && language === 'chart') {
              const idx = chartIndex++;
              return <ChartBlock key={idx} code={text} />
            }

            if (!inline) {
              return <CodeBlock language={language} code={text} />;
            }

            return <div><h1>INLINE</h1><code className={className} {...props}>{children}</code></div>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
