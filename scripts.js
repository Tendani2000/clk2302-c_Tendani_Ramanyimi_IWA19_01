//imports variables BOOKS_PER_PAGE, authors, genres, and books from "data.js".
import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

//varible matches and assigns it the value of the books variable.
let matches = books;
let page = 1;
const range = [0, 10];

/*This line checks if the books variable is falsy/false or not an array. 
If either of these conditions is true, it throws an error with the message 'Source required'.*/
if (!books || !Array.isArray(books)) {
  throw new Error('Source required');
}
/*This line checks if the range variable is falsy or has a length less than 2. 
If either of these conditions is true, it throws an error with the message 'Range must be an array with two numbers'.*/
if (!range || range.length < 2) {
  throw new Error('Range must be an array with two numbers');
}

const day = {
  dark: '10, 10, 20',
  light: '255, 255, 255',
};

const night = {
  dark: '255, 255, 255',
  light: '10, 10, 20',
};

const fragment = document.createDocumentFragment();
const extracted = books.slice(0, 36);//This line creates a new array named extracted by slicing the first 36 elements from the books array.

/* function declaration for the createPreview function. It takes a parameter bookData and returns a preview element for a book.
 Inside the function, it creates and configures DOM elements (such as div, img, h2, and p) based on the bookData object and appends 
 them to the preview element.*/
function createPreview(bookData) {
  const { author, image, title } = bookData;

  const preview = document.createElement('div');
  preview.classList.add('preview');

  const previewImage = document.createElement('img');
  previewImage.src = image;
  previewImage.alt = title;
  preview.appendChild(previewImage);

  const previewTitle = document.createElement('h2');
  previewTitle.textContent = title;
  preview.appendChild(previewTitle);

  const previewAuthor = document.createElement('p');
  previewAuthor.textContent = authors[author];
  preview.appendChild(previewAuthor);

  return preview;
}

function createPreviewFragment(data, start, end) {
  const fragment = document.createDocumentFragment();

  /*This is a loop that iterates over the extracted array. For each element, it extracts the author, image, title, and id properties, 
  and calls the createPreview function to create a preview element. The preview element is then appended to the fragment.*/
  for (let i = start; i < end && i < data.length; i++) {
    const { author, image, title, id } = data[i];

    const preview = createPreview({
      author,
      id,
      image,
      title
    });

    fragment.appendChild(preview);
  }

  return fragment;
}

for (let i = 0; i < extracted.length; i++) {
  const { author, image, title, id } = extracted[i];

  const preview = createPreview({
    author,
    id,
    image,
    title
  });

  fragment.appendChild(preview);
}
/*This line selects an element with the attribute data-list-items using document.querySelector(), and appends the fragment 
(containing the preview elements) to that element.*/
document.querySelector('[data-list-items]').appendChild(fragment);

const genresFragment = document.createDocumentFragment();
let element = document.createElement('option');//The option elements are configured with values and names from the genres object and appended to the genresFragment.
element.value = 'any';
element.innerText = 'All Genres';
genresFragment.appendChild(element);

for (const [id, name] of Object.entries(genres)) {
  element = document.createElement('option');
  element.value = id;
  element.innerText = name;
  genresFragment.appendChild(element);
}

document.querySelector('[data-search-genres]').appendChild(genresFragment);

const authorsFragment = document.createDocumentFragment();
element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Authors';
authorsFragment.appendChild(element);

for (const [id, name] of Object.entries(authors)) {
  element = document.createElement('option');
  element.value = id;
  element.innerText = name;
  authorsFragment.appendChild(element);
}

document.querySelector('[data-search-authors]').appendChild(authorsFragment);

/*It checks if the value of that element is equal to 'dark'. If true, 
it assigns the night object to the css constant; otherwise, it assigns the day object.*/
const css = document.querySelector('[data-settings-theme]').value === 'dark' ? night : day;

document.documentElement.style.setProperty('--color-dark', css.dark);
document.documentElement.style.setProperty('--color-light', css.light);

/*This line selects an element with the attribute data-list-button and sets its textContent 
property to a string that includes the number of remaining books to be shown.*/
document.querySelector('[data-list-button]').textContent = `Show more (${Math.max(0, matches.length - page * BOOKS_PER_PAGE)})`;

/*This line selects an element with the attribute data-list-button and sets 
its disabled property based on the condition !(matches.length - page * BOOKS_PER_PAGE > 0).*/
document.querySelector('[data-list-button]').disabled === !(matches.length - page * BOOKS_PER_PAGE > 0);

/*This line selects an element with the attribute data-list-button and sets its innerHTML
 property to a multi-line string containing HTML code. This HTML code includes the text "Show more" and the number of remaining books.*/
document.querySelector('[data-list-button]').innerHTML = `
  <span>Show more</span>
  <span class="list__remaining">(${Math.max(0, matches.length - page * BOOKS_PER_PAGE)})</span>
`;

