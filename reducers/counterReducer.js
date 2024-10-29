// reducers/counterReducer.js
const initialState = {
  count: 0,
  theme: 'light',
  tasks: []
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    //Ejercicio 2 cambio de tema
      case 'CHANGE_THEME':
        return { ...state, theme: action.payload };

    //Ejercicio 3 lista de tareas
    
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]   

      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        )
      };

      case 'DELETE_TASK':
        return {
          ...state,
          tasks: state.tasks.filter((task) => task.id !== action.payload),
        };  
      
    default:
      return state;
  }
};

export default counterReducer;
