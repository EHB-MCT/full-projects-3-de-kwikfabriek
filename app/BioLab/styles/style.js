import {
  StyleSheet
} from "react-native";


// basis stijlen voor heel de app

export const mainStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  toolbar: {
    paddingTop: 30,
    paddingBottom: 10,
    flexDirection: 'row'
  },
  center: {
    justifyContent: 'center',
    height: '100%'
  },
  bottom: {
    bottom: 0,
  }
});


// specifieke stijlen per pagina

export const deviceStyle = StyleSheet.create({
  deviceContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
  },
  deviceContainerOther: {
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomColor: '#EEE',
    borderBottomWidth: 1,
    opacity: 0.2
  },
  deviceText: {
    color: '#000',
    fontSize: 22,
  },
  deviceSubText: {
    color: '#BBB',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
  },
  buttonRed: {
    backgroundColor: '#e74c3c',
    padding: 15,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    alignSelf: 'center',
  },
  statusText: {
    color: '#000',
    fontSize: 22,
    alignSelf: 'center'
  },
  box: {
    width: 200,
    height: 200,
  }
});

export const incubatorStyle = StyleSheet.create({
  statusText: {
    color: '#000',
    fontSize: 22,
    alignSelf: 'center'
  }
});

export const homeStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  backgroundGradient: {
    height: "100%",
    width: "100%",
  },

  menuContainer: {
    padding: 20,
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 15,
    alignContent: 'center'
  },
  menuButtonText: {
    textAlign: "center",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    alignItems: "center"
  },
  toolbarButton: {
    width: 50,
  },
  subTitle: {
    fontSize: 24,
    color: "#000",
    marginBottom: 20,
    fontWeight: '600'
  },
  bottomMiddleButt: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    marginTop: -10,
  },
  logoSVG: {
    width: 50,
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: "center"
  },
  logo: {
    width: 380,
    height: 380,
    resizeMode: 'contain',
  },
  logocontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logobuttons: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  hamburgercontainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  hamburgerbutton: {
    marginRight: 15,
    height: 40,
    width: 40
  }
})

export const cameraStyle = StyleSheet.create({
  body: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  capturebutton: {
    padding: 10,
    marginBottom: 50
  },
  assignName: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  assignNameSubmitContainer: {
    backgroundColor: "rgb(100,100,150)",
    padding: 30,
    width: '80%',
    borderRadius: 10,
  },
  assignNameBox: {
    backgroundColor: "rgb(120,120,170)",
    fontSize: 22,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 10,
    marginBottom: 20
  },
  assignNameText: {
    fontSize: 18,
    marginBottom: 20,
  },
  assignNameSubmitHighlight: {
    borderRadius: 20,
  },
  assignNameSubmit: {
    fontSize: 24,
    padding: 15,
    textAlign: "center",
  },
  imageSavedCont: {
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  ImageSavedText: {
    fontSize: 24,
  },
  rgbvalues: {
    fontSize: 9,
    fontWeight: "bold",
    position: "relative",
    textAlign: "center",
  },
  waterResultDesc: {
    position: "absolute",
    bottom: 220,
    width: '75%',
    fontSize: 18,
    color: 'white'
  },
  backgroundSaved: {
    alignItems: "center",
    width: '100%',
    height: '100%',
  },
  logoSaved: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  logoSavedCont: {
    position: 'absolute',
    top: -125,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageSavedButtons: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 16,
    backgroundColor: "rgb(50,50,200)",
  },
  colorSaved: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    backgroundColor: 'rgb(50,50,200)',
    top: -175,
    borderColor: 'rgb(0,0,0)',
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    top: -195,
    fontSize: 20,
    fontWeight: "bold",
  },
  logoTextWater: {
    top: -180,
    fontSize: 20,
    fontWeight: "bold",
  },
  imageSavedButtonsText: {
    fontSize: 24,
    color: '#0145A0',
  },
  imageSavedButtonsCont: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    width: '75%',
    justifyContent: "space-between",
    bottom: 70,
  },
  inUse: {
    backgroundColor: 'rgba(160,65,65,1)',
  },
  notInUse: {
    backgroundColor: 'rgba(70,70,100,1)',
  },
})


export const dataStyle = StyleSheet.create({

  dataContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flex: 1,
    width: 50,
    height: 50,
  },
  images: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
})


export const infoViewStyle = StyleSheet.create({

})


export const mapViewStyle = StyleSheet.create({

})


export const measureStyle = StyleSheet.create({
  menuContainer: {
    padding: 20,
  },
  menuButton: {
    width: 175,
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
    alignContent: 'center'
  },
  menuButtonText: {
    textAlign: "center",
    fontSize: 18,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  toolbarButton: {
    width: 50,
  },
  subTitle: {
    fontSize: 24,
    color: "#000",
    marginBottom: 20,
    fontWeight: '600'
  }
})

export const userStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "space-around"
  },
  txtinput: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: 'gray',
    color: "black",
    marginLeft: 15,
    marginRight: 15,
  },
  registerbutton: {
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 24,
    margin: 10,
    textAlign: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },

  loginbutton: {
    backgroundColor: 'rgb(255,255,255)',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 24,
    paddingBottom: 10,
    paddingTop: 10,
    margin: 10,
    textAlign: 'center',
    alignItems: 'center',
  },
  loginbuttontxt: {
    color: '#0145A0',
    fontWeight: '500'
  },
  registerbuttontxt: {
    color: '#0145A0',
    fontWeight: '500'
  },
  submitbuttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textinput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    height: 10

  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginTop: 50
  },
  backgroundGradient: {
    height: "100%",
    width: "100%",
    flex: 1,
    alignItems: 'center',
  },
  placeholder: {
    padding: 10,
  }
})