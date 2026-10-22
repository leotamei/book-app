# 📚 Book Explorer App (Module 2 Project)

Welcome to my Module 2 Software Development project! **Book Explorer** is a Single Page Application (SPA) built using HTML5, CSS3, Bootstrap 5, and JavaScript.

The app allows users to search an online library database, save favorite books, sort search results, and post custom reviews to a community feed.

---

## 🌟 Features

- **SPA View Switching:** Switch between **Search**, **Favorites**, and **Reviews** tabs without refreshing the web browser.
- **Live Book Search:** Query thousands of books using the public Open Library API.
- **Favorites List:** Save books to a personal list and track total count with a dynamic navigation badge.
- **Result Sorting:** Dynamically sort rendered book results by publication year (*Newest First* / *Oldest First*).
- **Submit Reviews:** Post user reviews to a test server endpoint and render them live on the feed.
- **User-Friendly Error Handling:** Dynamic alert banners display error messages if an API call fails or if no results are found.

---

## ✅ Module Requirements Checklist

| Requirement | How It Is Implemented |
| :--- | :--- |
| **Single Page Application (SPA)** | HTML sections (`#search-page`, `#favorites-page`, `#reviews-page`) are toggled using JavaScript (`classList.add('d-none')` and `classList.remove('d-none')`). |
| **GET Request** | `fetchBooks()` makes an asynchronous `fetch()` GET request to `https://openlibrary.org/search.json?q=`. |
| **POST Request** | `sendPostRequest()` sends review data to `https://jsonplaceholder.typicode.com/posts` using `method: 'POST'` and JSON payload headers. |
| **3 Event Listeners** | **1. `'submit'`** — Handles search & review form submissions (`e.preventDefault()`).<br>**2. `'change'`** — Triggers list re-sorting on the dropdown menu.<br>**3. `'click'`** — Handles SPA tab switches and saving favorites. |
| **Error Handling** | API calls are wrapped in `try...catch` blocks with explicit `!response.ok` checks to render alert banners dynamically. |

---

## 🔌 External APIs Used

1. **Open Library Search API (GET):**  
   `https://openlibrary.org/search.json?q={query}&limit=12`  
   *Used to fetch book titles, authors, cover IDs, and publication years.*

2. **JSONPlaceholder API (POST):**  
   `https://jsonplaceholder.typicode.com/posts`  
   *Used to simulate sending user review data to a backend server.*

---

## 📁 Project Structure

```text
book-app/
├── index.html     # Main HTML document containing all 3 view sections
├── styles.css     # Custom CSS styles
├── script.js      # Main JavaScript logic, event listeners, and API calls
└── README.md      # Project documentation
```

---

## 🚀 How to Run the Project

1. Clone or download this project folder to your computer.
2. Open the folder in **VS Code**.
3. Right-click `index.html` and select **Open with Live Server** (or double-click `index.html` to open it in any web browser).
4. Enter a search query like `"Harry Potter"` or `"JavaScript"` in the search bar to explore books!

---

## 👤 Author

Developed as part of the **Module 2: JavaScript Fundamentals** curriculum.