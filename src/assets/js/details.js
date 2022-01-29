import '../css/style.css'

"use strict";

const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";
const COVER_BASE_URL = "https://covers.openlibrary.org/b/id/";
const bookTitle = document.querySelector("#title");
const cover = document.querySelector("#cover");
const authors = document.querySelector('#authors');
const publishDate = document.querySelector('#first-publish-date');
const description = document.querySelector("#description");
const errorMessage = document.querySelector('.error-message');

getBookDetails();

function getBookDetails(){
    let bookKey = sessionStorage.getItem("bookKey");
    requestBookDetails(bookKey)
        .catch(e => {
            errorMessage.innerHTML = "❌Error Loading Page❌";
            console.log(e);
        });
}

async function requestBookDetails(bookKey){
    const response = await fetch(OPEN_LIBRARY_BASE_URL + bookKey + ".json");
    const bookDetails = await response.json();
    console.log(bookDetails);
    if(bookDetails){
        let bookAuthors = await Promise.all(bookDetails.authors.map(getAuthorsName));
        showDetails(bookDetails, bookAuthors);
    }else{
        errorMessage.innerHTML = "No Result";
    }
}

async function getAuthorsName(authorUrl){
    let authorResponse =  await fetch(OPEN_LIBRARY_BASE_URL + authorUrl.author.key +".json");
    let authorData = await authorResponse.json();
    return authorData.name;
}

function showDetails(book, bookAuthors){
    let coverUrl = COVER_BASE_URL + book.covers[0] + "-L.jpg";
    cover.setAttribute("src", coverUrl);
    bookTitle.innerHTML = book.title;
    authors.innerHTML = bookAuthors.toString();

    publishDate.innerHTML = book["first_publish_date"];
    if(book.description?.value){
        description.innerHTML = book.description.value;
    }else{
        description.innerHTML = book.description;
    }
    
}
