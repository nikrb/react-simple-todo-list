import React, { Component} from 'react';

class TodoItem extends Component {
  constructor( props){
    super();
  }
  render(){
    return (
      <li><input type="checkbox" onChange={this.props.completeCheck}/>{this.props.item.text}</li>
    );
  }
}

export default TodoItem;
