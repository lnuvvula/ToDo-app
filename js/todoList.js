import { Timer } from './timer.js';
import { DateTimeUtils } from './dateTimeUtils.js';

export class TodoList {
    constructor() {
        this.todos = [];
        this.todoList = document.getElementById('todoList');
        this.currentFilter = 'all';
    }

    initialize() {
        this.loadTodos();
        this.renderTodos();
    }

    addTodo(text, dueDate) {
        if (!DateTimeUtils.isValidDate(dueDate)) {
            alert('Invalid date format');
            return;
        }

        const now = new Date();
        const diffInSeconds = Math.floor((dueDate - now) / 1000);
        
        if (diffInSeconds <= 0) {
            alert('Please select a future date and time');
            return;
        }

        const todo = {
            id: Date.now(),
            text,
            completed: false,
            dueDate: dueDate.toISOString(),
            timer: new Timer(diffInSeconds)
        };

        this.todos.push(todo);
        this.saveTodos();
        this.renderTodos();
        todo.timer.start(() => this.updateTimer(todo.id));
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodos();
        }
    }

    deleteTodo(id) {
        const index = this.todos.findIndex(t => t.id === id);
        if (index !== -1) {
            const todo = this.todos[index];
            todo.timer.stop();
            this.todos.splice(index, 1);
            this.saveTodos();
            this.renderTodos();
        }
    }

    updateTimer(id) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            const todo = this.todos.find(t => t.id === id);
            if (todo) {
                const timerElement = todoElement.querySelector('.timer');
                const timeInfo = todo.timer.getTimeString();
                try {
                    const dueDate = new Date(todo.dueDate);
                    if (!DateTimeUtils.isValidDate(dueDate)) {
                        throw new Error('Invalid date');
                    }
                    timerElement.innerHTML = `
                        <div>${DateTimeUtils.formatDateTime(dueDate)}</div>
                        <div>Time left: ${timeInfo}</div>
                    `;
                    this.updateTimerStyle(timerElement, todo.timer.getTimeLeft());
                } catch (error) {
                    this.deleteTodo(id);
                }
            }
        }
    }

    updateTimerStyle(timerElement, timeLeft) {
        timerElement.classList.remove('warning', 'danger');
        if (timeLeft <= 3600) { // 1 hour
            timerElement.classList.add('danger');
        } else if (timeLeft <= 7200) { // 2 hours
            timerElement.classList.add('warning');
        }
    }

    filterTodos(filter) {
        this.currentFilter = filter;
        this.renderTodos();
    }

    renderTodos() {
        this.todoList.innerHTML = '';
        const filteredTodos = this.getFilteredTodos();

        filteredTodos.forEach(todo => {
            try {
                const dueDate = new Date(todo.dueDate);
                if (!DateTimeUtils.isValidDate(dueDate)) {
                    throw new Error('Invalid date');
                }

                const li = document.createElement('li');
                li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
                li.dataset.id = todo.id;

                li.innerHTML = `
                    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                    <div class="todo-content">
                        <span class="todo-text">${todo.text}</span>
                        <span class="timer">
                            <div>${DateTimeUtils.formatDateTime(dueDate)}</div>
                            <div>Time left: ${todo.timer.getTimeString()}</div>
                        </span>
                    </div>
                    <button class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                `;

                const checkbox = li.querySelector('.todo-checkbox');
                const deleteBtn = li.querySelector('.delete-btn');

                checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
                deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

                this.todoList.appendChild(li);
            } catch (error) {
                // Skip rendering invalid todos and remove them from the list
                this.deleteTodo(todo.id);
            }
        });
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    saveTodos() {
        const todosData = this.todos.map(todo => ({
            id: todo.id,
            text: todo.text,
            completed: todo.completed,
            dueDate: todo.dueDate,
            timeLeft: todo.timer.getTimeLeft()
        }));
        localStorage.setItem('todos', JSON.stringify(todosData));
    }

    loadTodos() {
        try {
            const savedTodos = localStorage.getItem('todos');
            if (savedTodos) {
                const todosData = JSON.parse(savedTodos);
                this.todos = todosData.map(todo => {
                    try {
                        const dueDate = new Date(todo.dueDate);
                        if (!DateTimeUtils.isValidDate(dueDate)) {
                            throw new Error('Invalid date');
                        }
                        const now = new Date();
                        const diffInSeconds = Math.max(0, Math.floor((dueDate - now) / 1000));
                        return {
                            ...todo,
                            timer: new Timer(diffInSeconds)
                        };
                    } catch (error) {
                        return null;
                    }
                }).filter(todo => todo !== null);

                this.todos.forEach(todo => {
                    if (todo.timer.getTimeLeft() > 0) {
                        todo.timer.start(() => this.updateTimer(todo.id));
                    }
                });
            }
        } catch (error) {
            console.error('Error loading todos:', error);
            this.todos = [];
            localStorage.removeItem('todos');
        }
    }
}