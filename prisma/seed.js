// Simple seed script using JavaScript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  // Student 1
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@glohib.ai' },
    update: {},
    create: {
      email: 'student1@glohib.ai',
      name: 'Amara Okonkwo',
      password: hashedPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      emailVerified: new Date(),
      studentProfile: {
        create: {
          firstName: 'Amara',
          lastName: 'Okonkwo',
          phone: '+234 801 234 5678',
          nationality: 'Nigerian',
          currentLocation: 'Lagos, Nigeria',
          university: 'University of Lagos',
          major: 'Public Health',
          graduationYear: 2027,
          degreeLevel: 'Bachelor',
          gpa: 3.8,
          bio: 'Passionate public health student with focus on infectious diseases.',
          profileCompleteness: 85,
        },
      },
    },
  });

  // Student 2
  await prisma.user.upsert({
    where: { email: 'student2@glohib.ai' },
    update: {},
    create: {
      email: 'student2@glohib.ai',
      name: 'Raj Patel',
      password: hashedPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      emailVerified: new Date(),
      studentProfile: {
        create: {
          firstName: 'Raj',
          lastName: 'Patel',
          nationality: 'Indian',
          currentLocation: 'Mumbai, India',
          university: 'AIIMS',
          major: 'Epidemiology',
          graduationYear: 2026,
          degreeLevel: 'Master',
          gpa: 4.2,
          bio: 'Epidemiology researcher focused on vector-borne diseases.',
          profileCompleteness: 80,
        },
      },
    },
  });

  // Employer 1 - WHO
  const who = await prisma.user.upsert({
    where: { email: 'recruiter@who.int' },
    update: {},
    create: {
      email: 'recruiter@who.int',
      name: 'WHO Recruitment Team',
      password: hashedPassword,
      role: 'EMPLOYER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      employerProfile: {
        create: {
          companyName: 'World Health Organization',
          companyWebsite: 'https://www.who.int',
          companySize: '500+',
          industry: 'Global Health',
          companyDescription: 'The World Health Organization is a specialized agency of the United Nations.',
          headquarters: 'Geneva, Switzerland',
          foundedYear: 1948,
          isVerified: true,
          emailDomain: 'who.int',
        },
      },
    },
  });

  // Employer 2 - UNICEF
  await prisma.user.upsert({
    where: { email: 'careers@unicef.org' },
    update: {},
    create: {
      email: 'careers@unicef.org',
      name: 'UNICEF Talent Acquisition',
      password: hashedPassword,
      role: 'EMPLOYER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      employerProfile: {
        create: {
          companyName: 'UNICEF',
          companyWebsite: 'https://www.unicef.org',
          companySize: '500+',
          industry: 'International Development',
          companyDescription: 'UNICEF works in over 190 countries to save children\'s lives.',
          headquarters: 'New York, USA',
          foundedYear: 1946,
          isVerified: true,
          emailDomain: 'unicef.org',
        },
      },
    },
  });

  // Employer 3 - Gates Foundation
  const gates = await prisma.user.upsert({
    where: { email: 'talent@gatesfoundation.org' },
    update: {},
    create: {
      email: 'talent@gatesfoundation.org',
      name: 'Gates Foundation HR',
      password: hashedPassword,
      role: 'EMPLOYER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      employerProfile: {
        create: {
          companyName: 'Bill & Melinda Gates Foundation',
          companyWebsite: 'https://www.gatesfoundation.org',
          companySize: '500+',
          industry: 'Philanthropy',
          companyDescription: 'Guided by the belief that every life has equal value.',
          headquarters: 'Seattle, USA',
          foundedYear: 2000,
          isVerified: true,
          emailDomain: 'gatesfoundation.org',
        },
      },
    },
  });

  // Create internships
  const whoProfile = await prisma.employerProfile.findUnique({
    where: { userId: who.id },
  });

  if (whoProfile) {
    await prisma.internship.create({
      data: {
        employerId: whoProfile.id,
        title: 'Global Health Intern - Infectious Diseases',
        description: 'Join WHO\'s Infectious Diseases team to support outbreak response.',
        requirements: ['Currently enrolled in Public Health or related field', 'Strong analytical skills'],
        responsibilities: ['Support data collection', 'Contribute to outbreak reports'],
        benefits: ['Mentorship from WHO epidemiologists', 'Certificate of completion'],
        location: 'Geneva, Switzerland',
        locationType: 'HYBRID',
        department: 'Infectious Diseases',
        duration: 12,
        stipend: 2500,
        currency: 'CHF',
        startDate: new Date('2026-06-01'),
        applicationDeadline: new Date('2026-03-15'),
        status: 'PUBLISHED',
      },
    });
  }

  const unicefProfile = await prisma.employerProfile.findUnique({
    where: { userId: gates.id },
  });

  if (unicefProfile) {
    await prisma.internship.create({
      data: {
        employerId: unicefProfile.id,
        title: 'Child Health Research Intern',
        description: 'Support UNICEF\'s child health research initiatives.',
        requirements: ['Graduate student in Public Health', 'Research experience'],
        responsibilities: ['Conduct literature reviews', 'Analyze program data'],
        benefits: ['Work on impactful programs', 'Publication opportunities'],
        location: 'New York, USA',
        locationType: 'HYBRID',
        department: 'Child Health',
        duration: 16,
        stipend: 3000,
        currency: 'USD',
        startDate: new Date('2026-07-01'),
        applicationDeadline: new Date('2026-04-01'),
        status: 'PUBLISHED',
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📧 Test Credentials (password: password123):');
  console.log('   Students: student1@glohib.ai, student2@glohib.ai');
  console.log('   Employers: recruiter@who.int, careers@unicef.org, talent@gatesfoundation.org');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
