export function HomePage() {
  return (
    <>
      <div className="hero">
        <div className="slider">
          <ul className="slides">
            <li className="lazy-bg react-hero-slide" />
          </ul>
          <div className="container">
            <h2 className="slide-title">BasketballShop</h2>
            <h3 className="slide-subtitle">Only Basketball</h3>
          </div>
        </div>
      </div>
      <main className="main-content">
        <div className="fullwidth-block testimonial-section">
          <div className="container react-dark-panel">
            <blockquote>
              <p>
                "Durable and powerful" - product quality is always the top priority at
                BasketballShop.
              </p>
              <cite>Stephen Curry</cite>
            </blockquote>
          </div>
        </div>
        <div className="fullwidth-block upcoming-event-section" data-bg-color="#191919">
          <div className="container">
            <header className="section-header">
              <h2 className="section-title">Featured products</h2>
            </header>
            <div className="event-carousel">
              <div className="event">
                <div className="entry-date">
                  <div className="date">23</div>
                  <span className="month">May</span>
                </div>
                <h2 className="entry-title">Nike KD 14</h2>
                <p>A top performer with soft cushioning and excellent grip.</p>
              </div>
              <div className="event">
                <div className="entry-date">
                  <div className="date">14</div>
                  <span className="month">June</span>
                </div>
                <h2 className="entry-title">Jordan 36</h2>
                <p>Modern design, built for high-intensity gameplay.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