// This line selects an element with the attribute data-search-cancel and adds a click event listener to it.
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
  if (!document.querySelector('[data-search-overlay]').showModal()) {
  }
});

/*It checks if the element with the attribute data-search-overlay has a showModal() method. 
  If it doesn't, it means the method is not available or returns a falsy value.*/
document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
  if (!document.querySelector('[data-settings-overlay]').showModal().open()) {
  }
});

//This line selects an element with the attribute data-settings-form and adds a submit event listener to it.
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
  event.preventDefault();
});

document.querySelector('[data-list-close]').addEventListener('click', () => {
  if (!document.querySelector('[data-list-active]').showModal().open()) {
  }
});

document.querySelector('[data-list-button]').addEventListener('click', () => {
  const start = page * BOOKS_PER_PAGE;
  const end = (page + 1) * BOOKS_PER_PAGE;
  const fragment = createPreviewFragment(matches, start, end);
  document.querySelector('[data-list-items]').appendChild(fragment);
  document.querySelector('[data-list-button]').textContent = `Show more (${Math.max(0, matches.length - (page + 1) * BOOKS_PER_PAGE)})`;
  document.querySelector('[data-list-button]').disabled = !(matches.length - (page + 1) * BOOKS_PER_PAGE > 0);
  page++;
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
  if (document.querySelector('[data-search-overlay]').showModal()) {
    document.querySelector('[data-search-title]').focus();
  }
});

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').close();
   });


document.querySelector('[data-header-settings]').addEventListener('click', () => {
    if (document.querySelector('[data-settings-overlay]').showModal()) {
      document.querySelector('[data-settings-theme]').focus();
    }
  });

  document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').close();
   });

/* Handles the form submission by extracting form data, performing filtering operations on a list 
of books, updating the UI based on the filtered results, and scrolling to the top of the page*/
document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = [];

/*iterates over each book in the books array. It checks if the title of the book matches the filters.title 
(ignoring case sensitivity) and assigns the result to the titleMatch variable. It also checks if the author of the book matches the filters.
author or if the filters.author is set to 'any', 
and assigns the result to the authorMatch variable. Finally, it initializes the genreMatch variable as false.*/
  for (const book of books) {
    const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch = filters.author === 'any' || book.author === filters.author;
    let genreMatch = false;

    if (filters.genre === 'any') {
      genreMatch = true;
    } else {
      for (const genre of book.genres) {
        if (genre === filters.genre) {
          genreMatch = true;
          break;
        }
      }
    }

    if (titleMatch && authorMatch && genreMatch) {
      result.push(book);
    }
  }

  if (result.length < 1) {
    document.querySelector('[data-list-message]').classList.add('list__message');
  } else {
    document.querySelector('[data-list-message]').classList.remove('list__message');
  }

  /*
This clears the existing content inside the element with the attribute data-list-items
 and creates a new HTML fragment using the createPreviewFragment function, passing in the result data and a specified range.*/
  document.querySelector('[data-list-items]').innerHTML = '';
  const fragment = createPreviewFragment(result, range[0], range[1]);
  document.querySelector('[data-list-items]').appendChild(fragment);
  const initial = Math.max(0, result.length - page * BOOKS_PER_PAGE);
  const remaining = result.length > page * BOOKS_PER_PAGE ? initial : 0;

  document.querySelector('[data-list-button]').disabled = initial > 0;

  document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining">(${remaining})</span>
  `;

  window.scrollTo(0, 0);
  document.querySelector('[data-search-overlay]').open() = false;
});

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = Object.fromEntries(formData);
  /*Handles the form submission by extracting form data, 
  updating the CSS variables based on the selected theme, and closing the settings overlay.*/
  document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
  document.documentElement.style.setProperty('--color-light', css[result.theme].light);
  document.querySelector('[data-settings-overlay]').open() === false;
});
//Adds a click event listener to an element with the attribute data-list-items.
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
  const pathArray = Array.from(event.path || event.composedPath());
  let active = null;
//The code loops through the pathArray to find the first element with a preview attribute in its dataset and assigns its value to previewId.
  for (const node of pathArray) {
    const previewId = node?.dataset?.preview;

    for (const singleBook of books) {
      if (singleBook.id === previewId) {
        active = singleBook;
        break;
      }
    }

    if (active) {
      break;
    }
  }

  if (!active) {
    return;
  }

  document.querySelector('[data-list-active]').showModal();
document.querySelector('[data-list-blur]').src = active.image;
document.querySelector('[data-list-title]').textContent = active.title;
/*This line of code sets the text content of the element with the attribute 
data-list-subtitle to the author's name followed by the publication year of the active book.*/
document.querySelector('[data-list-subtitle]').textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
document.querySelector('[data-list-description]').textContent = active.description;

});