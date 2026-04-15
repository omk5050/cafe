require('dotenv').config();
const mongoose = require('mongoose');

const Booking = require('./models/Booking');
const Contact = require('./models/Contact');
const Newsletter = require('./models/Newsletter');

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Clearing existing documents...');
        await Booking.deleteMany({});
        await Contact.deleteMany({});
        await Newsletter.deleteMany({});
        console.log('Collections cleared.');

        console.log('Generating seed data...');

        // 10 Bookings
        const bookingsData = [
            { name: "John Doe", email: "john.doe@example.com", service: "Dine-In", message: "Table by the window if possible." },
            { name: "Sarah Smith", email: "sarahS@gmail.com", service: "Dine-In", message: "Anniversary dinner!" },
            { name: "Mike Johnson", email: "mike.j90@test.com", service: "Takeaway", message: "I'll be there at 7." },
            { name: "Emily Clark", email: "emily.clark@outlook.com", service: "Dine-In", message: "High chair needed please." },
            { name: "Robert Wilson", email: "rob.wils@domain.com", service: "Takeaway", message: "Extra spicy pizzas please." },
            { name: "Jessica Brown", email: "jessb@webmail.com", service: "Dine-In", message: "Can we get the corner booth?" },
            { name: "David Taylor", email: "dtaylor@business.com", service: "Dine-In", message: "" },
            { name: "Emma Anderson", email: "emma.anderson12@example.com", service: "Takeaway", message: "Order for Emma." },
            { name: "James Thomas", email: "j.thomas88@testmail.com", service: "Dine-In", message: "Allergic to nuts." },
            { name: "Olivia Martinez", email: "olivia.m@startup.io", service: "Dine-In", message: "Party of 6." }
        ];

        // 5 Contacts
        const contactsData = [
            { name: "Alice Green", email: "alice.g@events.com", phone: "555-0101", service: "Catering", message: "What are your rates for a wedding of 50 people?" },
            { name: "Brian White", email: "brian.white@office.com", phone: "555-0202", service: "Private Event", message: "Looking to rent out the back room for a corporate retreat next Friday." },
            { name: "Chloe Adams", email: "chloe.a@school.edu", phone: "555-0303", service: "General Inquiry", message: "Do you offer student discounts?" },
            { name: "Daniel Baker", email: "d.baker@chef.org", phone: "555-0404", service: "Feedback", message: "The crust on your Margherita was fantastic yesterday." },
            { name: "Evelyn Carter", email: "evelyn.c@music.net", phone: "555-0505", service: "Private Event", message: "Can we host a live band acoustic night at your venue?" }
        ];

        // 12 Newsletters
        const newslettersData = Array.from({ length: 12 }, (_, i) => ({ email: `subscriber${i + 1}@pizzafans.com`, isVerified: true }));

        console.log('Inserting Bookings...');
        await Booking.insertMany(bookingsData);
        console.log('Inserting Contacts...');
        await Contact.insertMany(contactsData);
        console.log('Inserting Newsletters...');
        await Newsletter.insertMany(newslettersData);

        console.log('Seed database completed successfully.');
        process.exit(0);

    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
