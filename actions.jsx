export const increment = () => {
    return { type: 'INCREMENT' };
  };
  
  export const decrement = () => {
    return { type: 'DECREMENT' };
  };


  export const changeTheme = (theme) => ({ type: 'CHANGE_THEME', payload: theme });


  export const addTask = (text) => ({
    type: 'ADD_TASK',
    payload: {
      id: Date.now(),
      text,
      completed: false
    }
  });
  
  export const toggleTask = (id) => ({
    type: 'TOGGLE_TASK',
    payload: id
  });

  export const deleteTask = (id) => ({
    type: 'DELETE_TASK',
    payload: id,
  });