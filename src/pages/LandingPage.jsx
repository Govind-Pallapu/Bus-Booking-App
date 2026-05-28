import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #041e71 0%, #f0119a 50%, #6fe00c 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>

            {/* Bus Icon */}
            <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>
                🚌
            </div>

            {/* App Name */}
            <h1 style={{
                fontSize: '3rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '0.5rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                lineHeight: 1.2
            }}>
                Welcome To
            </h1>
            <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 900,
                color: '#fbbf24',
                marginBottom: '1rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                lineHeight: 1.2
            }}>
                Buddy Bus Booking 🎉
            </h1>

            {/* Tagline */}
            <p style={{
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.85)',
                marginBottom: '3rem',
                maxWidth: '500px',
                lineHeight: 1.6
            }}>
                Book your bus tickets easily, safely and comfortably across India!
            </p>

            {/* Features */}
            <div style={{
                display: 'flex',
                gap: '1.5rem',           
                marginBottom: '3rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {[
                    { icon: '🔍', text: 'Search Buses' },
                    { icon: '💺', text: 'Choose Seat' },
                    { icon: '🎫', text: 'Get Ticket' },
                    { icon: '❌', text: 'Easy Cancel' },
                ].map(f => (
                    <div key={f.text} style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '1rem 1.5rem',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
                        {f.text}
                    </div>
                ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '0.9rem 2.5rem',
                        borderRadius: '50px',
                        border: 'none',
                        background: '#fbbf24',
                        color: '#1e293b',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(251,191,36,0.4)',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.target.style.transform = 'translateY(0)'}
                >
                    🔐 Login
                </button>

                <button
                    onClick={() => navigate('/register')}
                    style={{
                        padding: '0.9rem 2.5rem',
                        borderRadius: '50px',
                        border: '2px solid rgba(255,255,255,0.8)',
                        background: 'transparent',
                        color: '#ffffff',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={e => { e.target.style.background = 'rgba(255,255,255,0.2)' }}
                    onMouseOut={e => { e.target.style.background = 'transparent' }}
                >
                    📝 Register
                </button>
            </div>

            {/* Footer */}
            <p style={{
                position: 'absolute',
                bottom: '0 rem',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.85rem'
            }}>
                © 2026 Buddy Bus Booking — All rights reserved
            </p>

            {/* Bounce animation */}
            <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
        </div>
    )
}