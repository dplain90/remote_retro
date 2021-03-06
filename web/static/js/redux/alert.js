const types = {
  CLEAR_ALERT: "CLEAR_ALERT",
}

export const actions = {
  clearAlert: () => ({ type: types.CLEAR_ALERT }),
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case "UPDATE_RETRO": {
      const { retro, stageConfigs } = action
      return stageConfigs[retro.stage].alert
    }
    case types.CLEAR_ALERT:
      return null
    default:
      return state
  }
}
