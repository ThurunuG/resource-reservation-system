import { PrismaClient, Role, ResourceStatus, ReservationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for PrimeWave Resource Reservation System...");

  // 1. Clean existing records in dependency order
  await prisma.maintenanceLog.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.resourceCategory.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const alex = await prisma.user.create({
    data: {
      id: "user-alex",
      name: "Alex Perera",
      email: "alex.perera@primewave.lk",
      department: "Engineering",
      role: Role.ADMIN,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const dilshan = await prisma.user.create({
    data: {
      id: "user-dilshan",
      name: "Dilshan Silva",
      email: "dilshan.silva@primewave.lk",
      department: "Product Design",
      role: Role.MEMBER,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const kavindi = await prisma.user.create({
    data: {
      id: "user-kavindi",
      name: "Kavindi Jayawardena",
      email: "kavindi.j@primewave.lk",
      department: "Data & AI",
      role: Role.MEMBER,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  });

  const niroshan = await prisma.user.create({
    data: {
      id: "user-niroshan",
      name: "Niroshan Fernando",
      email: "niroshan.f@primewave.lk",
      department: "Operations & Facilities",
      role: Role.ADMIN,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  // 3. Seed Categories
  const catMeeting = await prisma.resourceCategory.create({
    data: {
      name: "Conference & Meeting Rooms",
      slug: "conference-rooms",
      description: "Soundproof spaces equipped with video conferencing, digital whiteboards, and AV systems.",
      icon: "DoorClosed",
    },
  });

  const catHardware = await prisma.resourceCategory.create({
    data: {
      name: "Hardware & AV Tech",
      slug: "hardware-av",
      description: "Shared enterprise projectors, mobile presentation displays, and XR equipment.",
      icon: "Tv",
    },
  });

  const catLab = await prisma.resourceCategory.create({
    data: {
      name: "Laboratories & Testing",
      slug: "labs-testing",
      description: "Specialized workstations, embedded electronics testing, and benchmarking rigs.",
      icon: "FlaskConical",
    },
  });

  const catPods = await prisma.resourceCategory.create({
    data: {
      name: "Focus Pods & Hot Desks",
      slug: "focus-pods",
      description: "Single-occupancy acoustic booths for private calls, interviews, and deep work.",
      icon: "Headphones",
    },
  });

  const catTransit = await prisma.resourceCategory.create({
    data: {
      name: "Vehicles & Transport",
      slug: "vehicles-transport",
      description: "Company fleet vehicles for client visits, team transit, and on-site field visits.",
      icon: "Car",
    },
  });

  // 4. Seed Resources
  const boardroom = await prisma.resource.create({
    data: {
      code: "CR-101",
      name: "Main Executive Boardroom",
      description: "Premium boardroom with dual 75-inch 4K screens, Neat Bar Pro video conferencing, and executive seating.",
      categoryId: catMeeting.id,
      location: "3rd Floor, East Wing",
      capacity: 18,
      amenities: JSON.stringify(["Dual 4K Displays", "Zoom / Teams Rooms", "Acoustic Wall Treatment", "Whiteboard", "Polycom Conference Phone"]),
      status: ResourceStatus.AVAILABLE,
      imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80",
      minBookingMinutes: 30,
      maxBookingMinutes: 240,
    },
  });

  const agileRoom = await prisma.resource.create({
    data: {
      code: "CR-102",
      name: "Agile Innovation Hub",
      description: "Flexible room setup with mobile magnetic whiteboards, smart stylus display, and modular tables.",
      categoryId: catMeeting.id,
      location: "2nd Floor, Central Atrium",
      capacity: 10,
      amenities: JSON.stringify(["Mobile Whiteboards", "65-inch Touch Display", "Air Conditioned", "Ergonomic Chairs"]),
      status: ResourceStatus.AVAILABLE,
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
      minBookingMinutes: 15,
      maxBookingMinutes: 180,
    },
  });

  const huddleRoom = await prisma.resource.create({
    data: {
      code: "CR-103",
      name: "Huddle Pod Alpha",
      description: "Compact collaborative space ideal for 1-on-1 sprint reviews and quick stakeholder check-ins.",
      categoryId: catMeeting.id,
      location: "1st Floor, Tech Bay",
      capacity: 4,
      amenities: JSON.stringify(["50-inch Display", "Webcam & Mic Bar", "High-Speed Wi-Fi"]),
      status: ResourceStatus.AVAILABLE,
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      minBookingMinutes: 15,
      maxBookingMinutes: 120,
    },
  });

  const projector = await prisma.resource.create({
    data: {
      code: "PRJ-01",
      name: "Epson 4K Laser Cinema Projector",
      description: "High-lumen portable laser projector for all-hands presentations and outdoor demo screenings.",
      categoryId: catHardware.id,
      location: "IT Storage Room B1",
      capacity: 1,
      amenities: JSON.stringify(["5000 Lumens", "HDMI 2.1 & USB-C", "Wireless Casting", "Hard Transport Case"]),
      status: ResourceStatus.AVAILABLE,
      imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80",
      minBookingMinutes: 60,
      maxBookingMinutes: 480,
    },
  });

  const labStation = await prisma.resource.create({
    data: {
      code: "LAB-01",
      name: "Hardware Diagnostics & Soldering Station",
      description: "Equipped bench with digital oscilloscope, precision multimeter, solder rework station, and ESD safety gear.",
      categoryId: catLab.id,
      location: "Basement R&D Lab, Station 4",
      capacity: 2,
      amenities: JSON.stringify(["Digital Oscilloscope", "Fume Extractor", "ESD Grounding Mat", "Power Supply Unit"]),
      status: ResourceStatus.MAINTENANCE,
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      minBookingMinutes: 30,
      maxBookingMinutes: 360,
    },
  });

  const focusBooth = await prisma.resource.create({
    data: {
      code: "POD-01",
      name: "Silent Focus Pod 1",
      description: "Acoustic soundproof telephone and deep work booth with integrated ventilation and motorized desk.",
      categoryId: catPods.id,
      location: "2nd Floor Quiet Zone",
      capacity: 1,
      amenities: JSON.stringify(["Sound Isolation (32dB)", "Power & USB Outlets", "Adjustable Task Light", "Sit-to-stand Desk"]),
      status: ResourceStatus.AVAILABLE,
      imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
      minBookingMinutes: 15,
      maxBookingMinutes: 180,
    },
  });

  const companyVan = await prisma.resource.create({
    data: {
      code: "VAN-01",
      name: "PrimeWave Transit Van",
      description: "Toyota HiAce 7-seater van for logistics, client visits, and team airport pickups.",
      categoryId: catTransit.id,
      location: "Basement Parking Slot 14",
      capacity: 7,
      amenities: JSON.stringify(["Dashcam", "Expressway ETC Card", "First Aid Kit", "Automatic Transmission"]),
      status: ResourceStatus.AVAILABLE,
      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
      minBookingMinutes: 60,
      maxBookingMinutes: 720,
    },
  });

  // 5. Seed Maintenance Log for LAB-01
  await prisma.maintenanceLog.create({
    data: {
      resourceId: labStation.id,
      action: "ANNUAL_CALIBRATION",
      details: "Oscilloscope and ESD grounding undergoing annual ISO safety calibration. Estimated return to service: 48 hours.",
      performedBy: "Niroshan Fernando",
    },
  });

  // 6. Seed Realistic Reservations (Relative to Current Time)
  // Anchor the sample bookings to the current time so the dashboard always has
  // examples of past, active, and upcoming reservations.
  const now = new Date();
  
  // Past reservation (Completed)
  const pastStart = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const pastEnd = new Date(now.getTime() - 1.5 * 60 * 60 * 1000);
  await prisma.reservation.create({
    data: {
      resourceId: boardroom.id,
      userId: dilshan.id,
      title: "Q3 UI/UX Design System Review",
      startTime: pastStart,
      endTime: pastEnd,
      status: ReservationStatus.COMPLETED,
      attendeesCount: 6,
      notes: "Reviewed typography, spacing tokens, and Figma UI kit updates.",
      checkInTime: new Date(pastStart.getTime() + 5 * 60 * 1000),
    },
  });

  // Active reservation right now (Checked In)
  const currentStart = new Date(now.getTime() - 20 * 60 * 1000);
  const currentEnd = new Date(now.getTime() + 40 * 60 * 1000);
  await prisma.reservation.create({
    data: {
      resourceId: agileRoom.id,
      userId: alex.id,
      title: "Sprint 42 Backlog Refinement",
      startTime: currentStart,
      endTime: currentEnd,
      status: ReservationStatus.CHECKED_IN,
      attendeesCount: 8,
      notes: "Estimating user stories for the client demo portal.",
      checkInTime: new Date(currentStart.getTime() + 2 * 60 * 1000),
    },
  });

  // Upcoming reservation later today (Confirmed)
  const upcomingStart = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const upcomingEnd = new Date(now.getTime() + 3.5 * 60 * 60 * 1000);
  await prisma.reservation.create({
    data: {
      resourceId: boardroom.id,
      userId: kavindi.id,
      title: "Deep Learning Model Architecture Presentation",
      startTime: upcomingStart,
      endTime: upcomingEnd,
      status: ReservationStatus.CONFIRMED,
      attendeesCount: 12,
      notes: "Sharing transformer benchmark results with the engineering department.",
    },
  });

  // Tomorrow reservation (Confirmed)
  // Move to tomorrow, then set a predictable local booking time.
  const tomorrowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  tomorrowStart.setHours(10, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrowStart.getTime() + 2 * 60 * 60 * 1000);
  await prisma.reservation.create({
    data: {
      resourceId: focusBooth.id,
      userId: alex.id,
      title: "Client Technical Onboarding Call",
      startTime: tomorrowStart,
      endTime: tomorrowEnd,
      status: ReservationStatus.CONFIRMED,
      attendeesCount: 1,
      notes: "Need absolute quiet for architectural review with overseas client.",
    },
  });

  // Tomorrow Projector reservation (Confirmed)
  const tomorrowProjStart = new Date(now.getTime() + 26 * 60 * 60 * 1000);
  tomorrowProjStart.setHours(14, 0, 0, 0);
  const tomorrowProjEnd = new Date(tomorrowProjStart.getTime() + 3 * 60 * 60 * 1000);
  await prisma.reservation.create({
    data: {
      resourceId: projector.id,
      userId: niroshan.id,
      title: "Company-Wide Town Hall Projection",
      startTime: tomorrowProjStart,
      endTime: tomorrowProjEnd,
      status: ReservationStatus.CONFIRMED,
      attendeesCount: 45,
      notes: "Setup projector in cafeteria for CEO keynote live broadcast.",
    },
  });

  console.log("✅ Seed completed successfully with 5 users, 5 categories, 7 resources, and 5 realistic reservations!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    // Return a non-zero exit code so scripts and CI detect the failure.
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });