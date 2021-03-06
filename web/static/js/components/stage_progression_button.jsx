import React, { Component } from "react"
import PropTypes from "prop-types"
import Modal from "react-modal"
import * as AppPropTypes from "../prop_types"
import styles from "./css_modules/stage_progression_button.css"

class StageProgressionButton extends Component {
  state = { modalOpen: false }

  handleStageProgressionButtonClick = () => {
    const { config } = this.props
    const noConfirmationNecessary = !config.confirmationMessage
    if (noConfirmationNecessary) {
      this.handleStageProgression()
    } else {
      this.setState({ modalOpen: true })
    }
  }

  handleStageProgression = () => {
    const { config, retroChannel } = this.props

    retroChannel.push("retro_edited", { stage: config.nextStage })
  }

  handleModalClose = () => {
    this.setState({ modalOpen: false })
  }

  render() {
    const {
      buttonDisabled,
      className,
      currentUser,
      config: { progressionButton, confirmationMessage },
    } = this.props

    const { modalOpen } = this.state

    if (!progressionButton || !currentUser.is_facilitator) return null

    return (
      <div className={`${className} ${styles.index}`}>
        <Modal
          contentLabel="Modal"
          isOpen={modalOpen}
          className="ui tiny modal visible transition fade in active"
        >
          <div className="content">
            <p>{confirmationMessage}</p>
          </div>
          <div className="actions" ref={ref => { this.modalActionsRef = ref }}>
            <button
              className="ui negative button"
              id="no"
              onClick={this.handleModalClose}
            >
              No
            </button>
            <button
              autoFocus
              className="ui positive button"
              id="yes"
              onClick={this.handleStageProgression}
            >
              Yes
            </button>
          </div>
        </Modal>
        <button
          className="fluid ui right labeled blue icon button"
          onClick={this.handleStageProgressionButtonClick}
          disabled={buttonDisabled}
        >
          { progressionButton.copy }
          <i className={`${progressionButton.iconClass} icon`} />
        </button>
      </div>
    )
  }
}

StageProgressionButton.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  currentUser: AppPropTypes.presence.isRequired,
  className: PropTypes.string,
  config: PropTypes.object,
  buttonDisabled: PropTypes.bool,
}

StageProgressionButton.defaultProps = {
  className: "",
  buttonDisabled: false,
  config: null,
}

export default StageProgressionButton
