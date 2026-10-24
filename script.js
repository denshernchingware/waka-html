const menuButton = document.querySelector("#menuButton");
const mobileMenu = document.querySelector("#mobileMenu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("hidden");
    });
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if (revealItems.length) {
  document.documentElement.classList.add("motion-ready");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }
}

const testimonialCarousel = document.querySelector("#testimonialCarousel");

if (testimonialCarousel) {
  const viewport = testimonialCarousel.querySelector("[data-testimonial-viewport]");
  const track = testimonialCarousel.querySelector("[data-testimonial-track]");
  const slides = Array.from(testimonialCarousel.querySelectorAll(".testimonial-slide"));
  const previousButton = testimonialCarousel.querySelector("[data-testimonial-prev]");
  const nextButton = testimonialCarousel.querySelector("[data-testimonial-next]");
  let currentIndex = 0;
  let maxIndex = 0;
  let slideStep = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragDelta = 0;
  let pointerId = null;

  const visibleSlideCount = () => (window.matchMedia("(min-width: 1024px)").matches ? 3 : 1);

  const updateButtons = () => {
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxIndex;
  };

  const setPosition = (animate = true, offset = 0) => {
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translate3d(${currentIndex * -slideStep + offset}px, 0, 0)`;
    updateButtons();
  };

  const measure = () => {
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    slideStep = (slides[0]?.getBoundingClientRect().width || 0) + gap;
    maxIndex = Math.max(0, slides.length - visibleSlideCount());
    currentIndex = Math.min(currentIndex, maxIndex);
    setPosition(false);
  };

  const moveTo = (index) => {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    setPosition();
  };

  const finishDrag = () => {
    if (!isDragging) return;

    isDragging = false;
    viewport.classList.remove("is-dragging");
    if (Math.abs(dragDelta) > Math.min(slideStep * 0.18, 90)) {
      moveTo(currentIndex + (dragDelta < 0 ? 1 : -1));
    } else {
      setPosition();
    }

    if (pointerId !== null && viewport.hasPointerCapture(pointerId)) {
      viewport.releasePointerCapture(pointerId);
    }
    pointerId = null;
    dragDelta = 0;
  };

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    isDragging = true;
    pointerId = event.pointerId;
    dragStartX = event.clientX;
    dragDelta = 0;
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(pointerId);
    track.style.transition = "none";
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    dragDelta = event.clientX - dragStartX;

    const atLimit = (currentIndex === 0 && dragDelta > 0) || (currentIndex === maxIndex && dragDelta < 0);
    setPosition(false, dragDelta * (atLimit ? 0.35 : 1));
  });

  viewport.addEventListener("pointerup", finishDrag);
  viewport.addEventListener("pointercancel", finishDrag);
  viewport.addEventListener("lostpointercapture", finishDrag);

  previousButton.addEventListener("click", () => moveTo(currentIndex - 1));
  nextButton.addEventListener("click", () => moveTo(currentIndex + 1));
  window.addEventListener("resize", measure);
  measure();
}

const galleryFilters = document.querySelectorAll("[data-gallery-filter]");
const galleryItems = document.querySelectorAll("[data-gallery-item]");

galleryFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.galleryFilter;

    galleryFilters.forEach((filter) => {
      filter.setAttribute("aria-pressed", String(filter === button));
    });

    galleryItems.forEach((item) => {
      item.hidden = selectedFilter !== "all" && item.dataset.galleryItem !== selectedFilter;
    });
  });
});

const galleryModal = document.querySelector("#galleryModal");
const galleryModalImage = document.querySelector("#galleryModalImage");
const galleryModalTitle = document.querySelector("#galleryModalTitle");
const galleryModalDescription = document.querySelector("#galleryModalDescription");
const galleryModalTriggers = document.querySelectorAll("[data-gallery-modal-trigger]");
let activeGalleryTrigger = null;

if (galleryModal && galleryModalImage && galleryModalTitle && galleryModalDescription) {
  const closeGalleryModal = () => {
    galleryModal.classList.add("hidden");
    galleryModal.classList.remove("flex");
    document.body.style.overflow = "";
    activeGalleryTrigger?.focus();
  };

  galleryModalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const thumbnail = trigger.querySelector("img");
      if (!thumbnail) return;

      activeGalleryTrigger = trigger;
      galleryModalImage.src = thumbnail.src;
      galleryModalImage.alt = thumbnail.alt;
      galleryModalTitle.textContent = trigger.dataset.galleryTitle;
      galleryModalDescription.textContent = trigger.dataset.galleryDescription;
      galleryModal.classList.remove("hidden");
      galleryModal.classList.add("flex");
      document.body.style.overflow = "hidden";
      galleryModal.querySelector("[data-gallery-modal-close-button]")?.focus();
    });
  });

  galleryModal.querySelectorAll("[data-gallery-modal-close]").forEach((button) => {
    button.addEventListener("click", closeGalleryModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !galleryModal.classList.contains("hidden")) {
      closeGalleryModal();
    }
  });
}

const quoteForm = document.querySelector("#quoteForm");
const quoteFormStatus = document.querySelector("#quoteFormStatus");

if (quoteForm && quoteFormStatus) {
  const requestedProduct = new URLSearchParams(window.location.search).get("product");
  const galleryNote = new URLSearchParams(window.location.search).get("note");
  const productSelect = quoteForm.querySelector('select[name="product"]');
  const messageField = quoteForm.querySelector('textarea[name="message"]');

  if (requestedProduct && productSelect) {
    const matchingOption = Array.from(productSelect.options).find(
      (option) => option.value.toLowerCase() === requestedProduct.toLowerCase(),
    );

    if (matchingOption) productSelect.value = matchingOption.value;
  }

  if (galleryNote && messageField && !messageField.value) {
    messageField.value = galleryNote;
  }

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(quoteForm);
    const product = formData.get("product");
    const subject = `Product enquiry: ${product}`;
    const message = [
      `Name: ${formData.get("name")}`,
      `Reply to: ${formData.get("contact")}`,
      `Product: ${product}`,
      `Quantity or measurements: ${formData.get("quantity") || "Not provided"}`,
      `Colour or finish: ${formData.get("colour") || "Not provided"}`,
      `Project location: ${formData.get("location") || "Not provided"}`,
      "",
      "Project notes:",
      formData.get("message") || "Not provided",
    ].join("\n");

    quoteFormStatus.textContent = "Your enquiry is ready. Opening your email application...";
    quoteFormStatus.classList.remove("hidden");
    window.location.href = `mailto:wakatendekaroofing@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });
}
