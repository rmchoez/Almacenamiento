// actions/counterActions.js

// Acción síncrona
export const increment = () => ({
  type: 'INCREMENT',
});

export const decrement = () => ({
  type: 'DECREMENT',
});

export const changeTheme = (theme) => ({ 
  type: 'CHANGE_THEME', payload: theme 
});

// Acción asíncrona con redux-thunk
export const incrementAsync = () => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(increment());
    }, 1000); // Espera de 1 segundo antes de despachar la acción de incremento
  };
};
