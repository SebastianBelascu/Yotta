'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  List, 
  ListOrdered, 
  Link, 
  Type,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Undo,
  Redo,
  RemoveFormatting,
  Subscript,
  Superscript,
  Palette
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
  
  // Track editor history
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  // Save content to history
  const saveToHistory = useCallback((content: string) => {
    setHistory(prev => {
      // If we're not at the end of the history, truncate it
      const newHistory = historyIndex < prev.length - 1 
        ? prev.slice(0, historyIndex + 1) 
        : prev;
      
      // Only add to history if content is different from last entry
      if (newHistory.length === 0 || newHistory[newHistory.length - 1] !== content) {
        return [...newHistory, content];
      }
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Handle content changes
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      saveToHistory(content);
    }
  }, [onChange, saveToHistory]);

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
    
    // Check for current block format
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const parentElement = selection.getRangeAt(0).startContainer.parentElement;
      if (parentElement) {
        const tagName = parentElement.tagName.toLowerCase();
        
        // Reset all heading states
        ['paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(t => {
          newActiveStates[t] = false;
        });
        
        // Set the active state for the current tag
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
          newActiveStates[tagName] = true;
        } else {
          newActiveStates.paragraph = true;
        }
      }
    }
    
    setIsActive(prev => ({ ...prev, ...newActiveStates }));
  }, []);

  // Handle selection change to update toolbar states
  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveStates();
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [updateActiveStates]);

  // Insert link
  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  }, [execCommand]);

  // Insert horizontal rule
  const insertHorizontalRule = useCallback(() => {
    execCommand('insertHorizontalRule');
  }, [execCommand]);

  // Remove formatting
  const removeFormatting = useCallback(() => {
    execCommand('removeFormat');
  }, [execCommand]);
  
  // Custom undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      
      if (editorRef.current && history[newIndex]) {
        editorRef.current.innerHTML = history[newIndex];
        onChange(history[newIndex]);
      }
    }
  }, [historyIndex, history, onChange]);
  
  // Custom redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      
      if (editorRef.current && history[newIndex]) {
        editorRef.current.innerHTML = history[newIndex];
        onChange(history[newIndex]);
      }
    }
  }, [historyIndex, history, onChange]);

  // Change text color
  const changeTextColor = useCallback(() => {
    const color = prompt('Enter color (hex, rgb, or color name):');
    if (color) {
      execCommand('foreColor', color);
    }
  }, [execCommand]);

  // Change background color
  const changeBackgroundColor = useCallback(() => {
    const color = prompt('Enter background color (hex, rgb, or color name):');
    if (color) {
      execCommand('backColor', color);
    }
  }, [execCommand]);

  // Format block (headings, paragraphs)
  const formatBlock = useCallback((tag: string) => {
    // Focus the editor first
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // Make sure tag has proper format with angle brackets
    const formattedTag = tag.startsWith('<') ? tag : `<${tag}>`;
    
    // Execute the format command directly
    document.execCommand('formatBlock', false, formattedTag);
    
    // Update active states for headings
    const headingStates: Record<string, boolean> = {};
    ['paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(t => {
      headingStates[t] = t === tag;
    });
    setIsActive(prev => ({ ...prev, ...headingStates }));
    
    // Update the editor content
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

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
        {/* Undo/Redo */}
        <ToolbarButton
          onClick={handleUndo}
          icon={Undo}
          title="Undo"
        />
        <ToolbarButton
          onClick={handleRedo}
          icon={Redo}
          title="Redo"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Paragraph Format */}
        <ToolbarButton
          onClick={() => formatBlock('p')}
          icon={Type}
          title="Normal Text"
          isActive={isActive.paragraph}
        />
        
        {/* Heading Buttons */}
        <ToolbarButton
          onClick={() => formatBlock('h1')}
          icon={Heading1}
          title="Heading 1"
          isActive={isActive.h1}
        />
        <ToolbarButton
          onClick={() => formatBlock('h2')}
          icon={Heading2}
          title="Heading 2"
          isActive={isActive.h2}
        />
        <ToolbarButton
          onClick={() => formatBlock('h3')}
          icon={Heading3}
          title="Heading 3"
          isActive={isActive.h3}
        />
        <ToolbarButton
          onClick={() => formatBlock('h4')}
          icon={Heading4}
          title="Heading 4"
          isActive={isActive.h4}
        />
        <ToolbarButton
          onClick={() => formatBlock('h5')}
          icon={Heading5}
          title="Heading 5"
          isActive={isActive.h5}
        />
        <ToolbarButton
          onClick={() => formatBlock('h6')}
          icon={Heading6}
          title="Heading 6"
          isActive={isActive.h6}
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Text Style */}
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
        <ToolbarButton
          onClick={() => execCommand('strikeThrough')}
          icon={Strikethrough}
          title="Strikethrough"
          isActive={isActive.strikeThrough}
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Alignment */}
        <ToolbarButton
          onClick={() => execCommand('justifyLeft')}
          icon={AlignLeft}
          title="Align Left"
          isActive={isActive.justifyLeft}
        />
        <ToolbarButton
          onClick={() => execCommand('justifyCenter')}
          icon={AlignCenter}
          title="Align Center"
          isActive={isActive.justifyCenter}
        />
        <ToolbarButton
          onClick={() => execCommand('justifyRight')}
          icon={AlignRight}
          title="Align Right"
          isActive={isActive.justifyRight}
        />
        <ToolbarButton
          onClick={() => execCommand('justifyFull')}
          icon={AlignJustify}
          title="Justify"
          isActive={isActive.justifyFull}
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Lists */}
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
        
        {/* Special Formatting */}
        <ToolbarButton
          onClick={() => formatBlock('blockquote')}
          icon={Quote}
          title="Blockquote"
        />
        <ToolbarButton
          onClick={() => formatBlock('pre')}
          icon={Code}
          title="Code Block"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Subscript/Superscript */}
        <ToolbarButton
          onClick={() => execCommand('subscript')}
          icon={Subscript}
          title="Subscript"
          isActive={isActive.subscript}
        />
        <ToolbarButton
          onClick={() => execCommand('superscript')}
          icon={Superscript}
          title="Superscript"
          isActive={isActive.superscript}
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Colors */}
        <ToolbarButton
          onClick={changeTextColor}
          icon={Palette}
          title="Text Color"
        />
        <button
          type="button"
          onClick={changeBackgroundColor}
          title="Background Color"
          className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
        >
          <div className="w-4 h-4 border border-gray-400 bg-yellow-200 rounded"></div>
        </button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Insert Elements */}
        <ToolbarButton
          onClick={insertLink}
          icon={Link}
          title="Insert Link"
        />
        <ToolbarButton
          onClick={insertHorizontalRule}
          icon={Minus}
          title="Insert Horizontal Line"
        />
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        {/* Remove Formatting */}
        <ToolbarButton
          onClick={removeFormatting}
          icon={RemoveFormatting}
          title="Remove Formatting"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => {
          setIsActive(prev => ({ ...prev, focused: true }));
          // Save initial state to history if empty
          if (history.length === 0) {
            saveToHistory(editorRef.current?.innerHTML || '');
          }
        }}
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
        .rich-text-editor h1 { font-size: 2em; font-weight: bold; margin: 1em 0 0.5em; }
        .rich-text-editor h2 { font-size: 1.5em; font-weight: bold; margin: 1em 0 0.5em; }
        .rich-text-editor h3 { font-size: 1.25em; font-weight: bold; margin: 1em 0 0.5em; }
        .rich-text-editor h4 { font-size: 1.1em; font-weight: bold; margin: 1em 0 0.5em; }
        .rich-text-editor h5 { font-size: 1em; font-weight: bold; margin: 1em 0 0.5em; }
        .rich-text-editor h6 { font-size: 0.9em; font-weight: bold; margin: 1em 0 0.5em; }
        
        /* Blockquote */
        .rich-text-editor blockquote { 
          margin: 1em 0; 
          padding: 0.5em 1em; 
          border-left: 4px solid #3b82f6; 
          background-color: #f8fafc; 
          font-style: italic;
        }
        
        /* Code blocks */
        .rich-text-editor pre { 
          background-color: #f1f5f9; 
          border: 1px solid #e2e8f0; 
          border-radius: 4px; 
          padding: 1em; 
          margin: 1em 0; 
          font-family: 'Courier New', monospace; 
          overflow-x: auto;
          white-space: pre-wrap;
        }
        
        /* Inline code */
        .rich-text-editor code { 
          background-color: #f1f5f9; 
          border: 1px solid #e2e8f0; 
          border-radius: 2px; 
          padding: 0.2em 0.4em; 
          font-family: 'Courier New', monospace; 
          font-size: 0.9em;
        }
        
        /* Horizontal rule */
        .rich-text-editor hr { 
          border: none; 
          border-top: 2px solid #e2e8f0; 
          margin: 2em 0; 
        }
        
        /* Text alignment */
        .rich-text-editor [style*="text-align: left"] { text-align: left !important; }
        .rich-text-editor [style*="text-align: center"] { text-align: center !important; }
        .rich-text-editor [style*="text-align: right"] { text-align: right !important; }
        .rich-text-editor [style*="text-align: justify"] { text-align: justify !important; }
        
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
        .rich-text-editor strike, .rich-text-editor s { text-decoration: line-through !important; }
        .rich-text-editor sub { vertical-align: sub !important; font-size: smaller !important; }
        .rich-text-editor sup { vertical-align: super !important; font-size: smaller !important; }
        
        /* Links */
        .rich-text-editor a { color: #3b82f6 !important; text-decoration: underline !important; }
      `}</style>
    </div>
  );
}
