import React, { FC } from 'react';
import 'reflect-metadata';
import './app.scss';
import AppProvider from './context';

const App: FC = (props) => {
  return <AppProvider>{props.children}</AppProvider>;
};

// class App extends React.Component {

//   render() {
//     return <AppProvider>{this.props.children}</AppProvider>;
//   }
// }

export default App;
