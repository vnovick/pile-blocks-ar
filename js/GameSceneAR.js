import React, { Component } from 'react';

import {StyleSheet, View, Text } from 'react-native';

import {
  ViroARScene,
  ViroFlexView,
  ViroARPlaneSelector,
  ViroDirectionalLight,
  ViroSpotLight,
  ViroText,
  Viro3DObject,
  ViroAmbientLight,
  ViroConstants,
  ViroQuad,
  ViroNode,
  ViroSphere, 
  ViroBox,
  ViroMaterials
} from 'react-viro';


export const MODEL_TYPES = ["Lava", "Crystal", "Rocks", "Alien"]
const GAME_STATES = {
  GAME_STARTED: "GAME_STARTED",
  IN_GAME: "IN_GAME"
}

export class GameSceneAR extends Component {

  state = {
    isTracking: false,
    initialized: false
  }

  getUIText(uiText){
    return (
      <ViroText 
        text={uiText} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} transformBehaviors={["billboardX", "billboardY"]}
      />
    )
  }

  getModelByType(modelType, index) {
    switch (modelType) {
      case "Crystal":
        return (
          <ViroBox
            key={index}
            height={.03}
            width={.05}
            length={.07}
            position={[0, .5, 0]}
            materials={["crystal"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic', 
              mass: 1,
            }}
          />
        )
      case "Alien":
        return (
          <ViroBox
            key={index}
            height={.06}
            width={.02}
            length={.04}
            position={[0, .5, 0]}
            materials={["alien"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic', 
              mass: 1,
            }}
          />
        )
      case "Rocks":
        return (
          <ViroBox
            key={index}
            height={.03}
            width={.05}
            length={.06}
            position={[0, .5, 0]}
            materials={["rock"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic',               
              mass: 1,
            }}
          />
        )
      case "Lava":
        return (
          <ViroBox
            key={index}
            height={.05}
            width={.05}
            length={.1}
            position={[0, .5, 0]}
            materials={["lava"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic', 
              mass: 1,
            }}
          />
        )
    }
  }

  
  onCollide = () => {
    this.props.arSceneNavigator.viroAppProps.gameOver()
  }

  onPlaneSelected = (anchorMap) => {
    const worldCenterPosition = [
      anchorMap.position[0] + anchorMap.center[0],
      anchorMap.position[1] + anchorMap.center[1],
      anchorMap.position[2] + anchorMap.center[2]
    ];
    this.setState({
      foundPlane: true, 
      planeWidth: anchorMap.width,
      planeHeight: anchorMap.height,
      worldCenterPosition, 
    })
  }
  
  getARScene(){
   return (
      <ViroARPlaneSelector onPlaneSelected={this.onPlaneSelected}>
        { 
          this.props.arSceneNavigator
            .viroAppProps
            .modelMap
            .map((modelType, index) => 
              this.getModelByType(modelType, index)) 
        }
      <ViroBox
        materials={["metal"]}
        physicsBody={{ type:'Static', restitution:0.3, friction: 0.3 }}
        width={this.state.planeWidth}
        height={this.state.planeHeight}
        scale={[1,.01, 1]}
      />
      <ViroQuad 
        key="deadZone"
        height={100}
        width={100}
        rotation={[-90, 0, 0]}
        position={[0,-3,0]}
        materials={["transparent"]}
        physicsBody={{ type:'Static' }}
        onCollision={this.onCollide}
      />
      </ViroARPlaneSelector>
   )
  }
 
  render() {
    return (
        <ViroARScene onTrackingUpdated={this._onInitialized} physicsWorld={{ gravity: [0, -5, 0] }}>
          <ViroDirectionalLight color="#ffffff"
            direction={[0, -1, 0]}
            shadowOrthographicPosition={[0, 8, -2]}
            shadowOrthographicSize={10}
            shadowNearZ={2}
            shadowFarZ={9}
            castsShadow={true} 
          />
          { 
            this.state.isTracking ? 
            this.getARScene() : 
            this.getUIText(
              this.state.initialized ? "Initializing" : "No Tracking"
            )  
          }
        </ViroARScene>
    );
  }

  _onInitialized = (state, reason) => {
    if (state == ViroConstants.TRACKING_NORMAL) {
      this.setState({
        isTracking : true,
        initialized: true
      });
    } else if (state == ViroConstants.TRACKING_NONE) {
      this.setState({
        isTracking: false
      })
    }
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 10,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

ViroMaterials.createMaterials({
  rock: {
    lightingModel: "Lambert",
    diffuseTexture: require('./res/textures/Canyon_Rock_001_COLOR.jpg'),
    normalTexture: require('./res/textures/Canyon_Rock_001_NORM.jpg'),
  },
  alien: {
    lightingModel: "Blinn",
    diffuseTexture: require('./res/textures/Alien_Flesh_001_color.jpg'),
    normalTexture: require('./res/textures/Alien_Flesh_001_norm.jpg'),
    specularTexture: require('./res/textures/Alien_Flesh_001_spec.jpg')
  },
  lava: {
    lightingModel: "Lambert",
    diffuseTexture: require("./res/textures/Lava_001_COLOR.png"),
    normalTexture: require("./res/textures/Lava_001_NRM.png"),
    specularTexture: require('./res/textures/Lava_001_SPEC.png')
  },
  crystal: {
    lightingModel: "Lambert",
    diffuseTexture: require("./res/textures/Crystal_002_COLOR.jpg"),
    normalTexture: require("./res/textures/Crystal_002_NORM.jpg")
  },
  hud_text_bg: {
    lightingModel: "Constant",
    diffuseColor: "rgba(123,123,231,.4)"
  },
  transparent: {
    diffuseColor: "rgba(0,0,0,0)"
  },
  metal: {
    lightingModel: "Lambert",
    diffuseTexture: require('./res/textures/Metal_grunge_001_COLOR.jpg'),
    normalTexture: require('./res/textures/Metal_grunge_001_NRM.jpg'),
    specularTexture: require('./res/textures/Metal_grunge_001_SPEC.jpg')
  }
})