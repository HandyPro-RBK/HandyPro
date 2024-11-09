const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// Customer and provider names arrays remain the same
const customerNames = [
  "Aziz",
  "Hedi",
  "Sami",
  "Tarek",
  "Wassim",
  "Mariem",
  "Asma",
  "Rania",
  "Zeyneb",
  "Dorra",
];

const providerNames = [
  "Ahmed",
  "Mohamed",
  "Ali",
  "Youssef",
  "Omar",
  "Fatma",
  "Leila",
  "Sara",
  "Mouna",
  "Ines",
  "Karim",
  "Slim",
  "Anis",
  "Mehdi",
  "Riadh",
  "Sonia",
  "Rim",
  "Amira",
  "Nour",
  "Yasmine",
];

// Cities array remains the same
const cities = [
  "TUNIS",
  "SFAX",
  "SOUSSE",
  "KAIROUAN",
  "BIZERTE",
  "GABES",
  "ARIANA",
  "GAFSA",
  "MONASTIR",
  "BEN_AROUS",
  "KASSERINE",
  "MEDENINE",
  "NABEUL",
  "TATAOUINE",
  "BEJA",
  "JENDOUBA",
  "MAHDIA",
  "SILIANA",
  "KEF",
  "TOZEUR",
  "MANOUBA",
  "ZAGHOUAN",
  "KEBILI",
];

const categoryPills = [
  {
    name: "Kitchen",
    description: "Professional kitchen improvement and repair services",
  },
  {
    name: "Plumbing",
    description: "Expert plumbing installation and repair services",
  },
  {
    name: "Indoor",
    description: "Quality indoor renovation and maintenance services",
  },
  {
    name: "Outdoor",
    description: "Comprehensive outdoor improvement services",
  },
  {
    name: "Renovation",
    description: "Complete home renovation and remodeling services",
  },
];

