import '../css/style.css'

"use strict";

const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";
const COVER_BASE_URL = "https://covers.openlibrary.org/b/id/";
const searchInput = document.querySelector("#search-bar");
const searchBtn = document.querySelector("#search-btn");
const searchResults = document.querySelector("#search-results");
const searchForm = document.forms.form;
const errorMessage = document.querySelector(".error-message");

searchForm.addEventListener("submit", getBooks);


// Display a maximum of 50 books
function showBooksResults(books) {
    searchResults.style.backgroundColor = "#A8D0E6";
    searchResults.innerHTML = "";
    
    books.forEach(book => {
        
        let bookElement = document.createElement("div");
        bookElement.classList.add("book");

        let authorsList = [];
        authorsList = book.authors.map(author => {
                return author.name;
        });
        
        // Get the first 3 authors
        let authors = "";
        if(authorsList.length > 3){
            authors = authorsList.slice(0, 3).toString().replaceAll(",", ", ");
          
        }else{
            authors = authorsList.toString().replaceAll(",", ", ");
        }

        bookElement.innerHTML = `
            <a href="#" data-book-key='${book.key}'">
                <img class="book-cover-m" src="${COVER_BASE_URL + book.cover_id + "-M.jpg"}"
                    alt = "${book.title}"/>
            </a>
            <h3>${book.title}</h3>
            <p>${authors}</p>
            `;
        
        searchResults.appendChild(bookElement);

        searchResults.addEventListener("click", handleSelectedBook);
    });
}

function handleSelectedBook(e){
    let target = e.target;
    console.log(target);
    if(target.matches("img")){
        // target.parentElement is "a" element which contains data-book-key attribute
        openBookDetails(target.parentElement.dataset.bookKey);
    }
}

// Search all books of a specified category
async function requestCategoryBooksData(category){
    const response = await fetch( `${OPEN_LIBRARY_BASE_URL}/subjects/${category}.json?limit=50`);
    const data = await response.json();

    let books = data.works;
    console.log(books);
    if(books && books.length > 0){
        showBooksResults(books);
    }else{
        errorMessage.innerHTML = "No Result ☹️";
    }
    
}

function getBooks(e){
    e.preventDefault();
    errorMessage.innerHTML = "";
    let inputValue = searchInput.value;

    if(inputValue){
        let categoryFormatted = inputValue.replaceAll('-', '_');
        categoryFormatted = categoryFormatted.replaceAll(" ", "_")
        requestCategoryBooksData(categoryFormatted)
            .catch(e => {
                errorMessage.innerHTML = "❌Error Loading Page❌";
                console.log(e);
            });
        
    }
    
}

function openBookDetails(selectedBookKey){
    console.log(selectedBookKey);
    sessionStorage.setItem("bookKey", selectedBookKey );
    window.location = "details.html";
}

searchInput.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      event.preventDefault();
      // Trigger the search button with a click
      searchBtn.click();
    }
});