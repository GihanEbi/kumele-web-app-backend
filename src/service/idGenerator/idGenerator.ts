import { pool } from "../../config/db";

export async function createId(code: string): Promise<string> {
  const query = `
    INSERT INTO id_codes (code, seq)
    VALUES ($1, 1)
    ON CONFLICT (code) DO UPDATE SET seq = id_codes.seq + 1
    RETURNING seq
  `;

  try {
    const result = await pool.query(query, [code]);
    return `${code}${zeroPad(result.rows[0].seq, 5)}`;
  } catch (error) {
    console.error("Error creating ID:", error);
    throw new Error("Failed to create ID");
  }
}

function zeroPad(num: number, places: number) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}
