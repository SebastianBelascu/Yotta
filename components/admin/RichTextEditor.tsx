'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Type,
  Heading1,
  Heading2
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your blog post...",
  className = "",
  error 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState<Record<string, boolean>>({});

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  // Exec command wrapper - improved to work with single click
  const execCommand = useCallback((command: string, value: string = '') => {
    // Focus the editor first to ensure commands work with a single click
    if (editorRef.current) {
      // Save current selection
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      
      // Focus the editor
      editorRef.current.focus();
      
      // Restore selection if it was outside the editor
      if (document.activeElement !== editorRef.current && range) {
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      
      // Execute command immediately
      document.execCommand(command, false, value);
      
      // Update active state for certain commands
      if (['bold', 'italic', 'underline'].includes(command)) {
        setIsActive(prev => ({
          ...prev,
          [command]: document.queryCommandState(command)
        }));
      }
      
      // Special case for lists
      if (['insertUnorderedList', 'insertOrderedList'].includes(command)) {
        setIsActive(prev => ({
          ...prev,
          insertUnorderedList: document.queryCommandState('insertUnorderedList'),
          insertOrderedList: document.queryCommandState('insertOrderedList')
        }));
      }
      
      // Get updated content
      const newValue = editorRef.current.innerHTML;
      onChange(newValue);
    }
  }, [onChange]);

  // Update active states for toolbar buttons
  const updateActiveStates = useCallback(() => {
    const commands = ['bold', 'italic', 'underline', 'insertOrderedList', 'insertUnorderedList'];
    const newActiveStates: Record<string, boolean> = {};
    
    commands.forEach(command => {
      newActiveStates[command] = document.queryCommandState(command);
    });
    
    setIsActive(newActiveStates);
  }, []);

  // Handle selection change to update toolbar states
  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveStates();
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [updateActiveStates]);

  // Insert link
  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  // Format block (headings, paragraphs)
  const formatBlock = useCallback((tag: string) => {
    execCommand('formatBlock', tag);
  }, [execCommand]);

  // Toolbar button component
  const ToolbarButton = ({ 
    onClick, 
    icon: Icon, 
    title, 
    isActive: active = false,
    className: btnClassName = ""
  }: {
    onClick: () => void;
    icon: React.ComponentType<any>;
    title: string;
    isActive?: boolean;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
      } ${btnClassName}`}
    >
      <Icon size={16} />
    </button>
  );



  return (
    <div className={`border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50 flex-wrap">
        <ToolbarButton
          onClick={() => formatBlock('p')}
          icon={Type}
          title="Paragraph"
        />
        <ToolbarButton
          onClick={() => formatBlock('h1')}
          icon={Heading1}
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() => formatBlock('h2')}
          icon={Heading2}
          title="Heading 2"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <ToolbarButton
          onClick={() => execCommand('bold')}
          icon={Bold}
          title="Bold"
          isActive={isActive.bold}
        />
        <ToolbarButton
          onClick={() => execCommand('italic')}
          icon={Italic}
          title="Italic"
          isActive={isActive.italic}
        />
        <ToolbarButton
          onClick={() => execCommand('underline')}
          icon={Underline}
          title="Underline"
          isActive={isActive.underline}
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <ToolbarButton
          onClick={() => execCommand('insertUnorderedList')}
          icon={List}
          title="Bullet List"
          isActive={isActive.insertUnorderedList}
        />
        <ToolbarButton
          onClick={() => execCommand('insertOrderedList')}
          icon={ListOrdered}
          title="Numbered List"
          isActive={isActive.insertOrderedList}
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <ToolbarButton
          onClick={insertLink}
          icon={Link}
          title="Insert Link"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsActive(prev => ({ ...prev, focused: true }))}
        onBlur={() => setIsActive(prev => ({ ...prev, focused: false }))}
        className="min-h-[300px] p-4 outline-none rich-text-editor"
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
      
      {error && (
        <div className="flex items-center gap-2 p-2 text-red-600 text-sm border-t bg-red-50">
          <span>{error}</span>
        </div>
      )}
      
      {/* Word count */}
      <div className="flex justify-between items-center p-2 text-xs text-gray-500 border-t bg-gray-50">
        <span>
          Words: {(() => {
            if (!value) return 0;
            const plainText = value.replace(/<[^>]*>/g, '');
            return plainText.split(/\s+/).filter(word => word.trim().length > 0).length;
          })()}
        </span>
        <span>
          Characters: {(() => {
            if (!value) return 0;
            const plainText = value.replace(/<[^>]*>/g, '');
            return plainText.length;
          })()}
        </span>
      </div>

      <style jsx global>{`
        /* Rich Text Editor Styles */
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        /* Editor container */
        .rich-text-editor {
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.5;
        }
        
        /* Paragraph and headings */
        .rich-text-editor p { margin: 0.75em 0; }
        .rich-text-editor h1 { font-size: 1.8em; font-weight: bold; margin: 1em 0 0.5em; }
        .rich-text-editor h2 { font-size: 1.5em; font-weight: bold; margin: 1em 0 0.5em; }
        .rich-text-editor h3 { font-size: 1.25em; font-weight: bold; margin: 1em 0 0.5em; }
        .rich-text-editor h4 { font-size: 1.1em; font-weight: bold; margin: 1em 0 0.5em; }
        
        /* Improved list formatting */
        .rich-text-editor ul { 
          list-style-type: disc !important; 
          margin: 0.75em 0; 
          padding-left: 2em; 
          display: block;
        }
        
        .rich-text-editor ol { 
          list-style-type: decimal !important; 
          margin: 0.75em 0; 
          padding-left: 2em; 
          display: block;
        }
        
        .rich-text-editor li { 
          margin: 0.25em 0; 
          display: list-item !important;
        }
        
        .rich-text-editor li > ul, 
        .rich-text-editor li > ol { 
          margin: 0.25em 0; 
        }
        
        /* Basic text formatting */
        .rich-text-editor b, .rich-text-editor strong { font-weight: bold !important; }
        .rich-text-editor i, .rich-text-editor em { font-style: italic !important; }
        .rich-text-editor u { text-decoration: underline !important; }
        
        /* Links */
        .rich-text-editor a { color: #3b82f6 !important; text-decoration: underline !important; }
      `}</style>
    </div>
  );
}
