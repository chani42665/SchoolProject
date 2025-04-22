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
  const dispatch = useDispatch();const userObj = useSelector((state) => state.userSlice);
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
      className="text-[#CF885B] text-3xl font-bold cursor-pointer"
      onClick={() => navigate('/')}
    >
      School
    </span>
  );

  const end = user?.firstName ? (
    <div className="flex items-center gap-3">
      <Avatar
        label={user.firstName[0]}
        shape="circle"
        className="bg-[#CF885B] text-black cursor-pointer"
        size="large"
        onClick={(e) => op.current.toggle(e)}
      />
      <OverlayPanel ref={op} dismissable showCloseIcon>
        <div className="flex flex-col gap-2 text-right w-48" style={{ direction: 'rtl' }}>
          <p><strong>שם:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>אימייל:</strong> {user.email}</p>
          <p><strong>תפקיד:</strong> {user.role}</p>
          <Button
            label="התנתק"
            className="p-button p-button-danger text-white bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700"
            onClick={handleLogout}
          />
        </div>
      </OverlayPanel>
    </div>
  ) : (
    <Button
      label="התחבר"
      className="p-button-text text-[#CF885B]"
      onClick={handleLogin}
    />
  );

  return (
    <div className="w-full fixed top-0 left-0 z-50">
      <Menubar
        start={start}
        end={end}
        className="w-full bg-black text-[#CF885B] border-none px-4"
      />
    </div>
  );
};

export default AppBar;
