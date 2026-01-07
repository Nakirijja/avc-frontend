<!-- src/components/common/TestimonialsCarousel.vue -->
<template>
  <section class="testimonials-section" aria-labelledby="testimonials-heading">
    <div class="container">
      <h2 id="testimonials-heading" class="section-title">What Our Members Say</h2>

      <div 
        class="testimonials-carousel" 
        role="region"
        aria-roledescription="carousel"
        aria-label="Member testimonials"
      >
        <!-- Slides -->
        <div
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.id"
          class="testimonial-slide"
          :class="{ active: currentSlide === index }"
          role="group"
          :aria-label="`Slide ${index + 1} of ${testimonials.length}`"
          :aria-hidden="currentSlide !== index"
          :tabindex="currentSlide === index ? 0 : -1"
        >
          <div class="testimonial-content">
            <div class="quote-icon">"</div>

            <blockquote class="testimonial-text">
              <p>{{ testimonial.text }}</p>
            </blockquote>

            <div class="testimonial-author">
              <div class="author-info">
                <h3 class="author-name">{{ testimonial.name }}</h3>
                <p class="author-role">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <button
          class="carousel-btn prev"
          @click="prevSlide"
          aria-label="Previous testimonial"
        >
          <i class="fas fa-chevron-left" aria-hidden="true"></i>
        </button>

        <button
          class="carousel-btn next"
          @click="nextSlide"
          aria-label="Next testimonial"
        >
          <i class="fas fa-chevron-right" aria-hidden="true"></i>
        </button>

        <!-- Numbered Dots -->
        <div class="carousel-dots" role="tablist">
          <button
            v-for="(testimonial, index) in testimonials"
            :key="testimonial.id"
            :class="['dot', { active: currentSlide === index }]"
            @click="goToSlide(index)"
            role="tab"
            :aria-selected="currentSlide === index"
          >
            {{ index + 1 }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  name: "TestimonialsCarousel",

  setup() {
    const testimonials = ref([
      {
        id: 1,
        text:
          "Joining AVC Choir has been one of the best decisions of my life. The sense of community and joy of making music together is incredible.",
        name: "Regina Namyenya",
        role: "Soprano, Member since 2010",
      },
      {
        id: 2,
        text:
          "The directors are incredibly talented and supportive. I've grown so much as a musician since joining this choir.",
        name: "Matovu Micheal",
        role: "Tenor, Member since 2018",
      },
      {
        id: 3,
        text:
          "From local performances to international tours, AVC Choir provides amazing opportunities to share our music with the world.",
        name: "Mrs. Kitimbo Florence",
        role: "Alto, Member since 2009",
      },
    ]);

    const currentSlide = ref(0);
    let autoSlideInterval = null;

    const nextSlide = () => {
      currentSlide.value =
        (currentSlide.value + 1) % testimonials.value.length;
    };

    const prevSlide = () => {
      currentSlide.value =
        (currentSlide.value - 1 + testimonials.value.length) %
        testimonials.value.length;
    };

    const goToSlide = (index) => {
      if (index >= 0 && index < testimonials.value.length) {
        currentSlide.value = index;
      }
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideInterval = setInterval(nextSlide, 6000);
    };

    const stopAutoSlide = () => {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
    };

    onMounted(() => startAutoSlide());
    onUnmounted(() => stopAutoSlide());

    return {
      testimonials,
      currentSlide,
      nextSlide,
      prevSlide,
      goToSlide,
    };
  },
};
</script>

<style scoped>
/* Section */
.testimonials-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  color: #2c3e50;
  font-size: 2.4rem;
  font-weight: 700;
}

/* Carousel container */
.testimonials-carousel {
  position: relative;
  max-width: 850px;
  margin: 0 auto;
  overflow: hidden;
}

/* Slides */
.testimonial-slide {
  display: none;
  animation: fadeIn 0.6s ease-in-out;
}

.testimonial-slide.active {
  display: block;
}

/* Card */
.testimonial-content {
  text-align: center;
  padding: 2.8rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* Quote icon */
.quote-icon {
  font-size: 4rem;
  color: #3498db;
  margin-bottom: 1rem;
  font-family: serif;
}

/* Text */
.testimonial-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #555;
  font-style: italic;
  max-width: 600px;
  margin: 0 auto 2rem;
}

/* Author */
.author-name {
  font-size: 1.15rem;
  font-weight: 600;
  color: #2c3e50;
}

.author-role {
  font-size: 0.95rem;
  color: #7f8c8d;
}

/* Navigation Buttons */
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(52, 152, 219, 0.9);
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.25s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-btn:hover {
  background: #2980b9;
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.prev {
  left: 12px;
}

.carousel-btn.next {
  right: 12px;
}

/* Numbered Dots */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 2rem;
}

.dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #bdc3c7;
  color: white;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s ease;
}

.dot.active {
  background: #3498db;
  transform: scale(1.15);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .testimonial-content {
    padding: 2rem 1.3rem;
  }
  .section-title {
    font-size: 2rem;
  }
}
</style>
