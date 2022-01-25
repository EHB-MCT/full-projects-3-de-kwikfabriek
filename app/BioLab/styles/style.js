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
    marginTop: -60,
  },
  logoSVG: {
    width: 50,
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: "center"
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  logocontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logobuttons: {
    width: 125,
    height: 125,
    resizeMode: 'contain',
  },
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
  }
})


export const dataStyle = StyleSheet.create({

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