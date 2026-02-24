import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container not-found">
        <h1>Page not found</h1>
        <p>This route does not exist in the Luthor website.</p>
        <Link className="btn btn-primary" href="/">
          Return home
        </Link>
      </div>
    </section>
  );
}
