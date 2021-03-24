let todo_list = [];
let folder_list =[];
let global_id = 0;
let current_folder = 0;

function add_to_do(text){
  const todo = {
    text,
    id : global_id,
    checked: false,
    editing:false,
    folder:current_folder,

  };
  const index = folder_list.findIndex(item => item.id === current_folder);
  folder_list[index].items.push(todo.id);
  global_id++;
  todo_list.push(todo);
  render(todo)
}

function add_folder(text){
  const folder ={
    name:text,
    id: global_id,
    items:[],

  };
  global_id++;
  folder_list.push(folder)
  renderFolder(folder)
}

function deleteFolder(key){
  const index = folder_list.findIndex(item => item.id === Number(key))
  const folder = folder_list[index]
  todo_list.forEach((item, i) => {
    if(folder.items.includes(item.id)){
      deleteTodo(item.id);
    }
  });
  const folderToDelete = {
      deleted:true,
      name:folder.name,
      id:folder.id,
      items:[],
    }
  folder_list = folder_list.filter(item => item.id !== Number(key));
  renderFolder(folderToDelete);
  }


function enterFolder(key){
  const index = folder_list.findIndex(item => item.id === Number(key));
  const folder = folder_list[index];
  hideFolders();
  toggleToDos(folder.items);
  changeDirectory(folder.name, folder.id);

}

function returnToRoot(){
  changeDirectory(folder_list[0].name, folder_list[0].id);
  folder_list.forEach((folder, i) => {
    renderFolder(folder)
  });
  const itemsToRender = folder_list[0].items;
  toggleToDos(itemsToRender)



}

function hideFolders(){
  const list = document.getElementById("folders-list");
  folder_list.forEach((folder, i) => {
    if(folder.id > 0){
      let item = document.querySelector(`[data-key='${folder.id}']`);
      item.remove()
    }
  });
}

function toggleToDos(items){
  const list = document.getElementById("todo-list");
  todo_list.forEach((todo, i) => {
      if(!items.includes(todo.id)){
        let item = document.querySelector(`[data-key='${todo.id}']`);
        if (item !== null){
          item.remove()
        }
      }
      else{
        render(todo)
      }
  });

}

function changeDirectory(folderName, folderId){
  const directory = document.getElementById("directory");
  directory.innerText = folderName;
  const new_folder_btn = document.getElementById("new-folder");
  if (folderName !== "root"){
  new_folder_btn.textContent = "Back";
  }
  else{
    new_folder_btn.textContent = "New Folder";
  }
  current_folder = folderId
}

function renderFolder(folder){
  if (folder.name !== "Root"){
    const list = document.getElementById("folders-list");
    const elem = document.createElement("li");
    const item = document.querySelector(`[data-key='${folder.id}']`);

    if (folder.deleted) {
     // remove the item from the DOM
     item.remove();
     return
   }

    elem.setAttribute('data-key', folder.id);
    elem.setAttribute("class", `folder`);
      elem.innerHTML = `
        <button class=folder-access>
          <img src="imgs/open-file-button.svg" />
        </button>
        <span>${folder.name}</span>
        <button class="delete-folder">
        <img src="imgs/trash.svg" /img>
        </button>
    `;
    list.append(elem)
  }
}

function toggleDone(key){
  const index = todo_list.findIndex(item => item.id === Number(key))
  todo_list[index].checked = !todo_list[index].checked;
  render(todo_list[index]);
}

function deleteTodo(key){
  const index = todo_list.findIndex(item => item.id === Number(key))
  const todo ={
    deleted:true,
    text:todo_list[index].text,
    id:todo_list[index].id,
    checked:todo_list[index].checked,
    folder:todo_list[index].folder,

  };
  const indexF = folder_list.findIndex(item => item.id === todo_list[index].folder)
  folder_list[indexF].items = folder_list[indexF].items.filter(item => item !== todo_list[index].id)
  todo_list = todo_list.filter(item => item.id !== Number(key));
  render(todo);
}

