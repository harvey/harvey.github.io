document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.right');
    const prevButton = document.querySelector('.carousel-button.left');
    let currentSlideIndex = 0;
    
    // Set the width for each slide and position them side-by-side.
    const slideWidth = slides[0].getBoundingClientRect().width;
    slides.forEach((slide, index) => {
      slide.style.left = slideWidth * index + 'px';
    });

    function moveToSlide(index) {
      track.style.transform = 'translateX(-' + slides[index].style.left + ')';
      currentSlideIndex = index;
    }
    
    // Auto slide timer functions
    let autoSlideTimer;
    function startAutoSlide() {
      autoSlideTimer = setInterval(() => {
        let nextIndex = currentSlideIndex + 1;
        if (nextIndex >= slides.length) {
          nextIndex = 0;
        }
        moveToSlide(nextIndex);
      }, 10000);
    }
    
    function resetAutoSlide() {
      clearInterval(autoSlideTimer);
      startAutoSlide();
    }
    
    // Start auto slide on load
    startAutoSlide();
    
    // Next Button Logic
    nextButton.addEventListener('click', function() {
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0;
      }
      moveToSlide(nextIndex);
      resetAutoSlide();  // Reset the timer on manual interaction
    });
    
    // Prev Button Logic
    prevButton.addEventListener('click', function() {
      let prevIndex = currentSlideIndex - 1;
      if (prevIndex < 0) {
        prevIndex = slides.length - 1;
      }
      moveToSlide(prevIndex);
      resetAutoSlide();  // Reset the timer on manual interaction
    });
    
});