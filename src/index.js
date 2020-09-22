document.addEventListener("DOMContentLoaded", () =>{
    const quotesUrl = 'http://localhost:3000/quotes/'
    const likes = []


    const getQuotesAndRenderToDom = () => {
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(response => response.json())
        .then(quotes => {
            renderQuotes(quotes)
        })
    }

    const renderQuotes = quotes => {
        const quoteUl = document.querySelector("#quote-list")
        for(const quote of quotes){
            renderQuote(quote, quoteUl)
        }
    }
  
    const renderQuote = (quote, quoteUl) => {
        const quoteLi = document.createElement('li')
        quoteLi.classList.add('quote-card')
        quoteLi.dataset.quoteId = quote.id
        quoteLi.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='like-button btn-success'>Likes: 
                    <span>${quote.likes.length}</span>
                </button>
                <button class='delete-button btn-danger'>Delete</button>
            </blockquote>
        `
        quoteUl.append(quoteLi)
    }

    const clickListener = () => {
        document.addEventListener('click', e => {
            if(e.target.matches('.delete-button')){
                deleteQuote(e.target)
            } else if(e.target.matches('.like-button')){
                const quoteLi = e.target.closest('li')
                const quoteId = quoteLi.dataset.quoteId

                const likeObj = {
                    quoteId: parseInt(quoteId),
                    createdAt: Date.now()
                }

                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accepts": "application/json"
                    },
                    body: JSON.stringify(likeObj)
                }
                
                fetch('http://localhost:3000/likes/', options)
                .then(response => response.json())
                .then(like => {
                    const quoteUl = document.querySelector("#quote-list")
                    quoteUl.innerHTML = ''
                    getQuotesAndRenderToDom()
        
                })
            }
        })
    }

    const submitListener = () => {
        document.addEventListener('submit', e => {
            if(e.target.matches('#new-quote-form')){
                e.preventDefault()
                createNewQuote(e.target)
            }
        })
    }

    const deleteQuote = el => {
        const quoteLi = el.closest('li')
        const quoteId = quoteLi.dataset.quoteId

        const options = {
            method: "DELETE"
        }

        fetch(quotesUrl + quoteId, options)
            quoteLi.remove()
    }

    const createNewQuote = el => {
        const form = el
        const newQuote = form.quote.value
        const newAuthor = form.author.value

        const quoteObj = {
            quote: newQuote,
            author: newAuthor
        }

        fetch(quotesUrl, postRequestOptionsForQuote(quoteObj))
        .then(response => response.json())
        .then(quote => {
            const quoteUl = document.querySelector("#quote-list")
            renderQuote(quote, quoteUl)
            const form = el
            form.reset()
        })
    }
    const postRequestOptionsForQuote = quoteObj => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify(quoteObj)
        }
        return options
    }



    submitListener()
    clickListener()
    getQuotesAndRenderToDom()
})