function beginEditTodo(key){
  const index = todo_list.findIndex(item => item.id === Number(key));
  todo_list[index].editing = true;
  render(todo_list[index]);
}

function confirmEditTodo(key){
  const index = todo_list.findIndex(item => item.id === Number(key));
  todo_list[index].editing = false;
  const new_text = document.getElementById("edit-text").value;
  todo_list[index].text = new_text;
  render(todo_list[index]);
}

function cancelEditTodo(key){
  const index = todo_list.findIndex(item => item.id === Number(key));
  todo_list[index].editing = false;
  render(todo_list[index]);
}

function noOneIsEditing(){
  let res = false;
  todo_list.forEach((item, i) => {
    res += item.editing
  });
  return !res
}

function render(todo){
  const list = document.getElementById("todo-list");
  const is_checked = todo.checked ? "done" : "";
  const is_editing = todo.editing ? "edit" : "";
  const elem = document.createElement("li");
  const item = document.querySelector(`[data-key='${todo.id}']`);


  if (todo.deleted) {
   // remove the item from the DOM
   if (item !== null){ //need this in case that im deleting a todo that is not renderized
     item.remove();
    }
   return
 }

  elem.setAttribute('data-key', todo.id);
  if (todo.editing){
    elem.setAttribute("class", `todo-item ${is_editing}`);
    elem.innerHTML = `
      <input id="${todo.id}" type="checkbox"/>
      <label for="${todo.id}" class="check"></label>
      <form><input type="text" id="edit-text" value=${todo.text}></input></form>
      <button class="edit-confirm">
      <img src="tick.svg"/>
      </button>
      <button class="edit-cancel">
      <svg><use href="#delete-icon"></use></svg>
      </button>
    `;
  }else{
    elem.setAttribute("class", `todo-item ${is_checked}`);
    elem.innerHTML = `
      <input id="${todo.id}" type="checkbox"/>
      <label for="${todo.id}" class="check"></label>
      <span>${todo.text}</span>
      <button class="edit-todo">
      <img src="editar.svg"/>
      </button>
      <button class="delete-todo">
      <svg><use href="#delete-icon"></use></svg>
      </button>
  `;
  }
  // If the item already exists in the DOM
 if (item) {
   // replace it
   list.replaceChild(elem, item);
 } else {
   // otherwise append it to the end of the list
   list.append(elem);
 }
}

window.onload = () =>{
  const form = document.getElementById("new-to-do");


  form.onsubmit = (e) =>{
    e.preventDefault();
    const todo = document.getElementById("to-do");
    const todo_text = todo.value.trim();
    if (todo_text != ""){
      add_to_do(todo_text);
      todo.value = "";
      todo.focus();
    }

  }
}

const list = document.getElementById("todo-list");
list.addEventListener("click", event =>{
  if(event.target.classList.contains("check")){
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey)
  }
  else if (event.target.classList.contains('delete-todo')) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey)
  }
  else if (event.target.classList.contains('edit-todo')  && noOneIsEditing() ) {
    const itemKey = event.target.parentElement.dataset.key;
    beginEditTodo(itemKey)
  }
  else if (event.target.classList.contains('edit-confirm')) {
    const itemKey = event.target.parentElement.dataset.key;
    confirmEditTodo(itemKey)
  }
  else if (event.target.classList.contains('edit-cancel')) {
    const itemKey = event.target.parentElement.dataset.key;
    cancelEditTodo(itemKey)
  }
});

add_folder("Root");
const buttonF = document.getElementById("new-folder");
buttonF.addEventListener("click", event =>{
  if (event.target.textContent === "New Folder"){
    folderName = document.getElementById("to-do").value; //change later to input-text
    add_folder(folderName);
  }
  else if(event.target.textContent === "Back"){
      returnToRoot();
  }
});

const listF = document.getElementById("folders-list");
listF.addEventListener("click", event =>{
  if(event.target.classList.contains("folder-access")){
    const itemKey = event.target.parentElement.dataset.key;
    enterFolder(itemKey);
  }
  else if (event.target.classList.contains("delete-folder")) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteFolder(itemKey);
  }
})