const services = [
  {
    title: "Pipe Installation",
    category: "Plumbing",
    image: "src/assets/images/Pipe installation.png",
    description:
      "Professional pipe installation service including copper, PVC, and PEX piping systems. We ensure proper fitting, pressure testing, and compliance with local building codes.",
    price: 450,
    duration: 2,
  },
  {
    title: "Leak Repair",
    category: "Plumbing",
    image: "src/assets/images/Leak Repair.png",
    description:
      "Expert leak detection and repair services for all types of plumbing systems. We use advanced equipment to locate and fix leaks with minimal disruption to your property.",
    price: 300,
    duration: 1,
  },
  {
    title: "Drainage Systems",
    category: "Plumbing",
    image: "src/assets/images/Drainage Systems.png",
    description:
      "Comprehensive drainage system installation and maintenance. We handle everything from simple drain cleaning to complete system overhauls.",
    price: 600,
    duration: 3,
  },
  {
    title: "Maintenance Services",
    category: "Plumbing",
    image: "src/assets/images/maintenance services.png",
    description:
      "Regular plumbing maintenance services to prevent issues and extend system life. Includes inspection, cleaning, and minor repairs.",
    price: 360,
    duration: 1.5,
  },
  {
    title: "Kitchen Cabinets",
    category: "Kitchen",
    image: "src/assets/images/kitchen cabinets.jpg",
    description:
      "Custom kitchen cabinet installation and renovation. We offer a variety of styles and finishes to match your kitchen's aesthetic.",
    price: 900,
    duration: 4,
  },
  {
    title: "Tile Installation",
    category: "Kitchen",
    image: "src/assets/images/Tile Installation.jpg",
    description:
      "Professional kitchen tile installation for floors, backsplashes, and walls. We work with all types of tiles and ensure perfect alignment and grouting.",
    price: 750,
    duration: 3,
  },
  {
    title: "Countertop Installation",
    category: "Kitchen",
    image: "src/assets/images/Countertop Installation.jpg",
    description:
      "Expert countertop installation service for all materials including granite, marble, quartz, and laminate. Includes precise measurements and professional finishing.",
    price: 1200,
    duration: 4,
  },
  {
    title: "Kitchen Remodeling",
    category: "Kitchen",
    image: "src/assets/images/Kitchen Remodeling.jpg",
    description:
      "Complete kitchen remodeling service. From design to execution, we handle all aspects of transforming your kitchen space.",
    price: 3000,
    duration: 8,
  },
  {
    title: "Interior Painting",
    category: "Indoor",
    image: "src/assets/images/Interior Painting.png",
    description:
      "Professional interior painting service with premium paints and expert preparation. We ensure clean lines and perfect coverage.",
    price: 900,
    duration: 4,
  },
  {
    title: "Drywall Installation",
    category: "Indoor",
    image: "src/assets/images/Drywall Installation.jpg",
    description:
      "Complete drywall installation and finishing services. Includes proper insulation, taping, and texture matching.",
    price: 1050,
    duration: 5,
  },
  {
    title: "Flooring Installation",
    category: "Indoor",
    image: "src/assets/images/Flooring Installation.jpg",
    description:
      "Expert installation of various flooring types including hardwood, laminate, tile, and vinyl. Includes subfloor preparation and finishing.",
    price: 1200,
    duration: 6,
  },
  {
    title: "Indoor Landscaping",
    category: "Indoor",
    image: "src/assets/images/Indoor Landscaping.jpg",
    description:
      "Professional indoor plant design and installation. We create beautiful, sustainable indoor green spaces.",
    price: 600,
    duration: 2,
  },
  {
    title: "Lawn Care",
    category: "Outdoor",
    image: "src/assets/images/Lawn Care.jpg",
    description:
      "Comprehensive lawn maintenance including mowing, edging, fertilizing, and pest control. We ensure your lawn stays healthy and beautiful.",
    price: 450,
    duration: 2,
  },
  {
    title: "Deck Building",
    category: "Outdoor",
    image: "src/assets/images/Deck Building.jpg",
    description:
      "Custom deck design and construction using quality materials. Includes planning, permits, and professional installation.",
    price: 2400,
    duration: 8,
  },
  {
    title: "Patio Installation",
    category: "Outdoor",
    image: "src/assets/images/Patio Installation.jpg",
    description:
      "Professional patio installation using various materials including concrete, pavers, and natural stone. Includes proper drainage and foundation work.",
    price: 1800,
    duration: 6,
  },
  {
    title: "Garden Design",
    category: "Outdoor",
    image: "src/assets/images/Garden Design.png",
    description:
      "Complete garden design and installation services. We create beautiful, sustainable outdoor spaces tailored to your preferences.",
    price: 1200,
    duration: 4,
  },
  {
    title: "Home Renovation",
    category: "Renovation",
    image: "src/assets/images/Home Renovation.jpg",
    description:
      "Comprehensive home renovation services. We handle all aspects of home improvement from planning to execution.",
    price: 4500,
    duration: 8,
  },
  {
    title: "Basement Finishing",
    category: "Renovation",
    image: "src/assets/images/Basement Finishing.jpg",
    description:
      "Complete basement finishing services including insulation, drywall, flooring, and lighting. We create functional living spaces.",
    price: 3600,
    duration: 8,
  },
  {
    title: "Bathroom Remodeling",
    category: "Renovation",
    image: "src/assets/images/Bathroom Remodeling.jpg",
    description:
      "Full bathroom remodeling service including plumbing, tiling, fixtures, and lighting. We create modern, functional bathrooms.",
    price: 2700,
    duration: 6,
  },
  {
    title: "Roofing Services",
    category: "Renovation",
    image: "src/assets/images/Roofing Services.jpg",
    description:
      "Professional roofing services including repair, replacement, and maintenance. We work with all types of roofing materials.",
    price: 3000,
    duration: 8,
  },
  {
    title: "Appliance Installation",
    category: "Kitchen",
    image: "src/assets/images/Appliance Installation.jpg",
    description:
      "Professional installation of kitchen appliances including dishwashers, ovens, refrigerators, and microwaves. Includes proper connection to electrical and plumbing systems.",
    price: 600,
    duration: 2,
  },
  {
    title: "Kitchen Sink Installation",
    category: "Kitchen",
    image: "src/assets/images/Kitchen Sink Installation.jpg",
    description:
      "Expert installation of kitchen sinks and faucets. Includes plumbing connections and sealing to prevent leaks.",
    price: 540,
    duration: 2.5,
  },
  {
    title: "Water Heater Service",
    category: "Plumbing",
    image: "src/assets/images/Water Heater Service.jpg",
    description:
      "Installation, repair, and maintenance of water heaters. Services include replacement, pressure adjustment, and thermal maintenance.",
    price: 750,
    duration: 3,
  },
  {
    title: "Toilet Installation",
    category: "Plumbing",
    image: "src/assets/images/Toilet Installation.jpg",
    description:
      "Professional toilet installation and replacement services. Includes removal of old unit, wax ring replacement, and proper sealing.",
    price: 525,
    duration: 2,
  },
  {
    title: "Ceiling Repair",
    category: "Indoor",
    image: "src/assets/images/Ceiling Repair.jpg",
    description:
      "Expert ceiling repair services including crack fixing, water damage repair, and texture matching.",
    price: 840,
    duration: 4,
  },
  {
    title: "Light Fixture Installation",
    category: "Indoor",
    image: "src/assets/images/Light Fixture Installation.jpg",
    description:
      "Professional installation of various light fixtures including chandeliers, recessed lighting, and ceiling fans.",
    price: 450,
    duration: 1.5,
  },
  {
    title: "Fence Installation",
    category: "Outdoor",
    image: "src/assets/images/Fence Installation.jpg",
    description:
      "Custom fence installation using various materials including wood, vinyl, and metal. Includes proper post setting and alignment.",
    price: 2100,
    duration: 8,
  },
  {
    title: "Outdoor Lighting",
    category: "Outdoor",
    image: "src/assets/images/Outdoor Lighting.jpg",
    description:
      "Installation of outdoor lighting systems including pathway lights, security lights, and decorative fixtures.",
    price: 1050,
    duration: 4,
  },
  {
    title: "Window Installation",
    category: "Renovation",
    image: "src/assets/images/Window Installation.jpg",
    description:
      "Professional window replacement and installation services. Includes proper insulation and weatherproofing.",
    price: 1350,
    duration: 3,
  },
  {
    title: "Garage Conversion",
    category: "Renovation",
    image: "src/assets/images/Garage Conversion.jpg",
    description:
      "Complete garage conversion services to create additional living space. Includes insulation, electrical, and finishing work.",
    price: 6000,
    duration: 12,
  },
];

