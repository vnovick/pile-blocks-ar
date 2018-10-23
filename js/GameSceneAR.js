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


export const MODEL_TYPES = ["Lava", "Sphere", "Rocks", "Alien"]
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
      case "Sphere":
        return (
          <ViroSphere
            key={index}
            radius={.05}
            position={[0, 1, 0]}
            materials={["metal"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic',
              mass: .1,
            }}
          />
        )
      case "Alien":
        return (
          <ViroBox
            key={index}
            height={.05}
            width={.05}
            length={.05}
            position={[0, 1, 0]}
            materials={["alien"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic', 
              mass: .1,
            }}
          />
        )
      case "Rocks":
        return (
          <ViroBox
            key={index}
            height={.05}
            width={.05}
            length={.05}
            position={[0, 1, 0]}
            materials={["rock"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic', 
              mass: .1,
            }}
          />
        )
      case "Lava":
        return (
          <ViroSphere
            key={index}
            radius={.05}
            position={[0, 1, 0]}
            materials={["lava"]} 
            dragType="FixedToWorld"
            onDrag={() => {}}
            physicsBody={{
              type:'Dynamic', 
              mass: .1,
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
    <ViroNode>
      <ViroARPlaneSelector onPlaneSelected={this.onPlaneSelected}>
        { 
          this.props.arSceneNavigator
            .viroAppProps
            .modelMap
            .map((modelType, index) => 
              this.getModelByType(modelType, index)) 
        }
      <ViroQuad 
        arShadowReceiver={true}
        key="surface"
        rotation={[-90, 0, 0]}
        materials={["metal"]}
        physicsBody={{ type:'Static', restitution:0.3, friction: 0.3 }}
      />
      <ViroQuad 
        key="deadZone"
        height={100}
        width={100}
        rotation={[-90, 0, 0]}
        position={[0,-3,0]}
        materials={["deadZone"]}
        physicsBody={{ type:'Static', restitution:0.3 }}
        onCollision={this.onCollide}
      />
      </ViroARPlaneSelector>
    </ViroNode>
   )
  }
 
  render() {
    return (
        <ViroARScene onTrackingUpdated={this._onInitialized}>
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
    diffuseTexture: require('./res/models/Rock_6_FREE/Rock_6/Rock_6_Tex/Rock_6_d.png'),
    normalTexture: require('./res/models/Rock_6_FREE/Rock_6/Rock_6_Tex/Rock_6_n.png'),
    specularTexture: require('./res/models/Rock_6_FREE/Rock_6/Rock_6_Tex/Rock_6_s.png'),
    ambientOcclusionTexture: require('./res/models/Rock_6_FREE/Rock_6/Rock_6_Tex/Rock_6_ao.png')
  },
  alien: {
    lightingModel: "Blinn",
    diffuseTexture: require('./res/textures/Alien_Flesh_001_color.jpg'),
    normalTexture: require('./res/textures/Alien_Flesh_001_norm.jpg'),
    specularTexture: require('./res/textures/Alien_Flesh_001_spec.jpg')
  },
  lava: {
    lightingModel: "Constant",
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
  deadZone: {
    diffuseColor: "rgba(0,0,0,0)"
  },
  metal: {
    lightingModel: "Lambert",
    diffuseTexture: require('./res/textures/Metal_grunge_001_COLOR.jpg'),
    normalTexture: require('./res/textures/Metal_grunge_001_NRM.jpg'),
    specularTexture: require('./res/textures/Metal_grunge_001_SPEC.jpg')
  }
})