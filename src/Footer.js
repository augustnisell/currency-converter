import React from 'react';

// FontAwesome
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Footer extends React.Component {
	render () {
		return (
      <footer className="bg-light">
        <div className="container">
          <div className="row text-center py-3">
            <div className="col-12 col-sm-6">
              <a href="https://kind-pasteur-0adfed.netlify.app/" className="text-body">Portfolio page</a>
            </div>
            <div className="col-12 col-sm-6">
              <a href="https://www.linkedin.com/in/augustnisell/" className="text-body pr-1">
              	<span>August </span>
              	<FontAwesomeIcon icon={faLinkedin} />
              </a>
              <p className="d-inline">|</p>
              <a href="https://www.linkedin.com/in/christina-allen-22a225a3/" className="text-body pl-1">
              	<span>Christina </span>
              	<FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>
        </div>
      </footer>
		)
	}
}

export default Footer;