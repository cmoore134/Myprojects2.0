import pytest
import psycopg2

def get_connection():
    return psycopg2.connect(
        host = 'db.nmikzhnpiukcelaniqrn.supabase.co',
        port = 5432,
        database = 'postgres',
        user = 'postgres',
        password = '/*mMq2!F6gLcHV,'
    )
 
def test_add_inventory_item():
    conn = get_connection()
    cursor = conn.cursor()
    sql = 'INSERT INTO Inventory (name, category, quantity, low_stock_threshold) VALUES (%s, %s, %s, %s) RETURNING item_id, name, quantity'
    cursor.execute(sql, ('Not a real product', 'Coffee', 50, 10))
    result = cursor.fetchone()
    assert result is not None
    assert result[1] == 'Not a real product'
    assert result[2] == 50
    conn.rollback()
    cursor.close()
    conn.close()
