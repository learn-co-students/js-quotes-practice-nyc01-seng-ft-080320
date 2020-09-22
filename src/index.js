document.addEventListener("DOMContentLoaded", e => {
const baseUrl = "http://localhost:3000/quotes/" //use for creating and deleting
const likesUrl = "http://localhost:3000/quotes?_embed=likes"; //include likes

//fetch get request all of the 
const fetchQuotes = () => {

    fetch(likesUrl)
    .then(res => res.json())
    .then(quotesData => renderQuotes(quotesData))
}

//function to iterate over the QuotesData
const renderQuotes = quotesArray => {
    for (const quote of quotesArray) {
        createQuoteLi(quote);
    }
}

//function to create li single quotes 
const createQuoteLi = quoteObj => {
    const quoteLi = document.createElement('li');
    quoteLi.className = 'quote-card';
    quoteLi.dataset.quoteId = quoteObj.id;
    quoteLi.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">
      ${quoteObj.quote}
      </p>
      <footer class="blockquote-footer">
      ${quoteObj.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>0</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
    `;

    const quoteList = document.querySelector("#quote-list");
    quoteList.appendChild(quoteLi);

}

//submit the quote New Form. POST to both db & DOM
// submit handler to listen
const submitHandler = () => {
    document.addEventListener("submit", e => {
        e.preventDefault();
        postNewQuote(e.target)
        


    })
}

// function to find all of the input values
const postNewQuote = form => {
   const quote = form.quote.value;
   const author = form.author.value;

    const newQuote = {
        quote: quote,
        author: author
    }

    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify(newQuote)
    }
//fetch request to post in db, update DOM with response in json
    fetch(baseUrl, options)
    .then(res => res.json())
//function to create the single quote and append (use createQuoteLi)
    .then(newPost => {
        createQuoteLi(newPost)
        form.reset();
    })

}
//delete button & like button
//clickHandler
const clickHandler = () => {
    document.addEventListener("click", e => {
        if (e.target.matches(".btn-danger")) {
        deleteQuoteFromDb(e.target)
        //add clickListener for the Likes 
        } else if (e.target.matches(".btn-success")) {
            postLikeInDb(e.target);
        }
    })
}


//create a function that will send the POST request to localhost:3000/likes
    const postLikeInDb = likeButton => {
        const urlForLikes = "http://localhost:3000/likes";
        const blockQuote = likeButton.parentElement;
        const quoteLi = blockQuote.parentElement;
        const quoteId = quoteLi.dataset.quoteId;
        let ts = Math.round((new Date()).getTime() / 1000);
        const likeNumber = likeButton.querySelector('span');
        const newLikeNumber = parseInt(likeNumber.textContent) + 1;
        likeNumber.textContent = newLikeNumber;

        const likeObject = {
            quoteId: quoteId,
            createdAt: ts
        }
        
        const options = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify(likeObject)
        }
        fetch(urlForLikes, options)
        .then(response => response.json())
        .then(likeObj => console.log(likeNumber))
        }

        //function for posting the like on the DOM


//delete fetch request to remove the quote on the db
const deleteQuoteFromDb = delButton => {
    const blockQuote = delButton.parentElement;
    const quoteLi = blockQuote.parentElement;
    const quoteId = quoteLi.dataset.quoteId;
    
    fetch(baseUrl + quoteId, {
        method: "DELETE"
    }).then(response => response.json())
    .then(quoteObj => quoteLi.remove())
}



fetchQuotes();
submitHandler();
clickHandler();

})