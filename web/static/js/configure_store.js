/* eslint-disable global-require */
import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"

import { reducer as rootReducer } from "./redux"
import interceptOverEagerReactReduxWarning from "./dev-utils/intercept_overeager_reactredux_warning"

const isProd = location.host === "remoteretro.org"
const { __REDUX_DEVTOOLS_EXTENSION__ } = window

const reduxDevToolsEnabled = !isProd && __REDUX_DEVTOOLS_EXTENSION__
const storeEnhancer =
  reduxDevToolsEnabled ? __REDUX_DEVTOOLS_EXTENSION__() : f => f

export default retroChannel => {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk.withExtraArgument(retroChannel)),
      storeEnhancer
    )
  )

  // ensures that updates to reducers are hot reloaded
  if (module.hot) {
    interceptOverEagerReactReduxWarning()

    module.hot.accept("./redux/index", () => {
      const nextRootReducer = require("./redux/index").reducer
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
