# External Exams Classes API

This document describes the structure and management of external examination classes for the Leaders Tutors platform.

## Overview

The Leaders Tutors External Exams system manages classes for various international and standardized examinations including IGCSE, A-Levels, SAT, IELTS, and more.

## Repository Structure

```
leaders-tutors-external/
├── docs/                           # Documentation
│   ├── EXTERNAL_EXAMS_GUIDE.md    # General guide for external exams
│   ├── CLASS_MANAGEMENT.md         # Class management procedures
│   └── CURRICULUM_TEMPLATES.md     # Curriculum templates
├── schemas/                        # JSON schemas
│   ├── exam-class.json            # Class data structure schema
│   └── student-enrollment.json     # Student enrollment schema
├── examples/                       # Example data
│   ├── sample-classes.json        # Sample class configurations
│   └── sample-enrollments.json     # Sample enrollment records
├── config/                         # Configuration files
│   └── exam-types.json            # Supported exam types configuration
└── README.md                       # This file
```

## Quick Start

### 1. Understanding Exam Classes

Each external exam class is defined by:

- **Exam Type**: The type of examination (IGCSE, A-Level, SAT, etc.)
- **Subject**: The specific subject being taught
- **Schedule**: When and how often the class meets
- **Tutor**: Qualified instructor information
- **Capacity**: Maximum students and current enrollment
- **Fees**: Cost and payment structure

### 2. Creating a New Class

Use the schema defined in `/schemas/exam-class.json` to create a new class. See `/examples/sample-classes.json` for examples.

### 3. Managing Enrollments

Track student enrollments and maintain waitlists when classes reach capacity.

## Supported Exam Types

### International Qualifications

- **IGCSE**: Cambridge and Edexcel boards
- **A-Level**: Cambridge and Edexcel boards
- **IB**: International Baccalaureate programs

### Standardized Tests

- **SAT**: Scholastic Assessment Test
- **ACT**: American College Testing
- **AP**: Advanced Placement

### Language Proficiency

- **IELTS**: International English Language Testing System
- **TOEFL**: Test of English as a Foreign Language

### Graduate Admissions

- **GRE**: Graduate Record Examination
- **GMAT**: Graduate Management Admission Test

## Class Types

1. **Regular Classes**: Ongoing weekly sessions throughout the academic year
2. **Intensive Classes**: More frequent sessions for focused preparation
3. **Crash Courses**: Short-term intensive preparation before exams
4. **One-on-One Tutoring**: Personalized individual instruction

## Documentation

- [External Exams Guide](docs/EXTERNAL_EXAMS_GUIDE.md) - Comprehensive guide to external exams
- [Class Management](docs/CLASS_MANAGEMENT.md) - Procedures for managing classes
- [Curriculum Templates](docs/CURRICULUM_TEMPLATES.md) - Templates for course planning

## Schema Documentation

- [Exam Class Schema](schemas/exam-class.json) - JSON schema for class data structure
- [Student Enrollment Schema](schemas/student-enrollment.json) - JSON schema for enrollment records

## Examples

- [Sample Classes](examples/sample-classes.json) - Example class configurations
- [Sample Enrollments](examples/sample-enrollments.json) - Example enrollment records

## Support

For questions or support:

- Email: support@leaderstutors.com
- Documentation: See `/docs` directory
- Issues: Report via repository issues

## License

© 2026 Leaders Tutors. All rights reserved.
