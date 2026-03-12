require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('./models/User');
const Employee = require('./models/Employee');
const Assessment = require('./models/Assessment');
const Result = require('./models/Result');

const departments = ['Engineering', 'Data Science', 'Marketing', 'HR', 'Operations'];
const roleMap = {
  'Engineering': ['Frontend Developer', 'Backend Engineer', 'DevOps Engineer'],
  'Data Science': ['Data Scientist', 'Machine Learning Engineer', 'Data Analyst'],
  'Marketing': ['Growth Marketing Manager', 'SEO Specialist', 'Content Strategist'],
  'HR': ['Talent Acquisition Specialist', 'HR Business Partner'],
  'Operations': ['Operations Manager', 'Project Manager']
};
const skillPool = {
  'Frontend Developer': ['react', 'javascript', 'css', 'html', 'tailwind', 'typescript'],
  'Backend Engineer': ['node.js', 'express', 'mongodb', 'python', 'sql', 'docker'],
  'Data Scientist': ['python', 'machine learning', 'sql', 'statistics', 'aws', 'pandas'],
  'Marketing': ['seo', 'content strategy', 'google analytics', 'copywriting', 'agile'],
  'HR': ['technical recruiting', 'onboarding', 'employee relations', 'workday'],
  'Operations': ['agile', 'scrum', 'jira', 'risk management', 'leadership']
};

const seedDatabase = async () => {
  try {
    // ensure connection is open (should already be managed by config/db)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ai-workforce");
      console.log('MongoDB Connected for Seeding...');
    } else {
      console.log('Using existing MongoDB Connection for Seeding...');
    }

    // Clear Database
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Assessment.deleteMany({});
    await Result.deleteMany({});
    console.log('Cleared existing data.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Manager Account
    await User.create({
      username: 'admin_manager',
      email: 'manager@aiworkforce.com',
      password: hashedPassword,
      role: 'manager'
    });

    // 1.5. Create Global WDT Assessment first (needed for Results)
    const globalAssessment = await Assessment.create({
      title: 'Global Engineering & Logic WDT',
      description: 'Standardized baseline test for problem solving.',
      timeLimitMinutes: 60
    });

    // 2. Create test employee accounts with known usernames
    const testEmployees = [
      { username: 'mary.johnson', email: 'mary.johnson@example.com', firstName: 'Mary', lastName: 'Johnson' },
      { username: 'john.smith', email: 'john.smith@example.com', firstName: 'John', lastName: 'Smith' },
      { username: 'sarah.davis', email: 'sarah.davis@example.com', firstName: 'Sarah', lastName: 'Davis' }
    ];

    console.log('Creating test employee accounts...');
    for (const testEmp of testEmployees) {
      try {
        console.log(`  Creating user: ${testEmp.username}...`);
        const user = await User.create({
          username: testEmp.username,
          email: testEmp.email,
          password: hashedPassword,
          role: 'employee'
        });
        console.log(`  ✓ User created with ID: ${user._id}`);

        // Create basic employee profile
        try {
          const dept = faker.helpers.arrayElement(departments);
          const recommendedRole = faker.helpers.arrayElement(roleMap[dept]);
          const poolKey = skillPool[recommendedRole] ? recommendedRole : dept;
          const randomSkills = faker.helpers.arrayElements(skillPool[poolKey] || ['leadership', 'agile'], faker.number.int({ min: 3, max: 6 }));
          
          const employee = await Employee.create({
            userId: user._id,
            department: dept,
            skills: randomSkills,
            experience: [{ title: recommendedRole, company: faker.company.name(), years: faker.number.int({ min: 1, max: 12 }) }],
            recommendedRole: recommendedRole,
            fitmentScore: faker.number.int({ min: 60, max: 98 }),
            performanceScore: faker.number.int({ min: 55, max: 95 })
          });
          console.log(`  ✓ Employee profile: ${testEmp.username}`);
        } catch (empErr) {
          console.warn(`    Couldn't create employee profile: ${empErr.message}`);
        }
      } catch (err) {
        console.error(`  ✗ Error creating test user: ${err.message}`);
      }
    }

    // 3. Generate 20 Additional Demo Employees
    console.log('Generating 20 Additional Demo Employees...');

    for (let i = 0; i < 20; i++) {
        const dept = faker.helpers.arrayElement(departments);
        const recommendedRole = faker.helpers.arrayElement(roleMap[dept]);
        
        let poolKey = recommendedRole;
        if (!skillPool[poolKey]) poolKey = dept; // Fallback mapping
        
        const randomSkills = faker.helpers.arrayElements(skillPool[poolKey] || ['leadership', 'agile'], faker.number.int({ min: 3, max: 6 }));
        
        const generatedExp = faker.number.int({ min: 1, max: 12 });
        const WDT_Score = faker.number.int({ min: 45, max: 98 });
        const perfScore = faker.number.int({ min: 55, max: 95 });
        
        const fName = faker.person.firstName();
        const lName = faker.person.lastName();

        // User Account
        const user = await User.create({
            username: `${fName.toLowerCase()}.${lName.toLowerCase()}`,
            email: faker.internet.email({ firstName: fName, lastName: lName }),
            password: hashedPassword,
            role: 'employee'
        });

        // Employee Profile
        const employee = await Employee.create({
            userId: user._id,
            department: dept,
            skills: randomSkills,
            experience: [
                {
                    title: recommendedRole,
                    company: faker.company.name(),
                    years: generatedExp
                }
            ],
            recommendedRole: recommendedRole,
            fitmentScore: faker.number.int({ min: 60, max: 98 }),
            performanceScore: perfScore
        });

        // WDT Result
        await Result.create({
            employeeId: employee._id,
            assessmentId: globalAssessment._id,
            overallScore: WDT_Score,
            maxPossibleScore: 100,
            percentage: WDT_Score,
            categoryScores: [
                { category: 'Logic', score: Math.floor(WDT_Score * 0.4), maxScore: 40 },
                { category: 'Technical', score: Math.floor(WDT_Score * 0.6), maxScore: 60 }
            ],
            timeTakenMinutes: faker.number.int({ min: 25, max: 58 })
        });
    }

    console.log('Database Seeding Complete! Created demo accounts and 20 full employee networks.');
    
    // Verify seeding
    const userCount = await User.countDocuments();
    console.log(`✓ Verification: ${userCount} users in database`);
    
    if (require.main === module) {
      process.exit(0);
    }

  } catch (err) {
    console.error('Seeding Error:', err);
    if (require.main === module) {
      process.exit(1);
    } else {
      throw err;
    }
  }
};

if (require.main === module) {
  seedDatabase();
} else {
  module.exports = seedDatabase;
}
