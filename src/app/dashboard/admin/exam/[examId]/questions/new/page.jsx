"use client";

import QuestionForm from "../../../questionManage/QuestionForm";
import { useParams } from "next/navigation";

export default function QuestionPage() {
  const params = useParams();
  const examId = params?.examId;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border rounded shadow-sm p-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-medium">Add Questions — Quick Entry</h1>
            <div className="text-xs text-gray-500">Exam: {examId}</div>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Compact entry — form clears after each save so you can add multiple
            questions quickly.
          </p>

          <div className="p-0">
            {/* Use modal-style compact form rendering for minimal UI */}
            <QuestionForm examId={examId} isModal={true} compact={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
