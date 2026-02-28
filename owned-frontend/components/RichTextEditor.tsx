'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import {
    Bold,
    Italic,
    Image as ImageIcon,
    Type,
    List,
    Heading2,
    Undo,
    Redo,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    minHeight?: string;
}

const FONT_OPTIONS = [
    { label: 'Default', value: '' },
    { label: 'Sans Serif', value: 'Inter, system-ui, sans-serif' },
    { label: 'Serif', value: 'Georgia, Cambria, serif' },
    { label: 'Mono', value: 'ui-monospace, SFMono-Regular, monospace' },
    { label: 'Rounded', value: 'Nunito, system-ui, sans-serif' },
];

export function RichTextEditor({
    value,
    onChange,
    placeholder = 'Start writing...',
    disabled = false,
    minHeight = '200px',
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showFontMenu, setShowFontMenu] = useState(false);
    const [currentFont, setCurrentFont] = useState('');
    const isInternalUpdate = useRef(false);

    // Sync external value → editor content (only when value changes externally)
    useEffect(() => {
        if (editorRef.current && !isInternalUpdate.current) {
            const currentHTML = editorRef.current.innerHTML;
            // Convert plain text (with newlines) to HTML if it doesn't contain HTML tags
            const hasHTML = /<[a-z][\s\S]*>/i.test(value);
            const htmlValue = hasHTML ? value : plainTextToHTML(value);
            if (currentHTML !== htmlValue) {
                editorRef.current.innerHTML = htmlValue;
            }
        }
        isInternalUpdate.current = false;
    }, [value]);

    const plainTextToHTML = (text: string): string => {
        if (!text) return '';
        return text
            .split('\n\n')
            .map(block => {
                const lines = block.split('\n');
                return lines.map(line => `<p>${line || '<br>'}</p>`).join('');
            })
            .join('');
    };

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            isInternalUpdate.current = true;
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    const execCommand = useCallback((command: string, value?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, value);
        handleInput();
    }, [handleInput]);

    const handleBold = () => execCommand('bold');
    const handleItalic = () => execCommand('italic');
    const handleUnorderedList = () => execCommand('insertUnorderedList');
    const handleHeading = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            execCommand('formatBlock', '<h3>');
        }
    };
    const handleUndo = () => execCommand('undo');
    const handleRedo = () => execCommand('redo');

    const handleFontChange = (fontFamily: string) => {
        setCurrentFont(fontFamily);
        if (fontFamily) {
            execCommand('fontName', fontFamily);
        } else {
            execCommand('removeFormat');
        }
        setShowFontMenu(false);
    };

    const handleInsertImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            // Convert to base64 data URL for inline embedding
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result as string;
                editorRef.current?.focus();
                document.execCommand(
                    'insertHTML',
                    false,
                    `<img src="${dataUrl}" alt="Product image" style="max-width:100%;border-radius:12px;margin:8px 0;" />`
                );
                handleInput();
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleBold();
        }
        if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleItalic();
        }
    };

    const ToolButton = ({
        onClick,
        active,
        children,
        title,
    }: {
        onClick: () => void;
        active?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-2 rounded-lg transition-all hover:bg-slate-100 ${active ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-900'
                }`}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-border rounded-2xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border bg-slate-50/80 flex-wrap">
                <ToolButton onClick={handleBold} title="Bold (⌘B)">
                    <Bold className="w-4 h-4" strokeWidth={2.5} />
                </ToolButton>
                <ToolButton onClick={handleItalic} title="Italic (⌘I)">
                    <Italic className="w-4 h-4" strokeWidth={2.5} />
                </ToolButton>

                <div className="w-px h-5 bg-border mx-1" />

                <ToolButton onClick={handleHeading} title="Heading">
                    <Heading2 className="w-4 h-4" strokeWidth={2.5} />
                </ToolButton>
                <ToolButton onClick={handleUnorderedList} title="Bullet List">
                    <List className="w-4 h-4" strokeWidth={2.5} />
                </ToolButton>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Font Selector */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowFontMenu(!showFontMenu)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                        title="Font"
                    >
                        <Type className="w-4 h-4" strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">
                            {FONT_OPTIONS.find(f => f.value === currentFont)?.label || 'Font'}
                        </span>
                    </button>
                    {showFontMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowFontMenu(false)} />
                            <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl border border-border shadow-lg z-50 overflow-hidden">
                                {FONT_OPTIONS.map((font) => (
                                    <button
                                        key={font.label}
                                        type="button"
                                        onClick={() => handleFontChange(font.value)}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${currentFont === font.value ? 'font-bold text-primary bg-primary/5' : 'text-slate-700'
                                            }`}
                                        style={{ fontFamily: font.value || 'inherit' }}
                                    >
                                        {font.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="w-px h-5 bg-border mx-1" />

                <ToolButton onClick={handleInsertImage} title="Insert Image">
                    <ImageIcon className="w-4 h-4" strokeWidth={2.5} />
                </ToolButton>

                <div className="flex-1" />

                <ToolButton onClick={handleUndo} title="Undo (⌘Z)">
                    <Undo className="w-3.5 h-3.5" strokeWidth={2.5} />
                </ToolButton>
                <ToolButton onClick={handleRedo} title="Redo (⌘⇧Z)">
                    <Redo className="w-3.5 h-3.5" strokeWidth={2.5} />
                </ToolButton>
            </div>

            {/* Editor area */}
            <div
                ref={editorRef}
                contentEditable={!disabled}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                data-placeholder={placeholder}
                suppressContentEditableWarning
                className="px-5 py-4 outline-none text-lg font-medium leading-relaxed [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground/50 [&:empty]:before:pointer-events-none [&_h3]:text-xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-2 [&_p]:mb-1"
                style={{ minHeight }}
            />
        </div>
    );
}
