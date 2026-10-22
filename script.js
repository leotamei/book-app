// ==========================================
// GLOBAL VARIABLES (Simple State Management)
// ==========================================
let books = [];
let favorites = [];
let reviews = [
  { title: "The Hobbit", name: "Sarah", rating: "5", body: "Great fantasy story!" }
];

// ==========================================
// DOM ELEMENTS
// ==========================================
const searchPage = document.getElementById('search-page');
const favoritesPage = document.getElementById('favorites-page');
const reviewsPage = document.getElementById('reviews-page');

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const bookList = document.getElementById('book-list');
const loadingText = document.getElementById('loading-text');
const alertMessage = document.getElementById('alert-message');
const sortSelect = document.getElementById('sort-select');

const navSearchBtn = document.getElementById('nav-search-btn');
const navFavsBtn = document.getElementById('nav-favs-btn');
const navReviewsBtn = document.getElementById('nav-reviews-btn');

const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');

// ==========================================
// SPA NAVIGATION FUNCTION
// ==========================================
function showPage(pageName) {
  // Hide all pages
  searchPage.classList.add('d-none');
  favoritesPage.classList.add('d-none');
  reviewsPage.classList.add('d-none');

  // Remove active styling from buttons
  navSearchBtn.classList.remove('active');
  navFavsBtn.classList.remove('active');
  navReviewsBtn.classList.remove('active');

  // Show selected page
  if (pageName === 'search') {
    searchPage.classList.remove('d-none');
    navSearchBtn.classList.add('active');
  } else if (pageName === 'favorites') {
    favoritesPage.classList.remove('d-none');
    navFavsBtn.classList.add('active');
    displayFavorites();
  } else if (pageName === 'reviews') {
    reviewsPage.classList.remove('d-none');
    navReviewsBtn.classList.add('active');
    displayReviews();
  }
}

// ==========================================
// EVENT LISTENER 1: 'click' (Tabs & Buttons)
// ==========================================
navSearchBtn.addEventListener('click', function() {
  showPage('search');
});

navFavsBtn.addEventListener('click', function() {
  showPage('favorites');
});

navReviewsBtn.addEventListener('click', function() {
  showPage('reviews');
});

// ==========================================
// EVENT LISTENER 2: 'submit' (Search & POST)
// ==========================================

// Search Form Submit (GET Request)
searchForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Stop page from refreshing
  const query = searchInput.value.trim();
  
  if (query !== '') {
    fetchBooks(query);
  }
});

// Review Form Submit (POST Request)
reviewForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Stop page from refreshing
  
  const newReview = {
    title: document.getElementById('review-title').value,
    name: document.getElementById('review-name').value,
    rating: document.getElementById('review-rating').value,
    body: document.getElementById('review-body').value
  };

  sendPostRequest(newReview);
});

// ==========================================
// EVENT LISTENER 3: 'change' (Sorting Dropdown)
// ==========================================
sortSelect.addEventListener('change', function(event) {
  const selectedValue = event.target.value;

  if (selectedValue === 'newest') {
    books.sort((a, b) => b.first_publish_year - a.first_publish_year);
  } else if (selectedValue === 'oldest') {
    books.sort((a, b) => a.first_publish_year - b.first_publish_year);
  }

  displayBooks(books);
});

// ==========================================
// API FUNCTION 1: GET Request with Error Handling
// ==========================================
async function fetchBooks(query) {
  loadingText.classList.remove('d-none');
  alertMessage.innerHTML = '';
  bookList.innerHTML = '';

  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=12`);
    
    // Check if network request failed
    if (!response.ok) {
      throw new Error('Failed to reach the API server.');
    }

    const data = await response.json();
    
    if (data.docs.length === 0) {
      alertMessage.innerHTML = `<div class="alert alert-warning">No books found for "${query}".</div>`;
      loadingText.classList.add('d-none');
      return;
    }

    books = data.docs;
    displayBooks(books);

  } catch (error) {
    // Error Handling display banner
    alertMessage.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
  } finally {
    loadingText.classList.add('d-none');
  }
}

// ==========================================
// API FUNCTION 2: POST Request with Error Handling
// ==========================================
async function sendPostRequest(reviewData) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
      throw new Error('Could not submit review to server.');
    }

    const data = await response.json();
    
    // Add review to our local array and clear form
    reviews.unshift(reviewData);
    displayReviews();
    reviewForm.reset();

    alertMessage.innerHTML = `<div class="alert alert-success">Review submitted successfully! (Server status 201)</div>`;

  } catch (error) {
    alertMessage.innerHTML = `<div class="alert alert-danger">Error submitting review: ${error.message}</div>`;
  }
}

// ==========================================
// DISPLAY HELPER FUNCTIONS
// ==========================================

// Display Books in Search Page
function displayBooks(bookArray) {
  bookList.innerHTML = '';

  bookArray.forEach(function(book) {
    const coverId = book.cover_i;
    const imgUrl = coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` 
      : 'https://via.placeholder.com/150?text=No+Cover';

    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${imgUrl}" class="card-img-top book-cover" alt="Cover">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h6 class="card-title fw-bold">${book.title}</h6>
            <p class="card-text small text-muted">Author: ${book.author_name ? book.author_name[0] : 'Unknown'}</p>
            <p class="card-text small">Year: ${book.first_publish_year || 'N/A'}</p>
          </div>
          <button class="btn btn-outline-danger btn-sm w-100 mt-2" onclick="saveToFavorites('${book.key}')">Save to Favorites</button>
        </div>
      </div>
    `;
    bookList.appendChild(col);
  });
}

// Save Favorite Function
function saveToFavorites(bookKey) {
  const selectedBook = books.find(b => b.key === bookKey);
  
  if (selectedBook && !favorites.includes(selectedBook)) {
    favorites.push(selectedBook);
    document.getElementById('fav-count').textContent = favorites.length;
    alertMessage.innerHTML = `<div class="alert alert-info">Added "${selectedBook.title}" to favorites!</div>`;
  }
}

// Display Favorites Page
function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = '';

  if (favorites.length === 0) {
    favoritesList.innerHTML = '<p class="text-muted">No favorite books saved yet.</p>';
    return;
  }

  displayBooksInContainer(favorites, favoritesList);
}

function displayBooksInContainer(array, container) {
  array.forEach(function(book) {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 shadow-sm p-3">
        <h6>${book.title}</h6>
        <p class="small text-muted mb-0">Year: ${book.first_publish_year || 'N/A'}</p>
      </div>
    `;
    container.appendChild(col);
  });
}

// Display Community Reviews
function displayReviews() {
  reviewsList.innerHTML = '';

  reviews.forEach(function(r) {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 p-3 shadow-sm">
        <div class="d-flex justify-content-between">
          <strong class="text-primary">${r.title}</strong>
          <span class="badge bg-warning text-dark">${r.rating} Stars</span>
        </div>
        <p class="small text-muted mb-2">By: ${r.name}</p>
        <p class="mb-0">"${r.body}"</p>
      </div>
    `;
    reviewsList.appendChild(col);
  });
}

// Initialize page on load
fetchBooks('javascript');