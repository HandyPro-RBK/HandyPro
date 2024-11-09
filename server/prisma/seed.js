const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

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
    price: 150.0,
    duration: 120, // 2 hours
  },
  {
    title: "Leak Repair",
    category: "Plumbing",
    image: "src/assets/images/Leak Repair.png",
    description:
      "Expert leak detection and repair services for all types of plumbing systems. We use advanced equipment to locate and fix leaks with minimal disruption to your property.",
    price: 100.0,
    duration: 60, // 1 hour
  },
  {
    title: "Drainage Systems",
    category: "Plumbing",
    image: "src/assets/images/Drainage Systems.png",
    description:
      "Comprehensive drainage system installation and maintenance. We handle everything from simple drain cleaning to complete system overhauls.",
    price: 200.0,
    duration: 180, // 3 hours
  },
  {
    title: "Maintenance Services",
    category: "Plumbing",
    image: "src/assets/images/maintenance services.png",
    description:
      "Regular plumbing maintenance services to prevent issues and extend system life. Includes inspection, cleaning, and minor repairs.",
    price: 120.0,
    duration: 90, // 1.5 hours
  },
  {
    title: "Kitchen Cabinets",
    category: "Kitchen",
    image: "src/assets/images/kitchen cabinets.jpg",
    description:
      "Custom kitchen cabinet installation and renovation. We offer a variety of styles and finishes to match your kitchen's aesthetic.",
    price: 300.0,
    duration: 240, // 4 hours
  },
  {
    title: "Tile Installation",
    category: "Kitchen",
    image: "src/assets/images/Tile Installation.jpg",
    description:
      "Professional kitchen tile installation for floors, backsplashes, and walls. We work with all types of tiles and ensure perfect alignment and grouting.",
    price: 250.0,
    duration: 180, // 3 hours
  },
  {
    title: "Countertop Installation",
    category: "Kitchen",
    image: "src/assets/images/Countertop Installation.jpg",
    description:
      "Expert countertop installation service for all materials including granite, marble, quartz, and laminate. Includes precise measurements and professional finishing.",
    price: 400.0,
    duration: 240, // 4 hours
  },
  {
    title: "Kitchen Remodeling",
    category: "Kitchen",
    image: "src/assets/images/Kitchen Remodeling.jpg",
    description:
      "Complete kitchen remodeling service. From design to execution, we handle all aspects of transforming your kitchen space.",
    price: 1000.0,
    duration: 480, // 8 hours
  },
  {
    title: "Interior Painting",
    category: "Indoor",
    image: "src/assets/images/Interior Painting.png",
    description:
      "Professional interior painting service with premium paints and expert preparation. We ensure clean lines and perfect coverage.",
    price: 300.0,
    duration: 240, // 4 hours
  },
  {
    title: "Drywall Installation",
    category: "Indoor",
    image: "src/assets/images/Drywall Installation.jpg",
    description:
      "Complete drywall installation and finishing services. Includes proper insulation, taping, and texture matching.",
    price: 350.0,
    duration: 300, // 5 hours
  },
  {
    title: "Flooring Installation",
    category: "Indoor",
    image: "src/assets/images/Flooring Installation.jpg",
    description:
      "Expert installation of various flooring types including hardwood, laminate, tile, and vinyl. Includes subfloor preparation and finishing.",
    price: 400.0,
    duration: 360, // 6 hours
  },
  {
    title: "Indoor Landscaping",
    category: "Indoor",
    image: "src/assets/images/Indoor Landscaping.jpg",
    description:
      "Professional indoor plant design and installation. We create beautiful, sustainable indoor green spaces.",
    price: 200.0,
    duration: 120, // 2 hours
  },
  {
    title: "Lawn Care",
    category: "Outdoor",
    image: "src/assets/images/Lawn Care.jpg",
    description:
      "Comprehensive lawn maintenance including mowing, edging, fertilizing, and pest control. We ensure your lawn stays healthy and beautiful.",
    price: 150.0,
    duration: 120, // 2 hours
  },
  {
    title: "Deck Building",
    category: "Outdoor",
    image: "src/assets/images/Deck Building.jpg",
    description:
      "Custom deck design and construction using quality materials. Includes planning, permits, and professional installation.",
    price: 800.0,
    duration: 480, // 8 hours
  },
  {
    title: "Patio Installation",
    category: "Outdoor",
    image: "src/assets/images/Patio Installation.jpg",
    description:
      "Professional patio installation using various materials including concrete, pavers, and natural stone. Includes proper drainage and foundation work.",
    price: 600.0,
    duration: 360, // 6 hours
  },
  {
    title: "Garden Design",
    category: "Outdoor",
    image: "src/assets/images/Garden Design.png",
    description:
      "Complete garden design and installation services. We create beautiful, sustainable outdoor spaces tailored to your preferences.",
    price: 400.0,
    duration: 240, // 4 hours
  },
  {
    title: "Home Renovation",
    category: "Renovation",
    image: "src/assets/images/Home Renovation.jpg",
    description:
      "Comprehensive home renovation services. We handle all aspects of home improvement from planning to execution.",
    price: 1500.0,
    duration: 480, // 8 hours
  },
  {
    title: "Basement Finishing",
    category: "Renovation",
    image: "src/assets/images/Basement Finishing.jpg",
    description:
      "Complete basement finishing services including insulation, drywall, flooring, and lighting. We create functional living spaces.",
    price: 1200.0,
    duration: 480, // 8 hours
  },
  {
    title: "Bathroom Remodeling",
    category: "Renovation",
    image: "src/assets/images/Bathroom Remodeling.jpg",
    description:
      "Full bathroom remodeling service including plumbing, tiling, fixtures, and lighting. We create modern, functional bathrooms.",
    price: 900.0,
    duration: 360, // 6 hours
  },
  {
    title: "Roofing Services",
    category: "Renovation",
    image: "src/assets/images/Roofing Services.jpg",
    description:
      "Professional roofing services including repair, replacement, and maintenance. We work with all types of roofing materials.",
    price: 1000.0,
    duration: 480, // 8 hours
  },
];

