import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 12)

  // ============================================================================
  // STUDENT USERS
  // ============================================================================
  console.log('Creating student users...')

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
          bio: 'Passionate public health student with focus on infectious diseases and health equity in Africa.',
          profileCompleteness: 85,
          skills: {
            create: [
              { name: 'Data Analysis', level: 'Intermediate', category: 'Technical' },
              { name: 'Research', level: 'Advanced', category: 'Technical' },
              { name: 'Python', level: 'Intermediate', category: 'Technical' },
              { name: 'Epidemiology', level: 'Beginner', category: 'Domain' },
              { name: 'Scientific Writing', level: 'Intermediate', category: 'Soft Skills' },
            ],
          },
          education: {
            create: {
              institution: 'University of Lagos',
              degree: 'Bachelor',
              fieldOfStudy: 'Public Health',
              startDate: new Date(2023, 8, 1),
              endDate: new Date(2027, 5, 1),
              gpa: 3.8,
            },
          },
          experience: {
            create: {
              company: 'Lagos State Ministry of Health',
              position: 'Public Health Intern',
              startDate: new Date(2025, 5, 1),
              endDate: new Date(2025, 7, 1),
              description: 'Assisted in contact tracing and health education campaigns.',
              location: 'Lagos, Nigeria',
              isCurrent: false,
            },
          },
          interests: {
            create: [
              { category: 'Industry', value: 'Global Health', priority: 1 },
              { category: 'Industry', value: 'Infectious Diseases', priority: 2 },
              { category: 'Role', value: 'Research Assistant', priority: 1 },
              { category: 'Location', value: 'Geneva', priority: 1 },
              { category: 'Location', value: 'Remote', priority: 2 },
            ],
          },
        },
      },
    },
  })

  const student2 = await prisma.user.upsert({
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
          phone: '+91 98765 43210',
          nationality: 'Indian',
          currentLocation: 'Mumbai, India',
          university: 'All India Institute of Medical Sciences',
          major: 'Epidemiology',
          graduationYear: 2026,
          degreeLevel: 'Master',
          gpa: 4.2,
          bio: 'Epidemiology researcher focused on vector-borne diseases and climate health impacts.',
          profileCompleteness: 90,
          skills: {
            create: [
              { name: 'R', level: 'Advanced', category: 'Technical' },
              { name: 'Statistical Analysis', level: 'Advanced', category: 'Technical' },
              { name: 'GIS', level: 'Intermediate', category: 'Technical' },
              { name: 'Machine Learning', level: 'Intermediate', category: 'Technical' },
              { name: 'Disease Modeling', level: 'Advanced', category: 'Domain' },
            ],
          },
          education: {
            create: [
              {
                institution: 'All India Institute of Medical Sciences',
                degree: 'Master',
                fieldOfStudy: 'Epidemiology',
                startDate: new Date(2024, 7, 1),
                endDate: new Date(2026, 5, 1),
                gpa: 4.2,
              },
            ],
          },
          interests: {
            create: [
              { category: 'Industry', value: 'Climate Health', priority: 1 },
              { category: 'Role', value: 'Research Fellow', priority: 1 },
              { category: 'Location', value: 'Boston', priority: 1 },
            ],
          },
        },
      },
    },
  })

  // ============================================================================
  // EMPLOYER USERS
  // ============================================================================
  console.log('Creating employer users...')

  const employer1 = await prisma.user.upsert({
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
          companyDescription: 'The World Health Organization is a specialized agency of the United Nations responsible for international public health.',
          headquarters: 'Geneva, Switzerland',
          foundedYear: 1948,
          isVerified: true,
          emailDomain: 'who.int',
        },
      },
    },
  })

  const employer2 = await prisma.user.upsert({
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
          companyDescription: 'UNICEF works in over 190 countries and territories to save children's lives, defend their rights, and help them fulfill their potential.',
          headquarters: 'New York, USA',
          foundedYear: 1946,
          isVerified: true,
          emailDomain: 'unicef.org',
        },
      },
    },
  })

  const employer3 = await prisma.user.upsert({
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
          companyDescription: 'Guided by the belief that every life has equal value, the Gates Foundation works to help all people lead healthy, productive lives.',
          headquarters: 'Seattle, USA',
          foundedYear: 2000,
          isVerified: true,
          emailDomain: 'gatesfoundation.org',
        },
      },
    },
  })

  // ============================================================================
  // MENTOR USERS
  // ============================================================================
  console.log('Creating mentor users...')

  const mentor1 = await prisma.user.upsert({
    where: { email: 'dr.chen@who.int' },
    update: {},
    create: {
      email: 'dr.chen@who.int',
      name: 'Dr. Sarah Chen',
      password: hashedPassword,
      role: 'MENTOR',
      status: 'ACTIVE',
      emailVerified: new Date(),
      mentorProfile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Chen',
          currentRole: 'Senior Epidemiologist',
          currentCompany: 'World Health Organization',
          bio: '15+ years experience in outbreak response and epidemiology. Led teams during Ebola, COVID-19, and other health emergencies.',
          expertiseAreas: ['Epidemiology', 'Outbreak Response', 'Infectious Diseases', 'Data Science'],
          industries: ['Global Health', 'Public Health', 'Emergency Response'],
          mentoringExperience: 'Mentored 20+ early-career epidemiologists through WHO fellowship programs.',
          availabilityStatus: 'AVAILABLE',
          availabilityHours: 4,
          sessionFormat: ['VIDEO', 'CALL'],
          timezone: 'Europe/Geneva',
          rating: 4.9,
          totalSessions: 45,
          isVerified: true,
        },
      },
    },
  })

  const mentor2 = await prisma.user.upsert({
    where: { email: 'prof.okonkwo@aids.gov' },
    update: {},
    create: {
      email: 'prof.okonkwo@aids.gov',
      name: 'Prof. Chinwe Okonkwo',
      password: hashedPassword,
      role: 'MENTOR',
      status: 'ACTIVE',
      emailVerified: new Date(),
      mentorProfile: {
        create: {
          firstName: 'Chinwe',
          lastName: 'Okonkwo',
          currentRole: 'Director, Global Health Initiative',
          currentCompany: 'USAID',
          bio: 'Former Minister of Health, Nigeria. Expert in health systems strengthening and HIV/AIDS programs across Africa.',
          expertiseAreas: ['Health Systems', 'HIV/AIDS', 'Policy', 'Leadership'],
          industries: ['Global Health', 'Government', 'International Development'],
          mentoringExperience: 'Mentored government officials and public health leaders across 15 African countries.',
          availabilityStatus: 'AVAILABLE',
          availabilityHours: 2,
          sessionFormat: ['VIDEO', 'CHAT'],
          timezone: 'Africa/Lagos',
          rating: 5.0,
          totalSessions: 32,
          isVerified: true,
        },
      },
    },
  })

  // ============================================================================
  // INTERNSHIPS
  // ============================================================================
  console.log('Creating internships...')

  const whoInternship = await prisma.internship.create({
    data: {
      employerId: employer1.employerProfile!.id,
      title: 'Global Health Intern - Infectious Diseases',
      description: 'Join WHO's Infectious Diseases team to support outbreak response and surveillance activities. Work alongside leading epidemiologists on real-world public health challenges.',
      requirements: [
        'Currently enrolled in Public Health, Epidemiology, or related field',
        'Strong analytical and research skills',
        'Proficiency in statistical software (R, Python, or Stata)',
        'Excellent written and verbal communication',
        'Willingness to travel for field assignments',
      ],
      responsibilities: [
        'Support data collection and analysis for disease surveillance',
        'Contribute to outbreak investigation reports',
        'Assist in developing technical guidance documents',
        'Participate in virtual and in-person training sessions',
        'Collaborate with cross-functional teams',
      ],
      benefits: [
        'Mentorship from WHO senior epidemiologists',
        'Exposure to global health emergency response',
        'Certificate of completion',
        'Potential pathway to fellowship programs',
        'Access to WHO learning resources',
      ],
      location: 'Geneva, Switzerland',
      locationType: 'HYBRID',
      department: 'Infectious Diseases',
      duration: 12,
      stipend: 2500,
      currency: 'CHF',
      startDate: new Date(2026, 5, 1),
      applicationDeadline: new Date(2026, 3, 15),
      status: 'PUBLISHED',
      views: 234,
      applicationsCount: 45,
    },
  })

  const unicefInternship = await prisma.internship.create({
    data: {
      employerId: employer2.employerProfile!.id,
      title: 'Child Health Research Intern',
      description: 'Support UNICEF's child health research initiatives focusing on nutrition, immunization, and disease prevention in low-resource settings.',
      requirements: [
        'Graduate student in Public Health, Nutrition, or related field',
        'Experience with systematic reviews and meta-analysis',
        'Strong literature review skills',
        'Cultural sensitivity and adaptability',
        'Fluency in English; French or Spanish is a plus',
      ],
      responsibilities: [
        'Conduct systematic literature reviews',
        'Analyze program data from country offices',
        'Draft research briefs and policy recommendations',
        'Support grant writing activities',
        'Present findings to technical teams',
      ],
      benefits: [
        'Work on impactful child health programs',
        'Collaboration with global experts',
        'Publication opportunities',
        'Professional development workshops',
        'Networking with UNICEF country offices',
      ],
      location: 'New York, USA',
      locationType: 'HYBRID',
      department: 'Child Health',
      duration: 16,
      stipend: 3000,
      currency: 'USD',
      startDate: new Date(2026, 6, 1),
      applicationDeadline: new Date(2026, 4, 1),
      status: 'PUBLISHED',
      views: 189,
      applicationsCount: 67,
    },
  })

  const gatesInternship = await prisma.internship.create({
    data: {
      employerId: employer3.employerProfile!.id,
      title: 'Global Health Data Science Intern',
      description: 'Join the Gates Foundation's Data Science team to develop predictive models and analytics for global health programs. Focus on malaria, TB, and neglected tropical diseases.',
      requirements: [
        'Graduate student in Data Science, Biostatistics, or related field',
        'Proficiency in Python and R',
        'Experience with machine learning frameworks',
        'Strong SQL and database skills',
        'Interest in global health equity',
      ],
      responsibilities: [
        'Build predictive models for disease burden',
        'Develop interactive dashboards for program teams',
        'Analyze large-scale health datasets',
        'Support impact evaluation studies',
        'Collaborate with grant recipients on data analysis',
      ],
      benefits: [
        'Cutting-edge data science work',
        'Mentorship from senior data scientists',
        'Access to unique global health datasets',
        'Conference presentation opportunities',
        'Competitive compensation',
      ],
      location: 'Seattle, USA',
      locationType: 'REMOTE',
      department: 'Data Science',
      duration: 12,
      stipend: 5000,
      currency: 'USD',
      startDate: new Date(2026, 5, 15),
      applicationDeadline: new Date(2026, 3, 30),
      status: 'PUBLISHED',
      views: 312,
      applicationsCount: 89,
    },
  })

  // ============================================================================
  // APPLICATIONS
  // ============================================================================
  console.log('Creating applications...')

  await prisma.application.create({
    data: {
      internshipId: whoInternship.id,
      studentId: student1.studentProfile!.id,
      userId: student1.id,
      status: 'SUBMITTED',
      coverLetter: 'I am passionate about infectious disease surveillance and would be honored to contribute to WHO's mission...',
      submissionData: {
        screeningQuestions: {
          availableForTravel: true,
          languages: ['English', 'Igbo', 'French (Basic)'],
          relevantCoursework: ['Epidemiology', 'Biostatistics', 'Infectious Diseases'],
        },
      },
    },
  })

  await prisma.application.create({
    data: {
      internshipId: unicefInternship.id,
      studentId: student2.studentProfile!.id,
      userId: student2.id,
      status: 'UNDER_REVIEW',
      coverLetter: 'My research on vector-borne diseases aligns perfectly with UNICEF's child health priorities...',
      submissionData: {
        screeningQuestions: {
          availableForTravel: true,
          languages: ['English', 'Hindi', 'Gujarati'],
          relevantCoursework: ['Advanced Epidemiology', 'Climate Health', 'Spatial Analysis'],
        },
      },
    },
  })

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  console.log('Creating notifications...')

  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        type: 'APPLICATION_UPDATE',
        title: 'Application Received',
        message: 'Your application for Global Health Intern - Infectious Diseases has been received.',
        isRead: false,
      },
      {
        userId: student2.id,
        type: 'APPLICATION_UPDATE',
        title: 'Application Under Review',
        message: 'Your application for Child Health Research Intern is being reviewed.',
        isRead: false,
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('📧 Test Credentials (password: password123):')
  console.log('   Students: student1@glohib.ai, student2@glohib.ai')
  console.log('   Employers: recruiter@who.int, careers@unicef.org, talent@gatesfoundation.org')
  console.log('   Mentors: dr.chen@who.int, prof.okonkwo@aids.gov')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
