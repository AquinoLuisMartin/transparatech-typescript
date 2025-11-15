const { pool } = require('../src/config/database');

// Initial seed data for roles and permissions
const seedRolesAndPermissions = async () => {
  try {
    console.log('Seeding roles and permissions...');

    // Define permissions based on your client-side code
    const permissions = [
      // Transparency permissions
      { name: 'view_transparency', display_name: 'View Transparency Data', resource: 'transparency', action: 'read' },
      
      // File permissions
      { name: 'upload_files', display_name: 'Upload Files', resource: 'files', action: 'create' },
      { name: 'approve_files', display_name: 'Approve Files', resource: 'files', action: 'approve' },
      { name: 'download_files', display_name: 'Download Files', resource: 'files', action: 'read' },
      
      // Content management
      { name: 'manage_content', display_name: 'Manage Content', resource: 'content', action: 'manage' },
      
      // Submission permissions
      { name: 'review_submissions', display_name: 'Review Submissions', resource: 'submissions', action: 'review' },
      { name: 'create_submissions', display_name: 'Create Submissions', resource: 'submissions', action: 'create' },
      { name: 'edit_submissions', display_name: 'Edit Submissions', resource: 'submissions', action: 'update' },
      { name: 'delete_submissions', display_name: 'Delete Submissions', resource: 'submissions', action: 'delete' },
      
      // Activity monitoring
      { name: 'monitor_activities', display_name: 'Monitor Activities', resource: 'activities', action: 'read' },
      
      // User management
      { name: 'manage_users', display_name: 'Manage Users', resource: 'users', action: 'manage' },
      { name: 'create_users', display_name: 'Create Users', resource: 'users', action: 'create' },
      { name: 'edit_users', display_name: 'Edit Users', resource: 'users', action: 'update' },
      { name: 'delete_users', display_name: 'Delete Users', resource: 'users', action: 'delete' },
      
      // Organization management
      { name: 'manage_organizations', display_name: 'Manage Organizations', resource: 'organizations', action: 'manage' },
      { name: 'create_organizations', display_name: 'Create Organizations', resource: 'organizations', action: 'create' },
      { name: 'edit_organizations', display_name: 'Edit Organizations', resource: 'organizations', action: 'update' },
      
      // System settings
      { name: 'manage_system_settings', display_name: 'Manage System Settings', resource: 'system', action: 'manage' },
      
      // Analytics
      { name: 'view_analytics', display_name: 'View Analytics', resource: 'analytics', action: 'read' },
      { name: 'export_reports', display_name: 'Export Reports', resource: 'reports', action: 'export' },
      
      // Announcements
      { name: 'create_announcements', display_name: 'Create Announcements', resource: 'announcements', action: 'create' },
      { name: 'manage_announcements', display_name: 'Manage Announcements', resource: 'announcements', action: 'manage' },
      { name: 'view_announcements', display_name: 'View Announcements', resource: 'announcements', action: 'read' },
      
      // Comments and feedback
      { name: 'moderate_comments', display_name: 'Moderate Comments', resource: 'comments', action: 'moderate' },
      { name: 'view_feedback', display_name: 'View Feedback', resource: 'feedback', action: 'read' },
      { name: 'respond_feedback', display_name: 'Respond to Feedback', resource: 'feedback', action: 'respond' }
    ];

    // Insert permissions
    for (const perm of permissions) {
      await pool.query(`
        INSERT INTO permissions (name, display_name, description, resource, action, is_system_permission)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (name) DO NOTHING
      `, [perm.name, perm.display_name, perm.description || '', perm.resource, perm.action]);
    }

    // Define roles based on your client-side code
    const roles = [
      {
        name: 'admin_full',
        display_name: 'Full Administrator',
        description: 'Complete system access and control',
        hierarchy_level: 100,
        permissions: [
          'view_transparency', 'upload_files', 'approve_files', 'download_files', 'manage_content',
          'review_submissions', 'create_submissions', 'edit_submissions', 'delete_submissions',
          'monitor_activities', 'manage_users', 'create_users', 'edit_users', 'delete_users',
          'manage_organizations', 'create_organizations', 'edit_organizations',
          'manage_system_settings', 'view_analytics', 'export_reports',
          'create_announcements', 'manage_announcements', 'view_announcements',
          'moderate_comments', 'view_feedback', 'respond_feedback'
        ]
      },
      {
        name: 'admin_approval',
        display_name: 'Approval Administrator',
        description: 'Document approval and reporting access',
        hierarchy_level: 75,
        permissions: [
          'view_transparency', 'approve_files', 'download_files', 'manage_content',
          'review_submissions', 'monitor_activities', 'view_analytics', 'export_reports',
          'view_announcements', 'moderate_comments', 'view_feedback', 'respond_feedback'
        ]
      },
      {
        name: 'officer',
        display_name: 'Officer',
        description: 'Student organization officers',
        hierarchy_level: 50,
        permissions: [
          'view_transparency', 'upload_files', 'download_files', 'manage_content',
          'create_submissions', 'edit_submissions', 'view_announcements',
          'create_announcements' // Officers can create announcements for their org
        ]
      },
      {
        name: 'viewer',
        display_name: 'Viewer',
        description: 'General users and students',
        hierarchy_level: 25,
        permissions: [
          'view_transparency', 'download_files', 'view_announcements'
        ]
      }
    ];

    // Insert roles and assign permissions
    for (const role of roles) {
      // Insert role
      const roleResult = await pool.query(`
        INSERT INTO roles (name, display_name, description, hierarchy_level, is_system_role, is_active)
        VALUES ($1, $2, $3, $4, true, true)
        ON CONFLICT (name) DO UPDATE SET
          display_name = EXCLUDED.display_name,
          description = EXCLUDED.description,
          hierarchy_level = EXCLUDED.hierarchy_level
        RETURNING id
      `, [role.name, role.display_name, role.description, role.hierarchy_level]);

      const roleId = roleResult.rows[0].id;

      // Assign permissions to role
      for (const permissionName of role.permissions) {
        const permResult = await pool.query('SELECT id FROM permissions WHERE name = $1', [permissionName]);
        if (permResult.rows.length > 0) {
          await pool.query(`
            INSERT INTO role_permissions (role_id, permission_id)
            VALUES ($1, $2)
            ON CONFLICT (role_id, permission_id) DO NOTHING
          `, [roleId, permResult.rows[0].id]);
        }
      }
    }

    console.log('Roles and permissions seeded successfully');
  } catch (error) {
    console.error('Failed to seed roles and permissions:', error);
    throw error;
  }
};

