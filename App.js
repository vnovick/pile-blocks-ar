/**
 * Copyright (c) 2017-present, Viro, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  StatusBar,
  TouchableHighlight,
} from 'react-native';

import { GameSceneAR } from './js/GameSceneAR';

import {
  ViroARSceneNavigator
} from 'react-viro';

/*
 TODO: Insert your API key below
 */

const API_KEY = "1839C275-6929-45AF-B638-EF2DEE44C1D9";

const GAME_STATES = {
  MENU: Symbol("Menu"),
  IN_GAME: Symbol("InGame"),
  GAME_OVER: Symbol("GameOver")
}


const SCORE_MODIFIER = 100;

export default class ViroSample extends Component {

  state = {
    score: 0,
    modelMap: [],
    gameState: GAME_STATES.MENU
  }

  startGame = () => {
    this.setState({
      gameState: GAME_STATES.IN_GAME
    })
  }



  gameOver = () => {
    this.setState({
      score: 0,
      modelMap: [],
      gameState: GAME_STATES.GAME_OVER
    })
  }

  backToMenu = () => {
    this.setState({
      score: 0,
      modelMap: [],
      gameState: GAME_STATES.MENU
    })
  }

  getRandomModel = () => Math.floor(Math.random() * 4)

  loadModel = () => {
    const nextModel = this.getRandomModel();
    this.setState({
      score: this.state.score + SCORE_MODIFIER,
      modelMap: [
        ...this.state.modelMap,
        nextModel
      ]
    })
  }
  


  render() {
    switch (this.state.gameState) {
      case GAME_STATES.MENU:
        return this.renderUI()
      case GAME_STATES.IN_GAME:
        return this.renderGameView()
      case GAME_STATES.GAME_OVER:
        return this.renderUI()
    }
  }

  // Presents the user with a choice of an AR or VR experience
  renderUI() {
    return (
      <View style={localStyles.outer} >
        <View style={localStyles.inner} >
          <Text>Pile Blocks AR</Text>
          <Text style={localStyles.titleText}>
            { this.state.gameState === GAME_STATES.MENU ? "MENU" : "GAME OVER" }
          </Text>
          { this.state.gameState === GAME_STATES.MENU &&
            <Text style={localStyles.text}>
              In this game you need to select a highlighted surface and pile blocks on it. When any of the blocks falls from the surface, you loose. You can drag any box on the surface.
              Get to your highest score.
            </Text>
          }
          <TouchableHighlight style={localStyles.buttons}
            onPress={this.startGame}
            underlayColor={'#68a0ff'} >
            <Text style={localStyles.buttonText}>Start Game</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  renderGameView(){
    return (
      <View style={localStyles.flex}>
        <StatusBar hidden={true} />
        <ViroARSceneNavigator
          apiKey={API_KEY}
          viroAppProps={{
            modelMap: this.state.modelMap,
            gameOver: this.gameOver
          }}
          initialScene={{ scene: GameSceneAR }} 
        />
        <View style={localStyles.topMenu}>
          <TouchableHighlight style={localStyles.buttons}
            underlayColor={'#68a0ff'}
            onPress={this.backToMenu}
          >
            <Text style={localStyles.buttonText}>
              Back
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={localStyles.buttons}
            underlayColor={'#68a0ff'} >
            <Text style={localStyles.buttonText}>
              { this.state.score }
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={localStyles.buttons}
            active={!this.state.modelLoading}
            underlayColor={'#68a0ff'} 
            onPress={this.loadModel} >
            <Text style={localStyles.buttonText}>
              Load Block
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

}

var localStyles = StyleSheet.create({
  viroContainer :{
    flex : 1,
    backgroundColor: "black",
  },
  flex : {
    flex : 1,
  },
  arView: {
    flex:1,
  },
  topMenu: {
    width : '100%',
    position : 'absolute',
    top : 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outer : {
    flex : 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: "black",
  },
  inner: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "black",
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color:'#fff',
    textAlign:'center',
    fontSize : 25
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontSize : 20
  },
  buttons : {
    height: 80,
    width: 150,
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'rgba(123,123,231,.4)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(123,087,231,.4)'
  },
  exitButton : {
    height: 50,
    width: 100,
    paddingTop:10,
    paddingBottom:10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  }
});

module.exports = ViroSample
