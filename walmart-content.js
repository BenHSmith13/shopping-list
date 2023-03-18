const getTitle = () => {
  titleEl = document.getElementsByTagName("h1")[0];
  return titleEl.textContent;
};

const getAisle = () => {
  const aisleEl = document.querySelector(
    '[data-testid="product-aisle-location"]'
  );
  return aisleEl?.textContent;
};

const addToList = () => {
  const title = getTitle();
  const aisle = getAisle();

  saveToList("walmart", title, aisle);

  document.getElementById("bens-fancy-list-button").innerText = "Added!";
};

const insertAddToListButton = () => {
  const notOnproductPage = !window.location.href.includes("/ip/");
  const alreadyHasButton = !!document.getElementById("bens-fancy-list-button");
  if (notOnproductPage || alreadyHasButton) {
    return;
  }

  const addToCartButton = [...document.getElementsByTagName("button")].find(
    (e) => e.textContent == "Add to cart"
  );

  const parentDiv = addToCartButton.parentElement.parentElement;

  const addToListButton = document.createElement("button");
  addToListButton.className = addToCartButton.className;
  addToListButton.id = "bens-fancy-list-button";
  addToListButton.style = "margin-left: 10px;";

  const aisle = getAisle();
  if (aisle) {
    addToListButton.innerText = "Add to List";
    addToListButton.onclick = addToList;
  } else {
    addToListButton.innerText = "Not In Store";
    addToListButton.disabled = true;
  }

  parentDiv.appendChild(addToListButton);
};

const init = () => {
  window.setInterval(() => {
    insertAddToListButton();
  }, 1000);
};

init();
