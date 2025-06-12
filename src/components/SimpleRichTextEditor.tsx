'use client';

import React, { useRef, useEffect } from 'react';
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

interface SimpleRichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
}

const SimpleRichTextEditor: React.FC<SimpleRichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Write your content here...',
  height = 400,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
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
    <div className="simple-rich-text-editor border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2">
        <Space wrap>
          <Space.Compact>
            <Tooltip title="Bold">
              <Button
                size="small"
                icon={<BoldOutlined />}
                onClick={() => execCommand('bold')}
              />
            </Tooltip>
            <Tooltip title="Italic">
              <Button
                size="small"
                icon={<ItalicOutlined />}
                onClick={() => execCommand('italic')}
              />
            </Tooltip>
            <Tooltip title="Underline">
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
        className="p-4 focus:outline-none"
        style={{ 
          minHeight: height,
          fontSize: '16px',
          lineHeight: '1.6',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #999;
          cursor: text;
        }
        
        .simple-rich-text-editor h1 {
          font-size: 2em;
          font-weight: 600;
          margin: 16px 0 8px 0;
        }
        
        .simple-rich-text-editor h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 16px 0 8px 0;
        }
        
        .simple-rich-text-editor h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 16px 0 8px 0;
        }
        
        .simple-rich-text-editor p {
          margin: 8px 0;
        }
        
        .simple-rich-text-editor ul,
        .simple-rich-text-editor ol {
          margin: 8px 0;
          padding-left: 24px;
        }
        
        .simple-rich-text-editor li {
          margin: 4px 0;
        }
        
        .simple-rich-text-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 8px 0;
        }
        
        .simple-rich-text-editor a {
          color: #1890ff;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default SimpleRichTextEditor;
