const types = {
  IDEA_CREATED: "IDEA_CREATED",
  UPDATE_IDEA: "UPDATE_IDEA",
  DELETE_IDEA: "DELETE_IDEA",
}

export const actions = {
  ideaCreated: idea => {
    return (dispatch, getState, retroChannel) => {
      if (idea.submitter_token === window.userToken) { return }

      dispatch({
        type: types.IDEA_CREATED,
        idea,
      })
    }
  },

  submitIdeaOptimistically: idea => {
    return (dispatch, getState, retroChannel) => {
      dispatch({
        type: types.IDEA_CREATED,
        idea,
      })

      retroChannel.push("new_idea", idea)
        .receive("ok", () => {
          debugger
        })
        .receive("error", () => {
          debugger
        })
    }
  },

  updateIdea: (ideaId, newAttributes) => ({
    type: types.UPDATE_IDEA,
    ideaId,
    newAttributes,
  }),

  deleteIdea: ideaId => ({
    type: types.DELETE_IDEA,
    ideaId,
  }),
}

export const reducer = (state = [], action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.ideas
    case types.IDEA_CREATED:
      return [...state, action.idea]
    case types.UPDATE_IDEA:
      return state.map(idea => (
        (idea.id === action.ideaId) ? { ...idea, ...action.newAttributes } : idea
      ))
    case types.DELETE_IDEA:
      return state.filter(idea => idea.id !== action.ideaId)
    default:
      return state
  }
}
