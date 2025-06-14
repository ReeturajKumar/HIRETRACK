import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  overview: string;
};

const CompanyPreview: React.FC<Props> = ({ overview }) => {
  return (
    <div className="prose prose-invert max-w-none dark:prose-dark space-y-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {overview}
      </ReactMarkdown>
    </div>
  );
};

export default CompanyPreview;
