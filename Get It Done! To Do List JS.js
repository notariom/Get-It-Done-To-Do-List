//
// Maria Notario
// CSC 489 Project
// 08/09/2025
// 
// Get It Done! To Do List JS.js
//Ensures the DOM is fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const taskList = document.getElementById('taskList');

    // Load tasks from local storage on page loads
    loadTasks();

    // Event listener to add a new task when the user presses Enter in the input field
    todoInput.addEventListener('keypress', (e) => {
        //Check if the pressed key is 'Enter'
        if (e.key === 'Enter') {
            const taskText = todoInput.value.trim();//Get the trimmed value from the input field
            // If the task text is not empty, add the task, clear the input, ans save tasks
            if (taskText !== '') {
                addTask(taskText);//Calls function to add the task to then DOM
                todoInput.value = '';//Clears the input field
                saveTasks();// Saves the current tasks to local storage
            }
        }
    });

    // Event listener for clicks on the task list to handle checkboxes and buttons
    taskList.addEventListener('click', (e) => {
        //Find the closest task item (li element) to clicked target
        const clickedItem = e.target.closest('.task-item');
        // If no task item ws clicked, exit the function
        if (!clickedItem) return;

        // Handle checkbox clicks to mark tasks as completed or incomplete
        if (e.target.classList.contains('task-checkbox')) {
            //Toggles the 'completed' class based on the checkbox's checked state
            clickedItem.classList.toggle('completed', e.target.checked);
            saveTasks();// Saves the updated tasks to local storage
        }

        // Handle edit button clicks for a specific task
        if (e.target.closest('.edit-btn')) {
            // Get the span element containing the task text
            const taskTextSpan = clickedItem.querySelector('.task-text');
            editTask(taskTextSpan); // calls the function to edit the task text
        }

        // Handle delete button clicks for a specific task
        if (e.target.closest('.delete-btn')) {
            deleteTask(clickedItem); // Calls the function to delete the task item
        }
    });

    /**
     * Creates a new task item and adds it to the list.
     * @param {string} taskText The text content of the task.
     * @param {boolean} isCompleted The completion status of the task (default to false).
     */
    function addTask(taskText, isCompleted = false) {
        const li = document.createElement('li');// Creates a new list item element
        li.classList.add('task-item'); // Adds the 'task-item' class
        if (isCompleted) {
            li.classList.add('completed');
        }

        const checkbox = document.createElement('input'); // Creates a new input element for the checkbox
        checkbox.type = 'checkbox';// Sets the input type to checkbox
        checkbox.classList.add('task-checkbox');// Adds the 'task-checkbox' class
        checkbox.checked = isCompleted; // Sets the checkbox's state 

        const taskSpan = document.createElement('span');// Creates a new span element for the task text
        taskSpan.classList.add('task-text');// Adds the 'task-text' class
        taskSpan.textContent = taskText;// Sets the text content of the span

        // Create the container for the edit and delete buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('task-buttons');

        // Create the edit button
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn'); // Adds the 'edit-btn' class
        // Sets the inner HTML to include the Pencil.png image for the edit icon
        editBtn.innerHTML = '<img src="Pencil.png" alt="Edit">';
        
        // Create the delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn'); // Adds the 'delete-btn' class
        // Sets the inner HTML to include the Trash.png image for the delete icon
        deleteBtn.innerHTML = '<img src="Trash.png" alt="Delete">';

        // Append edit and delete buttons to the button container
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);

        // Append the checkbox, task text, and button container to the list item
        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(buttonContainer); // Add the button container to the list item

        taskList.appendChild(li); // Appends the new list item to the task list
    }

    /**
     * Edits the text content of a task.
     * @param {HTMLElement} taskSpan The span element containing the task text.
     */
    function editTask(taskSpan) {
        const currentText = taskSpan.textContent;// Get the current text of the task
        // Prompt the user to edit the task, pre-filling with current text
        const newText = prompt('Edit your task:', currentText);

        // If the user entered new text, and it is not just whitespace, update the task text and save
        if (newText !== null && newText.trim() !== '') {
            taskSpan.textContent = newText.trim();// Update the task text
            saveTasks();// Save the updated tasks to local storage
        }
    }

    /**
     * Deletes a task item from the list after the confirmation
     * @param {HTMLElement} taskItem The list item to be deleted.
     */
    function deleteTask(taskItem) {
        //Ask for confirmation before deleting the task
        if (confirm('Are you sure you want to delete this task?')) {
            taskItem.remove(); // Remove the task item from the DOM
            saveTasks(); // Save the updated tasks to local storage
        }
    }

    /**
     * Saves all current tasks in the list to local storage.
     * Each task is stored as an object with text and completion status.
     */
    function saveTasks() {
        const tasks = []; // Initialize an empty array to store tasks
        // Iterate over each task item in the list
        document.querySelectorAll('.task-item').forEach(item => {
            const taskText = item.querySelector('.task-text').textContent;//Get the task's text
            const isCompleted = item.classList.contains('completed');// Check if the task is completed
            // Push an object with the task text and completion status to the array
            tasks.push({ text: taskText, completed: isCompleted });
        });
        // Save the tasks array to local storage as a JSON string
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

    /**
     * Loads tasks from local storage when the page loads and adds them to the list.
     */
    function loadTasks() {
        // Retrieve saved tasks from local storage and parse the JSON string
        const savedTasks = JSON.parse(localStorage.getItem('todoTasks'));
        // If there are saved tasks, iterate through them and add each to the list
        if (savedTasks) {
            savedTasks.forEach(task => {
                addTask(task.text, task.completed); //Add each loaded task to the DOM
            });
        }
    }
});