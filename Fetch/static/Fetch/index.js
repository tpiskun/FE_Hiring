document.addEventListener('DOMContentLoaded', function() {
  //Call the function that fetches API
  call_api();
});

function call_api(){
  //Retrieve API Data to reroute and have the proxy apply the Access-Control-Allow-Origin: * header
  let url ='https://secret-ocean-49799.herokuapp.com/https://fetch-hiring.s3.amazonaws.com/hiring.json';
    fetch(url)
    .then(response => response.json())
    .then(data => {
      var groupedByListID = {};
      for (x in data){
        //set key values & group
        let list_id = data[x].listId;
        if (!groupedByListID[list_id]) {
            groupedByListID[list_id] = [];
        }
        groupedByListID[list_id].push(data[x]);
      }
      for(y in groupedByListID){
        for(z in groupedByListID[y]){
          let name = groupedByListID[y][z].name;
          //filter on null and blank items
          if (name !== null && name !== ""){
            let item = `List ID: ${groupedByListID[y][z].listId}, Name: ${name}`;
            console.log(item);
            //create html
            const element = document.createElement('li');
            element.innerHTML = item;
            document.querySelector('#api-view').append(element);
          }
        }
      }
    });
}
