/* eslint-disable react/jsx-filename-extension, global-require */

import React from "react"
import { render } from "react-dom"
import { bindActionCreators } from "redux"
import { Provider } from "react-redux"
import { AppContainer } from "react-hot-loader"
import { Presence } from "phoenix"
import UserActivity from "./services/user_activity"

import RetroChannel from "./services/retro_channel"
import configureStore from "./configure_store"
import { actions } from "./redux"

const { userToken, retroUUID } = window

const retroChannel = RetroChannel.configure({ userToken, retroUUID })
const store = configureStore(retroChannel)

const actionz = bindActionCreators({ ...actions }, store.dispatch)

retroChannel.on("presence_state", presences => {
  const users = Presence.list(presences, (_username, presence) => (presence.user))
  actionz.setPresences(users)
})

retroChannel.on("presence_diff", actionz.syncPresenceDiff)
retroChannel.on("new_idea_received", actionz.addIdea)

retroChannel.on("proceed_to_next_stage", payload => {
  actionz.updateStage(payload.stage)
})

retroChannel.on("enable_edit_state", ({ id, editorToken }) => {
  actionz.updateIdea(id, { editing: true, editorToken })
})

retroChannel.on("disable_edit_state", disabledIdea => {
  actionz.updateIdea(disabledIdea.id, { editing: false, liveEditText: null, editorToken: null })
})

retroChannel.on("idea_live_edit", editedIdea => {
  actionz.updateIdea(editedIdea.id, editedIdea)
})

retroChannel.on("idea_edited", editedIdea => {
  const updatedIdea = { ...editedIdea, editing: false, liveEditText: null }
  actionz.updateIdea(editedIdea.id, updatedIdea)
})

retroChannel.on("idea_deleted", deletedIdea => {
  actionz.deleteIdea(deletedIdea.id)
})

retroChannel.on("vote_submitted", actionz.addVote)

retroChannel.on("idea_highlighted", highlightedIdea => {
  actionz.updateIdea(highlightedIdea.id, { isHighlighted: !highlightedIdea.isHighlighted })
})

retroChannel.on("user_typing_idea", ({ userToken }) => {
  actionz.updatePresence(userToken, { is_typing: true, last_typed: Date.now() })
  UserActivity.checkIfDoneTyping(store, userToken, () => {
    actionz.updatePresence(userToken, { is_typing: false })
  })
})

retroChannel.join()
  .receive("error", error => console.error(error))
  .receive("ok", initialState => {
    actionz.setInitialState(initialState)

    const renderWithHotReload = () => {
      const RemoteRetro = require("./components/remote_retro").default

      render(
        <AppContainer>
          <Provider store={store}>
            <RemoteRetro retroChannel={retroChannel} userToken={userToken} />
          </Provider>
        </AppContainer>,
        document.querySelector(".react-root")
      )
    }

    // initial render
    renderWithHotReload()

    if (module.hot) {
      // ensure rerenders on module updates
      module.hot.accept(() => { renderWithHotReload() })
    }
  })
