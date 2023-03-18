const getTitle = () => {
  titleEl = document.getElementsByTagName("h1")[0];
  return titleEl.textContent;
};

const getAisle = () => {
  const aisleEl = document.getElementsByClassName(
    "kds-Text--s PurchaseOptions--aisleLocation text-default-900 ml-4"
  )[0];
  return aisleEl?.textContent?.replace("Located in AISLE", "Aisle") ?? "";
};

const addToList = () => {
  const title = getTitle();
  const aisle = getAisle();

  saveToList("smiths", title, aisle);

  document.getElementById("bens-fancy-list-button").innerText = "Added!";
};

const insertAddToListButton = () => {
  const notOnproductPage = !window.location.href.includes("/p/");
  const alreadyHasButton = !!document.getElementById("bens-fancy-list-button");
  if (notOnproductPage || alreadyHasButton) {
    return;
  }

  const addToCartButton = [...document.getElementsByTagName("button")].find(
    (e) => e.textContent == "Add to cart" || e.textContent == "Sign In to Add"
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
  console.log("Hello World!");
  window.setInterval(() => {
    insertAddToListButton();
  }, 1000);
};

init();
