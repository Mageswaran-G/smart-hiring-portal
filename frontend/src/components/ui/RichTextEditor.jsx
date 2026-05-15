// RichTextEditor

// Supports: Bold, Italic, Headings, Bullet lists, Numbered lists, Undo/Redo

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import {
  Bold, Italic, List, ListOrdered,
  Heading2, Undo, Redo, Minus
} from 'lucide-react';

// Single toolbar button — active state shows orange highlight
function ToolBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        p-1.5 rounded-lg transition text-sm border-none cursor-pointer
        ${active
          ? 'bg-orange-100 text-orange-600'
          : 'text-gray-500 hover:bg-gray-100 bg-transparent'
        }
      `}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder = 'Write job description here...' }) {

  const editor = useEditor({
    extensions: [StarterKit],
    content:    value || '',
    onUpdate:   ({ editor }) => {
      // Send HTML string to parent form
      onChange(editor.getHTML());
    },
  });

  // Sync when parent passes initial value (edit job page)
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [editor]);   // only run when editor mounts — not on every value change

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-300 transition">

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-100 bg-gray-50 flex-wrap">

        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Cmd+B)"
        >
          <Bold size={14} />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Cmd+I)"
        >
          <Italic size={14} />
        </ToolBtn>

        {/* Divider */}
        <span className="w-px h-4 bg-gray-200 mx-1" />

        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading"
        >
          <Heading2 size={14} />
        </ToolBtn>

        {/* Divider */}
        <span className="w-px h-4 bg-gray-200 mx-1" />

        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={14} />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </ToolBtn>

        {/* Divider */}
        <span className="w-px h-4 bg-gray-200 mx-1" />

        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider line"
        >
          <Minus size={14} />
        </ToolBtn>

        {/* Divider */}
        <span className="w-px h-4 bg-gray-200 mx-1" />

        <ToolBtn
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo (Cmd+Z)"
        >
          <Undo size={14} />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo size={14} />
        </ToolBtn>

      </div>

      {/* Editor content area */}
      <div className="min-h-[200px] px-4 py-3 text-sm text-gray-800 cursor-text"
           onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>

    </div>
  );
}