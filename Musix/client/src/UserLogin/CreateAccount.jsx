import React from "react";
import "../Styles_sheet/CreateAccount.css";
import {Link} from "react-router-dom";

function CreateAccount() {
  return (
    <div className="create-container">
      <h3 id="heading">New To the MusixON ?</h3>
      <Link to={`signup`} className="create-btn">
        Create Account
      </Link>
      <p>
        Already have an account ?
        <Link to={`login`} className="login-btn">
          Login
        </Link>
      </p>
    </div>
  );
}

export default CreateAccount;