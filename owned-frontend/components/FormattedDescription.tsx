'use client';

import React from 'react';

interface FormattedDescriptionProps {
    text: string;
    className?: string;
    variant?: 'full' | 'card';
}

/**
 * Auto-formats a plain-text product description into styled blocks:
 * - Splits on double newlines into paragraphs
 * - Lines starting with "- " or "• " become bullet points
 * - Lines starting with "# " become section headings
 * - Lines starting with "**" and ending with "**" become bold highlights
 * - Everything else becomes a normal paragraph
 */
export const FormattedDescription = ({ text, className = '', variant = 'full' }: FormattedDescriptionProps) => {
    if (!text) return null;

    // Detect if the content is HTML (from the rich text editor)
    const isHTML = /<[a-z][\s\S]*>/i.test(text);

    if (variant === 'card') {
        // For cards, show a truncated plain-text version
        const plainText = isHTML
            ? text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
            : text.replace(/[#*•\-]/g, '').replace(/\n+/g, ' ').trim();
        return (
            <p className={`text-sm text-muted-foreground leading-relaxed line-clamp-3 ${className}`}>
                {plainText}
            </p>
        );
    }

    // If HTML content, render it directly with styling
    if (isHTML) {
        return (
            <div
                className={`space-y-2 text-left prose prose-slate max-w-none [&_h3]:text-xl [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-2 [&_p]:text-base [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_strong]:text-foreground [&_strong]:font-bold ${className}`}
                dangerouslySetInnerHTML={{ __html: text }}
            />
        );
    }

    // Plain text fallback renderer
    const normalized = text.replace(/\r\n/g, '\n');
    const blocks = normalized.split(/\n\n+/).filter(Boolean);

    return (
        <div className={`space-y-4 text-left ${className}`}>
            {blocks.map((block: string, blockIndex: number) => {
                const lines = block.split('\n').filter(Boolean);

                // Check if block is a list (all lines start with - or •)
                const isList = lines.every((line: string) => /^[\-•]\s/.test(line.trim()));
                if (isList) {
                    return (
                        <ul key={blockIndex} className="space-y-2 pl-1">
                            {lines.map((line: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed">
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                    <span>{line.replace(/^[\-•]\s*/, '')}</span>
                                </li>
                            ))}
                        </ul>
                    );
                }

                // Check if block is a heading
                if (lines.length === 1 && lines[0].startsWith('# ')) {
                    return (
                        <h3 key={blockIndex} className="text-xl font-bold tracking-tight text-foreground pt-2">
                            {lines[0].replace(/^#+\s*/, '')}
                        </h3>
                    );
                }

                // Check if block is a bold highlight
                if (lines.length === 1 && lines[0].startsWith('**') && lines[0].endsWith('**')) {
                    return (
                        <p key={blockIndex} className="text-base font-bold text-foreground bg-primary/5 px-5 py-3 rounded-xl border border-primary/10">
                            {lines[0].replace(/\*\*/g, '')}
                        </p>
                    );
                }

                // Mixed block: process each line
                return (
                    <div key={blockIndex} className="space-y-2">
                        {lines.map((line: string, i: number) => {
                            const trimmed = line.trim();

                            if (trimmed.startsWith('# ')) {
                                return (
                                    <h3 key={i} className="text-xl font-bold tracking-tight text-foreground pt-2">
                                        {trimmed.replace(/^#+\s*/, '')}
                                    </h3>
                                );
                            }

                            if (/^[\-•]\s/.test(trimmed)) {
                                return (
                                    <div key={i} className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed pl-1">
                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                                        <span>{trimmed.replace(/^[\-•]\s*/, '')}</span>
                                    </div>
                                );
                            }

                            // Render inline bold **text**
                            const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
                            return (
                                <p key={i} className="text-base text-muted-foreground leading-relaxed">
                                    {parts.map((part: string, j: number) => {
                                        if (part && part.startsWith('**') && part.endsWith('**')) {
                                            return <strong key={j} className="font-bold text-foreground">{part.replace(/\*\*/g, '')}</strong>;
                                        }
                                        return <React.Fragment key={j}>{part}</React.Fragment>;
                                    })}
                                </p>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