// Seed document categories
const seedDocumentCategories = async () => {
  try {
    console.log('Seeding document categories...');

    const categories = [
      { name: 'Financial Report', icon: 'money', color: '#10B981', description: 'Budget reports, financial statements, and expense reports' },
      { name: 'Receipt', icon: 'receipt', color: '#F59E0B', description: 'Purchase receipts and transaction documents' },
      { name: 'Performance Report', icon: 'chart', color: '#3B82F6', description: 'Performance metrics and achievement reports' },
      { name: 'Purchase Order', icon: 'shopping', color: '#8B5CF6', description: 'Purchase orders and procurement documents' },
      { name: 'Audit Report', icon: 'audit', color: '#EF4444', description: 'Audit findings and compliance reports' },
      { name: 'Administrative', icon: 'admin', color: '#6B7280', description: 'Administrative documents and organizational papers' },
      { name: 'Policy', icon: 'policy', color: '#14B8A6', description: 'Policies, procedures, and guidelines' },
      { name: 'Meeting Minutes', icon: 'meeting', color: '#F97316', description: 'Meeting records and minutes' },
      { name: 'Proposal', icon: 'proposal', color: '#EC4899', description: 'Project proposals and planning documents' },
      { name: 'Certificate', icon: 'certificate', color: '#84CC16', description: 'Certificates and recognition documents' }
    ];

    for (const category of categories) {
      await pool.query(`
        INSERT INTO document_categories (name, description, icon, color, is_active, requires_approval, sort_order)
        VALUES ($1, $2, $3, $4, true, true, 0)
        ON CONFLICT (name) DO NOTHING
      `, [category.name, category.description, category.icon, category.color]);
    }

    console.log('Document categories seeded successfully');
  } catch (error) {
    console.error('Failed to seed document categories:', error);
    throw error;
  }
};

