const track = document.getElementById('track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
const totalCards = document.querySelectorAll('.card').length;

function updateCarousel() {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

nextBtn.addEventListener('click', () => {
  if (currentIndex < totalCards - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = totalCards - 1; 
  }
  updateCarousel();
});