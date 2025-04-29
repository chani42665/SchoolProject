import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useDispatch } from 'react-redux';
import { createUser } from '../store/UserSlice';

// Custom styles for PrimeReact components to work well with Tailwind
const customStyles = `
  .p-card {
    width: 100%;
  }
  .p-password, .p-inputtext {
    width: 100% !important;
  }
`;

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
    <>
      {/* מספר קטן של סגנונות חיוניים להתאמה בין Tailwind ו-PrimeReact */}
      <style>{customStyles}</style>
      
      {/* מיכל מרכזי עם מלוא גובה המסך */}
      <div className="flex justify-center items-center min-h-screen bg-gray-50 w-full p-4">
        {/* כרטיס הלוגין ברוחב מוגבל */}
        <div className="w-full max-w-md">
          <Card className="shadow-md">
            <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">Login</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <InputText
                  id="email"
                  placeholder="Enter your email"
                  {...register('email', { required: 'Email is required' })}
                  className={errors.email ? 'p-invalid' : ''}
                />
                {errors.email && <Message severity="error" text={errors.email.message} />}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Password is required' }}
                  render={({ field }) => (
                    <Password
                      id="password"
                      placeholder="Enter your password"
                      toggleMask
                      className={errors.password ? 'p-invalid' : ''}
                      {...field}
                    />
                  )}
                />
                {errors.password && <Message severity="error" text={errors.password.message} />}
              </div>

              <Button label="Login" type="submit" icon="pi pi-sign-in" className="w-full mt-6" />
            </form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;