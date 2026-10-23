// App State
let books = [];
let favorites = [];
let reviews = [];

// DOM Elements
const searchPage = document.getElementById('search-page');
const favoritesPage = document.getElementById('favorites-page');
const reviewsPage = document.getElementById('reviews-page');
const aboutPage = document.getElementById('about-page');
const contactPage = document.getElementById('contact-page');

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const bookList = document.getElementById('book-list');
const loadingText = document.getElementById('loading-text');
const alertMessage = document.getElementById('alert-message');
const sortSelect = document.getElementById('sort-select');

const navSearchBtn = document.getElementById('nav-search-btn');
const navFavsBtn = document.getElementById('nav-favs-btn');
const navReviewsBtn = document.getElementById('nav-reviews-btn');
const navAboutBtn = document.getElementById('nav-about-btn');
const navContactBtn = document.getElementById('nav-contact-btn');

const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');
const contactForm = document.getElementById('contact-form');

// SPA Navigation
function showPage(pageName) {
  searchPage.classList.add('d-none');
  favoritesPage.classList.add('d-none');
  reviewsPage.classList.add('d-none');
  aboutPage.classList.add('d-none');
  contactPage.classList.add('d-none');

  navSearchBtn.classList.remove('active');
  navFavsBtn.classList.remove('active');
  navReviewsBtn.classList.remove('active');
  navAboutBtn.classList.remove('active');
  navContactBtn.classList.remove('active');

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
    fetchReviews();
  } else if (pageName === 'about') {
    aboutPage.classList.remove('d-none');
    navAboutBtn.classList.add('active');
  } else if (pageName === 'contact') {
    contactPage.classList.remove('d-none');
    navContactBtn.classList.add('active');
  }
}

// Event Listeners: Navigation
navSearchBtn.addEventListener('click', () => showPage('search'));
navFavsBtn.addEventListener('click', () => showPage('favorites'));
navReviewsBtn.addEventListener('click', () => showPage('reviews'));
navAboutBtn.addEventListener('click', () => showPage('about'));
navContactBtn.addEventListener('click', () => showPage('contact'));

// Event Listeners: Forms
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (query !== '') fetchBooks(query);
});

reviewForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const newReview = {
    title: document.getElementById('review-title').value,
    name: document.getElementById('review-name').value,
    rating: document.getElementById('review-rating').value,
    body: document.getElementById('review-body').value
  };
  sendPostRequest(newReview);
});

contactForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  alertMessage.innerHTML = `<div class="alert alert-success">Thank you ${name}! Your message has been sent.</div>`;
  contactForm.reset();
});

// Event Listener: Sort Dropdown
sortSelect.addEventListener('change', function(event) {
  const selectedValue = event.target.value;
  if (selectedValue === 'newest') {
    books.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
  } else if (selectedValue === 'oldest') {
    books.sort((a, b) => (a.first_publish_year || 9999) - (b.first_publish_year || 9999));
  }
  displayBooks(books);
});

// GET Request for Books (Open Library API)
async function fetchBooks(query) {
  loadingText.classList.remove('d-none');
  alertMessage.innerHTML = '';
  bookList.innerHTML = '';

  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
    if (!response.ok) throw new Error('Failed to reach the API server.');

    const data = await response.json();
    if (data.docs.length === 0) {
      alertMessage.innerHTML = `<div class="alert alert-warning">No books found for "${query}".</div>`;
      loadingText.classList.add('d-none');
      return;
    }

    books = data.docs;
    displayBooks(books);

  } catch (error) {
    alertMessage.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
  } finally {
    loadingText.classList.add('d-none');
  }
}

// GET Request for Reviews (Local json-server)
async function fetchReviews() {
  try {
    const response = await fetch('http://localhost:3000/reviews');
    if (!response.ok) throw new Error('Failed to load reviews.');
    reviews = await response.json();
    displayReviews();
  } catch (error) {
    console.log('Error loading reviews:', error.message);
  }
}

// POST Request for Reviews (Local json-server)
async function sendPostRequest(reviewData) {
  try {
    const response = await fetch('http://localhost:3000/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) throw new Error('Could not submit review to server.');

    const savedReview = await response.json();
    reviews.unshift(savedReview);
    displayReviews();
    reviewForm.reset();
    alertMessage.innerHTML = `<div class="alert alert-success">Review saved to db.json!</div>`;

  } catch (error) {
    alertMessage.innerHTML = `<div class="alert alert-danger">Error submitting review: ${error.message}</div>`;
  }
}

// Display Functions
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

function saveToFavorites(bookKey) {
  const selectedBook = books.find(b => b.key === bookKey);
  if (selectedBook && !favorites.includes(selectedBook)) {
    favorites.push(selectedBook);
    document.getElementById('fav-count').textContent = favorites.length;
    alertMessage.innerHTML = `<div class="alert alert-info">Added "${selectedBook.title}" to favorites!</div>`;
  }
}

function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = '';

  if (favorites.length === 0) {
    favoritesList.innerHTML = '<p class="text-muted">No favorite books saved yet.</p>';
    return;
  }

  favorites.forEach(function(book) {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `
      <div class="card h-100 shadow-sm p-3">
        <h6>${book.title}</h6>
        <p class="small text-muted mb-0">Year: ${book.first_publish_year || 'N/A'}</p>
      </div>
    `;
    favoritesList.appendChild(col);
  });
}

function displayReviews() {
  reviewsList.innerHTML = '';

  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p class="text-muted">No reviews yet.</p>';
    return;
  }

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

// Initial Load
fetchBooks('javascript');
fetchReviews();