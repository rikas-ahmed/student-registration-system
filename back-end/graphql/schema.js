const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Student {
    id: ID!
    firstName: String
    lastName: String
    email: String
    age: Int
    address: String
    profilePic: String
    marks: [Int]
  }

  type Teacher {
    id: ID!
    firstName: String
    lastName: String
    email: String
    age: Int
    address: String
  }

  type AuthPayload {
    token: String
  }

  type Query {
    students: [Student]
    teachers: [Teacher]
  }

  input StudentInput {
    firstName: String!
    lastName: String!
    email: String!
    age: Int!
    address: String!
    password: String!
  }

  input TeacherInput {
    firstName: String!
    lastName: String!
    email: String!
    age: Int!
    address: String!
    password: String!
  }

  type Mutation {
    registerStudent(input: StudentInput): Student
    loginStudent(email: String!, password: String!): AuthPayload
    registerTeacher(input: TeacherInput): Teacher
    loginTeacher(email: String!, password: String!): AuthPayload
    updateStudent(id: ID!, firstName: String, lastName: String, age: Int, address: String, marks: [Int]): Student
    deleteStudent(id: ID!): String
  }
`);

module.exports = schema;
