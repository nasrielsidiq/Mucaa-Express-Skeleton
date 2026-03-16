import { initFilesTable } from "./11_files_table.js";
import { initUsersTable } from "./01_users_table.js";
import { initDirectorsTable } from "./02_directors_table.js";
import { initTeachersTable } from "./03_teachers_table.js";
import { initGroupsTable } from "./04_groups_table.js";
import { initStudentsTable } from "./05_students_table.js";
import { initTasksTable } from "./06_tasks_table.js";
import { initGivedTasksTable } from "./07_gived_tasks_table.js";
import { initGradeCategoriesTable } from "./08_grade_categories_table.js";
import { initGradesTable } from "./09_grades_table.js";
import { initLogActivityTable } from "./001_log_activity_table.js";
import { initPerformancesTable } from "./10_performances_table.js";

const initializers = [
    initFilesTable,
    initUsersTable,
    initDirectorsTable,
    initTeachersTable,
    initGroupsTable,
    initStudentsTable,
    initTasksTable,
    initGivedTasksTable,
    initGradeCategoriesTable,
    initGradesTable,
    initLogActivityTable,
    initPerformancesTable,
];

export const runInitializers = async () => {
    console.log("📦 Starting database initialization...");
    try {
        for (const initializer of initializers) {
            await initializer();
        }
        console.log("✨ All initializers completed successfully");
    } catch (error) {
        console.error("❌ Initialization failed:", error);
        throw error;
    }
};
