function saveOptions(e) {
 browser.storage.local.set({
  notion_api_key: document.querySelector("#notion_api_key").value
 });
 e.preventDefault();
}

function restoreOptions() {
 let gettingItem = browser.storage.local.get('notion_api_key');
 gettingItem.then((res) => {
  document.querySelector("#notion_api_key").value = res.notion_api_key || '';
 });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
