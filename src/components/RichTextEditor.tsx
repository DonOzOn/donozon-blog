'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button, Divider, Space, Tooltip } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  LinkOutlined,
  FileImageOutlined,
} from '@ant-design/icons';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Write your content here...',
  height = 400,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !isInternalUpdate) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isInternalUpdate]);

  // Set up mutation observer to watch for dynamically added images
  useEffect(() => {
    if (!editorRef.current) return;

    const resizeImages = () => {
      const images = editorRef.current?.querySelectorAll('img');
      images?.forEach((img) => {
        // Remove any inline styles that might override our CSS
        img.removeAttribute('width');
        img.removeAttribute('height');
        img.style.width = '';
        img.style.height = '';
        
        // Apply our responsive styles
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '8px 0';
        img.style.borderRadius = '4px';
      });
    };

    // Initial resize
    resizeImages();

    // Set up mutation observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if any added nodes contain images
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'IMG') {
                // Direct image element
                const img = element as HTMLImageElement;
                img.removeAttribute('width');
                img.removeAttribute('height');
                img.style.width = '';
                img.style.height = '';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.margin = '8px 0';
                img.style.borderRadius = '4px';
              } else {
                // Check for images within the added element
                const images = element.querySelectorAll('img');
                images.forEach((img) => {
                  img.removeAttribute('width');
                  img.removeAttribute('height');
                  img.style.width = '';
                  img.style.height = '';
                  img.style.maxWidth = '100%';
                  img.style.height = 'auto';
                  img.style.display = 'block';
                  img.style.margin = '8px 0';
                  img.style.borderRadius = '4px';
                });
              }
            }
          });
        }
      });
    });

    observer.observe(editorRef.current, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);


  const handleInput = () => {
    if (editorRef.current && onChange && !isInternalUpdate) {
      setIsInternalUpdate(true);
      
      // Process any pasted images to ensure they fit within the container
      const images = editorRef.current.querySelectorAll('img');
      images.forEach((img) => {
        // Remove any inline width/height styles that might override our CSS
        img.removeAttribute('width');
        img.removeAttribute('height');
        img.style.width = '';
        img.style.height = '';
        
        // Ensure our responsive styles are applied
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '8px 0';
        img.style.borderRadius = '4px';
      });
      
      const content = editorRef.current.innerHTML;
      onChange(content);
      // Reset the flag after a small delay to prevent infinite loops
      setTimeout(() => setIsInternalUpdate(false), 10);
    }
  };

  // Handle paste events to process pasted images
  const handlePaste = (e: React.ClipboardEvent) => {
    // Allow default paste behavior first
    setTimeout(() => {
      handleInput(); // This will process any pasted images
    }, 10);
  };

  // Trigger change on blur to ensure form validation works
  const handleBlur = () => {
    if (editorRef.current && onChange) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const execCommand = (command: string, value: any = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', tag);
  };

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden" style={{ maxWidth: '100%' }}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2">
        <Space wrap>
          <Space.Compact>
            <Tooltip title="Bold (Ctrl+B)">
              <Button
                size="small"
                icon={<BoldOutlined />}
                onClick={() => execCommand('bold')}
              />
            </Tooltip>
            <Tooltip title="Italic (Ctrl+I)">
              <Button
                size="small"
                icon={<ItalicOutlined />}
                onClick={() => execCommand('italic')}
              />
            </Tooltip>
            <Tooltip title="Underline (Ctrl+U)">
              <Button
                size="small"
                icon={<UnderlineOutlined />}
                onClick={() => execCommand('underline')}
              />
            </Tooltip>
          </Space.Compact>

          <Divider type="vertical" />

          <Space.Compact>
            <Tooltip title="Heading 1">
              <Button
                size="small"
                onClick={() => formatBlock('h1')}
              >
                H1
              </Button>
            </Tooltip>
            <Tooltip title="Heading 2">
              <Button
                size="small"
                onClick={() => formatBlock('h2')}
              >
                H2
              </Button>
            </Tooltip>
            <Tooltip title="Heading 3">
              <Button
                size="small"
                onClick={() => formatBlock('h3')}
              >
                H3
              </Button>
            </Tooltip>
            <Tooltip title="Paragraph">
              <Button
                size="small"
                onClick={() => formatBlock('p')}
              >
                P
              </Button>
            </Tooltip>
          </Space.Compact>

          <Divider type="vertical" />

          <Space.Compact>
            <Tooltip title="Align Left">
              <Button
                size="small"
                icon={<AlignLeftOutlined />}
                onClick={() => execCommand('justifyLeft')}
              />
            </Tooltip>
            <Tooltip title="Align Center">
              <Button
                size="small"
                icon={<AlignCenterOutlined />}
                onClick={() => execCommand('justifyCenter')}
              />
            </Tooltip>
            <Tooltip title="Align Right">
              <Button
                size="small"
                icon={<AlignRightOutlined />}
                onClick={() => execCommand('justifyRight')}
              />
            </Tooltip>
          </Space.Compact>

          <Divider type="vertical" />

          <Space.Compact>
            <Tooltip title="Bulleted List">
              <Button
                size="small"
                icon={<UnorderedListOutlined />}
                onClick={() => execCommand('insertUnorderedList')}
              />
            </Tooltip>
            <Tooltip title="Numbered List">
              <Button
                size="small"
                icon={<OrderedListOutlined />}
                onClick={() => execCommand('insertOrderedList')}
              />
            </Tooltip>
          </Space.Compact>

          <Divider type="vertical" />

          <Space.Compact>
            <Tooltip title="Insert Link">
              <Button
                size="small"
                icon={<LinkOutlined />}
                onClick={insertLink}
              />
            </Tooltip>
            <Tooltip title="Insert Image">
              <Button
                size="small"
                icon={<FileImageOutlined />}
                onClick={insertImage}
              />
            </Tooltip>
          </Space.Compact>
        </Space>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onBlur={handleBlur}
        className="p-4 focus:outline-none overflow-hidden"
        style={{ 
          minHeight: height,
          fontSize: '16px',
          lineHeight: '1.6',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        .rich-text-editor {
          max-width: 100%;
          overflow: hidden;
        }
        
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #999;
          cursor: text;
        }
        
        .rich-text-editor h1 {
          font-size: 2em;
          font-weight: 600;
          margin: 16px 0 8px 0;
        }
        
        .rich-text-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 16px 0 8px 0;
        }
        
        .rich-text-editor h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 16px 0 8px 0;
        }
        
        .rich-text-editor p {
          margin: 8px 0;
        }
        
        .rich-text-editor ul,
        .rich-text-editor ol {
          margin: 8px 0;
          padding-left: 24px;
        }
        
        .rich-text-editor li {
          margin: 4px 0;
        }
        
        .rich-text-editor img {
          max-width: 100% !important;
          width: auto !important;
          height: auto !important;
          display: block;
          border-radius: 4px;
          margin: 8px 0;
          object-fit: contain;
        }
        
        /* Ensure pasted images are properly sized */
        .rich-text-editor [contenteditable] img {
          max-width: 100% !important;
          width: auto !important;
          height: auto !important;
        }
        
        /* Prevent any content from breaking the container */
        .rich-text-editor [contenteditable] {
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          max-width: 100%;
        }
        
        .rich-text-editor a {
          color: #1890ff;
          text-decoration: underline;
        }
        
        .rich-text-editor a:hover {
          text-decoration: none;
        }
        
        .rich-text-editor strong,
        .rich-text-editor b {
          font-weight: 600;
        }
        
        .rich-text-editor em,
        .rich-text-editor i {
          font-style: italic;
        }
        
        .rich-text-editor u {
          text-decoration: underline;
        }
        
        .rich-text-editor blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 16px;
          margin: 16px 0;
          font-style: italic;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
