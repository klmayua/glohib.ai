// Comprehensive seed script with real-world internship data
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  // ========================
  // USERS
  // ========================
  console.log('👤 Creating users...');

  const student1 = await prisma.user.upsert({
    where: { email: 'amara@glohib.ai' },
    update: {},
    create: {
      email: 'amara@glohib.ai',
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
          bio: 'Passionate public health student with focus on infectious diseases and health equity in developing nations. Seeking hands-on experience in global health policy.',
          profileCompleteness: 85,
        },
      },
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'raj@glohib.ai' },
    update: {},
    create: {
      email: 'raj@glohib.ai',
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
          university: 'AIIMS',
          major: 'Epidemiology',
          graduationYear: 2026,
          degreeLevel: 'Master',
          gpa: 4.2,
          bio: 'Epidemiology researcher focused on vector-borne diseases and outbreak investigation. Looking for field experience with international health organizations.',
          profileCompleteness: 80,
        },
      },
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'sarah@glohib.ai' },
    update: {},
    create: {
      email: 'sarah@glohib.ai',
      name: 'Sarah Chen',
      password: hashedPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      emailVerified: new Date(),
      studentProfile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Chen',
          nationality: 'American',
          currentLocation: 'Boston, MA',
          university: 'Harvard University',
          major: 'Computer Science',
          graduationYear: 2027,
          degreeLevel: 'Bachelor',
          gpa: 3.9,
          bio: 'Full-stack developer passionate about health tech and AI. Built 3 production apps and contributed to open-source health data projects.',
          profileCompleteness: 70,
        },
      },
    },
  });

  // Employers
  const who = await prisma.user.upsert({
    where: { email: 'careers@who.int' },
    update: {},
    create: {
      email: 'careers@who.int',
      name: 'WHO Talent Acquisition',
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
          companyDescription: 'The World Health Organization is the directing and coordinating authority on international health within the United Nations system.',
          headquarters: 'Geneva, Switzerland',
          foundedYear: 1948,
          isVerified: true,
          emailDomain: 'who.int',
        },
      },
    },
  });

  const unicef = await prisma.user.upsert({
    where: { email: 'internships@unicef.org' },
    update: {},
    create: {
      email: 'internships@unicef.org',
      name: 'UNICEF Talent Team',
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
          companyDescription: 'UNICEF works in over 190 countries and territories to save children\'s lives, defend their rights, and help them fulfill their potential.',
          headquarters: 'New York, USA',
          foundedYear: 1946,
          isVerified: true,
          emailDomain: 'unicef.org',
        },
      },
    },
  });

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
          companyDescription: 'Guided by the belief that every life has equal value, the Gates Foundation works to reduce inequities and improve lives around the world.',
          headquarters: 'Seattle, USA',
          foundedYear: 2000,
          isVerified: true,
          emailDomain: 'gatesfoundation.org',
        },
      },
    },
  });

  const google = await prisma.user.upsert({
    where: { email: 'university@google.com' },
    update: {},
    create: {
      email: 'university@google.com',
      name: 'Google University Programs',
      password: hashedPassword,
      role: 'EMPLOYER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      employerProfile: {
        create: {
          companyName: 'Google',
          companyWebsite: 'https://www.google.com',
          companySize: '500+',
          industry: 'Technology',
          companyDescription: 'Google\'s mission is to organize the world\'s information and make it universally accessible and useful.',
          headquarters: 'Mountain View, CA',
          foundedYear: 1998,
          isVerified: true,
          emailDomain: 'google.com',
        },
      },
    },
  });

  const microsoft = await prisma.user.upsert({
    where: { email: 'internships@microsoft.com' },
    update: {},
    create: {
      email: 'internships@microsoft.com',
      name: 'Microsoft Recruiting',
      password: hashedPassword,
      role: 'EMPLOYER',
      status: 'ACTIVE',
      emailVerified: new Date(),
      employerProfile: {
        create: {
          companyName: 'Microsoft',
          companyWebsite: 'https://www.microsoft.com',
          companySize: '500+',
          industry: 'Technology',
          companyDescription: 'Microsoft empowers every person and organization on the planet to achieve more through technology.',
          headquarters: 'Redmond, WA',
          foundedYear: 1975,
          isVerified: true,
          emailDomain: 'microsoft.com',
        },
      },
    },
  });

  // ========================
  // INTERNSHIPS
  // ========================
  console.log('💼 Creating internships...');

  const whoProfile = await prisma.employerProfile.findUnique({ where: { userId: who.id } });
  const unicefProfile = await prisma.employerProfile.findUnique({ where: { userId: unicef.id } });
  const gatesProfile = await prisma.employerProfile.findUnique({ where: { userId: gates.id } });
  const googleProfile = await prisma.employerProfile.findUnique({ where: { userId: google.id } });
  const msProfile = await prisma.employerProfile.findUnique({ where: { userId: microsoft.id } });

  const internships = [];

  // WHO internships
  if (whoProfile) {
    internships.push(await prisma.internship.create({
      data: {
        employerId: whoProfile.id,
        title: 'Global Health Policy Intern',
        description: 'Support WHO\'s Health Emergencies Programme with policy analysis, data collection, and briefing document preparation. Work alongside senior epidemiologists on real-time outbreak response.',
        requirements: ['Currently enrolled in Public Health, International Relations, or related Master\'s program', 'Strong analytical and writing skills', 'Experience with data analysis tools (R, Python, or Stata)', 'Fluency in English; French or Arabic preferred'],
        responsibilities: ['Analyze health policy data for weekly outbreak briefings', 'Draft policy recommendations for member states', 'Support coordination with regional health authorities', 'Contribute to technical reports and publications'],
        benefits: ['Direct mentorship from WHO senior epidemiologists', 'Contribute to real-world health emergency response', 'Certificate of completion and reference letter', 'Networking with global health professionals'],
        location: 'Geneva, Switzerland',
        locationType: 'HYBRID',
        department: 'Health Emergencies',
        duration: 24,
        stipend: 3500,
        currency: 'CHF',
        startDate: new Date('2026-09-01'),
        applicationDeadline: new Date('2026-06-15'),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    }));

    internships.push(await prisma.internship.create({
      data: {
        employerId: whoProfile.id,
        title: 'Infectious Disease Research Intern',
        description: 'Join the Department of Epidemic and Pandemic Preparedness to support research on emerging infectious diseases. Analyze genomic surveillance data and contribute to early warning systems.',
        requirements: ['Graduate student in Epidemiology, Microbiology, or related field', 'Experience with genomic data analysis', 'Understanding of infectious disease transmission dynamics', 'Publication record preferred but not required'],
        responsibilities: ['Analyze pathogen genomic surveillance data', 'Support development of early warning algorithms', 'Contribute to research manuscripts', 'Present findings at weekly team meetings'],
        benefits: ['Access to WHO\'s global surveillance databases', 'Co-authorship on research publications', 'Collaboration with leading researchers worldwide', 'Professional development workshops'],
        location: 'Geneva, Switzerland',
        locationType: 'REMOTE',
        department: 'Infectious Diseases',
        duration: 16,
        stipend: 2800,
        currency: 'CHF',
        startDate: new Date('2026-08-01'),
        applicationDeadline: new Date('2026-05-30'),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    }));
  }

  // UNICEF internships
  if (unicefProfile) {
    internships.push(await prisma.internship.create({
      data: {
        employerId: unicefProfile.id,
        title: 'Child Health Data Analyst Intern',
        description: 'Support UNICEF\'s Data and Analytics team to analyze child health indicators across 190+ countries. Build dashboards and contribute to the State of the World\'s Children report.',
        requirements: ['Master\'s student in Statistics, Data Science, or Public Health', 'Proficiency in R or Python for data analysis', 'Experience with data visualization (Tableau, PowerBI, or D3.js)', 'Passion for child health and development'],
        responsibilities: ['Analyze child mortality and nutrition data across regions', 'Build interactive dashboards for country offices', 'Contribute to annual State of the World\'s Children report', 'Support data quality assessments'],
        benefits: ['Impact on child health programs in 190+ countries', 'Work with the world\'s largest child health dataset', 'Mentorship from senior data scientists', 'Opportunity for publication authorship'],
        location: 'New York, USA',
        locationType: 'HYBRID',
        department: 'Data & Analytics',
        duration: 20,
        stipend: 4000,
        currency: 'USD',
        startDate: new Date('2026-09-01'),
        applicationDeadline: new Date('2026-06-01'),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    }));

    internships.push(await prisma.internship.create({
      data: {
        employerId: unicefProfile.id,
        title: 'Digital Health Innovation Intern',
        description: 'Join UNICEF\'s Innovation team to support digital health solutions including mobile health platforms, AI diagnostics, and telemedicine programs in low-resource settings.',
        requirements: ['Background in Computer Science, Engineering, or Health Informatics', 'Experience with mobile app development or web technologies', 'Understanding of health systems in developing countries', 'Creative problem-solving mindset'],
        responsibilities: ['Prototype digital health tools for field testing', 'Evaluate existing mHealth platforms for scalability', 'Support partnerships with tech companies', 'Contribute to innovation pipeline management'],
        benefits: ['Build solutions used by millions of children', 'Collaboration with UNICEF country offices worldwide', 'Access to UNICEF Innovation Fund portfolio', 'Conference speaking opportunities'],
        location: 'Nairobi, Kenya',
        locationType: 'ON_SITE',
        department: 'Innovation',
        duration: 12,
        stipend: 2500,
        currency: 'USD',
        startDate: new Date('2026-07-15'),
        applicationDeadline: new Date('2026-05-15'),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    }));
  }

  // Gates Foundation internships
  if (gatesProfile) {
    internships.push(await prisma.internship.create({
      data: {
        employerId: gatesProfile.id,
        title: 'Global Health Data Science Fellow',
        description: 'Support the foundation\'s Global Health program with advanced analytics, modeling, and evaluation of health interventions. Work on malaria, TB, HIV, and maternal health programs.',
        requirements: ['PhD or Master\'s student in Biostatistics, Epidemiology, or related field', 'Advanced statistical modeling experience', 'Programming proficiency in R, Python, or MATLAB', 'Interest in global health equity'],
        responsibilities: ['Develop mathematical models for disease intervention impact', 'Analyze program evaluation data from partner countries', 'Create data visualizations for grant reports', 'Support investment case development'],
        benefits: ['Shape billion-dollar global health investments', 'Access to proprietary health datasets', 'Mentorship from leading global health researchers', 'Potential pathway to full-time role'],
        location: 'Seattle, USA',
        locationType: 'HYBRID',
        department: 'Global Health',
        duration: 24,
        stipend: 6000,
        currency: 'USD',
        startDate: new Date('2026-08-01'),
        applicationDeadline: new Date('2026-05-01'),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    }));
  }

  // Google internships
  if (googleProfile) {
    internships.push(await prisma.internship.create({
      data: {
        employerId: googleProfile.id,
        title: 'Software Engineering Intern - Health AI',
        description: 'Join Google Health AI team to build machine learning models for medical imaging, clinical NLP, and predictive health analytics. Work on products used by billions.',
        requirements: ['Currently pursuing BS/MS/PhD in Computer Science or related field', 'Strong foundation in machine learning and deep learning', 'Proficiency in Python, TensorFlow, or PyTorch', 'Experience with large-scale data systems'],
        responsibilities: ['Develop ML models for medical image analysis', 'Build and evaluate NLP pipelines for clinical text', 'Optimize model inference for production deployment', 'Collaborate with clinical experts on model validation'],
        benefits: ['Competitive salary + housing support', 'Work on products affecting billions of users', 'Access to world-class ML infrastructure', 'Mentorship from Google AI researchers'],
        location: 'Mountain View, CA',
        locationType: 'ON_SITE',
        department: 'Engineering',
        duration: 12,
        stipend: 8500,
        currency: 'USD',
        startDate: new Date('2026-06-01'),
        applicationDeadline: new Date('2026-03-15'),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    }));

    internships.push(await prisma.internship.create({
      data: {
        employerId: googleProfile.id,
        title: 'Product Management Intern - Google for Nonprofits',
        description: 'Support Google for Nonprofits team to build products serving NGOs, foundations, and health organizations worldwide. Define product strategy and analyze impact metrics.',
        requirements: ['MBA or Master\'s student in relevant field', 'Experience with product management or strategy consulting', 'Understanding of nonprofit/NGO sector', 'Strong analytical and communication skills'],
        responsibilities: ['Conduct user research with nonprofit partners', 'Define product requirements and success metrics', 'Analyze adoption and impact data', 'Support launch of new nonprofit tools'],
        benefits: ['Shape products serving 100,000+ nonprofits', 'Cross-functional collaboration with engineering and design', 'Executive visibility and leadership mentoring', 'Full-time conversion opportunities'],
        location: 'Mountain View, CA',
        locationType: 'HYBRID',
        department: 'Product',
        duration: 12,
        stipend: 7500,
        currency: 'USD',
        startDate: new Date('2026-06-01'),
        applicationDeadline: new Date('2026-03-01'),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    }));
  }

  // Microsoft internships
  if (msProfile) {
    internships.push(await prisma.internship.create({
      data: {
        employerId: msProfile.id,
        title: 'AI Research Intern - Healthcare',
        description: 'Join Microsoft Research\'s Health AI team to advance foundation models for healthcare, including medical vision-language models and clinical reasoning agents.',
        requirements: ['PhD student in CS, AI, or related field', 'Published research in ML/AI conferences (NeurIPS, ICML, etc.)', 'Experience with large-scale model training', 'Interest in healthcare applications'],
        responsibilities: ['Research and develop medical foundation models', 'Train and evaluate vision-language models on clinical data', 'Write research papers for top-tier conferences', 'Collaborate with hospital partners on validation studies'],
        benefits: ['Work with world-leading AI researchers', 'Access to Azure compute resources', 'Publication support', 'Potential PhD collaboration continuation'],
        location: 'Redmond, WA',
        locationType: 'REMOTE',
        department: 'Research',
        duration: 16,
        stipend: 7000,
        currency: 'USD',
        startDate: new Date('2026-07-01'),
        applicationDeadline: new Date('2026-04-01'),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    }));

    internships.push(await prisma.internship.create({
      data: {
        employerId: msProfile.id,
        title: 'Cloud Solutions Intern - HealthTech',
        description: 'Support Microsoft Cloud for Healthcare team to build and deploy cloud solutions for hospitals, health systems, and research organizations globally.',
        requirements: ['CS or Engineering student with cloud computing interest', 'Familiarity with Azure, AWS, or GCP', 'Understanding of healthcare data standards (HL7, FHIR)', 'Customer-facing communication skills'],
        responsibilities: ['Deploy and configure Azure Health Data Services', 'Build integration pipelines for hospital systems', 'Create technical documentation and tutorials', 'Support customer proof-of-concept projects'],
        benefits: ['Real-world healthcare technology experience', 'Azure certification sponsorship', 'Customer-facing project experience', 'Global team collaboration'],
        location: 'London, UK',
        locationType: 'HYBRID',
        department: 'Cloud Solutions',
        duration: 12,
        stipend: 4500,
        currency: 'GBP',
        startDate: new Date('2026-09-01'),
        applicationDeadline: new Date('2026-06-01'),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    }));
  }

  console.log(`✅ Created ${internships.length} internships`);

  // ========================
  // SKILLS, EDUCATION, EXPERIENCE
  // ========================
  console.log('📚 Adding skills and experience...');

  const sp1 = await prisma.studentProfile.findUnique({ where: { userId: student1.id } });
  if (sp1) {
    await prisma.skill.createMany({
      data: [
        { studentId: sp1.id, name: 'Epidemiology', level: 'Advanced', yearsOfExperience: 3, category: 'Research' },
        { studentId: sp1.id, name: 'R Programming', level: 'Intermediate', yearsOfExperience: 2, category: 'Technical' },
        { studentId: sp1.id, name: 'Health Policy Analysis', level: 'Advanced', yearsOfExperience: 3, category: 'Research' },
        { studentId: sp1.id, name: 'Data Visualization', level: 'Intermediate', yearsOfExperience: 2, category: 'Technical' },
        { studentId: sp1.id, name: 'Public Speaking', level: 'Advanced', yearsOfExperience: 4, category: 'Soft Skills' },
      ],
    });

    await prisma.education.create({
      data: {
        studentId: sp1.id,
        institution: 'University of Lagos',
        degree: 'Bachelor',
        fieldOfStudy: 'Public Health',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2027-06-01'),
        gpa: 3.8,
      },
    });

    await prisma.experience.create({
      data: {
        studentId: sp1.id,
        company: 'Nigeria Centre for Disease Control',
        position: 'Research Assistant',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-09-01'),
        description: 'Assisted in cholera outbreak surveillance data analysis. Created weekly epidemiological reports for state health commissioners.',
        location: 'Abuja, Nigeria',
        isCurrent: false,
      },
    });

    await prisma.interest.createMany({
      data: [
        { studentId: sp1.id, category: 'Industry', value: 'Global Health', priority: 1 },
        { studentId: sp1.id, category: 'Role', value: 'Epidemiologist', priority: 1 },
        { studentId: sp1.id, category: 'Location', value: 'Geneva', priority: 2 },
        { studentId: sp1.id, category: 'Location', value: 'Nairobi', priority: 2 },
      ],
    });
  }

  const sp2 = await prisma.studentProfile.findUnique({ where: { userId: student2.id } });
  if (sp2) {
    await prisma.skill.createMany({
      data: [
        { studentId: sp2.id, name: 'Python', level: 'Advanced', yearsOfExperience: 4, category: 'Technical' },
        { studentId: sp2.id, name: 'Machine Learning', level: 'Intermediate', yearsOfExperience: 2, category: 'Technical' },
        { studentId: sp2.id, name: 'Statistical Modeling', level: 'Advanced', yearsOfExperience: 3, category: 'Research' },
        { studentId: sp2.id, name: 'GIS Mapping', level: 'Intermediate', yearsOfExperience: 2, category: 'Technical' },
      ],
    });

    await prisma.education.create({
      data: {
        studentId: sp2.id,
        institution: 'AIIMS',
        degree: 'Master',
        fieldOfStudy: 'Epidemiology',
        startDate: new Date('2024-08-01'),
        endDate: new Date('2026-06-01'),
        gpa: 4.2,
      },
    });

    await prisma.interest.createMany({
      data: [
        { studentId: sp2.id, category: 'Industry', value: 'Research', priority: 1 },
        { studentId: sp2.id, category: 'Role', value: 'Data Scientist', priority: 1 },
        { studentId: sp2.id, category: 'Location', value: 'Seattle', priority: 2 },
      ],
    });
  }

  // ========================
  // APPLICATIONS
  // ========================
  console.log('📝 Creating applications...');

  if (sp1 && internships[0]) {
    await prisma.application.create({
      data: {
        internshipId: internships[0].id,
        studentId: sp1.id,
        userId: student1.id,
        status: 'UNDER_REVIEW',
        coverLetter: 'I am writing to express my strong interest in the Global Health Policy Intern position at WHO. As a Public Health student at the University of Lagos with hands-on experience at the Nigeria CDC, I bring both academic rigor and practical field experience to this role.',
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  if (sp1 && internships[2]) {
    await prisma.application.create({
      data: {
        internshipId: internships[2].id,
        studentId: sp1.id,
        userId: student1.id,
        status: 'SUBMITTED',
        coverLetter: 'With my background in public health and data analysis, I am excited about the opportunity to contribute to UNICEF\'s child health data initiatives.',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    });
  }

  if (sp2 && internships[1]) {
    await prisma.application.create({
      data: {
        internshipId: internships[1].id,
        studentId: sp2.id,
        userId: student2.id,
        status: 'SUBMITTED',
        coverLetter: 'My epidemiology research at AIIMS, combined with advanced Python and ML skills, make me an ideal candidate for this infectious disease research internship.',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // ========================
  // NOTIFICATIONS
  // ========================
  console.log('🔔 Creating notifications...');

  if (student1.id) {
    await prisma.notification.createMany({
      data: [
        {
          userId: student1.id,
          type: 'APPLICATION_UPDATE',
          title: 'Application Under Review',
          message: 'Your application for Global Health Policy Intern at WHO is now under review.',
          isRead: false,
        },
        {
          userId: student1.id,
          type: 'APPLICATION_UPDATE',
          title: 'Application Submitted',
          message: 'Your application for Child Health Data Analyst Intern at UNICEF has been submitted.',
          isRead: true,
        },
        {
          userId: student1.id,
          type: 'SYSTEM',
          title: 'New Recommendations',
          message: 'We found 3 new internships matching your profile.',
          isRead: false,
        },
      ],
    });
  }

  console.log('');
  console.log('✅ Database seeded successfully!');
  console.log('');
  console.log('📧 Test Credentials (password: password123):');
  console.log('   Students:');
  console.log('     amara@glohib.ai (Amara Okonkwo - Public Health, Lagos)');
  console.log('     raj@glohib.ai (Raj Patel - Epidemiology, Mumbai)');
  console.log('     sarah@glohib.ai (Sarah Chen - CS, Harvard)');
  console.log('   Employers:');
  console.log('     careers@who.int (World Health Organization)');
  console.log('     internships@unicef.org (UNICEF)');
  console.log('     talent@gatesfoundation.org (Gates Foundation)');
  console.log('     university@google.com (Google)');
  console.log('     internships@microsoft.com (Microsoft)');
  console.log(`\n💼 ${internships.length} internships created`);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
