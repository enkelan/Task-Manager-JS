const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const tasksFile = "tasks.json";
let tasks = [];

function saveTasksToFile() {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

function loadTasksFromFile() {
  try {
    if (fs.existsSync(tasksFile)) {
      const data = fs.readFileSync(tasksFile, "utf8");
      tasks = JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading tasks from file:", error.message);
    tasks = [];
  }
}

function clearConsole() {
  process.stdout.write("\x1B[2J\x1B[0f");
}

function showMenu() {
  clearConsole();
  const menuText = `
  Welcome to your task manager. Press:
  1. to see all your tasks
  2. to add a task
  3. to delete a task
  4. to mark a task as done
  5. to Exit the task manager
  `;

  process.stdout.write(menuText);

  rl.question("", (answer) => {
    switch (answer) {
      case "1":
        showTasks();
        break;
      case "2":
        rl.question("Enter task to add: ", (task) => {
          addTask(task);
        });
        break;
      case "3":
        rl.question("Enter index of task to delete: ", (index) => {
          deleteTask(index);
        });
        break;
      case "4":
        rl.question("Enter index of task to mark as done: ", (index) => {
          markTaskAsDone(index);
        });
        break;
      case "5":
        saveTasksToFile();
        console.log("Exiting task manager.");
        rl.close();
        break;
      default:
        console.log("Invalid input. Please try again.");
        showMenu();
        break;
    }
  });
}

function showTasks() {
  clearConsole();
  console.log("\nYour Tasks:");
  if (tasks.length === 0) {
    console.log("No tasks found.");
  } else {
    tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task}`);
    });
  }
  rl.question("\nPress Enter to go back to the main menu...", () => {
    showMenu();
  });
}

function addTask(task) {
  tasks.push(task);
  saveTasksToFile();
  console.log("Task added successfully.");
  rl.question("\nPress Enter to go back to the main menu...", () => {
    showMenu();
  });
}

function deleteTask(index) {
  const taskIndex = parseInt(index) - 1;
  if (taskIndex >= 0 && taskIndex < tasks.length) {
    tasks.splice(taskIndex, 1);
    saveTasksToFile();
    console.log("Task deleted successfully.");
  } else {
    console.log("Invalid task index.");
  }
  rl.question("\nPress Enter to go back to the main menu...", () => {
    showMenu();
  });
}

function markTaskAsDone(index) {
  const taskIndex = parseInt(index) - 1;
  if (taskIndex >= 0 && taskIndex < tasks.length) {
    const completedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    saveTasksToFile();
    console.log(
      `Marked task "${completedTask}" as done. \u001b[32m\u2714\u001b[0m`
    );
  } else {
    console.log("Invalid task index.");
  }
  rl.question("\nPress Enter to go back to the main menu...", () => {
    showMenu();
  });
}

loadTasksFromFile();

showMenu();
