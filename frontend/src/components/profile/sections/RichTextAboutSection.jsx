import { useRef, useState } from 'react';
import { Bold, Italic, Underline, List } from 'lucide-react';
import { getTheme } from '../../../utils/theme';

function isEmpty(html) {
  if (!html) return true;
  return html.replace(/<[^>]*>/g, '').trim().length === 0;
}

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`w-8 h-8 rounded-md flex items-center justify-center cursor-pointer border transition text-sm ${active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>
      {children}
    </button>
  );
}

export default function RichTextAboutSection({ profile, isCandidate, onSave }) {
  const theme     = getTheme(isCandidate ? 'candidate' : 'company');
  const editorRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(profile?.bio || '');
  const [saving,  setSaving]  = useState(false);
  const [formats, setFormats] = useState({ bold: false, italic: false, underline: false });

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
    editorRef.current?.focus();
    updateFormatState();
  };

  const updateFormatState = () => {
    setFormats({
      bold:      document.queryCommandState('bold'),
      italic:    document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  };

  const handleInput = () => {
    if (editorRef.current) setContent(editorRef.current.innerHTML);
    updateFormatState();
  };

  const handleOpenEdit = () => {
    setEditing(true);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        editorRef.current.focus();
      }
    }, 50);
  };

  const handleSave = async () => {
    const html = editorRef.current?.innerHTML || '';
    setSaving(true);
    await onSave({ bio: html });
    setContent(html);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setContent(profile?.bio || '');
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sora font-bold text-gray-900 text-lg">About</h2>
        {!editing && (
          <button onClick={handleOpenEdit} className={`text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${theme.buttonLight}`}>
            Edit
          </button>
        )}
      </div>

      {!editing ? (
        <div>
          {isEmpty(profile?.bio)
            ? <em className="text-sm text-gray-300">No about section yet. Click Edit to add.</em>
            : <div className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: profile?.bio }} />
          }
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-1.5 p-2 bg-gray-50 border border-gray-200 border-b-0 rounded-t-lg">
            <ToolbarButton onClick={() => applyFormat('bold')}      active={formats.bold}      title="Bold">      <Bold      size={14} /></ToolbarButton>
            <ToolbarButton onClick={() => applyFormat('italic')}    active={formats.italic}    title="Italic">    <Italic    size={14} /></ToolbarButton>
            <ToolbarButton onClick={() => applyFormat('underline')} active={formats.underline} title="Underline"> <Underline size={14} /></ToolbarButton>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <ToolbarButton onClick={() => applyFormat('insertUnorderedList')} active={false} title="Bullet list"><List size={14} /></ToolbarButton>
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyUp={updateFormatState}
            onMouseUp={updateFormatState}
            className="w-full min-h-28 px-3.5 py-2.5 border border-gray-200 rounded-b-lg text-sm text-gray-800 outline-none"
          />

          <p className="text-xs text-gray-300 mt-1.5">Select text and use toolbar to format.</p>

          <div className="flex gap-2 justify-end mt-3">
            <button onClick={handleCancel} className="px-4 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} disabled={saving} className={`px-4 py-2 text-sm text-white rounded-lg border-none cursor-pointer ${theme.button}`}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}