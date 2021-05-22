async function getApiKey() {
 let gettingItem = browser.storage.local.get('notion_api_key');
 let notion_api_key = await gettingItem.then((res) => res.notion_api_key);
 console.log("notion_api_key",notion_api_key);
 return notion_api_key;
}

async function list_databases(sender) {
 let notion_api_key = await getApiKey();
 
 let dataResponse = await fetch('https://api.notion.com/v1/databases',{
  headers: {
   'Authorization': 'Bearer '+notion_api_key,
   'Notion-Version': '2021-05-13'
  },
  referrerPolicy: "no-referrer-when-downgrade",
  mode: "same-origin",
 }).then(response => response.json());
 
 console.log("data",dataResponse);
 
 await browser.tabs.sendMessage(sender.tab.id,{
  type: 'stn_list_databases',
  data: dataResponse,
 })
 console.log("OK !");
}

browser.runtime.onMessage.addListener((data, sender) => {
 if (data.type === 'stn_list_databases') {
  return list_databases(sender)
 }
 return false;
});

async function save_to_databases(data,sender) {
 console.log("data",data,sender);
 let notion_api_key = await getApiKey();
 
 for (id of data.ids) {
  let dataResponse = await fetch('https://api.notion.com/v1/pages',{
   method: 'POST',
   headers: {
    'Authorization': 'Bearer '+notion_api_key,
    'Notion-Version': '2021-05-13',
    'Content-Type': 'application/json'
   },
   referrerPolicy: "no-referrer-when-downgrade",
   mode: "same-origin",
   body: JSON.stringify({
    parent: {
     database_id: id,
    },
    properties: {
     Name: {
      title: [
       {
        text: {
         content:data.data.title,
        }
       }
      ]
     },
     Url: {
      url: data.data.url
     }
    }
   })
  }).then(response => response.json());
 
  console.log(dataResponse);
 }
}

browser.runtime.onMessage.addListener((data, sender) => {
 if (data.type === 'stn_save_to_databases') {
  return save_to_databases(data,sender)
 }
 return false;
});
