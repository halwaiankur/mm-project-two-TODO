const e = React.createElement;
const classNames = {
  TODO_ITEM: 'todo-container',
  TODO_CHECKBOX: 'todo-checkbox',
  TODO_TEXT: 'todo-text',
  TODO_DELETE: 'todo-delete',
}

const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')

function newTodo() {
  document.getElementById("newButton").disabled=true;
  ReactDOM.render(e(NewTodoForm), document.getElementById('todo-list'));
}

class ItemCount extends React.Component{
    constructor(props){
      super(props);
    }
    
    render(){
      return this.props.itemCount
    }

  }

class UncheckedCount extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return this.props.uncheckedCount
  }

}

class NewTodoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({newData:'',
                  data:{}
                });
  }
  saveBtn(event){
    if (this.state.newData === "") {
      alert("Please enter something");
      return;
    }
    var dataJSON = JSON.parse(localStorage.getItem('todoApp'));
    dataJSON.push(
      {
        desc:this.state.newData,
        completed:false,
        createdOn:new Date().getTime()
      }
    );
    localStorage.setItem('todoApp',JSON.stringify(dataJSON));
    document.getElementById("newButton").disabled=false;
    ReactDOM.render(e(ListView, dataJSON), document.getElementById('todo-list'));
  }  
  setData(ev){
    this.setState({newData : ev.target.value});
  }

  cancelBtn(ev){
    document.getElementById("newButton").disabled=false;
    ReactDOM.render(e(ListView,JSON.parse(localStorage.getItem('todoApp'))), document.getElementById('todo-list'));
  }

  render() {
    let ToDoListVar = JSON.parse(localStorage.getItem('todoApp'))
    return e
      ('div',{},
        e('div',{style:{textAlign:"center",paddingBottom:'10px'}},
          e('input',{className:'button',type:'text',placeholder:'Enter new item',onChange:this.setData.bind(this),autoFocus:true}),
          e('button',{className:'button',onClick: this.saveBtn.bind(this),style:{}},'Save'),
          e('button',{className:'button',onClick:this.cancelBtn.bind(this)},'Cancel')),
        e('div',{},
      e(ListView,ToDoListVar))
      );
  }
}

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.children
    }
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      completed: value
    });
  }
  componentDidUpdate(){
    let data = JSON.parse(localStorage.getItem('todoApp'));
    var itenCountVal =0;
    var uncheckedCountVal = 0;
    for (let x in data){
      if(data[x].createdOn == this.state.createdOn){
        data[x].completed = this.state.completed;
      }
      if(data[x].completed == false)
        uncheckedCountVal+=1;
      itenCountVal+=1;
    }
    ReactDOM.render(e(ItemCount, {itemCount:itenCountVal}), document.getElementById('item-count'));
    ReactDOM.render(e(UncheckedCount, {uncheckedCount:uncheckedCountVal}), document.getElementById('unchecked-count'));
    localStorage.setItem('todoApp',JSON.stringify(data));
  }

  deleteRecord(ev){
    let data = JSON.parse(localStorage.getItem('todoApp'));
    for (let x in data){
      if(data[x].createdOn == this.state.createdOn){
        data.splice(x, 1);
        localStorage.setItem('todoApp',JSON.stringify(data));
        this.props.callForceUpdate();
        break;
      }
    }
  }
  
  render() {
    return  e
      ('li',{className:classNames.TODO_ITEM},
        e('input',{className:classNames.TODO_CHECKBOX,
                    type:'checkbox',
                    checked:this.state.completed,
                    onChange:this.handleInputChange.bind(this)}),
        e('span',{className:classNames.TODO_TEXT},this.state.desc,),
        e('button',{style:{float:'right'},onClick:this.deleteRecord.bind(this)},'Remove'))}
  
}
class ListView extends React.Component{
  constructor(props) {
    super(props);
    this.state ={
      numberOfEntries:0,
      entries:{},
      notComplete:0
    }
  }
  componentDidMount(){
    this.setState({
      entries:{...this.props}
    })
    
  }

  componentDidUpdate(){
    var itenCountVal =0;
    var uncheckedCountVal = 0;
    for (var x in this.state.entries){
      if(this.state.entries[x].completed == false)
      uncheckedCountVal+=1;
      itenCountVal+=1;
    }
    ReactDOM.render(e(ItemCount, {itemCount:itenCountVal}), document.getElementById('item-count'));
    ReactDOM.render(e(UncheckedCount, {uncheckedCount:uncheckedCountVal}), document.getElementById('unchecked-count'));
  }

  childMethod(){
    ReactDOM.unmountComponentAtNode(document.getElementById('todo-list'));
    ReactDOM.render(e(ListView, JSON.parse(localStorage.getItem('todoApp'))), document.getElementById('todo-list'));
  }
  render() {
    if(Object.keys(this.state.entries).length === 0){
      return e
      ('h2',{style:{textAlign:'center'}},'Click New to add to List')
    }
    var listArray = [];
    for (var x in this.state.entries)
      listArray.push(e(ListItem, {key:x,callForceUpdate:this.childMethod.bind(this)}, this.state.entries[x]));
    return e('ul',{},listArray)
  }
}

if(!localStorage.getItem('todoApp')){
    localStorage.setItem('todoApp',JSON.stringify([]));
    ReactDOM.render(e(ListView, []), document.getElementById('todo-list'));
  }else{
    let ToDoListVar = JSON.parse(localStorage.getItem('todoApp'))
    ReactDOM.render(e(ListView, ToDoListVar), document.getElementById('todo-list'));
  }

