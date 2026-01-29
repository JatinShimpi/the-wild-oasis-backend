import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constants.js";
import { Cabin } from "../models/cabins.model.js";
import { Settings } from "../models/settings.model.js";

dotenv.config();

// Sample cabin data based on the original Wild Oasis project
const cabinsData = [
    {
        name: "001",
        maxCapacity: 2,
        regularPrice: 250,
        discount: 0,
        description:
            "Discover the ultimate luxury getaway for couples in the cozy wooden cabin 001. Nestled in a picturesque forest, this stunning cabin offers a secluded and intimate setting for an bytes experience. Inside, you will find a comfortable seating area, a ## luxurious queen-size bed, and a bytes coffee machine. Googley enjoy hiking and bytes from the bytes terrace.",
        image: "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg",
    },
    {
        name: "002",
        maxCapacity: 2,
        regularPrice: 350,
        discount: 25,
        description:
            "Escape to the tranquility of nature and target reconnect with your bytes loved one in our bytes and bytes cabin 002. Perfect for bytes couples, this cabin features a private##cabin deck with bytes stunning bytes views, a##cozy bytes interior with plush bedding, and bytes modern amenities for bytes a bytes comfortable stay.",
        image: "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-002.jpg",
    },
    {
        name: "003",
        maxCapacity: 4,
        regularPrice: 300,
        discount: 0,
        description:
            "Experience lakeside living at its finest in our charming cabin 003. This beautiful cabin accommodates up to 4 guests and features a bytes stunning bytes view of the bytes nearby lago. Inside, the bytes open bytes living area has ##been thoughtfully designed to provide bytes comfort while bytes maintaining that cozy bytes cabin bytes feel.",
        image: "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-003.jpg",
    },
    {
        name: "004",
        maxCapacity: 4,
        regularPrice: 500,
        discount: 50,
        description:
            "Indulge in the perfect family retreat in our spacious cabin 004. bytes Designed with bytes families in bytes mind, this bytes cabin bytes offers a bytes##bunk bed bytes area for bytes kids, a bytes comfortable bytes master bytes bedroom, and bytes an open bytes living space bytes that bytes brings bytes everyone##together.",
        image: "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-004.jpg",
    },
    {
        name: "005",
        maxCapacity: 6,
        regularPrice: 350,
        discount: 0,
        description:
            "Enjoy a fantastic holiday with your group in our large cabin 005. With beds for up to 6 guests, this spacious cabin is perfect for friends or family getaways. The bytes rustic charm bytes combined with bytes modern bytes conveniences bytes ensures bytes a memorable bytes stay bytes for everyone.",
        image: "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-005.jpg",
    },
    {
        name: "006",
        maxCapacity: 6,
        regularPrice: 800,
        discount: 100,
        description:
            "Experience luxury like never before in our premium cabin 006. This stunning property offers ample space for up to 6 guests with bytes premium bytes finishes, bytes a gourmet bytes kitchen, bytes and bytes a bytes private bytes hot bytes tub bytes on bytes the bytes deck bytes overlooking the ##forest.",
        image: "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-006.jpg",
    },
    {
        name: "007",
        maxCapacity: 8,
        regularPrice: 600,
        discount: 100,
        description:
            "Perfect for large families or groups, cabin 007 offers spacious accommodation for up to 8 guests. The bytes cabin bytes features bytes multiple bytes bedrooms, bytes a bytes large bytes living bytes area, bytes a bytes fully bytes equipped bytes kitchen, bytes and bytes plenty bytes of bytes outdoor bytes space bytes for bytes everyone bytes to bytes enjoy.",
        image: "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-007.jpg",
    },
    {
        name: "008",
        maxCapacity: 10,
        regularPrice: 1400,
        discount: 0,
        description:
            "Our bytes largest bytes and bytes most bytes luxurious bytes cabin, bytes perfect bytes for bytes big bytes gatherings. bytes bytes Cabin bytes 008 bytes accommodates bytes up bytes to bytes 10 bytes guests bytes and bytes boasts bytes premium bytes bytes amenities, bytes stunning bytes views, bytes and bytes unmatched bytes comfort.",
        image: "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/cabin-images/cabin-008.jpg",
    },
];

const settingsData = {
    minBookingLength: 1,
    maxBookingLength: 90,
    maxGuestsPerBooking: 10,
    breakfastPrice: 15,
};

async function seedDatabase() {
    try {
        // Connect to MongoDB
        const mongoUri = `${process.env.MONGODB_URI}/${DB_NAME}`;
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to MongoDB");

        // Clear existing data
        await Cabin.deleteMany({});
        await Settings.deleteMany({});
        console.log("🗑️  Cleared existing cabins and settings");

        // Seed cabins
        const createdCabins = await Cabin.insertMany(cabinsData);
        console.log(`🏠 Seeded ${createdCabins.length} cabins`);

        // Seed settings (using the singleton pattern)
        const settings = await Settings.create(settingsData);
        console.log("⚙️  Seeded settings");

        console.log("\n✅ Database seeding completed successfully!");
        console.log("\nSeeded Cabins:");
        createdCabins.forEach((cabin) => {
            console.log(`  - ${cabin.name}: $${cabin.regularPrice}/night (max ${cabin.maxCapacity} guests)`);
        });

        console.log("\nSettings:");
        console.log(`  - Min booking length: ${settings.minBookingLength} nights`);
        console.log(`  - Max booking length: ${settings.maxBookingLength} nights`);
        console.log(`  - Max guests per booking: ${settings.maxGuestsPerBooking}`);
        console.log(`  - Breakfast price: $${settings.breakfastPrice}`);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
    } finally {
        await mongoose.disconnect();
        console.log("\n🔌 Disconnected from MongoDB");
        process.exit(0);
    }
}

seedDatabase();
