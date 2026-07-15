const BASE_URL = import.meta.env.VITE_API_URL || 'https://my-portfolio-server-xdom.onrender.com';

export default BASE_URL.replace(/\/$/, '');
