document.addEventListener("DOMContentLoaded", () => {

    const GET_QUOTES_URL = "http://localhost:3000/quotes?_embed=likes"
    const QUOTES = "http://localhost:3000/quotes"

    const getQuotes = () => {
        fetch(GET_QUOTES_URL)
        .then(response => response.json())
        .then(quotes => renderQuotes(quotes))
    }

    const renderQuotes = quotes => {
        const quoteUl = document.querySelector("#quote-list")
        quoteUl.innerHTML = ""
        quotes.map(renderQuote)
    }

    const renderQuote = quote => {
        const quoteUl = document.querySelector("#quote-list")
        const quoteLi = document.createElement("li")
        quoteLi.classList.add("quote-card")
        quoteLi.dataset.quote_id = quote.id

        const quoteBlock = document.createElement("blockquote")
        quoteBlock.innerHTML = `
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
        `

        quoteLi.append(quoteBlock)
        quoteUl.append(quoteLi)
    }

    const submitHandler = () => {
        document.addEventListener("submit", (e) => {
            e.preventDefault();
            const form = e.target

            const quoteObj = {
                quote: form.querySelector("#new-quote").value,
                author: form.querySelector("#author").value
            }

            const fetchOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(quoteObj)
            }

            fetch(GET_QUOTES_URL, fetchOptions)
            .then(response => response.json())
            .then(quote => {
                getQuotes()
                form.reset()
            })
        })
    }

    const clickHandler = () => {
        document.addEventListener("click", (e) => {
            if (e.target.matches(".btn-success")) {

            } else if (e.target.matches(".btn-danger")) {
                const quoteId = e.target.closest("li").dataset.quote_id
                deleteQuote(quoteId)
            }
        })
    }

    const deleteQuote = quoteId => {
        const delUrl = QUOTES+"/"+quoteId
        const fetchOptions = {
            method: "DELETE"
        }

        fetch(delUrl, fetchOptions)
        .then(response => response.json())
        .then(getQuotes())
    }

    clickHandler();
    submitHandler();
    getQuotes();

})