import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  description: string;
};

const JobDescriptionPreview: React.FC<Props> = ({ description }) => {
  return (
    <div className="prose prose-invert max-w-none dark:prose-dark space-y-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {description}
      </ReactMarkdown>
    </div>
  );
};

export default JobDescriptionPreview;