const reviewComments = [
  "Excellent service! Very professional and completed the work on time.",
  "Great attention to detail. Would definitely recommend.",
  "Professional service provider, but a bit pricey.",
  "Very satisfied with the quality of work.",
  "Prompt and efficient service. Will hire again.",
];

async function main() {
  console.log("Starting seeding...");

  // 1. Create multiple users (customers) for reviews
  console.log("Creating sample users...");
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        password: await bcrypt.hash("password123", 10),
        username: `user${i}`,
        userType: "CUSTOMER",
        address: `${i} Customer Street`,
        phoneNumber: `${i}234567890`,
        photoUrl: `user${i}.jpg`,
      },
    });
    users.push(user);
  }

  // 2. Create service provider profile with schedule
  console.log("Creating service provider profile...");
  const serviceProvider = await prisma.serviceProvider.upsert({
    where: { email: "default@provider.com" },
    update: {},
    create: {
      email: "default@provider.com",
      password: await bcrypt.hash("password123", 10),
      username: "defaultprovider",
      photoUrl: "provider.jpg",
      phoneNumber: "1234567890",
      birthDate: new Date(1994, 0, 1),
      rating: 4.5,
      isAvailable: true,
      city: "TUNIS",
    },
  });

  // 3. Create provider's schedule for the week
  console.log("Creating provider schedule...");
  for (let day = 0; day < 7; day++) {
    await prisma.schedule.create({
      data: {
        providerId: serviceProvider.id,
        dayOfWeek: day,
        startTime: new Date(2024, 0, 1, 9, 0), // 9 AM
        endTime: new Date(2024, 0, 1, 17, 0), // 5 PM
        isAvailable: true,
      },
    });
  }

  // 4. Create categories
  console.log("Creating categories...");
  for (const category of categoryPills) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        description: category.description,
        image: "",
      },
    });
  }

  // 5. Create services with detailed information
  console.log("Creating services...");
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((cat) => [cat.name, cat.id]));

  for (const service of services) {
    const categoryId = categoryMap.get(service.category);
    if (!categoryId) {
      console.error(`Category not found for service: ${service.title}`);
      continue;
    }

    const createdService = await prisma.service.upsert({
      where: { id: -1 }, // Forces create
      update: {},
      create: {
        name: service.title,
        description: service.description,
        price: service.price,
        duration: service.duration,
        image: service.image,
        categoryId: categoryId,
        providerId: serviceProvider.id,
        isActive: true,
      },
    });

    // 6. Create reviews for each service
    console.log(`Creating reviews for service: ${service.title}`);
    for (let i = 0; i < 5; i++) {
      await prisma.review.create({
        data: {
          serviceId: createdService.id,
          userId: users[i].id,
          providerId: serviceProvider.id,
          rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
          comment: reviewComments[i],
        },
      });
    }

    // 7. Create some sample bookings
    console.log(`Creating sample bookings for service: ${service.title}`);
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 14)); // Random date within next 14 days

    await prisma.booking.create({
      data: {
        userId: users[0].id,
        serviceId: createdService.id,
        providerId: serviceProvider.id,
        bookingDate: futureDate,
        status: "CONFIRMED",
        totalPrice: service.price,
        notes: "Sample booking",
      },
    });
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
