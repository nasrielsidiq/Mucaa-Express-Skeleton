import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SESPIMA Backend API',
      description: 'API dokumentasi untuk SESPIMA Backend - Sistem Manajemen Tugas Sekolah',
      version: '1.0.0',
      contact: {
        name: 'SESPIMA Team',
        email: 'admin@sespima.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'https://api.sespima.com',
        description: 'Production Server',
      },
      {
        url: 'http://103.172.205.183',
        description: 'Production Server IP',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['students', 'admin', 'teacher', 'director'] },
            phone_number: { type: 'string' },
            address: { type: 'string' },
            birth_date: { type: 'string', format: 'date' },
            is_active: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Director: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            nrp: { type: 'string' },
            position: { type: 'string' },
            unit: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Teacher: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            nrp: { type: 'string' },
            rank: { type: 'string' },
            position: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Group: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            grade: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Student: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nip: { type: 'string' },
            user_id: { type: 'integer' },
            group_id: { type: 'integer' },
            grade: { type: 'string' },
            religion: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            group_name: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            teacher_id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            start_date: { type: 'string', format: 'date' },
            due_date: { type: 'string', format: 'date' },
            start_time: { type: 'string', format: 'time' },
            due_time: { type: 'string', format: 'time' },
            status: { type: 'string', enum: ['pending', 'completed'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        GivedTask: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            task_id: { type: 'integer' },
            student_id: { type: 'integer' },
            filepath: { type: 'string' },
            rates: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'completed'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Grade: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            student_id: { type: 'integer' },
            teacher_id: { type: 'integer' },
            grade_category_id: { type: 'integer' },
            task_id: { type: 'integer' },
            grade: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        GradeCategory: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            category_id: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        LogActivity: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            activity: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: { type: 'object' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.routes.js', './controllers/*.controller.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(swaggerSpec, { explorer: true }));
};

export default swaggerSpec;
