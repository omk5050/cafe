require('dotenv').config();
const mongoose = require('mongoose');

const Booking = require('./models/Booking');
const Contact = require('./models/Contact');
const Newsletter = require('./models/Newsletter');

const bookings = [
  { name: 'James Carter',    email: 'j.carter@mail.com',    service: 'Dine-In',  message: 'Could we have a booth near the window? It\'s our anniversary.' },
  { name: 'Sofia Rossi',     email: 'sofia.r@outlook.com',  service: 'Dine-In',  message: 'Party of 5 including one high chair needed.' },
  { name: 'Marcus Webb',     email: 'marcusw@gmail.com',    service: 'Takeaway', message: 'Extra jalapeños on everything, please.' },
  { name: 'Priya Sharma',    email: 'priya.s@india.in',     service: 'Dine-In',  message: 'One guest has a gluten intolerance, please advise.' },
  { name: 'Liam O\'Brien',   email: 'liam.ob@domain.ie',    service: 'Dine-In',  message: '' },
  { name: 'Yuki Tanaka',     email: 'y.tanaka@jpmail.jp',   service: 'Takeaway', message: 'Picking up at 7:30 PM sharp.' },
  { name: 'Fatima Al-Amin',  email: 'fatima.aa@emial.ae',   service: 'Dine-In',  message: 'Halal options only, please.' },
  { name: 'Noah Williams',   email: 'noah.w@startup.com',   service: 'Dine-In',  message: 'Corporate lunch for 8 people.' },
];

const contacts = [
  { name: 'Grace Thompson',   email: 'grace.t@weddings.com',  phone: '555-0198', service: 'Catering',       message: 'We are looking to cater a wedding of around 80 guests next spring. Can you provide a quote?' },
  { name: 'Derek Holland',    email: 'd.holland@corp.net',     phone: '555-0247', service: 'Private Event',  message: 'Interested in booking the restaurant exclusively for a Friday evening corporate event.' },
  { name: 'Angela Müller',    email: 'a.muller@berlin.de',     phone: '555-0313', service: 'General',        message: 'Do you deliver to the downtown area after 10 PM?' },
  { name: 'Tom Bradley',      email: 'tbradley@foodie.co',     phone: '555-0422', service: 'Feedback',       message: 'The Truffle Mushroom pizza was absolutely incredible last week. Will definitely be back!' },
  { name: 'Isabella Ferreira',email: 'isa.ferreira@email.br', phone: '555-0561', service: 'Private Event',  message: 'Planning a 30th birthday dinner for 20 guests. Would love a dedicated server.' },
];

// 10 newsletter subscribers
const newsletters = Array.from({ length: 10 }, (_, i) => ({
  email: `subscriber${i + 1}@pizzafans.com`,
  isVerified: true,
}));

const seedDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    console.log('🗑  Clearing existing data...');
    await Promise.all([
      Booking.deleteMany({}),
      Contact.deleteMany({}),
      Newsletter.deleteMany({}),
    ]);
    console.log('   Collections cleared.');

    console.log('🌱 Inserting seed data...');
    await Promise.all([
      Booking.insertMany(bookings),
      Contact.insertMany(contacts),
      Newsletter.insertMany(newsletters),
    ]);

    console.log(`✅ Seeded  ${bookings.length} bookings, ${contacts.length} contacts, ${newsletters.length} newsletter subscribers.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedDB();
