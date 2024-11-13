const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

// Customer names array remains the same
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

// Reorganize provider names by city (all men)
const providersByCity = {
  TUNIS: ["Ahmed", "Mohamed", "Ali", "Youssef", "Omar", "Kamel", "Hamza"],
  SOUSSE: ["Karim", "Slim", "Anis", "Mehdi", "Bilel", "Hatem", "Rami"],
  MONASTIR: ["Riadh", "Ridha", "Amine", "Maher", "Hichem", "Sofien"],
};

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
    price: 1530,
    duration: 2,
  },
  {
    title: "Leak Repair",
    category: "Plumbing",
    image: "src/assets/images/Leak Repair.png",
    description:
      "Expert leak detection and repair services for all types of plumbing systems. We use advanced equipment to locate and fix leaks with minimal disruption to your property.",
    price: 1020,
    duration: 1,
  },
  {
    title: "Drainage Systems",
    category: "Plumbing",
    image: "src/assets/images/Drainage Systems.png",
    description:
      "Comprehensive drainage system installation and maintenance. We handle everything from simple drain cleaning to complete system overhauls.",
    price: 2040,
    duration: 3,
  },
  {
    title: "Maintenance Services",
    category: "Plumbing",
    image: "src/assets/images/maintenance services.png",
    description:
      "Regular plumbing maintenance services to prevent issues and extend system life. Includes inspection, cleaning, and minor repairs.",
    price: 1224,
    duration: 1.5,
  },
  {
    title: "Kitchen Cabinets",
    category: "Kitchen",
    image: "src/assets/images/kitchen cabinets.jpg",
    description:
      "Custom kitchen cabinet installation and renovation. We offer a variety of styles and finishes to match your kitchen's aesthetic.",
    price: 3060,
    duration: 4,
  },
  {
    title: "Tile Installation",
    category: "Kitchen",
    image: "src/assets/images/Tile Installation.jpg",
    description:
      "Professional kitchen tile installation for floors, backsplashes, and walls. We work with all types of tiles and ensure perfect alignment and grouting.",
    price: 2550,
    duration: 3,
  },
  {
    title: "Countertop Installation",
    category: "Kitchen",
    image: "src/assets/images/Countertop Installation.jpg",
    description:
      "Expert countertop installation service for all materials including granite, marble, quartz, and laminate. Includes precise measurements and professional finishing.",
    price: 4080,
    duration: 4,
  },
  {
    title: "Kitchen Remodeling",
    category: "Kitchen",
    image: "src/assets/images/Kitchen Remodeling.jpg",
    description:
      "Complete kitchen remodeling service. From design to execution, we handle all aspects of transforming your kitchen space.",
    price: 10200,
    duration: 8,
  },
  {
    title: "Interior Painting",
    category: "Indoor",
    image: "src/assets/images/Interior Painting.png",
    description:
      "Professional interior painting service with premium paints and expert preparation. We ensure clean lines and perfect coverage.",
    price: 3060,
    duration: 4,
  },
  {
    title: "Drywall Installation",
    category: "Indoor",
    image: "src/assets/images/Drywall Installation.jpg",
    description:
      "Complete drywall installation and finishing services. Includes proper insulation, taping, and texture matching.",
    price: 3570,
    duration: 5,
  },
  {
    title: "Flooring Installation",
    category: "Indoor",
    image: "src/assets/images/Flooring Installation.jpg",
    description:
      "Expert installation of various flooring types including hardwood, laminate, tile, and vinyl. Includes subfloor preparation and finishing.",
    price: 4080,
    duration: 6,
  },
  {
    title: "Indoor Landscaping",
    category: "Indoor",
    image: "src/assets/images/indoor landscaping.jpg",
    description:
      "Professional indoor plant design and installation. We create beautiful, sustainable indoor green spaces.",
    price: 2040,
    duration: 2,
  },
  {
    title: "Lawn Care",
    category: "Outdoor",
    image: "src/assets/images/Lawn Care.jpg",
    description:
      "Comprehensive lawn maintenance including mowing, edging, fertilizing, and pest control. We ensure your lawn stays healthy and beautiful.",
    price: 1530,
    duration: 2,
  },
  {
    title: "Deck Building",
    category: "Outdoor",
    image: "src/assets/images/Deck Building.jpg",
    description:
      "Custom deck design and construction using quality materials. Includes planning, permits, and professional installation.",
    price: 8160,
    duration: 8,
  },
  {
    title: "Patio Installation",
    category: "Outdoor",
    image: "src/assets/images/Patio Installation.jpg",
    description:
      "Professional patio installation using various materials including concrete, pavers, and natural stone. Includes proper drainage and foundation work.",
    price: 6120,
    duration: 6,
  },
  {
    title: "Garden Design",
    category: "Outdoor",
    image: "src/assets/images/garden design.jpg",
    description:
      "Complete garden design and installation services. We create beautiful, sustainable outdoor spaces tailored to your preferences.",
    price: 4080,
    duration: 4,
  },
  {
    title: "Home Renovation",
    category: "Renovation",
    image: "src/assets/images/Home Renovation.jpg",
    description:
      "Comprehensive home renovation services. We handle all aspects of home improvement from planning to execution.",
    price: 15300,
    duration: 8,
  },
  {
    title: "Basement Finishing",
    category: "Renovation",
    image: "src/assets/images/Basement Finishing.jpg",
    description:
      "Complete basement finishing services including insulation, drywall, flooring, and lighting. We create functional living spaces.",
    price: 12240,
    duration: 8,
  },
  {
    title: "Bathroom Remodeling",
    category: "Renovation",
    image: "src/assets/images/Bathroom Remodeling.jpg",
    description:
      "Full bathroom remodeling service including plumbing, tiling, fixtures, and lighting. We create modern, functional bathrooms.",
    price: 9180,
    duration: 6,
  },
  {
    title: "Roofing Services",
    category: "Renovation",
    image: "src/assets/images/Roofing Services.jpg",
    description:
      "Professional roofing services including repair, replacement, and maintenance. We work with all types of roofing materials.",
    price: 10200,
    duration: 8,
  },
  {
    title: "Appliance Installation",
    category: "Kitchen",
    image: "src/assets/images/appliance installation.jpg",
    description:
      "Professional installation of kitchen appliances including dishwashers, ovens, refrigerators, and microwaves. Includes proper connection to electrical and plumbing systems.",
    price: 2040,
    duration: 2,
  },
  {
    title: "Kitchen Sink Installation",
    category: "Kitchen",
    image: "src/assets/images/kitchen sink installation.jpg",
    description:
      "Expert installation of kitchen sinks and faucets. Includes plumbing connections and sealing to prevent leaks.",
    price: 1836,
    duration: 2.5,
  },
  {
    title: "Water Heater Service",
    category: "Plumbing",
    image: "src/assets/images/water heater service.jpg",
    description:
      "Installation, repair, and maintenance of water heaters. Services include replacement, pressure adjustment, and thermal maintenance.",
    price: 2550,
    duration: 3,
  },
  {
    title: "Toilet Installation",
    category: "Plumbing",
    image: "src/assets/images/toilet installation.jpg",
    description:
      "Professional toilet installation and replacement services. Includes removal of old unit, wax ring replacement, and proper sealing.",
    price: 1785,
    duration: 2,
  },
  {
    title: "Ceiling Repair",
    category: "Indoor",
    image: "src/assets/images/ceiling repair.jpg",
    description:
      "Expert ceiling repair services including crack fixing, water damage repair, and texture matching.",
    price: 2856,
    duration: 4,
  },
  {
    title: "Light Fixture Installation",
    category: "Indoor",
    image: "src/assets/images/light fixture installation.jpg",
    description:
      "Professional installation of various light fixtures including chandeliers, recessed lighting, and ceiling fans.",
    price: 1530,
    duration: 1.5,
  },
  {
    title: "Fence Installation",
    category: "Outdoor",
    image: "src/assets/images/fence installation.jpg",
    description:
      "Custom fence installation using various materials including wood, vinyl, and metal. Includes proper post setting and alignment.",
    price: 7140,
    duration: 8,
  },
  {
    title: "Outdoor Lighting",
    category: "Outdoor",
    image: "src/assets/images/outdoor lighting.jpg",
    description:
      "Installation of outdoor lighting systems including pathway lights, security lights, and decorative fixtures.",
    price: 3570,
    duration: 4,
  },
  {
    title: "Window Installation",
    category: "Renovation",
    image: "src/assets/images/window installation.jpg",
    description:
      "Professional window replacement and installation services. Includes proper insulation and weatherproofing.",
    price: 4590,
    duration: 3,
  },
  {
    title: "Garage Conversion",
    category: "Renovation",
    image: "src/assets/images/garage conversion.jpg",
    description:
      "Complete garage conversion services to create additional living space. Includes insulation, electrical, and finishing work.",
    price: 20400,
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

  // Create customers (unchanged)
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

  // Create service providers by city
  console.log("Creating service providers...");
  const serviceProviders = [];
  for (const [city, providers] of Object.entries(providersByCity)) {
    for (const providerName of providers) {
      const serviceProvider = await prisma.serviceProvider.upsert({
        where: { email: `${providerName.toLowerCase()}@provider.com` },
        update: {},
        create: {
          email: `${providerName.toLowerCase()}@provider.com`,
          password: await bcrypt.hash("password123", 10),
          username: providerName.toLowerCase(),
          photoUrl: `provider${serviceProviders.length + 1}.jpg`,
          phoneNumber: `+216${Math.floor(10000000 + Math.random() * 90000000)}`,
          birthDate: new Date(
            1980 + Math.floor(Math.random() * 20),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          rating: (4 + Math.random()).toFixed(2),
          isAvailable: true,
          city: city,
        },
      });
      serviceProviders.push(serviceProvider);

      // Create schedule for each provider
      for (let day = 0; day < 7; day++) {
        await prisma.schedule.create({
          data: {
            providerId: serviceProvider.id,
            dayOfWeek: day,
            startTime: new Date(
              2024,
              0,
              1,
              8 + Math.floor(Math.random() * 2),
              0
            ),
            endTime: new Date(
              2024,
              0,
              1,
              16 + Math.floor(Math.random() * 3),
              0
            ),
            isAvailable: Math.random() > 0.2,
          },
        });
      }
    }
  }

  // Create categories
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

  // Create services with city-specific distribution
  console.log("Creating services...");
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((cat) => [cat.name, cat.id]));

  // Group services by category
  const servicesByCategory = {};
  services.forEach((service) => {
    if (!servicesByCategory[service.category]) {
      servicesByCategory[service.category] = [];
    }
    servicesByCategory[service.category].push(service);
  });

  // Distribute services among providers in each city
  for (const [city, cityProviders] of Object.entries(providersByCity)) {
    let providerIndex = 0;

    // For each category
    for (const category of categoryPills) {
      const categoryServices = servicesByCategory[category.name];

      // Distribute services among providers in this city
      categoryServices.forEach((serviceTemplate) => {
        const provider = serviceProviders.find(
          (p) =>
            p.username === cityProviders[providerIndex].toLowerCase() &&
            p.city === city
        );

        if (provider) {
          createServiceWithReviewsAndBookings(
            serviceTemplate,
            provider,
            categoryMap.get(category.name),
            users
          );
        }

        providerIndex = (providerIndex + 1) % cityProviders.length;
      });
    }
  }

  console.log("Seeding completed successfully!");
}

async function createServiceWithReviewsAndBookings(
  serviceTemplate,
  provider,
  categoryId,
  users
) {
  const priceVariation = 0.9 + Math.random() * 0.2;
  const createdService = await prisma.service.create({
    data: {
      name: serviceTemplate.title,
      description: serviceTemplate.description,
      price: serviceTemplate.price * priceVariation,
      duration: serviceTemplate.duration,
      image: serviceTemplate.image,
      categoryId: categoryId,
      providerId: provider.id,
      isActive: true,
    },
  });

  // Create reviews
  const numReviews = 3 + Math.floor(Math.random() * 5);
  const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

  for (let j = 0; j < numReviews; j++) {
    await prisma.review.create({
      data: {
        serviceId: createdService.id,
        userId: shuffledUsers[j].id,
        providerId: provider.id,
        rating: Math.floor(Math.random() * 2) + 4,
        comment:
          reviewComments[Math.floor(Math.random() * reviewComments.length)],
      },
    });
  }

  // Create bookings
  const numBookings = 1 + Math.floor(Math.random() * 3);
  for (let k = 0; k < numBookings; k++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));

    await prisma.booking.create({
      data: {
        userId: shuffledUsers[k].id,
        serviceId: createdService.id,
        providerId: provider.id,
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

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
