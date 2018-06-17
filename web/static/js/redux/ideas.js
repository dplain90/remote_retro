const types = {
  IDEA_SUBMITTED: "IDEA_SUBMITTED",
  IDEA_COMMITTED: "IDEA_COMMITTED",
  IDEA_CREATED: "IDEA_CREATED",
  IDEA_UPDATED: "IDEA_UPDATED",
  IDEA_DELETED: "IDEA_DELETED",
}

let farOffId = 10000000
export const actions = {
  ideaCreated: idea => {
    return (dispatch, getState, _retroChannel) => {
      if (idea.submitter_token === window.userToken) { return }

      dispatch({
        type: types.IDEA_CREATED,
        idea,
      })
    }
  },

  submitIdeaOptimistically: idea => {
    return (dispatch, getState, retroChannel) => {
      const push = retroChannel.push("new_idea", idea)
      const placeholderId = farOffId++

      dispatch({
        type: types.IDEA_SUBMITTED,
        idea: { ...idea, id: placeholderId },
      })

      push.receive("ok", idea => {
        dispatch({
          type: types.IDEA_COMMITTED,
          ideaId: placeholderId,
          newAttributes: idea,
        })
      })
    }
  },

  updateIdea: (ideaId, newAttributes) => ({
    type: types.IDEA_UPDATED,
    ideaId,
    newAttributes,
  }),

  deleteIdea: ideaId => ({
    type: types.IDEA_DELETED,
    ideaId,
  }),
}

export const reducer = (state = [], action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.ideas
    case types.IDEA_SUBMITTED:
    case types.IDEA_CREATED:
      return [...state, action.idea]
    case types.IDEA_UPDATED:
    case types.IDEA_COMMITTED:
      return state.map(idea => (
        (idea.id === action.ideaId) ? { ...idea, ...action.newAttributes } : idea
      ))
    case types.IDEA_DELETED:
    case types.IDEA_REVERTED:
      return state.filter(idea => idea.id !== action.ideaId)
    default:
      return state
  }
}
