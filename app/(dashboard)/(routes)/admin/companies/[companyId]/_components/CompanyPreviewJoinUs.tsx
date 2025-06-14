import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  whyJoinUs: string;
};

const CompanyPreviewWhyJoinUs: React.FC<Props> = ({ whyJoinUs }) => {
  return (
    <div className="prose prose-invert max-w-none dark:prose-dark space-y-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {whyJoinUs}
      </ReactMarkdown>
    </div>
  );
};

export default CompanyPreviewWhyJoinUs;
