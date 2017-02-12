import React, { Component } from 'react';
import TodoItem from './components/TodoItem';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      todos: [],
      newTodoText: ""
    }
    this.idb = null;
  }
  componentWillMount(){
    this.startDB();
  }
  componentWillUnmount(){
    if( this.idb){
      this.idb.close();
    }
  }
  startDB(){
    const that = this;
    const open = window.indexedDB.open("todoDB", 1);
    open.onupgradeneeded = () => {
      this.idb = open.result;
      this.idb.createObjectStore( "todoDB", { keyPath: "date"});
    };
    open.onsuccess = () => {
      var todo_list = [];
      this.idb = open.result;
      const tx = this.idb.transaction( "todoDB", "readonly");
      const store = tx.objectStore( "todoDB");
      store.openCursor().onsuccess = (event) => {
        const cur = event.target.result;
        if( cur){
          todo_list.push( cur.value);
          cur.continue();
        } else {
          that.setState( { todos: todo_list});
        }
      };
      // we don't want to close db here!
      // tx.oncomplete = () => {
      //   db.close();
      // };
    };
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
    const that = this;
    console.log( "creating new todo:", text);
    const tx = this.idb.transaction( "todoDB", "readwrite");
    const store = tx.objectStore( "todoDB");
    store.add( { date: new Date(), text: this.state.newTodoText})
    .onsuccess = (e) => {
      console.log( "todo added is:", e.target.result);
      that.setState( { todos: [...that.state.todos, { date: e.target.result, text: this.state.newTodoText}]});
      that.clearTodoText();
    };
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
