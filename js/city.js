// City-specific interactions
// Enhances city cards and handles city-page features when present

document.addEventListener('DOMContentLoaded', () => {
  initCityCards();
});

function initCityCards() {
  const cards = document.querySelectorAll('.city-card');
  if (!cards.length) return;

  // On hover: briefly tint the left border brighter via a CSS class
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('city-card--hovered');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('city-card--hovered');
    });
  });
}
