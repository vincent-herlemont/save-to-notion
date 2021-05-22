function getMeta(metaName) {
 const metas = document.getElementsByTagName('meta');
 
 for (let i = 0; i < metas.length; i++) {
  if (metas[i].getAttribute('name') === metaName || metas[i].getAttribute('property') === metaName) {
   return metas[i].getAttribute('content');
  }
 }
 
 return '';
}

// Save button

let save_button_container = document.createElement("div");
save_button_container.style.all = "revert";
save_button_container.style.position = "fixed";
save_button_container.style.borderStyle = "solid";
save_button_container.style.borderColor = "gray";
save_button_container.style.backgroundColor = "white";
save_button_container.style.bottom = "10px";
save_button_container.style.left = "10px";
save_button_container.style.borderRadius = "3px";
save_button_container.style.zIndex = "99999";

let button = document.createElement("button");
button.style.all = "revert";
button.style.padding = "10px";
button.innerText = "Save to Notion";
button.addEventListener("click", (e) => {
 if (typeof browser !== 'undefined') {
  e.target.disabled = true;
  browser.runtime.sendMessage({type: "stn_list_databases"});
 }
});
save_button_container.appendChild(button);

document.body.appendChild(save_button_container);

if (typeof browser !== 'undefined') {
 browser.runtime.onMessage.addListener((data, sender) => {
  if (data.type === 'stn_list_databases') {
   return popupSave(data)
  }
  return false;
 });
}

// Popup save.

let selectedDatabaseIds = [];

function popupSave(databases) {
 let popup_container = document.createElement("div");
 popup_container.style.all = "revert";
 popup_container.style.display = "flex";
 popup_container.style.flexDirection = "column";
 popup_container.style.position = "fixed";
 popup_container.style.borderStyle = "solid";
 popup_container.style.borderColor = "gray";
 popup_container.style.backgroundColor = "white";
 popup_container.style.zIndex = "99999";
 popup_container.style.top = "10px";
 popup_container.style.right = "5%";
 popup_container.style.width = "90%";
 popup_container.style.height = "100px";
 
 function addDatabase(database) {
  console.log("database",database)
  let database_container = document.createElement("div");
  database_container.style.all = "revert";
  database_container.style.display = "flex";
  database_container.style.borderBottomStyle = "solid";
  database_container.style.borderBottomColor = "gray";
  database_container.style.borderBottomWidth = "1px";
  database_container.style.margin = "5px";
 
  let database_checkbox = document.createElement("input");
  database_checkbox.type = "checkbox"
  database_checkbox.style.all = "revert";
  database_checkbox.dataset.id = database.id;
  database_checkbox.addEventListener("change",(e) => {
   let id = e.target.dataset.id;
   if (e.target.checked) {
    selectedDatabaseIds.push(id);
   } else {
    selectedDatabaseIds = selectedDatabaseIds.filter((databaseId) => databaseId !== id)
   }
   console.log(selectedDatabaseIds);
  });
  
  database_container.appendChild(database_checkbox);
  
  let database_title = document.createElement("div");
  database_title.style.all = "revert";
  database_title.innerText = database.title[0].plain_text
  
  database_container.appendChild(database_title);
  popup_container.appendChild(database_container);
 }
 
 for (const database of databases.data.results) {
  addDatabase(database);
 }
 
 
 let button = document.createElement("button");
 button.style.all = "revert";
 button.style.padding = "10px";
 button.innerText = "Send to Notion";
 button.addEventListener("click", () => {
  if (typeof browser !== 'undefined') {
   document.body.removeChild(popup_container);
   let image = getMeta('og:image') || getMeta('2image');
   console.log("image",image);
   let title = getMeta('og:title') || document.title;
   console.log("title",title);
   let description = getMeta('og:description') || getMeta('description')
   console.log("description",description);
   
   browser.runtime.sendMessage({type: "stn_save_to_databases", "ids": selectedDatabaseIds, data: {
     image: image,
     title: title,
     description: description,
     url: window.location.href
   }});
  }
 });
 
 popup_container.appendChild(button);
 document.body.appendChild(popup_container);
}