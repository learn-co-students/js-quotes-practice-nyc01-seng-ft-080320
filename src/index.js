document.addEventListener('DOMContentLoaded', e => {
  const renderQuote = (currentQuote) => {
    const quotesUl = document.querySelector('#quote-list');

    const newLi = document.createElement('li');
    newLi.className = 'quote-card';
    newLi.dataset.quoteId = currentQuote.id;

    const newBQ = document.createElement('blockquote');
    newBQ.className = 'blockquote';

    const newP = document.createElement('p');
    newP.className = 'mb-0';
    newP.textContent = currentQuote.quote;
    newBQ.append(newP);

    const newFooter = document.createElement('footer');
    newFooter.className = 'blockquote-footer';
    newFooter.textContent = currentQuote.author;
    newBQ.append(newFooter);

    const newBr = document.createElement('br');
    newBQ.append(newBr);

    const likeButton = document.createElement('button');
    likeButton.className = 'btn-success';
    likeButton.innerHTML = `Likes: <span>${currentQuote.likes.length}</span>`;
    newBQ.append(likeButton);

    const editButton = document.createElement('button');
    editButton.className = 'btn-secondary';
    editButton.textContent = "Edit";
    newBQ.append(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-danger';
    deleteButton.textContent = "Delete";
    newBQ.append(deleteButton);

    newLi.append(newBQ);
    quotesUl.append(newLi);
  };

  const renderQuotes = (quotes) => {
    for (let quote of quotes) {
      renderQuote(quote);
    }
  };

  const getQuotes = () => {
    // remove any preexisting quotes since we're rerendering them all
    const quotesUl = document.querySelector('#quote-list');
    while (quotesUl.firstElementChild) {
      quotesUl.firstElementChild.remove();
    }


    fetch('http://localhost:3000/quotes?_embed=likes')
      .then(resp => resp.json())
      .then(json => renderQuotes(json));
  };

  const addQuote = (newQuote, newAuthor) => {
    fetch('http://localhost:3000/quotes', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        quote: newQuote,
        author: newAuthor,
        likes: []
      })
    })
      .then(resp => resp.json())
      .then(json => renderQuote(json));
  };

  const deleteQuote = (quoteId) => {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({

      })
    })
      .then(resp => resp.json())
      .then(() => getQuotes())
  };

  const addLike = (quoteId) => {

    fetch(`http://localhost:3000/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        quoteId: parseInt(quoteId, 10),
        createdAt: Date.now()
      })
    })
      .then(resp => resp.json())
      .then(json => getQuotes());
  };

  const createForm = (editButton, quote, author) => {
    const quoteBQ = editButton.parentElement;
    quoteBQ.firstElementChild.remove();
    quoteBQ.firstElementChild.remove();

    const newForm = document.createElement('form');
    newForm.className = 'edit-quote-form'
    newForm.innerHTML = `
      <div class="form-group">
        <label for="edit-quote">Edit Quote</label>
        <input name="quote" type="text" class="form-control" id="edit-quote">
      </div>
      <div class="form-group">
        <label for="edit-author">Edit Author</label>
        <input name="author" type="text" class="form-control" id="edit-author">
        </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    `;

    newForm.quote.value = quote;
    newForm.author.value = author;

    quoteBQ.append(newForm);
  };

  const editQuote = (editButton) => {
    const quote = editButton.parentElement.firstElementChild.textContent;
    const author = editButton.parentElement.firstElementChild.nextElementSibling.textContent;

    createForm(editButton, quote, author);
  };

  const patchQuote = (form) => {
    const editedQuote = form.quote.value;
    const editedAuthor = form.author.value;
    const quoteId = parseInt(form.parentElement.parentElement.dataset.quoteId, 10);

    console.log(quoteId)

    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        quote: editedQuote,
        author: editedAuthor
      })
    })
      .then(resp => resp.json())
      .then(json => getQuotes())
  }

  const addSortButton = () => {
    const sortButton = document.createElement('button');
    sortButton.className = 'btn-info';
    sortButton.textContent = "sort quotes by author";
    const quotesUl = document.querySelector('#quote-list');
    quotesUl.parentNode.insertBefore(sortButton, quotesUl);
  }

  const clickHandler = () => {
    document.addEventListener('submit', e => {
      e.preventDefault();

      if (e.target.matches('#new-quote-form')) {
        const form = e.target;
        const newQuote = form.quote.value;
        const newAuthor = form.author.value;
        addQuote(newQuote, newAuthor);
        form.quote.value = '';
        form.author.value = '';
      } else if (e.target.matches('.edit-quote-form')) {
        patchQuote(e.target);
      }
    });

    document.addEventListener('click', e => {
      if (e.target.matches('.btn-danger')) {
        // button's parent = blockquote; grandparent = li
        const quoteId = e.target.parentElement.parentElement.dataset.quoteId;
        deleteQuote(quoteId);
      } else if (e.target.matches('.btn-success')) {
        const quoteId = e.target.parentElement.parentElement.dataset.quoteId;
        addLike(quoteId);
      } else if (e.target.matches('.btn-secondary')) {
        editQuote(e.target);
      } else if (e.target.matches('.btn-info')) {
        const quotesUl = document.querySelector('#quote-list');
        while (quotesUl.firstElementChild) {
          quotesUl.firstElementChild.remove();
        }

        fetch('http://localhost:3000/quotes?_embed=likes&_sort=author')
          .then(resp => resp.json())
          .then(json => renderQuotes(json));
      }
    });
  };

  addSortButton();
  getQuotes();
  clickHandler();
});