import { useState, useEffect } from 'react';

const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [todos, setTodos] = useState([]);
	const URL = "https://playground.4geeks.com/todo";
	const username = "khalid"; 

	useEffect(() => {
		initializeUser();
	}, []);

	const createUser = () => {
		fetch(`${URL}/users/${username}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				if (!resp.ok) throw new Error("Error al crear usuario");
				return resp.json();
			})
			.then(data => {
				console.log("Usuario creado:", data);
				getTodos();
			})
			.catch(error => {
				console.log("Error al crear usuario:", error);
			});
	};

	const initializeUser = () => {
		fetch(`${URL}/users/${username}`)
			.then(resp => {
				if (resp.status === 404) {
					createUser();
				} else if (resp.ok) {
					getTodos();
				}
			})
			.catch(error => {
				console.log("Error al verificar usuario:", error);
			});
	};

	const getTodos = () => {
		fetch(`${URL}/users/${username}`)
			.then(resp => {
				if (!resp.ok) throw new Error("Error al obtener tareas");
				return resp.json();
			})
			.then(data => {
				console.log("Tareas obtenidas:", data);
				setTodos(data.todos || []);
			})
			.catch(error => {
				console.log("Error al obtener tareas:", error);
			});
	};
	
	const addTodo = (label) => {
		const newTask = {
			label: label,
			is_done: false
		};

		fetch(`${URL}/todos/${username}`, {
			method: "POST",
			body: JSON.stringify(newTask),
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then(resp => {
				console.log("Status:", resp.status);
				if (!resp.ok) throw new Error("Error al agregar tarea");
				return resp.json();
			})
			.then(data => {
				console.log("Tarea agregada:", data);
				getTodos();
			})
			.catch(error => {
				console.log("Error al agregar tarea:", error);
			});
	};
	const deleteTodo = (id) => {
		console.log("Intentando eliminar tarea con ID:", id);
		if (!id) {
			console.error("Error: ID de tarea no válido");
			return;
		}
		fetch(`${URL}/todos/${id}`, {
			method: "DELETE"
		})
			.then(resp => {
				console.log("Respuesta DELETE:", resp.status);
				if (!resp.ok) throw new Error("Error al eliminar tarea");
				if (resp.status === 204) {
					return null;
				}
				return resp.json();
			})
			.then(data => {
				console.log("Tarea eliminada exitosamente");
				getTodos();
			})
			.catch(error => {
				console.log("Error al eliminar tarea:", error);
			});
	};
	const clearAllTodos = () => {
		const deletePromises = todos.map(todo => 
			fetch(`${URL}/todos/${todo.id}`, {
				method: "DELETE"
			})
		);

		Promise.all(deletePromises)
			.then(() => {
				console.log("Todas las tareas eliminadas");
				getTodos();
			})
			.catch(error => {
				console.log("Error al limpiar tareas:", error);
			});
	};

	return (
		<div className="container">
			<h1>My Todos</h1>
			<ul>
				<input
					type="text"
					onChange={(e) => setInputValue(e.target.value)}
					value={inputValue}
					onKeyDown={(e) => {
						if (e.key === "Enter" && inputValue.trim() !== "") {
							addTodo(inputValue);
							setInputValue("");
						}
					}}
					placeholder="What do you need to do?"
				/>
				{todos.map((item, index) => (
					<li key={item.id || index}>
						{item.label}{" "}
						<i
							className="fa-solid fa-trash"
							onClick={() => deleteTodo(item.id)}
							style={{ cursor: 'pointer', marginLeft: '10px' }}
						></i>
					</li>
				))}
				<li>{todos.length} tasks</li>
			</ul>
			
			{todos.length > 0 && (
				<button 
					onClick={clearAllTodos}
					className="clear-all-btn"
				>
					Clear All Tasks
				</button>
			)}
		</div>
	);
};

export default Home;