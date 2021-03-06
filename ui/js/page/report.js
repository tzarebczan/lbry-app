import React from 'react';
import Link from 'component/link';
import {FormRow} from 'component/form'
import Modal from '../component/modal.js';
import lbry from '../lbry.js';

class ReportPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
      modal: null,
    };
  }

  submitMessage() {
    if (this._messageArea.value) {
      this.setState({
        submitting: true
      });
      lbry.reportBug(this._messageArea.value, () => {
        this.setState({
          submitting: false,
          modal: 'submitted',
        });
      });
      this._messageArea.value = '';
    }
  }

  closeModal() {
    this.setState({
      modal: null,
    })
  }

  render() {
    return (
      <main className="main--single-column">
        <section className="card">
          <div className="card__content">
            <h3>Report an Issue</h3>
            <p>Please describe the problem you experienced and any information you think might be useful to us. Links to screenshots are great!</p>
            <div className="form-row">
              <FormRow type="textarea" ref={(t) => this._messageArea = t} rows="10" name="message" placeholder="Description of your issue" />
            </div>
            <div className="form-row form-row-submit">
              <button onClick={(event) => { this.submitMessage(event) }} className={'button-block button-primary ' + (this.state.submitting ? 'disabled' : '')}>{this.state.submitting ? 'Submitting...' : 'Submit Report'}</button>
            </div>
          </div>
        </section>
        <section className="card">
          <div className="card__content">
            <h3>Developer?</h3>
            You can also <Link href="https://github.com/lbryio/lbry/issues" label="submit an issue on GitHub"/>.
          </div>
        </section>
        <Modal isOpen={this.state.modal == 'submitted'} contentLabel="Bug report submitted"
               onConfirmed={(event) => { this.closeModal(event) }}>
          Your bug report has been submitted! Thank you for your feedback.
        </Modal>
      </main>
    );
  }
}

export default ReportPage;
