import { useEffect, useRef, useState } from "react";

const RichTextEditor = ({ value, onChange, error = "", label = "Editor" }) => {
  const editorRef = useRef(null);
  const savedSelection = useRef(null);
  const fileInputRef = useRef(null);

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  const [showTableModal, setShowTableModal] = useState(false);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);

  /* ------------------ TOOLBAR CONFIG ------------------ */
  const toolbarButtons = [
    { format: "bold", icon: "B", title: "Bold" },
    { format: "italic", icon: "I", title: "Italic" },
    { format: "underline", icon: "U", title: "Underline" },
    { format: "strikeThrough", icon: "S", title: "Strikethrough" },
    { separator: true },
    {
      format: "justifyLeft",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18">
          <rect x="3" y="4" width="12" height="2" fill="currentColor" />
          <rect x="3" y="8" width="8" height="2" fill="currentColor" />
          <rect x="3" y="12" width="10" height="2" fill="currentColor" />
        </svg>
      ),
      title: "Align Left",
    },
    {
      format: "justifyCenter",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18">
          <rect x="5" y="4" width="8" height="2" fill="currentColor" />
          <rect x="3" y="8" width="12" height="2" fill="currentColor" />
          <rect x="4" y="12" width="10" height="2" fill="currentColor" />
        </svg>
      ),
      title: "Align Center",
    },
    {
      format: "justifyRight",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18">
          <rect x="3" y="4" width="12" height="2" fill="currentColor" />
          <rect x="7" y="8" width="8" height="2" fill="currentColor" />
          <rect x="5" y="12" width="10" height="2" fill="currentColor" />
        </svg>
      ),
      title: "Align Right",
    },
    {
      format: "justifyFull",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18">
          <rect x="3" y="4" width="12" height="2" fill="currentColor" />
          <rect x="3" y="8" width="12" height="2" fill="currentColor" />
          <rect x="3" y="12" width="12" height="2" fill="currentColor" />
        </svg>
      ),
      title: "Justify",
    },
    { separator: true },
    { format: "insertOrderedList", icon: "1.", title: "Ordered List" },
    { format: "insertUnorderedList", icon: "•", title: "Bullet List" },
    { separator: true },
    { format: "link", icon: "🔗", title: "Insert Link" },
    { format: "table", icon: "📊", title: "Insert Table" },
    { format: "image", icon: "🖼", title: "Insert Image" },
  ];

  /* ------------------ LOAD INITIAL VALUE ------------------ */
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  /* ------------------ SELECTION ------------------ */
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (savedSelection.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current);
    }
  };

  /* ------------------ CLEAR STYLE HELPERS ------------------ */
  const clearStyle = (styleProp) => {
    try {
      restoreSelection();
      editorRef.current.focus();

      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);

      // If collapsed selection, try to clear inline styles (span/font/bgcolor)
      // first, then fall back to clearing nearest block ancestor.
      if (range.collapsed) {
        let node = sel.anchorNode;
        if (node.nodeType === 3) node = node.parentNode;

        // Search up from the node for any inline element carrying the style
        let cur = node;
        let found = null;
        while (cur && cur !== editorRef.current) {
          try {
            if (cur.style && cur.style[styleProp]) {
              found = cur;
              break;
            }
            if (
              styleProp === "backgroundColor" &&
              cur.hasAttribute &&
              cur.hasAttribute("bgcolor")
            ) {
              found = cur;
              break;
            }
            if (
              styleProp === "color" &&
              cur.tagName === "FONT" &&
              cur.hasAttribute &&
              cur.hasAttribute("color")
            ) {
              found = cur;
              break;
            }
          } catch (e) {
            // ignore
          }
          cur = cur.parentNode;
        }

        if (found) {
          if (found.style && found.style[styleProp]) {
            found.style[styleProp] = "";
            if (!found.getAttribute("style")) found.removeAttribute("style");
          }
          if (
            styleProp === "backgroundColor" &&
            found.hasAttribute &&
            found.hasAttribute("bgcolor")
          )
            found.removeAttribute("bgcolor");
          if (
            styleProp === "color" &&
            found.tagName === "FONT" &&
            found.hasAttribute &&
            found.hasAttribute("color")
          )
            found.removeAttribute("color");

          onChange(editorRef.current.innerHTML);
          return;
        }

        // fallback: clear style on nearest block ancestor
        let block = node;
        while (
          block &&
          !/^(P|DIV|LI|H1|H2|H3|SECTION|ARTICLE)$/i.test(block.tagName)
        ) {
          block = block.parentNode;
        }
        if (block && block.style && block.style[styleProp]) {
          block.style[styleProp] = "";
          if (!block.getAttribute("style")) block.removeAttribute("style");
        }
        onChange(editorRef.current.innerHTML);
        return;
      }

      // For a range selection, iterate elements contained in the range and clear the style
      let container = range.commonAncestorContainer;
      if (container.nodeType === 3) container = container.parentNode;

      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_ELEMENT,
        null,
      );
      let node = walker.currentNode;
      while (node) {
        try {
          const nodeRange = document.createRange();
          nodeRange.selectNodeContents(node);
          if (
            range.compareBoundaryPoints(Range.END_TO_START, nodeRange) >= 0 ||
            range.compareBoundaryPoints(Range.START_TO_END, nodeRange) <= 0
          ) {
            node = walker.nextNode();
            continue;
          }

          if (node.style && node.style[styleProp]) {
            node.style[styleProp] = "";
            if (!node.getAttribute("style")) node.removeAttribute("style");
          }

          // remove legacy attributes
          if (styleProp === "backgroundColor" && node.hasAttribute("bgcolor"))
            node.removeAttribute("bgcolor");
          if (
            styleProp === "color" &&
            node.tagName === "FONT" &&
            node.hasAttribute("color")
          )
            node.removeAttribute("color");
        } catch (e) {
          // ignore
        }
        node = walker.nextNode();
      }

      onChange(editorRef.current.innerHTML);
    } catch (e) {
      console.error("clearStyle error", e);
    }
  };

  /* ------------------ FORMAT HANDLER ------------------ */
  const handleFormat = (format, value = null) => {
    if (format === "link") {
      const sel = window.getSelection();
      if (sel && sel.toString().trim()) {
        setLinkText(sel.toString());
        saveSelection();
        setShowLinkInput(true);
      } else {
        alert("Select text first");
      }
      return;
    }

    if (format === "table") {
      saveSelection();
      setShowTableModal(true);
      return;
    }

    if (format === "image") {
      saveSelection();
      fileInputRef.current.click();
      return;
    }

    // Focus editor before executing command
    editorRef.current.focus();
    document.execCommand(format, false, value);

    // Apply inline styles to lists for persistent styling
    if (format === "insertUnorderedList" || format === "insertOrderedList") {
      setTimeout(() => {
        const lists = editorRef.current.querySelectorAll("ul, ol");
        lists.forEach((list) => {
          if (list.tagName === "UL") {
            list.style.listStyleType = "disc";
            list.style.paddingLeft = "40px";
            list.style.marginTop = "8px";
            list.style.marginBottom = "8px";
          } else if (list.tagName === "OL") {
            list.style.listStyleType = "decimal";
            list.style.paddingLeft = "40px";
            list.style.marginTop = "8px";
            list.style.marginBottom = "8px";
          }
          // Style list items
          const items = list.querySelectorAll("li");
          items.forEach((item) => {
            item.style.marginLeft = "0";
            item.style.marginTop = "4px";
            item.style.marginBottom = "4px";
          });
        });
        onChange(editorRef.current.innerHTML);
      }, 10);
    } else {
      onChange(editorRef.current.innerHTML);
    }
  };

  /* ------------------ INSERT LINK ------------------ */
  const handleAddLink = () => {
    if (!linkUrl) return alert("Enter URL");

    restoreSelection();
    editorRef.current.focus();

    const finalUrl = /^https?:\/\//i.test(linkUrl)
      ? linkUrl
      : "https://" + linkUrl;

    document.execCommand(
      "insertHTML",
      false,
      `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">
        ${linkText}
      </a>`,
    );

    onChange(editorRef.current.innerHTML);
    setShowLinkInput(false);
    setLinkUrl("");
    setLinkText("");
  };

  /* ------------------ INSERT TABLE ------------------ */
  const insertTable = () => {
    restoreSelection();
    editorRef.current.focus();

    let html = `
<div style="overflow-x:auto;">
  <table style="
    width:100%;
    max-width:100%;
    table-layout:fixed;
    border-collapse:collapse;
    margin:12px 0;
  ">
`;

    for (let i = 0; i < rows; i++) {
      html += "<tr>";
      for (let j = 0; j < cols; j++) {
        html += `<td style="border:1px solid #ccc;padding:8px;">Cell</td>`;
      }
      html += "</tr>";
    }

    html += "</table><p></p>";

    document.execCommand("insertHTML", false, html);
    onChange(editorRef.current.innerHTML);
    setShowTableModal(false);
  };

  /* ------------------ IMAGE UPLOAD ------------------ */
  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      restoreSelection();
      editorRef.current.focus();

      document.execCommand(
        "insertHTML",
        false,
        `
        <figure contenteditable="false" style="margin:16px auto;text-align:center;">
          <img src="${reader.result}" style="max-width:100%;border-radius:8px;" />
          <figcaption contenteditable="true" style="font-size:12px;color:#666;">
            Image caption
          </figcaption>
        </figure>
        <p></p>
        `,
      );

      onChange(editorRef.current.innerHTML);
    };

    reader.readAsDataURL(file);
  };

  /* ------------------ PASTE SUPPORT ------------------ */
  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.includes("image")) {
        e.preventDefault();
        handleImageUpload(item.getAsFile());
      }
    }
  };

  /* ------------------ INPUT CHANGE ------------------ */
  const handleInput = () => {
    const html = editorRef.current.innerHTML;
    console.log("🔄 RichTextEditor onChange:", html);
    onChange(html);
  };

  /* ================================================= */
  return (
    <div className="mb-6">
      <label className="block mb-2 font-medium">{label}</label>

      {/* Toolbar */}
      <div className="sticky top-0 z-10 border rounded-t bg-gray-100 p-2 flex flex-wrap gap-1 shadow-sm">
        <select
          className="border p-1 text-sm"
          defaultValue="p"
          onChange={(e) => {
            editorRef.current.focus();
            const v = e.target.value;
            if (v === "p") {
              document.execCommand("formatBlock", false, "p");
            } else {
              const tag = `h${v}`;
              const wrapped = `<${tag}>`;
              let ok = false;
              try {
                ok = document.execCommand("formatBlock", false, tag);
              } catch {
                ok = false;
              }
              if (!ok) {
                try {
                  document.execCommand("formatBlock", false, wrapped);
                } catch {
                  /* ignore */
                }
              }
            }
            onChange(editorRef.current.innerHTML);
          }}
        >
          <option value="p">Paragraph</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
        </select>

        {toolbarButtons.map((btn, i) =>
          btn.separator ? (
            <div key={i} className="w-px bg-gray-300 mx-1" />
          ) : (
            <button
              key={i}
              type="button"
              title={btn.title}
              className="px-2 py-1 border rounded hover:bg-gray-200"
              onClick={() => handleFormat(btn.format)}
            >
              {btn.icon}
            </button>
          ),
        )}

        <div className="flex items-center gap-1">
          <input
            type="color"
            title="Text color"
            onChange={(e) => handleFormat("foreColor", e.target.value)}
            className="w-8 h-8 p-0 border rounded"
          />
          <button
            type="button"
            title="Clear text color"
            className="px-2 py-1 border rounded hover:bg-gray-200"
            onClick={() => clearStyle("color")}
          >
            A×
          </button>
        </div>

        <div className="flex items-center gap-1">
          <input
            type="color"
            title="Background color"
            onChange={(e) => handleFormat("backColor", e.target.value)}
            className="w-8 h-8 p-0 border rounded"
          />
          <button
            type="button"
            title="Clear background color (No fill)"
            className="px-2 py-1 border rounded hover:bg-gray-200"
            onClick={() => clearStyle("backgroundColor")}
          >
            ☐
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        className="
    border border-t-0 rounded-b p-4 min-h-[200px]
    focus:outline-none focus:ring-2 focus:ring-blue-500
    overflow-x-auto
    break-words
    max-w-full

    [&_ul]:list-disc
    [&_ul]:ml-6
    [&_ul]:my-2
    [&_ol]:list-decimal
    [&_ol]:ml-6
    [&_ol]:my-2
    [&_li]:ml-4
    [&_li]:my-1

    [&_table]:w-full
    [&_table]:table-fixed
    [&_td]:break-words
    [&_th]:break-words

    [&_img]:max-w-full
    [&_img]:h-auto

    [&_figure]:max-w-full
    [&_figure]:overflow-hidden
    [&_figure]:mx-auto
  "
      />

      {/* Hidden image input */}
      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />

      {/* Link Modal */}
      {showLinkInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-5 rounded w-96">
            <input
              className="border p-2 w-full mb-2"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-3"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLinkInput(false)}>Cancel</button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={handleAddLink}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-5 rounded w-80">
            <h3 className="mb-3 font-semibold">Insert Table</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                min="1"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
              />
              <input
                type="number"
                min="1"
                value={cols}
                onChange={(e) => setCols(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowTableModal(false)}>Cancel</button>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={insertTable}
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default RichTextEditor;
