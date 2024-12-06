import { TodoList } from './todoList.js';
import { DateTimeUtils } from './dateTimeUtils.js';

const todoList = new TodoList();

// DOM Elements
const todoInput = document.getElementById('todoInput');
const dateTimeInput = document.getElementById('dateTimeInput');
const addButton = document.getElementById('addButton');
const filterButtons = document.querySelectorAll('.filter-btn');

// Set minimum datetime to now
dateTimeInput.min = DateTimeUtils.formatDateTimeLocal(new Date());

// Event Listeners
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('input', () => hideError(todoInput));
dateTimeInput.addEventListener('input', () => hideError(dateTimeInput));

filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const filter = e.target.dataset.filter;
        setActiveFilter(button);
        todoList.filterTodos(filter);
    });
});

// Show error message for invalid input
function showError(input, message) {
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    input.classList.add('invalid');
}

// Hide error message
function hideError(input) {
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    input.classList.remove('invalid');
}

// Add a new task with validation
function addTodo() {
    const text = todoInput.value.trim();
    const dateTime = dateTimeInput.value;
    let isValid = true;

    // Validate task name
    if (!text) {
        showError(todoInput, "Task name cannot be empty.");
        isValid = false;
    } else {
        hideError(todoInput);
    }

    // Validate date and time
    const parsedDate = new Date(dateTime);
    if (!dateTime || isNaN(parsedDate.getTime()) || parsedDate <= new Date()) {
        showError(dateTimeInput, "Please select a valid future date and time.");
        isValid = false;
    } else {
        hideError(dateTimeInput);
    }

    if (!isValid) return;

    // Add the valid task
    todoList.addTodo(text, parsedDate);
    todoInput.value = '';
    dateTimeInput.value = '';
}

function setActiveFilter(activeButton) {
    filterButtons.forEach(button => button.classList.remove('active'));
    activeButton.classList.add('active');
}

// Initialize the app
todoList.initialize();
