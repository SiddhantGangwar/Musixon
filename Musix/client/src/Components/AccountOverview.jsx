import React from "react";
import "../Styles_sheet/Profile.css";
import { useSelector } from "react-redux";
function AccountOverview() {
  const name = useSelector(state => state.user.userName);
  const email = useSelector(state => state.user.userEmail);
  const dob = useSelector(state => state.user.userDob);
  const gender = useSelector(state => state.user.userGender);
  const region = useSelector(state => state.user.userRegion);
  return (
    <>
      <div className="top-prof-content">
        <h2>Account Overview</h2>
        <h3>Profile</h3>
        {name ? (
          <p>
            Username <span>{name}</span>
          </p>
        ) : null}
        {email ? (
          <p>
            Email <span>{email}</span>
          </p>
        ) : null}
        {dob ? (
          <p>
            Date of birth <span>{dob}</span>
          </p>
        ) : null}
        {gender ? (
          <p>
            Gender <span>{gender}</span>
          </p>
        ) : null}
        {region ? (
          <p>
            Country or region <span>{region}</span>
          </p>
        ) : null}
      </div>
      <div className="plan-content">
        <h2>Your Plan</h2>
        <div className="plan-box">
          <h3>MusixON Free</h3>
        </div>
        <p>Play any song anytime without any cost.</p>
      </div>
      <div className="policy-content">
        <h2>Our Policy</h2>
        <p>
          By signin to this app yor are accepting to share your data with us.
        </p>
        <p>Currently we didn't offer any subscription plan.</p>
        <p>
          You are recommended to use the app only in your pc or in desktop mode
          in your mobile.
        </p>
      </div>
    </>
  );
}

export default AccountOverview;