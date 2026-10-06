export default function PageLoader() {
  return <div className="route-loader" role="status" aria-live="polite">
    <div className="route-loader-content">
      <span className="route-loader-wordmark" aria-hidden="true"><span>+</span> KITVERSE</span>
      <div className="route-loader-track" aria-hidden="true"><span /></div>
      <p>Loading the archive<span aria-hidden="true">…</span></p>
    </div>
  </div>;
}
