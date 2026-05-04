import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Shared test password for local/staging — change in production. */
const TEST_PASSWORD = "admin1";

async function main() {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: "kashik.sredharan@gmail.com" },
    create: {
      email: "kashik.sredharan@gmail.com",
      phone: "+919000000001",
      passwordHash,
      role: "ADMIN",
      phoneVerified: true,
    },
    update: {
      passwordHash,
      phoneVerified: true,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "kashik.sredharan+customer@gmail.com" },
    create: {
      email: "kashik.sredharan+customer@gmail.com",
      phone: "+919000000002",
      passwordHash,
      role: "CUSTOMER",
      phoneVerified: true,
      customerProfile: { create: { displayName: "Test Customer" } },
    },
    update: {
      passwordHash,
      phoneVerified: true,
      role: "CUSTOMER",
    },
  });

  const vendorUser = await prisma.user.upsert({
    where: { email: "kashik.sredharan+vendor@gmail.com" },
    create: {
      email: "kashik.sredharan+vendor@gmail.com",
      phone: "+919000000003",
      passwordHash,
      role: "VENDOR",
      phoneVerified: true,
      vendorProfile: {
        create: {
          businessName: "Test Vendor Co.",
          description: "Seeded vendor for testing",
          verificationStatus: "ACTIVE",
        },
      },
    },
    update: {
      passwordHash,
      phoneVerified: true,
      role: "VENDOR",
    },
  });

  await prisma.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    create: {
      userId: vendorUser.id,
      businessName: "Test Vendor Co.",
      description: "Seeded vendor for testing",
      verificationStatus: "ACTIVE",
    },
    update: {
      businessName: "Test Vendor Co.",
      verificationStatus: "ACTIVE",
    },
  });

  console.log("Seeded test accounts (password for all: admin1):");
  console.log("  Admin:    kashik.sredharan@gmail.com");
  console.log("  Customer: kashik.sredharan+customer@gmail.com");
  console.log("  Vendor:   kashik.sredharan+vendor@gmail.com");

  // Seed event types
  const eventTypesData = [
    {
      emoji: "🎂",
      title: "Event Photographer",
      description: "Photo booths, and entertainers for every age.",
    },
    {
      emoji: "🧆",
      title: "Caterer",
      description: "Soft styling, amazing taste, and keepsake-friendly setups.",
    },
    {
      emoji: "💍",
      title: "Decorators",
      description: "Elegant decor and dining experiences for meaningful events.",
    },
    {
      emoji: "👋",
      title: "Venues",
      description: "Well-paced proper venues for your events.",
    },
  ];

  for (const eventType of eventTypesData) {
    await prisma.eventType.upsert({
      where: { title: eventType.title },
      update: eventType,
      create: eventType,
    });
  }

  // Seed vendor categories
  const vendorCategoriesData = [
    { emoji: "🏛️", title: "Venues", sortOrder: 1 },
    { emoji: "🎈", title: "Decorators", sortOrder: 2 },
    { emoji: "🍽️", title: "Caterers", sortOrder: 3 },
    { emoji: "📸", title: "Photographers and videographers", sortOrder: 4 },
  ];

  for (const category of vendorCategoriesData) {
    await prisma.vendorCategory.upsert({
      where: { title: category.title },
      update: category,
      create: category,
    });
  }

  console.log("Seeded event types and vendor categories.");

  // Event images from Unsplash API (free tier)
  const eventImages: Record<string, string[]> = {
    Venues: [
      "https://images.unsplash.com/photo-1519167758481-83f19106048c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551632786-de41ec4a306b?w=400&h=300&fit=crop",
    ],
    Decorators: [
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1523438097911-512b1efaf572?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    ],
    Caterers: [
      "https://images.unsplash.com/photo-1555244752-efdbac305f1a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1540932239986-1e9d7a8bfc84?w=400&h=300&fit=crop",
    ],
    "Photographers and videographers": [
      "https://images.unsplash.com/photo-1516035069371-29ad0ababbb0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1537420327992-b6cc02b20410?w=400&h=300&fit=crop",
    ],
  };

  // Realistic descriptions
  const descriptionTemplates: Record<string, string[]> = {
    Venues: [
      "Elegant banquet hall perfect for intimate gatherings and grand celebrations. Modern amenities and professional staff.",
      "Premium venue with state-of-the-art facilities and parking for 200+ guests. Customizable spaces for all events.",
      "Picturesque garden venue with in-house catering and event coordination. Beautiful backdrop for your celebrations.",
    ],
    Decorators: [
      "Creative floral and backdrop designs for all occasions. Professional team with 50+ completed events.",
      "Customized decoration packages with themed setups. From minimalist to elaborate, we create magic.",
      "Professional styling team with portfolio of 100+ events. Unique designs that match your vision perfectly.",
    ],
    Caterers: [
      "Multi-cuisine catering with expert chefs. Vegetarian, vegan, and jain options available.",
      "Fresh, customized menus prepared with premium ingredients. Full-service catering with presentation.",
      "Specialized in Indian, Asian, and fusion cuisines. Service staff included, impeccable presentation.",
    ],
    "Photographers and videographers": [
      "Professional photography and cinematic videography capturing all your special moments.",
      "High-quality albums, same-day editing, and online gallery. Drone shots and 4K video available.",
      "Experienced team capturing emotions with an artistic approach. Pre-event, event, and post-production included.",
    ],
  };

  // Locations
  const locations = [
    "Andheri East, Mumbai",
    "Bandra West, Mumbai",
    "Colaba, Mumbai",
    "Powai, Mumbai",
    "Thane, Mumbai",
    "Navi Mumbai, Airoli",
  ];

  // Pricing by category
  const categoryPricing: Record<string, { min: number; max: number }> = {
    Venues: { min: 50000, max: 200000 },
    Decorators: { min: 15000, max: 75000 },
    Caterers: { min: 300, max: 1000 }, // per plate
    "Photographers and videographers": { min: 20000, max: 100000 },
  };

  // Review samples
  const reviewSamples = [
    { rating: 5, title: "Absolutely fantastic!", comment: "Professional team, perfect execution. Highly recommend!" },
    { rating: 5, title: "Exceeded expectations", comment: "Amazing attention to detail and customer service." },
    { rating: 4, title: "Great service", comment: "Very responsive and delivered quality work." },
    { rating: 5, title: "Best in class", comment: "Couldn't have asked for better." },
    { rating: 4, title: "Professional & reliable", comment: "Delivered on all promises." },
    { rating: 5, title: "Superb experience", comment: "Worth every penny, will definitely rehire." },
    { rating: 4, title: "Good value", comment: "Fair pricing and quality service." },
    { rating: 5, title: "Outstanding!", comment: "Made our event truly memorable." },
  ];

  // Seed additional vendors and listings
  const vendorsData = [
    { email: "vendor1@example.com", businessName: "Elegant Venues Mumbai", category: "Venues" },
    { email: "vendor2@example.com", businessName: "Dream Decor Studio", category: "Decorators" },
    { email: "vendor3@example.com", businessName: "Spice Route Catering", category: "Caterers" },
    { email: "vendor4@example.com", businessName: "Lens & Light Photography", category: "Photographers and videographers" },
    { email: "vendor5@example.com", businessName: "Grand Halls & Gardens", category: "Venues" },
    { email: "vendor6@example.com", businessName: "Bloom Floral Decor", category: "Decorators" },
    { email: "vendor7@example.com", businessName: "Tasty Bites Caterers", category: "Caterers" },
    { email: "vendor8@example.com", businessName: "Capture Moments Studio", category: "Photographers and videographers" },
    { email: "vendor9@example.com", businessName: "Royal Banquet Halls", category: "Venues" },
    { email: "vendor10@example.com", businessName: "Creative Decor Hub", category: "Decorators" },
    { email: "vendor11@example.com", businessName: "Delicious Delights Catering", category: "Caterers" },
    { email: "vendor12@example.com", businessName: "Frame & Film Productions", category: "Photographers and videographers" },
    { email: "vendor13@example.com", businessName: "Luxury Event Spaces", category: "Venues" },
    { email: "vendor14@example.com", businessName: "Artistic Decor Designs", category: "Decorators" },
    { email: "vendor15@example.com", businessName: "Gourmet Feast Caterers", category: "Caterers" },
    { email: "vendor16@example.com", businessName: "Memory Makers Photography", category: "Photographers and videographers" },
    { email: "vendor17@example.com", businessName: "Prestige Venues Ltd", category: "Venues" },
    { email: "vendor18@example.com", businessName: "Elegant Themes Decor", category: "Decorators" },
    { email: "vendor19@example.com", businessName: "Savory Servings Catering", category: "Caterers" },
    { email: "vendor20@example.com", businessName: "Visual Stories Videography", category: "Photographers and videographers" },
    { email: "vendor21@example.com", businessName: "Opulent Halls Mumbai", category: "Venues" },
    { email: "vendor22@example.com", businessName: "Whimsical Decor Creations", category: "Decorators" },
    { email: "vendor23@example.com", businessName: "Culinary Delights Co", category: "Caterers" },
    { email: "vendor24@example.com", businessName: "Epic Moments Media", category: "Photographers and videographers" },
  ];

  for (let i = 0; i < vendorsData.length; i++) {
    const vendorData = vendorsData[i];
    const vendorUser = await prisma.user.upsert({
      where: { email: vendorData.email },
      create: {
        email: vendorData.email,
        phone: `+919000000${(i + 10).toString().padStart(2, "0")}`,
        passwordHash,
        role: "VENDOR",
        phoneVerified: true,
      },
      update: {
        passwordHash,
        phoneVerified: true,
        role: "VENDOR",
      },
    });

    const pricing = categoryPricing[vendorData.category];
    const priceMin = Math.floor(Math.random() * (pricing.max - pricing.min) / 2) + pricing.min;
    const priceMax = priceMin + Math.floor(Math.random() * (pricing.max - pricing.min) / 2);
    const location = locations[Math.floor(Math.random() * locations.length)];
    const descriptions = descriptionTemplates[vendorData.category];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const categoryImages = eventImages[vendorData.category] || [];
    const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];

    const vendorProfile = await prisma.vendorProfile.upsert({
      where: { userId: vendorUser.id },
      create: {
        userId: vendorUser.id,
        businessName: vendorData.businessName,
        description,
        location,
        verificationStatus: "ACTIVE",
        portfolioUrls: [
          `https://example.com/portfolio/${vendorUser.id}`,
          ...(Math.random() > 0.3 ? [`https://instagram.com/${vendorData.businessName.replace(/\s+/g, "")}`] : []),
        ],
      },
      update: {
        businessName: vendorData.businessName,
        description,
        location,
        verificationStatus: "ACTIVE",
      },
    });

    // Create a listing for each vendor
    await prisma.serviceListing.upsert({
      where: { id: `${vendorUser.id}-listing` },
      update: {
        title: `${vendorData.businessName} - ${vendorData.category}`,
        description,
        priceMin,
        priceMax,
        status: "ACTIVE",
        location,
        photos: randomImage ? [randomImage] : [],
      },
      create: {
        id: `${vendorUser.id}-listing`,
        vendorId: vendorProfile.id,
        title: `${vendorData.businessName} - ${vendorData.category}`,
        description,
        priceMin,
        priceMax,
        status: "ACTIVE",
        location,
        photos: randomImage ? [randomImage] : [],
      },
    });
  }

  console.log("Seeded additional vendors and listings with realistic data.");

  // Create sample reviews and bookings using dedicated seed-only reviewer accounts
  // (never reuse real test accounts so the test customer inbox stays clean)
  const allVendors = await prisma.vendorProfile.findMany({ take: 12 });

  for (let vendorIdx = 0; vendorIdx < allVendors.length; vendorIdx++) {
    const vendor = allVendors[vendorIdx];
    const numReviews = Math.floor(Math.random() * 8) + 3; // 3-10 reviews per vendor

    for (let reviewIdx = 0; reviewIdx < numReviews; reviewIdx++) {
      const reviewSample = reviewSamples[Math.floor(Math.random() * reviewSamples.length)];
      const reviewerEmail = `seed.reviewer.${vendorIdx}.${reviewIdx}@seed.internal`;
      const testCustomer = await prisma.user.upsert({
        where: { email: reviewerEmail },
        create: {
          email: reviewerEmail,
          phone: `+91${(9100000000 + vendorIdx * 20 + reviewIdx).toString()}`,
          passwordHash,
          role: "CUSTOMER",
          phoneVerified: true,
          customerProfile: { create: { displayName: `Reviewer ${reviewIdx + 1}` } },
        },
        update: {},
      });

      const booking = await prisma.booking.create({
        data: {
          customerId: testCustomer.id,
          vendorId: vendor.id,
          status: "COMPLETED",
          eventDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          amountPaise: Math.floor(Math.random() * 200000) + 50000,
        },
      });

      await prisma.review.upsert({
        where: { bookingId: booking.id },
        create: {
          vendorId: vendor.id,
          customerId: testCustomer.id,
          bookingId: booking.id,
          rating: reviewSample.rating,
          title: reviewSample.title,
          comment: reviewSample.comment,
        },
        update: {
          rating: reviewSample.rating,
          title: reviewSample.title,
          comment: reviewSample.comment,
        },
      });
    }

    // Update vendor events completed count
    const completedBookings = await prisma.booking.count({
      where: { vendorId: vendor.id, status: "COMPLETED" },
    });
    await prisma.vendorProfile.update({
      where: { id: vendor.id },
      data: { eventsCompleted: completedBookings },
    });
  }

  console.log("Seeded reviews and booking data.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
