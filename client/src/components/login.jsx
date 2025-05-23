import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useDispatch } from 'react-redux';
import { createUser } from '../store/UserSlice';



const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, formState: { errors }, control, handleSubmit } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data) => {
    console.log(data);
    dispatch(createUser(data))
      .unwrap()
      .then(() => {
        navigate('/menu'); // מעבר לתפריט אם ההתחברות הצליחה
      })
      .catch((err) => {
        console.error('Login failed:', err); // טיפול בשגיאה
      });
  };


  return (
    <div className="surface-ground flex align-items-center justify-content-center min-h-screen p-4">
      <div className="w-full md:w-30rem"> {/* שינוי הרוחב לערך קבוע */}
        <Card className="surface-card shadow-2 border-round-xl p-4">
          <div className="text-center mb-5">
            <div className="surface-200 border-circle w-6rem h-6rem mx-auto mb-3 flex align-items-center justify-content-center">
              <i className="pi pi-user text-4xl text-primary"></i>
            </div>
            <div className="text-900 text-3xl font-medium mb-3">Welcome</div>
            <span className="text-600 font-medium">Sign in to your account</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-4">
            <div className="field w-full">
              <label htmlFor="email" className="block text-900 font-medium mb-2">
                Email
              </label>
              <span className="p-input-icon-right w-full block">
                <i className="pi pi-envelope" />
                <InputText
                  id="email"
                  placeholder="Enter your email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full"
                />
              </span>
              {errors.email && (
                <small className="p-error block mt-2">{errors.email.message}</small>
              )}
            </div>

            <div className="field w-full">
              <label htmlFor="password" className="block text-900 font-medium mb-2">
                Password
              </label>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required' }}
                render={({ field }) => (
                  <div className="w-full block">
                    <Password
                      id="password"
                      placeholder="Enter your password"
                      toggleMask
                      className="w-full"
                      inputClassName="w-full"
                      {...field}
                      feedback={false}
                    />
                  </div>
                )}
              />
              {errors.password && (
                <small className="p-error block mt-2">{errors.password.message}</small>
              )}
            </div>

            <Button
              type="submit"
              label="Sign In"
              icon="pi pi-sign-in"
              severity="primary"
              className="w-full"
            />
          </form>

        </Card>
      </div>
    </div>
  );
};

export default Login;