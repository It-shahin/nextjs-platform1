'use client';

import {useState} from 'react';

const BookEvent = () => {
    const [email, setEmail] = useState('');
    const [Submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
        
    }

    return (
        <div id="book-event">
        {Submitted ? (
            <p className="text-sm">Thank you for signing up !</p>
        ) : (
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Email Addres
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        placeholder="Enter your email address"
                    />
                </div>

                <button type="submit" className="button-submit">Sign Up</button>
            </form>
        )}
        </div>
  )
}

export default BookEvent
