const form = document.querySelector('#task-input-form');

//inputs from user
const taskInput = document.querySelector('#task-input-field');
const descInput = document.querySelector('#description-input-field');

//created tasks are shown on this div, on the right half of window
const display = document.querySelector('#right-div');

//template for the card that displays task information and task options
const template = document.querySelector('#card-template');

//to use when storing the tasks in browser storage
const LOCAL_STORAGE_PREFIX = 'TASK-MANAGER-BASIC';
const LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-tasks`;

//loads existing tasks or sets tasks to an empty array if no tasks exist
//if tasks exist, show them all
let tasks = loadTasks();
tasks.forEach(renderTask);

//expand/collapse description based on click event
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-button-expand]')) {
    const card = e.target.closest('.card');
    const description = card.querySelector('.task-description-toggle');
    e.target.innerText == 'EXPAND'
      ? (e.target.innerText = 'COLLAPSE')
      : (e.target.innerText = 'EXPAND');
    description.classList.toggle('hide');
  }
});

document.addEventListener('click', (e) => {
  if (e.target.matches('.card-body') || e.target.matches('.task-title')) {
    const card = e.target.closest('.card');
    const description = card.querySelector('.task-description-toggle');
    description.classList.toggle('hide');
    const btn = card.querySelector('[data-button-expand]');
    btn.innerText == 'EXPAND'
      ? (btn.innerText = 'COLLAPSE')
      : (btn.innerText = 'EXPAND');
  }
});

//DELETE TASK
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-button-delete]')) {
    const card = e.target.closest('.card');
    const taskId = card.dataset.taskId;
    card.remove();
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
  }
});

//ADD TASK
//steps: create a task object with title, description, and ID
//render the task and save the task into storage
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (taskInput.value === '') {
    alert('cant add blank');
    return;
  }
  const newTask = {
    name: taskInput.value,
    description: descInput.value,
    id: new Date().valueOf().toString(),
  };

  renderTask(newTask);
  tasks.push(newTask);
  saveTasks();
  taskInput.value = '';
  descInput.value = '';
});

//get saved tasks from storage, if no tasks saved return empty array
function loadTasks() {
  const tasksString = localStorage.getItem(LOCAL_STORAGE_KEY);
  return JSON.parse(tasksString) || [];
}

//save current tasks into local storage
function saveTasks() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}

//set values for a card and display that card
//card has a title, description, expand button and delete button
//task description is hidden by default, can be shown by clicking expand
function renderTask(task) {
  const templateClone = template.content.cloneNode(true);
  const card = templateClone.querySelector('.card');
  card.dataset.taskId = task.id;
  const taskDescription = templateClone.querySelector('.task-description');
  taskDescription.innerText = task.description;
  const taskTitle = templateClone.querySelector('.task-title');
  taskTitle.innerText = task.name;
  display.append(templateClone);
}
