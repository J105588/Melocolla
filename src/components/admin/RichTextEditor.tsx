'use client'

import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
import { Eye, Edit3 } from 'lucide-react'

// Dynamic import with SSR disabled is mandatory for Quill in Next.js
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new')
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />
  },
  {
    ssr: false,
    loading: () => (
      <div className="h-48 w-full bg-brand/5 animate-pulse rounded-xl flex items-center justify-center text-[10px] tracking-widest text-brand/30">
        INITIALIZING EDITOR...
      </div>
    ),
  }
)

interface RichTextEditorProps {
  initialValue: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ initialValue, onChange, placeholder }: RichTextEditorProps) {
  const [value, setValue] = useState(initialValue)
  const [isPreview, setIsPreview] = useState(false)

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['clean'],
    ],
  }), [])

  const handleChange = (content: string) => {
    setValue(content)
    onChange(content)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-bold tracking-widest text-brand/40 uppercase">Content Report</label>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/5 border border-brand/10 text-[9px] font-bold tracking-widest text-brand hover:bg-brand/10 transition-all"
        >
          {isPreview ? (
            <>
              <Edit3 size={12} className="text-accent-gold" />
              SWITCH TO EDIT
            </>
          ) : (
            <>
              <Eye size={12} className="text-accent-gold" />
              SWITCH TO PREVIEW
            </>
          )}
        </button>
      </div>

      <div className="relative">
        {!isPreview ? (
          <div className="quill-wrapper rounded-xl overflow-hidden bg-brand/5 border border-transparent focus-within:border-accent-gold/30 transition-all">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={handleChange}
              modules={modules}
              placeholder={placeholder || 'Write your activity report here...'}
              className="bg-transparent text-sm"
            />
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-white border border-brand/5 shadow-inner min-h-[12rem]">
            {/* Same styling as the Activity card to ensure accurate preview */}
            <div 
              className="markdown-content text-brand/60 leading-relaxed text-sm lg:text-base whitespace-pre-wrap prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: value || '<p className="text-brand/20 italic">No content to preview...</p>' }}
            />
          </div>
        )}
      </div>

      {/* Global Quill Overrides */}
      <style jsx global>{`
        .ql-container {
          font-family: inherit !important;
          font-size: 0.875rem !important;
          min-height: 200px;
        }
        .ql-editor {
          min-height: 200px;
          line-height: 1.6;
          color: #603E44;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid rgba(96, 62, 68, 0.05) !important;
          background: rgba(96, 62, 68, 0.02);
        }
        .ql-container.ql-snow {
          border: none !important;
        }
        .ql-editor.ql-blank::before {
          color: rgba(96, 62, 68, 0.3) !important;
          font-style: normal !important;
          left: 15px !important;
        }
        
        /* Indentation levels */
        .ql-indent-1 { padding-left: 2rem !important; }
        .ql-indent-2 { padding-left: 4rem !important; }
        .ql-indent-3 { padding-left: 6rem !important; }
        .ql-indent-4 { padding-left: 8rem !important; }
        .ql-indent-5 { padding-left: 10rem !important; }
        .ql-indent-6 { padding-left: 12rem !important; }
        .ql-indent-7 { padding-left: 14rem !important; }
        .ql-indent-8 { padding-left: 16rem !important; }
        
        /* List positioning */
        .ql-editor ol, .ql-editor ul {
          padding-left: 1.5rem !important;
        }
      `}</style>
    </div>
  )
}
