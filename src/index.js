require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const todoFilePath = process.env.BASE_JSON_PATH;

//Read todos from todos.json into variable
let todos = require(__dirname + todoFilePath);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  
  res.sendFile("./public/index.html", { root: __dirname });
  
  // res.status(501).end();
});

app.get('/todos', (_, res) => {
  
  res.header("Content-Type","application/json");
  res.sendFile(todoFilePath, { root: __dirname });
  
  // res.status(501).end();
});

//Add GET request with path '/todos/overdue'
app.get('/todos/overdue', (_, res) => {
  res.header("Content-Type","application/json");
  
    const todo = todos.filter( todo => {
       let nowDate = new Date();
       let toDoDate =  new Date( todo.due )
       if ( toDoDate <= nowDate ){
         return true;
       }
    } );
    res.write( JSON.stringify(todo) );
    res.status(200).end();
  });


//Add GET request with path '/todos/completed'
app.get('/todos/completed', (_, res) => {
  res.header("Content-Type","application/json");
  
    const todo = todos.filter( todo => {
       if ( todo.completed ){
         return true;
       }
    } );
    res.json(todo);
    res.write( JSON.stringify(todo) );
    res.status(200).end();
  });


//Add POST request with path '/todos'
app.post('/todos', (req, res) => {
  var fs = require("fs");
  console.log( req.body );
  todos.push( ( req.body ) );
  if (!todos) return res.sendStatus(400);
  fs.writeFile( __dirname + todoFilePath , JSON.stringify(todos) , err => {
    if (err) {
      console.error(err)
      return
    }
});
  res.json(todos);

 });



//Add PATCH request with path '/todos/:id
app.patch('/todos/:id', (req, res) => {
  const foundTodo = todos.find((todo)=> {return todo.id == req.params.id })
if (!foundTodo){
  return res.status(400).send("bad request")
}

  var fs = require("fs");
  console.log( req.params.id );
  const newTodos = todos.map( todo => {
      if (todo.id == req.params.id ){
        todo = { 
         ...todo,
          ...req.body} ;
      }
      return todo
   } );


  fs.writeFile( __dirname + todoFilePath , JSON.stringify(newTodos) , err => {
    if (err) {
      console.error(err)
      return
    }
});
  res.status(200).json(newTodos);
 });

//Add POST request with path '/todos/:id/complete
app.post('/todos/:id/complete', (req, res) => {
  var fs = require("fs");
  console.log( req.params.id );

  const todoComplete = todos.map( todo => {
      if (todo.id == req.params.id ){
        todo.completed = true;
      }
    return todo;
   } );
  if (!todos) return res.sendStatus(400);
  fs.writeFile( dirname + todoFilePath , JSON.stringify(todos) , err => {
    if ("bad request") {
      console.error(err)
      return
    }
});

  res.json(todoComplete);})


//Add POST request with path '/todos/:id/undo

app.post('/todos/:id/undo', (req, res) => {
  var fs = require("fs");
  console.log( req.params.id );
  const todo = todos.map( todo => {
      if (todo.id == req.params.id ){
        todo.completed = false;
      }
         return todos;
   } );
  if (!todo) return res.sendStatus(400);
  fs.writeFile( dirname + todoFilePath , JSON.stringify(todo) , err => {
    if (err) {
      console.error(err)
      return
    }
});
  res.json(todo);

 });

//Add DELETE request with path '/todos/:id
app.delete('/todos/:id', (req, res) => {
  var fs = require("fs");
  console.log( req.params.id );
  const todo = todos.filter( todo => {
      if ( todo.id == req.params.id ){
        return false;
      }

   } );
  if (!todo) return res.sendStatus(400);
  fs.writeFile( __dirname + todoFilePath , JSON.stringify(todo) , err => {
    if (err) {
      console.error(err)
      return
    }
});
  res.json(todo);

 });

module.exports = app;