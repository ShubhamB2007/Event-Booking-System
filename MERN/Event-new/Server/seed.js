const mongoose = require('mongoose');
const Event = require('./models/Event');
const Venue = require('./models/Venue');

mongoose.connect('mongodb+srv://shubhambudhakar:2007shubham@cluster0.3ifwv.mongodb.net/Events?retryWrites=true&w=majority&appName=Cluster0');

const seedData = async () => {
  try {

    await Event.deleteMany({});
    await Venue.deleteMany({});

    const venueDocs = await Venue.insertMany([
      { name: 'Wankhede Stadium', capacity: 33000, location: 'Mumbai' },
      { name: 'PVR Cinemas', capacity: 250, location: 'Delhi' },
      { name: 'Madison Square Garden', capacity: 20000, location: 'New York' },
      { name: 'Broadway Theater', capacity: 1000, location: 'New York' },
      { name: 'Laugh Out Loud Club', capacity: 300, location: 'Bangalore' },
      { name: 'Lusail Stadium', capacity: 80000, location: 'Qatar' },
    ]);


    const eventsData = [
      {
        name: "Cricket CWC Final 23",
        date: "23 Nov 2023",
        description: "Experience the thrilling climax of the Cricket World Cup 2023 as the top two teams battle it out for ultimate glory. Witness unmatched energy, high-pressure moments, and unforgettable performances in this prestigious cricketing showdown.",
        time: "6:00 PM",
        Venue: venueDocs[0]._id,
        category: "sports",
        price: 5000,
        email: "contact@cwcfinal.com",
        image: "/image1.jpg",
        capacity: 50000,
        availableSeats: 25000
      },
      {
        name: "Stree 2",
        date: "10 Oct 2023",
        description: "Get ready for chills and thrills with the much-awaited sequel, Stree 2. This horror-comedy will keep you on the edge of your seat, blending laughter and scares. Don’t miss this cinematic experience with an epic story twist!",
        time: "7:30 PM",
        Venue: venueDocs[1]._id,
        category: "movies",
        price: 300,
        email: "tickets@stree2.com",
        image: "/image2.jpg",
        capacity: 300,
        availableSeats: 150
      },
      {
        name: "Coldplay Concert",
        date: "15 Dec 2023",
        description: "Experience Coldplay live as they take the stage with their iconic hits and mesmerizing visuals. Enjoy the music that transcends time and connects people worldwide in this unmissable, electrifying concert.",
        time: "8:00 PM",
        Venue: venueDocs[2]._id,
        category: "concerts",
        price: 8000,
        email: "info@coldplaylive.com",
        image: "/image3.jpg",
        capacity: 60000,
        availableSeats: 45000
      },
      {
        name: "Saturday Night Comedy",
        date: "5 Jan 2024",
        description: "Laugh your heart out at Saturday Night Comedy! Featuring top stand-up comedians, hilarious sketches, and nonstop entertainment. Perfect for a fun-filled night with friends or family to kickstart your weekend.",
        time: "9:00 PM",
        Venue: venueDocs[3]._id,
        category: "comedy",
        price: 1000,
        email: "tickets@sncomedy.com",
        image: "/image5.jpg",
        capacity: 200, 
        availableSeats: 80
      },
      {
        name: "Aladdin",
        date: "12 Feb 2024",
        description: "Step into the magical world of Aladdin, a live theatrical performance full of breathtaking sets, costumes, and unforgettable songs. Join Aladdin and Jasmine as they embark on a journey of love and adventure.",
        time: "6:30 PM",
        Venue: venueDocs[4]._id,
        category: "festivals",
        price: 1500,
        email: "info@aladdinshow.com",
        image: "/image4.jpg",
        capacity: 400,
        availableSeats: 200
      },
      {
        name: "FIFA World Cup Final 2022",
        date: "18 Dec 2022",
        description: "The grand finale of the FIFA World Cup 2022 delivers the most exciting moments in football history. Witness the passion, skill, and determination of the world’s best teams as they compete for ultimate victory.",
        time: "8:30 PM",
        Venue: venueDocs[5]._id,
        category: "sports",
        price: 10000,
        email: "tickets@fifafinal2022.com",
        image: "/image6.jpg",
        capacity: 80000,
        availableSeats: 40000
      },
      {
        name: "UCL Final 2024",
        date: "1 Jun 2024",
        description: "The UEFA Champions League Final 2024 brings together Europe’s elite clubs in a battle for glory. An evening of breathtaking goals, historic moments, and football brilliance awaits all fans at the world’s grandest club stage.",
        time: "9:00 PM",
        Venue: venueDocs[5]._id,
        category: "sports",
        price: 12000,
        email: "uclfinal2024@uefa.com",
        image: "/image7.jpg",
        capacity: 70000,
        availableSeats: 35000
      }
    ];

    await Event.insertMany(eventsData);

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedData();
