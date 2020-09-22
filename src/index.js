


const BASE_URL = "http://localhost:3000/quotes?_embed=likes"
const LIKES_URL = "http://localhost:3000/likes"
const QUOTES_URL = "http://localhost:3000/quotes/"
const quoteList = document.getElementById("quote-list")
const form = document.getElementById("new-quote-form")
const body = document.querySelector("body")

document.addEventListener("DOMContentLoaded", ()=>{
    
    // fetch Quotes from API
    const getQuotes = (url) =>{
        fetch(url)
        .then(response => response.json())
        .then(data => renderQuotes(data))
    }

    // Render Quotes to Page
    const renderQuotes = (dataArray) =>{
        for (let i = 0; i < dataArray.length; i++) {
            const quote = dataArray[i];

            let li = document.createElement('li')
            li.classList.add('quote-card')
            li.innerHTML = `
                <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success' data-id = "${quote.id}">Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger' data-id = "${quote.id}">Delete</button>
                </blockquote>
            `
            quoteList.append(li)
        }
    }

    // Submite New Quote
    const submitQuote = () =>{
        
        const quote = {
            quote: document.getElementById("new-quote").value,
            author:document.getElementById("author").value, 
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        }

        fetch(BASE_URL, options)
        .then(response => response.json())
        .then(console.log)
    }

    // Increase Likes
    const likeQuote = (id) => {
        const newLike = {
                quoteId: id
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newLike)
        }

        fetch(LIKES_URL, options)
        .then(response => response.json())
        .then(console.log)
    }

    // Delete Quotes
    const deleteQuote = (id) => {
        const newLike = {
            quoteId: id
    }

    const options = {
        method: 'DELETE',
    }

    fetch(QUOTES_URL + id, options)
    .then(response => response.json())
    .then(console.log)
    }

    const clickHandler = () => {
        form.addEventListener('click', ()=>{
            event.preventDefault()
            
            switch (event.target.id) {
                case "submit-btn":
                    submitQuote()
                    console.log("submit-btn")
                    break;
            }
        })

        body.addEventListener('click', ()=>{
            
            let btnId = parseInt(event.target.dataset.id)
            
            switch (event.target.className) {
                case "btn-success":
                    likeQuote(btnId)
                    break;
                case "btn-danger":
                    deleteQuote(btnId)
                    break;
            }
        })
    }


    getQuotes(BASE_URL)
    clickHandler()
})