import React from "react"
import Visualize from "./Visualize"
import Header from "./Header"

class App extends React.Component {
  render() {
    return (
      <div className="container mx-auto px-4 h-screen flex flex-col">
        <div className="flex-none">
          <Header />
        </div>
        <div className="flex-grow">
          <Visualize />
        </div>
      </div>
    )
  }
}

export default App
