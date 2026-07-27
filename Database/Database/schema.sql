CREATE TABLE Service (
  service_id SERIAL PRIMARY key,
  name  VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category VARCHAR(100)
);

CREATE TABLE Inventory (
  item_id SERIAL PRIMARY KEY, 
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  expiration_date DATE 
);

CREATE TABLE Alert(
  alert_id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES Inventory(item_id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  alert_message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()  
);

CREATE TABLE Purchase (
  order_id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES Inventory(item_id) ON DELETE CASCADE,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  quantity INTEGER NOT NULL
);

CREATE TABLE Sale (
  sale_id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES Inventory(item_id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES Service(service_id) on DELETE SET NULL,
  price INTEGER NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sale_amount INTEGER NOT NULL DEFAULT 0
);
