import { marked } from 'marked';

interface MarkdownOutputProps {
  content: string;
  className?: string;
}

const MarkdownOutput = ({ content, className = '' }: MarkdownOutputProps) => {
  const html = marked(content);

  return (
    <div
      className={`markdown-output ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownOutput;
