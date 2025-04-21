import React from 'react';
import { useForm , Controller  } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css';  
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';
import { useDispatch } from 'react-redux';
import { createUser } from '../store/UserSlice';


const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { register, formState: { errors }, control, handleSubmit } = useForm({
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = (data) => {
    console.log(data)
    dispatch(createUser(data)).unwrap()
    .then(() => {
      navigate("/menu"); // מעבר לתפריט אם ההתחברות הצליחה
    })
    .catch((err) => {
      console.error("Login failed:", err); // טיפול בשגיאה
    });
  }

  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ minHeight: '100vh' }}>
      <div className="p-card" style={{ width: '300px' }}>
        <h5 className="p-text-center">Login</h5>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText 
              id="email" 
              placeholder="Email" 
              {...register("email", { required: "Email is required" })} 
              className={errors.email ? 'p-invalid' : ''}
            />
            {errors.email && <Message severity="error" text={errors.email.message} />}
          </div>

          <div className="p-field">
            <label htmlFor="password">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <Password 
                  id="password" 
                  placeholder="Password" 
                  toggleMask
                  className={errors.password ? 'p-invalid' : ''}
                  {...field}  // מתחבר ל-react-hook-form
                />
              )}
            />
            {errors.password && <Message severity="error" text={errors.password.message} />}
          </div>

          {/* <Button label="Login" type="submit" className="p-button p-button-rounded p-button-block" /> */}
          <Button label="Login" type="submit" icon="pi pi-user" className="w-10rem mx-auto"></Button>
        </form>
      </div>
    </div>
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
  }
    
   .title {
    color :#0173ed;
  }
  `


export default Login;
