import React, { useState } from 'react';
import AuthService from '../../auth/AuthService';
import './Login.css';
import logo from '../../assets/logo.png';
import ErrorModal from '../ErrorModal/ErrorModal';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  let navigate = useNavigate();
  localStorage.setItem('authenticated', false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Her giriş denemesinde hata mesajını sıfırla
    setShowModal(false);

    try {
      
      let trimmedUsername = username.trim();
      let trimmedPassword = password.trim();
      const response = await AuthService.login(trimmedUsername, trimmedPassword);
      localStorage.clear();
      debugger;
      console.log('Giriş başarılı, Token:', response.token);
      localStorage.setItem('isLoggedIn', true); // Giriş yapıldığını localStorage'a kaydet
      localStorage.setItem('roles', response.roles); // Kullanıcı rollerini localStorage'a kaydet
      localStorage.setItem('username', response.username); // Kullanıcı adını localStorage'a kaydet
      localStorage.setItem('surname', response.surname); // Kullanıcı soyadını localStorage'a kaydet
      localStorage.setItem('name', response.name); // Kullanıcı adını localStorage'a kaydet
      localStorage.setItem('token', response.token); // Token'ı localStorage'a kaydet
     
      localStorage.setItem('authenticated', true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Giriş hatası', error);
      setErrorMessage(error.message); 
      setShowModal(true);
    }
  };

  return (
    <div className="login-container">
    <img src={logo} alt="Logo" className="login-logo" />
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Giriş Yap</button>
      </form>
      {showModal && <ErrorModal message={errorMessage} onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default Login;
