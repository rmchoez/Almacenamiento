// // App.js
// import React from 'react';
// import { View,Text } from 'react-native';
// import InicialStyle from './InicialStyle'; // Importa el componente
// import Metodos from './Metodos';
// import TaskManager from './TaskManager';
// import Inicial from './Inicial';
// import SimuladorCredito from './Simulador';
// import FileApp from './FileApp';
// import FileHandling from './FileHandling';
// import DownloadImage from './DownloadImage';


// const App = () => {
//   return (
//     <View style={{ flex: 1 }}>
//       {/* <Inicial></Inicial> */}
//       {/* <InicialStyle></InicialStyle> */}
//       {/* <Metodos></Metodos> */}
//       {/* <TaskManager></TaskManager> */}
//       {/* <SimuladorCredito></SimuladorCredito> */}
   
//       {/* <FileApp></FileApp> */}
//       <FileHandling></FileHandling>
//       {/* <DownloadImage></DownloadImage> */}
//     </View>
//   );
// };

// export default App;


// npm install redux react-redux redux-thunk


import React from 'react';
import { Provider } from 'react-redux';
import { View } from 'react-native';
import store from './store';
import Counter from './components/Counter';
import CounterTheme from './components/CounterTheme';
import TaskList from './components/TaskList';

const App = () => {
  return (
    <Provider store={store}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Counter />
        {/* <CounterTheme/> */}
        {/* <TaskList/> */}
      </View>
    </Provider>
  );
};

export default App;
