document.addEventListener('DOMContentLoaded', ()=> {

    const fetchQuotes = () => {
        
        fetch(`http://localhost:3000/quotes?_embed=likes`)
        .then(resp => resp.json())
        .then(quotes => renderQuotes(quotes))
    }

    const renderQuotes = quotes => {
        const quoteUl = document.querySelector('#quote-list')

        for(let quote of quotes){
            renderQuote(quote, quoteUl)
        }
    }

    const renderQuote = (quote, quoteUl) => {
        const li = document.createElement('li')
        li.dataset.id = quote.id

        li.innerHTML = `
            <blockquote class="blockquote">
               <p class="mb-0">${quote.quote}</p>
              <footer class="blockquote-footer">${quote.author}</footer>
               <br>
               <button class='btn-success' data-quote-id=${quote.id}>Likes: <span>0</span></button>
               <button class='btn-info' data-quote-id=${quote.id}>Edit</button>
               <button class='btn-danger' data-quote-id=${quote.id}>Delete</button>
            </blockquote>
        `
        quoteUl.append(li)
        renderLikes(quote, li)    
    }

    const renderLikes = (quote, li) => {
        const likes = quote.likes.length
        const span = li.querySelector('span')

        span.textContent = likes
        
    }

    const submitHandler = () => {
        document.addEventListener('submit', e => {

            if(e.target.matches('#new-quote-form')){
                e.preventDefault()
                const quoteForm = e.target
                const newQuote = e.target.quote.value
                const author = e.target.author.value
    
                const quote = {
                    quote: newQuote,
                    author: author
                }
    
                saveQuote(quote)
            }else if(e.target.matches('.edit-form')){
                e.preventDefault()
                editQuote(e.target)
            }

        })
    }

    const editQuote = target => {
        const quote = target.quote.value
        const author = target.author.value
        const id = target.dataset.id
        
        updatedQuote = {
            quote: quote,
            author: author
        }

        let options = {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(updatedQuote)
        }

        fetch(`http://localhost:3000/quotes/${id}`, options)
        .then(resp => resp.json())
        .then(quote => {
            renderUpdatedQuote(quote, target)
        })
    }
    
    const renderUpdatedQuote = (quote, target) => {
        const id = quote.id
        const quoteBlock = target.parentElement
        const newQuote = quoteBlock.querySelector('p')
        const author = quoteBlock.querySelector('footer')
        
        newQuote.textContent = quote.quote
        author.textContent = quote.author
        
    }
    
    const saveQuote = quote => {
        const quoteUl = document.querySelector('#quote-list')   

        let options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(quote)
        }

        fetch('http://localhost:3000/quotes', options)
        .then(resp => resp.json())
        .then(updatedQuotes => fetchQuotes())
    }

    const clickHandler = () => {
        document.addEventListener('click', e => {
            if(e.target.matches('.btn-danger')){
                deleteQuote(e.target)
            }else if(e.target.matches('.btn-success')){
                updateLikes(e.target)
            }else if(e.target.textContent === "Edit"){
                showForm(e.target)
            }else if(e.target.textContent === "Hide"){
                hideForm(e.target)
            }
        })
    }

    const hideForm = target => {
        const parentEl = target.parentElement
        const form = parentEl.querySelector('form')
        form.remove()
        target.textContent = "Edit"
    }

    const showForm = target => {
        const button = target
        const parentEl = button.parentElement
        const editForm = document.createElement('form')
        editForm.className = "edit-form"
        parentEl.insertAdjacentElement('beforeend', editForm)
        editForm.dataset.id = target.dataset.quoteId
        editForm.innerHTML = `
            <label>Quote</label>
            <input type="text" id="quote" name="quote" placeholder="edit quote"><br>
            <label>Author</label>
            <input type="text" id="author" name="author" placeholder="edit author"><br><br>
            <input type="submit" value="Submit">
        `
        button.textContent = "Hide"
            
    }

    const deleteQuote = target => {
        const quoteId = target.dataset.quoteId
        
        let options = {
            method: "DELETE"
        }

        fetch(`http://localhost:3000/quotes/${quoteId}`, options)
        .then(resp => resp.json())
        .then(data => removeQuote(target))
    }

    const removeQuote = target => {
        const quoteId = target.dataset.quoteId
        
        const quoteLi = document.querySelector(`[data-id="${quoteId}"]`)
        quoteLi.remove()
    }

    const updateLikes = target => {
        const currentLikes = parseInt(target.querySelector('span').textContent)
        const newLikes = currentLikes + 1
        const quoteId = target.dataset.quoteId
        
        updateLikeDb(quoteId, newLikes)
    }

    const updateLikeDb = (quoteId, newLikes) => {
        let updateId = parseInt(quoteId)
        let options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({
                quoteId: updateId
            })
        }

        fetch('http://localhost:3000/likes/', options)
        .then(resp => resp.json())
        .then(data => displayUpdatedLike(data))
    }

    const displayUpdatedLike = data => {
        const li = document.querySelector(`[data-id="${data.quoteId}"]`)
        const span = li.querySelector('span')
        const newLikes = parseInt(span.textContent) + 1
        span.textContent = newLikes
    }

    clickHandler()
    fetchQuotes()
    submitHandler()
})










