// One reveal per metric and selected country, including across UI re-renders.
export function createCountryMotion() {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let selectedCode;
  let observer;
  let jobs = [];
  const played = new Set();

  function settle() {
    observer?.disconnect();
    for (const job of jobs) {
      cancelAnimationFrame(job.frame);
      job.draw(1);
    }
    jobs = [];
  }

  preference.addEventListener("change", () => {
    if (preference.matches) settle();
  });

  return function mount(root, code) {
    settle();
    if (code !== selectedCode) {
      played.clear();
      selectedCode = code;
    }
    if (preference.matches || !("IntersectionObserver" in window)) return;

    const hero = root.querySelector(".score-hero__value");
    if (hero) {
      const target = hero.textContent;
      const digits = [...target].filter((character) => /\d/.test(character)).length;
      let previousTick = -1;
      jobs.push({
        key: "hero", element: hero, duration: 800,
        draw(progress) {
          if (progress === 1) { hero.textContent = target; return; }
          const tick = Math.floor(progress * 1000 / 65);
          if (tick === previousTick) return;
          previousTick = tick;
          const locked = Math.floor(Math.max(0, (progress - 0.35) / 0.65) * digits);
          let index = 0;
          hero.textContent = [...target].map((character) => {
            if (!/\d/.test(character)) return character;
            return index++ < locked ? character : String(Math.floor(Math.random() * 10));
          }).join("");
        }
      });
    }

    root.querySelectorAll(".dimension-row").forEach((row, index) => {
      const fill = row.querySelector(".bar__fill");
      const score = row.querySelector(".dimension-row__score");
      const contribution = row.querySelector(".dimension-row__contribution strong");
      const scoreTarget = Number(score.textContent);
      const contributionTarget = Number(contribution.textContent);
      jobs.push({
        key: `dimension-${index}`, element: row, duration: 850,
        draw(progress) {
          const eased = 1 - (1 - progress) ** 3;
          fill.style.transform = `scaleX(${eased})`;
          score.textContent = (scoreTarget * eased).toFixed(2);
          contribution.textContent = (contributionTarget * eased).toFixed(2);
        }
      });
    });

    const pending = new Map();
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const job = pending.get(entry.target);
        if (!job) continue;
        pending.delete(entry.target);
        observer.unobserve(entry.target);
        played.add(job.key);
        let start;
        const tick = (time) => {
          start ??= time;
          const progress = Math.min(1, (time - start) / job.duration);
          job.draw(progress);
          if (progress < 1) job.frame = requestAnimationFrame(tick);
        };
        job.frame = requestAnimationFrame(tick);
      }
    }, { threshold: 0.25 });

    for (const job of jobs) {
      if (played.has(job.key)) continue;
      job.draw(0);
      pending.set(job.element, job);
      observer.observe(job.element);
    }
  };
}
