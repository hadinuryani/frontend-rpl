async function run() {
  const loginUrl = 'http://localhost:8080/api/v1/auth/login';
  const obatUrl = 'http://localhost:8080/api/v1/bidan/obat?limit=5';
  try {
    const loginRes = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'bidan@ic-plus.com',
        password: 'bidan123'
      })
    });
    const { data } = await loginRes.json();
    const token = data.token;

    const res = await fetch(obatUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const body = await res.json();
    console.log("Response success:", body.success);
    console.log("Data count:", body.data ? body.data.length : 'no data');
    console.log("First item:", JSON.stringify(body.data ? body.data[0] : null, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
