"use client";
import React, { useState, useEffect } from "react";
import { NotionRenderer } from "react-notion-x";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blocksToMarkdown } from '../../../lib/notion';

// Helper function to render rich text with formatting
const renderRichText = (richTextArray, className = "") => {
  if (!richTextArray || richTextArray.length === 0) return null;
  
  return richTextArray.map((text, idx) => {
    if (!text) return null;
    
    let content = text.plain_text || '';
    const annotations = text.annotations || {};
    
    // Handle links
    if (text.href) {
      content = (
        <a 
          key={idx}
          href={text.href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 underline"
        >
          {content}
        </a>
      );
    } else {
      content = <span key={idx}>{content}</span>;
    }
    
    // Apply formatting annotations
    if (annotations.bold) {
      content = <strong key={`bold-${idx}`} className="font-bold">{content}</strong>;
    }
    if (annotations.italic) {
      content = <em key={`italic-${idx}`} className="italic">{content}</em>;
    }
    if (annotations.strikethrough) {
      content = <s key={`strike-${idx}`} className="line-through">{content}</s>;
    }
    if (annotations.underline) {
      content = <u key={`underline-${idx}`} className="underline">{content}</u>;
    }
    if (annotations.code) {
      content = (
        <code key={`code-${idx}`} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground border">
          {text.plain_text}
        </code>
      );
    }
    
    // Handle color
    if (annotations.color && annotations.color !== 'default') {
      const colorClass = {
        'gray': 'text-gray-500',
        'brown': 'text-amber-700',
        'orange': 'text-orange-500',
        'yellow': 'text-yellow-500',
        'green': 'text-green-500',
        'blue': 'text-blue-500',
        'purple': 'text-purple-500',
        'pink': 'text-pink-500',
        'red': 'text-red-500',
      }[annotations.color] || 'text-foreground';
      
      content = <span key={`color-${idx}`} className={colorClass}>{content}</span>;
    }
    
    return content;
  });
};

// Enhanced block renderer with full markdown support
const renderMarkdownBlock = (block, index = 0) => {
  const { type } = block;
  const blockData = block[type] || {};
  
  switch (type) {
    case 'paragraph':
      const paragraphContent = renderRichText(blockData.rich_text, "text-foreground");
      const plainText = blockData.rich_text?.map(t => t.plain_text).join('') || '';
      
      // Skip empty paragraphs
      if (!paragraphContent && !plainText) {
        return null;
      }
      
      // Check if content looks like markdown (contains markdown syntax)
      const hasMarkdownSyntax = /[*_`#\[\]()~]/.test(plainText) && plainText.length > 10;
      
      if (hasMarkdownSyntax && !blockData.rich_text?.some(t => t.annotations?.code)) {
        return (
          <div key={block.id} className="mb-4 prose prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({node, ...props}) => <p className="text-foreground leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                em: ({node, ...props}) => <em className="italic text-foreground" {...props} />,
                code: ({node, ...props}) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground border" {...props} />,
                a: ({node, ...props}) => <a className="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer" {...props} />
              }}
            >
              {plainText}
            </ReactMarkdown>
          </div>
        );
      }
      
      return paragraphContent ? (
        <div key={block.id} className="mb-4 text-foreground leading-relaxed">
          {paragraphContent}
        </div>
      ) : null;
      
    case 'heading_1':
      return (
        <h1 key={block.id} className="text-3xl font-bold text-foreground mt-8 mb-4 pb-2 border-b border-border">
          {renderRichText(blockData.rich_text)}
        </h1>
      );
      
    case 'heading_2':
      return (
        <h2 key={block.id} className="text-2xl font-bold text-foreground mt-6 mb-3">
          {renderRichText(blockData.rich_text)}
        </h2>
      );
      
    case 'heading_3':
      return (
        <h3 key={block.id} className="text-xl font-bold text-foreground mt-5 mb-2">
          {renderRichText(blockData.rich_text)}
        </h3>
      );
      
    case 'bulleted_list_item':
      return (
        <div key={block.id} className="flex items-start mb-2 ml-4">
          <span className="text-primary mr-3 mt-1.5 flex-shrink-0">•</span>
          <div className="text-foreground leading-relaxed">
            {renderRichText(blockData.rich_text)}
            {block.children && block.children.length > 0 && (
              <div className="mt-2 ml-4">
                {block.children.map((child, idx) => renderMarkdownBlock(child, idx))}
              </div>
            )}
          </div>
        </div>
      );
      
    case 'numbered_list_item':
      return (
        <div key={block.id} className="flex items-start mb-2 ml-4">
          <span className="text-primary mr-3 mt-0.5 flex-shrink-0">{index + 1}.</span>
          <div className="text-foreground leading-relaxed">
            {renderRichText(blockData.rich_text)}
            {block.children && block.children.length > 0 && (
              <div className="mt-2 ml-4">
                {block.children.map((child, idx) => renderMarkdownBlock(child, idx))}
              </div>
            )}
          </div>
        </div>
      );
      
    case 'code':
      const language = blockData.language || 'text';
      return (
        <div key={block.id} className="my-4">
          <div className="bg-muted/20 text-xs text-muted-foreground px-3 py-1 rounded-t border border-b-0 font-mono">
            {language}
          </div>
          <pre className="bg-muted p-4 rounded-b text-sm font-mono text-foreground overflow-x-auto border border-t-0 whitespace-pre-wrap">
            {renderRichText(blockData.rich_text)}
          </pre>
        </div>
      );
      
    case 'quote':
      return (
        <blockquote key={block.id} className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/10 rounded-r">
          <div className="text-foreground italic leading-relaxed">
            {renderRichText(blockData.rich_text)}
          </div>
        </blockquote>
      );
      
    case 'callout':
      const icon = blockData.icon?.emoji || '💡';
      return (
        <div key={block.id} className="my-4 p-4 bg-muted/20 border border-border rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{icon}</span>
            <div className="text-foreground leading-relaxed">
              {renderRichText(blockData.rich_text)}
            </div>
          </div>
        </div>
      );
      
    case 'divider':
      return <hr key={block.id} className="my-6 border-border" />;
      
    case 'image':
      const imageUrl = blockData.file?.url || blockData.external?.url;
      const caption = renderRichText(blockData.caption);
      return imageUrl ? (
        <div key={block.id} className="my-6">
          <img 
            src={imageUrl} 
            alt={caption ? caption.toString() : ''} 
            className="rounded-lg max-w-full h-auto border border-border"
          />
          {caption && (
            <div className="text-sm text-muted-foreground text-center mt-2 italic">
              {caption}
            </div>
          )}
        </div>
      ) : null;
      
    case 'bookmark':
      const bookmarkUrl = blockData.url;
      return bookmarkUrl ? (
        <div key={block.id} className="my-4">
          <a 
            href={bookmarkUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-4 border border-border rounded-lg hover:bg-muted/10 transition-colors"
          >
            <div className="text-primary hover:text-primary/80 font-medium">
              🔗 {bookmarkUrl}
            </div>
            {blockData.caption && (
              <div className="text-sm text-muted-foreground mt-1">
                {renderRichText(blockData.caption)}
              </div>
            )}
          </a>
        </div>
      ) : null;
      
    case 'table':
      return (
        <div key={block.id} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse border border-border rounded-lg">
            <tbody>
              {blockData.children?.map((row, rowIdx) => (
                <tr key={rowIdx} className={rowIdx === 0 ? 'bg-muted/20' : ''}>
                  {row.table_row?.cells?.map((cell, cellIdx) => {
                    const CellTag = rowIdx === 0 ? 'th' : 'td';
                    return (
                      <CellTag 
                        key={cellIdx} 
                        className="border border-border px-3 py-2 text-foreground text-left"
                      >
                        {renderRichText(cell)}
                      </CellTag>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      
    case 'toggle':
      return (
        <details key={block.id} className="my-3 p-3 border border-border rounded-lg">
          <summary className="cursor-pointer text-foreground font-medium hover:text-primary">
            {renderRichText(blockData.rich_text)}
          </summary>
          <div className="mt-2 pl-4 text-muted-foreground">
            {block.children?.map((child, idx) => renderMarkdownBlock(child, idx))}
          </div>
        </details>
      );
      
    case 'to_do':
      const isChecked = blockData.checked;
      return (
        <div key={block.id} className="flex items-start gap-3 my-2">
          <span className={`mt-1 ${isChecked ? 'text-green-500' : 'text-muted-foreground'}`}>
            {isChecked ? '✅' : '☐'}
          </span>
          <div className={`text-foreground leading-relaxed ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
            {renderRichText(blockData.rich_text)}
          </div>
        </div>
      );
      
    case 'equation':
      return (
        <div key={block.id} className="my-4 p-3 bg-muted/10 rounded-lg text-center">
          <code className="text-foreground font-mono">
            {blockData.expression}
          </code>
        </div>
      );
      
    default:
      // Handle unknown blocks gracefully
      if (blockData.rich_text && blockData.rich_text.length > 0) {
        return (
          <div key={block.id} className="my-2 p-3 bg-muted/5 rounded border-l-2 border-muted-foreground">
            <div className="text-xs text-muted-foreground mb-1 font-mono">
              {type.replace(/_/g, ' ').toUpperCase()}
            </div>
            <div className="text-foreground">
              {renderRichText(blockData.rich_text)}
            </div>
          </div>
        );
      }
      
      return (
        <div key={block.id} className="my-2 p-2 bg-muted/5 rounded border border-dashed border-muted-foreground">
          <div className="text-xs text-muted-foreground italic">
            Unsupported block type: {type}
          </div>
        </div>
      );
  }
};

const NotionPage = ({ recordMap, pageTitle, fallback = false }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  
  useEffect(() => {
    if (recordMap) {
      try {
        if (recordMap.demoMarkdown) {
          // Handle demo markdown content directly
          setMarkdownContent(recordMap.demoMarkdown);
        } else if (fallback && recordMap.blocks) {
          // Convert blocks to markdown for better readability
          const markdown = blocksToMarkdown(recordMap.blocks);
          setMarkdownContent(markdown || 'No content available to display.');
        } else if (recordMap.recordMap) {
          // Handle react-notion-x format if available
          setMarkdownContent(''); // Let react-notion-x handle rendering
        } else {
          setMarkdownContent('Content format not recognized.');
        }
      } catch (error) {
        console.error('Error processing Notion content:', error);
        setMarkdownContent('Error processing content. Please try refreshing or check your Notion integration.');
      } finally {
        setIsProcessing(false);
      }
    } else {
      setMarkdownContent('No content provided.');
      setIsProcessing(false);
    }
  }, [recordMap, fallback]);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mr-3"></div>
        <div className="text-[#ADB7BE]">Processing Notion content...</div>
      </div>
    );
  }

  // Handle fallback data structure with markdown rendering
  if (fallback && markdownContent) {
    return (
      <div className="notion-content-wrapper max-w-none">
        {pageTitle && (
          <h1 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-[#33353F]">
            {pageTitle}
          </h1>
        )}
        
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] border border-[#33353F] p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              📄 <span>Page Information</span>
            </h3>
            <div className="text-[#ADB7BE] space-y-1 text-sm">
              <p><strong>Created:</strong> {recordMap.page?.created_time ? new Date(recordMap.page.created_time).toLocaleDateString() : 'No date available'}</p>
              <p><strong>Last Updated:</strong> {recordMap.page?.last_edited_time ? new Date(recordMap.page.last_edited_time).toLocaleDateString() : 'No date available'}</p>
              <p><strong>Content Blocks:</strong> {recordMap.blocks ? recordMap.blocks.length : 0} items</p>
            </div>
          </div>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-8 mb-4 pb-2 border-b border-[#33353F]" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-5 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="text-[#ADB7BE] leading-relaxed mb-4" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                em: ({node, ...props}) => <em className="italic text-[#ADB7BE]" {...props} />,
                code: ({node, ...props}) => <code className="bg-[#1a1a1a] border border-[#33353F] px-1.5 py-0.5 rounded text-sm font-mono text-[#e5e7eb]" {...props} />,
                pre: ({node, ...props}) => (
                  <pre className="bg-[#1a1a1a] border border-[#33353F] p-4 rounded-lg overflow-x-auto my-4" {...props} />
                ),
                a: ({node, ...props}) => <a className="text-[#9333ea] hover:text-[#a855f7] underline" target="_blank" rel="noopener noreferrer" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-[#9333ea] bg-[#9333ea]/10 pl-4 py-2 my-4 rounded-r" {...props} />
                ),
                ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4 text-[#ADB7BE]" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4 text-[#ADB7BE]" {...props} />,
                li: ({node, ...props}) => <li className="mb-2 text-[#ADB7BE]" {...props} />,
                hr: ({node, ...props}) => <hr className="my-6 border-[#33353F]" {...props} />,
                img: ({node, ...props}) => (
                  <img className="rounded-lg max-w-full h-auto border border-[#33353F] my-4" {...props} />
                ),
                table: ({node, ...props}) => (
                  <div className="overflow-x-auto my-4">
                    <table className="w-full border-collapse border border-[#33353F] rounded-lg" {...props} />
                  </div>
                ),
                th: ({node, ...props}) => <th className="border border-[#33353F] bg-[#1a1a1a] px-3 py-2 text-white text-left font-semibold" {...props} />,
                td: ({node, ...props}) => <td className="border border-[#33353F] px-3 py-2 text-[#ADB7BE]" {...props} />,
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
          
          <div className="mt-8 p-4 bg-[#9333ea]/10 border border-[#9333ea]/30 rounded-lg">
            <p className="text-sm text-[#ADB7BE] text-center">
              ✨ <strong>Read-only Mode:</strong> This content has been converted from Notion to Markdown for optimal viewing.
              <br />
              For full editing capabilities, visit your page directly in Notion.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-content-wrapper">
      {pageTitle && (
        <h1 className="text-2xl font-bold text-foreground mb-6 pb-4 border-b border-border">
          {pageTitle}
        </h1>
      )}
      
      <div className="notion-minimal-renderer">
        <NotionRenderer 
          recordMap={recordMap}
          fullPage={false}
          darkMode={true}
          previewImages={true}
        />
      </div>
      
      <style jsx global>{`
        .notion-content-wrapper {
          background: transparent;
          color: #ADB7BE;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          line-height: 1.65;
        }
        
        .notion-minimal-renderer {
          background: transparent !important;
        }
        
        /* Dark mode styles for react-notion-x */
        .notion-minimal-renderer .notion {
          background: transparent !important;
          color: #ADB7BE !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        }
        
        .notion-minimal-renderer .notion-text {
          color: #ADB7BE !important;
          line-height: 1.6 !important;
          font-size: 16px !important;
        }
        
        .notion-minimal-renderer .notion-h-title,
        .notion-minimal-renderer .notion-h1,
        .notion-minimal-renderer .notion-h2, 
        .notion-minimal-renderer .notion-h3 {
          color: #ffffff !important;
          font-weight: 600 !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
        }
        
        .notion-minimal-renderer .notion-h-title {
          font-size: 2.5rem !important;
          border-bottom: 2px solid #33353F !important;
          padding-bottom: 0.5rem !important;
        }
        
        .notion-minimal-renderer .notion-h1 {
          font-size: 2rem !important;
        }
        
        .notion-minimal-renderer .notion-h2 {
          font-size: 1.5rem !important;
        }
        
        .notion-minimal-renderer .notion-h3 {
          font-size: 1.25rem !important;
        }
        
        .notion-minimal-renderer .notion-link {
          color: #9333ea !important;
          text-decoration: underline !important;
        }
        
        .notion-minimal-renderer .notion-link:hover {
          color: #a855f7 !important;
        }
        
        .notion-minimal-renderer .notion-inline-code {
          background: #1a1a1a !important;
          border: 1px solid #33353f !important;
          color: #e5e7eb !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
          font-size: 14px !important;
        }
        
        .notion-minimal-renderer .notion-code {
          background: #1a1a1a !important;
          border: 1px solid #33353f !important;
          border-radius: 8px !important;
          color: #e5e7eb !important;
        }
        
        .notion-minimal-renderer .notion-quote {
          border-left: 4px solid #9333ea !important;
          background: rgba(147, 51, 234, 0.1) !important;
          color: #ADB7BE !important;
          padding: 1rem !important;
          margin: 1rem 0 !important;
          border-radius: 0 8px 8px 0 !important;
        }
        
        .notion-minimal-renderer .notion-callout {
          background: rgba(147, 51, 234, 0.1) !important;
          border: 1px solid rgba(147, 51, 234, 0.3) !important;
          border-radius: 8px !important;
          padding: 1rem !important;
          margin: 1rem 0 !important;
          color: #ADB7BE !important;
        }
        
        .notion-minimal-renderer .notion-list {
          color: #ADB7BE !important;
        }
        
        .notion-minimal-renderer .notion-list-item {
          color: #ADB7BE !important;
          margin: 0.5rem 0 !important;
          line-height: 1.6 !important;
        }
        
        .notion-minimal-renderer .notion-block {
          margin: 1rem 0 !important;
          color: #ADB7BE !important;
          line-height: 1.6 !important;
        }
        
        .notion-minimal-renderer .notion-asset {
          border-radius: 8px !important;
          margin: 1.5rem 0 !important;
        }
        
        .notion-minimal-renderer .notion-image {
          border-radius: 8px !important;
          margin: 1.5rem 0 !important;
          max-width: 100% !important;
        }
        
        /* Ensure all text elements are readable */
        .notion-minimal-renderer * {
          color: #ADB7BE !important;
        }
        
        .notion-minimal-renderer h1,
        .notion-minimal-renderer h2,
        .notion-minimal-renderer h3,
        .notion-minimal-renderer h4,
        .notion-minimal-renderer h5,
        .notion-minimal-renderer h6 {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default NotionPage;
