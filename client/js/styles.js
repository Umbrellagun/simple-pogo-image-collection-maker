export default {

  header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    minHeight: "16vh",
    width: '100%',
  },

  filterStyle: {
    display: "flex",
    padding: 8
  },

  menuStyle: {
    zIndex: 99,
    backgroundColor: "white",
    color: "darkcyan",
    // boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
  },

  redButtonStyle: {
    padding: 8,
    margin: 8,
    borderRadius: 4,
    color: "white",
    cursor: "pointer",
    backgroundColor: "red",
    textAlign: "center"
  },

  regularButtonStyle: {
    padding: 8,
    margin: "8px 0px",
    borderRadius: 4,
    cursor: "pointer",
    textAlign: "center",
    display: "flex"
  },

  style: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    height: "80vh",
    overflow: "auto",
    backgroundColor: "white",
    position: "relative",
    borderRadius: 8,
    width: "100%"
  },

  buttonStyle: {
    padding: 8,
    margin: 8,
    marginRight: 0,
    backgroundColor: "darkcyan",
    borderRadius: 4,
    color: "white",
    cursor: "pointer",
    minWidth: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
  },

  containerStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "darkcyan",
    fontWeight: 600,
    padding: "0px 16px",
    height: "100vh"
  },

  buttonsStyle: {
    display: "flex"
  },

  navTitleStyle: {
    backgroundColor: 'darkcyan',
    padding: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: "56px"
  },

  navItemStyle: {
    backgroundColor: '#fff',
    padding: 16,
  },

  navItemHoverStyle: {
    backgroundColor: '#fff'
  },

  navStyle: {
    // backgroundColor: ""
  },

  inputStyle: {
    borderWidth: 0,
    margin: '8px 0px',
    padding: 8,
    borderRadius: 2,
    width: "100%",
    outline: "none"
  },

  imgStyle: {
    width: 80,
    height: 80,
  },

   xButton: {
    color: "white",
    backgroundColor: "red",
    borderRadius: "50%",
    width: 20,
    height: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    marginTop: 8,
    position: "absolute"
  },

  shinyStyle: {
    background: `url(../images/shiny.png) center center / contain no-repeat`,
    width: 26,
    height: 26,
    position: "absolute",
    bottom: 0,
    right: 0
  },

  selected: {
    background: `url("../images/selected.png")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "bottom",
    borderBottom: "1px solid #f2f2f2",
  },
}
