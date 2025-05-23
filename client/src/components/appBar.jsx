import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/UserSlice';
import { useEffect, useRef } from 'react';

const AppBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userObj = useSelector((state) => state.userSlice);
  const user = userObj.user;
  
  const op = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/'); // דף התחברות
  };

  const start = (
    <span
      style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
      onClick={() => navigate('/')}
    >
      School
    </span>
  );

  const end = user?.firstName ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <Avatar
        label={user.firstName[0]}
        shape="circle"
        style={{ backgroundColor: '#0288d1',color:'#f9f9f9', cursor: 'pointer' }}
        size="large"
        onClick={(e) => op.current.toggle(e)}
      />
      <OverlayPanel ref={op} dismissable showCloseIcon>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem', 
          textAlign: 'right', 
          width: '12rem',
          direction: 'rtl' 
        }}>
          <p><strong>שם:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>אימייל:</strong> {user.email}</p>
          <p><strong>תפקיד:</strong> {user.role}</p>
          <Button
            label="התנתק"
            severity="danger"
            onClick={handleLogout}
          />
        </div>
      </OverlayPanel>
    </div>
  ) : (
    <Button
      label="התחבר"
      text
      onClick={handleLogin}
    />
  );

  return (
    <div style={{ 
      width: '100%', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      zIndex: 50 
    }}>
      <Menubar
        start={start}
        end={end}
        style={{ 
          width: '100%', 
          backgroundColor: '#f9f9f9', 
          border: 'none', 
          padding: '0 1rem' ,
          height: '4rem',
        }}
      />
    </div>
  );
};

export default AppBar;