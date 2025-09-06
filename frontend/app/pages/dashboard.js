'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/auth');

    fetch('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setUser(data));

    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => setCampaigns(data));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  return (
    <div className="container">
      <h1>Welcome, {user?.profile?.name}</h1>
      <button onClick={handleSignOut}>Sign Out</button>
      {user?.role === 'advertiser' && <CreateCampaign />}
      <h2>Campaigns</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign._id}>
            {campaign.title} - {campaign.niche} - Budget: ${campaign.budget}
          </li>
        ))}
      </ul>
      <InfluencerList />
    </div>
  );
}

function CreateCampaign() {
  const [form, setForm] = useState({ title: '', description: '', niche: '', budget: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      alert('Campaign created');
      setForm({ title: '', description: '', niche: '', budget: '' });
    } else {
      alert('Error creating campaign');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Campaign Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <select value={form.niche} onChange={(e) => setForm({ ...form, niche: e.target.value })} required>
        <option value="">Select Niche</option>
        <option value="fashion">Fashion</option>
        <option value="tech">Tech</option>
        <option value="food">Food</option>
        <option value="travel">Travel</option>
        <option value="other">Other</option>
      </select>
      <input
        type="number"
        placeholder="Budget (USD/ETB)"
        value={form.budget}
        onChange={(e) => setForm({ ...form, budget: e.target.value })}
        required
      />
      <button type="submit">Create Campaign</button>
    </form>
  );
}

function InfluencerList() {
  const [influencers, setInfluencers] = useState([]);
  const [filters, setFilters] = useState({ niche: '', minRate: '', maxRate: '' });

  useEffect(() => {
    const query = new URLSearchParams(filters).toString();
    fetch(`/api/influencers?${query}`)
      .then((res) => res.json())
      .then((data) => setInfluencers(data));
  }, [filters]);

  return (
    <div>
      <h2>Influencers</h2>
      <div>
        <select
          value={filters.niche}
          onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
        >
          <option value="">All Niches</option>
          <option value="fashion">Fashion</option>
          <option value="tech">Tech</option>
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="other">Other</option>
        </select>
        <input
          type="number"
          placeholder="Min Rate"
          value={filters.minRate}
          onChange={(e) => setFilters({ ...filters, minRate: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Rate"
          value={filters.maxRate}
          onChange={(e) => setFilters({ ...filters, maxRate: e.target.value })}
        />
      </div>
      <ul>
        {influencers.map((influencer) => (
          <li key={influencer._id}>
            {influencer.profile.name} - {influencer.profile.niche} - Rate: ${influencer.profile.rate}
          </li>
        ))}
      </ul>
    </div>
  );
          }
