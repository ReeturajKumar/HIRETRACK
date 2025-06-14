
import { PrismaClient } from '@/lib/generated/prisma';

const database = new PrismaClient();

const main = async () => {
  try {
    await database.category.createMany({
      data: [
        { name: "Software Development" },
        { name: "Web Development" },
        { name: "Mobile App Development" },
        { name: "Data Science" },
        { name: "Machine Learning" },
        { name: "Artificial Intelligence" },
        { name: "UI/UX Design" },
        { name: "Product Management" },
        { name: "Project Management" },
        { name: "Quality Assurance" },
        { name: "DevOps" },
        { name: "Cybersecurity" },
        { name: "Cloud Computing" },
        { name: "Database Administration" },
        { name: "Network Engineering" },
        { name: "Business Analysis" },
        { name: "Sales" },
        { name: "Marketing" },
        { name: "Customer Support" },
        { name: "Human Resources" },
        { name: "Finance" },
        { name: "Accounting" },
        { name: "Legal" },
      ],
    });
    console.log("Success");
  } catch (error) {
    console.error(`Error seeding data: ${error}`);
  } finally {
    await database.$disconnect();
  }
};

main();
