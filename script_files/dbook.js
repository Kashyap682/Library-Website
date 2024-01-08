let data;

document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        window.location.href = "login.html";
    } else {
        const bookListContainer = document.getElementById("book-list");
        let currentRow;

        fetch('/script_files/books.json')
            .then(response => response.json())
            .then(receivedData => {
                data = receivedData;
                data.books.forEach((book, index) => {
                    if (index % 6 === 0) {
                        currentRow = document.createElement("div");
                        currentRow.classList.add("book-row");
                        bookListContainer.appendChild(currentRow);
                    }

                    const bookDiv = createBookDiv(book);
                    currentRow.appendChild(bookDiv);
                });
            })
            .catch(error => {
                console.error("Error loading JSON file:", error);
            });

        const searchInput = document.getElementById("search-input");
        const searchButton = document.getElementById("search-button");
        const searchResults = document.getElementById("search-results");

        function createBookDiv(book) {
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book");

            const bookCover = document.createElement("img");
            bookCover.src = book.coverImage;
            bookCover.alt = book.name;

            const bookTitle = document.createElement("h2");
            bookTitle.textContent = book.name;

            const bookAuthor = document.createElement("p");
            bookAuthor.textContent = "Author: " + book.author;

            const bookISBN = document.createElement("p");
            bookISBN.textContent = "ISBN: " + book.isbn;

            const bookDescription = document.createElement("p");
            bookDescription.textContent = "Description: " + book.description;

            bookDiv.appendChild(bookCover);
            bookDiv.appendChild(bookTitle);
            bookDiv.appendChild(bookAuthor);
            bookDiv.appendChild(bookISBN);
            bookDiv.appendChild(bookDescription);

            return bookDiv;
        }

        function performSearch(query) {
            if (query.trim() === "") {

                searchResults.innerHTML = "";
                return;
            }

            const filteredBooks = data.books.filter((book) => {
                const lowerCaseQuery = query.toLowerCase();
                return (
                    book.name.toLowerCase().includes(lowerCaseQuery) ||
                    book.author.toLowerCase().includes(lowerCaseQuery) ||
                    book.isbn.includes(query)
                );
            });


            searchResults.innerHTML = "";

            if (filteredBooks.length === 0) {
                searchResults.innerHTML = "No results found.";
            } else {
                let currentRow;
                filteredBooks.forEach((book, index) => {
                    if (index % 6 === 0) {
                        currentRow = document.createElement("div");
                        currentRow.classList.add("book-row");
                        searchResults.appendChild(currentRow);
                    }

                    const bookDiv = createBookDiv(book);
                    currentRow.appendChild(bookDiv);
                });
            }
        }


        searchButton.addEventListener("click", function () {
            const query = searchInput.value;
            performSearch(query);
        });

        searchInput.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                const query = searchInput.value;
                performSearch(query);
            }
        });
    }
});