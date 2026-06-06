import Todo from "./todo.js"

export default class Project {
    constructor(title){
        this.title = title
        this.todos = []
    }
}