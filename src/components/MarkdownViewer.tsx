import React, { useEffect, useState } from 'react';
import { markdownToHtml } from '@/utils/markdown';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  content,
  className = '',
}) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processMarkdown = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const html = await markdownToHtml(content);
        setHtmlContent(html);
      } catch (err) {
        setError('Failed to process markdown content');
        console.error('Markdown processing error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (content) {
      processMarkdown();
    } else {
      setIsLoading(false);
    }
  }, [content]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 bg-red-50 border border-red-200 rounded-md ${className}`}
      >
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={
        {
          // Custom styles for markdown content
          '--tw-prose-headings': '#1f2937',
          '--tw-prose-body': '#374151',
          '--tw-prose-code': '#1f2937',
          '--tw-prose-pre-code': '#e5e7eb',
          '--tw-prose-pre-bg': '#1f2937',
          '--tw-prose-th-borders': '#d1d5db',
          '--tw-prose-td-borders': '#e5e7eb',
        } as React.CSSProperties
      }
    />
  );
};

export default MarkdownViewer;
