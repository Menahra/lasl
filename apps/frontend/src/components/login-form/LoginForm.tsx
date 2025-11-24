import { Label } from "@radix-ui/react-label";
import { Link } from "@tanstack/react-router";
import "./styles.css";
import { Trans } from "@lingui/react/macro";

export const LoginForm = () => {
  const handleFormSubmit = () => {};

  return (
    <div className="LoginFormCardWrapper">
      <div className="LoginFormCardHeader">
        <h3 className="LoginFormCardTitle">
          <Trans>Welcome back</Trans>
        </h3>
        <p className="LoginFormCardSubTitle">
          <Trans>Sign in to enhance your learning</Trans>
        </p>
      </div>
      <form onSubmit={handleFormSubmit} className="LoginForm">
        <div className="LoginFormInputFieldWrapper">
          <Label htmlFor="email" className="LoginFormLabel">
            <Trans>Email</Trans>
          </Label>
          <input
            id="email"
            className="LoginFormInput"
            type="email"
            placeholder="student@example.com"
          />
        </div>
        <div className="LoginFormInputFieldWrapper">
          <Label htmlFor="password" className="LoginFormLabel">
            <Trans>Password</Trans>
          </Label>
          <input
            id="password"
            className="LoginFormInput"
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <button className="LoginFormSubmitButton" type="submit">
          <Trans>Sign In</Trans>
        </button>
      </form>
      <div className="LoginFormCardFooter">
        <p>
          <Trans>Don't have an account yet?</Trans>
        </p>
        <Link className="LoginFormRegisterLink" to="/register">
          <Trans>Sign Up</Trans>
        </Link>
      </div>
    </div>
  );
};
