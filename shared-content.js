const saveToList = (store = "walmart", title, aisle) => {
  const listName = `shoppingList_${store}`;

  chrome.storage.sync.get([listName], (result) => {
    const list = result[listName] || [];
    list.push({ title, aisle });
    chrome.storage.sync.set({ [listName]: list });
  });
};
