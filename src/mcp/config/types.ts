export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string
          // Add other patient fields as needed
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string
        }
      }
      // Add other tables as needed
    }
  }
}
