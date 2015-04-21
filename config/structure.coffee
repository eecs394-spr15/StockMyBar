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
      title: "Preferences"
      id: "preferences"
      location: "inputs#preferences"
    }
    {
      title: "My Bar"
      id: "items"
      location: "inputs#items"
    }
    {
      title: "Recipes"
      id: "results"
      location: "results#results"
    }
  ]


  initialView:
    location: "inputs#home"