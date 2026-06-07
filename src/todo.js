export default class Todo {
  constructor(title, desc, dueDate, priority) {
    this.title = title;
    this.desc = desc;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = [];
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }
}
