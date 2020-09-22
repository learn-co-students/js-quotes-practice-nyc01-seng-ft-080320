document.addEventListener("DOMContentLoaded", () =>{
    
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
                    <span>0</span>
                </button>
                <button class='delete-button btn-danger'>Delete</button>
            </blockquote>
        `
        quoteUl.append(quoteLi)
    }

    const clickListener = () => {
        document.addEventListener('click', e => {

        })
    }

    const submitListener = () => {
        document.addEventListener('submit', e => {
            if(e.target.matches('#new-quote-form')){
                e.preventDefault()
                createNewQuote(e.target)
                //want to sent back data in a post request

            }
        })
    }

    const createNewQuote = el => {
        const form = el
        const newQuote = form.quote.value
        const newAuthor = form.author.value

        const quoteObj = {
            quote: newQuote,
            author: newAuthor
        }

        fetch('http://localhost:3000/quotes', postRequestOptionsForQuote(quoteObj))
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