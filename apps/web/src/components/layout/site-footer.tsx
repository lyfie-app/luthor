import { GITHUB_URL } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <p>Luthor is free, MIT licensed, and built in public.</p>
        <div className="footer-links">
          <a className="btn btn-muted" href="/docs/">
            Read Docs
          </a>
          <a className="btn btn-muted" href="/llms-full.txt">
            Full AI Corpus
          </a>
          <a className="btn btn-primary" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            Contribute on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
