CREATE TABLE IF NOT EXISTS vineyards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    bush_count INTEGER NOT NULL DEFAULT 0,
    type VARCHAR(50) NOT NULL CHECK (type IN ('открытый грунт', 'теплица')),
    x_position DECIMAL(5,2) NOT NULL,
    y_position DECIMAL(5,2) NOT NULL,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    cat INTEGER NOT NULL DEFAULT 0,
    technical_varieties INTEGER NOT NULL DEFAULT 0,
    table_varieties INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vineyards_location ON vineyards(location);
CREATE INDEX idx_vineyards_type ON vineyards(type);