// Seed actual student organizations
const seedOrganizations = async () => {
  try {
    console.log('Seeding student organizations...');

    const organizations = [
      {
        name: 'Alliance of Computer Engineering Students',
        acronym: 'ACES',
        description: 'Organization for computer engineering students',
        contact_email: 'aces@pupsmb.edu.ph',
        president_name: 'TBD',
        adviser_name: 'TBD'
      },
      {
        name: 'Integrated Students in Information Technology Education',
        acronym: 'iSITE',
        description: 'Organization for information technology students',
        contact_email: 'isite@pupsmb.edu.ph',
        president_name: 'TBD',
        adviser_name: 'TBD'
      },
      {
        name: 'Association of Future Teachers',
        acronym: 'AFT',
        description: 'Organization for future education professionals',
        contact_email: 'aft@pupsmb.edu.ph',
        president_name: 'TBD',
        adviser_name: 'TBD'
      },
      {
        name: 'Hospitality Management Society',
        acronym: 'HMSOC',
        description: 'Organization for hospitality management students',
        contact_email: 'hmsoc@pupsmb.edu.ph',
        president_name: 'TBD',
        adviser_name: 'TBD'
      },
      {
        name: 'Chamber of Entrepreneurs and Managers',
        acronym: 'CEM',
        description: 'Organization for entrepreneurship and management students',
        contact_email: 'cem@pupsmb.edu.ph',
        president_name: 'TBD',
        adviser_name: 'TBD'
      },
      {
        name: 'Junior Philippine Institute of Accountancy - Sta Maria',
        acronym: 'JPIA',
        description: 'Organization for accounting students',
        contact_email: 'jpia@pupsmb.edu.ph',
        president_name: 'TBD',
        adviser_name: 'TBD'
      },
      {
        name: 'Diploma in Office Management SY-Quest',
        acronym: 'DOMT',
        description: 'Organization for office management students',
        contact_email: 'domt@pupsmb.edu.ph',
        president_name: 'TBD',
        adviser_name: 'TBD'
      }
    ];

    for (const org of organizations) {
      await pool.query(`
        INSERT INTO organizations (name, acronym, description, contact_email, president_name, adviser_name, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'active')
        ON CONFLICT (acronym) DO NOTHING
      `, [org.name, org.acronym, org.description, org.contact_email, org.president_name, org.adviser_name]);
    }

    console.log('Organizations seeded successfully');
  } catch (error) {
    console.error('Failed to seed organizations:', error);
    throw error;
  }
};

// Seed system settings
const seedSystemSettings = async () => {
  try {
    console.log('Seeding system settings...');

    const settings = [
      { key: 'site_name', value: 'PUPSMB TransparaTech', type: 'string', category: 'general', description: 'Site name displayed in the application' },
      { key: 'max_file_size', value: '52428800', type: 'number', category: 'files', description: 'Maximum file size in bytes (50MB)' },
      { key: 'allowed_file_types', value: '["pdf","doc","docx","xls","xlsx","jpg","jpeg","png"]', type: 'json', category: 'files', description: 'Allowed file types for uploads' },
      { key: 'auto_approval_enabled', value: 'false', type: 'boolean', category: 'submissions', description: 'Enable automatic approval for certain submissions' },
      { key: 'email_notifications_enabled', value: 'true', type: 'boolean', category: 'notifications', description: 'Enable email notifications' },
      { key: 'maintenance_mode', value: 'false', type: 'boolean', category: 'system', description: 'Enable maintenance mode' },
      { key: 'session_timeout_minutes', value: '60', type: 'number', category: 'security', description: 'Session timeout in minutes' },
      { key: 'password_min_length', value: '8', type: 'number', category: 'security', description: 'Minimum password length' },
      { key: 'require_email_verification', value: 'true', type: 'boolean', category: 'security', description: 'Require email verification for new accounts' }
    ];

    for (const setting of settings) {
      await pool.query(`
        INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description, is_system)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (setting_key) DO NOTHING
      `, [setting.key, setting.value, setting.type, setting.category, setting.description]);
    }

    console.log('System settings seeded successfully');
  } catch (error) {
    console.error('Failed to seed system settings:', error);
    throw error;
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...\n');

    await seedRolesAndPermissions();
    await seedDocumentCategories();
    await seedOrganizations();
    await seedSystemSettings();

    console.log('\nDatabase seeding completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Create your first admin user');
    console.log('2. Configure your .env file with proper database credentials');
    console.log('3. Start your server with npm start');
    
    return true;
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
};

// Command line interface
const command = process.argv[2];

if (command === 'seed') {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
} else {
  console.log('Available commands:');
  console.log('  seed - Seed database with initial data');
  process.exit(1);
}

module.exports = {
  seedDatabase,
  seedRolesAndPermissions,
  seedDocumentCategories,
  seedOrganizations,
  seedSystemSettings
};