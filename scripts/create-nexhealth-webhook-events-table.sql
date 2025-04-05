-- Create the nexhealth_webhook_events table for tracking webhook events
CREATE TABLE IF NOT EXISTS nexhealth_webhook_events (
  id SERIAL PRIMARY KEY,
  event_id UUID NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  resource_type VARCHAR(255) NOT NULL,
  resource_id VARCHAR(255) NOT NULL,
  raw_data JSONB,
  status VARCHAR(50) NOT NULL,
  error_message TEXT,
  tenant_id VARCHAR(255) NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_nexhealth_webhook_events_event_id ON nexhealth_webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_nexhealth_webhook_events_resource_id ON nexhealth_webhook_events(resource_id);
CREATE INDEX IF NOT EXISTS idx_nexhealth_webhook_events_status ON nexhealth_webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_nexhealth_webhook_events_tenant_id ON nexhealth_webhook_events(tenant_id);

-- Add a comment to the table
COMMENT ON TABLE nexhealth_webhook_events IS 'Tracks NexHealth webhook events for audit and debugging purposes';

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_nexhealth_webhook_events_updated_at
BEFORE UPDATE ON nexhealth_webhook_events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
