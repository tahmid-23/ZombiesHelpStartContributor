import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    flexDirection: "column"
  },
  titleBar: {
    backgroundColor: "gray",
    padding: 10,
    display: "flex",
    flexGrow: 0,
    flexShrink: 0,
    flexWrap: "wrap",
    width: "100%"
  },
  heading: {
    fontSize: 32,
    marginTop: 0.67,
    marginBottom: 0.67,
    marginLeft: 0,
    marginRight: 0,
    fontWeight: "bold"
  },
  title: {
    textAlign: "center",
    color: "white",
    width: "100%"
  },
  disclaimer: {
    color: "gainsboro",
    width: "100%"
  },
  content: {
    display: "flex",
    justifyContent: "space-between",

    backgroundColor: "lightgray",
    width: "100%",
    height: "100%",
    flex: 2
  },
  inputLine: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    backgroundColor: "white",
    display: "flex",
    flexGrow: 1,
    flex: 1,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    margin: 5,
    minWidth: 0
  },
  connect: {
    backgroundColor: "greenyellow",
    display: "flex",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    margin: 5,
    marginLeft: 0,
    borderColor: "black"
  },
  chatWrapperWrapper: {
    flex: 1,
    margin: 5,
    borderColor: "black",
    display: "flex",
    borderRadius: 5,
  },
  chatWrapper: {
    borderRadius: 5,
    backgroundColor: "gray",
    width: "100%",
    height: "100%"
  },
  chatWrapperContent: {
    display: "flex",
    flexDirection: "column"
  },
  send: {
    backgroundColor: "#EFEFEF",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    margin: 5,
    marginLeft: 0
  }
})
