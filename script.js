
"use strict";

// ========================================
// 1. PRODUCT DATA
// ========================================

const products = [
  {
    id: 1,
    name: "Men Solid Casual T-Shirt",
    brand: "Roadster",
    category: "Mens",
    price: 499,
    originalPrice: 999,
    discount: 50,
    image: "https://placehold.co/400x520/f1e4db/333333?text=Men+T-Shirt"
  },
  {
    id: 2,
    name: "Women Floral Dress",
    brand: "DressBerry",
    category: "Womens",
    price: 899,
    originalPrice: 1799,
    discount: 50,
    image: "https://placehold.co/400x520/f5dfe8/333333?text=Women+Dress"
  },
  {
    id: 3,
    name: "Kids Casual Outfit",
    brand: "H&M",
    category: "Kids",
    price: 699,
    originalPrice: 1199,
    discount: 42,
    image: "https://placehold.co/400x520/dcebd8/333333?text=Kids+Wear"
  },
  {
    id: 4,
    name: "Men Slim Fit Jeans",
    brand: "Levis",
    category: "Mens",
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    image: "https://placehold.co/400x520/dce4f4/333333?text=Men+Jeans"
  },
  {
    id: 5,
    name: "Women Casual Top",
    brand: "H&M",
    category: "Womens",
    price: 599,
    originalPrice: 999,
    discount: 40,
    image: "https://placehold.co/400x520/f6e5ce/333333?text=Women+Top"
  },
  {
    id: 6,
    name: "Home Decorative Cushion",
    brand: "Home Centre",
    category: "Home & Living",
    price: 399,
    originalPrice: 699,
    discount: 43,
    image: "https://placehold.co/400x520/e7dff4/333333?text=Home+Decor"
  },
  {
    id: 7,
    name: "Beauty Care Essentials",
    brand: "Beauty",
    category: "Beauty",
    price: 799,
    originalPrice: 1199,
    discount: 33,
    image: "https://placehold.co/400x520/f7dce0/333333?text=Beauty"
  },
  {
    id: 8,
    name: "Men Everyday Sneakers",
    brand: "HRX",
    category: "Mens",
    price: 1499,
    originalPrice: 2499,
    discount: 40,
    image: "https://placehold.co/400x520/e0e0e0/333333?text=Sneakers"
  }
];

// ========================================
// 2. DOM ELEMENTS
// ========================================

const main = document.querySelector("main");
const searchInput = document.querySelector(".search-input");
const navLinks = document.querySelectorAll(".nav-bar a");
const actionContainers = document.querySelectorAll(".action-container");

// ========================================
// 3. APPLICATION STATE
// ========================================

let selectedCategory = "All";
let searchText = "";

let cart = loadFromStorage("myntra-cart", []);
let wishlist = loadFromStorage("myntra-wishlist", []);

// ========================================
// 4. LOCAL STORAGE HELPERS
// ========================================

