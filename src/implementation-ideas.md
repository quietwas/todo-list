# Implementation Ideas — Todo List

## Module Structure (keep logic separate from DOM)

### `todo.js` — Todo class
- Fields: title, description, dueDate, priority, notes (array of strings), checklist (array of `{name, done}`)
- Completion status: `done` boolean + `toggleDone()` method
- Validation: reject empty title, invalid date, priority outside [low, medium, high]
- Serialization: `toJSON()` returning plain object; static `fromJSON(data)` to reconstruct with methods

### `project.js` — Project class
- Holds array of Todo objects
- Methods: `addTodo(todo)`, `removeTodo(index)`, `getTodo(index)`, `getTodos()`, `sortByDate()`, `sortByPriority()`
- Serialization: `toJSON()` / `fromJSON(data)` — key challenge: restore Todo methods after JSON parse

### `logic.js` — Application logic (no DOM)
- Store projects array + reference to active project
- Functions:
  - `addProject(title)` / `removeProject(title)`
  - `setActiveProject(title)` / `getActiveProject()`
  - `addTodoToProject(projectTitle, todo)` / `removeTodoFromProject(...)`
  - `saveToLocalStorage()` — call after every mutation
  - `loadFromLocalStorage()` — call on app init, handle missing data gracefully
- Default project created on first load if localStorage empty

### `dom.js` — DOM rendering & event binding
- Render sidebar: list of projects, "new project" button
- Render main view: todos in active project (title + dueDate, color-coded by priority)
- Render expanded todo view: show/edit all fields
- Event listeners delegate to logic.js functions
- Re-render on every state change (clear + rebuild, or targeted updates)

### `load.js` — Entry point
- Import and call `loadFromLocalStorage()`
- Trigger initial DOM render

## localStorage Persistence Strategy

1. `saveToLocalStorage()` — `JSON.stringify({projects, activeProjectTitle})` → `localStorage.setItem('todoApp', data)`
2. `loadFromLocalStorage()` — `localStorage.getItem('todoApp')` → `JSON.parse(data)` → reconstruct Project and Todo instances with their methods
3. **Key problem:** `JSON.parse` strips methods. Solutions to consider:
   - After parse, iterate and manually assign prototypes: `Object.setPrototypeOf(todo, Todo.prototype)`
   - Or use a `fromJSON` static method on each class
   - Or store plain objects and wrap them in class instances on load
4. Guard against missing/corrupted data: wrap in try/catch, fall back to default state

## date-fns Usage Ideas

- `format(todo.dueDate, 'MMM d, yyyy')` for display
- `isPast(dueDate)` / `isToday(dueDate)` to flag overdue items
- `compareAsc(a, b)` for sorting todos by date
- `addDays(today, 7)` for "next week" quick-filter

## UI Flow Ideas

- **Sidebar:** List of project names. Click to switch active project. "+" button to add project. "Delete" on hover.
- **Main area:** Header shows active project name. Grid/list of todo cards showing title + dueDate + priority indicator.
- **Todo card:** Color left border based on priority (red=high, yellow=medium, green=low). Click to expand inline or open detail panel.
- **Detail view:** Show/edit all fields. Checklist with add/toggle/remove. Delete button. Save button.
- **New todo:** Floating button or form at top. Modal or inline form.
- **Empty states:** "No todos yet" message when project empty.

## Stretch Features (after core done)

- Search/filter todos across all projects
- Keyboard shortcuts
- Drag-and-drop reorder
- Dark mode toggle
- Export/import JSON backup
