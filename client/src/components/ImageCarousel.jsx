import React, { useMemo, useState } from 'react';

export default function ImageCarousel({ images = [] }) {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [idx, setIdx] = useState(0);

  if (safeImages.length === 0) {
    return <div className="fk-carousel fk-carousel-empty">No images</div>;
  }

  const current = safeImages[idx];

  function prev() {
    setIdx((v) => (v - 1 + safeImages.length) % safeImages.length);
  }

  function next() {
    setIdx((v) => (v + 1) % safeImages.length);
  }

  return (
    <div className="fk-carousel">
      <div className="fk-carousel-main">
        <button className="fk-carousel-nav left" onClick={prev} type="button">
          ‹
        </button>
        <img src={current} alt="Product" />
        <button className="fk-carousel-nav right" onClick={next} type="button">
          ›
        </button>
      </div>

      <div className="fk-carousel-thumbs">
        {safeImages.map((src, i) => (
          <button
            key={src + i}
            className={`fk-thumb ${i === idx ? 'active' : ''}`}
            onClick={() => setIdx(i)}
            type="button"
          >
            <img src={src} alt={`Thumb ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
