const supportedStores = ["walmart", "smiths"];

const shoppingLists = supportedStores.map((store) => `shoppingList_${store}`);

const capitalize = (str) => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const copyListToClipboard = (listName) => () => {
  chrome.storage.sync.get([listName], (result) => {
    const list = result[listName] || [];
    const text = list
      .sort((a, b) =>
        formatAisleForSort(a.aisle) > formatAisleForSort(b.aisle) ? 1 : -1
      )
      .map(({ title, aisle }) => `${aisle} - ${title}`)
      .join("\r\n");
    copyTextToClipboard(text);
  });
};

const makeListHeader = (listName) => {
  const store = capitalize(listName.replace("shoppingList_", ""));
  const headerEl = document.createElement("h2");
  headerEl.className = "shopping-list-header";
  headerEl.innerText = store;

  const clipboardButton = document.createElement("button");
  clipboardButton.onclick = copyListToClipboard(listName);
  clipboardButton.innerText = "Copy To Clipboard";
  clipboardButton.className = "copy-to-clipboard-button";
  headerEl.appendChild(clipboardButton);

  return headerEl;
};

const removeListItem = (listName, title, aisle) => () => {
  chrome.storage.sync.get([listName], (result) => {
    const list = result[listName] || [];
    const filteredList = list.filter(
      (item) => item.title !== title && item.aisle !== aisle
    );
    chrome.storage.sync.set({ [listName]: filteredList }, () => {
      location.reload();
    });
  });
};

const makeListItem = (listName, title, aisle) => {
  const itemEl = document.createElement("div");
  itemEl.className = "shopping-list-item";

  itemEl.innerHTML = `<span data-title="${title}"><strong>${aisle}</strong> - ${title}</span>`;

  const deleteButton = document.createElement("button");
  deleteButton.onclick = removeListItem(listName, title, aisle);
  deleteButton.innerText = "X";
  deleteButton.style.float = "right";
  deleteButton.style.color = "indianRed";
  itemEl.appendChild(deleteButton);

  return itemEl;
};

const formatAisleForSort = (aisle) => {
  aisleCode = aisle.replace("Aisle ", "");
  if (aisleCode.length > 2) return aisleCode;
  console.log(aisleCode, `${aisleCode[0]}0${aisleCode[1]}`);
  return `${aisleCode[0]}0${aisleCode[1]}`;
};

chrome.storage.sync.get(shoppingLists, (result) => {
  shoppingLists.forEach((listName) => {
    const list = result[listName] || [];
    sortedList = list.sort((a, b) =>
      formatAisleForSort(a.aisle) > formatAisleForSort(b.aisle) ? 1 : -1
    );
    const parentEl = document.getElementById("shopping-lists");

    const listEl = document.createElement("div");
    listEl.appendChild(makeListHeader(listName));

    sortedList.forEach(({ title, aisle }) => {
      listEl.appendChild(makeListItem(listName, title, aisle));
    });

    parentEl.appendChild(listEl);
  });
});

function resetList() {
  const clearedLists = shoppingLists.reduce((res, listName) => {
    res[listName] = [];
    return res;
  }, {});

  chrome.storage.sync.set(clearedLists);
  const listEl = document.getElementById("shopping-lists");
  listEl.innerHTML = "";
}

const clearButton = document.getElementById("clear-button");
clearButton.onclick = resetList;
