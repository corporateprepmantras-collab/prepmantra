"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BlogPage() {
  const params = useParams();
  // const selectedSlug = params?.slug ? decodeURIComponent(params.slug).trim().toLowerCase() : "";


  const selectedSlug = params?.category ? decodeURIComponent(params.category).trim().toLowerCase() : "";

console.log("selectedSlug", selectedSlug);
 

  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`/api/blogs/blog-categories`);
        const raw = res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
        setCategories(raw.filter((c) => !!c.category));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/blogs`);
        const allBlogs = res.data?.data || [];

        const filtered = selectedSlug
          ? allBlogs.filter((b) => {
              const cat = b.category;
              // category is populated object
              const catName = (cat?.category || cat?.sectionName || "").trim().toLowerCase();
              const catSlug = (cat?.slug || "").trim().toLowerCase();
              return catName === selectedSlug || catSlug === selectedSlug;
            })
          : allBlogs;

        setBlogs(filtered);

        const recent = [...allBlogs]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);
        setRecentPosts(recent);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedSlug]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div
        className="w-full h-80 bg-cover bg-center py-14 px-4 text-white"
        style={{
          backgroundImage: `url(https://t3.ftcdn.net/jpg/03/16/91/28/360_F_316912806_RCeHVmUx5LuBMi7MKYTY5arkE4I0DcpU.jpg)`,
        }}
      >
        <h1 suppressHydrationWarning className="text-4xl pt-24 font-bold text-center mb-6 text-white">
  OUR BLOG
</h1>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/blogs">
            <button
              className={`px-4 py-1 rounded-full border ${
                !selectedSlug
                  ? "bg-white text-black font-semibold"
                  : "bg-transparent border-white text-white"
              }`}
            >
              All
            </button>
          </Link>
          {categories.map((cat) => {
            const catSlug = cat.slug?.trim().toLowerCase() || cat.category.trim().toLowerCase();
            const isActive = selectedSlug === catSlug || selectedSlug === cat.category.trim().toLowerCase();
            return (
              <Link key={cat._id} href={`/blogs/${encodeURIComponent(cat.category.trim().toLowerCase())}`}>
                <button
                  className={`px-4 py-1 rounded-full border ${
                    isActive
                      ? "bg-white text-black font-semibold"
                      : "bg-transparent border-white text-white"
                  }`}
                >
                  {cat.sectionName || cat.category}
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
        {/* Blog Cards */}
        <div className="w-full lg:w-3/4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-center text-gray-500 col-span-full">Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <p className="text-gray-600 italic col-span-full">No blogs found.</p>
          ) : (
            blogs.map((blog) => (
              <Link key={blog._id} href={`/blog/${blog.category.category}/${blog.slug || blog._id}`}>
                <div className="bg-gray-100 h-full flex flex-col justify-between rounded-xl shadow-md p-4 hover:shadow-lg transition">
                  {blog.imageUrl && (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-60 object-cover rounded mb-4"
                    />
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{blog.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                      {blog.metaDescription}
                    </p>
                  </div>
                  <p className="text-blue-600 mt-4 text-sm font-medium hover:underline">
                    Read More →
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}