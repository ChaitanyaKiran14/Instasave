import { useState, useEffect } from 'react';
import axios from 'axios';

interface Todo {
    _id: string;
    title: string;
    description: string;
    done: boolean;
}

type TodoArray = Todo[];

const TodoList = () => {
    const [todos, setTodos] = useState<TodoArray>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
   

    useEffect(() => {
        const getTodos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/todo/todos', {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const data: Todo[] = response.data;
                setTodos(data);
            } catch (error) {
                console.error('Error fetching todos', error);
            }
        };
        getTodos();
    }, []);

    const addTodo = async () => {
        try {
            const response = await axios.post(
                'http://localhost:3000/todo/todos',
                { title, description },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            const newTodo = response.data;
            setTodos([...todos, newTodo]);
        } catch (error) {
            console.error('Error adding todo', error);
        }
    };

    const markDone = async (id: string) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/todo/todos/${id}/done`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            const updatedTodo = response.data;
            setTodos(todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo)));
        } catch (error) {
            console.error('Error marking todo as done', error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <div style={{ marginTop: 25, marginLeft: 20 }}>
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
            <h2>Todo List</h2>
            <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Title'
            />
            <input
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Description'
            />
            <button onClick={addTodo}>Add Todo</button>

            {todos.map((todo) => (
                <div key={todo._id}>
                    <h3>{todo.title}</h3>
                    <p>{todo.description}</p>
                    <button onClick={() => markDone(todo._id)}>
                        {todo.done ? 'Done' : 'Mark as Done'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TodoList;
