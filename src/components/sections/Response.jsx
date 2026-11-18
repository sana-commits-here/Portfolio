import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { CHANNELS, IDENTITY } from '../../content/data.js';
import { mailto } from '../../lib/util.js';
import { Magnetic, Reveal, SplitText } from '../system/Primitives.jsx';

const EASE = [0.22, 1, 0.36, 1];

export default function Response() {
  const [channel, setChannel] = useState(false);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const field = useRef(null);

  useEffect(() => { if (channel) setTimeout(() => field.current?.focus({ preventScroll: true }), 500); }, [channel]);

  const send = (e) => {
    e.preventDefault();
    const subject = name ? `Hello from ${name}` : 'Hello from your portfolio';
    window.location.href = mailto({ subject, body: msg }, CHANNELS.email);
  };

  const links = [
    { k: 'Email', v: CHANNELS.email, href: `mailto:${CHANNELS.email}` },
    { k: 'LinkedIn', v: 'in/sanabadagan', href: CHANNELS.linkedin, ext: true },
    { k: 'GitHub', v: 'sana-commits-here', href: CHANNELS.github, ext: true },
  ];

  return (
    <section id="contact" className="layer response" data-live aria-labelledby="contact-title">
      <div className="wrap">
        <div className="rs-meta mono">
          <span className="sig">L06</span>
          <span className="rule" aria-hidden="true" />
          <span>Contact</span>
          <span className="faint">· op: response()</span>
        </div>

        <h2 id="contact-title" className="rs-title serif">
          <SplitText text="Awaiting" />{' '}
          <em><SplitText text="input" delay={0.12} /></em><span className="caret" aria-hidden="true" />
        </h2>

        <div className="rs-grid">
          <div className="rs-console">
            <Reveal className="rs-status mono">
              <span><span className="pulse" aria-hidden="true" /> Connection channel</span>
              <span className="faint">System ready</span>
            </Reveal>

            <AnimatePresence mode="wait" initial={false}>
              {!channel ? (
                <m.div key="closed" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="rs-open-wrap">
                  <Magnetic>
                    <button className="rs-open" onClick={() => setChannel(true)} data-cursor="view" data-cursor-label="Connect" aria-expanded={false} aria-controls="rs-form">
                      <span className="rs-br" aria-hidden="true">[</span>
                      <span className="mono">Open channel</span>
                      <span className="rs-br" aria-hidden="true">]</span>
                    </button>
                  </Magnetic>
                  <p className="dim rs-hint">Write a message here and it opens as an email to Sana. Or use a direct link.</p>
                </m.div>
              ) : (
                <m.form
                  key="open"
                  id="rs-form"
                  className="rs-form"
                  onSubmit={send}
                  initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                  animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <label className="rs-line">
                    <span className="mono faint">from</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="your name" autoComplete="name" />
                  </label>
                  <label className="rs-line rs-line-msg">
                    <span className="mono sig">&gt;</span>
                    <textarea ref={field} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="your message — a role, a research idea, a system to build…" rows={4} />
                  </label>
                  <div className="rs-form-foot">
                    <span className="mono-s faint">opens your mail client · nothing is stored</span>
                    <button type="submit" className="btn solid" data-cursor="link">Transmit <span className="arrow" aria-hidden="true">↗</span></button>
                  </div>
                </m.form>
              )}
            </AnimatePresence>
          </div>

          <ul className="rs-links">
            {links.map((l, i) => (
              <Reveal as="li" key={l.k} delay={i * 0.06}>
                <a href={l.href} target={l.ext ? '_blank' : undefined} rel={l.ext ? 'noopener noreferrer' : undefined} className="rs-link" data-cursor="link">
                  <span className="mono faint">{String(i + 1).padStart(2, '0')}</span>
                  <span className="rs-k">{l.k}</span>
                  <span className="rs-v mono">{l.v}</span>
                  <span className="rs-arrow" aria-hidden="true">↗</span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>

        <footer className="rs-foot mono-s">
          <span>{IDENTITY.name} · {IDENTITY.role}</span>
          <span className="faint">End of forward pass · {new Date().getFullYear()}</span>
          <a href="#top" className="ulink" data-cursor="link">Re-run ↑</a>
        </footer>
      </div>
    </section>
  );
}
