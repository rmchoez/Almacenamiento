



// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Button, Text, View } from 'react-native';
// import { increment, decrement, changeTheme } from '../actions';

// const CounterTheme = () => {
//   const count = useSelector(state => state.count);
//   const theme = useSelector(state => state.theme);
//   const dispatch = useDispatch();

//   return (
//     <View style={{ backgroundColor: theme === 'light' ? 'white' : 'black' }}>
//       <Text style={{ color: theme === 'light' ? 'black' : 'white' }}>Contador: {count}</Text>
//       <Button title="Incrementar" onPress={() => dispatch(increment())} />
//       <Button title="Decrementar" onPress={() => dispatch(decrement())} />
//       <Button title="Cambiar Tema" onPress={() => dispatch(changeTheme(theme === 'light' ? 'dark' : 'light'))} />
//     </View>
//   );
// };

// export default CounterTheme;


// CounterTheme.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { increment, decrement, changeTheme } from '../actions';

const CounterTheme = () => {
  const count = useSelector((state) => state.count);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  // Definir colores según el tema
  const themeColors = {
    light: { backgroundColor: 'white', textColor: 'black' },
    dark: { backgroundColor: 'black', textColor: 'white' },
    blue: { backgroundColor: '#003366', textColor: '#00ccff' },
  };

  const { backgroundColor, textColor } = themeColors[theme] || themeColors.light;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.counterText, { color: textColor }]}>Contador: {count}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => dispatch(increment())}
        >
          <Text style={styles.buttonText}>Incrementar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => dispatch(decrement())}
        >
          <Text style={styles.buttonText}>Decrementar</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.counterText, { color: textColor }]}>Cambiar Tema:</Text>
      <View style={styles.themeButtonContainer}>
        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: '#e0e0e0' }]}
          onPress={() => dispatch(changeTheme('light'))}
        >
          <Text style={styles.buttonText}>Light</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: '#333' }]}
          onPress={() => dispatch(changeTheme('dark'))}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Dark</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: '#00509e' }]}
          onPress={() => dispatch(changeTheme('blue'))}
        >
          <Text style={[styles.buttonText, { color: '#00ccff' }]}>Blue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  counterText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  actionButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeButtonContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  themeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
});

export default CounterTheme;
