import {BEGIN, COMMIT, REVERT} from "redux-optimist"

const types = {
  IDEA_SUBMITTED: "IDEA_SUBMITTED",
  IDEA_COMMITTED: "IDEA_COMMITTED",
  IDEA_CREATED: "IDEA_CREATED",
  UPDATE_IDEA: "UPDATE_IDEA",
  DELETE_IDEA: "DELETE_IDEA",
}

let newIdeaTransactionID = 10000000

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
      const farOffId = 10000000

      dispatch({
        type: types.IDEA_SUBMITTED,
        idea: {...idea, id: farOffId },
        optimist: { type: BEGIN, id: newIdeaTransactionID }
      })

      retroChannel.push("new_idea", idea).receive("ok", (idea) => {
        dispatch({
          type: types.IDEA_COMMITTED,
          ideaId: farOffId,
          newAttributes: idea,
          optimist: { type: COMMIT, id: newIdeaTransactionID }
        })
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
    case types.IDEA_SUBMITTED:
    case types.IDEA_CREATED:
      return [...state, action.idea]
    case types.UPDATE_IDEA:
    case types.IDEA_COMMITTED:
      return state.map(idea => (
        (idea.id === action.ideaId) ? { ...idea, ...action.newAttributes } : idea
      ))
    case types.DELETE_IDEA:
      return state.filter(idea => idea.id !== action.ideaId)
    default:
      return state
  }
}
