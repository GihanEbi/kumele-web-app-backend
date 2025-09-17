import { pool } from "../config/db";

const createUserCartTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS user_cart (
            id VARCHAR(10) PRIMARY KEY,
            user_id VARCHAR(10) NOT NULL,
            product_id VARCHAR(10) NOT NULL,
            quantity INT NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    `;
    try {
        await pool.query(query);
        console.log("User Cart table created successfully");
    } catch (error) {
        console.error("Error creating User Cart table:", error);
    }
};

export default createUserCartTable;
