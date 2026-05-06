"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import RichTextEditor from "@/components/public/RichTextEditor";

export default function ItCertFaqsAdmin() {
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    order: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get("/api/itcert-faqs");
      setFaqs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/itcert-faqs", form);
      setFaqs((p) => [...p, res.data]);
      setForm({ question: "", answer: "", order: 0, isActive: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq) => {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      order: faq.order || 0,
      isActive: faq.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      await axios.put(`/api/itcert-faqs/${editing._id}`, form);
      fetchFaqs();
      setEditing(null);
      setForm({ question: "", answer: "", order: 0, isActive: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await axios.delete(`/api/itcert-faqs/${id}`);
      setFaqs((p) => p.filter((f) => f._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">IT Certifications — FAQs</h1>
        <p className="text-sm text-gray-500">
          Manage frequently asked questions
        </p>
      </div>

      <form
        onSubmit={
          editing
            ? (e) => {
                e.preventDefault();
                handleUpdate();
              }
            : handleAdd
        }
        className="bg-white p-4 rounded shadow mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            name="question"
            value={form.question}
            onChange={handleChange}
            placeholder="Question"
            className="col-span-1 md:col-span-3 p-2 border rounded"
          />

          <div className="col-span-1 md:col-span-3">
            <label className="block text-sm text-gray-600 mb-1">Answer</label>
            <RichTextEditor
              value={form.answer}
              onChange={(v) => setForm({ ...form, answer: v })}
              label=""
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center gap-4">
            <div>
              <label className="text-sm text-gray-600">Order</label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                className="w-28 p-2 border rounded ml-2"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              Active
            </label>
          </div>

          <div className="col-span-1 md:col-span-1 flex items-end justify-end">
            {editing ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FaCheck /> {loading ? "Updating..." : "Update"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      question: "",
                      answer: "",
                      order: 0,
                      isActive: true,
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FaPlus /> {loading ? "Adding..." : "Add FAQ"}
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <p className="text-gray-500">No FAQs yet.</p>
        ) : (
          faqs
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((faq) => (
              <div
                key={faq._id}
                className="bg-white border rounded shadow-sm p-4 flex flex-col md:flex-row md:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    {faq.isActive ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div
                    className="prose max-w-none mt-3 text-gray-700"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>

                <div className="flex items-start md:flex-col gap-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded flex items-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
