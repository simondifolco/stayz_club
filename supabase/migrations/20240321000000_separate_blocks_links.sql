-- Create new tables
CREATE TABLE hotel_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE hotel_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    block_id UUID NOT NULL REFERENCES hotel_blocks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    link_type TEXT NOT NULL CHECK (link_type IN ('external', 'pdf')),
    url TEXT,
    pdf_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrate existing data
INSERT INTO hotel_blocks (
    id,
    hotel_id,
    title,
    description,
    is_active,
    sort_order,
    created_at,
    updated_at
)
SELECT 
    id,
    hotel_id::UUID,
    title,
    description,
    is_active,
    sort_order,
    created_at,
    updated_at
FROM hotel_items
WHERE item_type = 'block';

INSERT INTO hotel_links (
    id,
    hotel_id,
    block_id,
    title,
    description,
    link_type,
    url,
    pdf_url,
    is_active,
    sort_order,
    created_at,
    updated_at
)
SELECT 
    id,
    hotel_id::UUID,
    parent_id::UUID,
    title,
    description,
    link_type,
    url,
    pdf_url,
    is_active,
    sort_order,
    created_at,
    updated_at
FROM hotel_items
WHERE item_type = 'link';

-- Add RLS policies
ALTER TABLE hotel_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_links ENABLE ROW LEVEL SECURITY;

-- Policies for hotel_blocks
CREATE POLICY "Users can view their own hotel blocks"
    ON hotel_blocks
    FOR SELECT
    USING (
        hotel_id IN (
            SELECT id FROM hotels WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own hotel blocks"
    ON hotel_blocks
    FOR INSERT
    WITH CHECK (
        hotel_id IN (
            SELECT id FROM hotels WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own hotel blocks"
    ON hotel_blocks
    FOR UPDATE
    USING (
        hotel_id IN (
            SELECT id FROM hotels WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        hotel_id IN (
            SELECT id FROM hotels WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own hotel blocks"
    ON hotel_blocks
    FOR DELETE
    USING (
        hotel_id IN (
            SELECT id FROM hotels WHERE user_id = auth.uid()
        )
    );

-- Policies for hotel_links
CREATE POLICY "Users can view their own hotel links"
    ON hotel_links
    FOR SELECT
    USING (
        hotel_id IN (
            SELECT id FROM hotels WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own hotel links"
    ON hotel_links
    FOR INSERT
    WITH CHECK (
        hotel_id IN (
            SELECT id FROM hotels WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own hotel links"
    ON hotel_links
    FOR UPDATE
    USING (
        hotel_id IN (
            SELECT id FROM hotels WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        hotel_id IN (
            SELECT id FROM hotels WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own hotel links"
    ON hotel_links
    FOR DELETE
    USING (
        hotel_id IN (
            SELECT id FROM hotels WHERE user_id = auth.uid()
        )
    );

-- Add indexes for better performance
CREATE INDEX idx_hotel_blocks_hotel_id ON hotel_blocks(hotel_id);
CREATE INDEX idx_hotel_links_hotel_id ON hotel_links(hotel_id);
CREATE INDEX idx_hotel_links_block_id ON hotel_links(block_id);

-- Drop old table after successful migration
DROP TABLE hotel_items; 