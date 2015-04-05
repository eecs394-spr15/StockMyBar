# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "Home"
      id: "home"
      location: "common#home"
    }
    {
      title: "Items"
      id: "items"
      location: "common#items"
    }
    {
      title: "Recipes"
      id: "recipes"
      location: "common#recipes"
    }
    {
      title: "Shopping List"
      id: "shopping-list"
      location: "common#shopping-list"
    }
  ]


  preloads: [
    {
      id: "items"
      location: "common#items"
    }
    {
      id: "recipes"
      location: "common#recipes"
    }
    {
      id: "shopping-list"
      location: "common#shopping-list"
    }
  ]


  initialView:
    location: "common#home"
