'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'influencer', name: '', niche: '', rate: '', followers: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
    const body = isSignUp
      ? { ...form, profile: { name: form.name, niche: form.niche, rate: form.rate, followers: form.followers } }
      : { email: form.email, password: form.password };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="container">
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {isSignUp && (
          <>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="influencer">Influencer</option>
              <option value="advertiser">Advertiser</option>
            </select>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })}>
              <option value="">Select Niche</option>
              <option value="fashion">Fashion</option>
              <option value="tech">Tech</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Rate (USD/ETB)"
              value={form.rate}
              onChange={(e) => setForm({ ...form, rate: e.target.value })}
            />
            <input
              type="number"
              placeholder="Followers"
              value={form.followers}
              onChange={(e) => setForm({ ...form, followers: e.target.value })}
            />
          </>
        )}
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
      </button>
    </div>
  );
                }
