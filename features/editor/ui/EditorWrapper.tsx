'use client';

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  frontmatterPlugin,
  diffSourcePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  ListsToggle,
  InsertThematicBreak,
  DiffSourceToggleWrapper,
  type MDXEditorMethods,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import './editor-theme.css';
import { useRef, useEffect } from 'react';

interface EditorWrapperProps {
  content: string;
  onChange: (content: string) => void;
}

export default function EditorWrapper({ content, onChange }: EditorWrapperProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  // Update editor content when prop changes (e.g., when loading a new file)
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.getMarkdown()) {
      editorRef.current.setMarkdown(content);
    }
  }, [content]);

  return (
    <div className="h-full [&_.mdxeditor]:h-full [&_.mdxeditor]:bg-mantle [&_.mdxeditor]:text-text">
      <MDXEditor
        ref={editorRef}
        markdown={content}
        onChange={onChange}
        contentEditableClassName="prose prose-invert max-w-none px-8 py-6 focus:outline-none"
        plugins={[
          // Basic formatting plugins
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),

          // Link plugins
          linkPlugin(),
          linkDialogPlugin(),

          // Image plugin
          imagePlugin({
            imageUploadHandler: async () => {
              // For now, just return the URL as-is
              // In the future, could implement image upload to /public
              return Promise.resolve('');
            },
          }),

          // Table plugin
          tablePlugin(),

          // Code block plugins with syntax highlighting
          codeBlockPlugin({
            defaultCodeBlockLanguage: 'rust',
          }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              rust: 'Rust',
              rs: 'Rust',
              typescript: 'TypeScript',
              ts: 'TypeScript',
              javascript: 'JavaScript',
              js: 'JavaScript',
              tsx: 'TSX',
              jsx: 'JSX',
              bash: 'Bash',
              sh: 'Shell',
              json: 'JSON',
              yaml: 'YAML',
              yml: 'YAML',
              toml: 'TOML',
              markdown: 'Markdown',
              md: 'Markdown',
              css: 'CSS',
              html: 'HTML',
              sql: 'SQL',
              python: 'Python',
              py: 'Python',
            },
          }),

          // Frontmatter plugin for MDX metadata
          frontmatterPlugin(),

          // Source/rich-text toggle
          diffSourcePlugin({
            viewMode: 'rich-text',
            diffMarkdown: '',
          }),

          // Toolbar plugin
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <BlockTypeSelect />
                <CreateLink />
                <InsertTable />
                <ListsToggle />
                <InsertThematicBreak />
                <DiffSourceToggleWrapper>
                  <UndoRedo />
                </DiffSourceToggleWrapper>
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
