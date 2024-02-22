const apiRequest = async (url, method = 'GET', body = null, headers = {}) => {
    // Token'ı localStorage veya başka bir yerden al
    
    
    const token = localStorage.getItem('token');
  
    if (token) {
      headers['Authorization'] = token;
    }
  
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
  
    if (!response.ok) {
      throw new Error('API isteği başarısız');
    }
  
    return response.json();
  };
  
  export default {
    get: (url, headers) => apiRequest(url, 'GET', null, headers),
    post: (url, body, headers) => apiRequest(url, 'POST', body, headers),
    // Diğer HTTP metodları için benzer fonksiyonlar eklenebilir
  };
  