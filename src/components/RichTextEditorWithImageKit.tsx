'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button, Divider, Space, Tooltip, message } from 'antd';
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
  LoadingOutlined,
} from '@ant-design/icons';
import { uploadImageViaAPI, deleteImageViaAPI, isImageKitUrl } from '@/lib/imagekit';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  articleId?: string; // For tracking images per article
}

const RichTextEditorWithImageKit: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Write your content here...',
  height = 400,
  articleId,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      
      // Track image removal (no deletion during editing)
      handleImageTracking(content);
      
      // Reset the flag after a small delay to prevent infinite loops
      setTimeout(() => setIsInternalUpdate(false), 10);
    }
  };

  // Track removed images for display purposes only - NO automatic deletion
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [previousContent, setPreviousContent] = useState(value);

  const handleImageTracking = (newContent: string) => {
    try {
      if (!previousContent) {
        setPreviousContent(newContent);
        return;
      }

      // Extract ImageKit URLs from previous and new content
      const previousUrls = extractImageKitUrls(previousContent);
      const currentUrls = extractImageKitUrls(newContent);
      
      // Find URLs that were removed
      const removedUrls = previousUrls.filter(url => !currentUrls.includes(url));
      
      if (removedUrls.length > 0) {
        console.log(`📝 Rich Text Editor: Detected ${removedUrls.length} images removed from content (will be cleaned up on save):`, removedUrls);
        setRemovedImages(prev => [...new Set([...prev, ...removedUrls])]);
        
        // Show user-friendly message about cleanup
        message.info({
          content: `${removedUrls.length} image(s) removed. They will be cleaned up when you save the article.`,
          duration: 3,
        });
      }
      
      setPreviousContent(newContent);
    } catch (error) {
      console.error('Error tracking image removal:', error);
    }
  };

  // Helper function to extract ImageKit URLs
  const extractImageKitUrls = (content: string): string[] => {
    if (!content) return [];
    const regex = /https:\/\/ik\.imagekit\.io\/[^"'\s)]+/g;
    return content.match(regex) || [];
  };


  // Enhanced paste handler for ImageKit integration
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    
    if (imageItem) {
      e.preventDefault();
      
      const file = imageItem.getAsFile();
      if (file) {
        await handleImageUpload(file);
      }
      return;
    }

    // Allow default paste behavior for non-images
    setTimeout(() => {
      handleInput(); // This will process any pasted content
    }, 10);
  };

  // Handle image file upload to ImageKit
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      // Create a temporary placeholder
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        padding: 20px;
        border: 2px dashed #d1d5db;
        border-radius: 8px;
        text-align: center;
        margin: 8px 0;
        background: #f9fafb;
      `;
      placeholder.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span style="color: #6b7280;">📤 Uploading image...</span>
        </div>
      `;

      // Insert placeholder at cursor position
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(placeholder);
        range.collapse(false);
      } else if (editorRef.current) {
        editorRef.current.appendChild(placeholder);
      }

      // Upload to ImageKit
      const uploadResult = await uploadImageViaAPI(file, articleId);

      // Replace placeholder with actual image
      const img = document.createElement('img');
      img.src = uploadResult.url;
      img.alt = uploadResult.name;
      img.style.cssText = `
        max-width: 100%;
        height: auto;
        display: block;
        margin: 8px 0;
        border-radius: 4px;
      `;

      placeholder.parentNode?.replaceChild(img, placeholder);

      // Trigger change event
      handleInput();
      
      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Image upload failed:', error);
      
      // Remove placeholder on error
      const placeholders = editorRef.current?.querySelectorAll('div[style*="border: 2px dashed"]');
      placeholders?.forEach(p => p.remove());
      
      message.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
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

  const insertImageFromFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', tag);
  };

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg overflow-hidden" style={{ maxWidth: '100%' }}>
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

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
            <Tooltip title="Upload Image (or paste/drag)">
              <Button
                size="small"
                icon={uploading ? <LoadingOutlined /> : <FileImageOutlined />}
                onClick={insertImageFromFile}
                disabled={uploading}
              />
            </Tooltip>
            {removedImages.length > 0 && (
              <Tooltip title={`${removedImages.length} image(s) will be cleaned up on save`}>
                <Button
                  size="small"
                  type="link"
                  style={{ color: '#f59e0b' }}
                >
                  🗑️ {removedImages.length}
                </Button>
              </Tooltip>
            )}
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
        data-placeholder={uploading ? 'Uploading image...' : placeholder}
        suppressContentEditableWarning={true}
        onDrop={async (e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          const imageFile = files.find(file => file.type.startsWith('image/'));
          if (imageFile) {
            await handleImageUpload(imageFile);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
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

export default RichTextEditorWithImageKit;