const reviewComments = [
  "Excellent service! Very professional and completed the work on time.",
  "Great attention to detail. Would definitely recommend.",
  "Professional service provider, fair pricing.",
  "Very satisfied with the quality of work.",
  "Prompt and efficient service. Will hire again.",
  "Outstanding workmanship and attention to detail.",
  "Highly skilled and professional team.",
  "Completed the project ahead of schedule.",
  "Great communication throughout the process.",
  "Would definitely use their services again.",
];

async function main() {
  console.log("Starting seeding...");

  // The rest of the code (from this point onward) remains exactly the same as your original
  // Users creation, service providers creation, categories creation, services creation,
  // reviews creation, and bookings creation all remain unchanged

  // 1. Create multiple users (customers)
  console.log("Creating sample users...");
  const users = [];
  for (let i = 0; i < customerNames.length; i++) {
    const user = await prisma.user.upsert({
      where: { email: `${customerNames[i].toLowerCase()}@example.com` },
      update: {},
      create: {
        email: `${customerNames[i].toLowerCase()}@example.com`,
        password: await bcrypt.hash("password123", 10),
        username: customerNames[i].toLowerCase(),
        userType: "CUSTOMER",
        address: `${i + 1} Customer Street`,
        phoneNumber: `+216${Math.floor(10000000 + Math.random() * 90000000)}`,
        photoUrl: `${customerNames[i].toLowerCase()}.jpg`,
      },
    });
    users.push(user);
  }

  console.log("Creating service providers...");
  const serviceProviders = [];
  for (let i = 0; i < providerNames.length; i++) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const serviceProvider = await prisma.serviceProvider.upsert({
      where: { email: `${providerNames[i].toLowerCase()}@provider.com` },
      update: {},
      create: {
        email: `${providerNames[i].toLowerCase()}@provider.com`,
        password: await bcrypt.hash("password123", 10),
        username: providerNames[i].toLowerCase(),
        photoUrl: `provider${i + 1}.jpg`,
        phoneNumber: `+216${Math.floor(10000000 + Math.random() * 90000000)}`,
        birthDate: new Date(
          1980 + Math.floor(Math.random() * 20),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
        rating: (4 + Math.random()).toFixed(2),
        isAvailable: true,
        city: randomCity,
      },
    });
    serviceProviders.push(serviceProvider);

    for (let day = 0; day < 7; day++) {
      await prisma.schedule.create({
        data: {
          providerId: serviceProvider.id,
          dayOfWeek: day,
          startTime: new Date(2024, 0, 1, 8 + Math.floor(Math.random() * 2), 0),
          endTime: new Date(2024, 0, 1, 16 + Math.floor(Math.random() * 3), 0),
          isAvailable: Math.random() > 0.2,
        },
      });
    }
  }

  console.log("Creating categories...");
  for (const category of categoryPills) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        description: category.description,
        image: `${category.name.toLowerCase()}.jpg`,
      },
    });
  }

  console.log("Creating services...");
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((cat) => [cat.name, cat.id]));

  for (const serviceProvider of serviceProviders) {
    const numServices = 2 + Math.floor(Math.random() * 3);
    const shuffledServices = [...services].sort(() => Math.random() - 0.5);

    for (let i = 0; i < numServices; i++) {
      const serviceTemplate = shuffledServices[i];
      const categoryId = categoryMap.get(serviceTemplate.category);

      const priceVariation = 0.9 + Math.random() * 0.2;
      const createdService = await prisma.service.create({
        data: {
          name: serviceTemplate.title,
          description: serviceTemplate.description,
          price: serviceTemplate.price * priceVariation,
          duration: serviceTemplate.duration,
          image: serviceTemplate.image,
          categoryId: categoryId,
          providerId: serviceProvider.id,
          isActive: true,
        },
      });

      const numReviews = 3 + Math.floor(Math.random() * 5);
      const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

      for (let j = 0; j < numReviews; j++) {
        await prisma.review.create({
          data: {
            serviceId: createdService.id,
            userId: shuffledUsers[j].id,
            providerId: serviceProvider.id,
            rating: Math.floor(Math.random() * 2) + 4,
            comment:
              reviewComments[Math.floor(Math.random() * reviewComments.length)],
          },
        });
      }

      const numBookings = 1 + Math.floor(Math.random() * 3);
      for (let k = 0; k < numBookings; k++) {
        const futureDate = new Date();
        futureDate.setDate(
          futureDate.getDate() + Math.floor(Math.random() * 30)
        );

        await prisma.booking.create({
          data: {
            userId: shuffledUsers[k].id,
            serviceId: createdService.id,
            providerId: serviceProvider.id,
            bookingDate: futureDate,
            status: ["PENDING", "CONFIRMED", "COMPLETED"][
              Math.floor(Math.random() * 3)
            ],
            totalPrice: serviceTemplate.price * priceVariation,
            notes: "Regular service booking",
          },
        });
      }
    }
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
