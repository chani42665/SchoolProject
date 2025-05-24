import React from 'react';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
//import './styles.css'; // ייבוא הקובץ שהכנת

const Menu = () => {
  const navigate = useNavigate();
  const userObj = useSelector((state) => state.userSlice);
  const user = userObj.user;
  const pages=[];
switch(user.role){
    case 'admin':
        pages.push(
            { name: 'Students', path: '/students', icon: 'pi pi-users', color: '#3B82F6' },
            { name: 'Teachers', path: '/teachers', icon: 'pi pi-user', color: '#10B981' },
            { name: 'Classes', path: '/classes', icon: 'pi pi-building', color: '#8B5CF6' },
            { name: 'Settings', path: '/settings', icon: 'pi pi-cog', color: '#F59E0B' }
        );
        break;
    case 'teacher':
        pages.push(
            { name: 'Students', path: '/students', icon: 'pi pi-users', color: '#3B82F6' },
            { name: 'Classes', path: '/classes', icon: 'pi pi-building', color: '#8B5CF6' }
        );
        break;
    case 'student':
        pages.push(
            { name: 'Classes', path: '/classes', icon: 'pi pi-building', color: '#8B5CF6' }
        );
        break;
    default:
        pages.push(
            { name: 'Home', path  : '/', icon: 'pi pi-home', color: '#F59E0B' }
        );                
}
  // pages = [
  //   { name: 'Students', path: '/students', icon: 'pi pi-users', color: '#3B82F6' },
  //   { name: 'Teachers', path: '/teachers', icon: 'pi pi-user', color: '#10B981' },
  //   { name: 'Classes', path: '/classes', icon: 'pi pi-building', color: '#8B5CF6' },
  //   { name: 'Settings', path: '/settings', icon: 'pi pi-cog', color: '#F59E0B' }
  // ];

  return (
    
    <div className="menu-container">
      <div className="menu-header">
        <Card className="menu-header-card">
          <h1>Main Menu</h1>
          <p>Choose an option to continue</p>
        </Card>
      </div>

      <div className="menu-grid">
        {pages.map((page, index) => (
          <Card
            key={index}
            className="menu-card"
            style={{ background: `linear-gradient(135deg, ${page.color}, ${page.color}dd)` }}
            onClick={() => navigate(page.path)}
          >
            <div className="menu-card-content">
              <div className="icon-container">
                <i className={`${page.icon} icon`}></i>
              </div>
              <h3 className="card-title">{page.name}</h3>
              <p className="card-subtitle">Manage {page.name.toLowerCase()}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="menu-footer">
        <p>Click on any card to navigate to the respective section</p>
      </div>
    </div>
  );
};

export default Menu;
