import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.create({
    data: {
      name: "Alice Yilmaz",
      email: "alice@example.com",
      passwordHash,
      university: "NextCampus University",
      department: "Computer Engineering",
      bio: "AI enthusiast & student builder."
    }
  });

  const berk = await prisma.user.create({
    data: {
      name: "Berk Kaya",
      email: "berk@example.com",
      passwordHash,
      university: "NextCampus University",
      department: "Software Engineering",
      bio: "Hackathon organizer."
    }
  });

  const posts = await prisma.$transaction([
    prisma.post.create({
      data: {
        userId: alice.id,
        title: "Campus AI Lab Launch!",
        content: "We just opened the new AI lab. Come by for a tour and demo day."
      }
    }),
    prisma.post.create({
      data: {
        userId: alice.id,
        title: "Looking for ML Study Group",
        content: "Anyone interested in a weekly ML paper reading session?"
      }
    }),
    prisma.post.create({
      data: {
        userId: berk.id,
        title: "Hackathon Tips",
        content: "Start with a small scope and pitch the story. Bonus: keep UX clean."
      }
    }),
    prisma.post.create({
      data: {
        userId: berk.id,
        title: "New Robotics Club",
        content: "We are forming a robotics club for autonomous drones."
      }
    }),
    prisma.post.create({
      data: {
        userId: alice.id,
        title: "NextCampus Beta",
        content: "We need feedback for the MVP. Drop your thoughts here."
      }
    })
  ]);

  await prisma.comment.createMany({
    data: [
      { postId: posts[0].id, userId: berk.id, content: "Amazing news! I'll be there." },
      { postId: posts[0].id, userId: alice.id, content: "Bring your friends too." },
      { postId: posts[1].id, userId: berk.id, content: "Count me in." },
      { postId: posts[2].id, userId: alice.id, content: "Great tips, thanks!" },
      { postId: posts[2].id, userId: berk.id, content: "Happy to help." },
      { postId: posts[3].id, userId: alice.id, content: "Love the idea." },
      { postId: posts[4].id, userId: berk.id, content: "Congrats on the beta!" },
      { postId: posts[4].id, userId: alice.id, content: "Feedback welcome." }
    ]
  });

  await prisma.event.createMany({
    data: [
      {
        creatorUserId: alice.id,
        title: "AI Demo Day",
        description: "Showcase of student AI projects and demos.",
        startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        endDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 90),
        location: "Innovation Hall 2F",
        university: "NextCampus University",
        clubName: "AI Society",
        category: "Demo"
      },
      {
        creatorUserId: berk.id,
        title: "Robotics Intro Workshop",
        description: "Hands-on intro session for robotics newcomers.",
        startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        endDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 120),
        location: "Engineering Lab 3",
        university: "NextCampus University",
        clubName: "Robotics Club",
        category: "Workshop"
      },
      {
        creatorUserId: alice.id,
        title: "Startup Mixer",
        description: "Meet fellow founders and exchange ideas.",
        startDateTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
        endDateTime: null,
        location: "Main Atrium",
        university: "NextCampus University",
        clubName: "Entrepreneurship Club",
        category: "Networking"
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
