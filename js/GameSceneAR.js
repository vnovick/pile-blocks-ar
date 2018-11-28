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
  ViroMaterials,
  ViroAnimations
} from 'react-viro';


const MODELS = [
  require("./res/tetris/blocks_1.vrx"),
  require("./res/tetris/blocks_2.vrx"),
  require("./res/tetris/blocks_3.vrx"),
  require("./res/tetris/blocks_4.vrx"),
  require("./res/tetris/blocks_5.vrx")
]

// PLANE HEIGHT/WIDTH = 1m
const PLANE_SIZE = 0.5

export class GameSceneAR extends Component {

  state = {
    isTracking: false,
    initialized: false,
    modelMap: [],
    activatedIndexes: [],
    loadedModelsCounter: 0,
    nextModelIndex: 0,
    planeWidth: 0,
    planeLength: 0
  }

  componentDidMount(){
    this.loadLevel()
  }

  loadLevel = () => {
    this.setState({
      activatedIndexes: [],
      loadedModelsCounter: 0,
      nextModelIndex: 0,
      planeWidth: 0,
      planeLength: 0,
      modelMap: Array.from(Array(this.props.arSceneNavigator.viroAppProps.modelNumber), () => Math.floor(Math.random() * 5))
    });
  }


  getUIText(uiText){
    return (
      <ViroText 
        text={uiText} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} transformBehaviors={["billboardX", "billboardY"]}
      />
    )
  }
 
  activateModelGravity(modelId, index) {
    const { updateScore, changeLevel } = this.props.arSceneNavigator.viroAppProps
    this.setState({
      activatedIndexes: [...this.state.activatedIndexes, modelId],
      nextModelIndex: index + 1
    }, () => {
      updateScore()
      if (this.state.activatedIndexes.length === this.state.modelMap.length) {
        changeLevel()
      }
    })
  }

  getModelByType(modelType, index) {
    const modelId = `$model:{modelType}-no:${index}`
    const yPosition = this.state.nextModelIndex === index ? 0.5 : .5  + 0.1 * index
    return (
      <Viro3DObject
        type="VRX" 
        highAccuracyEvents
        key={index}
        scale={[0.04, 0.04, 0.04]}
        viroTag={modelId}
        animation={{
          name: "loopRotate",
          run: this.state.nextModelIndex === index,
          interruptible: true,
          loop:true
        }}
        opacity={
          this.state.loadedModelsCounter === this.state.modelMap.length &&
          (index === this.state.nextModelIndex || this.state.activatedIndexes.includes(modelId)) ? 1 : 0}
        dragType="FixedDistance"
        onDrag={() => {
          if (!this.state.activatedIndexes.includes(modelId)) {
            this.activateModelGravity(modelId, index)
          }
        }}
        onLoadEnd={() => {
          this.setState({
            loadedModelsCounter: this.state.loadedModelsCounter + 1
          })
        }}
        position={[0, yPosition, 0]}
        source={MODELS[modelType]}
        physicsBody={{
          type:'Dynamic',
          shape: {
            type: "Compound"
          },
          enabled: this.state.activatedIndexes.includes(`$model:{modelType}-no:${index}`),
          mass: 1,
        }}
      />
    )
  }

  
  deadZoneCollide = () => {
    this.props.arSceneNavigator.viroAppProps.looseLive()
  }
  

  onPlaneSelected = (anchorMap) => {
    this.setState({
      planeWidth: PLANE_SIZE / this.props.arSceneNavigator.viroAppProps.level,
      planeLength: PLANE_SIZE / this.props.arSceneNavigator.viroAppProps.level
    })
  }
  
  
  getARScene(){
   return (
      <ViroARPlaneSelector onPlaneSelected={this.onPlaneSelected} pauseUpdates>
        { 
          this.state.modelMap.map((modelType, index) => this.getModelByType(modelType, index))
        }
        <ViroBox
          materials={["metal"]}
          physicsBody={{ type:'Static', restitution:0.3, friction: 0.3 }}
          width={this.state.planeWidth}
          length={this.state.planeLength}
          scale={[1,.02, 1]}
        />
        <ViroQuad 
          key="deadZone"
          height={100}
          width={100}
          rotation={[-90, 0, 0]}
          position={[0,-3,0]}
          materials={["transparent"]}
          physicsBody={{ type:'Static' }}
          onCollision={this.deadZoneCollide}
        />
      </ViroARPlaneSelector>
   )
  }
 
  render() {
    return (
        <ViroARScene onTrackingUpdated={this._onInitialized}>
          <ViroDirectionalLight color="#ffffff"
            direction={[1, -1, -10]}
            shadowOrthographicPosition={[0, 8, -2]}
            shadowOrthographicSize={5}
            shadowNearZ={1}
            shadowFarZ={4}
            castsShadow={true} 
          />
          {
            this.state.planeWidth === 0 && this.getUIText("Game Started - Please select play area")
          }
          {
            this.state.loadedModelsCounter !== this.state.modelMap.length && 
            this.state.planeWidth !== 0 && 
            this.getUIText(`Loading 3d models ${this.state.loadedModelsCounter} of ${this.state.modelMap.length}`)
          }
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


ViroAnimations.registerAnimations({
  loopRotate:{
    properties:{
      rotateY:"+=90",
    }, duration:1000
  },
  rotate: {
    properties: {
      rotateZ: "+=90"
    },
    duration: 1000
  }
});
