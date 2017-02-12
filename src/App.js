import React, { Component } from 'react';
import TodoItem from './components/TodoItem';
import LocalDB from './actions/LocalDB';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      todos: [],
      newTodoText: ""
    }
  }
  componentWillMount(){
    const that = this;
    LocalDB.init()
    .then( () => {
      LocalDB.getAll()
      .then( (todo_list) => {
        that.setState( { todos: todo_list});
      });
    });
  }
  componentWillUnmount(){
    LocalDB.close();
  }
  todoTextUpdate = ( e) => {
    this.setState( { newTodoText: e.target.value});
  };
  catchEnter = (e) => {
    if( e.key === "Enter" && this.state.newTodoText !== ""){
      this.createTodo( this.state.newTodoText);
    }
  };
  createTodoClick = (e) => {
    if( this.state.newTodoText !== ""){
      this.createTodo( this.state.newTodoText);
    }
  };
  clearTodoText = () => {
    this.setState( { newTodoText: ""});
  };
  createTodo = ( text) => {
    // TODO: don't think we need that with => syntax
    const that = this;
    console.log( "creating new todo:", text);
    LocalDB.createTodo( text)
    .then( (created_date) => {
      console.log( "todo added is:", created_date);
      that.setState( { todos: [...that.state.todos, { date: created_date, text: that.state.newTodoText}]});
      that.clearTodoText();
    });
  };
  completeCheck = (e) => {
    console.log( "checked:", e.target.checked);
  };
  render() {
    return (
      <div className="page-wrapper">
        <h1>Todo List</h1>
        <div className="list-wrapper">
          <ul>
            { this.state.todos.map( (todo,i) => {
                return <TodoItem key={i} item={todo} completeCheck={this.completeCheck}></TodoItem>;
              })}
          </ul>
        </div>
        <div className="new-todo-wrapper">
          <input type="text" onChange={this.todoTextUpdate} onKeyUp={this.catchEnter}
            placeholder="New todo text"
            value={this.state.newTodoText} />
          <button type="button" className="btn-blue" onClick={this.createTodoClick} >Create</button>
        </div>
      </div>
    );
  }
}

export default App;
