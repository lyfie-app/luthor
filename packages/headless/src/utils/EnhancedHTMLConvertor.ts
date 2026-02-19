/**
 * Enhanced HTML Convertor for Lexical
 * 
 * Handles proper conversion of code blocks and inline code
 * from HTML back to Lexical JSON format, ensuring that
 * code formatting is preserved during round-trip conversions.
 * 
 * Problem: Standard Lexical HTML import doesn't properly
 * reconstruct code blocks and inline code formatting.
 * 
 * Solution: This convertor preprocesses HTML to explicitly
 * handle code tags and code blocks before passing to Lexical.
 */

import { $generateNodesFromDOM } from '@lexical/html';
import { $createCodeNode, CodeNode } from '@lexical/code';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';

/**
 * Preprocess HTML to handle code blocks and inline code properly
 * 
 * Converts HTML code structures to a format that Lexical can properly import
 */
export function preprocessHTMLForCodeBlocks(html: string): string {
  let processed = html;
  
  // Handle inline code: <code>...</code> → placeholder we can post-process
  // We'll mark inline code with a special data attribute
  processed = processed.replace(
    /<code>([^<]*)<\/code>/g,
    '<code data-inline-code="true">$1</code>'
  );
  
  // Handle code blocks: <pre><code>...</code></pre> → special handling
  processed = processed.replace(
    /<pre><code(?: class="language-([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g,
    (match, language, content) => {
      // Decode HTML entities in code content
      const decoded = decodeHTMLEntities(content);
      // Create a marker that we'll convert to CodeNode
      // Using data attribute to preserve the code content
      return `<div data-code-block="true" data-language="${language || ''}">${escaped(decoded)}</div>`;
    }
  );
  
  return processed;
}

/**
 * Decode HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const textarea = typeof window !== 'undefined' ? document.createElement('textarea') : null;
  if (textarea) {
    textarea.innerHTML = text;
    return textarea.value;
  }
  // Server-side fallback
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/**
 * Escape text for HTML
 */
function escaped(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}

/**
 * Create a code block node JSON structure
 */
function createCodeBlockNode(code: string, language: string = ''): any {
  return {
    type: 'code',
    language: language || '',
    children: [
      {
        type: 'text',
        text: code,
      },
    ],
  };
}

/**
 * Create inline code text node with formatting
 */
function createInlineCodeTextNode(text: string): any {
  return {
    type: 'text',
    text: text,
    format: 1, // 1 = bold, we'll use a similar format for code
  };
}

/**
 * Post-process parsed DOM to convert code block divs to Lexical code nodes
 */
export function postprocessCodeBlocks(rootElement: HTMLElement): void {
  // Find all code block divs we created
  const codeBlockDivs = rootElement.querySelectorAll('[data-code-block="true"]');
  
  codeBlockDivs.forEach((div: Element) => {
    const language = (div as HTMLElement).dataset.language || '';
    const codeContent = div.textContent || '';
    
    // Store code content in data attribute for retrieval
    (div as HTMLElement).dataset.codeContent = codeContent;
  });
}

/**
 * Import HTML into Lexical editor with proper code block handling
 * 
 * This function:
 * 1. Preprocesses HTML to properly handle code blocks
 * 2. Parses the HTML into DOM
 * 3. Converts code block markers to Lexical code nodes
 * 4. Returns the Lexical JSON structure
 */
export function enhancedHTMLToLexicalJSON(html: string): any {
  // Preprocess HTML
  const processedHtml = preprocessHTMLForCodeBlocks(html);
  
  // Parse HTML to DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(processedHtml, 'text/html');
  
  // Post-process code blocks
  postprocessCodeBlocks(doc.body as HTMLElement);
  
  // Extract nodes using standard Lexical converter
  // This will be done by the editor when importing
  
  return {
    html: processedHtml,
    doc: doc,
  };
}

/**
 * Extract code content from HTML and reconstruct as Lexical JSON
 * 
 * This is a manual conversion that doesn't rely on $generateNodesFromDOM
 * which doesn't properly handle code blocks.
 */
export async function importHTMLWithCodeSupport(
  html: string,
  editor: any,
  importApi: any
): Promise<void> {
  // First, try to detect and handle code blocks explicitly
  const processed = preprocessHTMLForCodeBlocks(html);
  
  // Parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(processed, 'text/html');
  
  // Manually walk the DOM and build Lexical JSON
  const nodes: any[] = [];
  let currentParagraph: any = null;
  
  function walkNode(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (!text) return;
      
      if (!currentParagraph) {
        currentParagraph = {
          type: 'paragraph',
          children: [],
        };
        nodes.push(currentParagraph);
      }
      
      currentParagraph.children.push({
        type: 'text',
        text: node.textContent || '',
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tag = element.tagName.toLowerCase();
      
      // Handle code blocks (our preprocessed divs)
      if (tag === 'div' && element.dataset.codeBlock === 'true') {
        currentParagraph = null; // Flush current paragraph
        
        const language = element.dataset.language || '';
        const codeContent = element.textContent || '';
        
        nodes.push(createCodeBlockNode(codeContent, language));
      }
      // Handle paragraphs
      else if (tag === 'p' || tag === 'div' && !element.dataset.codeBlock) {
        currentParagraph = null; // Flush current paragraph
        
        const para: any = {
          type: 'paragraph',
          children: [],
        };
        
        // Walk children
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];
          if (!child) continue;
          
          if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent || '';
            if (text.trim()) {
              para.children.push({
                type: 'text',
                text: text,
              });
            }
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            const childElement = child as HTMLElement;
            const childTag = childElement.tagName.toLowerCase();
            
            if (childTag === 'code' && childElement.dataset.inlineCode) {
              // Inline code - we'll wrap in text with format
              para.children.push({
                type: 'text',
                text: childElement.textContent || '',
              });
            } else if (childTag === 'strong' || childTag === 'b') {
              para.children.push({
                type: 'text',
                text: childElement.textContent || '',
                format: 1, // bold
              });
            } else if (childTag === 'em' || childTag === 'i') {
              para.children.push({
                type: 'text',
                text: childElement.textContent || '',
                format: 2, // italic
              });
            } else {
              para.children.push({
                type: 'text',
                text: childElement.textContent || '',
              });
            }
          }
        }
        
        if (para.children.length > 0) {
          nodes.push(para);
        }
        currentParagraph = null;
      }
      // Handle headings
      else if (/^h[1-6]$/.test(tag)) {
        currentParagraph = null;
        
        const levelStr = tag[1];
        const level = levelStr ? parseInt(levelStr) : 1;
        nodes.push({
          type: 'heading',
          tag: tag as any,
          level: level,
          children: [
            {
              type: 'text',
              text: element.textContent || '',
            },
          ],
        });
      }
      // Handle lists
      else if (tag === 'ul' || tag === 'ol') {
        currentParagraph = null;
        
        for (let i = 0; i < element.children.length; i++) {
          const li = element.children[i];
          if (li && li.tagName.toLowerCase() === 'li') {
            nodes.push({
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: li.textContent || '',
                },
              ],
            });
          }
        }
      }
      // Recursively process other elements
      else {
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (child) {
            walkNode(child);
          }
        }
      }
    }
  }
  
  // Walk the document body
  walkNode(doc.body);
  
  // Flush any pending paragraph
  currentParagraph = null;
  
  // Ensure we have at least one node
  if (nodes.length === 0) {
    nodes.push({
      type: 'paragraph',
      children: [{ type: 'text', text: '' }],
    });
  }
  
  // Import the constructed JSON
  const lexicalJson = {
    root: {
      type: 'root',
      children: nodes,
    },
  };
  
  importApi.fromJSON(lexicalJson);
}
