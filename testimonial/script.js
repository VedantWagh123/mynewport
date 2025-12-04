document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev');

    const cardWidth = cards[0].getBoundingClientRect().width;

    nextButton.addEventListener('click', () => {
        track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });

    prevButton.addEventListener('click', () => {
        track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });

    // Star ratings
    const ratings = document.querySelectorAll('.star-rating');
    ratings.forEach(rating => {
        const score = rating.dataset.rating;
        rating.innerHTML = '★'.repeat(score) + '☆'.repeat(5 - score);
    });
});
