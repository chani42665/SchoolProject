import React from 'react';
import styled from 'styled-components';

const Login = () => {
  return (
    <StyledWrapper>
      <div className="login-container">
        <form className="login-form">
          <h4 className="title">Log In!</h4>
          <p>Login to your account</p>
          <div className="input-group">
            <input placeholder="email" name="email" id="email" type="text" />
          </div>
          <div className="input-group">
            <input placeholder="Password" name="password" id="password" type="password" />
          </div>
          <button type="submit">Login</button>
          <div className="bottom-text">
            <p><a href="#">Forgot password?</a></p>
          </div>
        </form>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .login-container {
    background-color: #2f2f2f;
    border-radius: 10px;
    box-shadow: rgb(31 31 31 / 17%) 0px -23px 25px 0px inset,
      rgb(108 108 108 / 23%) 0px -36px 30px 0px inset,
      rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
      rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
      rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
    padding: 40px;
    max-width: 400px;
    width: 100%;
    text-align: center;
    margin: 0 auto;
  }

  .login-form {
    display: flex;
    flex-direction: column;
  }

  .login-form h1 {
    margin-bottom: 10px;
    color: #ffffff;
    font-weight: 500;
  }

  .login-form p {
    margin-bottom: 20px;
    color: #777;
  }

  .input-group {
    margin-bottom: 20px;
  }

  .input-group input {
    background: none;
    border: 1px solid #353535;
    padding: 15px 15px;
    font-size: 16px;
    border-radius: 8px;
    color: #979797;
    width: 90%;
    box-shadow: rgb(136 136 136 / 17%) 0px -23px 25px 0px inset,
      rgb(81 81 81 / 23%) 0px -36px 30px 0px inset,
      rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
      rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
      rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
  }

  .input-group input:focus {
    border-color: #0173ed;
    outline: none;
  }

  button {
    padding: 15px;
    border: none;
    border-radius: 8px;
    background-color: #0173ed;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0173ed;
  }

  .bottom-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    color: #777;
  }

  .bottom-text p {
    margin-bottom: 10px;
  }

  .bottom-text a {
    color: #0173ed;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .bottom-text a:hover {
    color: #0173ed;
  }`;

export default Login;