function loadFromStorage(key, fallback) {
  try {
    const savedData = localStorage.getItem(key);

    if (savedData === null) {
      return fallback;
    }

    const parsedData = JSON.parse(savedData);

    return Array.isArray(parsedData) ? parsedData : fallback;
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save ${key}:`, error);
    alert("Data save nahi ho paya. Browser storage check karo.");
  }
}

// ========================================
// 5. CREATE PRODUCT SECTION
// ========================================

const productSection = document.createElement("section");
productSection.className = "product-section";
productSection.id = "products";

const productHeading = document.createElement("h2");
productHeading.className = "product-heading";
productHeading.textContent = "Trending Products";

const productGrid = document.createElement("div");
productGrid.className = "product-grid";

productSection.append(productHeading, productGrid);
main.append(productSection);

// ========================================
// 6. RENDER PRODUCTS
// ========================================

function renderProducts() {
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const searchableText =
      `${product.name} ${product.brand} ${product.category}`.toLowerCase();

    const matchesSearch = searchableText.includes(searchText);

    return matchesCategory && matchesSearch;
  });

  productHeading.textContent =
    selectedCategory === "All"
      ? "Trending Products"
      : `${selectedCategory} Products`;

  productGrid.replaceChildren();

  if (filteredProducts.length === 0) {
    const message = document.createElement("p");
    message.className = "no-products";
    message.textContent = "No products found. Try another search.";
    productGrid.append(message);
    return;
  }

  filteredProducts.forEach((product) => {
    const isWishlisted = wishlist.includes(product.id);

    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    const details = document.createElement("div");
    details.className = "product-details";

    const brand = document.createElement("h3");
    brand.textContent = product.brand;

    const name = document.createElement("p");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent =
      `₹${product.price}  MRP ₹${product.originalPrice} (${product.discount}% OFF)`;

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const wishlistButton = document.createElement("button");
    wishlistButton.type = "button";
    wishlistButton.className = "wishlist-button";
    wishlistButton.textContent = isWishlisted
      ? "♥ Wishlisted"
      : "♡ Wishlist";

    wishlistButton.setAttribute(
      "aria-pressed",
      String(isWishlisted)
    );

    wishlistButton.addEventListener("click", () => {
      toggleWishlist(product.id);
    });

    const bagButton = document.createElement("button");
    bagButton.type = "button";
    bagButton.className = "bag-button";
    bagButton.textContent = "Add to Bag";

    bagButton.addEventListener("click", () => {
      addToCart(product.id);
    });

    actions.append(wishlistButton, bagButton);
    details.append(brand, name, price, actions);
    card.append(image, details);
    productGrid.append(card);
  });
}

// ========================================
// 7. SEARCH PRODUCTS
// ========================================

searchInput.addEventListener("input", (event) => {
  searchText = event.target.value.trim().toLowerCase();
  renderProducts();
});

// ========================================
// 8. CATEGORY NAVIGATION
// ========================================

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const category = link.textContent
      .replace("New", "")
      .trim();

    const validCategories = [
      "Mens",
      "Womens",
      "Kids",
      "Home & Living",
      "Beauty"
    ];

    if (validCategories.includes(category)) {
      selectedCategory = category;
    } else {
      selectedCategory = "All";
    }

    searchInput.value = "";
    searchText = "";

    renderProducts();

    productSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

// ========================================
// 9. WISHLIST
// ========================================

function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((id) => id !== productId);
  } else {
    wishlist.push(productId);
  }

  saveToStorage("myntra-wishlist", wishlist);
  updateActionCounts();
  renderProducts();
}

function showWishlist() {
  selectedCategory = "All";
  searchText = "";
  searchInput.value = "";

  const wishedProducts = products.filter((product) =>
    wishlist.includes(product.id)
  );

  productHeading.textContent = "My Wishlist";
  productGrid.replaceChildren();

  if (wishedProducts.length === 0) {
    const message = document.createElement("p");
    message.className = "no-products";
    message.textContent = "Your wishlist is empty.";
    productGrid.append(message);
    productSection.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // Temporarily display only wishlisted products.
  wishedProducts.forEach((product) => {
    const card = createSimpleCard(product);
    productGrid.append(card);
  });

  productSection.scrollIntoView({ behavior: "smooth" });
}

// ========================================
// 10. SHOPPING BAG / CART
// ========================================

function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveToStorage("myntra-cart", cart);
  updateActionCounts();

  alert("Product added to your bag!");
}

function changeQuantity(productId, amount) {
  const item = cart.find((item) => item.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);
  }

  saveToStorage("myntra-cart", cart);
  showCart();
  updateActionCounts();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);

  saveToStorage("myntra-cart", cart);
  showCart();
  updateActionCounts();
}

function showCart() {
  selectedCategory = "All";
  searchText = "";
  searchInput.value = "";

  productHeading.textContent = "My Shopping Bag";
  productGrid.replaceChildren();

  const cartItems = cart
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.id)
    }))
    .filter((item) => item.product);

  if (cartItems.length === 0) {
    const message = document.createElement("p");
    message.className = "no-products";
    message.textContent = "Your shopping bag is empty.";
    productGrid.append(message);
    productSection.scrollIntoView({ behavior: "smooth" });
    return;
  }

  let total = 0;

  cartItems.forEach((item) => {
    total += item.product.price * item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const title = document.createElement("h3");
    title.textContent = item.product.name;

    const price = document.createElement("p");
    price.textContent =
      `₹${item.product.price} × ${item.quantity}`;

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.textContent = "−";
    decreaseButton.addEventListener("click", () => {
      changeQuantity(item.id, -1);
    });

    const quantity = document.createElement("span");
    quantity.textContent = ` ${item.quantity} `;

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.textContent = "+";
    increaseButton.addEventListener("click", () => {
      changeQuantity(item.id, 1);
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      removeFromCart(item.id);
    });

    row.append(
      title,
      price,
      decreaseButton,
      quantity,
      increaseButton,
      removeButton
    );

    productGrid.append(row);
  });

  const totalElement = document.createElement("h2");
  totalElement.className = "cart-total";
  totalElement.textContent = `Total: ₹${total}`;

  productGrid.append(totalElement);

  productSection.scrollIntoView({ behavior: "smooth" });
}

// ========================================
// 11. REUSABLE SIMPLE PRODUCT CARD
// ========================================

function createSimpleCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";

  const image = document.createElement("img");
  image.className = "product-image";
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";

  const details = document.createElement("div");
  details.className = "product-details";

  const brand = document.createElement("h3");
  brand.textContent = product.brand;

  const name = document.createElement("p");
  name.textContent = product.name;

  const price = document.createElement("p");
  price.textContent = `₹${product.price}`;

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Add to Bag";
  button.addEventListener("click", () => addToCart(product.id));

  details.append(brand, name, price, button);
  card.append(image, details);

  return card;
}

// ========================================
// 12. UPDATE BAG AND WISHLIST COUNTS
// ========================================

function updateActionCounts() {
  const wishlistContainer = actionContainers[1];
  const bagContainer = actionContainers[2];

  if (!wishlistContainer || !bagContainer) return;

  const wishlistLabel = wishlistContainer.querySelector("span:last-child");
  const bagLabel = bagContainer.querySelector("span:last-child");

  if (wishlistLabel) {
    wishlistLabel.textContent = `Wishlist (${wishlist.length})`;
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (bagLabel) {
    bagLabel.textContent = `Bag (${cartCount})`;
  }
}

// ========================================
// 13. CONNECT HEADER ACTIONS
// ========================================

if (actionContainers[1]) {
  actionContainers[1].style.cursor = "pointer";

  actionContainers[1].addEventListener("click", showWishlist);
}

if (actionContainers[2]) {
  actionContainers[2].style.cursor = "pointer";

  actionContainers[2].addEventListener("click", showCart);
}

// ========================================
// 14. INITIALIZE WEBSITE
// ========================================

renderProducts();
updateActionCounts();


