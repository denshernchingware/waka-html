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

const quoteForm = document.querySelector("#quoteForm");
const quoteFormStatus = document.querySelector("#quoteFormStatus");

if (quoteForm && quoteFormStatus) {
  const requestedProduct = new URLSearchParams(window.location.search).get("product");
  const productSelect = quoteForm.querySelector('select[name="product"]');

  if (requestedProduct && productSelect) {
    const matchingOption = Array.from(productSelect.options).find(
      (option) => option.value.toLowerCase() === requestedProduct.toLowerCase(),
    );

    if (matchingOption) productSelect.value = matchingOption.value;
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
