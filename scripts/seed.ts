const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
    try {
        // Check if there are already courses in the database
        const coursesCount = await database.course.count();
        if (coursesCount === 0) {
            console.log("No courses found. Please add courses before seeding categories.");
            return;
        }

        // Seed categories with unique names
        const categories = [
            { name: "Computer Science" },
            { name: "Cooking" },
            { name: "Photography" },
            { name: "Engineering" },
            { name: "Marketing" },
            { name: "Pharmaceutical industry" },
            { name: "Accounting" },
        ];

        for (const category of categories) {
            await database.category.upsert({
                where: { name: category.name },
                update: {}, // Skip update if category already exists
                create: category,
            });
        }

        console.log("Categories seeded successfully.");

    } catch (error) {
        console.log("Error seeding the database categories:", error);
    } finally {
        await database.$disconnect();
    }
}

main();
