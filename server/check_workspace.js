const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkWorkspace() {
  try {
    const workspaces = await prisma.workspaces.findMany();
    console.log("Workspaces:", workspaces.map(w => ({ id: w.id, name: w.name, slug: w.slug })));
    
    const publicWorkspace = await prisma.workspaces.findFirst({
      where: { slug: "seetech-public" }
    });
    
    if (publicWorkspace) {
      console.log("Found seetech-public:", publicWorkspace);
    } else {
      console.log("seetech-public NOT FOUND. Creating it...");
      await prisma.workspaces.create({
        data: {
          name: "SEETECH Public Chat",
          slug: "seetech-public",
          openAiTemp: 0.7,
          openAiHistory: 20
        }
      });
      console.log("seetech-public created.");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkWorkspace();
