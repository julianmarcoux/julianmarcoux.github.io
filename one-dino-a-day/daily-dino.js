(() => {
  const firstDay = Date.UTC(2026, 10, 22);
  const millisecondsPerDay = 86_400_000;
  const timeZone = 'Europe/Zurich';
  const dayParts = new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const displayDate = new Intl.DateTimeFormat('en-GB', { timeZone, dateStyle: 'long' });
  const statLabels = [
    ['length', 'Estimated length'],
    ['weight', 'Estimated weight'],
    ['diet', 'Diet'],
    ['age', 'When it lived'],
  ];

  const status = document.getElementById('dino-status');
  const date = document.getElementById('dino-date');
  const entry = document.querySelector('.dino-entry');
  const facts = entry.querySelector('.dino-facts');
  const figure = entry.querySelector('.dino-photo');
  const image = figure.querySelector('img');
  const credit = document.getElementById('dino-credit');
  const license = document.getElementById('dino-license');
  const wikipedia = document.getElementById('dino-wikipedia');
  const statsSource = document.getElementById('dino-stats-source');
  const name = document.getElementById('dino-name');
  const details = document.getElementById('dino-details');
  const intro = document.getElementById('dino-intro');

  function showStatus(message) {
    status.textContent = message;
    status.hidden = !message;
  }

  image.addEventListener('load', () => { figure.hidden = false; });
  image.addEventListener('error', () => { figure.hidden = true; });

  let lastDay;
  function render(dinosaurs) {
    const now = new Date();
    const parts = Object.fromEntries(dayParts.formatToParts(now).map(({ type, value }) => [type, value]));
    const day = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
    if (day === lastDay) return;

    const daysSinceStart = (day - firstDay) / millisecondsPerDay;
    const index = ((daysSinceStart % dinosaurs.length) + dinosaurs.length) % dinosaurs.length;
    const dinosaur = dinosaurs[index];

    name.textContent = dinosaur.name;
    details.textContent = dinosaur.period + ' · ' + dinosaur.region;
    intro.textContent = dinosaur.intro;
    wikipedia.href = dinosaur.wikipedia;
    statsSource.href = dinosaur.statsSource;
    statsSource.hidden = dinosaur.statsSource === dinosaur.wikipedia;

    facts.replaceChildren();
    for (const [key, label] of statLabels) {
      if (!dinosaur[key]) continue;
      const group = document.createElement('div');
      const term = document.createElement('dt');
      const value = document.createElement('dd');
      term.textContent = label;
      value.textContent = dinosaur[key];
      group.append(term, value);
      facts.append(group);
    }

    figure.hidden = true;
    const photo = dinosaur.image;
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    credit.textContent = photo.artist;
    credit.href = photo.file;
    license.textContent = photo.license;
    license.href = photo.licenseUrl;
    image.src = photo.url;
    if (image.complete && image.naturalWidth > 0) figure.hidden = false;

    date.dateTime = parts.year + '-' + parts.month + '-' + parts.day;
    date.textContent = displayDate.format(now);
    date.hidden = false;
    entry.hidden = false;
    lastDay = day;
  }

  async function load() {
    showStatus('Loading today’s dinosaur…');
    try {
      const response = await fetch('/one-dino-a-day/dinosaurs.json');
      if (!response.ok) throw new Error('Dinosaur data could not be loaded');
      const dinosaurs = await response.json();
      if (!Array.isArray(dinosaurs) || !dinosaurs.length) throw new Error('Dinosaur list is empty');
      const refresh = () => render(dinosaurs);
      refresh();
      showStatus('');
      window.setInterval(refresh, 30_000);
      window.addEventListener('pageshow', refresh);
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) refresh();
      });
    } catch {
      showStatus('Today’s dinosaur couldn’t be loaded. Reload this page to try again.');
    }
  }

  load();
})();
