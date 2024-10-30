const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const categoryPills = [
  { name: "Kitchen" },
  { name: "Plumbing" },
  { name: "Indoor" },
  { name: "Outdoor" },
  { name: "Renovation" },
];

const services = [
  {
    title: "Pipe Installation",
    category: "Plumbing",
    image: "src/assets/images/Pipe installation.png",
  },
  {
    title: "Leak Repair",
    category: "Plumbing",
    image: "src/assets/images/Leak Repair.png",
  },
  {
    title: "Drainage Systems",
    category: "Plumbing",
    image: "src/assets/images/Drainage Systems.png",
  },
  {
    title: "Maintenance Services",
    category: "Plumbing",
    image: "src/assets/images/maintenance services.png",
  },
  {
    title: "Kitchen Cabinets",
    category: "Kitchen",
    image: "src/assets/images/kitchen cabinets.jpg",
  },
  {
    title: "Tile Installation",
    category: "Kitchen",
    image: "src/assets/images/Tile Installation.jpg",
  },
  {
    title: "Countertop Installation",
    category: "Kitchen",
    image: "src/assets/images/Countertop Installation.jpg",
  },
  {
    title: "Kitchen Remodeling",
    category: "Kitchen",
    image: "src/assets/images/Kitchen Remodeling.jpg",
  },
  {
    title: "Interior Painting",
    category: "Indoor",
    image: "src/assets/images/Interior Painting.png",
  },
  {
    title: "Drywall Installation",
    category: "Indoor",
    image: "src/assets/images/Drywall Installation.jpg",
  },
  {
    title: "Flooring Installation",
    category: "Indoor",
    image: "src/assets/images/Flooring Installation.jpg",
  },
  {
    title: "Indoor Landscaping",
    category: "Indoor",
    image: "src/assets/images/Indoor Landscaping.jpg",
  },
  {
    title: "Lawn Care",
    category: "Outdoor",
    image: "src/assets/images/Lawn Care.jpg",
  },
  {
    title: "Deck Building",
    category: "Outdoor",
    image: "src/assets/images/Deck Building.jpg",
  },
  {
    title: "Patio Installation",
    category: "Outdoor",
    image: "src/assets/images/Patio Installation.jpg",
  },
  {
    title: "Garden Design",
    category: "Outdoor",
    image: "src/assets/images/Garden Design.png",
  },
  {
    title: "Home Renovation",
    category: "Renovation",
    image: "src/assets/images/Home Renovation.jpg",
  },
  {
    title: "Basement Finishing",
    category: "Renovation",
    image: "src/assets/images/Basement Finishing.jpg",
  },
  {
    title: "Bathroom Remodeling",
    category: "Renovation",
    image: "src/assets/images/Bathroom Remodeling.jpg",
  },
  {
    title: "Roofing Services",
    category: "Renovation",
    image: "src/assets/images/Roofing Services.jpg",
  },
];

async function main() {
  console.log("Starting seeding...");

  // 1. Create a default provider user (required for services)
  console.log("Creating default provider user...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const providerUser = await prisma.user.upsert({
    where: { email: "default@provider.com" },
    update: {},
    create: {
      email: "default@provider.com",
      password: hashedPassword,
      username: "defaultprovider",
      userType: "PROVIDER", // Ensure this matches the enum
      address: "123 Default Street",
      phoneNumber: "1234567890",
      photoUrl: "default.jpg",
    },
  });

  // 2. Create service provider profile
  console.log("Creating service provider profile...");
  const serviceProvider = await prisma.serviceProvider.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      email: providerUser.email,
      password: hashedPassword,
      username: providerUser.username,
      certification: null, // Adjust this based on your requirements
      photoUrl: providerUser.photoUrl,
      address: providerUser.address,
      phoneNumber: providerUser.phoneNumber,
      age: "30", // Assuming age is stored as a string
      rating: 4.5,
      isAvailable: true,
    },
  });

  // 3. Create categories
  console.log("Creating categories...");
  for (const category of categoryPills) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        description: `Services related to ${category.name}`,
      },
    });
  }

  // 4. Create services
  console.log("Creating services...");
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((cat) => [cat.name, cat]));

  for (const service of services) {
    const category = categoryMap.get(service.category);
    if (!category) {
      console.error(`Category not found for service: ${service.title}`);
      continue;
    }

    await prisma.service.upsert({
      where: {
        id: -1, // Forces create
      },
      update: {},
      create: {
        name: service.title,
        description: `Professional ${service.title} service`,
        price: 100.0,
        duration: 60,
        image: service.image,
        categoryId: category.id,
        providerId: serviceProvider.id,
        isActive: true,
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
