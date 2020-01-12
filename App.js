/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';

import params from './src/params';
import { 
  createMinedBoard, 
  cloneBoard, 
  openField, 
  hasExplosion, 
  wonGame, 
  showMines,
  invertFlag,
  flagsUsed
} from './src/functions';
import Header from './src/components/Header';
import MinedField from './src/components/MinedField';
import LevelSelection from './src/screens/LavelSelection';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = this.createState();
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmout();
    return Math.ceil(cols * rows * params.difficultLevel);
  }

  createState = () => {
    const cols = params.getColumnsAmount();
    const rows = params.getRowsAmout();
    return {
      board: createMinedBoard(rows, cols, this.minesAmount()),
      won: false,
      lost: false,
      showLevelSelection: false,
    }
  }

  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board);
    if(!hasExplosion(this.state.board)) openField(board, row, column);
    const lost = hasExplosion(board);
    const won = wonGame(board);

    if (lost) {
      showMines(board);
      Alert.alert('Perdeuuuu!', 'Que burrrrroooO!!')
    }
    if (won) {
      Alert.alert('Parabéns!', 'Aeeeeeeeeee!!')
    }
    this.setState({board, lost, won});
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board);
    invertFlag(board, row, column);
    const won = wonGame(board);
    if (won) {
      Alert.alert('Parabéns!', 'Aeeeeeeeeee!!')
    }
    this.setState({ board, won });
  }

  onLevelSelected = level => {
    params.difficultLevel = level;
    this.setState(this.createState());
  }

  render() {
    return (
      <View style={styles.container}>
        <LevelSelection isVisible={this.state.showLevelSelection}
          onLevelSelected={this.onLevelSelected}
          onCancel={() => this.setState({ showLevelSelection: false })} />
        <Header flagsLeft={this.minesAmount() - flagsUsed(this.state.board)} 
          onNewGame={() => this.setState(this.createState())} 
          onFlagPress={() => this.setState({ showLevelSelection: true })} />
        <View style={styles.board}>
          <MinedField board={this.state.board} 
            onOpenField={this.onOpenField} 
            onSelectField={this.onSelectField} />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF'
  },
  board: {
    // flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#AAA'
  }, 
  title: {
    fontSize: 20,
    textAlign: 'center'
  },
  description: {
    fontSize: 15,
    textAlign: 'center'
  }
});
