"use client";
// Import React and necessary hooks
import React, { useState, useEffect } from "react";
// Import Next.js router for navigation
import { useRouter, useParams } from "next/navigation";
// Import axios instance for API calls
import api from "axios";
import { Plus, Trash2, Link } from "lucide-react";

// Import the Multiple Image Uploader component
import ImageUploader from "@/components/dashboard/ImageUploader";
import RichTextEditor from "@/components/public/RichTextEditor";

// Main component for adding/editing questions
const QuestionForm = ({
  onSuccess,
  examId: propExamId,
  questionId: propQuestionId,
  isModal = false,
  compact = false,
}) => {
  // Get route parameters
  const params = useParams();
  // Extract examId and questionId from params (or use prop)
  const examId = propExamId || params.examId;
  const questionId = propQuestionId || params.questionId;

  // Initialize router for navigation
  const router = useRouter();

  // State for form data
  const [formData, setFormData] = useState({
    questionText: "",
    questionType: "radio",
    difficulty: "medium",
    marks: 1,
    negativeMarks: 0,
    subject: "",
    topic: "",
    tags: [],
    options: [
      { label: "A", text: "", images: [] },
      { label: "B", text: "", images: [] },
      { label: "C", text: "", images: [] },
      { label: "D", text: "", images: [] },
    ],
    correctAnswers: [],
    matchingPairs: {
      leftItems: [
        { id: "L1", text: "", images: [] },
        { id: "L2", text: "", images: [] },
      ],
      rightItems: [
        { id: "R1", text: "", images: [] },
        { id: "R2", text: "", images: [] },
      ],
      correctMatches: {},
    },
    isSample: false,
    explanation: "",
    status: "draft",
  });

  // State for image files (now arrays)
  const [questionImageFiles, setQuestionImageFiles] = useState([]);
  const [optionImageFiles, setOptionImageFiles] = useState({});
  const [matchingImageFiles, setMatchingImageFiles] = useState({});
  // State for pasted image URLs
  const [pastedImageUrls, setPastedImageUrls] = useState({});
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for tracking if we're editing an existing question
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState({});
  const [imageResetKey, setImageResetKey] = useState(0);
  const [compactImagesOpen, setCompactImagesOpen] = useState(!compact);

  // Function to reset form to initial state
  const resetForm = () => {
    setFormData({
      questionText: "",
      questionType: "radio",
      difficulty: "medium",
      marks: 1,
      negativeMarks: 0,
      subject: "",
      topic: "",
      tags: [],
      options: [
        { label: "A", text: "", images: [] },
        { label: "B", text: "", images: [] },
        { label: "C", text: "", images: [] },
        { label: "D", text: "", images: [] },
      ],
      correctAnswers: [],
      matchingPairs: {
        leftItems: [
          { id: "L1", text: "", images: [] },
          { id: "L2", text: "", images: [] },
        ],
        rightItems: [
          { id: "R1", text: "", images: [] },
          { id: "R2", text: "", images: [] },
        ],
        correctMatches: {},
      },
      isSample: false,
      explanation: "",
      status: "draft",
    });
    setQuestionImageFiles([]);
    setOptionImageFiles({});
    setMatchingImageFiles({});
    setPastedImageUrls({});
    setImageResetKey((prev) => prev + 1);
  };

  // Effect to fetch question data when editing
  useEffect(() => {
    // Check if we're editing an existing question
    if (questionId && questionId !== "new") {
      setIsEditing(true);
      // Function to fetch question data
      const fetchQuestion = async () => {
        try {
          setLoading(true);
          // API call to get question by ID
          const { data } = await api.get(`/api/questions/${questionId}`);

          if (data.success) {
            // Ensure options array has at least 4 items
            const options = data.data.options || [];
            while (options.length < 4) {
              options.push({
                label: String.fromCharCode(65 + options.length),
                text: "",
                images: [],
              });
            }

            // Clean up matchingPairs data if it exists
            let matchingPairs = {
              leftItems: [
                { id: "L1", text: "", images: [] },
                { id: "L2", text: "", images: [] },
              ],
              rightItems: [
                { id: "R1", text: "", images: [] },
                { id: "R2", text: "", images: [] },
              ],
              correctMatches: {},
            };

            if (data.data.matchingPairs) {
              const cleanLeftItems = (
                data.data.matchingPairs.leftItems || []
              ).map((item) => ({
                id: item.id,
                text: item.text || "",
                images: item.images || [],
              }));

              const cleanRightItems = (
                data.data.matchingPairs.rightItems || []
              ).map((item) => ({
                id: item.id,
                text: item.text || "",
                images: item.images || [],
              }));

              matchingPairs = {
                leftItems:
                  cleanLeftItems.length > 0
                    ? cleanLeftItems
                    : matchingPairs.leftItems,
                rightItems:
                  cleanRightItems.length > 0
                    ? cleanRightItems
                    : matchingPairs.rightItems,
                correctMatches: data.data.matchingPairs.correctMatches || {},
              };
            }

            // Update form state with the fetched data
            setFormData({
              questionText: data.data.questionText || "",
              questionType: data.data.questionType || "radio",
              difficulty: data.data.difficulty || "medium",
              marks: data.data.marks || 1,
              negativeMarks: data.data.negativeMarks || 0,
              subject: data.data.subject || "",
              topic: data.data.topic || "",
              tags: data.data.tags || [],
              options: options,
              correctAnswers: data.data.correctAnswers || [],
              matchingPairs: matchingPairs,
              isSample: data.data.isSample || false,
              explanation: data.data.explanation || "",
              status: data.data.status || "draft",
            });
          }
        } catch (err) {
          console.error("Failed to fetch question", err);
          alert("Failed to load question data");
        } finally {
          setLoading(false);
        }
      };

      fetchQuestion();
    } else {
      setIsEditing(false);
    }
  }, [questionId]);

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Function to handle option changes
  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
  };

  // Function to handle correct answer selection
  const handleCorrectAnswerChange = (label) => {
    let updatedAnswers;
    if (formData.questionType === "radio") {
      updatedAnswers = [label];
    } else {
      updatedAnswers = formData.correctAnswers.includes(label)
        ? formData.correctAnswers.filter((a) => a !== label)
        : [...formData.correctAnswers, label];
    }
    setFormData((prev) => ({
      ...prev,
      correctAnswers: updatedAnswers,
    }));
  };

  // Function to add a new option
  const addOption = () => {
    const nextLabel = String.fromCharCode(65 + formData.options.length); // A=65, B=66, C=67, etc.
    const newOption = { label: nextLabel, text: "", images: [] };

    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  // Function to remove an option
  const removeOption = (index) => {
    if (formData.options.length <= 2) {
      alert("Minimum 2 options required!");
      return;
    }

    const removedLabel = formData.options[index].label;
    const updatedOptions = formData.options.filter((_, i) => i !== index);

    // Update correct answers if the removed option was selected
    const updatedCorrectAnswers = formData.correctAnswers.filter(
      (answer) => answer !== removedLabel,
    );

    setFormData((prev) => ({
      ...prev,
      options: updatedOptions,
      correctAnswers: updatedCorrectAnswers,
    }));
  };

  const addMatchingItem = (side) => {
    const items =
      side === "left"
        ? formData.matchingPairs.leftItems
        : formData.matchingPairs.rightItems;
    const newId =
      side === "left" ? `L${items.length + 1}` : `R${items.length + 1}`;
    const newItem = { id: newId, text: "", images: [] };

    setFormData((prev) => ({
      ...prev,
      matchingPairs: {
        ...prev.matchingPairs,
        [side === "left" ? "leftItems" : "rightItems"]: [...items, newItem],
      },
    }));
  };

  const removeMatchingItem = (side, index) => {
    const items =
      side === "left"
        ? formData.matchingPairs.leftItems
        : formData.matchingPairs.rightItems;
    if (items.length <= 2) {
      alert("Minimum 2 items required!");
      return;
    }

    const itemId = items[index].id;
    const updatedItems = items.filter((_, i) => i !== index);
    const updatedMatches = { ...formData.matchingPairs.correctMatches };

    if (side === "left") {
      delete updatedMatches[itemId];
    } else {
      Object.keys(updatedMatches).forEach((key) => {
        if (updatedMatches[key] === itemId) {
          delete updatedMatches[key];
        }
      });
    }

    setFormData((prev) => ({
      ...prev,
      matchingPairs: {
        ...prev.matchingPairs,
        [side === "left" ? "leftItems" : "rightItems"]: updatedItems,
        correctMatches: updatedMatches,
      },
    }));
  };

  const handleMatchingItemChange = (side, index, field, value) => {
    const items =
      side === "left"
        ? [...formData.matchingPairs.leftItems]
        : [...formData.matchingPairs.rightItems];
    items[index] = {
      ...items[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      matchingPairs: {
        ...prev.matchingPairs,
        [side === "left" ? "leftItems" : "rightItems"]: items,
      },
    }));
  };

  // Handler for matching image uploads (multiple)
  const handleMatchingImagesSelect = (side, itemId, files) => {
    const key = `${side}-${itemId}`;
    setMatchingImageFiles((prev) => ({
      ...prev,
      [key]: files,
    }));
  };

  // Handler for pasted image URLs
  const handlePastedImageUrl = (key, url) => {
    if (!url.trim()) return;

    setPastedImageUrls((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), url.trim()],
    }));
  };

  const handleRemovePastedUrl = (key, urlIndex) => {
    setPastedImageUrls((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== urlIndex),
    }));
  };

  const handleCorrectMatchChange = (leftId, rightId) => {
    setFormData((prev) => ({
      ...prev,
      matchingPairs: {
        ...prev.matchingPairs,
        correctMatches: {
          ...prev.matchingPairs.correctMatches,
          [leftId]: rightId,
        },
      },
    }));
  };

  // Handler for question images (multiple)
  const handleQuestionImagesSelect = (files) => {
    setQuestionImageFiles(files);
  };

  // Handler for option images (multiple)
  const handleOptionImagesSelect = (index, files) => {
    setOptionImageFiles((prev) => ({
      ...prev,
      [index]: files,
    }));
  };

  // Helper function to strip HTML and check if text is empty
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const isTextEmpty = (text) => {
    const cleaned = stripHtml(text);
    return !cleaned || cleaned.length === 0;
  };

  // Submit handler supports 'addAnother' to save and reset form for adding more
  const submitHandler = async (addAnother = false, e) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);

    try {
      // Validate question text
      if (isTextEmpty(formData.questionText)) {
        alert("Please enter question text");
        setLoading(false);
        return;
      }

      // Validate options for non-matching types
      if (formData.questionType !== "matching") {
        const emptyOptions = formData.options.filter((opt) =>
          isTextEmpty(opt.text),
        );
        if (emptyOptions.length > 0) {
          alert("Please fill in all option texts (A, B, C, D)");
          setLoading(false);
          return;
        }

        if (!formData.correctAnswers || formData.correctAnswers.length === 0) {
          alert("Please select at least one correct answer");
          setLoading(false);
          return;
        }
      }

      // Validate matching pairs if type is matching
      if (formData.questionType === "matching") {
        const emptyLeftItems = formData.matchingPairs.leftItems.filter((item) =>
          isTextEmpty(item.text),
        );
        const emptyRightItems = formData.matchingPairs.rightItems.filter(
          (item) => isTextEmpty(item.text),
        );

        if (emptyLeftItems.length > 0 || emptyRightItems.length > 0) {
          alert("Please fill in all matching items text fields");
          setLoading(false);
          return;
        }

        const leftItemsCount = formData.matchingPairs.leftItems.length;
        const matchesCount = Object.keys(
          formData.matchingPairs.correctMatches,
        ).length;

        if (matchesCount < leftItemsCount) {
          alert("Please set correct matches for all items in Column A");
          setLoading(false);
          return;
        }
      }

      const submitData = new FormData();
      submitData.append("examId", examId);
      submitData.append("questionText", formData.questionText);

      // Only include questionCode when editing or if explicitly provided
      if (isEditing && formData.questionCode) {
        submitData.append("questionCode", formData.questionCode);
      }

      submitData.append("questionType", formData.questionType);
      submitData.append("difficulty", formData.difficulty);
      submitData.append("marks", formData.marks.toString());
      submitData.append("negativeMarks", formData.negativeMarks.toString());
      submitData.append("subject", formData.subject);
      submitData.append("topic", formData.topic);
      submitData.append("tags", JSON.stringify(formData.tags));

      if (formData.questionType !== "matching") {
        submitData.append("options", JSON.stringify(formData.options));
        submitData.append(
          "correctAnswers",
          JSON.stringify(formData.correctAnswers),
        );
      }

      submitData.append("isSample", formData.isSample.toString());
      submitData.append("explanation", formData.explanation);
      submitData.append("status", formData.status);

      questionImageFiles.forEach((file) => {
        submitData.append("questionImages", file);
      });

      if (formData.questionType !== "matching") {
        Object.entries(optionImageFiles).forEach(([index, files]) => {
          files.forEach((file) => {
            submitData.append(`optionImages-${index}`, file);
          });
        });
      }

      if (formData.questionType === "matching") {
        submitData.append(
          "matchingPairs",
          JSON.stringify(formData.matchingPairs),
        );

        formData.matchingPairs.leftItems.forEach((item) => {
          const key = `left-${item.id}`;
          const files = matchingImageFiles[key] || [];
          files.forEach((file) => {
            submitData.append(`matchingImages-left-${item.id}`, file);
          });

          const pastedUrls = pastedImageUrls[key] || [];
          submitData.append(
            `pastedImages-left-${item.id}`,
            JSON.stringify(pastedUrls),
          );
        });

        formData.matchingPairs.rightItems.forEach((item) => {
          const key = `right-${item.id}`;
          const files = matchingImageFiles[key] || [];
          files.forEach((file) => {
            submitData.append(`matchingImages-right-${item.id}`, file);
          });

          const pastedUrls = pastedImageUrls[key] || [];
          submitData.append(
            `pastedImages-right-${item.id}`,
            JSON.stringify(pastedUrls),
          );
        });
      }

      const url =
        isEditing && questionId !== "new"
          ? `/api/questions/${questionId}`
          : "/api/questions";
      const method = isEditing && questionId !== "new" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        // Notify and call onSuccess
        if (addAnother) {
          alert("Question saved. You can add another now.");
          if (onSuccess) onSuccess(result.data);
          // Reset form for next question only in create mode
          if (!isEditing) resetForm();
        } else {
          alert(`Question ${isEditing ? "updated" : "created"} successfully!`);
          if (onSuccess) onSuccess(result.data);
          if (!isEditing) resetForm();
        }
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit question. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching data
  if (loading && isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="text-lg">Loading question data...</div>
      </div>
    );
  }

  // Render component
  const outerClass = isModal
    ? ""
    : compact
      ? "max-w-3xl mx-auto p-2 bg-gray-50 min-h-screen"
      : "max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen";

  const innerClass = isModal
    ? ""
    : compact
      ? "bg-white rounded shadow-sm p-3"
      : "bg-white rounded-lg shadow-lg p-6";

  return (
    <div className={outerClass}>
      <div className={innerClass}>
        {!isModal && (
          <h1
            className={`${compact ? "text-base" : "text-3xl"} font-bold mb-4 text-gray-800 border-b pb-3`}
          >
            {isEditing ? "Edit" : "Add"} Question
          </h1>
        )}

        <form
          onSubmit={(e) => submitHandler(false, e)}
          className={compact ? "space-y-3" : "space-y-6"}
        >
          <div
            className={
              compact
                ? "p-2 rounded border bg-white"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200"
            }
          >
            <h2
              className={`${compact ? "text-sm font-medium mb-2" : "text-xl font-semibold mb-4"} text-gray-800 flex items-center`}
            >
              {compact ? (
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">
                  1
                </span>
              ) : (
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  1
                </span>
              )}
              Basic Information
            </h2>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-${compact ? "2" : "4"} mb-4`}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type
                </label>
                <select
                  name="questionType"
                  value={formData.questionType}
                  onChange={handleInputChange}
                  className={
                    compact
                      ? "w-full p-1.5 border border-gray-300 rounded-sm text-xs focus:ring-1 focus:ring-blue-500"
                      : "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }
                >
                  <option value="radio">Single Choice (MCQ)</option>
                  <option value="checkbox">Multiple Choice</option>
                  <option value="matching">Matching Type</option>
                </select>
              </div>
            </div>

            <div className={compact ? "mb-2" : "mb-4"}>
              <RichTextEditor
                label={compact ? "" : "Question Text *"}
                value={formData.questionText}
                compact={compact}
                onChange={(html) =>
                  setFormData((prev) => ({ ...prev, questionText: html }))
                }
              />
            </div>

            <div className="mb-4">
              {compact ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setCompactImagesOpen((s) => !s)}
                    className={
                      compact
                        ? "text-xs px-2 py-0.5 bg-gray-100 rounded-sm"
                        : "text-sm px-2 py-1 bg-gray-100 rounded"
                    }
                  >
                    {compactImagesOpen ? "Hide Images" : "Images"}
                  </button>
                  {compactImagesOpen && (
                    <div className={compact ? "mt-1" : "mt-2"}>
                      <ImageUploader
                        resetKey={imageResetKey}
                        compact={compact}
                        onImagesSelect={handleQuestionImagesSelect}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Images (Optional - Multiple)
                  </label>
                  <ImageUploader
                    resetKey={imageResetKey}
                    onImagesSelect={handleQuestionImagesSelect}
                  />
                </>
              )}
            </div>

            {formData.questionType === "matching" ? (
              <div
                className={
                  compact
                    ? "p-2 rounded border mt-2"
                    : "bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200"
                }
              >
                <h2
                  className={
                    compact
                      ? "text-sm font-semibold mb-2 text-gray-800 flex items-center"
                      : "text-xl font-semibold mb-4 text-gray-800 flex items-center"
                  }
                >
                  <span
                    className={
                      compact
                        ? "bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs"
                        : "bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3"
                    }
                  >
                    2
                  </span>
                  Matching Items
                </h2>

                <div
                  className={
                    compact
                      ? "grid grid-cols-1 lg:grid-cols-2 gap-3"
                      : "grid grid-cols-1 lg:grid-cols-2 gap-6"
                  }
                >
                  <div
                    className={
                      compact
                        ? "bg-white p-2 rounded shadow-sm border"
                        : "bg-white p-4 rounded-lg shadow-sm border-2 border-purple-300"
                    }
                  >
                    <div
                      className={
                        compact
                          ? "flex items-center justify-between mb-2"
                          : "flex justify-between items-center mb-4"
                      }
                    >
                      <h3
                        className={
                          compact
                            ? "font-medium text-gray-700 text-sm"
                            : "font-semibold text-gray-700 text-lg"
                        }
                      >
                        Column A (Questions)
                      </h3>
                      <button
                        type="button"
                        onClick={() => addMatchingItem("left")}
                        className={
                          compact
                            ? "flex items-center gap-2 px-2 py-1 bg-green-500 text-white rounded-sm"
                            : "flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                        }
                      >
                        <Plus size={compact ? 14 : 18} />{" "}
                        {compact ? "Add" : "Add Item"}
                      </button>
                    </div>

                    {formData.matchingPairs.leftItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="mb-4 p-4 border-2 border-purple-200 rounded-lg bg-purple-50 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-purple-700 bg-white px-3 py-1 rounded-full">
                            {item.id}
                          </span>
                          {formData.matchingPairs.leftItems.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeMatchingItem("left", index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>

                        <RichTextEditor
                          label=""
                          value={item.text}
                          onChange={(html) =>
                            handleMatchingItemChange(
                              "left",
                              index,
                              "text",
                              html,
                            )
                          }
                        />

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Images (Multiple)
                          </label>
                          <ImageUploader
                            resetKey={imageResetKey}
                            onImagesSelect={(files) =>
                              handleMatchingImagesSelect("left", item.id, files)
                            }
                          />

                          <div className="mt-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Or paste image URLs:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handlePastedImageUrl(
                                      `left-${item.id}`,
                                      e.target.value,
                                    );
                                    e.target.value = "";
                                  }
                                }}
                              />
                            </div>
                            {pastedImageUrls[`left-${item.id}`]?.map(
                              (url, urlIndex) => (
                                <div
                                  key={urlIndex}
                                  className="flex items-center gap-2 mt-2 p-2 bg-gray-100 rounded"
                                >
                                  <img
                                    src={url}
                                    alt=""
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <span className="flex-1 text-xs truncate">
                                    {url}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemovePastedUrl(
                                        `left-${item.id}`,
                                        urlIndex,
                                      )
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                            Correct Match:
                          </label>
                          <select
                            value={
                              formData.matchingPairs.correctMatches[item.id] ||
                              ""
                            }
                            onChange={(e) =>
                              handleCorrectMatchChange(item.id, e.target.value)
                            }
                            className="w-full p-2 border-2 border-purple-300 rounded-lg text-sm font-medium bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Select matching answer</option>
                            {formData.matchingPairs.rightItems.map(
                              (rightItem) => (
                                <option key={rightItem.id} value={rightItem.id}>
                                  {rightItem.id} -{" "}
                                  {rightItem.text.substring(0, 30)}
                                  {rightItem.text.length > 30 ? "..." : ""}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </div>
                    ))}

                    <div className="mt-3 flex justify-center">
                      <button
                        type="button"
                        onClick={() => addMatchingItem("left")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                      >
                        <Plus size={16} /> Add Item
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-pink-300">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-700 text-lg">
                        Column B (Answers)
                      </h3>
                      <button
                        type="button"
                        onClick={() => addMatchingItem("right")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                      >
                        <Plus size={18} /> Add Item
                      </button>
                    </div>

                    {formData.matchingPairs.rightItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="mb-4 p-4 border-2 border-pink-200 rounded-lg bg-pink-50 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-bold text-pink-700 bg-white px-3 py-1 rounded-full">
                            {item.id}
                          </span>
                          {formData.matchingPairs.rightItems.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeMatchingItem("right", index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>

                        <RichTextEditor
                          label=""
                          value={item.text}
                          onChange={(html) =>
                            handleMatchingItemChange(
                              "right",
                              index,
                              "text",
                              html,
                            )
                          }
                        />

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Images (Multiple)
                          </label>
                          <ImageUploader
                            resetKey={imageResetKey}
                            onImagesSelect={(files) =>
                              handleMatchingImagesSelect(
                                "right",
                                item.id,
                                files,
                              )
                            }
                          />

                          <div className="mt-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Or paste image URLs:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handlePastedImageUrl(
                                      `right-${item.id}`,
                                      e.target.value,
                                    );
                                    e.target.value = "";
                                  }
                                }}
                              />
                            </div>
                            {pastedImageUrls[`right-${item.id}`]?.map(
                              (url, urlIndex) => (
                                <div
                                  key={urlIndex}
                                  className="flex items-center gap-2 mt-2 p-2 bg-gray-100 rounded"
                                >
                                  <img
                                    src={url}
                                    alt=""
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <span className="flex-1 text-xs truncate">
                                    {url}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemovePastedUrl(
                                        `right-${item.id}`,
                                        urlIndex,
                                      )
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-3 flex justify-center">
                      <button
                        type="button"
                        onClick={() => addMatchingItem("right")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                      >
                        <Plus size={16} /> Add Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={
                  compact
                    ? "p-2 rounded border mt-2"
                    : "bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200"
                }
              >
                <h2
                  className={
                    compact
                      ? "text-sm font-semibold mb-2 text-gray-800 flex items-center"
                      : "text-xl font-semibold mb-4 text-gray-800 flex items-center"
                  }
                >
                  <span
                    className={
                      compact
                        ? "bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs"
                        : "bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3"
                    }
                  >
                    2
                  </span>
                  Answer Options
                </h2>

                {formData.options.map((option, index) => (
                  <div
                    key={index}
                    className={
                      compact
                        ? "mb-2 p-2 border rounded bg-white"
                        : "mb-4 p-4 border-2 border-green-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                    }
                  >
                    <div
                      className={
                        compact
                          ? "flex items-center justify-between mb-2"
                          : "flex items-center justify-between mb-3"
                      }
                    >
                      <div className="flex items-center">
                        <span
                          className={
                            compact
                              ? "font-bold text-sm mr-3 bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                              : "font-bold text-lg mr-4 bg-green-100 text-green-700 px-3 py-1 rounded-full"
                          }
                        >
                          {option.label}
                        </span>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type={
                              formData.questionType === "radio"
                                ? "radio"
                                : "checkbox"
                            }
                            name="correctAnswers"
                            checked={formData.correctAnswers.includes(
                              option.label,
                            )}
                            onChange={() =>
                              handleCorrectAnswerChange(option.label)
                            }
                            className={
                              compact
                                ? "mr-2 w-4 h-4 text-green-500"
                                : "mr-2 w-5 h-5 text-green-500 focus:ring-green-500"
                            }
                          />
                          <span
                            className={
                              compact
                                ? "font-medium text-green-700 text-xs"
                                : "font-medium text-green-700"
                            }
                          >
                            Mark as Correct Answer
                          </span>
                        </label>
                      </div>
                      {formData.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className={
                            compact
                              ? "bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-sm transition-colors flex items-center text-xs"
                              : "bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors flex items-center text-sm"
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={
                              compact ? "h-3 w-3 mr-1" : "h-4 w-4 mr-1"
                            }
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span className={compact ? "text-xs" : ""}>
                            Remove
                          </span>
                        </button>
                      )}
                    </div>

                    <div className={compact ? "mb-2" : "mb-3"}>
                      <RichTextEditor
                        label=""
                        compact={compact}
                        value={option.text}
                        onChange={(html) =>
                          handleOptionChange(index, "text", html)
                        }
                      />
                    </div>

                    <div>
                      <label
                        className={
                          compact
                            ? "block text-xs font-medium text-gray-700 mb-1"
                            : "block text-sm font-medium text-gray-700 mb-2"
                        }
                      >
                        Option Images (Optional - Multiple)
                      </label>
                      <ImageUploader
                        resetKey={imageResetKey}
                        compact={compact}
                        onImagesSelect={(files) =>
                          handleOptionImagesSelect(index, files)
                        }
                      />
                    </div>
                  </div>
                ))}

                <div className={compact ? "mt-2" : "mt-4"}>
                  <button
                    type="button"
                    onClick={addOption}
                    className={
                      compact
                        ? "bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-sm transition-colors flex items-center text-xs font-medium"
                        : "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm font-medium"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={compact ? "h-4 w-4 mr-1" : "h-5 w-5 mr-2"}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className={compact ? "text-xs" : ""}>Add Option</span>
                  </button>
                </div>
              </div>
            )}

            <div
              className={
                compact
                  ? "p-2 rounded border mt-2"
                  : "bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200"
              }
            >
              <h2
                className={
                  compact
                    ? "text-sm font-semibold mb-2 text-gray-800 flex items-center"
                    : "text-xl font-semibold mb-4 text-gray-800 flex items-center"
                }
              >
                <span
                  className={
                    compact
                      ? "bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs"
                      : "bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3"
                  }
                >
                  3
                </span>
                Additional Details
              </h2>

              <div
                className={
                  compact
                    ? "grid grid-cols-1 md:grid-cols-3 gap-2 mb-2"
                    : "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
                }
              >
                <div>
                  <label
                    className={
                      compact
                        ? "block text-xs font-medium text-gray-700 mb-1"
                        : "block text-sm font-medium text-gray-700 mb-1"
                    }
                  >
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className={
                      compact
                        ? "w-full p-1.5 border border-gray-300 rounded-sm text-xs"
                        : "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label
                    className={
                      compact
                        ? "block text-xs font-medium text-gray-700 mb-1"
                        : "block text-sm font-medium text-gray-700 mb-1"
                    }
                  >
                    Marks
                  </label>
                  <input
                    type="number"
                    name="marks"
                    value={formData.marks}
                    onChange={handleInputChange}
                    className={
                      compact
                        ? "w-full p-1.5 border border-gray-300 rounded-sm text-xs"
                        : "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    }
                    min="0"
                    step="0.5"
                  />
                </div>

                <div>
                  <label
                    className={
                      compact
                        ? "block text-xs font-medium text-gray-700 mb-1"
                        : "block text-sm font-medium text-gray-700 mb-1"
                    }
                  >
                    Negative Marks
                  </label>
                  <input
                    type="number"
                    name="negativeMarks"
                    value={formData.negativeMarks}
                    onChange={handleInputChange}
                    className={
                      compact
                        ? "w-full p-1.5 border border-gray-300 rounded-sm text-xs"
                        : "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    }
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              <div
                className={
                  compact
                    ? "grid grid-cols-1 md:grid-cols-2 gap-2 mb-2"
                    : "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                }
              >
                <div>
                  <label
                    className={
                      compact
                        ? "block text-xs font-medium text-gray-700 mb-1"
                        : "block text-sm font-medium text-gray-700 mb-1"
                    }
                  >
                    Subject{" "}
                    <span
                      className={
                        compact
                          ? "text-gray-400 text-xxs"
                          : "text-gray-400 text-xs"
                      }
                    >
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={
                      compact
                        ? "w-full p-1.5 border border-gray-300 rounded-sm text-xs"
                        : "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    }
                    placeholder="e.g., Mathematics"
                  />
                </div>

                <div>
                  <label
                    className={
                      compact
                        ? "block text-xs font-medium text-gray-700 mb-1"
                        : "block text-sm font-medium text-gray-700 mb-1"
                    }
                  >
                    Topic{" "}
                    <span
                      className={
                        compact
                          ? "text-gray-400 text-xxs"
                          : "text-gray-400 text-xs"
                      }
                    >
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className={
                      compact
                        ? "w-full p-1.5 border border-gray-300 rounded-sm text-xs"
                        : "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    }
                    placeholder="e.g., Algebra"
                  />
                </div>
              </div>

              <div className={compact ? "mb-2" : "mb-4"}>
                <label
                  className={
                    compact
                      ? "block text-xs font-medium text-gray-700 mb-1"
                      : "block text-sm font-medium text-gray-700 mb-1"
                  }
                >
                  Tags{" "}
                  <span
                    className={
                      compact
                        ? "text-gray-400 text-xxs"
                        : "text-gray-400 text-xs"
                    }
                  >
                    (Optional)
                  </span>{" "}
                  - comma separated
                </label>
                <input
                  type="text"
                  value={formData.tags.join(", ")}
                  onChange={(e) => {
                    const tagsArray = e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag);
                    setFormData((prev) => ({ ...prev, tags: tagsArray }));
                  }}
                  className={
                    compact
                      ? "w-full p-1.5 border border-gray-300 rounded-sm text-xs"
                      : "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  }
                  placeholder="e.g., algebra, geometry, math"
                />
              </div>

              <div className={compact ? "mb-2" : "mb-4"}>
                <RichTextEditor
                  label={compact ? "" : "Explanation (Optional)"}
                  compact={compact}
                  value={formData.explanation}
                  onChange={(html) =>
                    setFormData((prev) => ({ ...prev, explanation: html }))
                  }
                />
              </div>

              <div
                className={
                  compact
                    ? "flex items-center gap-2"
                    : "flex items-center gap-4"
                }
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isSample"
                    checked={formData.isSample}
                    onChange={handleInputChange}
                    className={
                      compact
                        ? "mr-2 w-4 h-4 text-amber-500"
                        : "mr-2 w-5 h-5 text-amber-500 focus:ring-amber-500"
                    }
                  />
                  <span
                    className={
                      compact
                        ? "font-medium text-gray-700 text-xs"
                        : "font-medium text-gray-700"
                    }
                  >
                    Mark as Sample Question
                  </span>
                </label>

                <div>
                  <label
                    className={
                      compact
                        ? "block text-xs font-medium text-gray-700 mb-1"
                        : "block text-sm font-medium text-gray-700 mb-1"
                    }
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={
                      compact
                        ? "p-1.5 border border-gray-300 rounded-sm text-xs"
                        : "p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="publish">Publish</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Quick-add toolbar for modal: keeps add buttons visible at bottom so
              user doesn't need to scroll to the top to add options/columns */}
          {(isModal || formData.questionType === "matching") &&
            (compact ? (
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {formData.questionType !== "matching" ? (
                    <button
                      type="button"
                      onClick={addOption}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-sm transition-colors flex items-center text-xs font-medium"
                      aria-label="Add option"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => addMatchingItem("left")}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded-sm text-xs"
                        aria-label="Add item to Column A"
                      >
                        A+
                      </button>
                      <button
                        type="button"
                        onClick={() => addMatchingItem("right")}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded-sm text-xs"
                        aria-label="Add item to Column B"
                      >
                        B+
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-600">Quick</div>
              </div>
            ) : (
              <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur px-6 py-3 border-t flex items-center justify-between gap-4 z-30">
                <div className="flex items-center gap-3">
                  {formData.questionType !== "matching" ? (
                    <button
                      type="button"
                      onClick={addOption}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm font-medium"
                      aria-label="Add option"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Option
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addMatchingItem("left")}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm font-medium"
                        aria-label="Add item to Column A"
                      >
                        Add Column A
                      </button>
                      <button
                        type="button"
                        onClick={() => addMatchingItem("right")}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center text-sm font-medium"
                        aria-label="Add item to Column B"
                      >
                        Add Column B
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-600">Quick actions</div>
              </div>
            ))}

          <div
            className={`flex justify-end gap-4 pt-6 border-t ${compact ? "items-center" : ""}`}
          >
            {!isModal && (
              <button
                type="button"
                onClick={() => window.history.back()}
                className={
                  compact
                    ? "px-3 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors text-xs"
                    : "px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                }
              >
                {compact ? "Cancel" : "Cancel"}
              </button>
            )}
            {isModal && !isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className={
                  compact
                    ? "px-3 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition-colors text-xs"
                    : "px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                }
              >
                {compact ? "Clear" : "Clear Form"}
              </button>
            )}
            {!isEditing && (
              <button
                type="button"
                onClick={() => submitHandler(true)}
                className={
                  compact
                    ? "px-3 py-2 bg-green-500 text-white rounded-sm hover:bg-green-600 transition-colors text-xs"
                    : "px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                }
              >
                {compact ? "Save & Add" : "Save & Add Another"}
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={
                compact
                  ? "px-3 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  : "px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              }
            >
              {loading ? (
                <>
                  <div
                    className={
                      compact
                        ? "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                        : "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    }
                  ></div>
                  {isEditing
                    ? compact
                      ? "Updating"
                      : "Updating..."
                    : compact
                      ? "Saving"
                      : "Creating..."}
                </>
              ) : (
                <>
                  {isEditing
                    ? compact
                      ? "Update"
                      : "Update Question"
                    : compact
                      ? "Save"
                      : "Save & Continue"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
