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
        <button class="btn-secondary">Edit</button>
        `

        quoteLi.append(quoteBlock)
        quoteUl.append(quoteLi)
    }

    const submitHandler = () => {
        document.addEventListener("submit", (e) => {
            if (e.target.matches("#new-quote-form")) {
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
            } else if (e.target.matches("#edit-quote-form")) {
                e.preventDefault();
                const form = e.target
                const quoteId = form.parentElement.dataset.quote_id

                const quoteObj = {
                    quote: form.querySelector("#edit-quote").value,
                    author: form.querySelector("#edit-author").value
                }

                const fetchOptions = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(quoteObj)
                }

                fetch(QUOTES+"/"+quoteId, fetchOptions)
                .then(response => response.json())
                .then(quote => {
                    getQuotes()
                })
            }
        })
    }

    const clickHandler = () => {
        document.addEventListener("click", (e) => {
            const quoteId = e.target.closest("li").dataset.quote_id
            if (e.target.matches(".btn-success")) {
                likeQuote(quoteId)
            } else if (e.target.matches(".btn-danger")) {
                deleteQuote(quoteId)
            } else if (e.target.matches(".btn-secondary")) {
                if (!e.target.closest("li").querySelector("#edit-quote-form")) {
                    buildForm(quoteId)
                }
            }
        })
    }

    const buildForm = quoteId => {
        const li = document.querySelector(`[data-quote_id='${quoteId}']`)

        const quote = li.querySelector("p").textContent
        const author = li.querySelector("footer").textContent

        const form = document.createElement("form")
        
        form.id = "edit-quote-form"
        form.innerHTML = `
          <div class="form-group">
            <label for="edit-quote">Edit Quote</label>
            <input name="quote" type="text" class="form-control" id="edit-quote">
          </div>
          <div class="form-group">
            <label for="Author">Edit Author</label>
            <input name="author" type="text" class="form-control" id="edit-author">
          </div>
          <button type="submit" class="btn btn-info">Edit Quote</button>`
          form.quote.value = quote
          form.author.value = author

          li.append(form)


    }

    const likeQuote = quoteId => {
        const likesUrl = "http://localhost:3000/likes"

        const likeObj = {
            quoteId: parseInt(quoteId),
            createdAt: Math.floor(Date.now()/1000)
        }

        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(likeObj)
        }

        fetch(likesUrl, fetchOptions)
        .then(response => response.json())
        .then(like => {
            getQuotes();
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