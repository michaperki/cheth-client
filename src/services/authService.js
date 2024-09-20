const VIRTUAL_LABS_URL = process.env.REACT_APP_VIRTUAL_LABS_URL;

export const login = async (wallet, message, signature) => {
  console.log('💡 Login to Virtual Labs');
  console.log('💡 ~ authService ~ login ~ wallet', wallet);
  console.log('💡 ~ authService ~ login ~ message', message);
  console.log('💡 ~ authService ~ login ~ signature', signature);
  console.log('💡 ~ authService ~ login ~ VIRTUAL_LABS_URL', VIRTUAL_LABS_URL);
  const response = await fetch(`${VIRTUAL_LABS_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wallet, message, signature }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.accessToken);
  return data.user;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isLoggedIn = () => {
  const token = getToken();
  return !!token;
};
