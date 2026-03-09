/**
 * dummyData.ts
 * Dummy data for development & UI testing.
 * Mirrors the real API booking response shape used by ArtistBookingsScreen.
 */

export const DUMMY_BOOKINGS = [
    /* ─── UPCOMING ─── */
    {
        _id: 'dummy-bk-001',
        status: 'PENDING',
        bookingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        address: '12, Andheri West, Mumbai, Maharashtra',
        totalPrice: 2500,
        user: {
            name: 'Priya Sharma',
            profileImage: null,
            phone: '+91 98765 43210',
        },
        service: {
            name: 'Bridal Makeup',
        },
    },
    {
        _id: 'dummy-bk-002',
        status: 'CONFIRMED',
        bookingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        address: '45, Bandra East, Mumbai, Maharashtra',
        totalPrice: 1800,
        user: {
            name: 'Ananya Reddy',
            profileImage: null,
            phone: '+91 91234 56789',
        },
        service: {
            name: 'Party Makeup',
        },
    },
    {
        _id: 'dummy-bk-003',
        status: 'APPROVED',
        bookingDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        address: '8, Powai, Mumbai, Maharashtra',
        totalPrice: 3200,
        user: {
            name: 'Sneha Joshi',
            profileImage: null,
            phone: '+91 88765 12345',
        },
        service: {
            name: 'Engagement Makeup & Saree Draping',
        },
    },
    {
        _id: 'dummy-bk-004',
        status: 'STARTED',
        bookingDate: new Date().toISOString(), // Today / ongoing
        address: '3, Juhu, Mumbai, Maharashtra',
        totalPrice: 1500,
        user: {
            name: 'Kavya Nair',
            profileImage: null,
            phone: '+91 77654 32109',
        },
        service: {
            name: 'HD Makeup',
        },
    },

    /* ─── PAST ─── */
    {
        _id: 'dummy-bk-005',
        status: 'COMPLETED',
        bookingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        address: '22, Malad West, Mumbai, Maharashtra',
        totalPrice: 2000,
        user: {
            name: 'Ritika Mehta',
            profileImage: null,
            phone: '+91 93210 98765',
        },
        service: {
            name: 'Reception Makeup',
        },
    },
    {
        _id: 'dummy-bk-006',
        status: 'COMPLETED',
        bookingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        address: '55, Goregaon East, Mumbai, Maharashtra',
        totalPrice: 900,
        user: {
            name: 'Pooja Tiwari',
            profileImage: null,
            phone: '+91 80012 34567',
        },
        service: {
            name: 'Everyday Glam Makeup',
        },
    },
    {
        _id: 'dummy-bk-007',
        status: 'CANCELLED',
        bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        address: '10, Thane West, Maharashtra',
        totalPrice: 1200,
        user: {
            name: 'Meera Verma',
            profileImage: null,
            phone: '+91 70012 98765',
        },
        service: {
            name: 'Mehndi Look Makeup',
        },
    },
    {
        _id: 'dummy-bk-008',
        status: 'REJECTED',
        bookingDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        address: '7, Borivali North, Mumbai, Maharashtra',
        totalPrice: 2800,
        user: {
            name: 'Deepika Kulkarni',
            profileImage: null,
            phone: '+91 60023 45678',
        },
        service: {
            name: 'Airbrush Bridal Makeup',
        },
    },
];
