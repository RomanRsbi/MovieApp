interface optionType {
  method: string;
  headers: {
    accept: string;
    'Content-Type': string;
    Authorization: string;
  };
  body?: string;
}

async function getResource(url: string, method: string, type = '', id = 0, starCount = 0) {
  try {
    const options: optionType = {
      method: method,
      headers: {
        accept: 'application/json',
        'Content-Type': type,
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTQzNDA1ZWZhM2YwNjE0NmQ1N2IzNjA4MjZlMDMzYSIsIm5iZiI6MTczMzMzMzEwMC41NjgsInN1YiI6IjY3NTA5MDZjNWY3NDRiZjE3NDFlMTQ2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._jYk44OEKibhNRvrhvLEyUR5mh9GFivXQm072e1LeTg'
      }
    };
    if (method === 'POST') {
      options.body = `{"value":${starCount}}`;
      localStorage.setItem(id.toString(), starCount.toString());
    }
    if (method === 'DELETE') {
      localStorage.removeItem(id.toString());
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function createGuestSession(url: string, method: string) {
  try {
    const options = {
      method: method,
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTQzNDA1ZWZhM2YwNjE0NmQ1N2IzNjA4MjZlMDMzYSIsIm5iZiI6MTczMzMzMzEwMC41NjgsInN1YiI6IjY3NTA5MDZjNWY3NDRiZjE3NDFlMTQ2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._jYk44OEKibhNRvrhvLEyUR5mh9GFivXQm072e1LeTg'
      }
    };
    const sessionId = localStorage.getItem('guest_session_id');
    if (sessionId) {
      return sessionId;
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${response.status}`);
    }
    const data = await response.json();
    const guestSessionId = data.guest_session_id;
    localStorage.setItem('guest_session_id', guestSessionId);
    return guestSessionId;
  } catch (error) {
    alert(`Error creating guest session: ${error}`);
  }
}

export default getResource;

export { createGuestSession };
