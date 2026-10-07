import { NextRequest, NextResponse } from 'next/server';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Records a waitlist signup to whichever sink is configured.
// Default sink is Formspree (form IDs are public by design — they ship in the
// client-side form on every Formspree-backed site — so this is not a secret).
// Override or switch sinks via env:
//   - WAITLIST_FORMSPREE_ID          -> POSTs to https://formspree.io/f/<id>
//   - WAITLIST_WEBHOOK_URL           -> POSTs JSON to that URL (e.g. a Google
//                                       Apps Script that appends to a Sheet)
//   - RESEND_API_KEY + WAITLIST_NOTIFY_EMAIL -> emails the signup to you
//     (optional WAITLIST_FROM_EMAIL, defaults to onboarding@resend.dev)
//
// If no sink resolves the route returns 503 so the form shows an error
// instead of falsely telling the visitor they're on the list.
const DEFAULT_FORMSPREE_ID = 'mvzvlkva';
export async function POST(req: NextRequest) {
    let body: { email?: string; name?: string; source?: string; company?: string; org?: string; message?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Honeypot: the `company` field is hidden from real users. If it's filled,
    // silently accept (200) without forwarding so bots can't tell they failed.
    if ((body.company || '').trim() !== '') {
        return NextResponse.json({ ok: true });
    }

    const email = (body.email || '').trim();
    const name = (body.name || '').trim();
    const source = (body.source || 'general').trim();
    const org = (body.org || '').trim();
    const message = (body.message || '').trim();

    if (!EMAIL_RE.test(email)) {
        return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    // Only forward the optional fields that are actually present.
    const extra: Record<string, string> = {};
    if (org) extra.org = org;
    if (message) extra.message = message;

    // Explicit env sinks take precedence; Formspree (env override or default) is the fallback.
    const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.WAITLIST_NOTIFY_EMAIL;
    const formspreeId = process.env.WAITLIST_FORMSPREE_ID || DEFAULT_FORMSPREE_ID;

    try {
        if (webhookUrl) {
            const r = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, source, ...extra, at: new Date().toISOString() }),
            });
            if (!r.ok) throw new Error(`Webhook responded ${r.status}`);
        } else if (resendKey && notifyEmail) {
            const extraLines = Object.entries(extra).map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${v}`).join('\n');
            const r = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from: process.env.WAITLIST_FROM_EMAIL || 'OWNED Waitlist <onboarding@resend.dev>',
                    to: [notifyEmail],
                    reply_to: email,
                    subject: `New waitlist signup (${source})`,
                    text: `Name: ${name || '—'}\nEmail: ${email}\nSource: ${source}${extraLines ? '\n' + extraLines : ''}`,
                }),
            });
            if (!r.ok) throw new Error(`Resend responded ${r.status}`);
        } else if (formspreeId) {
            const r = await fetch(`https://formspree.io/f/${formspreeId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ email, name, source, ...extra }),
            });
            if (!r.ok) throw new Error(`Formspree responded ${r.status}`);
        } else {
            console.error('Waitlist sink not configured.');
            return NextResponse.json({ error: 'Waitlist is not configured yet.' }, { status: 503 });
        }
    } catch (err: any) {
        console.error('Waitlist submission failed:', err);
        return NextResponse.json({ error: 'Could not record your signup. Please try again shortly.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
}
