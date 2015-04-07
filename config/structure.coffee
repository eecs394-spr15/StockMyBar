# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "Home"
      id: "home"
      location: "inputs#home"
    }
    {
      title: "Items"
      id: "items"
      location: "inputs#items"
    }
    {
      title: "Results"
      id: "results"
      location: "results#results"
    }
  ]


  initialView:
    location: "inputs#home"


  drawers:
    left:
      id: "leftDrawer"
      location: "common#drawer"
      showOnAppLoad: false
    options:
      animation: "swingingDoor"
