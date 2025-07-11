// fetch('https://fakestoreapi.com/products')
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);

//   })



// const productContainer = document.getElementById("productContainer");
// const cart = [];
// let allProducts = [];

// // Load all products from API
// const loadProducts = () => {
//   productContainer.innerHTML = "<p>Loading products...</p>";
//   fetch("https://fakestoreapi.com/products")
//     .then(response => response.json())
//     .then(data => {
//       allProducts = data;
//       showProducts(data);
//     });
// };

// // Show products using map() and arrow function
// const showProducts = (products) => {
//   productContainer.innerHTML = "";
//   products.map(item => {
//     productContainer.innerHTML += `
//       <div class="col-md-4">
//         <div class="card h-100">
//           <img src="${item.image}" class="card-img-top p-3" style="height:250px; object-fit:contain;">
//           <div class="card-body d-flex flex-column">
//             <h5 class="card-title">${item.title}</h5>
//             <p class="card-text">${item.description}</p>
//             <button class="btn btn-primary mt-auto" onclick="addToCart(${item.id})">Add to Cart</button>
//           </div>
//         </div>
//       </div>
//     `;
//   });
// };

// // Add product to cart
// const addToCart = (id) => {
//   const product = allProducts.find(p => p.id === id);
//   if (product) {
//     cart.push(product);
//     updateCartCount();
//   }
// };

// // Update cart item count
// const updateCartCount = () => {
//   document.getElementById("cartCount").innerText = cart.length;
// };

// // View cart items
// const viewCart = () => {
//   productContainer.innerHTML = "<h3>Cart Items</h3>";

//   if (cart.length === 0) {
//     productContainer.innerHTML += "<p>Your cart is empty.</p>";
//     return;
//   }

//   cart.map(item => {
//     productContainer.innerHTML += `
//       <div class="card mb-3">
//         <div class="row g-0">
//           <div class="col-md-3">
//             <img src="${item.image}" class="img-fluid rounded-start p-2" style="height:150px; object-fit:contain;">
//           </div>
//           <div class="col-md-9">
//             <div class="card-body">
//               <h5 class="card-title">${item.title}</h5>
//               <p class="card-text">${item.description}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//   });
// };

// // Handle search
// document.getElementById("searchForm").addEventListener("submit", (e) => {
//   e.preventDefault();
//   const keyword = document.getElementById("searchInput").value.toLowerCase();
//   const filtered = allProducts.filter(item => item.title.toLowerCase().includes(keyword));
//   showProducts(filtered);
// });

// // Load products on first visit
// loadProducts();


const productContainer = document.getElementById("productContainer");
let cart = [];
let allProducts = [];
let inCartView = false; // ✅ Flag to know if we're in Cart view

// Load Products
const loadProducts = () => {
  inCartView = false;
  productContainer.innerHTML = "<p>Loading products...</p>";
  fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      showProducts(data);
    });
};

// Show products on homepage
const showProducts = (products) => {
  productContainer.innerHTML = "";
  products.map(item => {
    productContainer.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 shadow">
          <img src="${item.image}" class="card-img-top p-3" style="height:250px; object-fit:contain;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-dark-emphasis">${item.title}</h5>
            <p class="fw-bold text-success">$${item.price}</p>
            <button class="btn btn-primary me-auto mt-auto" onclick="addToCart(${item.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
};

// Add to cart
const addToCart = (id) => {
  const product = allProducts.find(p => p.id === id);
  if (product) {
    const existing = cart.find(c => c.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({...product, qty: 1});
    }
    updateCartCount();
    if (!inCartView) showProducts(allProducts); // Only refresh homepage view
  }
};

const increaseQty = (id) => {
  const item = cart.find(c => c.id === id);
  if (item) item.qty += 1;
  updateCartCount();
  viewCart();
};

const decreaseQty = (id) => {
  const item = cart.find(c => c.id === id);
  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) {
      cart = cart.filter(c => c.id !== id);
    }
  }
  updateCartCount();
  viewCart();
};

const removeFromCart = (id) => {
  cart = cart.filter(c => c.id !== id);
  updateCartCount();
  viewCart();
};

const updateCartCount = () => {
  document.getElementById("cartCount").innerText = cart.reduce((total, item) => total + item.qty, 0);
};

// Cart View
const viewCart = () => {
  inCartView = true;
  productContainer.innerHTML = "<h3 class='mb-4'>🛒 Cart</h3>";

  if (cart.length === 0) {
    productContainer.innerHTML += "<p>Your cart is empty.</p>";
    return;
  }

  cart.map(item => {
    productContainer.innerHTML += `
      <div class="card mb-3 shadow-sm">
        <div class="row g-0">
          <div class="col-md-3 text-center">
            <img src="${item.image}" class="img-fluid p-3 cart-img" alt="${item.title}">
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
              <p><b>Color:</b> Random Color</p>
              <p>${item.description.substring(0, 120)}...</p>
              <p class="fw-bold text-success">Price: $${item.price}</p>
              <div class="d-flex align-items-center mb-2">
                <button class="btn btn-sm btn-danger me-2" onclick="decreaseQty(${item.id})">−</button>
                <span>${item.qty}</span>
                <button class="btn btn-sm btn-success ms-2" onclick="increaseQty(${item.id})">+</button>
              </div>
              <button class="btn btn-outline-dark btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
};

// Search
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const filtered = allProducts.filter(item =>
    item.title.toLowerCase().includes(keyword)
  );
  inCartView = false;
  showProducts(filtered);
});

// Load default
loadProducts();
