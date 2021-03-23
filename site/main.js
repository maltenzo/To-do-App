let todo_list = [];
let global_id = 0;

function add_to_do(text){
  const todo = {
    text,
    id : global_id,
    checked: false,
    editing:false,
  };
  global_id++;
  todo_list.push(todo);
  render(todo)
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
  };
  todo_list = todo_list.filter(item => item.id !== Number(key));
  render(todo);
}

function beginEditTodo(key){
  const index = todo_list.findIndex(item => item.id === Number(key));
  todo_list[index].editing = true;
  render(todo_list[index]);
}

function confimrEditTodo(key){
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
   item.remove();
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
    console.log(event.target.parentElement.dataset.key)
    beginEditTodo(itemKey)
  }
  else if (event.target.classList.contains('edit-confirm')) {
    console.log(event.target.parentElement.dataset.key)
    const itemKey = event.target.parentElement.dataset.key;
    confimrEditTodo(itemKey)
  }
  else if (event.target.classList.contains('edit-cancel')) {
    const itemKey = event.target.parentElement.dataset.key;
    cancelEditTodo(itemKey)
  }
});
